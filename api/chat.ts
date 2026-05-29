import type { VercelRequest, VercelResponse } from '@vercel/node'
import { COMPANY_KNOWLEDGE } from './company-knowledge'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const apiKey = process.env.DEEPSEEK_API_KEY || 'sk-a4f2653730104d8385b525de8ef80aba'

  const body = (req.body ?? {}) as { model?: string; messages?: { role: string; content: string }[] }
  // Keep only the conversation turns from the client; the company knowledge is the
  // authoritative system prompt and is injected here on the server.
  const conversation = (body.messages ?? []).filter((m) => m.role !== 'system')
  const messages = [{ role: 'system', content: COMPANY_KNOWLEDGE }, ...conversation]

  const upstream = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: body.model ?? 'deepseek-chat', messages }),
  })

  const data = await upstream.json()
  res.status(upstream.status).json(data)
}
