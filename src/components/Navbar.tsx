import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import { useTheme } from '../theme/ThemeContext'
import { LANGS, Lang } from '../i18n/translations'
import './Navbar.css'

export default function Navbar() {
  const { t, lang, setLang } = useI18n()
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const loc = useLocation()
  const nav = useNavigate()
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!langOpen) return
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [langOpen])

  const goHome = (hash?: string) => {
    setMenuOpen(false)
    if (loc.pathname !== '/') {
      nav('/' + (hash ? '#' + hash : ''))
      if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 80)
    } else if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <button className="logo" onClick={() => goHome()}>
        <span className="logo-mark" />
        <span className="logo-text gradient-text">EcoAPI</span>
      </button>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <button onClick={() => goHome()}>{t('nav.home')}</button>
        <Link to="/profile" onClick={() => setMenuOpen(false)}>{t('nav.profile')}</Link>
        <Link to="/recharge" onClick={() => setMenuOpen(false)}>{t('nav.recharge')}</Link>

        <div className="lang-wrap" ref={langRef}>
          <button className="lang-btn" onClick={() => setLangOpen((o) => !o)}>
            <GlobeIcon /> {LANGS.find((l) => l.code === lang)?.label}
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div
                className="lang-menu glass"
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
              >
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    className={l.code === lang ? 'active' : ''}
                    onClick={() => { setLang(l.code as Lang); setLangOpen(false) }}
                  >
                    {l.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="theme-btn" onClick={toggle} aria-label="toggle theme">
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        <Link to="/login" className="login-btn" onClick={() => setMenuOpen(false)}>
          {t('nav.login')}
        </Link>
      </div>

      <button className="burger" onClick={() => setMenuOpen((o) => !o)} aria-label="menu">
        <span /><span /><span />
      </button>
    </motion.nav>
  )
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}
function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18" />
    </svg>
  )
}
