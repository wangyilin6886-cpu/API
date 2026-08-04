// OpenAI Responses API proxy — the endpoint Codex talks to.
// Codex config: base_url = 'https://ecoapi.ai/api', wire_api = 'responses'
// → it POSTs to {base}/responses, i.e. this function.
//
// Same core mechanics as api/v1/messages.ts (validate ek- key, check balance,
// swap in the supplier key, stream through with metering), but speaking the
// OpenAI Responses protocol: auth arrives as "Authorization: Bearer ek-…"
// (verified live: the header does reach this path) and token usage is read
// from the `response.completed` SSE event / the final JSON body.

import { and, eq, isNull, sql } from 'drizzle-orm'
import { db, apiKeys, users, usageLogs } from '../db/index.js'
import { hashApiKey } from '../lib/auth.js'
import { computeCostCents } from '../lib/pricing.js'
import { isModelAllowed } from '../lib/modelAccess.js'

export const config = { runtime: 'edge' }

const UPSTREAM = 'https://agent-on.com/gateway/responses'

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
    })
    .from(apiKeys)
    .innerJoin(users, eq(apiKeys.userId, users.id))
    .where(and(eq(apiKeys.keyHash, hash), isNull(apiKeys.revokedAt)))
    .limit(1)
  if (rows.length === 0) {
    return err(401, 'authentication_error', 'Invalid or revoked API key')
  }
  const { id: keyId, userId, balanceCents, allowedModels, unlimited } = rows[0]

  if (!unlimited && balanceCents <= 0) {
    return err(402, 'billing_error', 'Insufficient balance. Please top up at ecoapi.ai.')
  }

  const supplierKey = process.env.SUPPLIER_A_KEY
  if (!supplierKey) return err(500, 'api_error', 'Upstream key not configured')

  const body = await req.text()
  const model = parseModel(body)

  if (!isModelAllowed(model, allowedModels)) {
    return err(
      403,
      'permission_error',
      `This API key is not permitted to use "${model}". Allowed: ${allowedModels!.join(', ')}`,
    )
  }

  const fwd: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${supplierKey}`,
  }
  for (const h of ['accept', 'openai-beta']) {
    const v = req.headers.get(h)
    if (v) fwd[h] = v
  }

  let upstream: Response
  try {
    upstream = await fetch(UPSTREAM, { method: 'POST', headers: fwd, body })
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

// Forwards every chunk untouched while extracting token usage from the
// OpenAI Responses protocol. Streaming: usage lives on the
// `response.completed` event's response.usage. Non-streaming: top-level usage.
function usageMeter(keyId: string, userId: string, model: string, ct: string | null, unlimited: boolean): TransformStream {
  const isSSE = (ct || '').includes('text/event-stream')
  const decoder = new TextDecoder()
  let inputTokens = 0
  let outputTokens = 0
  let buffer = ''

  const readUsage = (obj: any) => {
    const usage = obj?.response?.usage ?? obj?.usage
    if (!usage) return
    inputTokens = usage.input_tokens ?? usage.prompt_tokens ?? inputTokens
    outputTokens = usage.output_tokens ?? usage.completion_tokens ?? outputTokens
  }

  const scanLine = (raw: string) => {
    const line = raw.trim()
    if (!line.startsWith('data:')) return
    const payload = line.slice(5).trim()
    if (!payload || payload === '[DONE]') return
    try {
      const ev = JSON.parse(payload)
      // usage appears on response.completed (and some providers also attach
      // partials elsewhere) — readUsage keeps whatever it finds last.
      readUsage(ev)
    } catch {
      // partial / non-JSON line, ignore
    }
  }

  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk)
      const text = decoder.decode(chunk, { stream: true })
      buffer += text
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
    'access-control-allow-headers': 'content-type, authorization, x-api-key, openai-beta, accept',
  }
}

function err(status: number, type: string, message: string) {
  return new Response(JSON.stringify({ type: 'error', error: { type, message } }), {
    status,
    headers: { 'content-type': 'application/json', ...cors() },
  })
}
