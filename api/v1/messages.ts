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

  // DIAGNOSTIC: dump every header name we actually receive, so we can see
  // whether Vercel/Claude Code is delivering the auth header at all.
  const received: string[] = []
  req.headers.forEach((_v, k) => received.push(k))
  console.log('[ecoapi-proxy] received headers:', received.join(', '))

  // Forward the user's auth exactly as received. The user's key IS B's key in
  // this passthrough version, so we must not convert between x-api-key and
  // Authorization: Bearer — B only accepts the same form the user sent direct.
  const xApiKey = req.headers.get('x-api-key')
  const auth = req.headers.get('authorization')
  if (!xApiKey && !auth) {
    return err(
      401,
      'authentication_error',
      `Missing API key. Headers received by proxy: [${received.join(', ')}]`,
    )
  }

  const body = await req.text()

  // Forward only Anthropic-protocol headers; pass auth through verbatim
  const fwd: Record<string, string> = { 'content-type': 'application/json' }
  if (xApiKey) fwd['x-api-key'] = xApiKey
  if (auth) fwd['authorization'] = auth
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
