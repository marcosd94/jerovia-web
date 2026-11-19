'use server'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { brand } from '@brand'
import { getCustomer } from '@/lib/customer'
import { localePath } from '@/lib/data'
import { isLocale } from '@/lib/locale'
import type { ShopKey } from '@/lib/messages-shop'
import { allow, clientIp } from '@/lib/ratelimit'
import { quoteLines } from '@/lib/shop'

export type CheckoutState = {
  status: 'idle' | 'error'
  message?: ShopKey
  errors?: Record<string, ShopKey>
  values?: Record<string, string>
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[+\d\s().-]{6,40}$/
const clean = (v: FormDataEntryValue | null, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const FIELDS = ['name', 'phone', 'email', 'ruc', 'businessName', 'delivery', 'zone', 'address', 'payment', 'notes']

/**
 * Crea el pedido. El navegador solo manda QUÉ quiere comprar (producto, presentación, cantidad) y sus datos:
 * precios, envío, total y disponibilidad se vuelven a calcular acá con la base de datos.
 * Es el único camino público para crear pedidos (la colección solo permite crear al personal).
 */
export async function placeOrder(_prev: CheckoutState, fd: FormData): Promise<CheckoutState> {
  const values = Object.fromEntries(FIELDS.map((n) => [n, clean(fd.get(n), 600)]))
  if (clean(fd.get('website'), 50)) return { status: 'idle' } // trampa anti-robots
  const l = clean(fd.get('locale'), 5)
  const locale = isLocale(l) ? l : 'es'
  if (!brand.features.shop) return { status: 'error', message: 'errShopOff', values }
  if (!allow(`order:${await clientIp()}`, 8, 30 * 60 * 1000)) return { status: 'error', message: 'errLimit', values }

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings', locale, overrideAccess: false })
  if (!settings.shopEnabled) return { status: 'error', message: 'errShopOff', values }

  // Carrito: solo producto, presentación y cantidad; los precios salen de la base
  let rawLines: unknown = []
  try {
    const text = clean(fd.get('cart'), 6000)
    rawLines = text ? JSON.parse(text) : []
  } catch {
    rawLines = []
  }
  // Se guarda en español para que el personal lo lea siempre igual, sin importar el idioma del cliente
  const quote = await quoteLines('es', rawLines)
  if (!quote.items.length) return { status: 'error', message: 'errEmpty', values }
  if (!quote.allOk) return { status: 'error', message: 'errItems', values }

  const customer = await getCustomer()
  const errors: Record<string, ShopKey> = {}
  if (!values.name) errors.name = 'errRequired'
  if (!PHONE.test(values.phone)) errors.phone = 'errPhone'
  if (values.email && !EMAIL.test(values.email)) errors.email = 'errEmail'
  if (!customer && fd.get('privacy') !== 'on') errors.privacy = 'errPrivacy'

  // Entrega
  const pickupOk = settings.pickup?.enabled !== false
  const method = values.delivery === 'pickup' && pickupOk ? 'pickup' : 'courier'
  let shippingCost = 0
  let zoneId: number | undefined
  if (method === 'courier') {
    const z = Number(values.zone)
    const zone = Number.isInteger(z) && z > 0 ? await payload.findByID({ collection: 'delivery-zones', id: z, depth: 0, overrideAccess: false }).catch(() => null) : null
    if (!zone || zone.active === false) errors.zone = 'errZone'
    else { shippingCost = zone.price; zoneId = zone.id }
    if (values.address.length < 5) errors.address = 'errAddress'
  }

  // Forma de pago (sin pasarela: cobro manual)
  const pay = settings.payments
  const transferOk = pay?.transferEnabled !== false
  const cashOk = pay?.cashEnabled !== false
  const payment = values.payment === 'transfer' && transferOk ? 'transfer' : values.payment === 'cash' && cashOk ? 'cash' : null
  if (!payment) errors.payment = 'errPayment'

  if (Object.keys(errors).length) return { status: 'error', errors, values }

  const total = quote.subtotal + shippingCost
  try {
    const order = await payload.create({
      collection: 'orders',
      data: {
        account: customer?.id,
        customer: { name: values.name, email: values.email || customer?.email || undefined, phone: values.phone, ruc: values.ruc || undefined, businessName: values.businessName || undefined },
        items: quote.items.map((i) => ({ product: i.p, label: i.label ? `${i.name} — ${i.label}` : i.name, sku: i.sku ?? undefined, quantity: i.q, unitPrice: i.unitPrice })),
        delivery: { method, zone: zoneId, address: method === 'courier' ? values.address : undefined },
        subtotal: quote.subtotal,
        shippingCost,
        total,
        payment: { gateway: 'manual', method: payment === 'transfer' ? 'Transferencia o QR' : method === 'pickup' ? 'Pago al retirar' : 'Pago contra entrega' },
        notes: values.notes || undefined,
        status: 'pendiente_pago',
      },
      overrideAccess: true,
    })
    redirect(`${localePath(locale, '/pedido')}/${encodeURIComponent(order.orderNumber ?? '')}?t=${encodeURIComponent(order.accessToken ?? '')}`)
  } catch (error) {
    // redirect() funciona lanzando una excepción especial de Next: se deja pasar
    if ((error as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) throw error
    console.error('No se pudo crear el pedido', (error as Error)?.name)
    return { status: 'error', message: 'errGeneric', values }
  }
}
