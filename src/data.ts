export const models = [
  { name: 'GPT-4o', vendor: 'OpenAI', ctx: '128K', cin: '$2.50', cout: '$10.00', tag: '多模态', color: '#10a37f' },
  { name: 'Claude Opus 4.7', vendor: 'Anthropic', ctx: '200K', cin: '$3.00', cout: '$15.00', tag: '推理王者', color: '#d97757' },
  { name: 'Gemini 2.5 Pro', vendor: 'Google', ctx: '1M', cin: '$1.25', cout: '$5.00', tag: '超长上下文', color: '#4285f4' },
  { name: 'DeepSeek-V3', vendor: 'DeepSeek', ctx: '128K', cin: '$0.27', cout: '$1.10', tag: '极致性价比', color: '#5b6cff' },
  { name: 'Qwen-Max', vendor: '阿里云', ctx: '128K', cin: '$1.60', cout: '$6.40', tag: '中文优化', color: '#615ced' },
  { name: 'Llama 4 405B', vendor: 'Meta', ctx: '128K', cin: '$0.90', cout: '$0.90', tag: '开源旗舰', color: '#0668e1' },
  { name: 'Grok-3', vendor: 'xAI', ctx: '131K', cin: '$2.00', cout: '$10.00', tag: '实时联网', color: '#1a1a1a' },
  { name: 'Mistral Large', vendor: 'Mistral', ctx: '128K', cin: '$2.00', cout: '$6.00', tag: '欧洲之光', color: '#ff7000' },
  { name: 'GLM-4-Plus', vendor: '智谱', ctx: '128K', cin: '$0.70', cout: '$2.10', tag: '国产强模', color: '#3859ff' },
]

export const partners = [
  'NovaCloud', 'QuantumByte', 'DataForge', 'NeuralPay', 'StellarAI',
  'CodeNimbus', 'PixelWave', 'SynthCore', 'VertexLabs', 'OrbitDev',
  'Flux Systems', 'ByteHarbor', 'AetherStack', 'LumenWorks', 'ZenithAI',
]

export const consumeRank = [
  { name: 'GPT-4o', value: 100, tokens: '8.4B' },
  { name: 'DeepSeek-V3', value: 86, tokens: '7.2B' },
  { name: 'Claude Opus 4.7', value: 74, tokens: '6.2B' },
  { name: 'Gemini 2.5 Pro', value: 61, tokens: '5.1B' },
  { name: 'Qwen-Max', value: 48, tokens: '4.0B' },
  { name: 'Llama 4 405B', value: 39, tokens: '3.3B' },
]

export const abilityRank = [
  { name: 'Claude Opus 4.7', score: 96.8 },
  { name: 'GPT-4o', score: 95.2 },
  { name: 'Gemini 2.5 Pro', score: 93.7 },
  { name: 'Grok-3', score: 91.4 },
  { name: 'DeepSeek-V3', score: 90.1 },
  { name: 'Qwen-Max', score: 88.6 },
]
