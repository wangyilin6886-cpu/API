import { eq, sql } from 'drizzle-orm'
import { db, users, transactions } from '../../db/index.js'
import { verifyPolarWebhook } from '../../lib/polar.js'

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const secret = process.env.POLAR_WEBHOOK_SECRET
  if (!secret) return new Response('Webhook not configured', { status: 500 })

  const payload = await req.text()
  const event = await verifyPolarWebhook(payload, req.headers, secret)
  if (!event) return new Response('Invalid signature', { status: 401 })

  // Only act on a paid order.
  const isPaid =
    event.type === 'order.paid' ||
    event.data?.status === 'paid' ||
    event.data?.paid === true
  if (!isPaid) return new Response('ignored', { status: 200 })

  const order = event.data || {}
  const orderId: string | undefined = order.id
  const userId: string | undefined =
    order.customer?.external_id || order.metadata?.userId || order.customer_external_id
  const creditCents: number =
    order.net_amount ?? order.amount ?? order.total_amount ?? 0

  if (!orderId || !userId || creditCents <= 0) {
    return new Response('missing fields', { status: 200 })
  }

  // Idempotent: the unique polar_order_id blocks double-crediting on retries.
  const inserted = await db
    .insert(transactions)
    .values({
      id: crypto.randomUUID(),
      userId,
      type: 'topup',
      amountCents: creditCents,
      polarOrderId: orderId,
    })
    .onConflictDoNothing({ target: transactions.polarOrderId })
    .returning({ id: transactions.id })

  if (inserted.length > 0) {
    await db
      .update(users)
      .set({ balanceCents: sql`${users.balanceCents} + ${creditCents}` })
      .where(eq(users.id, userId))
  }

  return new Response('ok', { status: 200 })
}
