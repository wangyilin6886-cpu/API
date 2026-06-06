export const config = { runtime: 'edge' }

const B_ENDPOINT = 'https://api.cloudwise.ai/api/v1/messages'

export default async function handler(req: Request): Promise<Response> {
  // CORS preflight — Claude Code SDK may send this
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors() })
  }

  if (req.method !== 'POST') {
    return err(405, 'invalid_request_error', 'Method not allowed')
  }

  // The key the user typed into Claude Code (x-api-key, or Authorization: Bearer).
  // In this passthrough version we forward it straight to B as the B key.
  const userKey =
    req.headers.get('x-api-key') ??
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!userKey) return err(401, 'authentication_error', 'Missing API key')

  const body = await req.text()

  // Forward only Anthropic-protocol headers; pass the user's key through to B
  const fwd: Record<string, string> = {
    'content-type': 'application/json',
    'x-api-key': userKey,
  }
  for (const h of ['anthropic-version', 'anthropic-beta']) {
    const v = req.headers.get(h)
    if (v) fwd[h] = v
  }

  let upstream: Response
  try {
    upstream = await fetch(B_ENDPOINT, { method: 'POST', headers: fwd, body })
  } catch (e) {
    return err(502, 'api_error', `Upstream unreachable: ${e}`)
  }

  // Stream B's response (SSE or JSON) straight back — zero buffering
  const out = new Headers({ 'access-control-allow-origin': '*' })
  const ct = upstream.headers.get('content-type')
  if (ct) out.set('content-type', ct)

  return new Response(upstream.body, { status: upstream.status, headers: out })
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
