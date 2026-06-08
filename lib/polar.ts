// Verify a Polar webhook signature.
// Returns the parsed event on success, or null if the signature is invalid.
//
// Polar follows the Standard Webhooks header layout (webhook-id / -timestamp /
// -signature) but derives the HMAC key differently from svix: its SDK feeds the
// *raw UTF-8 bytes of the full secret string* (incl. the "polar_whs_" prefix) as
// the key. To be robust we accept either that scheme or the classic svix one
// (strip prefix, base64-decode the rest).

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

function bytesToBase64(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes)
  let bin = ''
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i])
  return btoa(bin)
}

async function hmacBase64(keyBytes: Uint8Array, content: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(content))
  return bytesToBase64(sig)
}

export async function verifyPolarWebhook(
  payload: string,
  headers: Headers,
  secret: string,
): Promise<any | null> {
  const id = headers.get('webhook-id')
  const timestamp = headers.get('webhook-timestamp')
  const sigHeader = headers.get('webhook-signature')
  if (!id || !timestamp || !sigHeader) return null

  try {
    const signedContent = `${id}.${timestamp}.${payload}`

    // Candidate HMAC keys, in order of likelihood for Polar.
    const candidates: Uint8Array[] = []
    // 1) Polar SDK: raw UTF-8 bytes of the full secret string (with prefix).
    candidates.push(new TextEncoder().encode(secret))
    // 2) svix scheme: strip known prefix, base64-decode the remainder.
    let stripped = secret
    if (stripped.startsWith('polar_whs_')) stripped = stripped.slice('polar_whs_'.length)
    else if (stripped.startsWith('whsec_')) stripped = stripped.slice('whsec_'.length)
    try {
      candidates.push(base64ToBytes(stripped))
    } catch {
      // ignore non-base64 secret for this scheme
    }
    // 3) raw UTF-8 bytes of the secret with the prefix stripped.
    candidates.push(new TextEncoder().encode(stripped))

    const provided = sigHeader.split(' ').map((part) => part.split(',')[1])

    for (const keyBytes of candidates) {
      const expected = await hmacBase64(keyBytes, signedContent)
      if (provided.some((v) => v === expected)) {
        return JSON.parse(payload)
      }
    }
    return null
  } catch {
    return null
  }
}
