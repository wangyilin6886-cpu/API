import { useState, useEffect } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { useToast } from '../components/Toast'
import Reveal from '../components/Reveal'
import './pages.css'

const amounts = [
  { v: 50, bonus: 0 },
  { v: 100, bonus: 5 },
  { v: 300, bonus: 30 },
  { v: 500, bonus: 60 },
  { v: 1000, bonus: 150 },
  { v: 2000, bonus: 400 },
]

export default function Recharge() {
  const { t } = useI18n()
  const toast = useToast()
  const [sel, setSel] = useState(2)
  const [custom, setCustom] = useState('')
  useEffect(() => { document.title = 'ECOAPI - One Key Access Every Top LLM' }, [])
  const [method, setMethod] = useState('alipay')

  const base = custom ? Number(custom) || 0 : amounts[sel].v
  const bonus = custom ? Math.floor(Number(custom) * 0.1) || 0 : amounts[sel].bonus

  const pay = () => {
    if (!base || base <= 0) { toast(t('recharge.errAmount'), 'error'); return }
    toast(t('recharge.success'), 'success')
  }

  return (
    <div className="page">
      <div className="blob" style={{ width: 380, height: 380, background: '#185fa5', bottom: -60, left: -60 }} />
      <div className="page-inner">
        <Reveal><div className="page-head"><h1 className="gradient-text">{t('recharge.title')}</h1><p>{t('recharge.subtitle')}</p></div></Reveal>
        <div className="recharge-cols">
          <div>
            <Reveal>
              <div className="amount-grid">
                {amounts.map((a, i) => (
                  <div key={a.v} className={`amount-card ${!custom && sel === i ? 'active' : ''}`} onClick={() => { setSel(i); setCustom('') }}>
                    <div className="amt">¥{a.v}</div>
                    {a.bonus > 0 && <div className="bonus">{t('recharge.bonus')} ¥{a.bonus}</div>}
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <input className="custom-input" type="number" placeholder={t('recharge.custom') + ' (¥)'} value={custom} onChange={(e) => setCustom(e.target.value)} />
            </Reveal>
            <Reveal delay={0.15}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>{t('recharge.method')}</h3>
              <div className="method-list">
                {[
                  { id: 'alipay', label: 'Alipay', icon: '支', color: '#1677ff' },
                  { id: 'wechat', label: 'WeChat Pay', icon: '微', color: '#07c160' },
                  { id: 'card', label: 'Credit Card', icon: '卡', color: '#185fa5' },
                ].map((m) => (
                  <div key={m.id} className={`method ${method === m.id ? 'active' : ''}`} onClick={() => setMethod(m.id)}>
                    <span className="method-icon" style={{ background: m.color }}>{m.icon}</span>
                    {m.label}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="summary-card glass">
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>{t('recharge.confirm')}</h3>
              <div className="summary-row"><span>{t('recharge.title')}</span><span>¥{base.toFixed(2)}</span></div>
              <div className="summary-row"><span>{t('recharge.bonus')}</span><span style={{ color: 'var(--teal)', fontWeight: 700 }}>+ ¥{bonus.toFixed(2)}</span></div>
              <div className="summary-row"><span>{t('recharge.tokens')}</span><span style={{ fontWeight: 700 }}>≈ {((base + bonus) * 0.1).toFixed(1)}M</span></div>
              <div className="summary-total"><span>{t('recharge.total')}</span><strong className="gradient-text">¥{base.toFixed(2)}</strong></div>
              <button className="btn-grad" style={{ width: '100%', justifyContent: 'center' }} onClick={pay}>{t('recharge.confirm')}</button>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
