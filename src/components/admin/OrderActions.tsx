'use client'
import { useAllFormFields, useAuth, useDocumentInfo, useFormModified } from '@payloadcms/ui'
import { brand } from '@brand'
import { useState } from 'react'
import { contactLinks, orderWhatsAppMessage } from '../../lib/order-contact'

const val = (fields: Record<string, { value?: unknown }>, path: string) => {
  const v = fields[path]?.value
  return typeof v === 'string' ? v : ''
}

/**
 * Barra fija en la parte de arriba del pedido:
 *  - Botones de WhatsApp y llamada para hablar con quien compró.
 *  - Botón "Aprobar pedido" (Administración y Gestión): confirma que el cobro está verificado y lo pasa a Logística.
 */
export function OrderActions() {
  const { id, initialData } = useDocumentInfo()
  const { user } = useAuth()
  const modified = useFormModified()
  const [fields] = useAllFormFields()
  const roles = ((user as { roles?: string[] } | null)?.roles ?? []) as string[]
  const canApprove = roles.some((r) => r === 'admin' || r === 'gestor')

  const status = val(fields, 'status')
  const name = val(fields, 'customer.name')
  const phone = val(fields, 'customer.phone')
  const number = val(fields, 'orderNumber')
  const method = val(fields, 'payment.method')

  const [open, setOpen] = useState(false)
  const [verified, setVerified] = useState(false)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!id) return null // pedido nuevo todavía sin guardar

  // Productos del pedido (los campos del formulario vienen como items.0.label, items.0.quantity…)
  const items: { label: string; quantity: number }[] = []
  for (let i = 0; i < 100 && fields[`items.${i}.label`]; i++) items.push({ label: val(fields, `items.${i}.label`), quantity: Number(fields[`items.${i}.quantity`]?.value ?? 1) || 1 })
  const totalRaw = fields['total']?.value
  const message = orderWhatsAppMessage({ brandName: brand.name, name, createdAt: (initialData as { createdAt?: string } | undefined)?.createdAt, items, total: typeof totalRaw === 'number' ? totalRaw : null })
  const contact = contactLinks(phone, message)
  const pending = status === 'pendiente_pago' || status === 'pagado'

  const approve = async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch(`/api/orders/${id}/approve`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentVerified: verified, note }) })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) { setError(data.error ?? 'No se pudo aprobar el pedido.'); setBusy(false); return }
      window.location.reload()
    } catch {
      setError('No hay conexión. Probá de nuevo.')
      setBusy(false)
    }
  }

  return (
    <div className="order-bar" role="region" aria-label="Contacto y aprobación del pedido">
      <div className="order-bar-row">
        <div className="order-bar-who">
          <strong>{name || 'Cliente'}</strong>
          {phone ? (
            <span className={contact.valid ? 'order-phone order-phone--ok' : 'order-phone order-phone--bad'}>
              {contact.valid ? '✓ ' : '⚠ '}{contact.display}
              {contact.valid ? ' · número verificado para WhatsApp' : ' · formato no válido para WhatsApp'}
            </span>
          ) : <span className="order-phone order-phone--bad">⚠ Sin teléfono cargado</span>}
        </div>
        <div className="order-bar-actions">
          {contact.whatsapp ? <a className="order-btn order-btn--wa" href={contact.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a> : null}
          {contact.tel ? <a className="order-btn order-btn--call" href={contact.tel}>Llamar</a> : null}
          {canApprove && pending && !open ? (
            <button type="button" className="order-btn order-btn--ok" onClick={() => setOpen(true)} disabled={modified} title={modified ? 'Guardá los cambios antes de aprobar' : undefined}>
              Aprobar pedido
            </button>
          ) : null}
          {status === 'aprobado' ? <span className="order-chip">Aprobado: pasó a Logística</span> : null}
        </div>
      </div>
      {phone && !contact.valid ? <p className="order-bar-hint">El teléfono no tiene un formato válido (código de país y número de celular). Corregilo en «Datos del cliente en este pedido» y guardá para habilitar WhatsApp y llamada.</p> : null}
      {canApprove && pending && modified ? <p className="order-bar-hint">Hay cambios sin guardar. Guardalos antes de aprobar el pedido.</p> : null}
      {open ? (
        <div className="order-approve">
          <p><strong>Aprobar el pedido {number}</strong> y enviarlo a Logística para su entrega.</p>
          <label className="order-check">
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
            <span>Verifiqué que el cobro llegó (transferencia, QR o pasarela){method ? ` — forma de pago: ${method}` : ''} o que el pedido se paga contra entrega.</span>
          </label>
          <label className="order-note">
            <span>Nota de la aprobación (opcional)</span>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} placeholder="Ej.: transferencia Itaú, comprobante 12345" />
          </label>
          {error ? <p className="order-error" role="alert">{error}</p> : null}
          <div className="order-approve-actions">
            <button type="button" className="order-btn order-btn--ok" onClick={approve} disabled={!verified || busy}>{busy ? 'Aprobando…' : 'Confirmar aprobación'}</button>
            <button type="button" className="order-btn" onClick={() => { setOpen(false); setError('') }} disabled={busy}>Cancelar</button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
