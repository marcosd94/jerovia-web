import type { CollectionConfig } from 'payload'
import { everyone, isAdminOrGestor, softDeleteOnly } from '../access'
import { auditChange, auditDelete } from '../lib/audit'
import { slugFrom } from '../lib/slug'

// Una marca (por ejemplo Jerovia) puede tener varias líneas (Orgánico, Natural).
// La línea dice "de qué familia de la marca es" un producto; la categoría dice "qué tipo de producto es" (yerba mate, azúcar, stevia…).
export const ProductLines: CollectionConfig = {
  slug: 'product-lines',
  trash: true, // eliminación lógica: los registros van a la papelera, nunca se pierden
  labels: { singular: 'Línea', plural: 'Líneas' },
  admin: { useAsTitle: 'name', group: 'Catálogo', defaultColumns: ['name', 'brand', 'order'], description: 'Familias dentro de una marca. Ejemplo: la marca Jerovia tiene las líneas Orgánico y Natural.' },
  defaultSort: 'order',
  access: { read: everyone, create: isAdminOrGestor, update: isAdminOrGestor, delete: softDeleteOnly },
  hooks: { afterChange: [auditChange('product-lines')], afterDelete: [auditDelete('product-lines')] },
  fields: [
    { name: 'name', type: 'text', label: 'Nombre de la línea', localized: true, required: true, admin: { description: 'Solo el nombre de la línea, sin repetir la marca. Ejemplo: Orgánico.' } },
    { name: 'slug', type: 'text', label: 'Dirección web', required: true, unique: true, index: true, hooks: { beforeValidate: [slugFrom('name')] }, admin: { position: 'sidebar' } },
    { name: 'brand', type: 'relationship', relationTo: 'brands', label: 'Marca', required: true, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', label: 'Orden', defaultValue: 100, admin: { position: 'sidebar', description: 'Número menor = aparece primero.' } },
    { name: 'description', type: 'textarea', label: 'Descripción', localized: true },
  ],
}
