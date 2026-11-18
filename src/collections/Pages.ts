import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrGestor, publishedOrStaff, visibleTo } from '../access'
import { slugFrom } from '../lib/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Página', plural: 'Páginas' },
  admin: { useAsTitle: 'title', group: 'Contenido', defaultColumns: ['title', 'slug', '_status'], hidden: visibleTo('admin', 'gestor', 'visor') },
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrStaff, create: isAdminOrGestor, update: isAdminOrGestor, delete: isAdmin },
  fields: [
    { name: 'title', type: 'text', label: 'Título', localized: true, required: true },
    { name: 'slug', type: 'text', label: 'Dirección web', required: true, unique: true, index: true, hooks: { beforeValidate: [slugFrom('title')] }, admin: { position: 'sidebar', description: 'Ejemplo: "nosotros" se ve en /nosotros' } },
    { name: 'intro', type: 'textarea', label: 'Frase de apertura', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Imagen (opcional)' },
    { name: 'content', type: 'richText', label: 'Contenido', localized: true },
  ],
}
