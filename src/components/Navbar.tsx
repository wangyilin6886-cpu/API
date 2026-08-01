import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import { useTheme } from '../theme/ThemeContext'
import LogoMark from './LogoMark'
import ContactModal from './ContactModal'
import { LANGS, Lang } from '../i18n/translations'
import { getCurrentEmail, clearToken } from '../lib/auth'
import './Navbar.css'

export default function Navbar() {
  const { t, lang, setLang } = useI18n()
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const loc = useLocation()
  const nav = useNavigate()
  const langRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState<string | null>(null)

  const isCorporate = loc.pathname === '/' || loc.pathname === '/ai-infra'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Re-read on every navigation so logging in (redirect to /profile) or
  // logging out immediately flips the navbar between "Login" and the avatar.
  useEffect(() => { setEmail(getCurrentEmail()) }, [loc.pathname])

  useEffect(() => {
    if (!langOpen) return
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [langOpen])

  useEffect(() => {
    if (!userOpen) return
    const onClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [userOpen])

  const handleLogout = () => {
    clearToken()
    setEmail(null)
    setUserOpen(false)
    setMenuOpen(false)
    nav('/')
  }

  const scrollToSection = (hash: string) => {
    setMenuOpen(false)
    if (loc.pathname !== '/') {
      nav('/')
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 120)
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const goGateway = () => {
    setMenuOpen(false)
    if (loc.pathname !== '/ecoapi') nav('/ecoapi')
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogo = () => {
    setMenuOpen(false)
    if (isCorporate) window.scrollTo({ top: 0, behavior: 'smooth' })
    else nav('/')
  }

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <button className="logo" onClick={handleLogo}>
          {isCorporate ? (
            <img src={theme === 'dark' ? '/logoblack.png' : '/logowhite.png'} alt="EcoTech" style={{ height: 38, width: 'auto', display: 'block' }} />
          ) : (
            <>
              <LogoMark />
              <span className="logo-text gradient-text">EcoAPI</span>
            </>
          )}
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {isCorporate ? (
            <>
              <button onClick={() => { setMenuOpen(false); nav('/ai-infra') }} className="nav-chevron-item">
                {t('corp.nav.infra')}<ChevronDown />
              </button>
              <button onClick={() => scrollToSection('ai-agent')} className="nav-chevron-item">
                {t('corp.nav.agent')}<ChevronDown />
              </button>
              <a href="https://www.ecoapi.ai/ecoapi" onClick={() => setMenuOpen(false)} className="nav-chevron-item">
                {t('corp.nav.token')}<ChevronDown />
              </a>
              <button onClick={() => scrollToSection('overview')}>{t('corp.nav.about')}</button>
            </>
          ) : (
            <>
              <button onClick={() => { setMenuOpen(false); nav('/') }}>{t('nav.home')}</button>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>{t('nav.profile')}</Link>
              <Link to="/recharge" onClick={() => setMenuOpen(false)}>{t('nav.recharge')}</Link>
            </>
          )}

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

          {isCorporate ? (
            <button
              className="btn-grad nav-demo-btn"
              onClick={() => { setMenuOpen(false); setContactOpen(true) }}
            >
              {t('corp.getDemo')}
            </button>
          ) : email ? (
            <div className="user-wrap" ref={userRef}>
              <button className="nav-avatar" onClick={() => setUserOpen((o) => !o)} title={email}>
                {email.charAt(0).toUpperCase()}
              </button>
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    className="user-menu glass"
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="user-menu-email">{email}</div>
                    <Link to="/profile" onClick={() => { setUserOpen(false); setMenuOpen(false) }}>
                      {t('nav.profile')}
                    </Link>
                    <button className="user-menu-logout" onClick={handleLogout}>{t('nav.logout')}</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="login-btn" onClick={() => setMenuOpen(false)}>
              {t('nav.login')}
            </Link>
          )}
        </div>

        <button className="burger" onClick={() => setMenuOpen((o) => !o)} aria-label="menu">
          <span /><span /><span />
        </button>
      </motion.nav>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}

function ChevronDown() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 3, marginTop: 1, flexShrink: 0 }}>
      <path d="M6 9l6 6 6-6" />
    </svg>
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
