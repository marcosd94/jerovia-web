'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const CODES: Record<string, string> = { es: 'ES', en: 'EN', pt: 'PT' }
const NAMES: Record<string, string> = { es: 'Español', en: 'English', pt: 'Português' }

/** Selector de idioma: botón con globo y código; abre una lista corta. Conserva la página actual al cambiar. */
export function LocaleSwitch({ locales, current, label }: { locales: string[]; current: string; label: string }) {
  const pathname = usePathname() || `/${current}`
  const rest = pathname.replace(new RegExp(`^/${current}`), '')
  const ref = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const close = () => ref.current?.removeAttribute('open')
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close() }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick) }
  }, [])
  useEffect(() => { ref.current?.removeAttribute('open') }, [pathname])

  if (locales.length < 2) return null
  return (
    <details className="locale-menu" ref={ref}>
      <summary aria-label={`${label}: ${NAMES[current] ?? current}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3Z" />
        </svg>
        <span>{CODES[current] ?? current.toUpperCase()}</span>
      </summary>
      <ul role="list">
        {locales.map((l) => (
          <li key={l}>
            <Link href={`/${l}${rest}`} hrefLang={l} lang={l} aria-current={l === current ? 'true' : undefined}>
              {NAMES[l] ?? l.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  )
}
