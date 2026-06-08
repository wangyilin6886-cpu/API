import { and, eq, gte, sql } from 'drizzle-orm'
import { db, apiKeys, usageLogs } from '../db/index.js'
import { requireAuth, json } from '../lib/auth.js'

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405)

  const claims = await requireAuth(req)
  if (!claims) return json({ error: '未登录' }, 401)

  const days = Math.min(Math.max(Number(new URL(req.url).searchParams.get('days')) || 7, 1), 90)
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  // Only this user's keys (join api_keys on user_id).
  const userScope = and(eq(apiKeys.userId, claims.userId), gte(usageLogs.createdAt, since))

  // Daily totals
  const daily = await db
    .select({
      day: sql<string>`to_char(${usageLogs.createdAt}, 'YYYY-MM-DD')`,
      input: sql<number>`coalesce(sum(${usageLogs.inputTokens}), 0)`,
      output: sql<number>`coalesce(sum(${usageLogs.outputTokens}), 0)`,
    })
    .from(usageLogs)
    .innerJoin(apiKeys, eq(usageLogs.keyId, apiKeys.id))
    .where(userScope)
    .groupBy(sql`to_char(${usageLogs.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${usageLogs.createdAt}, 'YYYY-MM-DD')`)

  // Per-model totals
  const byModel = await db
    .select({
      model: usageLogs.model,
      input: sql<number>`coalesce(sum(${usageLogs.inputTokens}), 0)`,
      output: sql<number>`coalesce(sum(${usageLogs.outputTokens}), 0)`,
    })
    .from(usageLogs)
    .innerJoin(apiKeys, eq(usageLogs.keyId, apiKeys.id))
    .where(userScope)
    .groupBy(usageLogs.model)

  const totalInput = daily.reduce((s, d) => s + Number(d.input), 0)
  const totalOutput = daily.reduce((s, d) => s + Number(d.output), 0)

  return json({
    days,
    totalInput,
    totalOutput,
    totalTokens: totalInput + totalOutput,
    daily: daily.map((d) => ({ day: d.day, tokens: Number(d.input) + Number(d.output) })),
    byModel: byModel.map((m) => ({
      model: m.model,
      tokens: Number(m.input) + Number(m.output),
    })),
  })
}
