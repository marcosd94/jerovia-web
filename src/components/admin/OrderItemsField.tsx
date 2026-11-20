'use client'
import { ArrayField, useAllFormFields, useForm } from '@payloadcms/ui'
import type { ArrayFieldClientComponent } from 'payload'

const gs = (n: number) => new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(n)

/**
 * Productos del pedido en una sola tarjeta compacta: cantidad × producto, precio y subtotal.
 * No se edita ahí; solo se puede quitar un producto. Para agregar (o corregir) se abre el bloque de abajo,
 * que es el formulario de siempre. Los cambios se aplican al guardar el pedido.
 */
export const OrderItemsField: ArrayFieldClientComponent = (props) => {
  const [fields] = useAllFormFields()
  const { removeFieldRow } = useForm()
  const path = props.path ?? 'items'
  const rows = (fields[path]?.rows ?? []) as { id: string }[]
  const val = (i: number, k: string) => fields[`${path}.${i}.${k}`]?.value as string | number | undefined
  const lines = rows.map((r, i) => ({ id: r.id, i, label: String(val(i, 'label') ?? ''), q: Number(val(i, 'quantity') ?? 0), price: val(i, 'unitPrice') === undefined ? null : Number(val(i, 'unitPrice')) }))
  const total = lines.reduce((a, l) => a + (l.price ?? 0) * l.q, 0)
  const showPrices = lines.some((l) => l.price !== null)
  const units = lines.reduce((a, l) => a + l.q, 0)

  return (
    <div className="ord-items">
      <section className="ord-items-card" aria-label="Productos del pedido">
        <header>
          <h3>Productos del pedido</h3>
          <span>{lines.length} {lines.length === 1 ? 'producto' : 'productos'} · {units} {units === 1 ? 'unidad' : 'unidades'}</span>
        </header>
        {lines.length === 0 ? <p className="ord-items-empty">Todavía no hay productos. Agregalos abajo.</p> : (
          <ul>
            {lines.map((l) => (
              <li key={l.id}>
                <span className="ord-items-qty">{l.q} ×</span>
                <span className="ord-items-name">{l.label || 'Sin detalle'}</span>
                {showPrices && l.price !== null ? <span className="ord-items-price">{gs(l.price)} c/u</span> : null}
                {showPrices && l.price !== null ? <strong className="ord-items-sub">{gs(l.price * l.q)}</strong> : null}
                <button type="button" className="ord-items-del" aria-label={`Quitar ${l.label}`} title="Quitar del pedido" onClick={() => removeFieldRow({ path, rowIndex: l.i })}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>
                </button>
              </li>
            ))}
          </ul>
        )}
        {showPrices ? <footer><span>Subtotal de productos</span><strong>{gs(total)}</strong></footer> : null}
      </section>
      <details className="ord-items-edit">
        <summary>Agregar o corregir productos</summary>
        <ArrayField {...props} />
      </details>
    </div>
  )
}
