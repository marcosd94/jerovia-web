'use client'
import { useRowLabel } from '@payloadcms/ui'

/** Título de cada ítem del pedido: «Item 01 - NOMBRE DEL PRODUCTO» */
export const OrderItemRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ label?: string; quantity?: number }>()
  const n = String(((rowNumber as number) ?? 0) + 1).padStart(2, '0')
  const name = data?.label?.trim()
  return <span>{name ? `Item ${n} - ${name.toUpperCase()}` : `Item ${n}`}</span>
}
