import { eq } from 'drizzle-orm'
import { db, users } from '../../db/index.js'
import { verifyToken, json } from '../../lib/auth.js'

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  const auth = req.headers.get('authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return json({ error: '未登录' }, 401)

  const claims = await verifyToken(token)
  if (!claims) return json({ error: 'token 无效或已过期' }, 401)

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      balanceCents: users.balanceCents,
      unlimited: users.unlimited,
      allowedModels: users.allowedModels,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, claims.userId))
    .limit(1)
  const user = rows[0]
  if (!user) return json({ error: '用户不存在' }, 401)

  return json({ user })
}
