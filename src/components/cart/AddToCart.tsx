'use client'
import { useEffect, useRef, useState } from 'react'
import { useCart } from './CartProvider'
import { QtyStepper } from './QtyStepper'

type Props = { productId: number; label: string; m: Record<string, string> }

/** Cantidad + botón "Agregar". Como cada producto es una sola presentación, no hay nada más que elegir */
export function AddToCart({ productId, label, m }: Props) {
  const cart = useCart()
  const [qty, setQty] = useState(1)
  const [done, setDone] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
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
