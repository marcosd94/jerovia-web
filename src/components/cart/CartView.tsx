'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { quoteCart } from '@/app/(frontend)/[locale]/carrito/actions'
import type { Quote } from '@/lib/shop'
import { useCart } from './CartProvider'
import { QtyStepper } from './QtyStepper'
import { TrashIcon } from './TrashIcon'

type Props = { locale: string; m: Record<string, string>; base: string; minOrder: number }
const gs = (n: number) => new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(n)

export function CartView({ locale, m, base, minOrder }: Props) {
  const cart = useCart()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [failed, setFailed] = useState(false)
  const key = JSON.stringify(cart.lines)

  useEffect(() => {
    if (!cart.ready) return
    if (!cart.lines.length) { setQuote({ items: [], subtotal: 0, allOk: false }); return }
    let live = true
    quoteCart(locale, cart.lines).then((r) => {
      if (!live) return
      if ('error' in r) setFailed(true)
      else { setFailed(false); setQuote(r) }
    })
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.ready, key, locale])

  if (!cart.ready || (!quote && !failed)) return <p className="muted" role="status">{m.loading}</p>
  if (failed) return <p className="form-error" role="alert">{m.cartError}</p>
  if (!cart.lines.length || !quote || !quote.items.length) {
    return (
      <div className="cart-empty">
        <h2>{m.cartEmpty}</h2>
        <p>{m.cartEmptyHint}</p>
        <Link className="btn btn-primary" href={`${base}/productos`}>{m.seeProducts}</Link>
      </div>
    )
  }

  const missing = Math.max(0, minOrder - quote.subtotal)
  const canCheckout = quote.allOk && missing === 0
  return (
    <div className="cart-layout">
      <ul className="cart-list">
        {quote.items.map((it) => (
          <li key={it.p} className={`cart-item${it.ok ? '' : ' is-off'}`}>
            <div className="cart-thumb">{it.image ? <img src={it.image} alt="" /> : null}</div>
            <div className="cart-info">
              <p className="cart-name">{it.slug ? <Link href={`${base}/productos/${it.slug}`}>{it.name}</Link> : it.name || '—'}</p>
              <p className="cart-label">{it.label}</p>
              {it.ok ? <p className="cart-unit">{gs(it.unitPrice)}</p> : <p className="form-error" role="alert">{m.unavailable}</p>}
            </div>
            <QtyStepper value={it.q} onChange={(n) => cart.setQty(it.p, n)} label={m.quantity} decrease={m.decrease} increase={m.increase} />
            <p className="cart-line-total">{it.ok ? gs(it.lineTotal) : ''}</p>
            <button type="button" className="cart-remove" aria-label={m.remove} title={m.remove} onClick={() => cart.remove(it.p)}><TrashIcon /></button>
          </li>
        ))}
      </ul>
      <aside className="cart-summary" aria-label={m.summary}>
        <h2>{m.summary}</h2>
        <dl>
          <div><dt>{m.subtotal}</dt><dd>{gs(quote.subtotal)}</dd></div>
        </dl>
        <p className="muted">{m.shippingNext}</p>
        {missing > 0 ? <p className="notice-min" role="status">{m.minOrderMsg.replace('{min}', gs(minOrder)).replace('{missing}', gs(missing))}</p> : null}
        <div className="btn-row">
          {canCheckout ? (
            <Link className="btn btn-primary" href={`${base}/checkout`}>{m.checkout}</Link>
          ) : (
            <button type="button" className="btn btn-primary" disabled>{m.checkout}</button>
          )}
          <Link className="btn btn-ghost" href={`${base}/productos`}>{m.continueShopping}</Link>
        </div>
        <p className="muted small">{m.freeNote}</p>
      </aside>
    </div>
  )
}
