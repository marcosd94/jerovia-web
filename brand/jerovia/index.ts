import type { BrandConfig, BrandCopy, SeedData } from '../types'
import { fillL10n } from '../translate'
import { seed as seedEs } from './seed'
import { translations } from './translations'

const brandEs: BrandConfig = {
  id: 'jerovia',
  name: 'Jerovia Orgánico',
  legalName: 'Paraguay Business Group S.R.L.',
  defaultLocale: 'es',
  enabledLocales: ['es', 'en', 'pt'],
  currency: 'PYG',
  headerCta: '/puntos-de-venta',
  features: { shop: false, blog: true, b2b: true, storeLocator: true, certifications: true, whatsapp: true, links: true, accounts: true },
  logo: { file: 'logo-jerovia-organico.png', alt: 'Jerovia Orgánico' },
  heroCertificationSlug: 'paraguayo-como-vos',
  nav: [
    { href: '/productos', label: { es: 'Productos', en: 'Products', pt: 'Produtos' } },
    { href: '/nosotros', label: { es: 'Nosotros', en: 'About us', pt: 'Sobre nós' } },
    { href: '/certificaciones', label: { es: 'Certificaciones', en: 'Certifications', pt: 'Certificações' } },
    { href: '/puntos-de-venta', label: { es: 'Dónde comprar', en: 'Where to buy', pt: 'Onde comprar' } },
    { href: '/blog', label: { es: 'Aprendé', en: 'Learn', pt: 'Aprenda' } },
    { href: '/para-empresas', label: { es: 'Para empresas', en: 'For business', pt: 'Para empresas' } },
  ],
  seo: {
    titleTemplate: '%s | Jerovia Orgánico',
    description: {
      es: 'Yerba mate, mate cocido, azúcar orgánico y stevia de Paraguay. Productos orgánicos certificados, hechos junto a comunidades locales.',
      en: 'Organic yerba mate, mate cocido, sugar and stevia from Paraguay. Certified organic products made together with local communities.',
    },
  },
}

const copyEs: BrandCopy = {
  home: {
    heroTitle: {
      es: 'Yerba, mate cocido y stevia orgánicos. Hechos en Paraguay.',
      en: 'Organic yerba mate, mate cocido and stevia. Made in Paraguay.',
      pt: 'Erva-mate, mate cozido e stevia orgânicos. Feitos no Paraguai.',
    },
    heroText: {
      es: 'Cultivados sin pesticidas y elaborados junto a comunidades locales. Un cambio de consumo para tu cuerpo y tu relación con el planeta.',
      en: 'Grown without pesticides and made together with local communities. A change in what you consume, for your body and for the planet.',
      pt: 'Cultivados sem pesticidas e elaborados junto a comunidades locais. Uma mudança de consumo para o seu corpo e para o planeta.',
    },
    heroPrimaryCta: { es: 'Ver productos', en: 'See products', pt: 'Ver produtos' },
    heroSecondaryCta: { es: 'Soy empresa', en: 'I am a business', pt: 'Sou empresa' },
    categoriesTitle: { es: 'Elegí tu línea', en: 'Choose your range', pt: 'Escolha a sua linha' },
    featuredTitle: { es: 'Los más pedidos', en: 'Most requested', pt: 'Os mais pedidos' },
    certificationsTitle: { es: 'Certificados y con origen paraguayo', en: 'Certified, with Paraguayan origin', pt: 'Certificados e de origem paraguaia' },
    communityTitle: { es: 'Producir bien también es cuidar a quienes producen', en: 'Producing well also means caring for those who produce' },
    communityText: {
      es: 'Trabajamos con la Fundación Moisés Bertoni y su proyecto autosostenible del Centro Educativo Mbaracayú, que impulsa el espíritu emprendedor de jóvenes indígenas y campesinos y la conservación de la Reserva de Biosfera del Bosque Mbaracayú.',
      en: 'We work with the Moisés Bertoni Foundation and its self-sustaining project at the Mbaracayú Educational Center, which supports young indigenous and rural entrepreneurs and the conservation of the Mbaracayú Forest Biosphere Reserve.',
    },
    communityCta: { es: 'Conocé la comunidad', en: 'Meet the community' },
    b2bTitle: { es: '¿Tenés un negocio o distribuís?', en: 'Do you run a business or distribute?' },
    b2bText: {
      es: 'Pedí condiciones para tu empresa. Un vendedor te contacta con precios y presentaciones para distribuidores y supermercados.',
      en: 'Ask for terms for your company. A sales representative will contact you with prices and formats for distributors and supermarkets.',
    },
    b2bCta: { es: 'Pedir condiciones', en: 'Request terms' },
    pressTitle: { es: 'Jerovia en los medios', en: 'Jerovia in the press' },
  },
  b2bPage: {
    title: { es: 'Para empresas', en: 'For business', pt: 'Para empresas' },
    intro: {
      es: 'Si distribuís o vendés productos orgánicos paraguayos, dejanos tus datos. Un vendedor te va a contactar con condiciones, presentaciones y precios para tu empresa.',
      en: 'If you distribute or sell Paraguayan organic products, leave us your details. A sales representative will contact you with terms, formats and prices for your company.',
    },
    benefits: [
      { es: 'Precios y condiciones para distribuidores y supermercados, acordados directamente con un vendedor.' },
      { es: 'Productos con certificaciones vigentes y origen paraguayo.' },
      { es: 'Presentaciones para el hogar y para bares, cafés, restaurantes y heladerías.' },
    ],
  },
  storesPage: {
    title: { es: 'Dónde comprar', en: 'Where to buy', pt: 'Onde comprar' },
    intro: { es: 'Comercios que apoyan lo orgánico y lo nacional. Consultá disponibilidad en cada local.', en: 'Shops that support organic and national products. Ask each store about availability.' },
  },
  productsPage: {
    title: { es: 'Productos', en: 'Products', pt: 'Produtos' },
    intro: { es: 'Yerba mate, mate cocido, azúcar orgánico y stevia.', en: 'Yerba mate, mate cocido, organic sugar and stevia.' },
  },
  certificationsPage: {
    title: { es: 'Certificaciones', en: 'Certifications', pt: 'Certificações' },
    intro: {
      es: 'Lo que hacemos está respaldado por organizaciones que verifican nuestros productos y nuestra forma de trabajar.',
      en: 'What we do is backed by organizations that verify our products and the way we work.',
    },
  },
  blogPage: {
    title: { es: 'Aprendé', en: 'Learn', pt: 'Aprenda' },
    intro: { es: 'Notas, novedades y lo que dicen los medios sobre Jerovia.', en: 'Articles, news and what the press says about Jerovia.' },
  },
}

export const brand: BrandConfig = fillL10n(brandEs, translations)
export const copy: BrandCopy = fillL10n(copyEs, translations)
export const seed: SeedData = fillL10n(seedEs, translations)
export type { SeedData }
