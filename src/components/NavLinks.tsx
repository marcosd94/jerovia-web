'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type NavItem = { href: string; label: string; cta?: boolean }

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`)

/** Enlaces del menú de escritorio. Marca la página actual y destaca el botón principal. */
export function NavLinks({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname()
  return (
    <nav className="nav-desktop" aria-label={label}>
      {items.map((i) => (
        <Link key={i.href} href={i.href} className={i.cta ? 'nav-cta' : undefined} aria-current={isActive(pathname, i.href) ? 'page' : undefined}>
          {i.label}
        </Link>
      ))}
    </nav>
  )
}
