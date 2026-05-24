import { useEffect } from 'react'
import { ArticleNav, ArticleFooter, ArticleProgress } from './ArticleShell'
import './Article.css'

const stats = [
  { val: '~10', label: 'Chinese Firms Cleared' },
  { val: '75K', label: 'Chip Cap, Per Firm' },
  { val: '$10B+', label: 'Estimated Deal Value' },
  { val: '0', label: 'Chips Delivered (So Far)' },
]

const highlights = [
  'First H200-tier clearance since late-2023 controls',
  'Alibaba, Tencent, ByteDance, JD.com among buyers',
  'Lenovo and Foxconn cleared as distributors',
  'Buyers must certify non-military end use',
  'Contested 25% US revenue-share condition',
  'Beijing wary of undercutting domestic silicon',
]

export default function ArticleH200() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="art-root">
      <ArticleProgress />
      <ArticleNav />

      <header className="art-hero art-hero--policy">
        <div className="art-hero-glow art-hero-glow--policy" />
        <div className="art-hero-inner">
          <div className="art-hero-meta">
            <span className="art-badge">REUTERS · POLICY</span>
            <span className="art-date">14 May 2026</span>
          </div>
          <h1 className="art-headline">AI Big News: H200 Cleared for 10 China Firms</h1>
          <p className="art-subhead">
            The US greenlights NVIDIA H200 chip sales to ten Chinese firms as the CEO
            targets a market breakthrough — but weeks on, not a single chip has shipped.
          </p>
          <div className="art-byline">
            <strong>EcoTech Industry Desk</strong>
            <span className="art-byline-dot" />
            <span>8 min read</span>
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
          In a significant and closely watched policy reversal, the United States Commerce
          Department has issued export licenses permitting NVIDIA to sell its H200 AI
          accelerators to roughly ten Chinese companies — among them Alibaba, Tencent,
          ByteDance, and JD.com. It would be the most consequential softening of Biden-era
          chip controls to date. Yet weeks after the approvals were granted, not a single
          chip has been delivered.
        </p>
        <p>
          The widening gap between regulatory clearance and commercial reality has laid
          bare the fragility of US–China technology diplomacy — and revealed how
          dramatically the strategic ground has shifted beneath both governments in the
          space of a single year.
        </p>

        <h2>The Approvals</h2>
        <div className="art-divider" />
        <p>
          The licenses, first reported by Reuters on 14 May, mark the first time
          Washington has cleared H200-tier accelerators for Chinese buyers since the
          export-control regime tightened in late 2023. The H200 — NVIDIA's flagship
          data-center inference accelerator of its generation — had been categorically
          off-limits to Chinese customers as part of a strategy to constrain Beijing's
          access to advanced AI compute.
        </p>
        <p>
          Under the terms of the new licenses, each approved firm is capped at 75,000
          chips. A short list of distributors — including Lenovo and Foxconn — has also
          received clearance to facilitate the transactions. On paper, the arrangement
          represents a market opportunity that NVIDIA leadership has valued at well over
          $10 billion.
        </p>

        <h2>NVIDIA's Push for a Breakthrough</h2>
        <div className="art-divider" />
        <p>
          The approvals appear to have been shaped in no small part by sustained lobbying
          from NVIDIA's chief executive, who has argued that blanket export restrictions
          ultimately harm the company's long-term competitive position without meaningfully
          slowing China's AI progress. His case rests on a simple observation: with
          Huawei's Ascend line advancing rapidly, every quarter that NVIDIA is locked out
          of China is a quarter in which domestic alternatives capture the market by
          default.
        </p>

        <blockquote className="art-quote">
          <p>
            "The approvals are real, but the deals are stalled. Beijing is wary of being
            seen as dependent on American chips precisely when Huawei's domestic silicon
            has proven it can handle frontier AI workloads."
          </p>
          <cite>— Source familiar with the negotiations</cite>
        </blockquote>

        <p>
          That argument has gained force in recent weeks. The same months that produced
          the H200 licenses also saw orders for Huawei's Ascend 950PR surge among China's
          largest cloud providers, following the launch of the domestically optimized
          DeepSeek V4 model. The commercial logic of paying a premium for US-supervised
          imports has weakened at the very moment regulatory access became available.
        </p>

        <div className="art-highlights">
          <div className="art-highlights-title">Where the Deal Stands</div>
          <div className="art-highlights-grid">
            {highlights.map((t) => (
              <div key={t} className="art-highlight-item">
                <div className="art-highlight-dot" />
                <span className="art-highlight-text">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <h2>Why Deliveries Have Stalled</h2>
        <div className="art-divider" />
        <p>
          Despite the regulatory green light, every transaction remains incomplete — and
          two distinct dynamics are driving the paralysis.
        </p>
        <p>
          On the US side, the licensing terms require Chinese buyers to certify that the
          chips will not be diverted to military applications, while NVIDIA must separately
          verify that domestic inventory is sufficient before any export ships. Those
          compliance processes have reportedly taken considerably longer than either side
          anticipated.
        </p>
        <p>
          On the Chinese side, Beijing has signalled clear unease. A condition reportedly
          attached to the arrangement — under which the US would receive 25% of the revenue
          from the chip sales — has drawn sharp resistance from Chinese negotiators. Beyond
          the revenue-sharing clause, authorities appear reluctant to sanction large-scale
          imports at a politically sensitive moment, just as state media has been
          showcasing the Huawei Ascend 950 / DeepSeek V4 combination as evidence of
          national AI self-sufficiency.
        </p>

        <div className="art-figure">
          <div className="art-figure-box" style={{ backgroundImage: 'url(/news3.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <p className="art-figure-caption">
            The H200 export licenses cover roughly ten Chinese firms, each capped at 75,000
            chips — yet deliveries remain frozen amid compliance and revenue-share disputes.
          </p>
        </div>

        <h2>The Competitive Backdrop</h2>
        <div className="art-divider" />
        <p>
          The stalled H200 deals are unfolding against a backdrop of rapid Huawei progress.
          With DeepSeek V4 achieving production-grade performance on the Ascend 950PR,
          Chinese cloud providers now possess a credible domestic option for large-scale
          inference for the first time. For NVIDIA, the irony is sharp: the very months in
          which its H200 licenses were approved coincided with a steep climb in Huawei
          950PR orders among China's major cloud platforms.
        </p>
        <p>
          The episode is a case study in the unintended consequences of export policy.
          Controls designed to restrict NVIDIA's most advanced chips ultimately accelerated
          Chinese investment in domestic alternatives. Now, as Washington moves to re-open
          a narrow channel of trade, Beijing has concrete strategic reasons to hesitate
          rather than rush to buy.
        </p>

        <div className="art-callout">
          <div className="art-callout-label">EcoTech Analysis</div>
          <p>
            For enterprise buyers, the lesson is to plan around continued supply-chain
            bifurcation rather than betting on a single thaw. Approvals can be granted and
            withdrawn; resilient AI infrastructure strategies now assume access to both
            ecosystems, and to neither exclusively.
          </p>
        </div>

        <h2>Policy Implications</h2>
        <div className="art-divider" />
        <p>
          The H200 licenses illustrate the growing complexity of semiconductors as an
          instrument of geopolitical competition. Restrictions intended to slow a rival can,
          over a long enough horizon, simply redirect its investment inward — and once a
          domestic capability matures, the original leverage erodes. Washington now finds
          itself attempting to re-open trade on terms that Beijing has little incentive to
          accept.
        </p>
        <p>
          EcoTech expects the stalemate to persist through at least mid-2026, with any
          deliveries contingent on resolution of the revenue-sharing terms and the broader
          diplomatic climate. Enterprises evaluating AI infrastructure across the region
          should plan accordingly, treating the H200 channel as a possibility rather than a
          certainty.
        </p>
        <p>
          The licenses mark an important moment in US–China chip policy — but they are not
          yet a breakthrough. Until Beijing's strategic hesitation resolves and the
          compliance conditions are satisfied, the chips approved on paper may remain
          undelivered in practice.
        </p>
      </article>

      <ArticleFooter />
    </div>
  )
}
