'use client'
import { useAuth } from '@payloadcms/ui'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

/** Estados que cada rol necesita atender. Es la lista que se muestra por defecto: editala acá si cambia el criterio. */
const ATENDER_ADMIN = ['pendiente_pago', 'pagado']
const ATENDER_LOGISTICA = ['aprobado']

type Chip = { key: string; label: string; statuses: string[] | null }
const chips = (atender: string[]): Chip[] => [
  { key: 'atender', label: 'Por atender', statuses: atender },
  { key: 'curso', label: 'En preparación y envío', statuses: ['aprobado', 'listo_retiro', 'enviado'] },
  { key: 'entregados', label: 'Entregados', statuses: ['entregado'] },
  { key: 'cancelados', label: 'Cancelados', statuses: ['cancelado'] },
  { key: 'todos', label: 'Todos', statuses: null },
]

/** Encima del listado de pedidos: lo abre ya filtrado en lo que hay que atender y ofrece atajos para cambiar de vista */
export const OrdersListFilter = () => {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const roles = ((user as { roles?: string[] } | null)?.roles ?? []) as string[]
  const atender = roles.includes('admin') || roles.includes('gestor') ? ATENDER_ADMIN : roles.includes('logistica') && !roles.includes('visor') ? ATENDER_LOGISTICA : ATENDER_ADMIN
  const list = chips(atender)

  const hasWhere = Array.from(params.keys()).some((k) => k.startsWith('where'))
  const vista = params.get('vista')

  const hrefFor = (c: Chip) => {
    const next = new URLSearchParams()
    params.forEach((v, k) => {
      if (!k.startsWith('where') && k !== 'vista' && k !== 'page') next.append(k, v)
    })
    // "Todos" usa un filtro que siempre se cumple, para que la dirección refleje la vista elegida
    if (c.statuses) next.set('where[status][in]', c.statuses.join(','))
    else next.set('where[status][exists]', 'true')
    next.set('vista', c.key)
    return `${pathname}?${next.toString()}`
  }

  // Primera apertura sin ningún filtro: ir directo a "Por atender"
  useEffect(() => {
    if (user && !hasWhere && !vista) router.replace(hrefFor(list[0]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, hasWhere, vista])

  const active = vista ?? (hasWhere ? '' : list[0].key)
  return (
    <nav className="ord-views" aria-label="Vistas de pedidos">
      {list.map((c) => (
        <a
          key={c.key}
          href={hrefFor(c)}
          className={`ord-view${active === c.key ? ' ord-view--on' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            router.push(hrefFor(c))
          }}
        >
          {c.label}
        </a>
      ))}
    </nav>
  )
}
