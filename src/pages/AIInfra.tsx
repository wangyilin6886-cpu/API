import { useEffect } from 'react'
import SiteFooter from '../components/SiteFooter'
import './AIInfra.css'
import './Corporate.css'

const challengeItems = [
  {
    icon: <ShieldIcon />,
    title: 'Sovereignty & Supply-Chain Risk',
    desc: 'Reliance on foreign silicon and unpredictable export controls exposes mission-critical workloads to disruption. Regulated sectors need a stack they fully control.',
  },
  {
    icon: <ActivityIcon />,
    title: 'Performance Bottlenecks at Scale',
    desc: 'Training and inference workloads stall when memory bandwidth, interconnect throughput, or thermal headroom cannot keep pace with model size and concurrency.',
  },
  {
    icon: <GridIcon />,
    title: 'Integration Complexity',
    desc: 'Hardware, firmware, orchestration, and application layers ship from different vendors. Stitching them together stalls projects and creates support gaps.',
  },
  {
    icon: <LoaderIcon />,
    title: 'Operational Reliability',
    desc: 'Telecom, finance, and government workloads cannot tolerate downtime. SLA-grade availability requires purpose-built redundancy from silicon to facility.',
  },
]

const approachItems = [
  {
    num: '01',
    title: 'AI Compute Platforms',
    desc: 'Server platforms optimized for training and inference workloads — purpose-built for foundation-model deployment, high-throughput batch processing, and low-latency online serving. Independent architectures reduce vendor lock-in and supply-chain exposure while delivering competitive performance per watt.',
    bullets: [
      'Training-class & inference-class platforms',
      'High memory bandwidth for large model workloads',
      'Multi-node interconnect for cluster scaling',
      'Optimized firmware & driver stack',
    ],
  },
  {
    num: '02',
    title: 'Cloud Compute Layer',
    desc: 'A virtualization and orchestration layer that turns raw compute into a consumable, multi-tenant cloud service. Workload scheduling, resource quotas, and isolation policies let central IT serve multiple business units without sacrificing performance or governance.',
    bullets: [
      'Workload-aware scheduling for AI jobs',
      'Multi-tenant isolation & quota management',
      'Observability & usage analytics',
      'API-first integration with existing tooling',
    ],
  },
  {
    num: '03',
    title: 'Regional AI Computing Centers',
    desc: 'Turn-key AI computing center build-out — from facility design and procurement through commissioning and ongoing operations. Suited for public-sector compute hubs, industry consortia, and large enterprises building captive AI capacity at regional scale.',
    bullets: [
      'Facility & rack-level engineering',
      'Capacity planning aligned to workload profile',
      'Commissioning, acceptance testing, handover',
      'Long-term operations & capacity expansion',
    ],
  },
  {
    num: '04',
    title: 'Cooling & Power Systems',
    desc: 'High-density AI racks push thermal and electrical envelopes past what traditional data-center designs can handle. Liquid cooling, advanced airflow management, and power distribution engineered for sustained high-utilization workloads keep clusters at peak performance.',
    bullets: [
      'Immersion & direct-liquid cooling',
      'High-density rack power distribution',
      'Thermal modeling & airflow design',
      'Energy efficiency & PUE optimization',
    ],
  },
]

const sectors = [
  { title: 'Telecommunications', desc: 'Network intelligence, customer analytics, and operator-scale AI services.' },
  { title: 'Financial Services', desc: 'Risk modeling, fraud detection, and regulated workloads requiring audit-ready compute.' },
  { title: 'Government & Public Sector', desc: 'Sovereign compute capacity for ministries, agencies, and regional AI initiatives.' },
  { title: 'Energy & Utilities', desc: 'Grid optimization, predictive maintenance, and field-deployed inference.' },
  { title: 'Manufacturing', desc: 'Industrial vision, process optimization, and edge-to-core AI pipelines.' },
  { title: 'Research & Education', desc: 'Shared compute capacity for research institutions and academic AI programs.' },
]

export default function AIInfra() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="infra-root">

      {/* ── HERO ── */}
      <section className="infra-hero">
        <div className="infra-hero-inner">
          <span className="infra-badge">AI INFRASTRUCTURE</span>
          <h1 className="infra-hero-title">Compute Foundations Built for Real Workloads.</h1>
          <p className="infra-hero-sub">
            Autonomous, secure-by-design AI infrastructure engineered for enterprises where
            reliability, sovereignty, and performance are non-negotiable.
          </p>
        </div>
      </section>

      {/* ── THE CHALLENGE ── */}
      <section className="infra-section infra-section--white">
        <div className="infra-section-inner">
          <span className="infra-badge">THE CHALLENGE</span>
          <h2 className="infra-section-title">Enterprise AI Demands Outpace Traditional Infrastructure.</h2>
          <p className="infra-section-sub">
            Standard compute stacks were not built for foundation-model workloads, regulated
            industries, or sovereign data requirements. The gap between what your business
            needs and what generic infrastructure delivers is growing.
          </p>
          <div className="infra-challenge-grid">
            {challengeItems.map((c) => (
              <div key={c.title} className="infra-challenge-card">
                <div className="infra-challenge-icon">{c.icon}</div>
                <h3 className="infra-challenge-title">{c.title}</h3>
                <p className="infra-challenge-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR APPROACH ── */}
      <section className="infra-section infra-section--gray">
        <div className="infra-section-inner">
          <span className="infra-badge">OUR APPROACH</span>
          <h2 className="infra-section-title">End-to-End Capabilities Across the Compute Stack.</h2>
          <p className="infra-section-sub">
            From silicon platforms to facility-level engineering, we deliver a coherent,
            autonomous infrastructure layer that scales with your AI strategy.
          </p>
          <div className="infra-approach-list">
            {approachItems.map((item) => (
              <div key={item.num} className="infra-approach-item">
                <div className="infra-approach-num">{item.num}</div>
                <div className="infra-approach-content">
                  <h3 className="infra-approach-title">{item.title}</h3>
                  <p className="infra-approach-desc">{item.desc}</p>
                  <div className="infra-approach-bullets">
                    {item.bullets.map((b) => (
                      <div key={b} className="infra-approach-bullet">
                        <div className="infra-approach-bullet-dot">
                          <CheckIcon />
                        </div>
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE ── */}
      <section className="infra-section infra-section--white">
        <div className="infra-section-inner">
          <span className="infra-badge">WHO WE SERVE</span>
          <h2 className="infra-section-title">Trusted in Sectors Where Compute Must Just Work.</h2>
          <p className="infra-section-sub" style={{ marginBottom: 52 }} />
          <div className="infra-sectors-grid">
            {sectors.map((s) => (
              <div key={s.title} className="infra-sector-card">
                <h3 className="infra-sector-title">{s.title}</h3>
                <p className="infra-sector-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
function ActivityIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}
function GridIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  )
}
function LoaderIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" opacity="0.3" />
      <path d="M12 3a9 9 0 0 1 9 9" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
