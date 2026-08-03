export const modelCats = ['all', 'text', 'multimodal', 'reasoning', 'cn'] as const

export const models = [
  { name: 'GPT-4o', vendor: 'OpenAI', ctx: '128K', cin: '$2.50', cout: '$10.00', tag: '多模态', color: '#10a37f', cats: ['multimodal'] },
  { name: 'Claude Opus 4.7', vendor: 'Anthropic', ctx: '200K', cin: '$3.00', cout: '$15.00', tag: '推理王者', color: '#d97757', cats: ['reasoning'] },
  { name: 'Gemini 2.5 Pro', vendor: 'Google', ctx: '1M', cin: '$1.25', cout: '$5.00', tag: '超长上下文', color: '#4285f4', cats: ['multimodal'] },
  { name: 'DeepSeek-V3', vendor: 'DeepSeek', ctx: '128K', cin: '$0.27', cout: '$1.10', tag: '极致性价比', color: '#5b6cff', cats: ['reasoning', 'cn'] },
  { name: 'Qwen-Max', vendor: '阿里云', ctx: '128K', cin: '$1.60', cout: '$6.40', tag: '中文优化', color: '#615ced', cats: ['cn'] },
  { name: 'Llama 4 405B', vendor: 'Meta', ctx: '128K', cin: '$0.90', cout: '$0.90', tag: '开源旗舰', color: '#0668e1', cats: ['text'] },
  { name: 'Grok-3', vendor: 'xAI', ctx: '131K', cin: '$2.00', cout: '$10.00', tag: '实时联网', color: '#1a1a1a', cats: ['text', 'reasoning'] },
  { name: 'Mistral Large', vendor: 'Mistral', ctx: '128K', cin: '$2.00', cout: '$6.00', tag: '欧洲之光', color: '#ff7000', cats: ['text'] },
  { name: 'GLM-4-Plus', vendor: '智谱', ctx: '128K', cin: '$0.70', cout: '$2.10', tag: '国产强模', color: '#3859ff', cats: ['cn'] },
]

export const rootWall = [
  { to: 128, prefix: '', suffix: 'M', key: 'root.wall1' },
  { to: 38, prefix: '¥', suffix: 'M', key: 'root.wall2' },
  { to: 60, prefix: '', suffix: '+', key: 'root.wall3' },
  { to: 12, prefix: '', suffix: 'K+', key: 'root.wall4' },
]

export const scenarios = [
  { id: 'chat', color: '#5dcaa5' },
  { id: 'content', color: '#185fa5' },
  { id: 'code', color: '#7c5cff' },
  { id: 'data', color: '#10a37f' },
  { id: 'translate', color: '#f5a623' },
  { id: 'voice', color: '#d9534f' },
]

// values: boolean | literal string (numbers) | i18n key starting with 'compare.'
export const compareRows: { key: string; vals: (boolean | string)[] }[] = [
  { key: 'compare.r1', vals: [false, true, true, true] },
  { key: 'compare.r2', vals: [false, true, true, true] },
  { key: 'compare.r3', vals: [false, false, true, true] },
  { key: 'compare.r4', vals: [false, false, false, true] },
  { key: 'compare.r5', vals: [false, false, false, true] },
  { key: 'compare.r6', vals: ['1', '5', 'compare.unlimited', 'compare.unlimited'] },
  { key: 'compare.r7', vals: ['5', '50', '500', 'compare.unlimited'] },
]
export const comparePlans = ['free', 'std', 'pro', 'ent']

export const testimonials = [
  { q: 'partners.q1', a: 'partners.a1', avatar: 'L', color: 'linear-gradient(135deg,#5dcaa5,#1aa179)' },
  { q: 'partners.q2', a: 'partners.a2', avatar: 'A', color: 'linear-gradient(135deg,#185fa5,#5dcaa5)' },
  { q: 'partners.q3', a: 'partners.a3', avatar: 'W', color: 'linear-gradient(135deg,#7c5cff,#185fa5)' },
]

export const compliance = ['SOC 2', 'ISO 27001', 'GDPR', 'TLS 1.3', '99.99% SLA']

export const partners: { nameKey: string; logo: string }[] = [
  { nameKey: 'partner.google', logo: '/partners/google-cloud.png' },
  { nameKey: 'partner.aliyun', logo: '/partners/aliyun.png' },
  { nameKey: 'partner.huawei', logo: '/partners/huawei.png' },
  { nameKey: 'partner.tencent', logo: '/partners/tencent.png' },
  { nameKey: 'partner.bytedance', logo: '/partners/bytedance.png' },
  { nameKey: 'partner.aws', logo: '/partners/aws.png' },
  { nameKey: 'partner.openai', logo: '/partners/openai.png' },
  { nameKey: 'partner.anthropic', logo: '/partners/anthropic.png' },
  { nameKey: 'partner.cloudwise', logo: '/partners/cloudwise.png' },
  { nameKey: 'partner.transcend', logo: '/partners/ai-transcend.png' },
  { nameKey: 'partner.speakly', logo: '/partners/speakly-ai.png' },
  { nameKey: 'partner.rudder', logo: '/partners/ai-rudder.png' },
]

