// Per-key model restrictions.
//
// A key stores either nothing (unrestricted) or a list of patterns. A pattern
// is either an exact model id ("claude-opus-4-8") or a prefix wildcard
// ("gemini-*", "qwen*") covering a whole family.

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
  return allowed.some((pattern) => {
    const p = pattern.trim().toLowerCase()
    if (!p) return false
    return p.endsWith('*') ? m.startsWith(p.slice(0, -1)) : m === p
  })
}
