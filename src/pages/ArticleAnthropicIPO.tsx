import { useEffect } from 'react'
import { ArticleNav, ArticleFooter, ArticleProgress } from './ArticleShell'
import './Article.css'

const stats = [
  { val: 'IPO', label: 'Public listing filed' },
  { val: 'Claude', label: 'Flagship model family' },
  { val: 'Enterprise', label: 'Core market' },
  { val: '2026', label: 'Expected debut' },
]

const highlights = [
  'Among the first pure-play frontier AI labs to seek a public listing',
  'Claude positioned as the enterprise-grade model line',
  'Proceeds aimed at compute, safety research, and global expansion',
  'A signal that AI infrastructure is becoming an investable market',
]

export default function ArticleAnthropicIPO() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="art-root">
      <ArticleProgress />
      <ArticleNav />

      <header className="art-hero" style={{ background: 'linear-gradient(135deg, #0f274a 0%, #185fa5 60%, #2f7fd1 100%)' }}>
        <div className="art-hero-inner">
          <div className="art-hero-meta">
            <span className="art-badge">AI MARKETS</span>
            <span className="art-date">12 March 2026</span>
          </div>
          <h1 className="art-headline">Anthropic Files for a Landmark IPO</h1>
          <p className="art-subhead">
            The maker of Claude moves to go public — one of the most closely watched
            listings the AI sector has seen, and a milestone for the wider industry.
          </p>
          <div className="art-byline">
            <strong>SuperXIndo Industry Desk</strong>
            <span className="art-byline-dot" />
            <span>6 min read</span>
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
          Anthropic, the research company behind the Claude family of models, has moved to
          go public — a step that would place one of the frontier AI labs on the public
          markets and give investors a direct stake in the next phase of the industry's
          build-out.
        </p>
        <p>
          The decision matters well beyond a single company. It tests how public markets
          value frontier AI, sets a reference point for peers weighing their own listings,
          and channels fresh capital into the compute, research, and global expansion that
          increasingly define competitiveness in the sector.
        </p>

        <h2>Why Anthropic, Why Now</h2>
        <div className="art-divider" />
        <p>
          Anthropic has built its position around enterprise-grade reliability and a
          safety-first research agenda, with the Claude line aimed at businesses that need
          dependable, high-utility models. A public listing would give the company a
          durable capital base to scale that strategy as demand for frontier models keeps
          climbing.
        </p>

        <blockquote className="art-quote">
          <p>
            "A frontier lab tapping the public markets is a signal that AI has moved from
            speculative bet to core infrastructure."
          </p>
          <cite>— Industry analyst</cite>
        </blockquote>

        <div className="art-figure">
          <div className="art-figure-box" style={{ backgroundImage: 'url(/anthropic.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <p className="art-figure-caption">
            Anthropic's move to go public marks a milestone for the AI infrastructure market.
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
          For enterprises, a publicly traded model provider can mean greater transparency,
          financial stability, and long-term commitment — useful signals when choosing
          where to anchor an AI strategy. SuperXIndo tracks these shifts so customers can
          plan deployments that stay relevant and resilient across providers.
        </p>
      </article>

      <ArticleFooter />
    </div>
  )
}
