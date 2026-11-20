'use client'
import Link from 'next/link'
import type { Suggestion } from '@/lib/shop'
import { useCart } from './CartProvider'

const gs = (n: number) => new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(n)

/** Sugerencias compactas debajo del carrito (haya o no productos cargados). Los que ya están en el carrito no se repiten. */
export function CartSuggestions({ items, base, m }: { items: Suggestion[]; base: string; m: Record<string, string> }) {
  const cart = useCart()
  const inCart = new Set(cart.lines.map((l) => l.p))
  const list = items.filter((s) => !inCart.has(s.id)).slice(0, 4)
  if (!list.length) return null
  return (
    <section className="suggest" aria-labelledby="suggest-h">
      <h2 id="suggest-h">{m.suggestTitle}</h2>
      <ul className="suggest-list">
        {list.map((s) => (
          <li key={s.id} className="suggest-item">
            <Link href={`${base}/productos/${s.slug}`} className="suggest-link">
              <span className="suggest-thumb">{s.image ? <img src={s.image} alt="" loading="lazy" /> : null}</span>
              <span className="suggest-text">
                <span className="suggest-name">{s.name}</span>
                <span className="suggest-meta">{[s.label, gs(s.price)].filter(Boolean).join(' · ')}</span>
              </span>
            </Link>
            <button type="button" className="btn btn-ghost btn-xs" aria-label={`${m.add}: ${s.name} ${s.label}`} onClick={() => cart.add(s.id, 1)}>{m.add}</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
