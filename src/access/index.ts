import type { Access, FieldAccess } from 'payload'

export type Role = 'admin' | 'gestor' | 'visor' | 'logistica'

export const ROLE_OPTIONS: { label: string; value: Role }[] = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Gestor', value: 'gestor' },
  { label: 'Visor', value: 'visor' },
  { label: 'Logística', value: 'logistica' },
]

type WithRoles = { roles?: Role[] | null } | null | undefined

export const hasRole = (user: unknown, ...roles: Role[]): boolean =>
  Boolean((user as WithRoles)?.roles?.some((r) => roles.includes(r)))

// ---- Reglas por colección ----
export const isAdmin: Access = ({ req: { user } }) => hasRole(user, 'admin')
export const isAdminOrGestor: Access = ({ req: { user } }) => hasRole(user, 'admin', 'gestor')
export const canReadBackoffice: Access = ({ req: { user } }) => hasRole(user, 'admin', 'gestor', 'visor')
export const isAnyStaff: Access = ({ req: { user } }) => hasRole(user, 'admin', 'gestor', 'visor', 'logistica')
export const nobody: Access = () => false
export const everyone: Access = () => true

/** El público solo ve lo publicado; el personal del panel ve también los borradores */
export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (hasRole(user, 'admin', 'gestor', 'visor')) return true
  return { _status: { equals: 'published' } }
}

// ---- Reglas por campo ----
export const fieldAdminOrGestor: FieldAccess = ({ req: { user } }) => hasRole(user, 'admin', 'gestor')
export const fieldAdminOnly: FieldAccess = ({ req: { user } }) => hasRole(user, 'admin')
export const fieldBackoffice: FieldAccess = ({ req: { user } }) => hasRole(user, 'admin', 'gestor', 'visor')

/** Personal del panel con sesión (colección "users"). Importante: un cliente también tiene sesión, pero NO es personal. */
export const isStaffUser = (user: unknown): boolean => Boolean(user) && (user as { collection?: string }).collection === 'users'
/** Persona con sesión de cliente de la tienda (colección "customers"), distinta del personal del panel */
export const isCustomer = (user: unknown): boolean => (user as { collection?: string } | null | undefined)?.collection === 'customers'
/** Precios y totales: los ve el personal con acceso a ventas y el propio cliente (la regla de lectura del pedido ya limita a sus pedidos) */
export const fieldBackofficeOrCustomer: FieldAccess = ({ req: { user } }) => hasRole(user, 'admin', 'gestor', 'visor') || isCustomer(user)

/** Oculta una colección del menú del panel a quienes no tengan alguno de estos roles */
export const visibleTo =
  (...roles: Role[]) =>
  ({ user }: { user?: unknown }) =>
    !hasRole(user, ...roles)
