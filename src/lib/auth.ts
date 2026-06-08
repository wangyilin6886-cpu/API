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

// ---------- API key management ----------

export interface ApiKey {
  id: string
  keyHint: string
  name: string
  createdAt: string
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { authorization: `Bearer ${token}` } : {}
}

export async function listKeys(): Promise<ApiKey[]> {
  const res = await fetch('/api/keys', { headers: authHeaders() })
  if (!res.ok) throw new Error('获取 key 列表失败')
  const data = await res.json()
  return data.keys
}

export async function createKey(name: string): Promise<{ id: string; name: string; key: string }> {
  const res = await fetch('/api/keys', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ name }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || '创建 key 失败')
  return data
}

export async function revokeKey(id: string): Promise<void> {
  const res = await fetch(`/api/keys?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || '撤销 key 失败')
  }
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
