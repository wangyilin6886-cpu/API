// Frontend auth helpers — talk to /api/auth/* and persist the JWT in localStorage.

const TOKEN_KEY = 'ecoapi_token'

export interface AuthUser {
  id: string
  email: string
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

async function post(path: string, body: unknown): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || '请求失败，请稍后再试')
  return data
}

export async function register(email: string, password: string) {
  const data = await post('/api/auth/register', { email, password })
  setToken(data.token)
  return data
}

export async function login(email: string, password: string) {
  const data = await post('/api/auth/login', { email, password })
  setToken(data.token)
  return data
}

export async function fetchMe(): Promise<AuthUser | null> {
  const token = getToken()
  if (!token) return null
  const res = await fetch('/api/auth/me', {
    headers: { authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    clearToken()
    return null
  }
  const data = await res.json()
  return data.user
}
