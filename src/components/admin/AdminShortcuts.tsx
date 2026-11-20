'use client'
import { useAuth } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const POLL_MS = 60_000

/**
 * Acceso directo "Inicio" arriba del menú y globo en Pedidos (admin, gestión, visor):
 * nuevos pendientes de pago + pagados por aprobar.
 */
export function AdminShortcuts() {
  const { user } = useAuth()
  const pathname = usePathname()
  const roles = ((user as { roles?: string[] } | null)?.roles ?? []) as string[]
  const staff = roles.some((r) => ['admin', 'gestor', 'visor', 'logistica'].includes(r))
  const sees = roles.some((r) => ['admin', 'gestor', 'visor'].includes(r))
  const [orders, setOrders] = useState(0)

  useEffect(() => {
    if (!staff) return
    let live = true
    const count = async (statuses: string) => {
      try {
        const res = await fetch(`/api/orders/count?where[status][in]=${statuses}`, { credentials: 'include' })
        if (!res.ok) return 0
        return ((await res.json()) as { totalDocs?: number }).totalDocs ?? 0
      } catch { return 0 }
    }
    const load = async () => {
      const a = sees ? await count('pendiente_pago,pagado') : 0
      if (live) setOrders(a)
    }
    load()
    const id = setInterval(load, POLL_MS)
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => { live = false; clearInterval(id); window.removeEventListener('focus', onFocus) }
  }, [staff, sees])

  if (!staff) return null
  const badge = (sel: string, n: number) => n
    ? `${sel}::after { content: "${n > 99 ? '99+' : n}"; margin-left: auto; min-width: 1.4rem; height: 1.4rem; padding: 0 0.4rem; border-radius: 999px; background: #b3261e; color: #fff; font-size: 0.75rem; font-weight: 700; line-height: 1.4rem; text-align: center; flex: none; }`
    : ''
  const active = pathname === '/admin' || /^\/admin\/?$/.test(pathname ?? '')
  return (
    <>
      <a className={`adm-home${active ? ' is-active' : ''}`} href="/admin" aria-current={active ? 'page' : undefined}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v10h13V10" /><path d="M10 20v-6h4v6" /></svg>
        <span>Inicio</span>
        <small>Panel de pedidos</small>
      </a>
      <style>{`
        .nav a[href$="/collections/orders"] { display: flex; align-items: center; gap: 0.5rem; }
        ${badge('.nav a[href$="/collections/orders"]', orders)}
      `}</style>
    </>
  )
}
