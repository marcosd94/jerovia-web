import type { SeedData } from '../types'

// Contenido de ejemplo mínimo. Reemplazalo por el de la empresa (o cargalo desde el panel).
export const seed: SeedData = {
  settings: {
    footerNote: { es: 'Todos los derechos reservados.' },
  },
  media: [],
  categories: [{ slug: 'categoria-ejemplo', name: { es: 'Categoría de ejemplo' }, tone: 'tone1', order: 1 }],
  brands: [{ slug: 'marca-ejemplo', name: { es: 'Marca de ejemplo' } }],
  certifications: [],
  products: [
    {
      slug: 'producto-ejemplo',
      name: { es: 'Producto de ejemplo' },
      category: 'categoria-ejemplo',
      brand: 'marca-ejemplo',
      summary: { es: 'Descripción corta del producto.' },
      paragraphs: [{ es: 'Descripción completa del producto.' }],
      featured: true,
      order: 1,
      variants: [{ label: { es: 'Unidad' } }],
    },
  ],
  posts: [],
  pages: [{ slug: 'nosotros', title: { es: 'Nosotros' }, paragraphs: [{ es: 'Contá la historia de la empresa.' }] }],
  stores: [],
  linkPage: {
    bio: { es: 'Frase corta de la empresa.' },
    links: [
      { label: { es: 'Escribinos por WhatsApp' }, kind: 'whatsapp' },
      { label: { es: 'Seguinos en Instagram' }, kind: 'instagram', value: 'https://www.instagram.com/' },
    ],
  },
  deliveryZones: [],
}
