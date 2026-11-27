import type { CollectionConfig } from 'payload'
import { isAdminOrGestor, publishedOrStaff, visibleTo, softDeleteOnly } from '../access'
import { slugFrom } from '../lib/slug'

export const Posts: CollectionConfig = {
  slug: 'posts',
  trash: true, // eliminación lógica: los registros van a la papelera, nunca se pierden
  labels: { singular: 'Nota', plural: 'Notas (blog y prensa)' },
  admin: { useAsTitle: 'title', group: 'Contenido', defaultColumns: ['title', 'kind', 'publishedAt', '_status'], hidden: visibleTo('admin', 'gestor', 'visor') },
  defaultSort: '-publishedAt',
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrStaff, create: isAdminOrGestor, update: isAdminOrGestor, delete: softDeleteOnly },
  fields: [
    { name: 'title', type: 'text', label: 'Título', localized: true, required: true },
    { name: 'slug', type: 'text', label: 'Dirección web', required: true, unique: true, index: true, hooks: { beforeValidate: [slugFrom('title')] }, admin: { position: 'sidebar' } },
    {
      name: 'kind',
      type: 'select',
      label: 'Tipo de nota',
      required: true,
      defaultValue: 'novedades',
      options: [
        { label: 'Novedades', value: 'novedades' },
        { label: 'Salud y bienestar', value: 'salud' },
        { label: 'Recetas', value: 'recetas' },
        { label: 'Comunidad', value: 'comunidad' },
        { label: 'Prensa (nota de otro medio)', value: 'prensa' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'publishedAt', type: 'date', label: 'Fecha de publicación', admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } } },
    { name: 'excerpt', type: 'textarea', label: 'Resumen', localized: true, maxLength: 300 },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Imagen de portada' },
    { name: 'content', type: 'richText', label: 'Contenido', localized: true },
    { name: 'source', type: 'text', label: 'Medio (solo notas de prensa)' },
    { name: 'externalUrl', type: 'text', label: 'Enlace a la nota original (solo prensa)' },
  ],
}
