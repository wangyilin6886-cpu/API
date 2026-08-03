// User-facing prices in US cents per 1,000,000 tokens.
// Keyed by substring match against the model id. First match wins.
const RATES: { match: string; inputPerM: number; outputPerM: number }[] = [
  { match: 'opus', inputPerM: 1500, outputPerM: 7500 },
  { match: 'fable', inputPerM: 500, outputPerM: 2500 },
  { match: 'sonnet', inputPerM: 300, outputPerM: 1500 },
  { match: 'haiku', inputPerM: 80, outputPerM: 400 },
  // Non-Anthropic families — placeholder at market-average rates until
  // supplier pricing lands.
  { match: 'gpt', inputPerM: 250, outputPerM: 1000 },
  { match: 'gemini', inputPerM: 150, outputPerM: 600 },
  { match: 'qwen', inputPerM: 100, outputPerM: 400 },
  { match: 'deepseek', inputPerM: 30, outputPerM: 120 },
]

// Fallback if no model matches (priced like Sonnet).
const DEFAULT_RATE = { inputPerM: 300, outputPerM: 1500 }

export function computeCostCents(model: string, inputTokens: number, outputTokens: number): number {
  const m = model.toLowerCase()
  const rate = RATES.find((r) => m.includes(r.match)) ?? DEFAULT_RATE
  const cost =
    (inputTokens / 1_000_000) * rate.inputPerM +
    (outputTokens / 1_000_000) * rate.outputPerM
  return Math.ceil(cost) // round up to whole cents, min 0
}
