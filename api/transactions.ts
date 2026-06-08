import { eq, desc } from 'drizzle-orm'
import { db, transactions } from '../db/index.js'
import { requireAuth, json } from '../lib/auth.js'

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405)

  const claims = await requireAuth(req)
  if (!claims) return json({ error: '未登录' }, 401)

  const rows = await db
    .select({
      id: transactions.id,
      type: transactions.type,
      amountCents: transactions.amountCents,
      createdAt: transactions.createdAt,
    })
    .from(transactions)
    .where(eq(transactions.userId, claims.userId))
    .orderBy(desc(transactions.createdAt))
    .limit(50)

  return json({ transactions: rows })
}
