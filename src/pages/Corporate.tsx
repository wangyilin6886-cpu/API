import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import ContactModal from '../components/ContactModal'
import './Corporate.css'

const Sphere3D = lazy(() => import('../components/Sphere3D'))

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

const leaderboardRows = [
  { rank: 1, name: 'Hy3 preview', tokens: '2.4T' },
  { rank: 2, name: 'Claude Opus 4.7', tokens: '1.5T' },
  { rank: 3, name: 'Claude Sonnet 4.6', tokens: '1.5T' },
  { rank: 4, name: 'DeepSeek V4 Flash', tokens: '1.4T' },
  { rank: 5, name: 'Kimi K2.6', tokens: '1.2T' },
]

const bizSections = [
  {
    id: 'ai-infra',
    badgeKey: 'biz.infra.badge',
    titleKey: 'biz.infra.title',
    descKey: 'biz.infra.desc',
    cards: [
      { titleKey: 'biz.infra.c1.title', descKey: 'biz.infra.c1.desc', linkKey: 'biz.infra.c1.link' as string | undefined },
      { titleKey: 'biz.infra.c2.title', descKey: 'biz.infra.c2.desc', linkKey: undefined },
    ],
  },
  {
    id: 'ai-agent',
    badgeKey: 'biz.agent.badge',
    titleKey: 'biz.agent.title',
    descKey: 'biz.agent.desc',
    cards: [
      { titleKey: 'biz.agent.c1.title', descKey: 'biz.agent.c1.desc', linkKey: undefined },
      { titleKey: 'biz.agent.c2.title', descKey: 'biz.agent.c2.desc', linkKey: undefined },
    ],
  },
  {
    id: 'ai-token',
    badgeKey: 'biz.token.badge',
    titleKey: 'biz.token.title',
    descKey: 'biz.token.desc',
    cards: [
      { titleKey: 'biz.token.c1.title', descKey: 'biz.token.c1.desc', linkKey: undefined },
      { titleKey: 'biz.token.c2.title', descKey: 'biz.token.c2.desc', linkKey: undefined },
    ],
  },
]

