'use client'
import { useEffect, useId, useRef, useState } from 'react'
import { buildPhone, cleanNational, COUNTRIES, splitPhone } from '@/lib/phone'

type Locale = 'es' | 'en' | 'pt'
const T: Record<Locale, { country: string; hint: string; hintOther: string }> = {
  es: { country: 'País', hint: 'Sin el 0 inicial. Ej.: 981 123 456. Lo usamos para escribirte por WhatsApp.', hintOther: 'Sin el 0 inicial. Lo usamos para escribirte por WhatsApp.' },
  en: { country: 'Country', hint: 'Without the leading 0. E.g. 981 123 456. We use it to message you on WhatsApp.', hintOther: 'Without the leading 0. We use it to message you on WhatsApp.' },
  pt: { country: 'País', hint: 'Sem o 0 inicial. Ex.: 981 123 456. Usamos para falar com você no WhatsApp.', hintOther: 'Sem o 0 inicial. Usamos para falar com você no WhatsApp.' },
}

type Props = { id?: string; name?: string; label: string; locale: Locale; defaultValue?: string; required?: boolean; error?: string | null }

const Flag = ({ code }: { code: string }) => <img className="phone-flag" src={`/flags/${code.toLowerCase()}.svg`} alt="" width={24} height={18} />

/** Teléfono con lista de prefijos y banderas (Paraguay por defecto). Envía un único valor internacional, ej.: +595981123456 */
export function PhoneField({ id = 'phone', name = 'phone', label, locale, defaultValue = '', required, error }: Props) {
  const uid = useId()
  const initial = splitPhone(defaultValue)
  const [dial, setDial] = useState(initial.country.code)
  const [national, setNational] = useState(initial.national)
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const t = T[locale] ?? T.es
  const country = COUNTRIES.find((c) => c.code === dial) ?? COUNTRIES[0]
  const full = buildPhone(country, national) ?? `+${country.dial}${cleanNational(national)}` // si está incompleto, el servidor lo rechaza con un aviso
  const hintId = `${uid}-hint`
  const hint = country.code === 'PY' ? t.hint : t.hintOther
  const grouped = national.replace(/(\d{3})(?=\d)/g, '$1 ')

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent) { if (e.key === 'Escape') setOpen(false); return }
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close) }
  }, [open])

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="phone-row">
        <div className="phone-picker" ref={box}>
          <button type="button" className="phone-trigger" aria-haspopup="listbox" aria-expanded={open} aria-label={`${t.country}: ${country.name[locale] ?? country.name.es} +${country.dial}`} onClick={() => setOpen(!open)}>
            <Flag code={country.code} />
            <span className="phone-dial">+{country.dial}</span>
            <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {open ? (
            <ul className="phone-list" role="listbox" aria-label={t.country}>
              {COUNTRIES.map((c) => (
                <li key={c.code} role="option" aria-selected={c.code === dial}>
                  <button type="button" className={c.code === dial ? 'is-on' : ''} onClick={() => { setDial(c.code); setNational((n) => n.slice(0, c.max)); setOpen(false) }}>
                    <Flag code={c.code} />
                    <span className="phone-name">{c.name[locale] ?? c.name.es}</span>
                    <span className="phone-code">+{c.dial}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          required={required}
          maxLength={country.max + 4}
          placeholder={country.code === 'PY' ? '981 123 456' : ''}
          value={grouped}
          onChange={(e) => setNational(cleanNational(e.target.value).slice(0, country.max))}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hintId}
        />
      </div>
      <input type="hidden" name={name} value={full} />
      {error ? <p className="error" id={`${id}-error`} role="alert">{error}</p> : <p className="small" id={hintId}>{hint}</p>}
    </div>
  )
}
