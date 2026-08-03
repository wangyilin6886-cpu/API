// Single source of truth for the model catalogue shown in the UI.
// Used by the /chat picker and the /api docs page so the two can't drift.
//
// Note the id conventions differ by family and are NOT cosmetic — these are
// the exact strings clients send and our proxy matches on. Claude uses
// hyphens (claude-opus-4-8, as seen in real usage logs); the rest use dots
// (gpt-5.6-sol, gemini-3.5-flash, both verified end to end).

export type Family = 'claude' | 'gpt' | 'gemini' | 'deepseek' | 'qwen'

// `pattern` is the wildcard that selects the whole family in a key's model
// restriction. Note qwen ids have no hyphen after the family name
// (qwen3.7-plus), so its pattern can't carry one either.
export const FAMILIES: Record<Family, { label: string; color: string; pattern: string }> = {
  claude: { label: 'Claude', color: '#d97757', pattern: 'claude-*' },
  gpt: { label: 'GPT', color: '#10a37f', pattern: 'gpt-*' },
  gemini: { label: 'Gemini', color: '#4285f4', pattern: 'gemini-*' },
  deepseek: { label: 'DeepSeek', color: '#5b6cff', pattern: 'deepseek-*' },
  qwen: { label: 'Qwen', color: '#615ced', pattern: 'qwen*' },
}

export const MODELS: { id: string; family: Family }[] = [
  // ---- Claude — via Claude Code, /api/v1/messages, supplier A ----
  { id: 'claude-opus-4-7', family: 'claude' },
  { id: 'claude-opus-4-8', family: 'claude' },
  { id: 'claude-sonnet-4-5', family: 'claude' },
  { id: 'claude-sonnet-5', family: 'claude' },

  // ---- GPT — via Codex, /api/responses, supplier A ----
  { id: 'gpt-5.5', family: 'gpt' },
  { id: 'gpt-5.6', family: 'gpt' },
  { id: 'gpt-5.6-luna', family: 'gpt' },
  { id: 'gpt-5.6-sol', family: 'gpt' },
  { id: 'gpt-5.6-terra', family: 'gpt' },

  // ---- Gemini — OpenAI-compatible, /api/v1/chat/completions, supplier B ----
  { id: 'gemini-3.6-flash', family: 'gemini' },
  { id: 'gemini-3.5-flash', family: 'gemini' },
  { id: 'gemini-3.5-flash-lite', family: 'gemini' },
  { id: 'gemini-3.1-pro-preview', family: 'gemini' },
  { id: 'gemini-3.1-pro-preview-thinking', family: 'gemini' },
  { id: 'gemini-3.1-pro-preview-customtools', family: 'gemini' },
  { id: 'gemini-3.1-pro-preview-cursor', family: 'gemini' },
  { id: 'gemini-3.1-flash-image', family: 'gemini' },
  { id: 'gemini-3.1-flash-image-preview', family: 'gemini' },
  { id: 'gemini-3.1-flash-image-preview-4k', family: 'gemini' },
  { id: 'gemini-3.1-flash-image-preview-sp', family: 'gemini' },
  { id: 'gemini-3.1-flash-lite', family: 'gemini' },
  { id: 'gemini-3.1-flash-lite-image', family: 'gemini' },
  { id: 'gemini-3.1-flash-lite-preview', family: 'gemini' },
  { id: 'gemini-3-pro-preview', family: 'gemini' },
  { id: 'gemini-3-pro-image', family: 'gemini' },
  { id: 'gemini-3-pro-image-preview', family: 'gemini' },
  { id: 'gemini-3-pro-image-preview-sp', family: 'gemini' },
  { id: 'gemini-3-pro-image-preview-spe', family: 'gemini' },
  { id: 'gemini-3-flash-preview', family: 'gemini' },
  { id: 'gemini-3-flash-preview-thinking', family: 'gemini' },
  { id: 'gemini-2.5-pro', family: 'gemini' },
  { id: 'gemini-2.5-pro-thinking', family: 'gemini' },
  { id: 'gemini-2.5-flash', family: 'gemini' },
  { id: 'gemini-2.5-flash-lite', family: 'gemini' },
  { id: 'gemini-2.5-flash-image', family: 'gemini' },
  { id: 'gemini-flash-latest', family: 'gemini' },
  { id: 'gemini-flash-lite-latest', family: 'gemini' },

  // ---- DeepSeek — OpenAI-compatible, /api/v1/chat/completions, supplier B ----
  { id: 'deepseek-v3.2', family: 'deepseek' },
  { id: 'deepseek-v4-pro', family: 'deepseek' },
  { id: 'deepseek-v4-flash', family: 'deepseek' },

  // ---- Qwen — OpenAI-compatible, /api/v1/chat/completions, supplier B ----
  { id: 'qwen3.7-plus', family: 'qwen' },
  { id: 'qwen3.7-max', family: 'qwen' },
  { id: 'qwen3.6-plus', family: 'qwen' },
  { id: 'qwen3.6-flash', family: 'qwen' },
  { id: 'qwen3.6-max-preview', family: 'qwen' },
]

export function modelsOf(family: Family): string[] {
  return MODELS.filter((m) => m.family === family).map((m) => m.id)
}

// Families reachable through the OpenAI-compatible endpoint (supplier B).
export const OPENAI_COMPATIBLE_FAMILIES: Family[] = ['gemini', 'deepseek', 'qwen']
