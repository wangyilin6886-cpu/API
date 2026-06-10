// Generates dist/ecoapi.html from dist/index.html by swapping the brand meta
// tags (EcoTech -> EcoAPI).
//
// Why: link-preview crawlers (WhatsApp, etc.) don't run JS, so they only read
// the static <head>. A single SPA shell can't show two different brands. We
// ship two static shells with different meta; vercel.json rewrites gateway
// routes (/ecoapi, ...) to ecoapi.html and everything else to index.html.
// Both shells load the exact same JS bundle, so the React app still renders
// the correct page by route — only the crawler preview differs.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const src = resolve('dist/index.html')
if (!existsSync(src)) {
  console.error('[gen-ecoapi-shell] dist/index.html not found — run after `vite build`')
  process.exit(1)
}

// [from (EcoTech, must exist in dist/index.html), to (EcoAPI)]
const swaps = [
  // shared by <title>, og:title, twitter:title
  [
    'EcoTech · Scalable and Practical AI Ecosystems',
    'EcoAPI · One Key, Access Every Top LLM',
  ],
  // shared by description, og:description, twitter:description
  [
    'EcoTech (Global EcoTech Systems) builds the AI infrastructure, intelligent agents, and token platforms that power the next generation of enterprise transformation.',
    'EcoAPI is a unified, stable, low-cost LLM API gateway — call OpenAI, Anthropic, Google, DeepSeek and more through one OpenAI-compatible endpoint, billed by usage.',
  ],
  // keywords
  [
    'content="EcoTech, AI infrastructure, AI agent, AI token, enterprise AI, AI ecosystem, Singapore, Indonesia"',
    'content="LLM API, API gateway, OpenAI compatible, DeepSeek, Claude, GPT, AI API, token billing"',
  ],
  // og:site_name (exact closing quote keeps this from matching title/desc)
  ['content="EcoTech"', 'content="EcoAPI"'],
]

let html = readFileSync(src, 'utf-8')
for (const [from, to] of swaps) {
  if (!html.includes(from)) {
    console.error(`[gen-ecoapi-shell] expected string not found in dist/index.html:\n  ${from}`)
    process.exit(1)
  }
  html = html.replaceAll(from, to)
}

writeFileSync(resolve('dist/ecoapi.html'), html)
console.log('[gen-ecoapi-shell] wrote dist/ecoapi.html (EcoAPI link-preview shell)')
