// TEMPORARY diagnostic probe for the future Codex endpoint.
// Verifies whether the Authorization header survives Vercel's edge layer on
// this exact path before we build the real OpenAI Responses proxy here.
// Echoes header NAMES only (plus a boolean for authorization) — never values.

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  const names = [...req.headers.keys()].sort()
  const auth = req.headers.get('authorization')
  return new Response(
    JSON.stringify(
      {
        probe: 'ecoapi-responses-header-check',
        method: req.method,
        receivedHeaderNames: names,
        hasAuthorization: auth !== null,
        authorizationScheme: auth ? auth.split(' ')[0] : null,
        hasXApiKey: req.headers.get('x-api-key') !== null,
      },
      null,
      2,
    ),
    { status: 200, headers: { 'content-type': 'application/json' } },
  )
}
