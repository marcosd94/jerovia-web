import type { CollectionConfig } from 'payload'
import { ROLE_OPTIONS, fieldAdminOnly, isAdmin, hasRole, isStaffUser, visibleTo, softDeleteOnly } from '../access'
import { auditChange, auditDelete } from '../lib/audit'

export const Users: CollectionConfig = {
  slug: 'users',
  trash: true, // eliminación lógica: los registros van a la papelera, nunca se pierden
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  admin: { useAsTitle: 'email', group: 'Sistema', defaultColumns: ['email', 'name', 'roles'], hidden: visibleTo('admin') },
  auth: {
    tokenExpiration: 60 * 60 * 2, // la sesión vence a las 2 horas
    maxLoginAttempts: 5, // bloqueo tras 5 intentos fallidos
    lockTime: 10 * 60 * 1000, // 10 minutos
    cookies: { secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' },
  },
  access: {
    admin: ({ req: { user } }) => hasRole(user, 'admin', 'gestor', 'visor', 'logistica'),
    // Cada persona ve su propio usuario; el administrador ve todos
    read: ({ req: { user } }) => (hasRole(user, 'admin') ? true : user && isStaffUser(user) ? { id: { equals: user.id } } : false),
    create: isAdmin,
    update: ({ req: { user } }) => (hasRole(user, 'admin') ? true : user && isStaffUser(user) ? { id: { equals: user.id } } : false),
    delete: softDeleteOnly,
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        // La primera cuenta que se crea en un sistema vacío es Administrador
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
          if (totalDocs === 0) return { ...data, roles: ['admin'] }
        }
        return data
      },
    ],
    afterChange: [auditChange('users')],
    afterDelete: [auditDelete('users')],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nombre' },
    {
      name: 'roles',
      type: 'select',
      label: 'Rol',
      hasMany: true,
      required: true,
      defaultValue: ['visor'],
      options: ROLE_OPTIONS,
      saveToJWT: true,
      access: { create: fieldAdminOnly, update: fieldAdminOnly },
      admin: { description: 'Administrador: todo. Gestor: contenido, precios, pedidos y cobros. Visor: solo ver. Logística: solo pedidos aprobados.' },
    },
  ],
}
