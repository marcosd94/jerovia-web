import path from 'path'
import type { CollectionConfig } from 'payload'
import { everyone, isAdmin, isAdminOrGestor } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagen', plural: 'Imágenes' },
  admin: { group: 'Contenido', useAsTitle: 'alt' },
  access: { read: everyone, create: isAdminOrGestor, update: isAdminOrGestor, delete: isAdmin },
  upload: {
    staticDir: path.resolve(process.cwd(), 'media'),
    // Sin SVG a propósito: un SVG puede contener código malicioso.
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'],
    imageSizes: [
      { name: 'thumb', width: 400, height: 400, position: 'centre' },
      { name: 'card', width: 800 },
      { name: 'hero', width: 1600 },
    ],
    adminThumbnail: 'thumb',
  },
  fields: [{ name: 'alt', type: 'text', label: 'Descripción de la imagen', localized: true, required: true, admin: { description: 'Describí lo que se ve. Ayuda a personas con lectores de pantalla y a Google.' } }],
}
