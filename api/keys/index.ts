import { and, eq, isNull, desc } from 'drizzle-orm'
import { db, apiKeys, users } from '../../db/index.js'
import {
  requireAuth,
  generateApiKey,
  hashApiKey,
  keyHint,
  json,
} from '../../lib/auth.js'
import { isPatternWithinScope } from '../../lib/modelAccess.js'

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  const claims = await requireAuth(req)
  if (!claims) return json({ error: '未登录' }, 401)

  // ---- List the user's active keys ----
  if (req.method === 'GET') {
    const rows = await db
      .select({
        id: apiKeys.id,
        keyHint: apiKeys.keyHint,
        name: apiKeys.name,
        allowedModels: apiKeys.allowedModels,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .where(and(eq(apiKeys.userId, claims.userId), isNull(apiKeys.revokedAt)))
      .orderBy(desc(apiKeys.createdAt))
    return json({ keys: rows })
  }

  // ---- Create a new key (plaintext returned ONCE) ----
  if (req.method === 'POST') {
    let body: { name?: string; allowedModels?: unknown } = {}
    try {
      body = await req.json()
    } catch {
      // empty body is fine
    }
    const name = (body.name?.trim() || 'Default').slice(0, 40)

    // Optional model restriction. Omitted / empty means unrestricted, which is
    // stored as NULL so the proxy can skip the check entirely.
    let allowedModels: string[] | null = null
    if (Array.isArray(body.allowedModels)) {
      const cleaned = body.allowedModels
        .filter((m): m is string => typeof m === 'string')
        .map((m) => m.trim().slice(0, 80))
        .filter(Boolean)
      const unique = [...new Set(cleaned)]
      if (unique.length > 100) return json({ error: '模型限制最多 100 项' }, 400)
      if (unique.length > 0) allowedModels = unique
    }

    // A key can only narrow the account's ceiling, never reach past it —
    // otherwise we'd hand out a key that can never make a successful call.
    if (allowedModels) {
      const [acct] = await db
        .select({ allowedModels: users.allowedModels })
        .from(users)
        .where(eq(users.id, claims.userId))
        .limit(1)
      const outside = allowedModels.filter((m) => !isPatternWithinScope(m, acct?.allowedModels))
      if (outside.length > 0) {
        return json(
          { error: `你的账号未开通以下模型，无法用于密钥：${outside.join(', ')}` },
          400,
        )
      }
    }

    const key = generateApiKey()
    const id = crypto.randomUUID()
    await db.insert(apiKeys).values({
      id,
      userId: claims.userId,
      keyHash: await hashApiKey(key),
      keyHint: keyHint(key),
      name,
      allowedModels,
    })

    // key is shown only here — never retrievable again
    return json({ id, name, key, allowedModels }, 201)
  }

  // ---- Revoke a key: DELETE /api/keys?id=xxx ----
  if (req.method === 'DELETE') {
    const id = new URL(req.url).searchParams.get('id')
    if (!id) return json({ error: '缺少 key id' }, 400)
    const result = await db
      .update(apiKeys)
      .set({ revokedAt: new Date() })
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, claims.userId), isNull(apiKeys.revokedAt)))
      .returning({ id: apiKeys.id })
    if (result.length === 0) return json({ error: 'key 不存在或已撤销' }, 404)
    return json({ ok: true })
  }

  return json({ error: 'Method not allowed' }, 405)
}
