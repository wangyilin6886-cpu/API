import { useState, useEffect, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import Tilt from '../components/Tilt'
import LogoMark from '../components/LogoMark'
import { models, modelCats, partners, consumeRank, abilityRank, rankTotals, rootWall, testimonials, scenarios, compareRows, comparePlans, compliance } from '../data'
import './Home.css'

const Sphere3D = lazy(() => import('../components/Sphere3D'))

export default function Home() {
  const { t } = useI18n()
  const nav = useNavigate()
  const [yearly, setYearly] = useState(false)
  const [cat, setCat] = useState<string>('all')
  const [online, setOnline] = useState(1287)
  const [callsToday, setCallsToday] = useState(2384012)

  useEffect(() => {
    const id = setInterval(() => {
      setOnline((o) => Math.max(900, o + Math.floor(Math.random() * 11) - 4))
      setCallsToday((c) => c + Math.floor(Math.random() * 40) + 5)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  const shownModels = models.filter((m) => cat === 'all' || m.cats.includes(cat))

  return (
    <main className="home">
      {/* ===== 1. HERO ===== */}
      <section className="section hero" id="hero">
        <div className="blob" style={{ width: 460, height: 460, background: '#185fa5', top: -120, left: -100 }} />
        <div className="blob" style={{ width: 420, height: 420, background: '#5dcaa5', bottom: -120, right: 60 }} />
        <div className="container hero-grid">
          <div className="hero-text">
            <motion.span className="eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="pulse-dot" /> {t('hero.tag')}
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
              {(() => {
                const title = t('hero.title')
                const ci = title.search(/[，,]/)
                const first = ci >= 0 ? title.slice(0, ci) : ''
                const second = ci >= 0 ? title.slice(ci + 1).trim() : title
                return (
                  <>
                    {first && <>{first}<br /></>}
                    <span className="gradient-text">{second}</span>
                  </>
                )
              })()}
            </motion.h1>
            <motion.p className="hero-sub" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              {t('hero.subtitle')}
            </motion.p>
            <motion.div className="hero-btns" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
              <button className="btn-grad" onClick={() => nav('/api')}>{t('hero.getApi')} →</button>
              <button className="btn-ghost" onClick={() => nav('/chat')}>{t('hero.tryNow')}</button>
            </motion.div>
            <motion.p className="hero-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.4 }}>
              <CheckIcon /> {t('hero.note')}
            </motion.p>
            <motion.div className="hero-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
              <div><strong className="gradient-text"><CountUp to={50} suffix="+" /></strong><span>{t('hero.stat1')}</span></div>
              <div><strong className="gradient-text"><CountUp to={200} suffix="ms" /></strong><span>{t('hero.stat2')}</span></div>
              <div><strong className="gradient-text"><CountUp to={99.99} decimals={2} suffix="%" /></strong><span>{t('hero.stat3')}</span></div>
            </motion.div>
            <motion.div className="hero-trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.65 }}>
              <span className="hero-trust-label">{t('hero.trustedBy')}</span>
              {['OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Qwen'].map((v) => (
                <span className="hero-trust-logo" key={v}>{v}</span>
              ))}
            </motion.div>
            <motion.div className="hero-live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }}>
              <span className="live-dot" /> <strong>{online.toLocaleString()}</strong> {t('live.online')}
              <span className="live-sep">·</span>
              <strong>{callsToday.toLocaleString()}</strong> {t('live.today')}
            </motion.div>
          </div>
          <motion.div className="hero-sphere" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}>
            <Suspense fallback={<div className="sphere-fallback" />}>
              <Sphere3D />
            </Suspense>
            <div className="sphere-glow" />
          </motion.div>
        </div>
      </section>

      {/* ===== 2. WHY US ===== */}
      <section className="section why" id="why">
        <div className="blob" style={{ width: 420, height: 420, background: '#5dcaa5', top: -60, left: -100 }} />
        <div className="blob" style={{ width: 380, height: 380, background: '#185fa5', bottom: -80, right: -60 }} />
        <Reveal><h2 className="section-title">{t('why.title')}</h2></Reveal>
        <Reveal delay={0.08}><p className="section-subtitle">{t('why.subtitle')}</p></Reveal>
        <Reveal delay={0.14}><p className="why-fill">{t('why.fill')}</p></Reveal>
        <div className="container why-grid">
          {[1, 2, 3, 4].map((n, i) => (
            <Reveal key={n} delay={i * 0.1} className="why-card-wrap">
              <Tilt className="why-card glass">
                <span className="why-num">0{n}</span>
                <div className="why-top">
                  <div className="why-icon">{whyIcons[i]}</div>
                  <div className="why-stat">
                    <strong className="gradient-text">{t(`why.${n}.stat`)}</strong>
                    <span>{t(`why.${n}.statLabel`)}</span>
                  </div>
                </div>
                <h3>{t(`why.${n}.title`)}</h3>
                <p>{t(`why.${n}.desc`)}</p>
                <ul className="why-points">
                  <li><CheckIcon />{t(`why.${n}.b1`)}</li>
                  <li><CheckIcon />{t(`why.${n}.b2`)}</li>
                </ul>
                <div className="why-glow" />
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== SCENARIOS + CONSOLE PREVIEW ===== */}
      <section className="section scen" id="scenarios">
        <Reveal><span className="eyebrow">{t('preview.tag')}</span></Reveal>
        <Reveal delay={0.06}><h2 className="section-title" style={{ marginTop: 18 }}>{t('preview.title')}</h2></Reveal>
        <Reveal delay={0.1}><p className="section-subtitle">{t('preview.desc')}</p></Reveal>

        <Reveal delay={0.14} className="preview-wrap">
          <div className="console glass">
            <div className="console-bar">
              <span className="dot r" /><span className="dot y" /><span className="dot g" />
              <span className="console-url">app.ecoapi.ai/dashboard</span>
            </div>
            <div className="console-body">
              <div className="console-side">
                <span className="console-logo"><LogoMark /></span>
                <span className="cs-item active" /><span className="cs-item" /><span className="cs-item" /><span className="cs-item" />
              </div>
              <div className="console-main">
                <div className="console-cards">
                  <div className="cc"><span className="cc-label">{t('profile.balance')}</span><strong className="gradient-text">¥1,284</strong></div>
                  <div className="cc"><span className="cc-label">{t('profile.used')}</span><strong>42.6M</strong></div>
                  <div className="cc"><span className="cc-label">{t('profile.calls')}</span><strong>18,392</strong></div>
                </div>
                <div className="console-chart">
                  <svg viewBox="0 0 400 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5dcaa5" stopOpacity="0.5" /><stop offset="1" stopColor="#185fa5" stopOpacity="0.04" /></linearGradient>
                    </defs>
                    <path d="M0 90 L50 70 L100 80 L150 45 L200 58 L250 30 L300 48 L350 22 L400 38 L400 120 L0 120 Z" fill="url(#cf)" />
                    <path d="M0 90 L50 70 L100 80 L150 45 L200 58 L250 30 L300 48 L350 22 L400 38" fill="none" stroke="#185fa5" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}><h2 className="section-title" style={{ marginTop: 90 }}>{t('scen.title')}</h2></Reveal>
        <Reveal delay={0.14}><p className="section-subtitle">{t('scen.subtitle')}</p></Reveal>
        <div className="container scen-grid">
          {scenarios.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.08} className="scen-wrap">
              <Tilt className="scen-card glass">
                <span className="scen-icon" style={{ background: s.color }}>{scenIcons[i]}</span>
                <h3>{t(`scen.${s.id}.t`)}</h3>
                <p>{t(`scen.${s.id}.d`)}</p>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== 3. PRICING ===== */}
      <section className="section pricing" id="pricing">
        <div className="blob" style={{ width: 380, height: 380, background: '#5dcaa5', top: 40, right: -80 }} />
        <Reveal><h2 className="section-title">{t('pricing.title')}</h2></Reveal>
        <Reveal delay={0.1}><p className="section-subtitle">{t('pricing.subtitle')}</p></Reveal>
        <Reveal delay={0.14}>
          <div className="bill-toggle" onClick={() => setYearly((y) => !y)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setYearly((y) => !y) } }} role="switch" aria-checked={yearly} tabIndex={0}>
            <span className={!yearly ? 'active' : ''}>{t('pricing.monthly')}</span>
            <span className={`bill-knob ${yearly ? 'on' : ''}`} />
            <span className={yearly ? 'active' : ''}>{t('pricing.yearly')}</span>
            <em className="bill-save">{t('pricing.save')}</em>
          </div>
        </Reveal>
        <div className="container pricing-grid">
          {plans.map((p, i) => {
            const base = Number(p.price)
            const shown = yearly ? Math.round(base * 0.8) : base
            return (
            <Reveal key={p.id} delay={i * 0.08} className="plan-wrap">
              <div className={`plan glass ${p.popular ? 'popular' : ''}`}>
                {p.popular && <span className="plan-badge">{t('pricing.popular')}</span>}
                <h3>{t(`pricing.${p.id}.name`)}</h3>
                <div className="plan-price">
                  {p.id === 'ent'
                    ? <span className="contact">{t('pricing.ent.price')}</span>
                    : <><span className="cur">¥</span><strong>{shown}</strong><span className="unit">{t('pricing.unit')}</span></>}
                </div>
                <ul>
                  {[1, 2, 3, 4].map((f) => (
                    <li key={f}><CheckIcon />{t(`pricing.${p.id}.f${f}`)}</li>
                  ))}
                </ul>
                <button className={p.popular ? 'btn-grad' : 'btn-ghost'} onClick={() => nav('/recharge')}>
                  {t('pricing.buy')}
                </button>
              </div>
            </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.1} className="compare-wrap">
          <h3 className="compare-title">{t('compare.title')}</h3>
          <div className="compare-table glass">
            <div className="compare-row compare-head">
              <span />
              {comparePlans.map((p) => <span key={p} className="compare-plan">{t(`pricing.${p}.name`)}</span>)}
            </div>
            {compareRows.map((row) => (
              <div className="compare-row" key={row.key}>
                <span className="compare-feat">{t(row.key)}</span>
                {row.vals.map((v, i) => (
                  <span className="compare-cell" key={i}>
                    {typeof v === 'boolean'
                      ? (v ? <CheckIcon /> : <span className="compare-x">—</span>)
                      : (typeof v === 'string' && v.startsWith('compare.') ? t(v) : v)}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ===== 4. MODELS ===== */}
      <section className="section models" id="models">
        <Reveal><h2 className="section-title">{t('models.title')}</h2></Reveal>
        <Reveal delay={0.1}><p className="section-subtitle">{t('models.subtitle')}</p></Reveal>
        <Reveal delay={0.14}>
          <div className="model-filters">
            {modelCats.map((c) => (
              <button key={c} className={`model-filter ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
                {t(`models.cat.${c}`)}
              </button>
            ))}
          </div>
        </Reveal>
        <motion.div layout className="container models-grid">
          <AnimatePresence mode="popLayout">
            {shownModels.map((m) => (
              <motion.div
                key={m.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="model-wrap"
              >
                <Tilt className="model-card glass">
                  <div className="model-head">
                    <span className="model-dot" style={{ background: m.color }} />
                    <div>
                      <h3>{m.name}</h3>
                      <span className="model-vendor">{m.vendor}</span>
                    </div>
                    <span className="model-tag">{m.tag}</span>
                  </div>
                  <div className="model-stats">
                    <div><span>{t('models.ctx')}</span><strong>{m.ctx}</strong></div>
                    <div><span>{t('models.in')}</span><strong>{m.cin}</strong></div>
                    <div><span>{t('models.out')}</span><strong>{m.cout}</strong></div>
                  </div>
                  <button className="model-call" onClick={() => nav('/chat')}>{t('models.call')} →</button>
                </Tilt>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ===== 5. PARTNERS ===== */}
      <section className="section partners" id="partners">
        <div className="blob" style={{ width: 460, height: 460, background: '#185fa5', bottom: -80, left: -80 }} />
        <div className="blob" style={{ width: 420, height: 420, background: '#5dcaa5', top: -40, right: -80 }} />
        <Reveal><h2 className="section-title">{t('partners.title')}</h2></Reveal>
        <Reveal delay={0.1}><p className="section-subtitle">{t('partners.subtitle')}</p></Reveal>
        <div className="partners-orbit">
          <div className="orbit-ring r1" />
          <div className="orbit-ring r2" />
          <div className="orbit-ring r3" />
          <motion.div
            className="orbit-center"
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="orbit-count gradient-text">{t('partners.count')}</span>
            <span className="orbit-eco">{t('partners.eco')}</span>
          </motion.div>
          {partners.map((p, i) => {
            const inner = i < 6
            const idx = inner ? i : i - 6
            const total = inner ? 6 : 9
            const radius = inner ? 27 : 44
            const angle = (idx / total) * Math.PI * 2 - Math.PI / 2 + (inner ? 0 : 0.34)
            const x = 50 + radius * Math.cos(angle)
            const y = 50 + radius * Math.sin(angle) * 0.96
            return (
              <div
                key={p}
                className="orbit-slot"
                style={{ left: `${x}%`, top: `${y}%`, ['--d' as string]: `${i * 0.16}s` }}
              >
                <div className="orbit-float" style={{ ['--d' as string]: `${i * 0.3}s` }}>
                  <div className="orbit-chip glass">
                    <span className="orbit-logo" style={{ background: i % 2 ? 'var(--grad)' : 'linear-gradient(120deg,#185fa5,#5dcaa5)' }}>{p[0]}</span>
                    <span className="orbit-name">{p}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="container testi-grid">
          {testimonials.map((tm, i) => (
            <Reveal key={tm.company} delay={i * 0.1} className="testi-wrap">
              <div className="testi-card glass">
                <span className="testi-mark">“</span>
                <p className="testi-quote">{t(tm.q)}</p>
                <div className="testi-foot">
                  <span className="testi-avatar" style={{ background: tm.color }}>{tm.company[0]}</span>
                  <div>
                    <span className="testi-author">{t(tm.a)}</span>
                    <span className="testi-company">{tm.company}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="compliance-wrap">
          <span className="compliance-title">{t('compliance.title')}</span>
          <div className="compliance-row">
            {compliance.map((c) => (
              <span className="compliance-badge" key={c}><ShieldIcon /> {c}</span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ===== 6. LEADERBOARD ===== */}
      <section className="section rank" id="rank">
        <div className="blob" style={{ width: 440, height: 440, background: '#185fa5', top: -40, right: -100, opacity: 0.5 }} />
        <div className="blob" style={{ width: 380, height: 380, background: '#5dcaa5', bottom: -80, left: -80, opacity: 0.35 }} />
        <Reveal><h2 className="section-title">{t('rank.title')}</h2></Reveal>
        <Reveal delay={0.08}><p className="section-subtitle">{t('rank.subtitle')}</p></Reveal>
        <Reveal delay={0.14}><p className="rank-intro">{t('rank.intro')}</p></Reveal>

        <Reveal delay={0.18} className="rank-totals-wrap">
          <div className="container rank-totals">
            {rankTotals.map((s) => (
              <div className="rank-total" key={s.key}>
                <strong className="gradient-text"><CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} /></strong>
                <span>{t(s.key)}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="container rank-grid">
          <Reveal className="rank-col">
            <RankCard t={t} icon={<FireIcon />} title={t('rank.consume')}
              items={consumeRank.map((r) => ({ name: r.name, vendor: r.vendor, bar: r.value, val: r.tokens, trend: r.trend, up: r.up }))} />
          </Reveal>
          <Reveal delay={0.15} className="rank-col">
            <RankCard t={t} icon={<StarIcon />} title={t('rank.ability')}
              items={abilityRank.map((r) => ({ name: r.name, vendor: r.vendor, bar: r.score, val: String(r.score), trend: r.trend, up: r.up }))} />
          </Reveal>
        </div>
      </section>

      {/* ===== 7. ROOT / ABOUT + FOOTER ===== */}
      <section className="section root" id="root">
        <Reveal><h2 className="section-title">{t('root.title')}</h2></Reveal>
        <Reveal delay={0.1}><p className="section-subtitle">{t('root.subtitle')}</p></Reveal>

        <Reveal delay={0.14} className="data-wall-wrap">
          <div className="container data-wall glass">
            {rootWall.map((w) => (
              <div className="data-cell" key={w.key}>
                <strong className="gradient-text"><CountUp to={w.to} prefix={w.prefix} suffix={w.suffix} /></strong>
                <span>{t(w.key)}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="container steps">
          <div className="steps-track">
            <motion.div className="steps-track-fill" initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1.4, ease: 'easeOut' }} />
          </div>
          {[1, 2, 3].map((s, i) => (
            <Reveal key={s} delay={i * 0.12} className="step-wrap">
              <div
                className="step glass clickable"
                onClick={() => nav(stepRoutes[i])}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nav(stepRoutes[i]) } }}
                role="link"
                tabIndex={0}
              >
                <span className="step-num gradient-text">0{s}</span>
                <h3>{t(`root.step${s}.t`)}</h3>
                <p>{t(`root.step${s}.d`)}</p>
                <span className="step-go">{t('hero.getApi') && '→'}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="container faq">
          <Reveal><h3 className="faq-title">{t('root.faqTitle')}</h3></Reveal>
          {[1, 2, 3].map((f, i) => (
            <Reveal key={f} delay={i * 0.08} className="faq-item-wrap">
              <details className="faq-item glass">
                <summary>{t(`root.faq${f}.q`)}<span className="faq-plus">+</span></summary>
                <p>{t(`root.faq${f}.a`)}</p>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal className="cta-wrap">
          <div className="cta glass">
            <h3>{t('root.cta')}</h3>
            <button className="btn-grad" onClick={() => nav('/login')}>{t('root.ctaBtn')} →</button>
          </div>
        </Reveal>

      </section>

      {/* ===== BLACK FOOTER ===== */}
      <footer className="site-footer">
        <div className="container">
          <div className="sf-top">
            <div className="sf-brand">
              <div className="logo"><LogoMark /><span className="logo-text gradient-text">EcoAPI</span></div>
              <p>{t('footer.tagline')}</p>
            </div>
            <div className="sf-cols">
              <div className="sf-col">
                <h4>{t('foot.infra')}</h4>
                {['foot.infra1', 'foot.infra2', 'foot.infra3', 'foot.infra4', 'foot.infra5'].map((k) => (
                  <a key={k} href="#" onClick={(e) => e.preventDefault()}>{t(k)}</a>
                ))}
              </div>
              <div className="sf-col">
                <h4>{t('foot.agent')}</h4>
                {['foot.agent1', 'foot.agent2', 'foot.agent3', 'foot.agent4'].map((k) => (
                  <a key={k} href="#" onClick={(e) => e.preventDefault()}>{t(k)}</a>
                ))}
              </div>
              <div className="sf-col">
                <h4>{t('foot.token')}</h4>
                {['DeepSeek', 'Qwen', 'GLM', 'OpenAI', 'Anthropic'].map((m) => (
                  <a key={m} onClick={() => nav('/api')}>{m}</a>
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
                  <div className="office-head"><span className="office-cc">{o.cc}</span><strong>{o.name}</strong></div>
                  <p>{o.addr}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sf-copyright">{t('footer.copyright')}</div>
      </footer>
    </main>
  )
}

const stepRoutes = ['/login', '/api', '/chat']

const plans = [
  { id: 'free', price: '0', popular: false },
  { id: 'std', price: '99', popular: true },
  { id: 'pro', price: '499', popular: false },
  { id: 'ent', price: '', popular: false },
]

const whyIcons = [
  <svg key={0} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  <svg key={1} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
  <svg key={2} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  <svg key={3} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" /><path d="M9 12l2 2 4-4" /></svg>,
]

const scenIcons = [
  <svg key={0} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-3.6A8.4 8.4 0 1 1 21 11.5z" /></svg>,
  <svg key={1} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v12H7l-3 4z" /><path d="M8 9h8M8 12h5" /></svg>,
  <svg key={2} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" /></svg>,
  <svg key={3} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>,
  <svg key={4} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5h12M9 3v2M5 5c0 6 3 9 7 11M11 11c-1 3-3 5-6 6M14 21l4-9 4 9M16 18h4" /></svg>,
  <svg key={5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>,
]

function ShieldIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" /><path d="M9 12l2 2 4-4" /></svg>
}

interface RankItem { name: string; vendor: string; bar: number; val: string; trend: string; up: boolean }

function RankCard({ t, icon, title, items }: { t: (k: string) => string; icon: JSX.Element; title: string; items: RankItem[] }) {
  const [champ, ...rest] = items
  return (
    <div className="rank-card glass">
      <div className="rank-card-head">
        <span className="rank-icon">{icon}</span>
        <h3>{title}</h3>
      </div>

      <div className="champion">
        <span className="champ-crown"><CrownIcon /></span>
        <span className="champ-tag">{t('rank.champion')}</span>
        <div className="champ-body">
          <div className="champ-meta">
            <span className="champ-name">{champ.name}</span>
            <span className="champ-vendor">{champ.vendor}</span>
          </div>
          <div className="champ-num">
            <span className="champ-val">{champ.val}</span>
            <span className={`rank-trend ${champ.up ? 'up' : 'down'}`}>{champ.up ? '▲' : '▼'} {champ.trend}</span>
          </div>
        </div>
        <div className="rank-bar champ-bar">
          <motion.div className="rank-fill" initial={{ width: 0 }} whileInView={{ width: `${champ.bar}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: 'easeOut' }} />
        </div>
      </div>

      {rest.map((r, i) => (
        <div className="rank-row" key={r.name}>
          <span className={`rank-pos p${i + 2}`}>{i + 2}</span>
          <div className="rank-meta">
            <span className="rank-name">{r.name}</span>
            <span className="rank-vendor">{r.vendor}</span>
          </div>
          <div className="rank-bar">
            <motion.div className="rank-fill" initial={{ width: 0 }} whileInView={{ width: `${r.bar}%` }} viewport={{ once: true }} transition={{ duration: 1.1, delay: i * 0.1, ease: 'easeOut' }} />
          </div>
          <div className="rank-num">
            <span className="rank-val">{r.val}</span>
            <span className={`rank-trend ${r.up ? 'up' : 'down'}`}>{r.up ? '▲' : '▼'} {r.trend}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function CrownIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M3 18h18l-1.5-9-4.5 4-3.5-6-3.5 6-4.5-4L3 18z" /></svg>
}
function CheckIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><path d="M5 12l4 4L19 6" /></svg>
}
function FireIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M12 2c1 4-2 5-2 8a2 2 0 0 0 4 0c2 2 3 4 3 6a5 5 0 0 1-10 0c0-4 4-6 5-14z" /></svg>
}
function StarIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M12 2l3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7L2 9.5 9 9z" /></svg>
}
