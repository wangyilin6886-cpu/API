// OpenAI Chat Completions proxy — the endpoint every OpenAI-compatible client
// speaks (Cline, Continue, the OpenAI SDKs). It reaches the whole catalogue:
// both suppliers expose this protocol, so we pick one by model name.
//
// Same mechanics as the other two endpoints (validate ek- key, check balance,
// swap in the supplier key, stream through with metering), plus one wrinkle:
// this protocol omits token usage from streamed responses unless the request
// opts in via stream_options.include_usage. Clients don't set it, so we inject
// it — without it we'd never bill for a streamed call while still paying the
// supplier for it.

import { and, eq, isNull, sql } from 'drizzle-orm'
import { db, apiKeys, users, usageLogs } from '../../../db/index.js'
import { hashApiKey } from '../../../lib/auth.js'
import { computeCostCents } from '../../../lib/pricing.js'
import { isModelAllowed } from '../../../lib/modelAccess.js'

export const config = { runtime: 'edge' }

// Supplier A carries Claude and GPT; everything else (Gemini, DeepSeek, Qwen)
// comes from supplier B.
const ROUTE_A = {
  upstream: 'https://agent-on.com/gateway/v1/chat/completions',
  supplier: 'A' as const,
}
const ROUTE_B = {
  upstream: 'https://api.rezeai.com/v1/chat/completions',
  supplier: 'B' as const,
}

function routeFor(model: string) {
  const m = model.toLowerCase()
  return m.startsWith('claude') || m.startsWith('gpt') ? ROUTE_A : ROUTE_B
}

