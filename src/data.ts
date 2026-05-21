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
  { q: 'partners.q1', a: 'partners.a1', company: 'NovaCloud', color: 'linear-gradient(135deg,#5dcaa5,#1aa179)' },
  { q: 'partners.q2', a: 'partners.a2', company: 'NeuralPay', color: 'linear-gradient(135deg,#185fa5,#5dcaa5)' },
  { q: 'partners.q3', a: 'partners.a3', company: 'VertexLabs', color: 'linear-gradient(135deg,#7c5cff,#185fa5)' },
]

export const compliance = ['SOC 2', 'ISO 27001', 'GDPR', 'TLS 1.3', '99.99% SLA']

export const partners = [
  'Google Cloud', '阿里云', '华为 HUAWEI', '拓邦 Topband', '碧桂园',
  '华润置地', '怪兽充电', '荔枝 LIZHI', '芯天下 XTX', '聚焦网络',
  '小黑鱼', '未知君 XBIOME', '广州酒家', '泉峰 CHERVON', 'FTL Cloud',
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
  { key: 'rank.modelsCount', to: 50, decimals: 0, suffix: '+' },
]
