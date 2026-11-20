import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { hasRole } from '../../access'
import { PrepCard, type PrepOrder } from './PrepCard'

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ''
const TABS = [
  { key: 'preparar', label: 'Por preparar', statuses: ['aprobado'] },
  { key: 'camino', label: 'En camino o para retirar', statuses: ['enviado', 'listo_retiro'] },
] as const

/** Pantalla del equipo de logística: todos los pedidos aprobados, para armar y entregar. Siguen figurando en Pedidos. */
export async function PreparationView(props: AdminViewServerProps) {
  const { initPageResult, params, searchParams = {} } = props
  const { req } = initPageResult
  // Dentro del marco del admin (menú lateral, barra superior)
  const wrap = (children: React.ReactNode) => (
    <DefaultTemplate i18n={req.i18n} locale={initPageResult.locale} params={params} payload={req.payload} permissions={initPageResult.permissions} searchParams={searchParams} user={req.user ?? undefined} visibleEntities={initPageResult.visibleEntities}>
      {children}
    </DefaultTemplate>
  )
  const { payload, user } = req
  if (!hasRole(user, 'admin', 'gestor', 'visor', 'logistica')) {
    return wrap(<Gutter><div className="ord-dash"><h1>Preparación de pedidos</h1><p>No tenés permiso para ver esta pantalla.</p></div></Gutter>)
  }
  const sp = searchParams as Record<string, string | string[] | undefined>
  const tab = TABS.find((t) => t.key === one(sp.tab)) ?? TABS[0]

  const counts = await Promise.all(TABS.map((t) => payload.count({ collection: 'orders', where: { status: { in: [...t.statuses] } }, user, req, overrideAccess: false })))
  const res = await payload.find({
    collection: 'orders',
    where: { status: { in: [...tab.statuses] } },
    sort: 'createdAt', // los más antiguos primero: se entregan en orden de llegada
    limit: 200,
    depth: 1,
    pagination: false,
    user,
    req,
    overrideAccess: false,
  })
  const canMove = hasRole(user, 'admin', 'gestor', 'logistica')

  const orders: PrepOrder[] = res.docs.map((d) => {
    const doc = d as unknown as Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
    const zone = doc.delivery?.zone
    return {
      id: doc.id,
      orderNumber: doc.orderNumber ?? String(doc.id),
      status: doc.status,
      createdAt: doc.createdAt,
      name: doc.customer?.name ?? '',
      phone: doc.customer?.phone ?? '',
      method: doc.delivery?.method ?? 'courier',
      zone: typeof zone === 'object' && zone ? zone.name ?? '' : '',
      address: doc.delivery?.address ?? '',
      notes: doc.notes ?? '',
      logisticsNote: doc.logisticsNote ?? '',
      items: (doc.items ?? []).map((i: { label?: string; quantity?: number }) => ({ label: i.label ?? '', quantity: i.quantity ?? 0 })),
      total: typeof doc.total === 'number' ? doc.total : null,
    }
  })

  return wrap(
    <Gutter>
      <div className="ord-dash prep">
        <header className="ord-head">
          <h1>Preparación de pedidos</h1>
          <p>Pedidos aprobados para armar y entregar. Siguen apareciendo en la lista general de Pedidos.</p>
        </header>
        <div className="ord-chips">
          {TABS.map((t, i) => (
            <a key={t.key} className={`ord-chip${t.key === tab.key ? ' is-on' : ''}`} href={`/admin/preparacion?tab=${t.key}`}>{t.label} ({counts[i].totalDocs})</a>
          ))}
        </div>
        {orders.length === 0 ? <p className="ord-empty">No hay pedidos en esta lista.</p> : (
          <div className="prep-grid">
            {orders.map((o) => (canMove ? <PrepCard key={o.id} o={o} /> : <PrepCard key={o.id} o={{ ...o, status: 'solo_lectura' }} />))}
          </div>
        )}
      </div>
    </Gutter>
  )
}
