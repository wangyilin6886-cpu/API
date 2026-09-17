#!/usr/bin/env node
// Streaming probe — tells a slow stream apart from a fake one.
//
// Time-to-first-byte alone cannot: a genuinely slow model and an upstream that
// buffers the whole answer both look like "nothing for N seconds". What
// separates them is the SHAPE of the arrival timeline. A real stream dribbles
// tokens out over the whole wall clock; a buffered one is silent and then
// dumps everything in one burst.
//
// Usage:
//   SUPPLIER_A_KEY=cap_client_... node scripts/probe-stream.mjs supplier-openai
//   SUPPLIER_A_KEY=cap_client_... node scripts/probe-stream.mjs supplier-anthropic
//   ECOAPI_KEY=ek-...           node scripts/probe-stream.mjs gateway-openai
//   ... or `all` to run every target the env has keys for.
//
// Needs Node 18+ (built-in fetch). No dependencies.

const PROMPT = '写一段500字的公司介绍'
const MODEL = process.env.PROBE_MODEL || 'claude-opus-4-8'

const TARGETS = {
  // Supplier A, OpenAI Chat protocol — the path Cline uses and the suspect.
  'supplier-openai': {
    url: 'https://agent-on.com/gateway/v1/chat/completions',
    keyEnv: 'SUPPLIER_A_KEY',
    protocol: 'openai',
    auth: (k) => ({ authorization: `Bearer ${k}` }),
  },
  // Supplier A, Anthropic protocol — the path Claude Code uses, known healthy.
  'supplier-anthropic': {
    url: 'https://agent-on.com/gateway/v1/messages',
    keyEnv: 'SUPPLIER_A_KEY',
    protocol: 'anthropic',
    auth: (k) => ({ 'x-api-key': k, 'anthropic-version': '2023-06-01' }),
  },
  // The same two paths as our customers see them, through our own gateway.
  'gateway-openai': {
    url: 'https://www.ecoapi.ai/v1/chat/completions',
    keyEnv: 'ECOAPI_KEY',
    protocol: 'openai',
    auth: (k) => ({ authorization: `Bearer ${k}` }),
  },
  'gateway-anthropic': {
    url: 'https://www.ecoapi.ai/api/v1/messages',
    keyEnv: 'ECOAPI_KEY',
    protocol: 'anthropic',
    auth: (k) => ({ 'x-api-key': k, 'anthropic-version': '2023-06-01' }),
  },
}

function bodyFor(protocol) {
  return protocol === 'anthropic'
    ? {
        model: MODEL,
        max_tokens: 1024,
        stream: true,
        messages: [{ role: 'user', content: PROMPT }],
      }
    : {
        model: MODEL,
        max_tokens: 1024,
        stream: true,
        stream_options: { include_usage: true },
        messages: [{ role: 'user', content: PROMPT }],
      }
}

// Pull the visible text out of one SSE data payload, whichever protocol it is.
// Used to timestamp the first token the user would actually have seen, which
// is what "responsiveness" means to a client — headers arriving early while
// the body stalls still reads as a hang.
function textDelta(protocol, payload) {
  try {
    const ev = JSON.parse(payload)
    if (protocol === 'anthropic') {
      if (ev.type === 'content_block_delta') return ev.delta?.text || ev.delta?.partial_json || ''
      return ''
    }
    return ev.choices?.[0]?.delta?.content || ''
  } catch {
    return ''
  }
}

async function probe(name) {
  const t = TARGETS[name]
  const key = process.env[t.keyEnv]
  if (!key) throw new Error(`${name}: missing ${t.keyEnv} in the environment`)

  const started = performance.now()
  const since = () => (performance.now() - started) / 1000

  const res = await fetch(t.url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'text/event-stream', ...t.auth(key) },
    body: JSON.stringify(bodyFor(t.protocol)),
  })
  const tHeaders = since()

  // Who produced this response matters as much as what it says. Vercel stamps
  // its own failures; a body we forwarded from the supplier carries neither
  // header, and the firewall's challenge page is HTML rather than an API error
  // at all.
  const vercel = {
    error: res.headers.get('x-vercel-error'),
    id: res.headers.get('x-vercel-id'),
    cache: res.headers.get('x-vercel-cache'),
  }

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => '')
    const challenge = detail.includes('Vercel Security Checkpoint')
    return { name, status: res.status, tHeaders, vercel, challenge, error: detail.slice(0, 600) }
  }

  const decoder = new TextDecoder()
  const arrivals = [] // seconds at which each non-empty chunk landed
  let tFirstByte = null
  let tFirstToken = null
  let tLastToken = null
  let bytes = 0
  let chars = 0
  let buffer = ''

  for await (const chunk of res.body) {
    const at = since()
    if (tFirstByte === null) tFirstByte = at
    bytes += chunk.length
    arrivals.push(at)

    buffer += decoder.decode(chunk, { stream: true })
    let idx
    while ((idx = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, idx).trim()
      buffer = buffer.slice(idx + 1)
      if (!line.startsWith('data:')) continue
      const payload = line.slice(5).trim()
      if (!payload || payload === '[DONE]') continue
      const delta = textDelta(t.protocol, payload)
      if (delta) {
        if (tFirstToken === null) tFirstToken = at
        tLastToken = at
        chars += delta.length
      }
    }
  }

  return {
    name,
    status: res.status,
    vercel,
    contentType: res.headers.get('content-type'),
    tHeaders,
    tFirstByte,
    tFirstToken,
    tLastToken,
    tTotal: since(),
    chunks: arrivals.length,
    bytes,
    chars,
    arrivals,
  }
}

