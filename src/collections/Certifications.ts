import type { CollectionConfig } from 'payload'
import { everyone, isAdminOrGestor, softDeleteOnly } from '../access'
import { slugFrom } from '../lib/slug'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  trash: true, // eliminación lógica: los registros van a la papelera, nunca se pierden
  labels: { singular: 'Certificación', plural: 'Certificaciones' },
  admin: { useAsTitle: 'name', group: 'Catálogo', defaultColumns: ['name', 'order', 'showInFooter'] },
  defaultSort: 'order',
  access: { read: everyone, create: isAdminOrGestor, update: isAdminOrGestor, delete: softDeleteOnly },
  fields: [
    { name: 'name', type: 'text', label: 'Nombre', localized: true, required: true },
    { name: 'slug', type: 'text', label: 'Dirección web', required: true, unique: true, index: true, hooks: { beforeValidate: [slugFrom('name')] }, admin: { position: 'sidebar' } },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo o sello', admin: { description: 'Si no tiene logo, se muestra el nombre.' } },
    { name: 'description', type: 'textarea', label: 'Qué significa', localized: true },
    { name: 'url', type: 'text', label: 'Enlace a más información (opcional)' },
    { name: 'showInFooter', type: 'checkbox', label: 'Mostrar en el pie de página', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', label: 'Orden', defaultValue: 100, admin: { position: 'sidebar' } },
  ],
}
