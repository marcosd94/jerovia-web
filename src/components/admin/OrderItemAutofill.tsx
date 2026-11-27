'use client'
import { useConfig, useForm, useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import { useEffect, useRef } from 'react'

type ProductDoc = { name?: string; presentation?: string | null; sku?: string | null; price?: number | null }

/**
 * Campo invisible dentro de cada ítem del pedido: cuando se elige (o cambia) el producto,
 * completa solo el detalle, el código y el precio unitario con los datos actuales del producto.
 * No toca los ítems ya cargados al abrir el pedido: solo reacciona a un cambio hecho en pantalla.
 */
export const OrderItemAutofill: UIFieldClientComponent = ({ path }) => {
  const parent = (path ?? '').split('.').slice(0, -1).join('.')
  const productId = useFormFields(([fields]) => fields[`${parent}.product`]?.value) as number | string | null | undefined
  const { dispatchFields, setModified } = useForm()
  const { config } = useConfig()
  const previous = useRef(productId)

  useEffect(() => {
    if (previous.current === productId) return
    previous.current = productId
    if (!productId) return
    const controller = new AbortController()
    ;(async () => {
      try {
        const res = await fetch(`${config.routes.api}/products/${productId}?depth=0&locale=es&draft=true`, { credentials: 'include', signal: controller.signal })
        if (!res.ok) return
        const p = (await res.json()) as ProductDoc
        const name = p.name?.trim() ?? ''
        const label = p.presentation ? `${name} — ${p.presentation}` : name
        const set = (field: string, value: unknown) => dispatchFields({ type: 'UPDATE', path: `${parent}.${field}`, value, valid: true })
        set('label', label)
        set('sku', p.sku ?? '')
        if (typeof p.price === 'number') set('unitPrice', p.price)
        setModified(true)
      } catch {
        /* sin conexión o cancelado: el ítem se completa a mano */
      }
    })()
    return () => controller.abort()
  }, [productId, parent, config.routes.api, dispatchFields, setModified])

  return null
}
