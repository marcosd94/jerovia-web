'use client'
import { MAX_QTY } from '@/lib/cart'

type Props = { value: number; onChange: (n: number) => void; label: string; decrease: string; increase: string; min?: number }

/** Selector de cantidad (− 1 +). Se usa en el carrito, el catálogo y la ficha del producto */
export function QtyStepper({ value, onChange, label, decrease, increase, min = 1 }: Props) {
  return (
    <div className="cart-qty" role="group" aria-label={label}>
      <button type="button" aria-label={decrease} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" aria-label={increase} disabled={value >= MAX_QTY} onClick={() => onChange(Math.min(MAX_QTY, value + 1))}>+</button>
    </div>
  )
}
