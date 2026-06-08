import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import { useTheme } from '../theme/ThemeContext'
import { useToast } from '../components/Toast'
import Reveal from '../components/Reveal'
import { isLoggedIn, listKeys, createKey, revokeKey, type ApiKey } from '../lib/auth'
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
const records = [
  { d: '2026-05-18', name: 'GPT-4o', type: 'call', amt: '-¥12.40' },
  { d: '2026-05-17', name: 'pricing.std.name', type: 'topup', amt: '+¥99.00' },
  { d: '2026-05-15', name: 'Claude Opus', type: 'call', amt: '-¥28.60' },
  { d: '2026-05-12', name: 'DeepSeek-V3', type: 'call', amt: '-¥3.20' },
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

const TABS = ['Usage', 'Keys', 'Billing', 'Settings'] as const
type Tab = typeof TABS[number]

export default function Profile() {
  const { t } = useI18n()
  const nav = useNavigate()
  const { theme, toggle } = useTheme()
  const toast = useToast()
  useEffect(() => { document.title = 'ECOAPI - One Key Access Every Top LLM' }, [])
  const [tab, setTab] = useState<Tab>('Usage')
  const [copied, setCopied] = useState<string | null>(null)

  // ---- Real API keys ----
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [keysLoading, setKeysLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn()) { nav('/login'); return }
  }, [nav])

  useEffect(() => {
    if (tab !== 'Keys') return
    setKeysLoading(true)
    listKeys()
      .then(setKeys)
      .catch((e) => toast(e instanceof Error ? e.message : '加载失败', 'error'))
      .finally(() => setKeysLoading(false))
  }, [tab, toast])

  const handleCreate = async () => {
    setCreating(true)
    try {
      const res = await createKey('Default')
      setNewKey(res.key)
      setKeys(await listKeys())
    } catch (e) {
      toast(e instanceof Error ? e.message : '创建失败', 'error')
    } finally {
      setCreating(false)
    }
  }

  const handleRevoke = async (id: string) => {
    try {
      await revokeKey(id)
      setKeys((ks) => ks.filter((k) => k.id !== id))
      toast(t('profile.revoked'), 'success')
    } catch (e) {
      toast(e instanceof Error ? e.message : '撤销失败', 'error')
    }
  }

  const copy = (val: string, id: string) => {
    navigator.clipboard?.writeText(val)
    setCopied(id)
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

        <Reveal delay={0.08}>
          <div className="tab-bar">
            {TABS.map((tb) => (
              <button key={tb} className={`tab-btn ${tab === tb ? 'active' : ''}`} onClick={() => setTab(tb)}>
                {t(`profile.tab${tb}`)}
              </button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {tab === 'Usage' && (
              <div className="profile-cols">
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
                    <motion.path d={areaPath} fill="url(#areaFill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} />
                    <motion.path d={linePath} fill="none" stroke="url(#areaLine)" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
                    {pts.map((p, i) => (
                      <motion.circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#fff" stroke="#185fa5" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.08 }} />
                    ))}
                  </svg>
                  <div className="area-labels">{usage.map((u) => <span key={u.d}>{u.d}</span>)}</div>
                </div>
                <div className="panel glass">
                  <div className="panel-head"><h3>{t('profile.dist')}</h3></div>
                  <div className="donut-wrap">
                    <svg className="donut" viewBox="0 0 140 140">
                      <circle cx="70" cy="70" r={R} fill="none" stroke="var(--bg-alt)" strokeWidth="16" />
                      {segs.map((s) => (
                        <circle key={s.name} cx="70" cy="70" r={R} fill="none" stroke={s.c} strokeWidth="16" strokeDasharray={`${s.dash} ${C - s.dash}`} strokeDashoffset={s.offset} transform="rotate(-90 70 70)" />
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
              </div>
            )}

            {tab === 'Keys' && (
              <div className="panel glass">
                <div className="panel-head">
                  <h3>{t('profile.keys')}</h3>
                  <button className="btn-ghost" style={{ padding: '8px 18px', fontSize: 14 }} onClick={handleCreate} disabled={creating}>
                    + {creating ? '...' : t('profile.create')}
                  </button>
                </div>

                {newKey && (
                  <div className="key-reveal">
                    <div className="key-reveal-warn">{t('profile.keyOnce')}</div>
                    <div className="key-reveal-row">
                      <code>{newKey}</code>
                      <button className="key-copy" onClick={() => copy(newKey, 'new')}>{copied === 'new' ? t('profile.copied') : t('profile.copy')}</button>
                    </div>
                    <button className="key-reveal-done" onClick={() => setNewKey(null)}>{t('profile.keyDone')}</button>
                  </div>
                )}

                {keysLoading ? (
                  <div style={{ padding: 20, color: 'var(--ink-soft)' }}>{t('profile.loading')}</div>
                ) : keys.length === 0 ? (
                  <div style={{ padding: 20, color: 'var(--ink-soft)' }}>{t('profile.noKeys')}</div>
                ) : (
                  keys.map((k) => (
                    <div className="key-row" key={k.id}>
                      <span className="key-name">{k.name}</span>
                      <span className="key-val">{k.keyHint}</span>
                      <button className="key-copy" style={{ color: 'var(--blue)' }} onClick={() => handleRevoke(k.id)}>{t('profile.revoke')}</button>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'Billing' && (
              <div className="panel glass">
                <div className="panel-head"><h3>{t('profile.records')}</h3></div>
                {records.map((r) => (
                  <div className="record-row" key={r.d + r.name}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{(r.name.startsWith('pricing.') ? t(r.name) : r.name) + ' · ' + t(`profile.${r.type}`)}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 3 }}>{r.d}</div>
                    </div>
                    <span className="amt" style={{ color: r.amt.startsWith('+') ? 'var(--teal)' : 'var(--blue)' }}>{r.amt}</span>
                  </div>
                ))}
                <button className="btn-grad" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} onClick={() => nav('/recharge')}>{t('profile.recharge')} →</button>
              </div>
            )}

            {tab === 'Settings' && (
              <div className="panel glass" style={{ maxWidth: 560 }}>
                <div className="field">
                  <label>{t('profile.nickname')}</label>
                  <input defaultValue="EcoAPI User" />
                </div>
                <div className="field">
                  <label>{t('login.email')}</label>
                  <input type="email" defaultValue="you@example.com" />
                </div>
                <div className="setting-row">
                  <span>{t('profile.notify')}</span>
                  <label className="switch"><input type="checkbox" defaultChecked /><span className="switch-track" /></label>
                </div>
                <div className="setting-row">
                  <span>{t('profile.theme')}</span>
                  <label className="switch"><input type="checkbox" checked={theme === 'dark'} onChange={toggle} /><span className="switch-track" /></label>
                </div>
                <button className="btn-grad" style={{ marginTop: 18 }} onClick={() => toast(t('profile.saved'), 'success')}>{t('profile.save')}</button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
