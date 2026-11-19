'use client'
import Link from 'next/link'
import { useCart } from './CartProvider'

export function CartLink({ href, label }: { href: string; label: string }) {
  const { count, ready } = useCart()
  return (
    <Link href={href} className="cart-link" aria-label={label.replace('{n}', String(ready ? count : 0))}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 4h2.2l2.1 10.2a1.6 1.6 0 0 0 1.6 1.3h8.1a1.6 1.6 0 0 0 1.6-1.2L20 8H6.2" />
        <circle cx="9.5" cy="19.5" r="1.2" />
        <circle cx="17" cy="19.5" r="1.2" />
      </svg>
      {ready && count > 0 ? <span className="cart-badge" aria-hidden="true">{count > 99 ? '99+' : count}</span> : null}
    </Link>
  )
}
