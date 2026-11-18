import type { CollectionConfig } from 'payload'
import { everyone, isAdmin, isAdminOrGestor } from '../access'
import { slugFrom } from '../lib/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Categoría', plural: 'Categorías' },
  admin: { useAsTitle: 'name', group: 'Catálogo', defaultColumns: ['name', 'order', 'active'] },
  defaultSort: 'order',
  access: { read: everyone, create: isAdminOrGestor, update: isAdminOrGestor, delete: isAdmin },
  fields: [
    { name: 'name', type: 'text', label: 'Nombre', localized: true, required: true },
    { name: 'slug', type: 'text', label: 'Dirección web', required: true, unique: true, index: true, hooks: { beforeValidate: [slugFrom('name')] }, admin: { position: 'sidebar', description: 'Se completa sola a partir del nombre.' } },
    { name: 'description', type: 'textarea', label: 'Descripción', localized: true },
    { name: 'tone', type: 'select', label: 'Color de la tarjeta', defaultValue: 'tone1', options: [{ label: 'Color 1', value: 'tone1' }, { label: 'Color 2', value: 'tone2' }, { label: 'Color 3', value: 'tone3' }, { label: 'Color 4', value: 'tone4' }], admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', label: 'Orden', defaultValue: 100, admin: { position: 'sidebar', description: 'Número menor = aparece primero.' } },
    { name: 'active', type: 'checkbox', label: 'Visible en el sitio', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
