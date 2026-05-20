import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'
import Reveal from '../components/Reveal'
import './pages.css'

export default function ApiDocs() {
  const { t } = useI18n()
  const nav = useNavigate()
  const [copied, setCopied] = useState(false)
  const key = 'sk-nx-prod-9f3a2b7c8d1e4f6a0b5c2d9e'

  const copy = () => {
    navigator.clipboard?.writeText(key)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="page">
      <div className="blob" style={{ width: 380, height: 380, background: '#5dcaa5', top: -80, right: -60 }} />
      <div className="page-inner">
        <Reveal>
          <div className="page-head">
            <button className="btn-ghost" style={{ padding: '8px 18px', fontSize: 14, marginBottom: 20 }} onClick={() => nav('/')}>← {t('api.back')}</button>
            <h1 className="gradient-text">{t('api.title')}</h1>
            <p>{t('api.subtitle')}</p>
          </div>
        </Reveal>

        <Reveal>
          <div className="panel glass">
            <div className="doc-field">
              <span className="dlabel">{t('api.key')}</span>
              <code>{key}</code>
              <button className="key-copy" onClick={copy}>{copied ? t('profile.copied') : t('profile.copy')}</button>
            </div>
            <div className="doc-field">
              <span className="dlabel">{t('api.base')}</span>
              <code>https://api.nextoken.ai/v1</code>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="panel glass">
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{t('api.example')}</h3>
            <div className="code-block">
              <span className="tk-key">curl</span> https://api.nextoken.ai/v1/chat/completions \<br />
              &nbsp;&nbsp;-H <span className="tk-str">"Authorization: Bearer {key}"</span> \<br />
              &nbsp;&nbsp;-H <span className="tk-str">"Content-Type: application/json"</span> \<br />
              &nbsp;&nbsp;-d <span className="tk-str">{'\'{'}</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="tk-str">"model": "claude-opus-4-7",</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="tk-str">"messages": [{'{'}"role": "user", "content": "Hello!"{'}'}]</span><br />
              &nbsp;&nbsp;<span className="tk-str">{'}\''}</span>
            </div>

            <div className="code-block">
              <span className="tk-key">from</span> openai <span className="tk-key">import</span> OpenAI<br /><br />
              client = <span className="tk-fn">OpenAI</span>(<br />
              &nbsp;&nbsp;api_key=<span className="tk-str">"{key}"</span>,<br />
              &nbsp;&nbsp;base_url=<span className="tk-str">"https://api.nextoken.ai/v1"</span><br />
              )<br /><br />
              resp = client.chat.completions.<span className="tk-fn">create</span>(<br />
              &nbsp;&nbsp;model=<span className="tk-str">"gpt-4o"</span>,<br />
              &nbsp;&nbsp;messages=[{'{'}<span className="tk-str">"role"</span>: <span className="tk-str">"user"</span>, <span className="tk-str">"content"</span>: <span className="tk-str">"Hello!"</span>{'}'}]<br />
              )<br />
              <span className="tk-fn">print</span>(resp.choices[0].message.content)
            </div>

            <button className="btn-grad" onClick={() => nav('/chat')}>{t('hero.tryNow')} →</button>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
