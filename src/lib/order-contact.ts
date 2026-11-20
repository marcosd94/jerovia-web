import { formatPhone, normalizePhone, whatsappDigits } from './phone'

export type ContactItem = { label: string; quantity: number }

const dateLong = (iso?: string | null) => {
  const d = iso ? new Date(iso) : null
  if (!d || Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('es-PY', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Asuncion' }).format(d)
}
const gs = (n: number) => `Gs. ${Math.round(n).toLocaleString('es-PY')}`

/** Mensaje de WhatsApp para el cliente: nombre completo, fecha del pedido y lo que compró (el código de pedido no le dice nada) */
export function orderWhatsAppMessage(o: { brandName: string; name: string; createdAt?: string | null; items: ContactItem[]; total?: number | null }): string {
  const date = dateLong(o.createdAt)
  const lines = o.items.filter((i) => i.label).map((i) => `• ${i.quantity} × ${i.label}`)
  return [
    `Hola ${o.name.trim() || ''}, te escribimos de ${o.brandName} por tu pedido${date ? ` del ${date}` : ''}:`.replace('Hola ,', 'Hola,'),
    lines.length ? `\n${lines.join('\n')}` : '',
    typeof o.total === 'number' && o.total > 0 ? `\nTotal: ${gs(o.total)}` : '',
  ].join('\n').trim()
}

/** Enlaces de contacto ya verificados: si el teléfono no sirve para WhatsApp, devuelve valid=false y no hay enlaces */
export function contactLinks(phone: string | null | undefined, message: string) {
  const intl = normalizePhone(phone)
  const wa = whatsappDigits(phone)
  return {
    valid: Boolean(intl && wa),
    display: intl ? formatPhone(intl) : (phone ?? '').trim(),
    whatsapp: wa ? `https://wa.me/${wa}?text=${encodeURIComponent(message)}` : null,
    tel: intl ? `tel:${intl}` : null,
  }
}
