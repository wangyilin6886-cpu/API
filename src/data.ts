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

/* ===== MODEL CATALOG (sample data) ===== */
export interface CatModel {
  id: string; name: string; vendor: string; color: string
  cats: string[]; ctxK: number; cin: number; cout: number; score: number; tags: string[]
}

const VCOLOR: Record<string, string> = {
  'OpenAI': '#10a37f', 'Anthropic': '#d97757', 'Google': '#4285f4', 'DeepSeek': '#5b6cff',
  '阿里云 Qwen': '#615ced', '智谱 GLM': '#3859ff', 'Meta Llama': '#0668e1', 'Mistral': '#ff7000',
  'xAI': '#1a1a1a', '月之暗面 Kimi': '#16a34a', '百川': '#e11d48', 'Cohere': '#7c3aed',
  'Stability AI': '#a855f7', 'ElevenLabs': '#0f172a',
  '腾讯混元': '#00a4ff', '字节豆包': '#325ef6', 'MiniMax': '#e8443c', '零一万物 Yi': '#00b386',
  '阶跃星辰': '#6d28d9', 'Microsoft': '#0078d4', 'NVIDIA': '#76b900', 'Amazon': '#ff9900',
  'Perplexity': '#20808d', 'Reka': '#111827', 'AI21': '#d6336c', 'Databricks': '#ff3621',
  'IBM': '#0f62fe', 'Black Forest Labs': '#0f172a',
}

