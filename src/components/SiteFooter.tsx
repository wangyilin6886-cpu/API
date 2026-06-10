import { useNavigate, useLocation } from 'react-router-dom'
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
              <img src="/logoblack.png" alt="EcoTech" style={{ height: 40, width: 'auto', display: 'block' }} />
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
              <h4 className="sf-col-link"><a href="https://www.ecoapi.ai/ecoapi">{t('foot.token')}</a></h4>
              {['DeepSeek', 'Qwen', 'GLM', 'OpenAI', 'Anthropic'].map((m) => (
                <a key={m} href="https://www.ecoapi.ai/ecoapi">{m}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="sf-offices">
          <h4 className="sf-office-title">{t('footer.offices')}</h4>
          <div className="offices-grid">
            {[
              { cc: 'SG', name: t('footer.sg'), addr: '4 Fourth Avenue, #06-10, Singapore 268672' },
              { cc: 'ID', name: t('footer.id'), addr: 'Noble House 25th Floor, Jl. Dr. Ide Anak Agung Gede Agung Kav. E 4.2, No. 2, Lingkar Mega Kuningan, South Jakarta 12950' },
              { cc: 'CN', name: t('footer.cn'), addr: 'Unit 1252, Building 1 (Floors 5, 10, 11), No. 33 Courtyard, Guangshun North Street, Chaoyang District, Beijing' },
            ].map((o) => (
              <div className="office" key={o.cc}>
                <div className="office-head">
                  <span className="office-cc">{o.cc}</span>
                  <strong>{o.name}</strong>
                </div>
                <p>{o.addr}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sf-copyright">{t('footer.copyright')}</div>
    </footer>
  )
}
