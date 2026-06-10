// Hero visual for the gateway page: "one key routes to every top LLM".
// Pure CSS/SVG — a central key hub with animated flow lines fanning out to
// the supported model providers. Decorative (aria-hidden).

const PROVIDERS = [
  { name: 'OpenAI', color: '#10a37f', y: 13 },
  { name: 'Anthropic', color: '#d97757', y: 31.5 },
  { name: 'Google', color: '#4285f4', y: 50 },
  { name: 'DeepSeek', color: '#4d6bfe', y: 68.5 },
  { name: 'Qwen', color: '#7b61ff', y: 87 },
]

export default function RoutingDiagram() {
  return (
    <div className="route-dia" aria-hidden="true">
      <svg className="route-dia-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        {PROVIDERS.map((p, i) => (
          <path
            key={p.name}
            className="route-line"
            d={`M25 50 C 46 50, 54 ${p.y}, 71 ${p.y}`}
            style={{ animationDelay: `${i * 0.22}s` }}
          />
        ))}
      </svg>

      <div className="route-hub">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="6" />
          <path d="M12.5 12.5 20 20M16.5 16.5 19 14M19 19l2-2" />
        </svg>
        <span>One Key</span>
      </div>

      {PROVIDERS.map((p) => (
        <div className="route-chip" key={p.name} style={{ top: `${p.y}%` }}>
          <span className="route-dot" style={{ background: p.color }} />
          {p.name}
        </div>
      ))}
    </div>
  )
}
