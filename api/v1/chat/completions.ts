// OpenAI Chat Completions proxy — the endpoint every OpenAI-compatible client
// speaks (Cline, Continue, the OpenAI SDKs). It reaches the whole catalogue:
// both suppliers expose this protocol, so we pick one by model name.
//
// Same mechanics as the other two endpoints (validate ek- key, check balance,
// swap in the supplier key, stream through with metering), plus two wrinkles.
//
// One: this protocol omits token usage from streamed responses unless the
// request opts in via stream_options.include_usage. Clients don't set it, so we
// inject it — without it we'd never bill for a streamed call while still paying
// the supplier for it.
//
// Two: supplier A is slow to first byte here, and Vercel's edge gateway gives a
// function 25 seconds to produce one (after which it may stream for up to 300).
// Answers that needed longer than that got the client a 504 instead of a reply.
//
// One direct measurement had a 500-word answer at 17.51s to first byte and
// 18.80s in total — silence, then everything at once, which looks like they
// buffer rather than stream on this route. That is unconfirmed: a later probe of
// their Anthropic-native endpoint hung for 239s and returned 503, so they also
// have spells of being slow everywhere, and one sample cannot separate the two.
// scripts/probe-stream.mjs settles it once they are healthy.
//
// The mitigation does not depend on which it is. For streaming requests we open
// the SSE response ourselves once a grace period lapses and hold it with comment
// frames, which starts the gateway's clock whatever is slow upstream.

import { and, eq, isNull, sql } from 'drizzle-orm'
import { db, apiKeys, users, usageLogs } from '../../../db/index.js'
import { hashApiKey } from '../../../lib/auth.js'
import { computeCostCents } from '../../../lib/pricing.js'
import { isModelAllowed } from '../../../lib/modelAccess.js'

export const config = { runtime: 'edge' }

// How long we let the upstream answer on its own before we commit to a 200 and
// start holding the connection open. Comfortably past a real stream's first
// token (1-2s) and far short of Vercel's 25s cutoff, so a prompt failure still
// reaches the client as a real HTTP status code rather than an in-stream error.
const FIRST_BYTE_GRACE_MS = 5_000

// Cadence of the comment frames we send while waiting. SSE comments (lines
// starting with ":") are ignored by every conforming parser, including the ones
// in the OpenAI SDKs and the Vercel AI SDK.
const KEEPALIVE_INTERVAL_MS = 10_000

// How long we wait for the upstream's response HEADERS before giving up. Once
// they arrive the body may take as long as it likes — this is not a cap on
// generation time.
//
// Holding the connection open means we now wait as long as the supplier does,
// and they have been observed hanging for 239s before answering 503. Vercel
// cuts a streaming function off at 300s, which would leave the client with a
// truncated stream and nothing explaining it. Stopping first turns that into a
// stated error with time to spare. Override with UPSTREAM_DEADLINE_MS.
const UPSTREAM_DEADLINE_MS = Number(process.env.UPSTREAM_DEADLINE_MS) || 270_000

// Raised when the upstream blew UPSTREAM_DEADLINE_MS, so the three places that
// report a failed call can tell it apart from a connection that never formed.
class UpstreamDeadline extends Error {}

function upstreamFailure(e: unknown): string {
  return e instanceof UpstreamDeadline ? e.message : `Upstream unreachable: ${e}`
}

