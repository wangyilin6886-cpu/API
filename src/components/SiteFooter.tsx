import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'

export default function SiteFooter() {
  const { t } = useI18n()
  const nav = useNavigate()
  const loc = useLocation()

  const goSection = (id: string) => {
    if (loc.pathname !== '/') {
      nav('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer id="about" className="site-footer">
      <div className="container">
        <div className="sf-top">
          <div className="sf-brand">
            <div className="logo">
              <img src="/superxblack.png" alt="SuperXIndo" style={{ height: 30, width: 'auto', maxWidth: 'min(380px, 80vw)', display: 'block' }} />
            </div>
            <p>{t('footer.tagline')}</p>
          </div>
          <div className="sf-cols">
            <div className="sf-col">
              <h4 className="sf-col-link" onClick={() => goSection('ai-infra')}>{t('foot.infra')}</h4>
              {(['foot.infra1', 'foot.infra2', 'foot.infra3', 'foot.infra4', 'foot.infra5'] as const).map((k) => (
                <a key={k} href="#" onClick={(e) => e.preventDefault()}>{t(k)}</a>
              ))}
            </div>
            <div className="sf-col">
              <h4 className="sf-col-link" onClick={() => goSection('ai-agent')}>{t('foot.agent')}</h4>
              {(['foot.agent1', 'foot.agent2', 'foot.agent3', 'foot.agent4'] as const).map((k) =>
                k === 'foot.agent2'
                  ? <a key={k} href="https://www.castrel.ai/" target="_blank" rel="noopener noreferrer">{t(k)}</a>
                  : <a key={k} href="#" onClick={(e) => e.preventDefault()}>{t(k)}</a>
              )}
            </div>
            <div className="sf-col">
              <h4 className="sf-col-link"><Link to="/superapi">{t('foot.token')}</Link></h4>
              {['DeepSeek', 'Qwen', 'GLM', 'OpenAI', 'Anthropic'].map((m) => (
                <Link key={m} to="/superapi">{m}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="sf-copyright">{t('footer.copyright')}</div>
    </footer>
  )
}
