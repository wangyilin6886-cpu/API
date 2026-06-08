import { SignJWT, jwtVerify } from 'jose'

// ---------- Password hashing (Web Crypto PBKDF2, Edge-compatible) ----------

const ITERATIONS = 100_000
const KEY_LEN = 256 // bits

function toHex(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return bytes
}

async function derive(password: string, salt: Uint8Array): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    key,
    KEY_LEN,
  )
  return toHex(bits)
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hash = await derive(password, salt)
  return `${toHex(salt)}:${hash}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false
  const candidate = await derive(password, fromHex(saltHex))
  // constant-time-ish compare
  if (candidate.length !== hashHex.length) return false
  let diff = 0
  for (let i = 0; i < candidate.length; i++) {
    diff |= candidate.charCodeAt(i) ^ hashHex.charCodeAt(i)
  }
  return diff === 0
}

// ---------- JWT (jose, HS256) ----------

function secret(): Uint8Array {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET environment variable is not set')
  return new TextEncoder().encode(s)
}

export async function signToken(payload: { userId: string; email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret())
}

export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret())
    return { userId: payload.userId as string, email: payload.email as string }
  } catch {
    return null
  }
}

// ---------- HTTP helpers ----------

export function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', ...extraHeaders },
  })
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
