import config from '@payload-config'
import { timingSafeEqual } from 'node:crypto'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { brand } from '@brand'
import { ClearCart } from '@/components/cart/ClearCart'
import { getCustomer } from '@/lib/customer'
import { formatPrice, getSettings, localePath, whatsappLink } from '@/lib/data'
import { isLocale } from '@/lib/locale'
import { ts } from '@/lib/messages-shop'

type Props = { params: Promise<{ locale: string; number: string }>; searchParams: Promise<{ t?: string }> }

// El enlace lleva un código secreto: no se indexa y no se envía como referencia a otros sitios
export const metadata: Metadata = { title: 'Pedido', robots: { index: false, follow: false }, referrer: 'no-referrer' }

const same = (a: string, b: string) => {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export default async function OrderPage({ params, searchParams }: Props) {
  const { locale, number } = await params
  const { t: token } = await searchParams
  if (!isLocale(locale) || !brand.features.shop) notFound()

  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'orders', where: { orderNumber: { equals: number } }, limit: 1, depth: 0, overrideAccess: true })
  const order = res.docs[0]
  if (!order) notFound()
  // Acceso: quien tiene el enlace con el código secreto, o la cuenta dueña del pedido
  const me = await getCustomer()
  const owner = me && typeof order.account === 'number' ? order.account === me.id : me && typeof order.account === 'object' && order.account ? order.account.id === me.id : false
  const hasToken = Boolean(token && order.accessToken && same(token, order.accessToken))
  if (!hasToken && !owner) notFound()

  const settings = await getSettings(locale)
  const pay = settings.payments
  const isTransfer = order.payment?.method === 'Transferencia o QR'
  const isPickup = order.delivery?.method === 'pickup'
  const wa = brand.features.whatsapp ? whatsappLink(settings.whatsapp, ts(locale, 'whatsappOrder', { n: order.orderNumber ?? number })) : null

  return (
    <div className="wrap shop-page order-page">
      <ClearCart />
      <h1>{ts(locale, 'orderDone')}</h1>
      <p className="order-number">
        {ts(locale, 'orderNumber')}: <strong>{order.orderNumber}</strong>
      </p>
      <p className="muted">{ts(locale, 'orderKeep')}</p>

      <section className="order-card" aria-labelledby="pay-h">
        <h2 id="pay-h">{ts(locale, 'payNow')}</h2>
        {isTransfer ? (
          <>
            <h3>{ts(locale, 'payTransferTitle')}</h3>
            {pay?.transferInstructions ? <p className="pre">{pay.transferInstructions}</p> : <p>{ts(locale, 'payNoData')}</p>}
            <p>{ts(locale, 'payTransferAfter')}</p>
            {wa ? (
              <a className="btn btn-primary" href={wa} target="_blank" rel="noopener noreferrer">
                {ts(locale, 'whatsappSend')}
              </a>
            ) : null}
          </>
        ) : (
          <>
            <h3>{ts(locale, isPickup ? 'payCashPickupTitle' : 'payCashTitle')}</h3>
            <p>{ts(locale, isPickup ? 'payCashPickupText' : 'payCashText')}</p>
          </>
        )}
      </section>

      <section className="order-card" aria-labelledby="det-h">
        <h2 id="det-h">{ts(locale, 'detail')}</h2>
        <ul className="order-items">
          {(order.items ?? []).map((i) => (
            <li key={i.id ?? i.label}>
              <span>{i.quantity} × {i.label}</span>
              <span>{formatPrice((i.unitPrice ?? 0) * (i.quantity ?? 1))}</span>
            </li>
          ))}
        </ul>
        <dl className="order-totals">
          <div><dt>{ts(locale, 'subtotal')}</dt><dd>{formatPrice(order.subtotal ?? 0)}</dd></div>
          <div><dt>{ts(locale, 'shipping')}</dt><dd>{formatPrice(order.shippingCost ?? 0)}</dd></div>
          <div className="row-total"><dt>{ts(locale, 'total')}</dt><dd>{formatPrice(order.total ?? 0)}</dd></div>
        </dl>
        <p className="muted">
          <strong>{ts(locale, 'deliveryTo')}:</strong> {isPickup ? `${ts(locale, 'pickup')}${settings.pickup?.address ? ` — ${settings.pickup.address}` : ''}` : order.delivery?.address}
        </p>
        <p className="muted">{ts(locale, 'orderStatus')}</p>
      </section>

      {!owner && brand.features.accounts ? (
        <section className="order-card order-offer">
          <h2>{ts(locale, 'offerTitle')}</h2>
          <p>{ts(locale, 'offerText')}</p>
          <Link className="btn btn-ghost" href={localePath(locale, '/cuenta/registro')}>{ts(locale, 'offerCta')}</Link>
        </section>
      ) : null}

      <p>
        <Link href={localePath(locale)}>{ts(locale, 'backHome')}</Link>
      </p>
    </div>
  )
}
