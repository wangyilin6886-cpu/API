import { useEffect } from 'react'
import { ArticleNav, ArticleFooter, ArticleProgress } from './ArticleShell'
import './Article.css'

const stats = [
  { val: '1.6T', label: 'Parameters (V4-Pro)' },
  { val: '1M', label: 'Token Context Window' },
  { val: '750K', label: 'Units Targeted, 2026' },
  { val: '2.8×', label: 'FP4 vs. Nvidia H20' },
]

const highlights = [
  'SMIC N+3 process — no US equipment dependency',
  '112 GB HiBL on-chip memory at 1.4 TB/s',
  'FP4 throughput ~1.56 PFLOPS — 2.8× the H20',
  'Day-zero V4-Pro inference optimization',
  'Huawei-native AI Core framework, fully CUDA-free',
  '~$12B projected Huawei AI chip revenue, 2026',
]

export default function ArticleDeepSeek() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="art-root">
      <ArticleProgress />
      <ArticleNav />

      <header className="art-hero art-hero--china">
        <div className="art-hero-glow art-hero-glow--china" />
        <div className="art-hero-inner">
          <div className="art-hero-meta">
            <span className="art-badge">REUTERS · CHINA</span>
            <span className="art-date">24 April 2026</span>
          </div>
          <h1 className="art-headline">DeepSeek V4 Runs on Huawei Ascend 950 Chips — China</h1>
          <p className="art-subhead">
            Beijing's flagship AI model is now adapted to Huawei's Ascend silicon, marking
            the most significant milestone yet in China's self-reliant AI stack.
          </p>
          <div className="art-byline">
            <strong>EcoTech Industry Desk</strong>
            <span className="art-byline-dot" />
            <span>7 min read</span>
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
          In a move that underscores China's accelerating push toward technological
          self-reliance, DeepSeek's newly released V4 model has achieved "day-zero"
          optimization on Huawei's Ascend 950 series — the most powerful AI accelerator
          developed entirely within China. For the first time, a frontier-class large
          language model runs end-to-end on domestic silicon, without a single line of
          NVIDIA CUDA code.
        </p>
        <p>
          The implications stretch well beyond a single product launch. They touch the
          economics of global AI infrastructure, the trajectory of US export policy, and
          the strategic calculus of every enterprise weighing where — and on whose
          hardware — to build its AI future.
        </p>

        <h2>The Model: 1.6 Trillion Parameters, Built for Sovereignty</h2>
        <div className="art-divider" />
        <p>
          DeepSeek V4 is a Mixture-of-Experts (MoE) architecture released by the
          Hangzhou-based research company that first drew global attention with its
          aggressively priced V3 series. The flagship V4-Pro variant reaches 1.6 trillion
          total parameters — activating roughly 37 billion per token during inference —
          while a lighter V4-Flash configuration offers 284 billion parameters for
          latency-sensitive workloads. Both support a one-million-token context window.
        </p>
        <p>
          What distinguishes V4 commercially is not merely its benchmark scores, which
          place it competitively against leading Western frontier models. It is that
          DeepSeek engineered the model from the ground up with native support for
          Huawei's Ascend 950PR and 950DT chips — a deliberate architectural departure
          from the CUDA ecosystem that has dominated AI compute globally for more than a
          decade.
        </p>

        <blockquote className="art-quote">
          <p>
            "V4 running on Ascend 950 isn't just a product launch — it's a proof of
            concept for an AI ecosystem that no longer requires American silicon."
          </p>
          <cite>— Industry analyst, speaking on condition of anonymity</cite>
        </blockquote>

        <h2>The Chip: Inside the Ascend 950PR</h2>
        <div className="art-divider" />
        <p>
          Huawei's Ascend 950PR represents a generational leap over its predecessor, the
          910B. It is manufactured by SMIC on an N+3 process node — broadly comparable in
          density to a 5nm-class process — and crucially, produced using equipment that
          falls outside the scope of US export controls. The chip delivers up to 1 PFLOPS
          at FP8 precision and 2 PFLOPS at FP4, paired with Huawei's in-house HiBL memory
          stack providing 112 GB of capacity at 1.4 TB/s of bandwidth.
        </p>
        <p>
          In head-to-head comparisons, the 950PR's FP4 throughput of roughly 1.56 PFLOPS
          is approximately 2.8 times that of the H20 — the highest-spec accelerator NVIDIA
          could legally sell into China before Beijing restricted those imports. In
          overall capability the 950PR slots between NVIDIA's H100 and H200: still behind
          the H200 on raw compute and memory bandwidth, but decisively ahead of anything
          previously available to Chinese buyers within their own supply chain.
        </p>

        <div className="art-figure">
          <div className="art-figure-box" style={{ backgroundImage: 'url(/news2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <p className="art-figure-caption">
            DeepSeek V4 achieved day-zero inference optimization on Huawei's Ascend 950
            series — the first frontier model built entirely on Chinese domestic silicon.
          </p>
        </div>

        <div className="art-highlights">
          <div className="art-highlights-title">Key Technical Highlights</div>
          <div className="art-highlights-grid">
            {highlights.map((t) => (
              <div key={t} className="art-highlight-item">
                <div className="art-highlight-dot" />
                <span className="art-highlight-text">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <h2>Market Reaction: Cloud Giants Pivot</h2>
        <div className="art-divider" />
        <p>
          V4's launch triggered an immediate supply-side response. ByteDance, Tencent
          Cloud, and Alibaba Cloud each placed new orders for the 950PR within days of the
          announcement, according to supply chain sources. For years these platforms had
          hedged their infrastructure bets — leaning on NVIDIA hardware when accessible
          and Huawei's earlier Ascend generations when not. V4's optimized performance on
          Huawei silicon appears to have resolved that ambiguity, at least for large-scale
          inference workloads.
        </p>
        <p>
          Huawei now expects to ship approximately 750,000 Ascend 950PR units in 2026,
          with mass production beginning in April and full-scale distribution arriving in
          the second half of the year. At prevailing market prices, that volume implies an
          estimated $12 billion in AI chip revenue for Huawei this year — a figure that
          would have seemed implausible only two years ago, when the company's data-center
          ambitions were widely written off as a casualty of US sanctions.
        </p>

        <div className="art-callout">
          <div className="art-callout-label">EcoTech Analysis</div>
          <p>
            The speed of the cloud-provider response is the real story. Hardware
            announcements are common; coordinated purchasing commitments from all three of
            China's largest cloud platforms within a single week are not. It signals that
            the domestic stack has crossed a threshold of commercial confidence.
          </p>
        </div>

        <h2>Breaking CUDA Dependence</h2>
        <div className="art-divider" />
        <p>
          CUDA dependence has long been considered the structural weakness of China's AI
          ambitions. NVIDIA's software framework has accumulated tens of thousands of
          libraries, kernels, and developer workflows over more than a decade — an
          ecosystem advantage that hardware parity alone cannot erase. By achieving
          production-grade inference on Huawei's native AI Core framework, DeepSeek V4
          demonstrates that frontier workloads can in fact be productionized outside that
          ecosystem.
        </p>
        <p>
          The achievement carries weight beyond China's borders. Non-Chinese research
          institutions and governments seeking compute infrastructure independent of US
          policy are watching the 950PR / V4 combination closely. If the stack proves
          stable and cost-effective at scale, it offers a credible blueprint for a second,
          parallel global AI compute ecosystem — one not gated by Washington.
        </p>

        <h2>What This Means for Enterprise AI Strategy</h2>
        <div className="art-divider" />
        <p>
          EcoTech tracks these developments because they directly shape infrastructure
          decisions across Southeast Asia and the wider Asia-Pacific region. Enterprises in
          Indonesia, Singapore, and the broader ASEAN bloc that are evaluating AI
          deployments now face an increasingly bifurcated hardware landscape: a
          US-controlled NVIDIA ecosystem on one side, an emerging China-led Huawei
          ecosystem on the other. Fluency in both is no longer an academic luxury — it is a
          commercial necessity.
        </p>
        <p>
          For now, the practical guidance is straightforward. Organizations with
          latency-critical, sovereignty-sensitive, or cost-constrained inference workloads
          should begin evaluating the Ascend path in parallel with their existing NVIDIA
          roadmaps. The two ecosystems will not converge; planning around a single vendor
          is a strategic risk that the events of April 2026 have made plain.
        </p>
        <p>
          DeepSeek V4 on Ascend 950 is more than a technical milestone. It is a signal that
          China's AI self-reliance strategy has crossed from aspiration into execution. For
          enterprises and policymakers alike, the implications of a viable second AI
          infrastructure ecosystem are only beginning to unfold.
        </p>
      </article>

      <ArticleFooter />
    </div>
  )
}
