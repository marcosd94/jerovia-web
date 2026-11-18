import type { CollectionConfig } from 'payload'
import { everyone, isAdmin, isAdminOrGestor } from '../access'
import { slugFrom } from '../lib/slug'

export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: { singular: 'Marca', plural: 'Marcas' },
  admin: { useAsTitle: 'name', group: 'Catálogo' },
  access: { read: everyone, create: isAdminOrGestor, update: isAdminOrGestor, delete: isAdmin },
  fields: [
    { name: 'name', type: 'text', label: 'Nombre', localized: true, required: true },
    { name: 'slug', type: 'text', label: 'Dirección web', required: true, unique: true, index: true, hooks: { beforeValidate: [slugFrom('name')] }, admin: { position: 'sidebar' } },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
    { name: 'description', type: 'textarea', label: 'Descripción', localized: true },
  ],
}
