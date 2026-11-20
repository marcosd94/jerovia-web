'use client'
import { useEffect, useRef, useState } from 'react'
import { useCart } from './CartProvider'
import { QtyStepper } from './QtyStepper'
import { TrashIcon } from './TrashIcon'

type Props = { productId: number; label: string; m: Record<string, string> }

/** Cantidad + botón "Agregar". Como cada producto es una sola presentación, no hay nada más que elegir */
export function AddToCart({ productId, label, m }: Props) {
  const cart = useCart()
  const [qty, setQty] = useState(1)
  const inCart = cart.lines.find((l) => l.p === productId)?.q ?? 0
  const [edit, setEdit] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  // Ya está en el carrito: el selector solo prepara la cantidad nueva; se aplica al tocar "Actualizar" (en 0 se quita del carrito)
  if (inCart > 0) {
    const draft = edit ?? inCart
    const changed = draft !== inCart
    return (
      <div className="buy-box is-in-cart">
        <QtyStepper value={draft} min={0} onChange={(n) => setEdit(n === inCart ? null : n)} label={`${m.quantity}: ${label}`} decrease={m.decrease} increase={m.increase} />
        {changed ? (
          <button
            type="button"
            className="btn btn-primary btn-sm buy-update"
            aria-label={`${draft === 0 ? m.remove : m.updateQty}: ${label}`}
            onClick={() => { if (draft <= 0) cart.remove(productId); else cart.setQty(productId, draft); setEdit(null) }}
          >
            {draft === 0 ? m.remove : m.updateQty}
          </button>
        ) : (
          <span className="in-cart-tag" role="status">{m.inCartTag}</span>
        )}
        <button type="button" className="buy-trash" aria-label={`${m.remove}: ${label}`} title={m.remove} onClick={() => { cart.remove(productId); setEdit(null) }}><TrashIcon /></button>
      </div>
    )
  }
  return (
    <div className="buy-box">
      <QtyStepper value={qty} onChange={setQty} label={`${m.quantity}: ${label}`} decrease={m.decrease} increase={m.increase} />
      <button
        type="button"
        className={`btn btn-primary btn-sm${done ? ' is-done' : ''}`}
        aria-label={`${m.add}: ${label}`}
        onClick={() => {
          cart.add(productId, qty)
          setDone(true)
          setQty(1)
          if (timer.current) clearTimeout(timer.current)
          timer.current = setTimeout(() => setDone(false), 2200)
        }}
      >
        {done ? m.added : m.add}
      </button>
      <span className="sr-only" role="status" aria-live="polite">{done ? m.added : ''}</span>
    </div>
  )
}
