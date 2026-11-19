import type { AdminViewServerProps } from 'payload'
import { Gutter } from '@payloadcms/ui'
import { hasRole } from '../../access'
import { addDays, computeStats, startOf, STATUS_FLOW, todayKey, type OrderRow } from '../../lib/order-stats'

const gs = (n: number) => `Gs. ${Math.round(n).toLocaleString('es-PY')}`
const DATE = /^\d{4}-\d{2}-\d{2}$/
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ''

/** Panel de inicio del administrador: estadísticas de pedidos con filtros (se abre primero al entrar) */
export async function OrdersDashboard(props: AdminViewServerProps) {
  const { initPageResult, searchParams = {} } = props
  const { req } = initPageResult
  const { payload, user } = req
  const sp = searchParams as Record<string, string | string[] | undefined>
  const isStaff = hasRole(user, 'admin', 'gestor', 'visor', 'logistica')
  const seesMoney = hasRole(user, 'admin', 'gestor', 'visor')

  const today = todayKey()
  const all = one(sp.rango) === 'todo'
  const desde = DATE.test(one(sp.desde)) ? one(sp.desde) : all ? '' : addDays(today, -29)
  const hasta = DATE.test(one(sp.hasta)) ? one(sp.hasta) : today
  const estado = one(sp.estado)
  const entrega = one(sp.entrega)
  const pago = one(sp.pago)
  const cliente = one(sp.cliente)
  const zona = one(sp.zona)

  const zonesRes = isStaff ? await payload.find({ collection: 'delivery-zones', limit: 100, depth: 0, pagination: false, user, req, overrideAccess: false }) : { docs: [] }
  const zoneName = new Map(zonesRes.docs.map((z) => [String(z.id), z.name as string]))

  const and: Record<string, unknown>[] = []
  if (desde) and.push({ createdAt: { greater_than_equal: startOf(desde) } })
  and.push({ createdAt: { less_than: startOf(addDays(hasta, 1)) } })
  if (estado) and.push({ status: { equals: estado } })
  if (entrega) and.push({ 'delivery.method': { equals: entrega } })
  if (pago && seesMoney) and.push({ 'payment.method': { equals: pago } })
  if (cliente === 'cuenta') and.push({ account: { exists: true } })
  if (cliente === 'invitado') and.push({ account: { exists: false } })
  if (zona) and.push({ 'delivery.zone': { equals: zona } })

  let rows: OrderRow[] = []
  if (isStaff) {
    const res = await payload.find({
      collection: 'orders',
      where: { and } as never,
      limit: 5000,
      pagination: false,
      depth: 0,
      sort: '-createdAt',
      select: { status: true, total: true, createdAt: true, delivery: true, payment: true, account: true, items: true },
      user,
      req,
      overrideAccess: false,
    })
    rows = res.docs as unknown as OrderRow[]
  }
  const first = rows.length ? rows[rows.length - 1].createdAt.slice(0, 10) : today
  const stats = computeStats(rows, desde || first, hasta)
  const maxDay = Math.max(1, ...stats.byDay.map((d) => d.count))
  const maxItem = Math.max(1, ...stats.topItems.map((i) => i.qty))

  const link = (over: Record<string, string>) => {
    const q = new URLSearchParams()
    const base: Record<string, string> = { desde, hasta, estado, entrega, pago, cliente, zona, ...over }
    for (const [k, v] of Object.entries(base)) if (v) q.set(k, v)
    return `/admin?${q.toString()}`
  }
  const preset = (label: string, from: string | null, to = today) => (
    <a key={label} className="ord-chip" href={from === null ? link({ desde: '', hasta: '', rango: 'todo' }) : link({ desde: from, hasta: to, rango: '' })}>
      {label}
    </a>
  )
  const monthStart = `${today.slice(0, 7)}-01`
  const listLink = (status: string) => `/admin/collections/orders?where[status][equals]=${status}`

  return (
    <Gutter>
      <div className="ord-dash">
        <header className="ord-head">
          <h1>Panel de pedidos</h1>
          <p>{all ? 'Todo el historial' : `Del ${desde.split('-').reverse().join('/')} al ${hasta.split('-').reverse().join('/')}`} · {stats.count} pedidos</p>
        </header>

        {stats.needsAction > 0 ? (
          <a className="ord-alert" href="/admin/collections/orders?where[status][in]=pendiente_pago,pagado">
            <strong>{stats.needsAction}</strong> {stats.needsAction === 1 ? 'pedido espera' : 'pedidos esperan'} acción para poder enviarse (pendientes de pago o por aprobar). Ver la lista
          </a>
        ) : null}

        <form className="ord-filters" method="get" action="/admin">
          <div className="ord-chips">
            {preset('Hoy', today)}
            {preset('Últimos 7 días', addDays(today, -6))}
            {preset('Últimos 30 días', addDays(today, -29))}
            {preset('Este mes', monthStart)}
            {preset('Todo', null)}
          </div>
          <label>Desde<input type="date" name="desde" defaultValue={desde} /></label>
          <label>Hasta<input type="date" name="hasta" defaultValue={hasta} /></label>
          <label>Estado
            <select name="estado" defaultValue={estado}>
              <option value="">Todos</option>
              {STATUS_FLOW.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
          <label>Entrega
            <select name="entrega" defaultValue={entrega}>
              <option value="">Todas</option>
              <option value="courier">Envío a domicilio</option>
              <option value="pickup">Retiro en el local</option>
            </select>
          </label>
          {seesMoney ? (
            <label>Forma de pago
              <select name="pago" defaultValue={pago}>
                <option value="">Todas</option>
                <option value="Transferencia o QR">Transferencia o QR</option>
                <option value="Pago contra entrega">Pago contra entrega</option>
                <option value="Pago al retirar">Pago al retirar</option>
              </select>
            </label>
          ) : null}
          <label>Cliente
            <select name="cliente" defaultValue={cliente}>
              <option value="">Todos</option>
              <option value="cuenta">Con cuenta</option>
              <option value="invitado">Invitados</option>
            </select>
          </label>
          <label>Zona
            <select name="zona" defaultValue={zona}>
              <option value="">Todas</option>
              {zonesRes.docs.map((z) => <option key={z.id} value={z.id}>{z.name as string}</option>)}
            </select>
          </label>
          <div className="ord-filter-actions">
            <button type="submit" className="btn btn--style-primary btn--size-medium">Aplicar</button>
            <a href="/admin" className="ord-reset">Limpiar</a>
          </div>
        </form>

        <section className="ord-kpis" aria-label="Resumen">
          <div className="ord-kpi"><span>Pedidos</span><strong>{stats.count}</strong></div>
          {seesMoney ? <div className="ord-kpi"><span>Ventas (sin cancelados)</span><strong>{gs(stats.revenue)}</strong></div> : null}
          {seesMoney ? <div className="ord-kpi"><span>Ticket promedio</span><strong>{gs(stats.avgTicket)}</strong></div> : null}
          <div className="ord-kpi ord-kpi--warn"><span>Esperan acción</span><strong>{stats.needsAction}</strong></div>
        </section>

        <h2>Pedidos por estado</h2>
        <section className="ord-status">
          {STATUS_FLOW.map((s) => {
            const v = stats.byStatus[s.value] ?? { count: 0, amount: 0 }
            return (
              <a key={s.value} className={`ord-card ord-card--${s.tone}`} href={listLink(s.value)}>
                <span>{s.label}</span>
                <strong>{v.count}</strong>
                {seesMoney ? <small>{gs(v.amount)}</small> : null}
              </a>
            )
          })}
        </section>

        <h2>Pedidos por día</h2>
        <section className="ord-chart" aria-label="Pedidos por día">
          {stats.byDay.map((d) => (
            <div key={d.day} className="ord-bar" title={`${d.day.split('-').reverse().join('/')}: ${d.count} pedidos${seesMoney ? ` · ${gs(d.amount)}` : ''}`}>
              <i style={{ height: `${(d.count / maxDay) * 100}%` }} />
            </div>
          ))}
        </section>
        <p className="ord-axis"><span>{stats.byDay[0]?.day.split('-').reverse().join('/')}</span><span>máximo {maxDay} por día</span><span>{stats.byDay.at(-1)?.day.split('-').reverse().join('/')}</span></p>

        <div className="ord-grid">
          <Breakdown title="Entrega" rows={stats.byDelivery} money={seesMoney} />
          {seesMoney ? <Breakdown title="Forma de pago" rows={stats.byPayment} money /> : null}
          <Breakdown title="Cliente" rows={stats.byClient} money={seesMoney} />
          <Breakdown title="Zona de envío" rows={stats.byZone.map((z) => ({ label: zoneName.get(z.id) ?? `Zona ${z.id}`, count: z.count, amount: z.amount }))} money={seesMoney} />
        </div>

        <h2>Productos más pedidos</h2>
        {stats.topItems.length === 0 ? <p className="ord-empty">Todavía no hay pedidos en este período.</p> : (
          <ul className="ord-top">
            {stats.topItems.map((i) => (
              <li key={i.label}>
                <span>{i.label}</span>
                <b>{i.qty} u.</b>
                <i style={{ width: `${(i.qty / maxItem) * 100}%` }} />
                {seesMoney ? <em>{gs(i.amount)}</em> : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Gutter>
  )
}

function Breakdown({ title, rows, money }: { title: string; rows: { label: string; count: number; amount: number }[]; money?: boolean }) {
  return (
    <section className="ord-break">
      <h3>{title}</h3>
      {rows.length === 0 ? <p className="ord-empty">Sin datos</p> : (
        <ul>
          {rows.map((r) => <li key={r.label}><span>{r.label}</span><b>{r.count}</b>{money ? <em>{gs(r.amount)}</em> : null}</li>)}
        </ul>
      )}
    </section>
  )
}