// [name, vendor, ctxK, cin, cout, score, cats(csv), tags(csv)]
const RAW: [string, string, number, number, number, number, string, string][] = [
  ['GPT-4o', 'OpenAI', 128, 2.5, 10, 93, 'text,multimodal', 'vision,function,json,web'],
  ['GPT-4o mini', 'OpenAI', 128, 0.15, 0.6, 86, 'text,multimodal', 'cheap,fast,vision'],
  ['GPT-4.1', 'OpenAI', 1000, 2, 8, 93, 'text,multimodal', 'longctx,vision,function'],
  ['GPT-4.1 mini', 'OpenAI', 1000, 0.4, 1.6, 88, 'text', 'cheap,longctx'],
  ['o3', 'OpenAI', 200, 10, 40, 96, 'text,reasoning', 'reasoning,function'],
  ['o4-mini', 'OpenAI', 200, 1.1, 4.4, 91, 'text,reasoning', 'reasoning,cheap'],
  ['GPT-3.5 Turbo', 'OpenAI', 16, 0.5, 1.5, 78, 'text', 'cheap,fast'],
  ['text-embedding-3-large', 'OpenAI', 8, 0.13, 0, 80, 'embedding', 'cheap'],
  ['DALL·E 3', 'OpenAI', 0, 40, 0, 85, 'image', 'vision'],
  ['Whisper', 'OpenAI', 0, 6, 0, 82, 'audio', ''],
  ['Claude Opus 4.7', 'Anthropic', 200, 3, 15, 97, 'text,multimodal,reasoning', 'reasoning,vision,function,json'],
  ['Claude Sonnet 4.6', 'Anthropic', 200, 3, 15, 95, 'text,multimodal', 'vision,function,fast'],
  ['Claude Haiku 4.5', 'Anthropic', 200, 0.8, 4, 89, 'text', 'cheap,fast'],
  ['Claude Opus 4.1', 'Anthropic', 200, 15, 75, 95, 'text,reasoning', 'reasoning'],
  ['Claude 3.5 Sonnet', 'Anthropic', 200, 3, 15, 93, 'text,multimodal', 'vision'],
  ['Claude 3 Haiku', 'Anthropic', 200, 0.25, 1.25, 84, 'text', 'cheap,fast'],
  ['Gemini 2.5 Pro', 'Google', 1000, 1.25, 5, 94, 'text,multimodal,reasoning', 'longctx,vision,reasoning'],
  ['Gemini 2.5 Flash', 'Google', 1000, 0.3, 2.5, 90, 'text,multimodal', 'fast,longctx,vision'],
  ['Gemini 2.0 Flash', 'Google', 1000, 0.1, 0.4, 87, 'text,multimodal', 'cheap,fast,longctx'],
  ['Gemini 1.5 Pro', 'Google', 2000, 1.25, 5, 90, 'text,multimodal', 'longctx,vision'],
  ['Imagen 3', 'Google', 0, 40, 0, 86, 'image', 'vision'],
  ['text-embedding-004', 'Google', 2, 0.025, 0, 79, 'embedding', 'cheap'],
  ['DeepSeek-V3', 'DeepSeek', 128, 0.27, 1.1, 90, 'text', 'cheap,cn'],
  ['DeepSeek-R1', 'DeepSeek', 128, 0.55, 2.19, 93, 'text,reasoning', 'reasoning,cn,cheap'],
  ['DeepSeek-Coder', 'DeepSeek', 128, 0.27, 1.1, 88, 'text', 'cn,cheap'],
  ['DeepSeek-VL', 'DeepSeek', 64, 0.4, 1.2, 86, 'multimodal', 'vision,cn'],
  ['Qwen-Max', '阿里云 Qwen', 128, 1.6, 6.4, 89, 'text', 'cn'],
  ['Qwen-Plus', '阿里云 Qwen', 128, 0.4, 1.2, 86, 'text', 'cn,cheap'],
  ['Qwen-Turbo', '阿里云 Qwen', 1000, 0.05, 0.2, 82, 'text', 'cn,cheap,fast,longctx'],
  ['Qwen2.5-VL', '阿里云 Qwen', 128, 0.8, 2.4, 87, 'multimodal', 'vision,cn'],
  ['Qwen2.5-Coder', '阿里云 Qwen', 128, 0.3, 0.9, 87, 'text', 'cn,open,cheap'],
  ['QwQ-32B', '阿里云 Qwen', 32, 0.2, 0.6, 88, 'text,reasoning', 'reasoning,cn,open'],
  ['GLM-4-Plus', '智谱 GLM', 128, 0.7, 2.1, 88, 'text', 'cn'],
  ['GLM-4-Air', '智谱 GLM', 128, 0.1, 0.1, 84, 'text', 'cn,cheap'],
  ['GLM-4V', '智谱 GLM', 8, 0.7, 2.1, 85, 'multimodal', 'vision,cn'],
  ['CogView-3', '智谱 GLM', 0, 30, 0, 83, 'image', 'vision,cn'],
  ['Llama 4 Maverick', 'Meta Llama', 1000, 0.9, 0.9, 90, 'text,multimodal', 'open,longctx,vision'],
  ['Llama 4 Scout', 'Meta Llama', 10000, 0.5, 0.5, 88, 'text', 'open,longctx,cheap'],
  ['Llama 3.3 70B', 'Meta Llama', 128, 0.6, 0.6, 87, 'text', 'open'],
  ['Llama 3.1 405B', 'Meta Llama', 128, 0.9, 0.9, 89, 'text', 'open'],
  ['Llama 3.1 8B', 'Meta Llama', 128, 0.05, 0.05, 80, 'text', 'open,cheap,fast'],
  ['Mistral Large 2', 'Mistral', 128, 2, 6, 89, 'text', 'open,function'],
  ['Mistral Small 3', 'Mistral', 32, 0.2, 0.6, 84, 'text', 'open,cheap,fast'],
  ['Codestral', 'Mistral', 32, 0.3, 0.9, 86, 'text', 'open'],
  ['Pixtral Large', 'Mistral', 128, 2, 6, 87, 'multimodal', 'vision,open'],
  ['Mistral Embed', 'Mistral', 8, 0.1, 0, 78, 'embedding', 'cheap'],
  ['Grok-3', 'xAI', 131, 2, 10, 92, 'text,reasoning', 'web,reasoning'],
  ['Grok-3 mini', 'xAI', 131, 0.3, 0.5, 87, 'text', 'cheap,fast,web'],
  ['Grok-2 Vision', 'xAI', 32, 2, 10, 88, 'multimodal', 'vision'],
  ['Kimi k2', '月之暗面 Kimi', 256, 0.6, 2.5, 90, 'text', 'cn,longctx'],
  ['Moonshot v1 128k', '月之暗面 Kimi', 128, 1.7, 1.7, 85, 'text', 'cn,longctx'],
  ['Kimi-VL', '月之暗面 Kimi', 128, 0.5, 1.5, 85, 'multimodal', 'vision,cn'],
  ['Baichuan4', '百川', 32, 1.7, 1.7, 84, 'text', 'cn'],
  ['Baichuan3-Turbo', '百川', 32, 0.17, 0.17, 80, 'text', 'cn,cheap,fast'],
  ['Command R+', 'Cohere', 128, 2.5, 10, 87, 'text', 'function'],
  ['Command R', 'Cohere', 128, 0.15, 0.6, 83, 'text', 'cheap'],
  ['Embed v3', 'Cohere', 512, 0.1, 0, 79, 'embedding', 'cheap'],
  ['Rerank 3', 'Cohere', 4, 2, 0, 80, 'embedding', ''],
  ['Stable Diffusion 3.5', 'Stability AI', 0, 35, 0, 84, 'image', 'vision,open'],
  ['Stable Image Ultra', 'Stability AI', 0, 80, 0, 86, 'image', 'vision'],
  ['ElevenLabs v3', 'ElevenLabs', 0, 0, 0, 88, 'audio', ''],
  ['Scribe v1', 'ElevenLabs', 0, 0, 0, 84, 'audio', ''],
  ['Hunyuan-Turbo', '腾讯混元', 32, 0.4, 1.2, 86, 'text', 'cn'],
  ['Hunyuan-Large', '腾讯混元', 256, 0.7, 2.8, 88, 'text', 'cn,longctx'],
  ['Hunyuan-Vision', '腾讯混元', 32, 0.8, 2.4, 85, 'multimodal', 'vision,cn'],
  ['Hunyuan-Lite', '腾讯混元', 256, 0, 0, 80, 'text', 'cn,cheap,fast,longctx'],
  ['Doubao-pro-32k', '字节豆包', 32, 0.11, 0.28, 85, 'text', 'cn,cheap'],
  ['Doubao-pro-256k', '字节豆包', 256, 0.7, 1.3, 87, 'text', 'cn,longctx'],
  ['Doubao-vision-pro', '字节豆包', 32, 0.4, 1.2, 85, 'multimodal', 'vision,cn'],
  ['Doubao-lite', '字节豆包', 32, 0.04, 0.08, 79, 'text', 'cn,cheap,fast'],
  ['MiniMax-Text-01', 'MiniMax', 1000, 0.2, 1.1, 88, 'text', 'cn,longctx'],
  ['abab6.5s', 'MiniMax', 245, 0.14, 0.14, 84, 'text', 'cn,cheap'],
  ['MiniMax-VL-01', 'MiniMax', 1000, 0.5, 1.5, 85, 'multimodal', 'vision,cn,longctx'],
  ['speech-02', 'MiniMax', 0, 0, 0, 83, 'audio', 'cn'],
  ['Yi-Lightning', '零一万物 Yi', 16, 0.14, 0.14, 85, 'text', 'cn,cheap,fast'],
  ['Yi-Large', '零一万物 Yi', 32, 2.8, 2.8, 86, 'text', 'cn'],
  ['Yi-Vision', '零一万物 Yi', 16, 0.8, 0.8, 83, 'multimodal', 'vision,cn'],
  ['Step-2-16k', '阶跃星辰', 16, 5, 20, 87, 'text', 'cn'],
  ['Step-1V', '阶跃星辰', 8, 0.7, 2, 84, 'multimodal', 'vision,cn'],
  ['Step-1X', '阶跃星辰', 0, 30, 0, 83, 'image', 'vision,cn'],
  ['Phi-4', 'Microsoft', 16, 0.07, 0.14, 84, 'text', 'open,cheap'],
  ['Phi-4 multimodal', 'Microsoft', 128, 0.08, 0.16, 83, 'multimodal', 'open,vision,cheap'],
  ['Phi-3.5 mini', 'Microsoft', 128, 0.05, 0.1, 80, 'text', 'open,cheap,fast'],
  ['Nemotron-4 340B', 'NVIDIA', 4, 0.6, 0.6, 87, 'text', 'open'],
  ['Nemotron-70B', 'NVIDIA', 128, 0.4, 0.4, 88, 'text', 'open'],
  ['Nova Pro', 'Amazon', 300, 0.8, 3.2, 88, 'text,multimodal', 'vision,longctx,function'],
  ['Nova Lite', 'Amazon', 300, 0.06, 0.24, 84, 'text,multimodal', 'cheap,vision,longctx'],
  ['Nova Micro', 'Amazon', 128, 0.035, 0.14, 80, 'text', 'cheap,fast'],
  ['Titan Embeddings v2', 'Amazon', 8, 0.02, 0, 78, 'embedding', 'cheap'],
  ['Nova Canvas', 'Amazon', 0, 40, 0, 83, 'image', 'vision'],
  ['Sonar Pro', 'Perplexity', 200, 3, 15, 88, 'text', 'web,longctx'],
  ['Sonar', 'Perplexity', 127, 1, 1, 84, 'text', 'web,cheap'],
  ['Reka Core', 'Reka', 128, 2, 6, 86, 'text,multimodal', 'vision'],
  ['Reka Flash', 'Reka', 128, 0.4, 1, 83, 'text', 'cheap,fast'],
  ['Jamba 1.5 Large', 'AI21', 256, 2, 8, 86, 'text', 'longctx'],
  ['Jamba 1.5 Mini', 'AI21', 256, 0.2, 0.4, 82, 'text', 'cheap,longctx'],
  ['DBRX Instruct', 'Databricks', 32, 0.75, 2.25, 84, 'text', 'open'],
  ['Granite 3.1 8B', 'IBM', 128, 0.1, 0.1, 81, 'text', 'open,cheap'],
  ['Command A', 'Cohere', 256, 2.5, 10, 88, 'text', 'function,longctx'],
  ['Aya Expanse 32B', 'Cohere', 128, 0.5, 1.5, 84, 'text', 'open'],
  ['FLUX1.1 Pro', 'Black Forest Labs', 0, 40, 0, 87, 'image', 'vision'],
  ['FLUX.1 schnell', 'Black Forest Labs', 0, 3, 0, 83, 'image', 'vision,open,fast,cheap'],
]

