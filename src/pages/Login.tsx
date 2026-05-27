import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import { useToast } from '../components/Toast'
import LogoMark from '../components/LogoMark'
import './pages.css'

export default function Login() {
  const { t } = useI18n()
  const nav = useNavigate()
  const toast = useToast()
  const [reg, setReg] = useState(false)
  useEffect(() => { document.title = 'ECOAPI - One Key Access Every Top LLM' }, [])
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [errs, setErrs] = useState<{ email?: string; pwd?: string }>({})

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: { email?: string; pwd?: string } = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t('login.errEmail')
    if (pwd.length < 6) next.pwd = t('login.errPwd')
    setErrs(next)
    if (Object.keys(next).length) return
    toast(t('login.success'), 'success')
    setTimeout(() => nav('/profile'), 700)
  }

  return (
    <div className="auth">
      <div className="blob" style={{ width: 420, height: 420, background: '#5dcaa5', top: -80, left: -60 }} />
      <div className="blob" style={{ width: 420, height: 420, background: '#185fa5', bottom: -80, right: -60 }} />
      <motion.div
        className="auth-card glass"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="logo" style={{ justifyContent: 'center', marginBottom: 18 }}>
          <LogoMark /><span className="logo-text gradient-text">EcoAPI</span>
        </div>
        <h1>{reg ? t('login.register') : t('login.title')}</h1>
        <p className="sub">{t('login.subtitle')}</p>

        <form onSubmit={submit} noValidate>
          <div className="field">
            <label>{t('login.email')}</label>
            <input className={errs.email ? 'invalid' : ''} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errs.email && <span className="field-err">{errs.email}</span>}
          </div>
          <div className="field">
            <label>{t('login.password')}</label>
            <input className={errs.pwd ? 'invalid' : ''} type="password" placeholder="••••••••" value={pwd} onChange={(e) => setPwd(e.target.value)} />
            {errs.pwd && <span className="field-err">{errs.pwd}</span>}
          </div>
          <button className="btn-grad" type="submit">{reg ? t('login.register') : t('login.submit')} →</button>
        </form>

        <div className="auth-divider">{t('login.or')}</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center', padding: '11px' }}>Google</button>
          <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center', padding: '11px' }}>GitHub</button>
        </div>

        <div className="auth-switch">
          {t('login.noAccount')} <a onClick={() => setReg((r) => !r)}>{reg ? t('login.submit') : t('login.register')}</a>
        </div>
      </motion.div>
    </div>
  )
}
