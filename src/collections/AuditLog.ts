import type { CollectionConfig } from 'payload'
import { isAdmin, nobody, visibleTo } from '../access'

// Registro de actividad: solo lo escribe el sistema y no se puede editar ni borrar desde el panel.
export const AuditLog: CollectionConfig = {
  slug: 'audit-log',
  labels: { singular: 'Registro de actividad', plural: 'Registro de actividad' },
  admin: { useAsTitle: 'summary', group: 'Sistema', defaultColumns: ['createdAt', 'userEmail', 'action', 'collection', 'summary'], hidden: visibleTo('admin') },
  defaultSort: '-createdAt',
  access: { read: isAdmin, create: nobody, update: nobody, delete: nobody },
  fields: [
    { name: 'collection', type: 'text', label: 'Sección' },
    { name: 'docId', type: 'text', label: 'ID del registro' },
    { name: 'action', type: 'text', label: 'Acción' },
    { name: 'userEmail', type: 'text', label: 'Usuario' },
    { name: 'summary', type: 'text', label: 'Detalle' },
  ],
}