// Read the env vars by literal name — bundlers inline process.env.FOO
// statically, so a computed lookup can come back undefined at runtime.
function keyFor(supplier: 'A' | 'B'): string | undefined {
  return supplier === 'A' ? process.env.SUPPLIER_A_KEY : process.env.SUPPLIER_B_KEY
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors() })
  }
  if (req.method !== 'POST') {
    return err(405, 'invalid_request_error', 'Method not allowed')
  }

  const auth = req.headers.get('authorization')
  const userKey = auth?.startsWith('Bearer ')
    ? auth.slice(7)
    : req.headers.get('x-api-key')
  if (!userKey) return err(401, 'authentication_error', 'Missing API key')

  const hash = await hashApiKey(userKey)
  const rows = await db
    .select({
      id: apiKeys.id,
      userId: apiKeys.userId,
      balanceCents: users.balanceCents,
      allowedModels: apiKeys.allowedModels,
      unlimited: users.unlimited,
      accountModels: users.allowedModels,
    })
    .from(apiKeys)
    .innerJoin(users, eq(apiKeys.userId, users.id))
    .where(and(eq(apiKeys.keyHash, hash), isNull(apiKeys.revokedAt)))
    .limit(1)
  if (rows.length === 0) {
    return err(401, 'authentication_error', 'Invalid or revoked API key')
  }
  const { id: keyId, userId, balanceCents, allowedModels, unlimited, accountModels } = rows[0]

  if (!unlimited && balanceCents <= 0) {
    return err(402, 'billing_error', 'Insufficient balance. Please top up at ecoapi.ai.')
  }

  const raw = await req.text()
  const model = parseModel(raw)

  // Account ceiling first — a customer can't lift this one, so say so plainly
  // rather than letting them fiddle with key scopes that will never help.
  // Unlimited (internal) accounts are exempt.
  if (!unlimited && !isModelAllowed(model, accountModels)) {
    return err(
      403,
      'permission_error',
      `Your account is not enabled for "${model}". Contact support to add it. ` +
        `Enabled: ${accountModels!.join(', ')}`,
    )
  }

  // Then the scope the customer set on this particular key.
  if (!isModelAllowed(model, allowedModels)) {
    return err(
      403,
      'permission_error',
      `This API key is not permitted to use "${model}". ` +
        `Allowed: ${allowedModels!.join(', ')}. Create a new key to change this.`,
    )
  }

  // Which supplier serves this model decides both the upstream and the key.
  const route = routeFor(model)
  const supplierKey = keyFor(route.supplier)
  if (!supplierKey) return err(500, 'api_error', 'Upstream key not configured')

  const body = withUsageReporting(raw)

  const fwd: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${supplierKey}`,
  }
  const accept = req.headers.get('accept')
  if (accept) fwd.accept = accept

  let upstream: Response
  try {
    upstream = await fetch(route.upstream, { method: 'POST', headers: fwd, body })
  } catch (e) {
    return err(502, 'api_error', `Upstream unreachable: ${e}`)
  }

  const out = new Headers({ 'access-control-allow-origin': '*' })
  const ct = upstream.headers.get('content-type')
  if (ct) out.set('content-type', ct)

  if (!upstream.ok || !upstream.body) {
    return new Response(upstream.body, { status: upstream.status, headers: out })
  }

  const metered = upstream.body.pipeThrough(usageMeter(keyId, userId, model, ct, unlimited))
  return new Response(metered, { status: upstream.status, headers: out })
}

function parseModel(body: string): string {
  try {
    return (JSON.parse(body).model as string) || 'unknown'
  } catch {
    return 'unknown'
  }
}

// Ask the upstream to report token usage on streamed responses. Only touches
// a streaming request that hasn't already opted in; anything unparseable is
// forwarded byte-for-byte.
function withUsageReporting(raw: string): string {
  try {
    const obj = JSON.parse(raw)
    if (obj?.stream === true && obj?.stream_options?.include_usage !== true) {
      obj.stream_options = { ...obj.stream_options, include_usage: true }
      return JSON.stringify(obj)
    }
  } catch {
    // not JSON — leave it alone and let the upstream reject it
  }
  return raw
}

// Forwards every chunk untouched while reading usage from the OpenAI Chat
// Completions format. Streaming: the final chunk carries `usage` (earlier
// chunks send `usage: null`). Non-streaming: top-level `usage`.
function usageMeter(keyId: string, userId: string, model: string, ct: string | null, unlimited: boolean): TransformStream {
  const isSSE = (ct || '').includes('text/event-stream')
  const decoder = new TextDecoder()
  let inputTokens = 0
  let outputTokens = 0
  let buffer = ''

  const readUsage = (obj: any) => {
    const usage = obj?.usage
    if (!usage) return
    inputTokens = usage.prompt_tokens ?? usage.input_tokens ?? inputTokens
    outputTokens = usage.completion_tokens ?? usage.output_tokens ?? outputTokens
  }

  const scanLine = (line: string) => {
    const t = line.trim()
    if (!t.startsWith('data:')) return
    const payload = t.slice(5).trim()
    if (!payload || payload === '[DONE]') return
    try {
      readUsage(JSON.parse(payload))
    } catch {
      // partial / non-JSON line, ignore
    }
  }

  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk)
      buffer += decoder.decode(chunk, { stream: true })
      if (isSSE) {
        let idx: number
        while ((idx = buffer.indexOf('\n')) !== -1) {
          scanLine(buffer.slice(0, idx))
          buffer = buffer.slice(idx + 1)
        }
      }
    },
    async flush() {
      if (isSSE) {
        scanLine(buffer)
      } else {
        try {
          readUsage(JSON.parse(buffer))
        } catch {
          // ignore
        }
      }
      if (inputTokens > 0 || outputTokens > 0) {
        const costCents = computeCostCents(model, inputTokens, outputTokens)
        try {
          await db.insert(usageLogs).values({ keyId, model, inputTokens, outputTokens, costCents })
          if (costCents > 0 && !unlimited) {
            await db
              .update(users)
              .set({ balanceCents: sql`${users.balanceCents} - ${costCents}` })
              .where(eq(users.id, userId))
          }
        } catch {
          // never fail the user's request because logging failed
        }
      }
    },
  })
}

function cors() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type, authorization, x-api-key, accept',
  }
}

function err(status: number, type: string, message: string) {
  return new Response(JSON.stringify({ type: 'error', error: { type, message } }), {
    status,
    headers: { 'content-type': 'application/json', ...cors() },
  })
}
