import type { CollectionConfig } from 'payload'
import { isAdminOrGestor, isStaffUser, visibleTo, softDeleteOnly } from '../access'
import { auditChange, auditDelete } from '../lib/audit'

export const DeliveryZones: CollectionConfig = {
  slug: 'delivery-zones',
  trash: true, // eliminación lógica: los registros van a la papelera, nunca se pierden
  labels: { singular: 'Zona de entrega', plural: 'Zonas de entrega' },
  admin: { useAsTitle: 'name', group: 'Ventas', defaultColumns: ['name', 'price', 'active'], hidden: visibleTo('admin', 'gestor', 'visor') },
  access: { read: ({ req: { user } }) => (isStaffUser(user) ? true : { active: { equals: true } }), create: isAdminOrGestor, update: isAdminOrGestor, delete: softDeleteOnly },
  hooks: { afterChange: [auditChange('delivery-zones')], afterDelete: [auditDelete('delivery-zones')] },
  fields: [
    { name: 'name', type: 'text', label: 'Zona (ej: Asunción centro)', localized: true, required: true },
    { name: 'price', type: 'number', label: 'Costo de envío en guaraníes', required: true, min: 0 },
    { name: 'eta', type: 'text', label: 'Tiempo estimado (ej: 24 a 48 horas)', localized: true },
    { name: 'active', type: 'checkbox', label: 'Disponible', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
