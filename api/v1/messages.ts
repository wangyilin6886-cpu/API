import { and, eq, isNull, sql } from 'drizzle-orm'
import { db, apiKeys, users, usageLogs } from '../../db/index.js'
import { hashApiKey } from '../../lib/auth.js'
import { computeCostCents } from '../../lib/pricing.js'
import { isModelAllowed } from '../../lib/modelAccess.js'

export const config = { runtime: 'edge' }

// Supplier A (agent-on) serves both Claude (this endpoint, Anthropic
// protocol) and GPT (api/responses.ts, OpenAI Responses protocol) with a
// single upstream key.
const UPSTREAM = 'https://agent-on.com/gateway/v1/messages'

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors() })
  }
  if (req.method !== 'POST') {
    return err(405, 'invalid_request_error', 'Method not allowed')
  }

  // The user sends OUR key (ek-xxx) — via x-api-key (ANTHROPIC_API_KEY) or
  // Authorization: Bearer, both verified to reach this function.
  const userKey =
    req.headers.get('x-api-key') ||
    (req.headers.get('authorization')?.startsWith('Bearer ')
      ? req.headers.get('authorization')!.slice(7)
      : null)
  if (!userKey) return err(401, 'authentication_error', 'Missing API key')

  // Validate the key against our DB and make sure it isn't revoked.
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

  // Reject when the account is out of credit.
  if (!unlimited && balanceCents <= 0) {
    return err(402, 'billing_error', 'Insufficient balance. Please top up at ecoapi.ai.')
  }

  // Swap in the supplier's real upstream key (stored only in the environment).
  const bKey = process.env.SUPPLIER_A_KEY
  if (!bKey) return err(500, 'api_error', 'Upstream key not configured')

  const body = await req.text()
  const model = parseModel(body)

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

  const fwd: Record<string, string> = {
    'content-type': 'application/json',
    'x-api-key': bKey,
  }
  for (const h of ['anthropic-version', 'anthropic-beta']) {
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

  // On error or empty body, pass through untouched.
  if (!upstream.ok || !upstream.body) {
    return new Response(upstream.body, { status: upstream.status, headers: out })
  }

  // Pass the response through a meter that records token usage when the stream
  // finishes. The DB write happens in flush(), which runs while the function is
  // still alive serving the stream — no waitUntil needed.
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

// TransformStream that forwards every chunk untouched while extracting
// input/output token counts from the Anthropic response (SSE or plain JSON).
function usageMeter(keyId: string, userId: string, model: string, ct: string | null, unlimited: boolean): TransformStream {
  const isSSE = (ct || '').includes('text/event-stream')
  const decoder = new TextDecoder()
  let inputTokens = 0
  let outputTokens = 0
  let buffer = ''

  const scanLine = (raw: string) => {
    const line = raw.trim()
    if (!line.startsWith('data:')) return
    const payload = line.slice(5).trim()
    if (!payload || payload === '[DONE]') return
    try {
      const ev = JSON.parse(payload)
      if (ev.type === 'message_start' && ev.message?.usage) {
        inputTokens = ev.message.usage.input_tokens ?? inputTokens
        outputTokens = ev.message.usage.output_tokens ?? outputTokens
      } else if (ev.type === 'message_delta' && ev.usage) {
        outputTokens = ev.usage.output_tokens ?? outputTokens
      }
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
        // Non-streaming JSON response — the whole body is one object.
        try {
          const j = JSON.parse(buffer)
          if (j.usage) {
            inputTokens = j.usage.input_tokens ?? 0
            outputTokens = j.usage.output_tokens ?? 0
          }
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
    'access-control-allow-headers':
      'content-type, x-api-key, anthropic-version, anthropic-beta, authorization',
  }
}

function err(status: number, type: string, message: string) {
  return new Response(JSON.stringify({ type: 'error', error: { type, message } }), {
    status,
    headers: { 'content-type': 'application/json', ...cors() },
  })
}
