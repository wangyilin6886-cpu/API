import { eq } from 'drizzle-orm'
import { db, users } from '../../db/index.js'
import { verifyPassword, signToken, json, isValidEmail } from '../../lib/auth.js'

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let body: { email?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const email = body.email?.trim().toLowerCase()
  const password = body.password

  if (!email || !isValidEmail(email)) return json({ error: '邮箱格式不正确' }, 400)
  if (!password) return json({ error: '请输入密码' }, 400)

  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1)
  const user = rows[0]
  if (!user) return json({ error: '邮箱或密码错误' }, 401)

  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) return json({ error: '邮箱或密码错误' }, 401)

  const token = await signToken({ userId: user.id, email: user.email })
  return json({ token, user: { id: user.id, email: user.email } })
}
