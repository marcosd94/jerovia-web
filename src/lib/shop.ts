import config from '@payload-config'
import { getPayload } from 'payload'
import type { Locale } from '@brand/types'
import { MAX_LINES, sanitizeCart, type CartLine } from './cart'
import { mediaUrl } from './data'
import type { Product } from '../payload-types'

export type QuotedLine = {
  p: number
  q: number
  slug: string
  name: string
  label: string // presentación (ej: 500 g)
  sku: string | null
  image: string | null
  unitPrice: number
  lineTotal: number
  ok: boolean // false = ya no se puede comprar (no existe, agotado o sin precio)
}

export type Quote = { items: QuotedLine[]; subtotal: number; allOk: boolean }

/**
 * Arma el carrito con datos y precios actuales de la base de datos.
 * Es la única fuente de precios: sirve para mostrar el carrito y para confirmar el pedido.
 */
export async function quoteLines(locale: Locale, input: unknown): Promise<Quote> {
  const lines: CartLine[] = sanitizeCart(input).slice(0, MAX_LINES)
  if (!lines.length) return { items: [], subtotal: 0, allOk: false }
  const payload = await getPayload({ config })
  const ids = lines.map((l) => l.p)
  const res = await payload.find({
    collection: 'products',
    locale,
    where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] } as never,
    limit: ids.length,
    pagination: false,
    depth: 1,
    overrideAccess: false,
  })
  const byId = new Map<number, Product>(res.docs.map((d) => [d.id, d]))
  const items: QuotedLine[] = lines.map((l) => {
    const prod = byId.get(l.p)
    const priced = typeof prod?.price === 'number' && prod.price > 0
    const ok = Boolean(prod && prod.available !== false && priced)
    const unitPrice = ok ? (prod!.price as number) : 0
    return {
      p: l.p,
      q: l.q,
      slug: prod?.slug ?? '',
      name: prod?.name ?? '',
      label: prod?.presentation ?? '',
      sku: prod?.sku ?? null,
      image: prod ? mediaUrl(prod.image, 'thumb') : null,
      unitPrice,
      lineTotal: unitPrice * l.q,
      ok,
    }
  })
  const subtotal = items.reduce((n, i) => n + i.lineTotal, 0)
  return { items, subtotal, allOk: items.length > 0 && items.every((i) => i.ok) }
}

export type ShopZone = { id: number; name: string; price: number; eta: string | null }

export async function getZones(locale: Locale): Promise<ShopZone[]> {
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'delivery-zones', locale, where: { active: { equals: true } }, sort: 'price', limit: 50, pagination: false, depth: 0, overrideAccess: false })
  return res.docs.map((z) => ({ id: z.id, name: z.name, price: z.price, eta: z.eta ?? null }))
}
