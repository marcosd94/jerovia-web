'use client'
import Link from 'next/link'
import { useActionState, useEffect, useMemo, useState } from 'react'
import { quoteCart } from '@/app/(frontend)/[locale]/carrito/actions'
import { placeOrder, type CheckoutState } from '@/app/(frontend)/[locale]/checkout/actions'
import type { Quote, ShopZone } from '@/lib/shop'
import { useCart } from './CartProvider'

type Defaults = { name: string; phone: string; email: string; ruc: string; businessName: string; address: string; zone: string }
type Props = {
  locale: string
  base: string
  m: Record<string, string>
  zones: ShopZone[]
  pickup: { enabled: boolean; address: string }
  pay: { transfer: boolean; cash: boolean }
  customerName: string | null
  defaults: Defaults
  accounts: boolean
}

const initial: CheckoutState = { status: 'idle' }
const gs = (n: number) => new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(n)

export function CheckoutForm({ locale, base, m, zones, pickup, pay, customerName, defaults, accounts }: Props) {
  const cart = useCart()
  const [state, action, pending] = useActionState(placeOrder, initial)
  const [mode, setMode] = useState<'guest' | null>(customerName ? 'guest' : null)
  const [quote, setQuote] = useState<Quote | null>(null)
  const v = state.values ?? {}
  const [delivery, setDelivery] = useState<string>(v.delivery || 'courier')
  const [zone, setZone] = useState<string>(v.zone || defaults.zone)
  const [payment, setPayment] = useState<string>(v.payment || '')
  const err = (k: string) => (state.errors?.[k] ? <p className="error" role="alert">{m[state.errors[k]]}</p> : null)
  const lines = useMemo(() => JSON.stringify(cart.lines), [cart.lines])

  useEffect(() => {
    if (!cart.ready || !cart.lines.length) return
    let live = true
    quoteCart(locale, cart.lines).then((r) => { if (live && !('error' in r)) setQuote(r) })
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.ready, lines, locale])

  if (!cart.ready) return <p className="muted" role="status">{m.loading}</p>
  if (!cart.lines.length) {
    return (
      <div className="cart-empty">
        <h2>{m.cartEmpty}</h2>
        <p>{m.cartEmptyHint}</p>
        <Link className="btn btn-primary" href={`${base}/productos`}>{m.seeProducts}</Link>
      </div>
    )
  }

  const selZone = zones.find((z) => String(z.id) === zone)
  const shipping = delivery === 'pickup' ? 0 : selZone?.price ?? null
  const subtotal = quote?.subtotal ?? 0
  const showForm = Boolean(customerName) || mode === 'guest'

  return (
    <div className="cart-layout checkout-layout">
      <div>
        {!customerName ? (
          <section aria-labelledby="how-h" className="checkout-block">
            <h2 id="how-h">{m.howToBuy}</h2>
            <div className="buy-options">
              {accounts ? (
                <>
                  <Link className="buy-option" href={`${base}/cuenta/ingresar?next=checkout`}>
                    <strong>{m.optLogin}</strong>
                    <span>{m.optLoginHint}</span>
                  </Link>
                  <Link className="buy-option" href={`${base}/cuenta/registro?next=checkout`}>
                    <strong>{m.optRegister}</strong>
                    <span>{m.optRegisterHint}</span>
                  </Link>
                </>
              ) : null}
              <button type="button" className="buy-option" aria-pressed={mode === 'guest'} data-active={mode === 'guest' ? '' : undefined} onClick={() => setMode('guest')}>
                <strong>{m.optGuest}</strong>
                <span>{m.optGuestHint}</span>
              </button>
            </div>
          </section>
        ) : (
          <p className="notice" role="status" style={{ margin: '0 0 1.2rem' }}>{m.loggedAs.replace('{name}', customerName)}</p>
        )}

        {showForm ? (
          <form className="form checkout-form" action={action} noValidate>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="cart" value={lines} />
            <div className="hp" aria-hidden="true"><label>Web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            {state.message ? <p className="form-error" role="alert">{m[state.message]}</p> : null}

            <fieldset className="checkout-block">
              <legend>{m.yourData}</legend>
              <div className="field"><label htmlFor="name">{m.name}</label><input id="name" name="name" autoComplete="name" defaultValue={v.name ?? defaults.name} required />{err('name')}</div>
              <div className="field"><label htmlFor="phone">{m.phone}</label><input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone ?? defaults.phone} required />{err('phone')}</div>
              <div className="field"><label htmlFor="email">{m.email}</label><input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email ?? defaults.email} aria-describedby="email-h" /><p id="email-h" className="small">{m.emailHint}</p>{err('email')}</div>
              <details className="invoice">
                <summary>{m.invoiceData}</summary>
                <div className="field"><label htmlFor="ruc">{m.ruc}</label><input id="ruc" name="ruc" defaultValue={v.ruc ?? defaults.ruc} /></div>
                <div className="field"><label htmlFor="businessName">{m.businessName}</label><input id="businessName" name="businessName" defaultValue={v.businessName ?? defaults.businessName} /></div>
              </details>
            </fieldset>

            <fieldset className="checkout-block">
              <legend>{m.delivery}</legend>
              <div className="choice-row">
                <label className="choice"><input type="radio" name="delivery" value="courier" checked={delivery === 'courier'} onChange={() => setDelivery('courier')} /> {m.courier}</label>
                {pickup.enabled ? <label className="choice"><input type="radio" name="delivery" value="pickup" checked={delivery === 'pickup'} onChange={() => setDelivery('pickup')} /> {m.pickup}</label> : null}
              </div>
              {delivery === 'courier' ? (
                <>
                  <div className="field">
                    <label htmlFor="zone">{m.zone}</label>
                    <select id="zone" name="zone" value={zone} onChange={(e) => setZone(e.target.value)}>
                      <option value="">{m.chooseZone}</option>
                      {zones.map((z) => <option key={z.id} value={z.id}>{`${z.name} — ${gs(z.price)}${z.eta ? ` (${z.eta})` : ''}`}</option>)}
                    </select>
                    {err('zone')}
                  </div>
                  <div className="field">
                    <label htmlFor="address">{m.address}</label>
                    <textarea id="address" name="address" autoComplete="street-address" defaultValue={v.address ?? defaults.address} aria-describedby="addr-h" />
                    <p id="addr-h" className="small">{m.addressHint}</p>
                    {err('address')}
                  </div>
                </>
              ) : pickup.address ? (
                <p className="muted pre"><strong>{m.pickupAt}</strong> {pickup.address}</p>
              ) : null}
            </fieldset>

            <fieldset className="checkout-block">
              <legend>{m.payment}</legend>
              <div className="choice-col">
                {pay.transfer ? (
                  <label className="choice"><input type="radio" name="payment" value="transfer" checked={payment === 'transfer'} onChange={() => setPayment('transfer')} /> <span><strong>{m.payTransfer}</strong><br /><small>{m.payTransferHint}</small></span></label>
                ) : null}
                {pay.cash ? (
                  <label className="choice"><input type="radio" name="payment" value="cash" checked={payment === 'cash'} onChange={() => setPayment('cash')} /> <span><strong>{delivery === 'pickup' ? m.payCashPickup : m.payCash}</strong><br /><small>{m.payCashHint}</small></span></label>
                ) : null}
              </div>
              {err('payment')}
            </fieldset>

            <div className="field"><label htmlFor="notes">{m.notes}</label><textarea id="notes" name="notes" defaultValue={v.notes ?? ''} /></div>

            {!customerName ? (
              <div className="field">
                <label><input type="checkbox" name="privacy" style={{ width: 'auto', marginRight: '0.5rem' }} /> {m.privacy}</label>
                {err('privacy')}
              </div>
            ) : null}

            <button type="submit" className="btn btn-primary btn-block" disabled={pending}>{pending ? m.placing : m.placeOrder}</button>
          </form>
        ) : null}
      </div>

      <aside className="cart-summary" aria-label={m.summary}>
        <h2>{m.summary}</h2>
        <ul className="summary-items">
          {(quote?.items ?? []).map((it) => (
            <li key={it.p}><span>{it.q} × {it.name} <small>{it.label}</small></span><span>{it.ok ? gs(it.lineTotal) : '—'}</span></li>
          ))}
        </ul>
        <dl>
          <div><dt>{m.subtotal}</dt><dd>{gs(subtotal)}</dd></div>
          <div><dt>{m.shipping}</dt><dd>{shipping === null ? '—' : gs(shipping)}</dd></div>
          <div className="row-total"><dt>{m.total}</dt><dd>{shipping === null ? gs(subtotal) : gs(subtotal + shipping)}</dd></div>
        </dl>
        {shipping === null ? <p className="muted small">{m.shippingZoneFirst}</p> : null}
        <Link className="btn btn-ghost btn-block" href={`${base}/carrito`}>{m.cart}</Link>
        <p className="muted small">{m.freeNote}</p>
      </aside>
    </div>
  )
}
