import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import './pages.css'

interface Msg { role: 'ai' | 'user'; text: string }

const CHAT_ENABLED = true

// Models offered in the picker. NOTE: /api/chat is still the DeepSeek-backed
// company assistant, so this choice is not yet routed to the selected model.
const CHAT_MODELS = [
  { id: 'claude-opus-4-6', name: 'Claude Opus 4.6' },
  { id: 'claude-opus-4-7', name: 'Claude Opus 4.7' },
  { id: 'claude-opus-4-8', name: 'Claude Opus 4.8' },
  { id: 'claude-opus-5', name: 'Claude Opus 5' },
  { id: 'claude-fable-5', name: 'Claude Fable 5' },
  { id: 'gpt-5.4', name: 'GPT-5.4' },
  { id: 'gpt-5.5', name: 'GPT-5.5' },
  { id: 'gpt-5.6-luna', name: 'GPT-5.6 Luna' },
  { id: 'gpt-5.6-sol', name: 'GPT-5.6 Sol' },
  { id: 'gpt-5.6-terra', name: 'GPT-5.6 Terra' },
]

export default function Chat() {
  const { t } = useI18n()
  const [model, setModel] = useState('claude-opus-5')
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'ai', text: t('chat.welcome') }])
  const [loading, setLoading] = useState(false)

  useEffect(() => { document.title = 'ECOAPI - One Key Access Every Top LLM' }, [])
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, loading])

  const reply = async (history: Msg[]) => {
    if (!CHAT_ENABLED) {
      const last = history[history.length - 1].text
      return t('chat.demo') + '「' + last + '」'
    }
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // The assistant behind /api/chat is DeepSeek-backed; the picker above
        // does not (yet) switch the model that actually answers.
        model: 'deepseek-chat',
        messages: history.map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data.error) {
      throw new Error(data.error?.message || data.error || `HTTP ${res.status}`)
    }
    return data.choices?.[0]?.message?.content ?? '(empty)'
  }

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim()
    if (!text || loading) return
    const next: Msg[] = [...msgs, { role: 'user', text }]
    setMsgs(next)
    setInput('')
    setLoading(true)
    try {
      const answer = await reply(next)
      setMsgs((m) => [...m, { role: 'ai', text: answer }])
    } catch (e) {
      setMsgs((m) => [...m, { role: 'ai', text: `${t('chat.error')} (${e instanceof Error ? e.message : String(e)})` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-bar">
        <h2 className="gradient-text">{t('chat.title')}</h2>
        {CHAT_ENABLED ? <span className="chat-live">● {t('chat.live')}</span> : <span className="chat-demo-tag">{t('chat.demoTag')}</span>}
        <select className="chat-model-select" value={model} onChange={(e) => setModel(e.target.value)}>
          {CHAT_MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      <div className="chat-body" ref={bodyRef}>
        <div className="chat-inner">
          {msgs.map((m, i) => (
            <motion.div key={i} className={`msg ${m.role}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <span className="msg-avatar">{m.role === 'ai' ? 'AI' : t('chat.me')}</span>
              <div className="msg-bubble">{m.text}</div>
            </motion.div>
          ))}
          {loading && (
            <motion.div className="msg ai" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <span className="msg-avatar">AI</span>
              <div className="msg-bubble typing"><span /><span /><span /></div>
            </motion.div>
          )}
          {msgs.length === 1 && !loading && (
            <motion.div className="chat-presets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <span className="chat-presets-label">{t('chat.tryAsk')}</span>
              <div className="chat-presets-row">
                {[1, 2, 3].map((p) => (
                  <button key={p} className="chat-preset" onClick={() => send(t(`chat.preset${p}`))}>
                    {t(`chat.preset${p}`)}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="chat-input-bar">
        <div className="chat-input-inner">
          <textarea
            rows={1}
            placeholder={t('chat.placeholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          />
          <button className="chat-send" onClick={() => send()} aria-label="send" disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
