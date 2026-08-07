// Frontend auth helpers — talk to /api/auth/* and persist the JWT in localStorage.

const TOKEN_KEY = 'ecoapi_token'

export interface AuthUser {
  id: string
  email: string
  balanceCents?: number
  /** Internal / test account: never charged, balance not shown. */
  unlimited?: boolean
  /** Models this account may call at all. Null = unrestricted. Set by us, not the user. */
  allowedModels?: string[] | null
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

// Reads the email claim straight out of the JWT payload, no network call.
// This is for display only (e.g. the navbar avatar) — never trust it for
// authorization, the server independently verifies the token's signature.
export function getCurrentEmail(): string | null {
  const token = getToken()
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return typeof json.email === 'string' ? json.email : null
  } catch {
    return null
  }
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
  /** Model ids / family patterns this key may call. Null or empty = unrestricted. */
  allowedModels: string[] | null
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

export async function createKey(
  name: string,
  allowedModels?: string[],
): Promise<{ id: string; name: string; key: string }> {
  const res = await fetch('/api/keys', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ name, allowedModels }),
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

// ---------- Usage stats ----------

export interface KeyUsage {
  keyId: string
  name: string
  keyHint: string
  input: number
  output: number
  tokens: number
}

export interface UsageStats {
  days: number
  totalInput: number
  totalOutput: number
  totalTokens: number
  daily: { day: string; tokens: number }[]
  byModel: { model: string; tokens: number }[]
  /** Active keys only — revoked keys are excluded, so this can sum to less than totalTokens. */
  byKey: KeyUsage[]
}

export async function fetchUsage(days = 7): Promise<UsageStats> {
  const res = await fetch(`/api/usage?days=${days}`, { headers: authHeaders() })
  if (!res.ok) throw new Error('获取用量失败')
  return res.json()
}

// ---------- Billing ----------

export interface Pack {
  id: string
  label: string
  usd: number
}

export interface Transaction {
  id: string
  type: string
  amountCents: number
  createdAt: string
}

export async function fetchPacks(): Promise<Pack[]> {
  const res = await fetch('/api/checkout')
  if (!res.ok) throw new Error('获取套餐失败')
  return (await res.json()).packs
}

export async function startCheckout(pack: string): Promise<string> {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ pack }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || '创建支付失败')
  return data.url
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await fetch('/api/transactions', { headers: authHeaders() })
  if (!res.ok) throw new Error('获取账单失败')
  return (await res.json()).transactions
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
