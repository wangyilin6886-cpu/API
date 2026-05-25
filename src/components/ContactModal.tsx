import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import { useToast } from './Toast'
import './ContactModal.css'

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n()
  const toast = useToast()

  const methods = [
    { id: 'whatsapp', label: 'WhatsApp', value: '+62 823 7100 8529', color: '#25d366', href: 'https://wa.me/6282371008529', icon: <WhatsAppIcon /> },
    { id: 'email', label: t('contact.email'), value: 'info@ecotech-systems.com', color: '#185fa5', href: 'mailto:info@ecotech-systems.com', icon: <MailIcon /> },
    { id: 'wechat', label: t('contact.wechat'), value: 'EcoTech-Service', color: '#07c160', copy: true, icon: <WeChatIcon /> },
    { id: 'telegram', label: 'Telegram', value: '@EcoTech', color: '#229ed9', href: 'https://t.me/EcoTech', icon: <TelegramIcon /> },
  ]

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="contact-modal glass"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose} aria-label="close">×</button>
            <h3 className="gradient-text">{t('contact.title')}</h3>
            <p className="contact-sub">{t('contact.subtitle')}</p>
            <div className="contact-list">
              {methods.map((m) => {
                const inner = (
                  <>
                    <span className="contact-icon" style={{ background: m.color }}>{m.icon}</span>
                    <div className="contact-meta">
                      <span className="contact-label">{m.label}</span>
                      <span className="contact-value">{m.value}</span>
                    </div>
                    <span className="contact-action">{m.copy ? t('profile.copy') : '↗'}</span>
                  </>
                )
                return m.copy ? (
                  <button key={m.id} className="contact-row" onClick={() => { navigator.clipboard?.writeText(m.value); toast(t('profile.copied'), 'success') }}>
                    {inner}
                  </button>
                ) : (
                  <a key={m.id} className="contact-row" href={m.href} target="_blank" rel="noreferrer">
                    {inner}
                  </a>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function WhatsAppIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1 3.7 3.8-1A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2.1.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.7.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.7-.1 1.3Z" /></svg> }
function WeChatIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 4C5 4 2 6.7 2 10c0 1.8 1 3.4 2.5 4.5L4 17l2.8-1.4c.7.2 1.5.3 2.2.3h.6a5 5 0 0 1-.1-1c0-3 2.9-5.4 6.5-5.4h.6C16 6.3 12.9 4 9 4Zm-2.2 4.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm4.4 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8ZM16 11c-3 0-5.5 2-5.5 4.5S13 20 16 20c.6 0 1.2-.1 1.8-.3L20 21l-.4-1.8A4.3 4.3 0 0 0 21.5 15.5C21.5 13 19 11 16 11Zm-1.8 3a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4Zm3.6 0a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4Z" /></svg> }
function TelegramIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3 18.6 20c-.2 1-.9 1.3-1.8.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-.9.5l.3-4.7L18 6.3c.4-.3-.1-.5-.6-.2L7 12.6 2.5 11.2c-1-.3-1-1 .2-1.4L20.6 3c.8-.3 1.5.2 1.3 1.3Z" /></svg> }
function MailIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></svg> }