// Two independent questions, which an earlier version of this script ran
// together and so called a plainly real stream "inconclusive":
//
//   SHAPE    does the text arrive over the wall clock, or all at the end?
//   LATENCY  how long until the first token, against Vercel's 25s budget?
//
// A stream can be real and still be far too slow to start, which is exactly
// what supplier A turned out to be doing. Report them separately.
function shape(r) {
  if (r.tFirstToken === null) return 'NO TOKENS — nothing decodable arrived'
  const spread = r.tTotal > 0 ? (r.tLastToken - r.tFirstToken) / r.tTotal : 0
  if (spread > 0.4) return `REAL STREAM — output spread over ${(spread * 100).toFixed(0)}% of the wall clock`
  if (spread < 0.25) return `BUFFERED — the whole answer landed in the last ${(spread * 100).toFixed(0)}% of the wall clock`
  return `UNCLEAR — ${(spread * 100).toFixed(0)}% spread; rerun asking for a longer answer`
}

// Vercel kills an edge function that has produced no byte in 25s. What matters
// is not whether a probe passed but how much room it had left.
function latency(r) {
  if (r.tFirstByte === null) return 'no first byte'
  const left = 25 - r.tFirstByte
  if (r.tFirstByte < 5) return `HEALTHY — first byte at ${r.tFirstByte.toFixed(1)}s`
  if (left > 0) return `AT RISK — first byte at ${r.tFirstByte.toFixed(1)}s, ${left.toFixed(1)}s of the 25s budget left; a busier upstream crosses it`
  return `OVER BUDGET — first byte at ${r.tFirstByte.toFixed(1)}s, past Vercel's 25s cutoff`
}

// Name the party that produced a failure, which the status code alone does not.
function attribute(r) {
  if (r.challenge) {
    return 'OUR VERCEL FIREWALL — a browser challenge page, the request never reached our function'
  }
  if (r.vercel?.error) {
    return `VERCEL — ${r.vercel.error}, our function was cut off before it answered`
  }
  if (r.status >= 500) {
    return 'UPSTREAM — we forwarded the supplier\'s own failure (no x-vercel-error on it)'
  }
  return null
}

function report(r) {
  console.log(`\n=== ${r.name} ===`)
  if (r.vercel?.id) console.log(`  x-vercel-id: ${r.vercel.id}`)
  if (r.error !== undefined) {
    console.log(`  HTTP ${r.status} after ${r.tHeaders.toFixed(2)}s`)
    const who = attribute(r)
    if (who) console.log(`  BLAME: ${who}`)
    console.log(`  body: ${r.challenge ? '(HTML challenge page, suppressed)' : r.error}`)
    return
  }
  console.log(`  HTTP ${r.status}  ${r.contentType || '(no content-type)'}`)
  console.log(`  headers      ${r.tHeaders.toFixed(2)}s`)
  console.log(`  first byte   ${r.tFirstByte.toFixed(2)}s`)
  console.log(`  first token  ${r.tFirstToken === null ? 'never' : r.tFirstToken.toFixed(2) + 's'}`)
  console.log(`  last token   ${r.tLastToken === null ? 'never' : r.tLastToken.toFixed(2) + 's'}`)
  console.log(`  total        ${r.tTotal.toFixed(2)}s`)
  console.log(`  ${r.chunks} chunks / ${r.bytes} bytes / ${r.chars} chars of text`)
  if (r.tFirstToken !== null) {
    const window = r.tLastToken - r.tFirstToken
    console.log(`  output window ${window.toFixed(2)}s (${((window / r.tTotal) * 100).toFixed(0)}% of the wall clock)`)
  }
  console.log(`  SHAPE:   ${shape(r)}`)
  console.log(`  LATENCY: ${latency(r)}`)
}

const requested = process.argv.slice(2)
const names =
  requested.length === 0 || requested[0] === 'all'
    ? Object.keys(TARGETS).filter((n) => process.env[TARGETS[n].keyEnv])
    : requested

if (names.length === 0) {
  console.error('No target selected and no keys in the environment.')
  console.error(`Targets: ${Object.keys(TARGETS).join(', ')}`)
  process.exit(1)
}

for (const name of names) {
  if (!TARGETS[name]) {
    console.error(`Unknown target "${name}". Known: ${Object.keys(TARGETS).join(', ')}`)
    process.exit(1)
  }
  try {
    report(await probe(name))
  } catch (e) {
    console.log(`\n=== ${name} ===\n  FAILED: ${e.message}`)
  }
}
console.log()
