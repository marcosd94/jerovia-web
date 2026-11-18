import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrGestor, publishedOrStaff, visibleTo } from '../access'
import { auditChange, auditDelete } from '../lib/audit'
import { slugFrom } from '../lib/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Producto', plural: 'Productos' },
  admin: { useAsTitle: 'name', group: 'Catálogo', defaultColumns: ['name', 'category', 'featured', '_status'], hidden: visibleTo('admin', 'gestor', 'visor') },
  defaultSort: 'order',
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrStaff, create: isAdminOrGestor, update: isAdminOrGestor, delete: isAdmin },
  hooks: { afterChange: [auditChange('products')], afterDelete: [auditDelete('products')] },
  fields: [
    { name: 'name', type: 'text', label: 'Nombre', localized: true, required: true },
    { name: 'slug', type: 'text', label: 'Dirección web', required: true, unique: true, index: true, hooks: { beforeValidate: [slugFrom('name')] }, admin: { position: 'sidebar', description: 'Se completa sola a partir del nombre.' } },
    { name: 'category', type: 'relationship', relationTo: 'categories', label: 'Categoría', required: true, admin: { position: 'sidebar' } },
    { name: 'brand', type: 'relationship', relationTo: 'brands', label: 'Marca', admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', label: 'Destacado en la portada', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', label: 'Orden', defaultValue: 100, admin: { position: 'sidebar', description: 'Número menor = aparece primero.' } },
    { name: 'summary', type: 'textarea', label: 'Resumen (una o dos líneas)', localized: true, maxLength: 220 },
    { name: 'description', type: 'richText', label: 'Descripción completa', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Foto principal' },
    { name: 'gallery', type: 'array', label: 'Más fotos', labels: { singular: 'Foto', plural: 'Fotos' }, fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Foto' }] },
    {
      name: 'variants',
      type: 'array',
      label: 'Presentaciones',
      labels: { singular: 'Presentación', plural: 'Presentaciones' },
      minRows: 1,
      admin: { description: 'Cada tamaño o formato del producto, con su precio.' },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Presentación (ej: 500 g)',
          localized: true,
          // Obligatoria en español; en otros idiomas, si falta, se usa la de español
          validate: (value: string | null | undefined, { req }: { req: { locale?: string | null } }) =>
            req.locale && req.locale !== 'es' ? true : value ? true : 'Completá la presentación (ej: 500 g).',
        },
        { name: 'sku', type: 'text', label: 'Código interno (opcional)' },
        { name: 'price', type: 'number', label: 'Precio en guaraníes (consumidor final)', min: 0, admin: { description: 'Dejalo vacío para mostrar "Consultar precio".' } },
        { name: 'available', type: 'checkbox', label: 'Disponible', defaultValue: true },
      ],
    },
    { name: 'certifications', type: 'relationship', relationTo: 'certifications', hasMany: true, label: 'Certificaciones del producto' },
  ],
}
