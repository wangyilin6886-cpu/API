import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import Reveal from '../components/Reveal'
import { useToast } from '../components/Toast'
import ModelPicker from '../components/ModelPicker'
import { isLoggedIn, listKeys, createKey, revokeKey, type ApiKey } from '../lib/auth'
import { FAMILIES, modelsOf, type Family } from '../lib/models'
import './pages.css'

// The www is required: the bare domain 307-redirects, and clients drop
// credentials across a cross-host redirect.
//
// Two base URLs, because clients differ in what they append. Claude Code and
// Codex append their own protocol path (/v1/messages, /responses), so they
// take the /api root. OpenAI-style clients append /chat/completions per the
// OpenAI convention, so they need the /v1 root.
const BASE_URL = 'https://www.ecoapi.ai/api'
const BASE_URL_OPENAI = 'https://www.ecoapi.ai/v1'

const ALL_FAMILIES = Object.keys(FAMILIES) as Family[]

const errors = [
  { c: '401', d: 'Unauthorized — 密钥无效或已撤销' },
  { c: '402', d: 'Payment Required — 余额不足，请充值' },
  { c: '500', d: 'Server Error — 服务端异常，请重试' },
  { c: '502', d: 'Bad Gateway — 上游暂时不可用' },
]

export default function ApiDocs() {
  const { t } = useI18n()
  const nav = useNavigate()
  const toast = useToast()
  const [tab, setTab] = useState<'keys' | 'docs'>('keys')
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [keysLoading, setKeysLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [allowedModels, setAllowedModels] = useState<string[]>([])
  useEffect(() => { document.title = 'ECOAPI - One Key Access Every Top LLM' }, [])
  const [newName, setNewName] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (val: string, id: string) => {
    navigator.clipboard?.writeText(val)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  useEffect(() => {
    if (tab !== 'keys' || !isLoggedIn()) return
    setKeysLoading(true)
    listKeys()
      .then(setKeys)
      .catch((e) => toast(e instanceof Error ? e.message : '加载失败', 'error'))
      .finally(() => setKeysLoading(false))
  }, [tab, toast])

  const handleCreate = async () => {
    setCreating(true)
    try {
      const res = await createKey(newName.trim() || 'Default', allowedModels)
      setNewKey(res.key)
      setKeys(await listKeys())
      setNewName('')
      setAllowedModels([])
      setPickerOpen(false)
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
    } catch (e) {
      toast(e instanceof Error ? e.message : '撤销失败', 'error')
    }
  }

  return (
    <div className="page api-page">
      <div className="blob" style={{ width: 400, height: 400, background: '#5dcaa5', top: -80, right: -60 }} />
      <div className="blob" style={{ width: 360, height: 360, background: '#185fa5', bottom: -80, left: -60 }} />
      <div className="page-inner">
        <Reveal>
          <div className="page-head">
            <button className="btn-ghost" style={{ padding: '8px 18px', fontSize: 14, marginBottom: 20 }} onClick={() => nav('/ecoapi')}>← {t('api.back')}</button>
            <h1 className="gradient-text">{t('api.title')}</h1>
            <p>{t('api.subtitle')}</p>
          </div>
        </Reveal>

        <div className="api-layout">
          <Reveal className="api-side-wrap">
            <aside className="api-side glass">
              <button className={tab === 'keys' ? 'active' : ''} onClick={() => setTab('keys')}>
                <KeyIcon /> {t('api.navKey')}
              </button>
              <button className={tab === 'docs' ? 'active' : ''} onClick={() => setTab('docs')}>
                <DocIcon /> {t('api.navDocs')}
              </button>
              <div className="api-side-card">
                <span className="api-side-base">{t('api.base')}</span>
                <code>{BASE_URL}</code>
                <button className="key-copy" style={{ marginTop: 10 }} onClick={() => copy(BASE_URL, 'base')}>
                  {copied === 'base' ? t('profile.copied') : t('profile.copy')}
                </button>
              </div>
              <button className="api-side-try" onClick={() => nav('/chat')}>{t('hero.tryNow')} →</button>
            </aside>
          </Reveal>

          <div className="api-content">
            <AnimatePresence mode="wait">
              {tab === 'keys' ? (
                <motion.div key="keys" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div className="panel glass">
                    <h2 className="api-h2">{t('api.keyTitle')}</h2>
                    <p className="api-desc">{t('api.keyDesc')}</p>

                    {!isLoggedIn() ? (
                      <div className="key-warn" style={{ justifyContent: 'space-between' }}>
                        <span><WarnIcon /> {t('api.loginRequired')}</span>
                        <button className="btn-grad" onClick={() => nav('/login')}>{t('nav.login')}</button>
                      </div>
                    ) : (
                      <>
                        <div className="key-create">
                          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={t('api.newKeyPlaceholder')} onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
                          <button className="btn-ghost" style={{ padding: '10px 18px', fontSize: 14, whiteSpace: 'nowrap' }} onClick={() => setPickerOpen((o) => !o)}>
                            {t('mp.scope')}{allowedModels.length > 0 ? ` (${allowedModels.length})` : ''}
                          </button>
                          <button className="btn-grad" onClick={handleCreate} disabled={creating}>+ {creating ? '...' : t('api.create')}</button>
                        </div>
                        {pickerOpen && <ModelPicker value={allowedModels} onChange={setAllowedModels} />}
                        <div className="key-warn"><WarnIcon /> {t('api.keyWarn')}</div>

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

                        <div className="key-table">
                          <div className="key-thead">
                            <span>{t('api.colName')}</span>
                            <span>{t('api.colKey')}</span>
                            <span>{t('mp.scope')}</span>
                            <span>{t('api.colCreated')}</span>
                            <span>{t('api.colStatus')}</span>
                            <span></span>
                          </div>
                          {keysLoading ? (
                            <div style={{ padding: 20, color: 'var(--ink-soft)' }}>{t('profile.loading')}</div>
                          ) : keys.length === 0 ? (
                            <div style={{ padding: 20, color: 'var(--ink-soft)' }}>{t('profile.noKeys')}</div>
                          ) : (
                            <AnimatePresence>
                              {keys.map((k) => (
                                <motion.div className="key-trow" key={k.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                                  <span className="kt-name">{k.name}</span>
                                  <span className="kt-key">{k.keyHint}</span>
                                  <span className="kt-dim" title={k.allowedModels?.join(', ')}>
                                    {k.allowedModels?.length ? k.allowedModels.join(', ') : t('mp.unrestrictedShort')}
                                  </span>
                                  <span className="kt-dim">{new Date(k.createdAt).toLocaleDateString()}</span>
                                  <span className="kt-status">● {t('api.active')}</span>
                                  <span className="kt-actions">
                                    <button className="kt-revoke" onClick={() => handleRevoke(k.id)}>{t('api.revoke')}</button>
                                  </span>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="docs" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div className="panel glass">
                    <h2 className="api-h2">{t('api.docsTitle')}</h2>
                    <p className="api-desc">{t('api.docsDesc')}</p>
                    <div className="key-warn"><WarnIcon /> {t('api.wwwWarn')}</div>
                    <p className="api-desc">{t('api.needKey')}</p>

                    {/* ---------- Claude Code ---------- */}
                    <h3 className="api-h3">Claude Code</h3>
                    <p className="api-desc">{t('api.cfgPath')}</p>
                    <div className="code-block">
                      Windows&nbsp;&nbsp;&nbsp;<span className="tk-str">C:\Users\&lt;用户名&gt;\.claude\settings.json</span><br />
                      macOS / Linux&nbsp;&nbsp;&nbsp;<span className="tk-str">~/.claude/settings.json</span>
                    </div>
                    <p className="api-desc">{t('api.cfgFill')}</p>
                    <div className="code-block">
                      {'{'}<br />
                      &nbsp;&nbsp;<span className="tk-key">"env"</span>: {'{'}<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="tk-key">"ANTHROPIC_BASE_URL"</span>: <span className="tk-str">"{BASE_URL}"</span>,<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="tk-key">"ANTHROPIC_API_KEY"</span>: <span className="tk-str">"ek-你的密钥"</span><br />
                      &nbsp;&nbsp;{'}'}<br />
                      {'}'}
                    </div>
                    <p className="api-desc">{t('api.ccNote')}</p>
                    <div className="model-chips" style={{ marginTop: 14 }}>
                      <span className="api-side-base" style={{ width: '100%', marginBottom: 2 }}>{t('api.modelsCc')}</span>
                      {modelsOf('claude').map((id) => (
                        <span className="model-chip" key={id}>
                          <span className="model-chip-dot" style={{ background: FAMILIES.claude.color }} />{id}
                        </span>
                      ))}
                    </div>

                    {/* ---------- Codex ---------- */}
                    <h3 className="api-h3">Codex</h3>
                    <p className="api-desc">{t('api.cfgPath')}</p>
                    <div className="code-block">
                      Windows&nbsp;&nbsp;&nbsp;<span className="tk-str">C:\Users\&lt;用户名&gt;\.codex\config.toml</span><br />
                      macOS / Linux&nbsp;&nbsp;&nbsp;<span className="tk-str">~/.codex/config.toml</span>
                    </div>
                    <p className="api-desc">{t('api.cfgFill')}</p>
                    <div className="code-block">
                      <span className="tk-key">model</span> = <span className="tk-str">"gpt-5.6-sol"</span><br />
                      <span className="tk-key">model_provider</span> = <span className="tk-str">'ecoapi'</span><br />
                      <span className="tk-key">preferred_auth_method</span> = <span className="tk-str">'apikey'</span><br /><br />
                      <span className="tk-fn">[model_providers.ecoapi]</span><br />
                      <span className="tk-key">base_url</span> = <span className="tk-str">'{BASE_URL}'</span><br />
                      <span className="tk-key">env_key</span> = <span className="tk-str">'CODEX_API_KEY'</span><br />
                      <span className="tk-key">name</span> = <span className="tk-str">'ecoapi'</span><br />
                      <span className="tk-key">requires_openai_auth</span> = <span className="tk-str">false</span><br />
                      <span className="tk-key">wire_api</span> = <span className="tk-str">'responses'</span>
                    </div>
                    <p className="api-desc">{t('api.codexEnv')}</p>
                    <div className="code-block">
                      <span className="tk-fn"># Windows (PowerShell)</span><br />
                      <span className="tk-key">setx</span> CODEX_API_KEY <span className="tk-str">"ek-你的密钥"</span><br /><br />
                      <span className="tk-fn"># macOS / Linux</span><br />
                      <span className="tk-key">export</span> CODEX_API_KEY=<span className="tk-str">"ek-你的密钥"</span>
                    </div>
                    <p className="api-desc">{t('api.codexNote')}</p>
                    <div className="model-chips" style={{ marginTop: 14 }}>
                      <span className="api-side-base" style={{ width: '100%', marginBottom: 2 }}>{t('api.modelsCodex')}</span>
                      {modelsOf('gpt').map((id) => (
                        <span className="model-chip" key={id}>
                          <span className="model-chip-dot" style={{ background: FAMILIES.gpt.color }} />{id}
                        </span>
                      ))}
                    </div>

                    {/* ---------- Gemini / DeepSeek / Qwen (OpenAI-compatible) ---------- */}
                    <h3 className="api-h3">Cline / OpenAI SDK — {t('api.allModels')}</h3>
                    <p className="api-desc">{t('api.geminiDesc')}</p>
                    <div className="key-warn"><WarnIcon /> {t('api.geminiBaseWarn')}</div>
                    <div className="code-block">
                      <span className="tk-key">Base URL</span>&nbsp;&nbsp;&nbsp;<span className="tk-str">{BASE_URL_OPENAI}</span><br />
                      <span className="tk-key">API Key</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="tk-str">ek-你的密钥</span><br />
                      <span className="tk-key">Model ID</span>&nbsp;&nbsp;&nbsp;<span className="tk-str">gemini-3.5-flash</span>
                    </div>
                    <p className="api-desc">{t('api.geminiCline')}</p>
                    <p className="api-desc">{t('api.geminiSdk')}</p>
                    <div className="code-block">
                      <span className="tk-key">from</span> openai <span className="tk-key">import</span> OpenAI<br /><br />
                      client = <span className="tk-fn">OpenAI</span>(<br />
                      &nbsp;&nbsp;api_key=<span className="tk-str">"ek-你的密钥"</span>,<br />
                      &nbsp;&nbsp;base_url=<span className="tk-str">"{BASE_URL_OPENAI}"</span>,<br />
                      )<br />
                      resp = client.chat.completions.<span className="tk-fn">create</span>(<br />
                      &nbsp;&nbsp;model=<span className="tk-str">"gemini-3.5-flash"</span>,<br />
                      &nbsp;&nbsp;messages=[{'{'}<span className="tk-str">"role"</span>: <span className="tk-str">"user"</span>, <span className="tk-str">"content"</span>: <span className="tk-str">"Hello!"</span>{'}'}],<br />
                      )<br />
                      <span className="tk-fn">print</span>(resp.choices[0].message.content)
                    </div>
                    {ALL_FAMILIES.map((f) => (
                      <div className="model-chips" style={{ marginTop: 14 }} key={f}>
                        <span className="api-side-base" style={{ width: '100%', marginBottom: 2 }}>
                          {FAMILIES[f].label}
                        </span>
                        {modelsOf(f).map((id) => (
                          <span className="model-chip" key={id}>
                            <span className="model-chip-dot" style={{ background: FAMILIES[f].color }} />{id}
                          </span>
                        ))}
                      </div>
                    ))}

                    {/* ---------- Errors ---------- */}
                    <h3 className="api-h3">{t('api.errorTitle')}</h3>
                    <div className="err-table">
                      {errors.map((e) => (
                        <div className="err-row" key={e.c}>
                          <code className="err-code">{e.c}</code>
                          <span>{e.d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function KeyIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="8" cy="15" r="4" /><path d="M10.8 12.2L20 3M16 7l3 3" /></svg>
}
function DocIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></svg>
}
function WarnIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg>
}