export const consumeRank = [
  { name: 'GPT-4o', vendor: 'OpenAI', value: 100, tokens: '8.4B', trend: '+12%', up: true },
  { name: 'DeepSeek-V3', vendor: 'DeepSeek', value: 86, tokens: '7.2B', trend: '+28%', up: true },
  { name: 'Claude Opus 4.7', vendor: 'Anthropic', value: 74, tokens: '6.2B', trend: '+19%', up: true },
  { name: 'Gemini 2.5 Pro', vendor: 'Google', value: 61, tokens: '5.1B', trend: '+7%', up: true },
  { name: 'Qwen-Max', vendor: '阿里云', value: 48, tokens: '4.0B', trend: '-3%', up: false },
  { name: 'Llama 4 405B', vendor: 'Meta', value: 39, tokens: '3.3B', trend: '+5%', up: true },
]

export const abilityRank = [
  { name: 'Claude Opus 4.7', vendor: 'Anthropic', score: 96.8, trend: '+1.4', up: true },
  { name: 'GPT-4o', vendor: 'OpenAI', score: 95.2, trend: '+0.8', up: true },
  { name: 'Gemini 2.5 Pro', vendor: 'Google', score: 93.7, trend: '+2.1', up: true },
  { name: 'Grok-3', vendor: 'xAI', score: 91.4, trend: '+3.0', up: true },
  { name: 'DeepSeek-V3', vendor: 'DeepSeek', score: 90.1, trend: '+4.2', up: true },
  { name: 'Qwen-Max', vendor: '阿里云', score: 88.6, trend: '-0.5', up: false },
]

export const rankTotals = [
  { key: 'rank.totalTokens', to: 34.2, decimals: 1, suffix: 'B' },
  { key: 'rank.totalCalls', to: 92.6, decimals: 1, suffix: 'M' },
  { key: 'rank.modelsCount', to: 100, decimals: 0, suffix: '+' },
]

/* ===== MODEL CATALOG ===== */
// The models we actually serve. Prices are the real user-facing rates from
// lib/pricing.ts — keep the two in sync when repricing.
export interface CatModel {
  id: string; name: string; vendor: string; color: string
  cats: string[]; cin: number; cout: number; tags: string[]
}

const VCOLOR: Record<string, string> = {
  'OpenAI': '#10a37f', 'Anthropic': '#d97757', 'Google': '#4285f4',
  'DeepSeek': '#5b6cff', '阿里云 Qwen': '#615ced',
}

// Per-family user-facing price in USD per 1M tokens, mirroring lib/pricing.ts.
const PRICE: Record<string, [number, number]> = {
  'Anthropic-opus': [15, 75],
  'Anthropic-sonnet': [3, 15],
  'OpenAI': [2.5, 10],
  'Google': [1.5, 6],
  '阿里云 Qwen': [1, 4],
  'DeepSeek': [0.3, 1.2],
}

