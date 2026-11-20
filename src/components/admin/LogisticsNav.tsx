'use client'
import { useAuth } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const POLL_MS = 60_000

/** Grupo "Logística" del menú, con el mismo formato que los demás grupos: Preparación de pedidos y el globo de aprobados por preparar */
export function LogisticsNav() {
  const { user } = useAuth()
  const roles = ((user as { roles?: string[] } | null)?.roles ?? []) as string[]
  const allowed = roles.some((r) => ['admin', 'gestor', 'visor', 'logistica'].includes(r))
  const pathname = usePathname()
  const [open, setOpen] = useState(true)
  const [prep, setPrep] = useState(0)

  useEffect(() => {
    if (!allowed) return
    let live = true
    const load = async () => {
      try {
        const res = await fetch('/api/orders/count?where[status][in]=aprobado', { credentials: 'include' })
        if (res.ok && live) setPrep(((await res.json()) as { totalDocs?: number }).totalDocs ?? 0)
      } catch { /* sin conexión: se deja el número anterior */ }
    }
    load()
    const id = setInterval(load, POLL_MS)
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => { live = false; clearInterval(id); window.removeEventListener('focus', onFocus) }
  }, [allowed])

  if (!allowed) return null
  const active = Boolean(pathname?.startsWith('/admin/preparacion'))
  // Mismo formato que los demás grupos del menú (Catálogo, Contenido…)
  return (
    <div className="nav-group Logistica" id="nav-group-Logistica">
      <button className={`nav-group__toggle${open ? ' nav-group__toggle--open' : ''}`} type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        <div className="nav-group__label">Logística</div>
        <div className="nav-group__indicator">
          <svg className="icon icon--chevron nav-group__indicator" height="100%" viewBox="0 0 20 20" width="100%" xmlns="http://www.w3.org/2000/svg" style={{ transform: open ? 'rotate(180deg)' : undefined }}><path className="stroke" d="M14 8L10 12L6 8" strokeLinecap="square" /></svg>
        </div>
      </button>
      {open ? (
        <div className="nav-group__content">
          <a className={`nav__link${active ? ' active' : ''}`} id="nav-preparacion" href="/admin/preparacion">
            <span className="nav__link-label">Preparación de pedidos</span>
            {prep ? <span className="adm-badge">{prep > 99 ? '99+' : prep}</span> : null}
          </a>
        </div>
      ) : null}
    </div>
  )
}
