import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import { allModels, catVendors, catCats, catTags, fmtCtx, vendorLabel, CatModel } from '../data'
import './pages.css'

const PAGE_SIZE = 12
const FAV_KEY = 'eco-fav-models'
const MAX_CMP = 4

export default function Models() {
  const { t, lang } = useI18n()
  const zh = lang === 'zh'
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('score')

  useEffect(() => { document.title = 'ECOAPI - One Key Access Every Top LLM' }, [])
  const [cat, setCat] = useState('all')
  const [vendors, setVendors] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [onlyFav, setOnlyFav] = useState(false)
  const [fav, setFav] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]') } catch { return [] }
  })
  const [cmp, setCmp] = useState<string[]>([])
  const [detail, setDetail] = useState<CatModel | null>(null)
  const [cmpOpen, setCmpOpen] = useState(false)

  useEffect(() => { localStorage.setItem(FAV_KEY, JSON.stringify(fav)) }, [fav])

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) => {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
    setPage(1)
  }
  const toggleFav = (id: string) => setFav((f) => f.includes(id) ? f.filter((x) => x !== id) : [...f, id])
  const toggleCmp = (id: string) => setCmp((c) => c.includes(id) ? c.filter((x) => x !== id) : (c.length >= MAX_CMP ? c : [...c, id]))

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    let list = allModels.filter((m) => {
      if (kw && !(`${m.name} ${m.vendor}`.toLowerCase().includes(kw))) return false
      if (cat !== 'all' && !m.cats.includes(cat)) return false
      if (vendors.length && !vendors.includes(m.vendor)) return false
      if (tags.length && !tags.every((tg) => m.tags.includes(tg))) return false
      if (onlyFav && !fav.includes(m.id)) return false
      return true
    })
    list = [...list].sort((a, b) => {
      if (sort === 'cheap') return a.cin - b.cin
      if (sort === 'ctx') return b.ctxK - a.ctxK
      if (sort === 'name') return a.name.localeCompare(b.name)
      return b.score - a.score
    })
    return list
  }, [q, sort, cat, vendors, tags, onlyFav, fav])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const cur = Math.min(page, pages)
  const shown = filtered.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE)
  const reset = () => { setQ(''); setCat('all'); setVendors([]); setTags([]); setOnlyFav(false); setPage(1) }
  const cmpModels = cmp.map((id) => allModels.find((m) => m.id === id)).filter(Boolean) as CatModel[]

  const Star = ({ id }: { id: string }) => (
    <button className={`cat-star ${fav.includes(id) ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); toggleFav(id) }} aria-label="favorite">
      <svg viewBox="0 0 24 24" width="17" height="17" fill={fav.includes(id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M12 2l3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7L2 9.5 9 9z" /></svg>
    </button>
  )

  return (
    <div className="page catalog">
      <div className="blob" style={{ width: 380, height: 380, background: '#185fa5', top: -90, right: -70 }} />
      <div className="page-inner">
        <div className="page-head">
          <button className="btn-ghost" style={{ padding: '8px 18px', fontSize: 14, marginBottom: 20 }} onClick={() => nav('/')}>← {t('catalog.back')}</button>
          <h1 className="gradient-text">{t('catalog.title')}</h1>
          <p>{t('catalog.subtitle')}</p>
        </div>

        <div className="cat-toolbar glass">
          <input className="cat-search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder={t('catalog.search')} />
          <div className="cat-chips">
            {catCats.map((c) => (
              <button key={c} className={`cat-chip ${cat === c ? 'active' : ''}`} onClick={() => { setCat(c); setPage(1) }}>{t(`models.cat.${c}`)}</button>
            ))}
          </div>
          <select className="cat-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="score">{t('catalog.sortScore')}</option>
            <option value="cheap">{t('catalog.sortCheap')}</option>
            <option value="ctx">{t('catalog.sortCtx')}</option>
            <option value="name">{t('catalog.sortName')}</option>
          </select>
          <div className="cat-view">
            <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} aria-label="grid view">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></svg>
            </button>
            <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-label="list view">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>

        <div className="cat-layout">
          <aside className="cat-side glass">
            <div className="cat-side-head">
              <span><strong>{filtered.length}</strong> {t('catalog.results')}</span>
              <button className="cat-reset" onClick={reset}>{t('catalog.reset')}</button>
            </div>
            <label className="cat-check cat-favtoggle">
              <input type="checkbox" checked={onlyFav} onChange={() => { setOnlyFav((v) => !v); setPage(1) }} />
              <span>★ {t('catalog.onlyFav')} ({fav.length})</span>
            </label>
            <div className="cat-group">
              <h4>{t('catalog.vendor')}</h4>
              {catVendors.map((v) => (
                <label key={v} className="cat-check">
                  <input type="checkbox" checked={vendors.includes(v)} onChange={() => toggle(vendors, v, setVendors)} />
                  <span>{vendorLabel(v, zh)}</span>
                </label>
              ))}
            </div>
            <div className="cat-group">
              <h4>{t('catalog.tags')}</h4>
              <div className="cat-tagwrap">
                {catTags.map((tg) => (
                  <button key={tg} className={`cat-tag ${tags.includes(tg) ? 'active' : ''}`} onClick={() => toggle(tags, tg, setTags)}>{t(`tag.${tg}`)}</button>
                ))}
              </div>
            </div>
          </aside>

          <div className="cat-results">
            {shown.length === 0 ? (
              <div className="cat-empty glass">{t('catalog.empty')}</div>
            ) : view === 'grid' ? (
              <div className="cat-grid">
                {shown.map((m) => (
                  <motion.div key={m.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="cat-card glass" onClick={() => setDetail(m)}>
                    <div className="cat-card-head">
                      <span className="model-dot" style={{ background: m.color }} />
                      <div>
                        <h3>{m.name}</h3>
                        <span className="model-vendor">{vendorLabel(m.vendor, zh)}</span>
                      </div>
                      <Star id={m.id} />
                    </div>
                    <div className="cat-tags-row">
                      {m.tags.slice(0, 3).map((tg) => <span key={tg} className="cat-minitag">{t(`tag.${tg}`)}</span>)}
                    </div>
                    <div className="model-stats">
                      <div><span>{t('models.ctx')}</span><strong>{fmtCtx(m.ctxK)}</strong></div>
                      <div><span>{t('models.in')}</span><strong>${m.cin}</strong></div>
                      <div><span>{t('models.out')}</span><strong>${m.cout}</strong></div>
                    </div>
                    <div className="cat-card-foot">
                      <button className={`cat-cmp-btn ${cmp.includes(m.id) ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); toggleCmp(m.id) }}>
                        {cmp.includes(m.id) ? `✓ ${t('catalog.added')}` : `+ ${t('catalog.addCompare')}`}
                      </button>
                      <span className="cat-score">{m.score}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="cat-list">
                <div className="cat-list-head">
                  <span /><span>{t('catalog.vendor')}</span><span>{t('models.ctx')}</span><span>{t('models.in')}</span><span>{t('models.out')}</span><span>{t('catalog.scoreLabel')}</span><span />
                </div>
                {shown.map((m) => (
                  <motion.div key={m.id} layout className="cat-row" onClick={() => setDetail(m)}>
                    <span className="cr-name"><span className="model-dot" style={{ background: m.color }} />{m.name}</span>
                    <span className="cr-dim">{vendorLabel(m.vendor, zh)}</span>
                    <span>{fmtCtx(m.ctxK)}</span>
                    <span>${m.cin}</span>
                    <span>${m.cout}</span>
                    <span className="cr-score">{m.score}</span>
                    <span className="cr-actions">
                      <Star id={m.id} />
                      <button className={`cat-cmp-btn sm ${cmp.includes(m.id) ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); toggleCmp(m.id) }}>{cmp.includes(m.id) ? '✓' : '+'}</button>
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {pages > 1 && (
              <div className="cat-pager">
                <button disabled={cur === 1} onClick={() => setPage(cur - 1)}>{t('catalog.prev')}</button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={p === cur ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button disabled={cur === pages} onClick={() => setPage(cur + 1)}>{t('catalog.next')}</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* compare bar */}
      <AnimatePresence>
        {cmp.length > 0 && (
          <motion.div className="cat-cmp-bar glass" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}>
            <div className="cmp-chips">
              {cmpModels.map((m) => (
                <span key={m.id} className="cmp-chip">{m.name}<button onClick={() => toggleCmp(m.id)} aria-label="remove">×</button></span>
              ))}
            </div>
            <div className="cmp-actions">
              <button className="cat-reset" onClick={() => setCmp([])}>{t('catalog.clear')}</button>
              <button className="btn-grad" disabled={cmp.length < 2} onClick={() => setCmpOpen(true)}>{t('catalog.compare')} ({cmp.length})</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* detail drawer */}
      <AnimatePresence>
        {detail && (
          <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetail(null)}>
            <motion.div className="cat-drawer glass" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setDetail(null)} aria-label="close">×</button>
              <div className="drawer-title">
                <span className="model-dot" style={{ background: detail.color }} />
                <div><h2>{detail.name}</h2><span className="model-vendor">{vendorLabel(detail.vendor, zh)}</span></div>
                <Star id={detail.id} />
              </div>
              <div className="cat-tags-row" style={{ marginBottom: 22 }}>
                {detail.tags.map((tg) => <span key={tg} className="cat-minitag">{t(`tag.${tg}`)}</span>)}
              </div>
              <h4 className="drawer-h">{t('catalog.spec')}</h4>
              <div className="drawer-spec">
                <div><span>{t('models.ctx')}</span><strong>{fmtCtx(detail.ctxK)}</strong></div>
                <div><span>{t('models.in')}</span><strong>${detail.cin} / 1M</strong></div>
                <div><span>{t('models.out')}</span><strong>${detail.cout} / 1M</strong></div>
                <div><span>{t('catalog.scoreLabel')}</span><strong>{detail.score}</strong></div>
              </div>
              <h4 className="drawer-h">{t('catalog.example')}</h4>
              <div className="code-block">
                <span className="tk-key">curl</span> https://api.ecoapi.ai/v1/chat/completions \<br />
                &nbsp;&nbsp;-H <span className="tk-str">"Authorization: Bearer sk-eco-xxxx"</span> \<br />
                &nbsp;&nbsp;-d <span className="tk-str">{`'{ "model": "${detail.name}", "messages": [...] }'`}</span>
              </div>
              <div className="drawer-foot">
                <button className={`cat-cmp-btn ${cmp.includes(detail.id) ? 'on' : ''}`} onClick={() => toggleCmp(detail.id)}>
                  {cmp.includes(detail.id) ? `✓ ${t('catalog.added')}` : `+ ${t('catalog.addCompare')}`}
                </button>
                <button className="btn-grad" onClick={() => nav('/chat')}>{t('catalog.tryChat')} →</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* compare modal */}
      <AnimatePresence>
        {cmpOpen && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCmpOpen(false)}>
            <motion.div className="cmp-modal glass" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setCmpOpen(false)} aria-label="close">×</button>
              <h3 className="gradient-text">{t('catalog.compareTitle')}</h3>
              <div className="cmp-table" style={{ gridTemplateColumns: `120px repeat(${cmpModels.length}, 1fr)` }}>
                <span className="cmp-rh" />
                {cmpModels.map((m) => <span key={m.id} className="cmp-ch"><span className="model-dot" style={{ background: m.color }} />{m.name}</span>)}
                <span className="cmp-rh">{t('catalog.vendor')}</span>
                {cmpModels.map((m) => <span key={m.id}>{vendorLabel(m.vendor, zh)}</span>)}
                <span className="cmp-rh">{t('models.ctx')}</span>
                {cmpModels.map((m) => <span key={m.id}>{fmtCtx(m.ctxK)}</span>)}
                <span className="cmp-rh">{t('models.in')}</span>
                {cmpModels.map((m) => <span key={m.id}>${m.cin}</span>)}
                <span className="cmp-rh">{t('models.out')}</span>
                {cmpModels.map((m) => <span key={m.id}>${m.cout}</span>)}
                <span className="cmp-rh">{t('catalog.scoreLabel')}</span>
                {cmpModels.map((m) => <span key={m.id} className="cmp-best" data-best={m.score === Math.max(...cmpModels.map((x) => x.score))}>{m.score}</span>)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