export const allModels: CatModel[] = RAW.map(([name, vendor, ctxK, cin, cout, score, cats, tags], i) => ({
  id: String(i), name, vendor, color: VCOLOR[vendor] || '#185fa5',
  ctxK, cin, cout, score, cats: cats.split(','), tags: tags ? tags.split(',') : [],
}))

const VENDOR_EN: Record<string, string> = {
  '阿里云 Qwen': 'Alibaba Qwen', '智谱 GLM': 'Zhipu GLM', '月之暗面 Kimi': 'Moonshot Kimi',
  '百川': 'Baichuan', '腾讯混元': 'Tencent Hunyuan', '字节豆包': 'ByteDance Doubao',
  '零一万物 Yi': '01.AI Yi', '阶跃星辰': 'StepFun',
}
export const vendorLabel = (v: string, zh: boolean): string => (zh ? v : (VENDOR_EN[v] || v))

export const catVendors = Array.from(new Set(allModels.map((m) => m.vendor)))
export const catCats = ['all', 'text', 'multimodal', 'reasoning', 'image', 'embedding', 'audio']
export const catTags = ['cheap', 'fast', 'open', 'cn', 'vision', 'function', 'json', 'web', 'longctx']

export function fmtCtx(k: number): string {
  if (k === 0) return '—'
  if (k >= 1000) return `${k / 1000}M`
  return `${k}K`
}
