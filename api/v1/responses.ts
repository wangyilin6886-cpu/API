// Alias so both {base}/responses and {base}/v1/responses reach the same
// proxy — Codex's path convention varies by version, and an unmatched path
// would otherwise fall through vercel.json's catch-all and return the SPA
// HTML shell (HTTP 200) instead of an API response.
export { default, config } from '../responses.js'