export default function Corporate() {
  const { t } = useI18n()
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <main className="corp-main">
      {/* ===== HERO ===== */}
      <section className="corp-hero">
        <div className="corp-sphere-bg" aria-hidden="true">
          <Suspense fallback={<div className="sphere-fallback" />}>
            <Sphere3D />
          </Suspense>
        </div>
        <div className="corp-hero-overlay" />

        <motion.div
          className="corp-hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            {t('corp.hero.eyebrow')}
          </motion.span>
          <h1 className="corp-hero-title gradient-text">{t('corp.hero.title')}</h1>
          <p className="corp-hero-sub">{t('corp.hero.subtitle')}</p>
          <div className="corp-hero-btns">
            <motion.button
              className="btn-grad"
              onClick={() => setContactOpen(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {t('corp.hero.cta1')}
            </motion.button>
            <button className="btn-ghost" style={{ opacity: 0.55, cursor: 'default', pointerEvents: 'none' }}>
              {t('corp.hero.cta2')}
            </button>
          </div>
        </motion.div>

        <motion.div
          className="corp-scroll-hint"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ===== ECO QUOTE + STATS ===== */}
      <section className="corp-eco-section">
        <div className="container">
          <Reveal>
            <blockquote className="corp-eco-quote">
              {t('corp.eco.q1')}
              <strong>{t('corp.eco.qBold')}</strong>
              {t('corp.eco.q2')}
            </blockquote>
          </Reveal>
          <div className="corp-eco-stats">
            {[
              { num: <>3</>, key: 'corp.eco.stat1' },
              { num: <>AI<sup>3</sup></>, key: 'corp.eco.stat2' },
              { num: <>&infin;</>, key: 'corp.eco.stat3' },
            ].map((s, i) => (
              <Reveal key={s.key} delay={0.1 + i * 0.1}>
                <div className="corp-eco-stat">
                  <div className="corp-eco-stat-num">{s.num}</div>
                  <div className="corp-eco-stat-label">{t(`${s.key}.label`)}</div>
                  <div className="corp-eco-stat-sub">{t(`${s.key}.sub`)}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHAT WE DO: THREE PILLARS ===== */}
      <section className="corp-pillars-section">
        <div className="container">
          <Reveal>
            <span className="corp-pillars-badge">{t('corp.pillars.badge')}</span>
            <h2 className="corp-pillars-title">{t('corp.pillars.title')}</h2>
          </Reveal>
          <div className="corp-pillars-grid">
            {[
              { icon: <PillarGlobe />, key: 'corp.pillar1' },
              { icon: <PillarChart />, key: 'corp.pillar2' },
              { icon: <PillarBox />, key: 'corp.pillar3' },
            ].map((p, i) => (
              <Reveal key={p.key} delay={0.1 + i * 0.1}>
                <div className="corp-pillar-card">
                  <div className="corp-pillar-icon">{p.icon}</div>
                  <h3 className="corp-pillar-title">{t(`${p.key}.title`)}</h3>
                  <p className="corp-pillar-desc">{t(`${p.key}.desc`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INDUSTRY NEWS ===== */}
      <section className="corp-news-section">
        <div className="container">
          <Reveal>
            <div className="corp-section-header">
              <h2 className="corp-section-title">{t('corp.news.title')}</h2>
            </div>
            <p className="corp-section-sub">{t('corp.news.subtitle')}</p>
          </Reveal>
          <div className="corp-news-grid">
            {/* Card 1: OpenRouter Leaderboard */}
            <Reveal delay={0.1}>
              <article className="corp-news-card glass">
                <div className="corp-news-visual" style={{ backgroundImage: 'url(/news1.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <span className="corp-news-live-badge">{t('corp.news.1.badge')}</span>
                </div>
                <div className="corp-news-body">
                  <div className="corp-news-meta">
                    <span className="corp-news-tag">{t('corp.news.1.tag')}</span>
                    <span className="corp-news-date">{t('corp.news.1.date')}</span>
                  </div>
                  <h3 className="corp-news-title">{t('corp.news.1.title')}</h3>
                  <p className="corp-news-desc">{t('corp.news.1.desc')}</p>
                  <a className="corp-news-link corp-news-link--active" href="https://openrouter.ai/rankings" target="_blank" rel="noopener noreferrer">
                    {t('corp.news.1.link')}
                  </a>
                </div>
              </article>
            </Reveal>

            {/* Card 2: Reuters China – DeepSeek × Huawei */}
            <Reveal delay={0.2}>
              <article className="corp-news-card glass">
                <div className="corp-news-visual" style={{ backgroundImage: 'url(/news2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <span className="corp-news-live-badge">{t('corp.news.2.badge')}</span>
                </div>
                <div className="corp-news-body">
                  <div className="corp-news-meta">
                    <span className="corp-news-tag">{t('corp.news.2.tag')}</span>
                    <span className="corp-news-date">{t('corp.news.2.date')}</span>
                  </div>
                  <h3 className="corp-news-title">{t('corp.news.2.title')}</h3>
                  <p className="corp-news-desc">{t('corp.news.2.desc')}</p>
                  <Link to="/article/deepseek-huawei" className="corp-news-link corp-news-link--active">{t('corp.news.2.link')}</Link>
                </div>
              </article>
            </Reveal>

            {/* Card 3: Reuters Policy – H200 */}
            <Reveal delay={0.3}>
              <article className="corp-news-card glass">
                <div className="corp-news-visual" style={{ backgroundImage: 'url(/news3.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <span className="corp-news-live-badge">{t('corp.news.3.badge')}</span>
                </div>
                <div className="corp-news-body">
                  <div className="corp-news-meta">
                    <span className="corp-news-tag">{t('corp.news.3.tag')}</span>
                    <span className="corp-news-date">{t('corp.news.3.date')}</span>
                  </div>
                  <h3 className="corp-news-title">{t('corp.news.3.title')}</h3>
                  <p className="corp-news-desc">{t('corp.news.3.desc')}</p>
                  <Link to="/article/h200-china" className="corp-news-link corp-news-link--active">{t('corp.news.3.link')}</Link>
                </div>
              </article>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="corp-why">
              <p className="corp-why-label">{t('corp.why.label')}</p>
              <p className="corp-why-body">{t('corp.why.body')}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== BIZ SECTIONS: AI INFRA / AGENT / TOKEN ===== */}
      {bizSections.map((sec, si) => (
        <section
          key={sec.id}
          id={sec.id}
          className={`biz-section${si % 2 === 1 ? ' biz-section-alt' : ''}`}
        >
          <div className="container biz-split">
            <div className="biz-left">
              <Reveal>
                <span className="biz-badge">{t(sec.badgeKey)}</span>
                <h2 className="biz-title">{t(sec.titleKey)}</h2>
                <p className="biz-desc">{t(sec.descKey)}</p>
              </Reveal>
            </div>
            <div className="biz-right">
              {sec.cards.map((card, ci) => (
                <Reveal key={ci} delay={0.15 + ci * 0.1}>
                  <div className="biz-card">
                    <h3 className="biz-card-title">{t(card.titleKey)}</h3>
                    <p className="biz-card-desc">{t(card.descKey)}</p>
                    {card.linkKey && (
                      <span className="biz-card-link">{t(card.linkKey)}</span>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ===== FOOTER ===== */}
      <footer id="about" className="site-footer">
        <div className="container">
          <div className="sf-top">
            <div className="sf-brand">
              <div className="logo">
                <img className="logo-mark" src="/rootlogo.png" alt="EcoTech" style={{ width: 32, height: 32 }} />
                <span className="logo-text gradient-text">EcoTech</span>
              </div>
              <p>{t('footer.tagline')}</p>
            </div>
            <div className="sf-cols">
              <div className="sf-col">
                <h4>{t('foot.infra')}</h4>
                {(['foot.infra1', 'foot.infra2', 'foot.infra3', 'foot.infra4', 'foot.infra5'] as const).map((k) => (
                  <a key={k} href="#" onClick={(e) => e.preventDefault()}>{t(k)}</a>
                ))}
              </div>
              <div className="sf-col">
                <h4>{t('foot.agent')}</h4>
                {(['foot.agent1', 'foot.agent2', 'foot.agent3', 'foot.agent4'] as const).map((k) => (
                  <a key={k} href="#" onClick={(e) => e.preventDefault()}>{t(k)}</a>
                ))}
              </div>
              <div className="sf-col">
                <h4>{t('foot.token')}</h4>
                {['DeepSeek', 'Qwen', 'GLM', 'OpenAI', 'Anthropic'].map((m) => (
                  <Link key={m} to="/ecoapi">{m}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="sf-offices">
            <h4 className="sf-office-title">{t('footer.offices')}</h4>
            <div className="offices-grid">
              {[
                { cc: 'SG', name: t('footer.sg'), addr: '4 Fourth Avenue, #06-10, Singapore 268672' },
                { cc: 'ID', name: t('footer.id'), addr: 'Noble House 25th Floor, Jl. Dr. Ide Anak Agung Gede Agung Kav. E 4.2, No. 2, Lingkar Mega Kuningan, South Jakarta 12950' },
                { cc: 'CN', name: t('footer.cn'), addr: 'Unit 1252, Building 1 (Floors 5, 10, 11), No. 33 Courtyard, Guangshun North Street, Chaoyang District, Beijing' },
              ].map((o) => (
                <div className="office" key={o.cc}>
                  <div className="office-head">
                    <span className="office-cc">{o.cc}</span>
                    <strong>{o.name}</strong>
                  </div>
                  <p>{o.addr}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sf-copyright">{t('footer.copyright')}</div>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  )
}

function PillarGlobe() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18" />
    </svg>
  )
}
function PillarChart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 20V10M12 20V4M19 20v-6" />
    </svg>
  )
}
function PillarBox() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </svg>
  )
}
