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
const keys = [
  { name: 'Production', val: 'sk-nx-prod-9f3a2b7c8d1e4f6a0b5c2d9e' },
  { name: 'Development', val: 'sk-nx-dev-2c4e6a8b0d1f3e5a7c9b1d3f' },
]
const records = [
  { d: '2026-05-18', desc: 'GPT-4o · 调用', amt: '-¥12.40' },
  { d: '2026-05-17', desc: '充值 · 标准版', amt: '+¥99.00' },
  { d: '2026-05-15', desc: 'Claude Opus · 调用', amt: '-¥28.60' },
  { d: '2026-05-12', desc: 'DeepSeek-V3 · 调用', amt: '-¥3.20' },
]

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
            <div className="stat-card glass"><div className="label">{t('profile.calls')}</div><div className="value">18,392</div><div className="sub">+12% ↑</div></div>
          </div>
        </Reveal>

        <div className="profile-cols">
          <div>
            <Reveal>
              <div className="panel glass">
                <div className="panel-head"><h3>{t('profile.usage')}</h3></div>
                <div className="chart">
                  {usage.map((u, i) => (
                    <div className="bar-wrap" key={u.d}>
                      <motion.div className="bar" initial={{ height: 0 }} animate={{ height: `${u.v}%` }} transition={{ duration: 0.7, delay: i * 0.08 }} />
                      <span className="bar-label">{u.d}</span>
                    </div>
                  ))}
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
            <Reveal delay={0.15}>
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
