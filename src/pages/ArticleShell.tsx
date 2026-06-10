import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export function BackArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}

export function ArticleProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setPct(max > 0 ? Math.min(100, Math.max(0, (h.scrollTop / max) * 100)) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <div className="art-progress" style={{ width: `${pct}%` }} />
}

export function ArticleNav() {
  return (
    <nav className="art-nav">
      <Link to="/" className="art-back">
        <BackArrow /> EcoTech
      </Link>
      <span className="art-nav-brand">Industry Intelligence</span>
    </nav>
  )
}

export function ArticleFooter() {
  return (
    <footer className="art-footer">
      <Link to="/" className="art-footer-back">
        <BackArrow /> Back to EcoTech
      </Link>
      <p className="art-footer-copy">© 2026 Global EcoTech Systems · Industry Intelligence</p>
    </footer>
  )
}
