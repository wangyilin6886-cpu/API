import { useEffect } from 'react'
import { ArticleNav, ArticleFooter, ArticleProgress } from './ArticleShell'
import './Article.css'

const stats = [
  { val: 'Deal', label: 'Acquisition announced' },
  { val: 'Codex', label: 'AI coding focus' },
  { val: 'Developers', label: 'Primary users' },
  { val: '2026', label: 'Announced' },
]

const highlights = [
  'Deepens OpenAI’s push into AI-assisted software development',
  'Strengthens code generation, review, and agentic dev tooling',
  'Targets the fast-growing developer-tools segment',
  'Raises the bar for integrated AI coding platforms',
]

export default function ArticleOpenAICodex() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="art-root">
      <ArticleProgress />
      <ArticleNav />

      <header className="art-hero" style={{ background: 'linear-gradient(135deg, #0c2233 0%, #0f5132 55%, #10a37f 100%)' }}>
        <div className="art-hero-inner">
          <div className="art-hero-meta">
            <span className="art-badge">AI DEALS</span>
            <span className="art-date">28 April 2026</span>
          </div>
          <h1 className="art-headline">OpenAI Acquires Codex to Deepen Its AI Coding Push</h1>
          <p className="art-subhead">
            OpenAI moves to strengthen its position in AI-assisted software development,
            doubling down on the developer tools reshaping how code gets written.
          </p>
          <div className="art-byline">
            <strong>SuperXIndo Industry Desk</strong>
            <span className="art-byline-dot" />
            <span>5 min read</span>
          </div>
        </div>
      </header>

      <div className="art-stats">
        <div className="art-stats-inner">
          {stats.map((s) => (
            <div key={s.label} className="art-stat">
              <div className="art-stat-val">{s.val}</div>
              <div className="art-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <article className="art-body">
        <p className="art-lead">
          OpenAI has moved to acquire Codex, sharpening its focus on AI-assisted software
          development — a segment that has become one of the most competitive and
          fastest-growing applications of frontier models.
        </p>
        <p>
          As coding assistants evolve from autocomplete into agents that plan, write, and
          review software, owning the tooling layer — not just the model — is becoming a
          strategic priority for the largest AI labs.
        </p>

        <h2>The Strategic Logic</h2>
        <div className="art-divider" />
        <p>
          Developer tools are both a high-value market and a powerful distribution channel:
          the assistants engineers use every day shape which models and platforms teams
          standardize on. Consolidating that layer lets OpenAI offer a tighter, end-to-end
          coding experience.
        </p>

        <blockquote className="art-quote">
          <p>
            "Whoever owns the developer's daily workflow owns a durable foothold in the AI
            stack."
          </p>
          <cite>— Industry analyst</cite>
        </blockquote>

        <div className="art-figure">
          <div className="art-figure-box" style={{ backgroundImage: 'url(/openai-codex.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <p className="art-figure-caption">
            OpenAI's acquisition of Codex deepens its push into AI-native developer tooling.
          </p>
        </div>

        <div className="art-highlights">
          <div className="art-highlights-title">Key Points</div>
          <div className="art-highlights-grid">
            {highlights.map((t) => (
              <div key={t} className="art-highlight-item">
                <div className="art-highlight-dot" />
                <span className="art-highlight-text">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <h2>Why It Matters</h2>
        <div className="art-divider" />
        <p>
          For teams building on AI, tighter integration between models and coding tools can
          mean faster delivery — but also more concentration around a few platforms.
          SuperXIndo helps enterprises stay model-agnostic, routing across providers so a
          single vendor's roadmap never dictates their own.
        </p>
      </article>

      <ArticleFooter />
    </div>
  )
}
