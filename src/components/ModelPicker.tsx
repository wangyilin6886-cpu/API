import { useI18n } from '../i18n/I18nContext'
import { FAMILIES, MODELS, isWithinScope, type Family } from '../lib/models'
import './ModelPicker.css'

const FAMILY_ORDER = Object.keys(FAMILIES) as Family[]

interface Props {
  /** Selected patterns. Empty array means "no restriction". */
  value: string[]
  onChange: (next: string[]) => void
  /** The account's ceiling. Anything outside it can't be picked. Null = unrestricted. */
  accountScope?: string[] | null
}

/**
 * Picks which models a new key may call. Selecting a family adds its wildcard
 * (e.g. "gemini-*") and clears the individual picks it already covers, so the
 * stored list stays as short as what the user actually expressed.
 */
export default function ModelPicker({ value, onChange, accountScope }: Props) {
  const { t } = useI18n()
  const selected = new Set(value)
  const scoped = !!accountScope?.length
  const inScope = (pattern: string) => isWithinScope(pattern, accountScope)

  const toggle = (pattern: string) => {
    const next = new Set(selected)
    if (next.has(pattern)) next.delete(pattern)
    else next.add(pattern)
    onChange([...next])
  }

  const toggleFamily = (f: Family) => {
    const { pattern } = FAMILIES[f]
    if (selected.has(pattern)) {
      onChange(value.filter((v) => v !== pattern))
      return
    }
    // Family wildcard supersedes any individual model of that family.
    const ids = new Set(MODELS.filter((m) => m.family === f).map((m) => m.id))
    onChange([...value.filter((v) => !ids.has(v)), pattern])
  }

  return (
    <div className="mp">
      <div className="mp-head">
        <span className="mp-title">{t('mp.title')}</span>
        {value.length > 0 && (
          <button type="button" className="mp-clear" onClick={() => onChange([])}>
            {t('mp.clear')}
          </button>
        )}
      </div>
      <p className="mp-hint">{value.length === 0 ? t('mp.unrestricted') : t('mp.restricted')}</p>
      {scoped && (
        <p className="mp-hint mp-ceiling">
          {t('mp.accountScope')} {accountScope!.join(', ')}
        </p>
      )}

      {FAMILY_ORDER.map((f) => {
        const famOn = selected.has(FAMILIES[f].pattern)
        const famReachable = inScope(FAMILIES[f].pattern)
        return (
          <div className="mp-group" key={f}>
            <button
              type="button"
              className={`mp-chip mp-fam ${famOn ? 'on' : ''} ${famReachable ? '' : 'covered'}`}
              style={famOn ? { background: FAMILIES[f].color } : undefined}
              onClick={() => toggleFamily(f)}
              disabled={!famReachable}
            >
              {t('mp.allOf')} {FAMILIES[f].label}
            </button>
            {MODELS.filter((m) => m.family === f).map((m) => (
              <button
                type="button"
                key={m.id}
                className={`mp-chip ${selected.has(m.id) ? 'on' : ''} ${famOn || !inScope(m.id) ? 'covered' : ''}`}
                style={selected.has(m.id) ? { background: FAMILIES[f].color } : undefined}
                onClick={() => toggle(m.id)}
                disabled={famOn || !inScope(m.id)}
              >
                {m.id}
              </button>
            ))}
          </div>
        )
      })}
    </div>
  )
}
