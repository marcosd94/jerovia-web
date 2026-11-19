// Estadísticas de pedidos para el panel de inicio del administrador. Funciones puras (sin acceso a la base).

export const STATUS_FLOW = [
  { value: 'pendiente_pago', label: 'Nuevos · pendientes de pago', tone: 'warn' },
  { value: 'pagado', label: 'Pagados · por aprobar', tone: 'warn' },
  { value: 'aprobado', label: 'Aprobados · listos para enviar', tone: 'info' },
  { value: 'listo_retiro', label: 'Listos para retirar', tone: 'info' },
  { value: 'enviado', label: 'En camino', tone: 'info' },
  { value: 'entregado', label: 'Entregados', tone: 'ok' },
  { value: 'cancelado', label: 'Cancelados', tone: 'off' },
] as const

/** Pedidos que esperan una acción del equipo antes de enviarse (lo que cuenta el globo del menú) */
export const NEEDS_ACTION = ['pendiente_pago', 'pagado'] as const

export type OrderRow = {
  status?: string | null
  total?: number | null
  createdAt: string
  delivery?: { method?: string | null; zone?: number | { id: number } | null } | null
  payment?: { method?: string | null } | null
  account?: unknown
  items?: { label?: string | null; quantity?: number | null; unitPrice?: number | null }[] | null
}

const PY_OFFSET_MS = -3 * 60 * 60 * 1000 // Paraguay: UTC-3 todo el año

/** Fecha (AAAA-MM-DD) en hora de Paraguay */
export const dayKey = (iso: string | Date): string => new Date(new Date(iso).getTime() + PY_OFFSET_MS).toISOString().slice(0, 10)
export const todayKey = (): string => dayKey(new Date())
export const addDays = (key: string, n: number): string => new Date(Date.parse(`${key}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10)
/** Inicio del día (hora de Paraguay) como instante ISO */
export const startOf = (key: string): string => `${key}T00:00:00-03:00`

export type Stats = {
  count: number
  revenue: number // ventas sin contar cancelados
  avgTicket: number
  needsAction: number
  byStatus: Record<string, { count: number; amount: number }>
  byDelivery: { label: string; count: number; amount: number }[]
  byPayment: { label: string; count: number; amount: number }[]
  byClient: { label: string; count: number; amount: number }[]
  byZone: { id: string; count: number; amount: number }[]
  byDay: { day: string; count: number; amount: number }[]
  topItems: { label: string; qty: number; amount: number }[]
}

const bump = <T extends { count: number; amount: number }>(map: Map<string, T>, key: string, make: () => T, amount: number) => {
  const cur = map.get(key) ?? make()
  cur.count += 1
  cur.amount += amount
  map.set(key, cur)
}

export function computeStats(rows: OrderRow[], from: string, to: string): Stats {
  const byStatus: Stats['byStatus'] = Object.fromEntries(STATUS_FLOW.map((s) => [s.value, { count: 0, amount: 0 }]))
  const delivery = new Map<string, { label: string; count: number; amount: number }>()
  const payment = new Map<string, { label: string; count: number; amount: number }>()
  const client = new Map<string, { label: string; count: number; amount: number }>()
  const zone = new Map<string, { id: string; count: number; amount: number }>()
  const day = new Map<string, { day: string; count: number; amount: number }>()
  const items = new Map<string, { label: string; qty: number; amount: number }>()
  let revenue = 0
  let valid = 0

  for (const r of rows) {
    const amount = r.total ?? 0
    const st = r.status ?? 'pendiente_pago'
    if (!byStatus[st]) byStatus[st] = { count: 0, amount: 0 }
    byStatus[st].count += 1
    byStatus[st].amount += amount
    if (st === 'cancelado') continue // el resto de las cifras no cuenta lo cancelado
    valid += 1
    revenue += amount
    bump(delivery, r.delivery?.method ?? '—', () => ({ label: r.delivery?.method === 'pickup' ? 'Retiro en el local' : 'Envío a domicilio', count: 0, amount: 0 }), amount)
    if (r.payment?.method) bump(payment, r.payment.method, () => ({ label: r.payment!.method as string, count: 0, amount: 0 }), amount)
    bump(client, r.account ? 'cuenta' : 'invitado', () => ({ label: r.account ? 'Con cuenta' : 'Invitados', count: 0, amount: 0 }), amount)
    const z = r.delivery?.zone
    if (r.delivery?.method !== 'pickup' && z) {
      const id = String(typeof z === 'object' ? z.id : z)
      bump(zone, id, () => ({ id, count: 0, amount: 0 }), amount)
    }
    const d = dayKey(r.createdAt)
    bump(day, d, () => ({ day: d, count: 0, amount: 0 }), amount)
    for (const it of r.items ?? []) {
      const label = it.label ?? '—'
      const cur = items.get(label) ?? { label, qty: 0, amount: 0 }
      cur.qty += it.quantity ?? 0
      cur.amount += (it.quantity ?? 0) * (it.unitPrice ?? 0)
      items.set(label, cur)
    }
  }

  // todos los días del rango, también los que no tuvieron pedidos
  const days: Stats['byDay'] = []
  for (let d = from, i = 0; d <= to && i < 400; d = addDays(d, 1), i++) days.push(day.get(d) ?? { day: d, count: 0, amount: 0 })

  const sort = <T extends { count: number }>(m: Map<string, T>) => [...m.values()].sort((a, b) => b.count - a.count)
  return {
    count: rows.length,
    revenue,
    avgTicket: valid ? Math.round(revenue / valid) : 0,
    needsAction: NEEDS_ACTION.reduce((n, s) => n + (byStatus[s]?.count ?? 0), 0),
    byStatus,
    byDelivery: sort(delivery),
    byPayment: sort(payment),
    byClient: sort(client),
    byZone: sort(zone),
    byDay: days,
    topItems: [...items.values()].sort((a, b) => b.qty - a.qty).slice(0, 8),
  }
}
