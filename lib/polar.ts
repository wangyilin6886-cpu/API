// Verify a Polar webhook using the Standard Webhooks (svix) scheme.
// Returns the parsed event on success, or null if the signature is invalid.

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
    // Polar secrets are prefixed ("polar_whs_" or the svix "whsec_"); the rest is base64.
    let rawSecret = secret
    if (rawSecret.startsWith('polar_whs_')) rawSecret = rawSecret.slice('polar_whs_'.length)
    else if (rawSecret.startsWith('whsec_')) rawSecret = rawSecret.slice('whsec_'.length)
    const keyBytes = base64ToBytes(rawSecret)

    const key = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    )
    const signedContent = `${id}.${timestamp}.${payload}`
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedContent))
    const expected = bytesToBase64(sig)

    // Header is space-separated "v1,<sig>" entries; any match passes.
    const ok = sigHeader.split(' ').some((part) => {
      const [, value] = part.split(',')
      return value === expected
    })
    if (!ok) return null

    return JSON.parse(payload)
  } catch {
    return null
  }
}
