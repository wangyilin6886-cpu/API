import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useI18n } from '../i18n/I18nContext'
import { allModels, catVendors, catCats, catTags, fmtCtx } from '../data'
import './pages.css'

const PAGE_SIZE = 12

export default function Models() {
  const { t } = useI18n()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('score')
  const [cat, setCat] = useState('all')
  const [vendors, setVendors] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [page, setPage] = useState(1)

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) => {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
    setPage(1)
  }

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    let list = allModels.filter((m) => {
      if (kw && !(`${m.name} ${m.vendor}`.toLowerCase().includes(kw))) return false
      if (cat !== 'all' && !m.cats.includes(cat)) return false
      if (vendors.length && !vendors.includes(m.vendor)) return false
      if (tags.length && !tags.every((tg) => m.tags.includes(tg))) return false
      return true
    })
    list = [...list].sort((a, b) => {
      if (sort === 'cheap') return a.cin - b.cin
      if (sort === 'ctx') return b.ctxK - a.ctxK
      if (sort === 'name') return a.name.localeCompare(b.name)
      return b.score - a.score
    })
    return list
  }, [q, sort, cat, vendors, tags])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const cur = Math.min(page, pages)
  const shown = filtered.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE)

  const reset = () => { setQ(''); setCat('all'); setVendors([]); setTags([]); setPage(1) }

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
        </div>

        <div className="cat-layout">
          <aside className="cat-side glass">
            <div className="cat-side-head">
              <strong>{filtered.length}</strong> {t('catalog.results')}
              <button className="cat-reset" onClick={reset}>{t('catalog.reset')}</button>
            </div>
            <div className="cat-group">
              <h4>{t('catalog.vendor')}</h4>
              {catVendors.map((v) => (
                <label key={v} className="cat-check">
                  <input type="checkbox" checked={vendors.includes(v)} onChange={() => toggle(vendors, v, setVendors)} />
                  <span>{v}</span>
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
            ) : (
              <div className="cat-grid">
                {shown.map((m) => (
                  <motion.div key={m.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="cat-card glass">
                    <div className="cat-card-head">
                      <span className="model-dot" style={{ background: m.color }} />
                      <div>
                        <h3>{m.name}</h3>
                        <span className="model-vendor">{m.vendor}</span>
                      </div>
                      <span className="cat-score">{m.score}</span>
                    </div>
                    <div className="cat-tags-row">
                      {m.tags.slice(0, 3).map((tg) => <span key={tg} className="cat-minitag">{t(`tag.${tg}`)}</span>)}
                    </div>
                    <div className="model-stats">
                      <div><span>{t('models.ctx')}</span><strong>{fmtCtx(m.ctxK)}</strong></div>
                      <div><span>{t('models.in')}</span><strong>${m.cin}</strong></div>
                      <div><span>{t('models.out')}</span><strong>${m.cout}</strong></div>
                    </div>
                    <button className="model-call" onClick={() => nav('/chat')}>{t('models.call')} →</button>
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
    </div>
  )
}
