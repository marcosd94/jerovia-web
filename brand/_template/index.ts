import type { BrandConfig, BrandCopy, SeedData } from '../types'
import { seed } from './seed'

// PLANTILLA para una empresa nueva. Pasos en docs/WHITE-LABEL.md
export const brand: BrandConfig = {
  id: '_template', // debe ser igual al nombre de la carpeta
  name: 'Nombre comercial',
  legalName: 'Razón social S.A.',
  defaultLocale: 'es',
  enabledLocales: ['es'],
  currency: 'PYG',
  features: { shop: false, blog: true, b2b: true, storeLocator: true, certifications: true, whatsapp: true, links: true, accounts: true },
  logo: { file: 'logo.png', alt: 'Nombre comercial' },
  nav: [
    { href: '/productos', label: { es: 'Productos', en: 'Products', pt: 'Produtos' } },
    { href: '/nosotros', label: { es: 'Nosotros', en: 'About us', pt: 'Sobre nós' } },
    { href: '/puntos-de-venta', label: { es: 'Dónde comprar', en: 'Where to buy', pt: 'Onde comprar' } },
    { href: '/para-empresas', label: { es: 'Para empresas', en: 'For business', pt: 'Para empresas' } },
  ],
  seo: {
    titleTemplate: '%s | Nombre comercial',
    description: { es: 'Descripción de la empresa para buscadores (máximo 160 caracteres).' },
  },
}

const t = (es: string) => ({ es })

export const copy: BrandCopy = {
  home: {
    heroTitle: t('Título principal de la portada'),
    heroText: t('Una o dos frases que expliquen qué hace la empresa.'),
    heroPrimaryCta: t('Ver productos'),
    heroSecondaryCta: t('Dónde comprar'),
    categoriesTitle: t('Nuestros productos'),
    featuredTitle: t('Destacados'),
    certificationsTitle: t('Certificaciones'),
    communityTitle: t('Nuestra gente'),
    communityText: t('Texto sobre la comunidad o el propósito.'),
    communityCta: t('Conocer más'),
    b2bTitle: t('¿Tenés un negocio?'),
    b2bText: t('Pedí condiciones especiales para tu empresa.'),
    b2bCta: t('Quiero ser cliente'),
    pressTitle: t('En los medios'),
  },
  b2bPage: { title: t('Para empresas'), intro: t('Completá el formulario y un vendedor te contacta.'), benefits: [t('Beneficio 1'), t('Beneficio 2')] },
  storesPage: { title: t('Dónde comprar'), intro: t('Encontranos en estos puntos de venta.') },
  productsPage: { title: t('Productos'), intro: t('Conocé nuestra línea.') },
  certificationsPage: { title: t('Certificaciones'), intro: t('Lo que respalda nuestros productos.') },
  blogPage: { title: t('Novedades'), intro: t('Notas y noticias de la empresa.') },
}

export { seed }
export type { SeedData }
