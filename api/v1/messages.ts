import { and, eq, isNull } from 'drizzle-orm'
import { db, apiKeys } from '../../db/index.js'
import { hashApiKey } from '../../lib/auth.js'

export const config = { runtime: 'edge' }

const B_ENDPOINT = 'https://api.cloudwise.ai/api/v1/messages'

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors() })
  }
  if (req.method !== 'POST') {
    return err(405, 'invalid_request_error', 'Method not allowed')
  }

  // The user sends OUR key (ek-xxx). Vercel strips Authorization, so clients
  // must use ANTHROPIC_API_KEY which sends x-api-key.
  const userKey =
    req.headers.get('x-api-key') ||
    (req.headers.get('authorization')?.startsWith('Bearer ')
      ? req.headers.get('authorization')!.slice(7)
      : null)
  if (!userKey) return err(401, 'authentication_error', 'Missing API key')

  // Validate the key against our DB and make sure it isn't revoked.
  const hash = await hashApiKey(userKey)
  const rows = await db
    .select({ id: apiKeys.id })
    .from(apiKeys)
    .where(and(eq(apiKeys.keyHash, hash), isNull(apiKeys.revokedAt)))
    .limit(1)
  if (rows.length === 0) {
    return err(401, 'authentication_error', 'Invalid or revoked API key')
  }

  // Swap in B's real upstream key (stored only in the environment).
  const bKey = process.env.B_API_KEY
  if (!bKey) return err(500, 'api_error', 'Upstream key not configured')

  const body = await req.text()
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
    upstream = await fetch(B_ENDPOINT, { method: 'POST', headers: fwd, body })
  } catch (e) {
    return err(502, 'api_error', `Upstream unreachable: ${e}`)
  }

  // Stream B's response (SSE or JSON) straight back — zero buffering.
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
