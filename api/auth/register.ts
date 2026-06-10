import { eq } from 'drizzle-orm'
import { db, users } from '../../db/index.js'
import { hashPassword, signToken, json, isValidEmail } from '../../lib/auth.js'

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
  if (!password || password.length < 8) return json({ error: '密码至少 8 位' }, 400)

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (existing.length > 0) return json({ error: '该邮箱已注册' }, 409)

  const id = crypto.randomUUID()
  const passwordHash = await hashPassword(password)
  await db.insert(users).values({ id, email, passwordHash })

  const token = await signToken({ userId: id, email })
  return json({ token, user: { id, email } }, 201)
}
