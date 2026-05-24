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

const newsCards = [
  { grad: 'linear-gradient(135deg, #0f2540 0%, #185fa5 55%, #5dcaa5 100%)', label: 'DeepSeek × Huawei' },
  { grad: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 45%, #0f3060 100%)', label: 'NVIDIA H200' },
  { grad: 'linear-gradient(135deg, #185fa5 0%, #5dcaa5 65%, #0f2540 100%)', label: 'EcoTech' },
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

      {/* ===== INDUSTRY NEWS ===== */}
      <section className="corp-news-section">
        <div className="container">
          <Reveal>
            <h2 className="corp-section-title">{t('corp.news.title')}</h2>
            <p className="corp-section-sub">{t('corp.news.subtitle')}</p>
          </Reveal>
          <div className="corp-news-grid">
            {([1, 2, 3] as const).map((i) => (
              <Reveal key={i} delay={i * 0.1}>
                <article className="corp-news-card glass">
                  <div className="corp-news-img" style={{ background: newsCards[i - 1].grad }}>
                    <span className="corp-news-img-label">{newsCards[i - 1].label}</span>
                  </div>
                  <div className="corp-news-body">
                    <div className="corp-news-meta">
                      <span className="corp-news-tag">{t(`corp.news.${i}.tag`)}</span>
                      <span className="corp-news-date">{t(`corp.news.${i}.date`)}</span>
                    </div>
                    <h3 className="corp-news-title">{t(`corp.news.${i}.title`)}</h3>
                    <p className="corp-news-desc">{t(`corp.news.${i}.desc`)}</p>
                    <span className="corp-news-link">{t('corp.news.readMore')}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
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