// [id, vendor, cats(csv), tags(csv)]
const RAW: [string, string, string, string][] = [
  // ---- Anthropic (Claude Code) ----
  ['claude-opus-4-7', 'Anthropic', 'text,reasoning', 'reasoning,function,json'],
  ['claude-opus-4-8', 'Anthropic', 'text,reasoning', 'reasoning,function,json'],
  ['claude-sonnet-4-5', 'Anthropic', 'text,reasoning', 'fast,function,json'],
  ['claude-sonnet-5', 'Anthropic', 'text,reasoning', 'fast,function,json'],

  // ---- OpenAI (Codex) ----
  ['gpt-5.5', 'OpenAI', 'text,reasoning', 'reasoning,function,json'],
  ['gpt-5.6', 'OpenAI', 'text,reasoning', 'reasoning,function,json'],
  ['gpt-5.6-luna', 'OpenAI', 'text,reasoning', 'reasoning,function'],
  ['gpt-5.6-sol', 'OpenAI', 'text,reasoning', 'reasoning,function'],
  ['gpt-5.6-terra', 'OpenAI', 'text,reasoning', 'reasoning,function'],

  // ---- Google Gemini (OpenAI-compatible) ----
  ['gemini-3.6-flash', 'Google', 'text,multimodal', 'fast,vision'],
  ['gemini-3.5-flash', 'Google', 'text,multimodal', 'fast,vision'],
  ['gemini-3.5-flash-lite', 'Google', 'text', 'cheap,fast'],
  ['gemini-3.1-pro-preview', 'Google', 'text,multimodal,reasoning', 'reasoning,vision'],
  ['gemini-3.1-pro-preview-thinking', 'Google', 'text,reasoning', 'reasoning'],
  ['gemini-3.1-pro-preview-customtools', 'Google', 'text,reasoning', 'reasoning,function'],
  ['gemini-3.1-pro-preview-cursor', 'Google', 'text,reasoning', 'reasoning,function'],
  ['gemini-3.1-flash-image', 'Google', 'image,multimodal', 'vision'],
  ['gemini-3.1-flash-image-preview', 'Google', 'image,multimodal', 'vision'],
  ['gemini-3.1-flash-image-preview-4k', 'Google', 'image,multimodal', 'vision'],
  ['gemini-3.1-flash-image-preview-sp', 'Google', 'image,multimodal', 'vision'],
  ['gemini-3.1-flash-lite', 'Google', 'text', 'cheap,fast'],
  ['gemini-3.1-flash-lite-image', 'Google', 'image,multimodal', 'cheap,vision'],
  ['gemini-3.1-flash-lite-preview', 'Google', 'text', 'cheap,fast'],
  ['gemini-3-pro-preview', 'Google', 'text,multimodal,reasoning', 'reasoning,vision'],
  ['gemini-3-pro-image', 'Google', 'image,multimodal', 'vision'],
  ['gemini-3-pro-image-preview', 'Google', 'image,multimodal', 'vision'],
  ['gemini-3-pro-image-preview-sp', 'Google', 'image,multimodal', 'vision'],
  ['gemini-3-pro-image-preview-spe', 'Google', 'image,multimodal', 'vision'],
  ['gemini-3-flash-preview', 'Google', 'text,multimodal', 'fast,vision'],
  ['gemini-3-flash-preview-thinking', 'Google', 'text,reasoning', 'reasoning'],
  ['gemini-2.5-pro', 'Google', 'text,multimodal,reasoning', 'reasoning,vision'],
  ['gemini-2.5-pro-thinking', 'Google', 'text,reasoning', 'reasoning'],
  ['gemini-2.5-flash', 'Google', 'text,multimodal', 'fast,vision'],
  ['gemini-2.5-flash-lite', 'Google', 'text', 'cheap,fast'],
  ['gemini-2.5-flash-image', 'Google', 'image,multimodal', 'vision'],
  ['gemini-flash-latest', 'Google', 'text,multimodal', 'fast,vision'],
  ['gemini-flash-lite-latest', 'Google', 'text', 'cheap,fast'],

  // ---- DeepSeek (OpenAI-compatible) ----
  ['deepseek-v3.2', 'DeepSeek', 'text,reasoning', 'cheap,cn,reasoning'],
  ['deepseek-v4-pro', 'DeepSeek', 'text,reasoning', 'cheap,cn,reasoning'],
  ['deepseek-v4-flash', 'DeepSeek', 'text', 'cheap,fast,cn'],

  // ---- Qwen (OpenAI-compatible) ----
  ['qwen3.7-plus', '阿里云 Qwen', 'text,reasoning', 'cn,function'],
  ['qwen3.7-max', '阿里云 Qwen', 'text,reasoning', 'cn,reasoning,function'],
  ['qwen3.6-plus', '阿里云 Qwen', 'text', 'cn,function'],
  ['qwen3.6-flash', '阿里云 Qwen', 'text', 'cheap,fast,cn'],
  ['qwen3.6-max-preview', '阿里云 Qwen', 'text,reasoning', 'cn,reasoning'],
]

function priceOf(name: string, vendor: string): [number, number] {
  if (vendor === 'Anthropic') {
    return PRICE[name.includes('opus') ? 'Anthropic-opus' : 'Anthropic-sonnet']
  }
  return PRICE[vendor] ?? [0, 0]
}

export const allModels: CatModel[] = RAW.map(([name, vendor, cats, tags], i) => {
  const [cin, cout] = priceOf(name, vendor)
  return {
    id: String(i), name, vendor, color: VCOLOR[vendor] || '#185fa5',
    cin, cout, cats: cats.split(','), tags: tags ? tags.split(',') : [],
  }
})

const VENDOR_EN: Record<string, string> = {
  '阿里云 Qwen': 'Alibaba Qwen',
}
export const vendorLabel = (v: string, zh: boolean): string => (zh ? v : (VENDOR_EN[v] || v))

export const catVendors = Array.from(new Set(allModels.map((m) => m.vendor)))
export const catCats = ['all', 'text', 'multimodal', 'reasoning', 'image']
export const catTags = ['cheap', 'fast', 'cn', 'vision', 'function', 'json', 'reasoning']
