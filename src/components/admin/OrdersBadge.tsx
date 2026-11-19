'use client'
import { useAuth } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

const POLL_MS = 60_000

/**
 * Globo con la cantidad de pedidos que esperan acción, junto a "Pedidos" en el menú.
 * Administración, Gestión y Visor: nuevos (pendientes de pago) + pagados por aprobar.
 * Logística: pedidos aprobados, listos para enviar.
 * Se dibuja con CSS (un <style> con el número) para que no se pierda cuando el menú se vuelve a pintar.
 */
export function OrdersBadge() {
  const { user } = useAuth()
  const roles = ((user as { roles?: string[] } | null)?.roles ?? []) as string[]
  const logistics = roles.includes('logistica') && !roles.some((r) => ['admin', 'gestor', 'visor'].includes(r))
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!roles.length) return
    let live = true
    const statuses = logistics ? 'aprobado' : 'pendiente_pago,pagado'
    const load = async () => {
      try {
        const res = await fetch(`/api/orders/count?where[status][in]=${statuses}`, { credentials: 'include' })
        if (!res.ok) return
        const data = (await res.json()) as { totalDocs?: number }
        if (live) setCount(data.totalDocs ?? 0)
      } catch { /* sin conexión: se deja el número anterior */ }
    }
    load()
    const id = setInterval(load, POLL_MS)
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => { live = false; clearInterval(id); window.removeEventListener('focus', onFocus) }
  }, [roles.join(','), logistics])

  if (!count) return null
  return (
    <style>{`
      .nav a[href$="/collections/orders"] { display: flex; align-items: center; gap: 0.5rem; }
      .nav a[href$="/collections/orders"]::after {
        content: "${count > 99 ? '99+' : count}"; margin-left: auto; min-width: 1.4rem; height: 1.4rem; padding: 0 0.4rem; border-radius: 999px;
        background: #b3261e; color: #fff; font-size: 0.75rem; font-weight: 700; line-height: 1.4rem; text-align: center; flex: none;
      }
    `}</style>
  )
}
