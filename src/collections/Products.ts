import type { CollectionConfig } from 'payload'
import { isAdminOrGestor, publishedOrStaff, visibleTo, softDeleteOnly } from '../access'
import { auditChange, auditDelete } from '../lib/audit'
import { slugFrom } from '../lib/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  trash: true, // eliminación lógica: los registros van a la papelera, nunca se pierden
  labels: { singular: 'Producto', plural: 'Productos' },
  admin: { useAsTitle: 'name', group: 'Catálogo', defaultColumns: ['name', 'presentation', 'price', 'category', '_status'], hidden: visibleTo('admin', 'gestor', 'visor') },
  defaultSort: 'order',
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrStaff, create: isAdminOrGestor, update: isAdminOrGestor, delete: softDeleteOnly },
  hooks: { afterChange: [auditChange('products')], afterDelete: [auditDelete('products')] },
  fields: [
    { name: 'name', type: 'text', label: 'Nombre', localized: true, required: true },
    { name: 'slug', type: 'text', label: 'Dirección web', required: true, unique: true, index: true, hooks: { beforeValidate: [slugFrom('name')] }, admin: { position: 'sidebar', description: 'Se completa sola a partir del nombre.' } },
    { name: 'category', type: 'relationship', relationTo: 'categories', label: 'Categoría', required: true, admin: { position: 'sidebar' } },
    { name: 'brand', type: 'relationship', relationTo: 'brands', label: 'Marca', admin: { position: 'sidebar', description: 'La marca comercial. Ejemplo: Jerovia.' } },
    {
      name: 'line',
      type: 'relationship',
      relationTo: 'product-lines',
      label: 'Línea',
      admin: { position: 'sidebar', description: 'Familia dentro de la marca. Ejemplo: Orgánico o Natural. Solo se ofrecen las líneas de la marca elegida.' },
      filterOptions: ({ siblingData }) => {
        const b = (siblingData as { brand?: number | string | { id: number | string } | null })?.brand
        const id = b && typeof b === 'object' ? b.id : b
        return id ? { brand: { equals: id } } : true
      },
    },
    { name: 'featured', type: 'checkbox', label: 'Destacado en la portada', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', label: 'Orden', defaultValue: 100, admin: { position: 'sidebar', description: 'Número menor = aparece primero.' } },
    { name: 'summary', type: 'textarea', label: 'Resumen (una o dos líneas)', localized: true, maxLength: 220 },
    { name: 'description', type: 'richText', label: 'Descripción completa', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Foto principal' },
    { name: 'gallery', type: 'array', label: 'Más fotos', labels: { singular: 'Foto', plural: 'Fotos' }, fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Foto' }] },
    {
      type: 'row',
      fields: [
        {
          name: 'presentation',
          type: 'text',
          label: 'Presentación (ej: 500 g, 25 saquitos)',
          localized: true,
          admin: { description: 'Cada producto es UNA presentación con UN precio. Si hay otro tamaño, creá otro producto.' },
        },
        { name: 'sku', type: 'text', label: 'Código interno (SKU)', index: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'price', type: 'number', label: 'Precio en guaraníes (consumidor final)', min: 0, admin: { description: 'Vacío = se muestra "Consultar precio" y no se puede comprar.' } },
        { name: 'available', type: 'checkbox', label: 'Disponible', defaultValue: true },
      ],
    },
    {
      name: 'family',
      type: 'text',
      label: 'Grupo de presentaciones (opcional)',
      index: true,
      admin: { position: 'sidebar', description: 'Solo para organizarte: mismo texto en los productos que son lo mismo en distinto tamaño. Ej: yerba-mate-organica.' },
    },
    // Campo anterior (varias presentaciones dentro de un producto). Se conserva oculto solo como respaldo de la migración.
    {
      name: 'variants',
      type: 'array',
      label: 'Presentaciones (anterior)',
      admin: { hidden: true, readOnly: true },
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'sku', type: 'text' },
        { name: 'price', type: 'number', min: 0 },
        { name: 'available', type: 'checkbox', defaultValue: true },
      ],
    },
    { name: 'certifications', type: 'relationship', relationTo: 'certifications', hasMany: true, label: 'Certificaciones del producto' },
  ],
}
