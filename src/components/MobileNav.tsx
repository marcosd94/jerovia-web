'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavItem } from './NavLinks'

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`)

/** Menú de celular: icono de tres rayas. Se cierra al elegir una opción, con Escape o al tocar fuera. */
export function MobileNav({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDetailsElement>(null)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onClick = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [open])

  return (
    <details ref={box} className="nav-mobile" open={open} onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
      <summary aria-label={label}>
        <svg className="burger" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      </summary>
      <nav aria-label={label}>
        {items.map((i) => (
          <Link key={i.href} href={i.href} className={i.cta ? 'nav-cta' : undefined} aria-current={isActive(pathname, i.href) ? 'page' : undefined}>
            {i.label}
          </Link>
        ))}
      </nav>
    </details>
  )
}
