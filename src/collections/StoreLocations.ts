import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrGestor, isStaffUser, visibleTo } from '../access'

/** Saca latitud y longitud de un enlace largo de Google Maps */
export function coordsFromMapsUrl(url: string): { lat: number; lng: number } | null {
  const patterns = [/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, /@(-?\d+\.\d+),(-?\d+\.\d+)/, /[?&](?:q|query|destination)=(-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) {
      const lat = Number(m[1])
      const lng = Number(m[2])
      if (lat >= -28 && lat <= -19 && lng >= -63 && lng <= -54) return { lat, lng }
    }
  }
  return null
}

export const StoreLocations: CollectionConfig = {
  slug: 'store-locations',
  labels: { singular: 'Punto de venta', plural: 'Puntos de venta' },
  admin: { useAsTitle: 'name', group: 'Contenido', defaultColumns: ['name', 'kind', 'region', 'city', 'active'], hidden: visibleTo('admin', 'gestor', 'visor') },
  defaultSort: 'name',
  access: { read: ({ req: { user } }) => (isStaffUser(user) ? true : { active: { equals: true } }), create: isAdminOrGestor, update: isAdminOrGestor, delete: isAdmin },
  hooks: {
    // Si se pega un enlace largo de Google Maps y faltan las coordenadas, se completan solas
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        const empty = (v: unknown) => v === undefined || v === null || v === ''
        if (empty(data.lat) && empty(data.lng) && typeof data.mapsUrl === 'string') {
          const c = coordsFromMapsUrl(data.mapsUrl)
          if (c) {
            data.lat = c.lat
            data.lng = c.lng
          }
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nombre del comercio', required: true },
    { name: 'kind', type: 'select', label: 'Tipo', required: true, defaultValue: 'supermercado', options: [{ label: 'Supermercado', value: 'supermercado' }, { label: 'Farmacia', value: 'farmacia' }, { label: 'Restaurante', value: 'restaurante' }, { label: 'Tienda', value: 'tienda' }, { label: 'Otro', value: 'otro' }] },
    { name: 'region', type: 'select', label: 'Zona', required: true, defaultValue: 'gran-asuncion', options: [{ label: 'Asunción y Gran Asunción', value: 'gran-asuncion' }, { label: 'Interior del país', value: 'interior' }] },
    { name: 'city', type: 'text', label: 'Ciudad (opcional)' },
    { name: 'address', type: 'text', label: 'Dirección (opcional)' },
    { name: 'phone', type: 'text', label: 'Teléfono' },
    { name: 'mapsUrl', type: 'text', label: 'Enlace a Google Maps (opcional)', admin: { description: 'Pegá el enlace largo de Google Maps (el que se ve en la barra del navegador): las coordenadas se completan solas. Los enlaces cortos (maps.app.goo.gl) no sirven para esto.' } },
    {
      type: 'row',
      fields: [
        { name: 'lat', type: 'number', label: 'Latitud', min: -28, max: -19, admin: { step: 0.000001, description: 'Con latitud y longitud el local aparece en el mapa. Ej.: -25.297136' } },
        { name: 'lng', type: 'number', label: 'Longitud', min: -63, max: -54, admin: { step: 0.000001, description: 'Ej.: -57.578614' } },
      ],
    },
    { name: 'active', type: 'checkbox', label: 'Visible en el sitio', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
