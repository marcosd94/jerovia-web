'use client'
import { useEffect } from 'react'
import { useCart } from './CartProvider'

/** Vacía el carrito del navegador una vez confirmado el pedido */
export function ClearCart() {
  const { clear, ready, count } = useCart()
  useEffect(() => { if (ready && count > 0) clear() }, [ready, count, clear])
  return null
}
