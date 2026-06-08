import { requireAuth, json } from '../lib/auth.js'

export const config = { runtime: 'edge' }

// Allowed top-up products (Polar product IDs). Credit granted = amount paid,
// derived from the order in the webhook, so we only need the product id here.
const PRODUCTS: Record<string, { productId: string; label: string; usd: number }> = {
  starter: { productId: '4aaa2c61-0dfb-444b-90b0-bf5c138df236', label: 'Starter Pack', usd: 10 },
}

const POLAR_API_BASE = process.env.POLAR_API_BASE || 'https://api.polar.sh'

export default async function handler(req: Request): Promise<Response> {
  // Expose the available packs for the Recharge UI.
  if (req.method === 'GET') {
    return json({
      packs: Object.entries(PRODUCTS).map(([id, p]) => ({ id, label: p.label, usd: p.usd })),
    })
  }

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const claims = await requireAuth(req)
  if (!claims) return json({ error: '未登录' }, 401)

  let body: { pack?: string } = {}
  try {
    body = await req.json()
  } catch {
    // ignore
  }
  const pack = PRODUCTS[body.pack || 'starter']
  if (!pack) return json({ error: '充值套餐不存在' }, 400)

  const token = process.env.POLAR_ACCESS_TOKEN
  if (!token) return json({ error: 'Polar not configured' }, 500)

  const origin = new URL(req.url).origin

  const res = await fetch(`${POLAR_API_BASE}/v1/checkouts/`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      products: [pack.productId],
      success_url: `${origin}/profile?topup=success`,
      customer_external_id: claims.userId,
      customer_email: claims.email,
      metadata: { userId: claims.userId },
    }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    return json({ error: data.detail || data.error || '创建支付会话失败' }, 502)
  }
  return json({ url: data.url })
}
