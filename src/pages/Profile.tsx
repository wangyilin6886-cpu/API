import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import Reveal from '../components/Reveal'
import './pages.css'

const usage = [
  { d: 'Mon', v: 62 }, { d: 'Tue', v: 78 }, { d: 'Wed', v: 45 },
  { d: 'Thu', v: 90 }, { d: 'Fri', v: 70 }, { d: 'Sat', v: 38 }, { d: 'Sun', v: 55 },
]
const dist = [
  { name: 'GPT-4o', v: 38, c: '#10a37f' },
  { name: 'Claude Opus', v: 27, c: '#d97757' },
  { name: 'DeepSeek-V3', v: 20, c: '#5b6cff' },
  { name: 'Others', v: 15, c: '#185fa5' },
]
const keys = [
  { name: 'Production', val: 'sk-eco-prod-9f3a2b7c8d1e4f6a0b5c2d9e' },
  { name: 'Development', val: 'sk-eco-dev-2c4e6a8b0d1f3e5a7c9b1d3f' },
]
const records = [
  { d: '2026-05-18', desc: 'GPT-4o · 调用', amt: '-¥12.40' },
  { d: '2026-05-17', desc: '充值 · 标准版', amt: '+¥99.00' },
  { d: '2026-05-15', desc: 'Claude Opus · 调用', amt: '-¥28.60' },
  { d: '2026-05-12', desc: 'DeepSeek-V3 · 调用', amt: '-¥3.20' },
]

const W = 320, H = 120, PAD = 12
const pts = usage.map((u, i) => {
  const x = PAD + (i * (W - 2 * PAD)) / (usage.length - 1)
  const y = H - 12 - (u.v / 100) * (H - 30)
  return [x, y] as const
})
const linePath = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
const areaPath = `${linePath} L${pts[pts.length - 1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z`

const R = 54, C = 2 * Math.PI * R
let acc = 0
const segs = dist.map((d) => {
  const seg = { ...d, dash: (d.v / 100) * C, offset: -(acc / 100) * C }
  acc += d.v
  return seg
})

export default function Profile() {
  const { t } = useI18n()
  const nav = useNavigate()
  const [copied, setCopied] = useState<number | null>(null)

  const copy = (val: string, i: number) => {
    navigator.clipboard?.writeText(val)
    setCopied(i)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="page">
      <div className="blob" style={{ width: 400, height: 400, background: '#5dcaa5', top: -100, right: -80 }} />
      <div className="page-inner">
        <Reveal><div className="page-head"><h1 className="gradient-text">{t('profile.title')}</h1></div></Reveal>

        <Reveal>
          <div className="stat-grid">
            <div className="stat-card glass"><div className="label">{t('profile.balance')}</div><div className="value gradient-text">¥1,284.50</div><div className="sub">≈ 128M Tokens</div></div>
            <div className="stat-card glass"><div className="label">{t('profile.used')}</div><div className="value">42.6M</div><div className="sub">Tokens</div></div>
            <div className="stat-card glass"><div className="label">{t('profile.estimate')}</div><div className="value gradient-text">¥486</div><div className="sub">{t('profile.estimateNote')}</div></div>
          </div>
        </Reveal>

        <div className="profile-cols">
          <div>
            <Reveal>
              <div className="panel glass">
                <div className="panel-head"><h3>{t('profile.usage')}</h3></div>
                <svg className="area-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#5dcaa5" stopOpacity="0.45" />
                      <stop offset="1" stopColor="#185fa5" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="areaLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#5dcaa5" />
                      <stop offset="1" stopColor="#185fa5" />
                    </linearGradient>
                  </defs>
                  <motion.path d={areaPath} fill="url(#areaFill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} />
                  <motion.path d={linePath} fill="none" stroke="url(#areaLine)" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
                  {pts.map((p, i) => (
                    <motion.circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#fff" stroke="#185fa5" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.08 }} />
                  ))}
                </svg>
                <div className="area-labels">
                  {usage.map((u) => <span key={u.d}>{u.d}</span>)}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="panel glass">
                <div className="panel-head"><h3>{t('profile.keys')}</h3><button className="btn-ghost" style={{ padding: '8px 18px', fontSize: 14 }}>+ {t('profile.create')}</button></div>
                {keys.map((k, i) => (
                  <div className="key-row" key={k.name}>
                    <span className="key-name">{k.name}</span>
                    <span className="key-val">{k.val}</span>
                    <button className="key-copy" onClick={() => copy(k.val, i)}>{copied === i ? t('profile.copied') : t('profile.copy')}</button>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <div>
            <Reveal delay={0.12}>
              <div className="panel glass">
                <div className="panel-head"><h3>{t('profile.dist')}</h3></div>
                <div className="donut-wrap">
                  <svg className="donut" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r={R} fill="none" stroke="var(--bg-alt)" strokeWidth="16" />
                    {segs.map((s) => (
                      <motion.circle
                        key={s.name}
                        cx="70" cy="70" r={R} fill="none" stroke={s.c} strokeWidth="16"
                        strokeDasharray={`${s.dash} ${C - s.dash}`}
                        strokeDashoffset={s.offset}
                        transform="rotate(-90 70 70)"
                        strokeLinecap="butt"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
                      />
                    ))}
                  </svg>
                  <div className="donut-legend">
                    {dist.map((d) => (
                      <div className="legend-row" key={d.name}>
                        <span className="legend-dot" style={{ background: d.c }} />
                        <span className="legend-name">{d.name}</span>
                        <span className="legend-val">{d.v}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="panel glass">
                <div className="panel-head"><h3>{t('profile.records')}</h3></div>
                {records.map((r) => (
                  <div className="record-row" key={r.d + r.desc}>
                    <div><div style={{ fontWeight: 600 }}>{r.desc}</div><div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 3 }}>{r.d}</div></div>
                    <span className="amt" style={{ color: r.amt.startsWith('+') ? 'var(--teal)' : 'var(--blue)' }}>{r.amt}</span>
                  </div>
                ))}
                <button className="btn-grad" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} onClick={() => nav('/recharge')}>{t('profile.recharge')} →</button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}
