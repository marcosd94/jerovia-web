'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { brand } from '@brand'
import { contactLinks, orderWhatsAppMessage } from '../../lib/order-contact'

export type PrepOrder = {
  id: number | string
  orderNumber: string
  status: string
  createdAt: string
  name: string
  phone: string
  method: string
  zone: string
  address: string
  notes: string
  logisticsNote: string
  items: { label: string; quantity: number }[]
  total: number | null
}

const NEXT: Record<string, { to: string; label: string }[]> = {
  aprobado: [{ to: 'enviado', label: 'Marcar como enviado' }, { to: 'listo_retiro', label: 'Listo para retirar' }],
  enviado: [{ to: 'entregado', label: 'Marcar como entregado' }],
  listo_retiro: [{ to: 'entregado', label: 'Marcar como entregado' }],
}

/** Tarjeta de un pedido en la pantalla de preparación: qué armar, a quién, y los botones para avanzar el estado */
export function PrepCard({ o }: { o: PrepOrder }) {
  const router = useRouter()
  const [note, setNote] = useState(o.logisticsNote)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const msg = orderWhatsAppMessage({ brandName: brand.name, name: o.name, createdAt: o.createdAt, items: o.items, total: o.total })
  const c = contactLinks(o.phone, msg)

  const save = async (body: Record<string, unknown>) => {
    setBusy(true); setError('')
    try {
      const res = await fetch(`/api/orders/${o.id}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch { setError('No se pudo guardar. Revisá la conexión y probá de nuevo.') }
    finally { setBusy(false) }
  }

  return (
    <article className={`prep-card prep-card--${o.method === 'pickup' ? 'pickup' : 'courier'}`}>
      <header>
        <div>
          <strong>{o.name}</strong>
          <small>Pedido del {new Date(o.createdAt).toLocaleDateString('es-PY', { day: 'numeric', month: 'long', timeZone: 'America/Asuncion' })} · {o.orderNumber}</small>
        </div>
        <span className={`prep-method prep-method--${o.method === 'pickup' ? 'pickup' : 'courier'}`}>{o.method === 'pickup' ? 'Retiro en el local' : 'Envío a domicilio'}</span>
      </header>
      <ul className="prep-items">
        {o.items.map((i, k) => <li key={k}><b>{i.quantity} ×</b> {i.label}</li>)}
      </ul>
      {o.method !== 'pickup' ? <p className="prep-addr"><b>{o.zone || 'Sin zona'}</b>{o.address ? ` — ${o.address}` : ''}</p> : null}
      {o.notes ? <p className="prep-notes"><b>El cliente aclaró:</b> {o.notes}</p> : null}
      <div className="prep-contact">
        <span className={c.valid ? 'ok' : 'bad'}>{c.valid ? `✓ ${c.display}` : `⚠ ${c.display || 'sin teléfono'} (no sirve para WhatsApp)`}</span>
        {c.whatsapp ? <a className="prep-btn" href={c.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a> : null}
        {c.tel ? <a className="prep-btn" href={c.tel}>Llamar</a> : null}
      </div>
      <label className="prep-note">Nota de envío (guía, courier, etc.)
        <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <div className="prep-actions">
        <button type="button" className="prep-btn" disabled={busy || note === o.logisticsNote} onClick={() => save({ logisticsNote: note })}>Guardar nota</button>
        {(NEXT[o.status] ?? []).filter((n) => !(o.status === 'aprobado' && (o.method === 'pickup' ? n.to === 'enviado' : n.to === 'listo_retiro'))).map((n, k) => (
          <button key={n.to} type="button" className={`prep-btn${k === 0 ? ' prep-btn--main' : ''}`} disabled={busy} onClick={() => save({ status: n.to, logisticsNote: note })}>{n.label}</button>
        ))}
      </div>
      {error ? <p className="prep-error" role="alert">{error}</p> : null}
    </article>
  )
}
