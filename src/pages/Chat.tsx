import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import { models } from '../data'
import './pages.css'

interface Msg { role: 'ai' | 'user'; text: string }

export default function Chat() {
  const { t } = useI18n()
  const [model, setModel] = useState(models[1].name)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'ai', text: t('chat.welcome') }])
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs])

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMsgs((m) => [...m, { role: 'user', text }])
    setInput('')
    setTimeout(() => {
      setMsgs((m) => [...m, { role: 'ai', text: t('chat.demo') + '「' + text + '」' }])
    }, 500)
  }

  return (
    <div className="chat-page">
      <div className="chat-bar">
        <h2 className="gradient-text">{t('chat.title')}</h2>
        <select className="chat-model-select" value={model} onChange={(e) => setModel(e.target.value)}>
          {models.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
        </select>
      </div>

      <div className="chat-body" ref={bodyRef}>
        <div className="chat-inner">
          {msgs.map((m, i) => (
            <motion.div key={i} className={`msg ${m.role}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <span className="msg-avatar">{m.role === 'ai' ? 'AI' : '我'}</span>
              <div className="msg-bubble">{m.text}</div>
            </motion.div>
          ))}
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
          <button className="chat-send" onClick={send} aria-label="send">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