// Outcome of racing the upstream against the grace timer.
type Raced =
  | { kind: 'response'; response: Response }
  | { kind: 'error'; error: unknown }
  | { kind: 'timeout' }

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

  const { body, stream } = withUsageReporting(raw)

  const fwd: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${supplierKey}`,
  }
  const accept = req.headers.get('accept')
  if (accept) fwd.accept = accept

  const ctl = new AbortController()
  let expired = false
  const deadline = setTimeout(() => {
    expired = true
    ctl.abort()
  }, UPSTREAM_DEADLINE_MS)

  const pending = fetch(route.upstream, {
    method: 'POST',
    headers: fwd,
    body,
    signal: ctl.signal,
  })
    .catch((e) => {
      // An abort surfaces as a bare AbortError, which tells nobody anything.
      if (expired) {
        throw new UpstreamDeadline(
          `Upstream sent no response within ${UPSTREAM_DEADLINE_MS / 1000}s`,
        )
      }
      throw e
    })
    .finally(() => clearTimeout(deadline))

  // Non-streaming callers have nothing to hold open — they are waiting for one
  // complete JSON body either way, so the gateway budget is all they get.
  if (!stream) {
    let upstream: Response
    try {
      upstream = await pending
    } catch (e) {
      return err(502, 'api_error', upstreamFailure(e))
    }
    return forward(upstream, keyId, userId, model, unlimited)
  }

  // Streaming: give the upstream its grace period, and fall back to holding the
  // connection open ourselves if it hasn't answered by then.
  const settled: Raced = await Promise.race([
    pending.then(
      (response): Raced => ({ kind: 'response', response }),
      (error): Raced => ({ kind: 'error', error }),
    ),
    delay(FIRST_BYTE_GRACE_MS).then((): Raced => ({ kind: 'timeout' })),
  ])

  if (settled.kind === 'error') {
    return err(502, 'api_error', upstreamFailure(settled.error))
  }
  if (settled.kind === 'response') {
    return forward(settled.response, keyId, userId, model, unlimited)
  }

  return new Response(holdOpenSSE(pending, keyId, userId, model, unlimited), {
    status: 200,
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      'access-control-allow-origin': '*',
    },
  })
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// The original pass-through: real status code, upstream's content-type, body
// metered on its way to the client.
function forward(
  upstream: Response,
  keyId: string,
  userId: string,
  model: string,
  unlimited: boolean,
): Response {
  const out = new Headers({ 'access-control-allow-origin': '*' })
  const ct = upstream.headers.get('content-type')
  if (ct) out.set('content-type', ct)

  if (!upstream.ok || !upstream.body) {
    return new Response(upstream.body, { status: upstream.status, headers: out })
  }

  const metered = upstream.body.pipeThrough(usageMeter(keyId, userId, model, ct, unlimited))
  return new Response(metered, { status: upstream.status, headers: out })
}

// Emits a byte immediately — which is the whole point, it starts Vercel's
// stream clock — then comment frames until the upstream produces something,
// then the upstream's own bytes.
//
// The cost of committing early is that we have already promised HTTP 200 by the
// time a late upstream failure arrives, so those surface as an in-stream error
// frame instead of a status code. That only applies to failures slower than the
// grace period; fast rejections (401, 403, 400) still come back as themselves.
function holdOpenSSE(
  pending: Promise<Response>,
  keyId: string,
  userId: string,
  model: string,
  unlimited: boolean,
): ReadableStream<Uint8Array> {
  const enc = new TextEncoder()
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>()
  const writer = writable.getWriter()

  // Fire-and-forget: a client that has already hung up makes these reject, and
  // there is nothing useful to do about that beyond stopping.
  const push = (s: string) => writer.write(enc.encode(s)).catch(() => {})

  push(': ecoapi connected\n\n')
  const beat = setInterval(() => push(': ecoapi waiting for upstream\n\n'), KEEPALIVE_INTERVAL_MS)

  const drain = async () => {
    let upstream: Response
    try {
      upstream = await pending
    } catch (e) {
      clearInterval(beat)
      push(sseError('api_error', upstreamFailure(e)))
      await writer.close().catch(() => {})
      return
    }
    clearInterval(beat)

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '')
      push(sseError('api_error', `Upstream ${upstream.status}: ${detail.slice(0, 500)}`))
      await writer.close().catch(() => {})
      return
    }
    if (!upstream.body) {
      push(sseError('api_error', `Upstream ${upstream.status} returned no body`))
      await writer.close().catch(() => {})
      return
    }

    const ct = upstream.headers.get('content-type') || ''

    // The upstream ignored `stream: true` and sent one complete JSON body. We
    // are already framed as SSE, so re-frame it as a single chunk rather than
    // handing the client a shape its parser cannot read.
    if (!ct.includes('text/event-stream')) {
      const text = await upstream.text().catch(() => '')
      push(reframeAsChunk(text, model))
      push('data: [DONE]\n\n')
      // Bill before closing, the way usageMeter's flush() does: once the
      // response ends the runtime is free to tear the function down, and a
      // write started after that point is a call we served but never charged.
      const usage = parseUsage(text)
      if (usage) await recordUsage(keyId, userId, model, unlimited, usage.input, usage.output)
      await writer.close().catch(() => {})
      return
    }

    writer.releaseLock()
    await upstream.body
      .pipeThrough(usageMeter(keyId, userId, model, ct, unlimited))
      .pipeTo(writable)
      .catch(() => {})
  }

  void drain()
  return readable
}

// OpenAI reports mid-stream failures as a data frame carrying `error` and then
// closes without [DONE]; clients treat a missing [DONE] as a failed stream,
// which is exactly what this is.
function sseError(type: string, message: string): string {
  return `data: ${JSON.stringify({ error: { type, message } })}\n\n`
}

// Turn a complete chat.completion into the one chat.completion.chunk a
// streaming client expects.
function reframeAsChunk(text: string, model: string): string {
  let obj: any
  try {
    obj = JSON.parse(text)
  } catch {
    return sseError('api_error', `Upstream sent an unreadable body: ${text.slice(0, 500)}`)
  }
  if (obj?.error) {
    return `data: ${JSON.stringify({ error: obj.error })}\n\n`
  }
  const choice = obj?.choices?.[0]
  const delta: Record<string, unknown> = { role: 'assistant', content: choice?.message?.content ?? '' }
  if (choice?.message?.tool_calls) delta.tool_calls = choice.message.tool_calls
  const chunk = {
    id: obj?.id ?? 'chatcmpl-ecoapi',
    object: 'chat.completion.chunk',
    created: obj?.created ?? Math.floor(Date.now() / 1000),
    model: obj?.model ?? model,
    choices: [{ index: 0, delta, finish_reason: choice?.finish_reason ?? 'stop' }],
    ...(obj?.usage ? { usage: obj.usage } : {}),
  }
  return `data: ${JSON.stringify(chunk)}\n\n`
}

function parseUsage(text: string): { input: number; output: number } | null {
  try {
    const u = JSON.parse(text)?.usage
    if (!u) return null
    return { input: u.prompt_tokens ?? u.input_tokens ?? 0, output: u.completion_tokens ?? u.output_tokens ?? 0 }
  } catch {
    return null
  }
}

function parseModel(body: string): string {
  try {
    return (JSON.parse(body).model as string) || 'unknown'
  } catch {
    return 'unknown'
  }
}

// Ask the upstream to report token usage on streamed responses, and tell the
// caller whether this is a streaming request at all. Only touches a streaming
// request that hasn't already opted in; anything unparseable is forwarded
// byte-for-byte.
function withUsageReporting(raw: string): { body: string; stream: boolean } {
  try {
    const obj = JSON.parse(raw)
    const stream = obj?.stream === true
    if (stream && obj?.stream_options?.include_usage !== true) {
      obj.stream_options = { ...obj.stream_options, include_usage: true }
      return { body: JSON.stringify(obj), stream }
    }
    return { body: raw, stream }
  } catch {
    // not JSON — leave it alone and let the upstream reject it
    return { body: raw, stream: false }
  }
}

async function recordUsage(
  keyId: string,
  userId: string,
  model: string,
  unlimited: boolean,
  inputTokens: number,
  outputTokens: number,
): Promise<void> {
  if (inputTokens <= 0 && outputTokens <= 0) return
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
      await recordUsage(keyId, userId, model, unlimited, inputTokens, outputTokens)
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
