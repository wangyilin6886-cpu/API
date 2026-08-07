// Model restrictions. Two independent layers, both using the same pattern
// syntax: an exact model id ("claude-opus-4-8") or a prefix wildcard
// ("gemini-*", "qwen*") covering a whole family.
//
//   users.allowed_models     the ceiling we set; the customer cannot change it
//   api_keys.allowed_models  the customer narrowing their own key below that
//
// A request must clear both. Empty/NULL means "no restriction" at that layer.
//
// This file is the authority. src/lib/models.ts carries a small mirror of the
// same rules purely to grey out unavailable options in the picker — the server
// still decides.

export function isModelAllowed(
  model: string,
  allowed: string[] | null | undefined,
): boolean {
  // No list = no restriction.
  if (!allowed || allowed.length === 0) return true

  // Restricted key + a request whose model we couldn't determine: refuse.
  // Failing open here would let a malformed body bypass the restriction.
  if (!model || model === 'unknown') return false

  const m = model.toLowerCase()
  return allowed.some((pattern) => covers(pattern, m))
}

/**
 * Whether a key may be scoped to `pattern` given the account's ceiling.
 *
 * A key can only narrow, never widen: scoping a key to `gemini-*` is refused
 * when the account only allows `gemini-3.5-flash`. Rejecting at creation beats
 * letting someone mint a key that can never make a successful call.
 */
export function isPatternWithinScope(
  pattern: string,
  scope: string[] | null | undefined,
): boolean {
  if (!scope || scope.length === 0) return true
  const p = pattern.trim().toLowerCase()
  if (!p) return false
  return scope.some((s) => covers(s, p))
}

/**
 * Does `pattern` cover `target`? `target` may itself be a wildcard, in which
 * case only a wildcard with a prefix at least as short can contain it.
 */
function covers(pattern: string, target: string): boolean {
  const p = pattern.trim().toLowerCase()
  if (!p) return false
  if (p.endsWith('*')) return target.startsWith(p.slice(0, -1))
  return target === p
}
