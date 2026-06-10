import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'
import { useToast } from '../components/Toast'
import Reveal from '../components/Reveal'
import { isLoggedIn, fetchPacks, startCheckout, type Pack } from '../lib/auth'
import './pages.css'

export default function Recharge() {
  const { t } = useI18n()
  const toast = useToast()
  const nav = useNavigate()
  useEffect(() => { document.title = 'SUPERAPI - One Key Access Every Top LLM' }, [])

  const [packs, setPacks] = useState<Pack[]>([])
  const [sel, setSel] = useState(0)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) { nav('/login'); return }
    fetchPacks().then(setPacks).catch(() => setPacks([]))
  }, [nav])

  const pay = async () => {
    const pack = packs[sel]
    if (!pack) return
    setBusy(true)
    try {
      const url = await startCheckout(pack.id)
      window.location.href = url // redirect to Polar's hosted checkout
    } catch (e) {
      toast(e instanceof Error ? e.message : '支付失败', 'error')
      setBusy(false)
    }
  }

  const current = packs[sel]

  return (
    <div className="page">
      <div className="blob" style={{ width: 380, height: 380, background: '#185fa5', bottom: -60, left: -60 }} />
      <div className="page-inner">
        <Reveal><div className="page-head"><h1 className="gradient-text">{t('recharge.title')}</h1><p>{t('recharge.subtitle')}</p></div></Reveal>
        <div className="recharge-cols">
          <div>
            <Reveal>
              <div className="amount-grid">
                {packs.map((p, i) => (
                  <div key={p.id} className={`amount-card ${sel === i ? 'active' : ''}`} onClick={() => setSel(i)}>
                    <div className="amt">${p.usd}</div>
                    <div className="bonus">{p.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>{t('recharge.method')}</h3>
              <div className="method-list">
                <div className="method active">
                  <span className="method-icon" style={{ background: '#185fa5' }}>💳</span>
                  {t('recharge.card')}
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="summary-card glass">
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>{t('recharge.confirm')}</h3>
              <div className="summary-row"><span>{t('recharge.title')}</span><span>{current ? current.label : '—'}</span></div>
              <div className="summary-total"><span>{t('recharge.total')}</span><strong className="gradient-text">${current ? current.usd.toFixed(2) : '0.00'}</strong></div>
              <button className="btn-grad" style={{ width: '100%', justifyContent: 'center' }} onClick={pay} disabled={busy || !current}>
                {busy ? '...' : t('recharge.confirm')}
              </button>
              <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 14, textAlign: 'center' }}>{t('recharge.securedBy')}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
