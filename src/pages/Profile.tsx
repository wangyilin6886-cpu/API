import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import { useTheme } from '../theme/ThemeContext'
import { useToast } from '../components/Toast'
import Reveal from '../components/Reveal'
import ModelPicker from '../components/ModelPicker'
import { isLoggedIn, listKeys, createKey, revokeKey, fetchUsage, fetchMe, fetchTransactions, type ApiKey, type UsageStats, type Transaction } from '../lib/auth'
import './pages.css'

const W = 320, H = 120, PAD = 12
const R = 54, C = 2 * Math.PI * R
const MODEL_COLORS = ['#5dcaa5', '#d97757', '#5b6cff', '#185fa5', '#10a37f', '#9b59b6']

function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

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
  const [pickerOpen, setPickerOpen] = useState(false)
  const [allowedModels, setAllowedModels] = useState<string[]>([])

  // ---- Real usage / balance / billing ----
  const [usageData, setUsageData] = useState<UsageStats | null>(null)
  const [balanceCents, setBalanceCents] = useState<number | null>(null)
  const [unlimited, setUnlimited] = useState(false)
  const [accountScope, setAccountScope] = useState<string[] | null>(null)
  const [txns, setTxns] = useState<Transaction[]>([])

  useEffect(() => {
    if (!isLoggedIn()) { nav('/login'); return }
  }, [nav])

  useEffect(() => {
    fetchUsage(7).then(setUsageData).catch(() => setUsageData(null))
    fetchMe()
      .then((u) => {
        setBalanceCents(u?.balanceCents ?? null)
        setUnlimited(!!u?.unlimited)
        setAccountScope(u?.allowedModels ?? null)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (tab !== 'Billing') return
    fetchTransactions().then(setTxns).catch(() => setTxns([]))
  }, [tab])

  const balanceUsd = balanceCents != null ? (balanceCents / 100).toFixed(2) : '—'
  const usageByKey = useMemo(
    () => new Map((usageData?.byKey ?? []).map((k) => [k.keyId, k])),
    [usageData],
  )

  // Build the area-chart geometry from real daily data.
  const chart = useMemo(() => {
    const daily = usageData?.daily ?? []
    if (daily.length === 0) return null
    const max = Math.max(...daily.map((d) => d.tokens), 1)
    const n = daily.length
    const pts = daily.map((d, i) => {
      const x = PAD + (i * (W - 2 * PAD)) / Math.max(n - 1, 1)
      const y = H - 12 - (d.tokens / max) * (H - 30)
      return [x, y] as const
    })
    const linePath = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
    const areaPath = `${linePath} L${pts[n - 1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z`
    return { pts, linePath, areaPath, labels: daily.map((d) => d.day.slice(5)) }
  }, [usageData])

  // Build donut segments from per-model totals.
  const donut = useMemo(() => {
    const models = (usageData?.byModel ?? []).filter((m) => m.tokens > 0)
    const total = models.reduce((s, m) => s + m.tokens, 0)
    if (total === 0) return []
    let acc = 0
    return models.map((m, i) => {
      const pct = (m.tokens / total) * 100
      const seg = {
        name: m.model,
        v: Math.round(pct),
        c: MODEL_COLORS[i % MODEL_COLORS.length],
        dash: (pct / 100) * C,
        offset: -(acc / 100) * C,
      }
      acc += pct
      return seg
    })
  }, [usageData])

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
      const res = await createKey('Default', allowedModels)
      setNewKey(res.key)
      setAllowedModels([])
      setPickerOpen(false)
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
            <div className="stat-card glass">
              <div className="label">{t('profile.balance')}</div>
              <div className="value gradient-text">{unlimited ? '∞' : `$${balanceUsd}`}</div>
              <div className="sub">{unlimited ? t('profile.unlimited') : 'USD'}</div>
            </div>
            <div className="stat-card glass"><div className="label">{t('profile.used')}</div><div className="value">{fmtTokens(usageData?.totalTokens ?? 0)}</div><div className="sub">Tokens · {usageData?.days ?? 7}d</div></div>
            <div className="stat-card glass"><div className="label">{t('profile.inout')}</div><div className="value gradient-text">{fmtTokens(usageData?.totalInput ?? 0)} / {fmtTokens(usageData?.totalOutput ?? 0)}</div><div className="sub">In / Out</div></div>
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
                  {chart ? (
                    <>
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
                        <motion.path d={chart.areaPath} fill="url(#areaFill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} />
                        <motion.path d={chart.linePath} fill="none" stroke="url(#areaLine)" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
                        {chart.pts.map((p, i) => (
                          <motion.circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#fff" stroke="#185fa5" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.08 }} />
                        ))}
                      </svg>
                      <div className="area-labels">{chart.labels.map((l, i) => <span key={i}>{l}</span>)}</div>
                    </>
                  ) : (
                    <div style={{ padding: 30, color: 'var(--ink-soft)', textAlign: 'center' }}>{t('profile.noUsage')}</div>
                  )}
                </div>
                <div className="panel glass">
                  <div className="panel-head"><h3>{t('profile.dist')}</h3></div>
                  {donut.length > 0 ? (
                    <div className="donut-wrap">
                      <svg className="donut" viewBox="0 0 140 140">
                        <circle cx="70" cy="70" r={R} fill="none" stroke="var(--bg-alt)" strokeWidth="16" />
                        {donut.map((s) => (
                          <circle key={s.name} cx="70" cy="70" r={R} fill="none" stroke={s.c} strokeWidth="16" strokeDasharray={`${s.dash} ${C - s.dash}`} strokeDashoffset={s.offset} transform="rotate(-90 70 70)" />
                        ))}
                      </svg>
                      <div className="donut-legend">
                        {donut.map((d) => (
                          <div className="legend-row" key={d.name}>
                            <span className="legend-dot" style={{ background: d.c }} />
                            <span className="legend-name">{d.name}</span>
                            <span className="legend-val">{d.v}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: 30, color: 'var(--ink-soft)', textAlign: 'center' }}>{t('profile.noUsage')}</div>
                  )}
                </div>

                <div className="panel glass span-2">
                  <div className="panel-head"><h3>{t('profile.byKey')}</h3></div>
                  {(usageData?.byKey?.length ?? 0) === 0 ? (
                    <div style={{ padding: 20, color: 'var(--ink-soft)' }}>{t('profile.noUsage')}</div>
                  ) : (
                    <>
                      <div className="bykey-table">
                        <div className="bykey-head">
                          <span>{t('api.colName')}</span>
                          <span>{t('api.colKey')}</span>
                          <span>{t('profile.inTokens')}</span>
                          <span>{t('profile.outTokens')}</span>
                          <span>{t('profile.total')}</span>
                        </div>
                        {usageData!.byKey.map((k) => (
                          <div className="bykey-row" key={k.keyId}>
                            <span className="bk-name">{k.name}</span>
                            <span className="bk-hint">{k.keyHint}</span>
                            <span>{fmtTokens(k.input)}</span>
                            <span>{fmtTokens(k.output)}</span>
                            <strong>{fmtTokens(k.tokens)}</strong>
                          </div>
                        ))}
                      </div>
                      <p className="bykey-note">{t('profile.byKeyNote')}</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {tab === 'Keys' && (
              <div className="panel glass">
                <div className="panel-head">
                  <h3>{t('profile.keys')}</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-ghost" style={{ padding: '8px 18px', fontSize: 14 }} onClick={() => setPickerOpen((o) => !o)}>
                      {t('mp.scope')}{allowedModels.length > 0 ? ` (${allowedModels.length})` : ''}
                    </button>
                    <button className="btn-ghost" style={{ padding: '8px 18px', fontSize: 14 }} onClick={handleCreate} disabled={creating}>
                      + {creating ? '...' : t('profile.create')}
                    </button>
                  </div>
                </div>

                {accountScope?.length ? (
                  <div className="key-warn">{t('mp.accountScope')} {accountScope.join(', ')}</div>
                ) : null}

                {pickerOpen && <ModelPicker value={allowedModels} onChange={setAllowedModels} accountScope={accountScope} />}

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
                      <span className="key-val">
                        {k.keyHint}
                        <span className="key-scope">
                          {k.allowedModels?.length ? k.allowedModels.join(', ') : t('mp.unrestrictedShort')}
                        </span>
                      </span>
                      <span className="key-usage">
                        {fmtTokens(usageByKey.get(k.id)?.tokens ?? 0)}
                        <span className="key-usage-sub">{t('profile.keyUsage')}</span>
                      </span>
                      <button className="key-copy" style={{ color: 'var(--blue)' }} onClick={() => handleRevoke(k.id)}>{t('profile.revoke')}</button>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'Billing' && (
              <div className="panel glass">
                <div className="panel-head"><h3>{t('profile.records')}</h3></div>
                {txns.length === 0 ? (
                  <div style={{ padding: 20, color: 'var(--ink-soft)' }}>{t('profile.noTxns')}</div>
                ) : (
                  txns.map((r) => (
                    <div className="record-row" key={r.id}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{t(`profile.${r.type}`)}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 3 }}>{new Date(r.createdAt).toLocaleString()}</div>
                      </div>
                      <span className="amt" style={{ color: 'var(--teal)' }}>+ ${(r.amountCents / 100).toFixed(2)}</span>
                    </div>
                  ))
                )}
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
