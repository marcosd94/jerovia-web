// Contrato que toda marca (empresa) debe cumplir. El núcleo del sitio solo conoce estos tipos.
export type Locale = 'es' | 'en' | 'pt'
/** Texto en varios idiomas. El español es obligatorio; el resto cae a español si falta. */
export type L10n = { es: string; en?: string; pt?: string }

export type BrandConfig = {
  /** Identificador interno, igual al nombre de la carpeta */
  id: string
  name: string
  legalName: string
  /** Idiomas disponibles en el sitio público */
  defaultLocale: Locale
  enabledLocales: Locale[]
  currency: 'PYG'
  /** Funciones que se pueden quitar o poner sin tocar el código */
  features: {
    shop: boolean // tienda (carrito y pagos). El interruptor definitivo vive en el panel: Configuración del sitio.
    blog: boolean
    b2b: boolean // página "Para empresas" + formulario de alta
    storeLocator: boolean // puntos de venta
    certifications: boolean
    whatsapp: boolean
    accounts: boolean // cuentas de clientes (ingresar, mis datos, mis pedidos). Se ofrecen en el menú cuando la tienda está activada.
    links: boolean // página de enlaces para la biografía de Instagram (/links)
  }
  logo: { file: string; alt: string }
  /** Certificación cuyo sello aparece sobre la imagen principal de la portada (opcional) */
  heroCertificationSlug?: string
  /** Menú principal. href sin idioma (ej: "/productos"); se antepone /es, /en o /pt */
  nav: { href: string; label: L10n }[]
  /** Enlace del menú que se muestra como botón destacado (ej: "/puntos-de-venta"). Opcional */
  headerCta?: string
  seo: { titleTemplate: string; description: L10n }
}

/** Textos de la portada y de secciones propias de la marca */
export type BrandCopy = {
  home: {
    heroTitle: L10n
    heroText: L10n
    heroPrimaryCta: L10n
    heroSecondaryCta: L10n
    categoriesTitle: L10n
    featuredTitle: L10n
    certificationsTitle: L10n
    communityTitle: L10n
    communityText: L10n
    communityCta: L10n
    b2bTitle: L10n
    b2bText: L10n
    b2bCta: L10n
    pressTitle: L10n
  }
  b2bPage: { title: L10n; intro: L10n; benefits: L10n[] }
  storesPage: { title: L10n; intro: L10n }
  productsPage: { title: L10n; intro: L10n }
  certificationsPage: { title: L10n; intro: L10n }
  blogPage: { title: L10n; intro: L10n }
}

/** Datos de partida para `npm run seed` */
export type SeedData = {
  settings: {
    whatsapp?: string
    phone?: string
    email?: string
    address?: string
    pickupAddress?: string
    social?: { label: string; url: string }[]
    footerNote: L10n
  }
  media: { key: string; file: string; alt: L10n }[]
  categories: { slug: string; name: L10n; description?: L10n; tone: 'tone1' | 'tone2' | 'tone3' | 'tone4'; order: number }[]
  brands: { slug: string; name: L10n; description?: L10n; logo?: string }[]
  certifications: { slug: string; name: L10n; description: L10n; logo?: string; footer?: boolean; order: number }[]
  products: {
    slug: string
    name: L10n
    category: string
    brand: string
    summary: L10n
    paragraphs: L10n[]
    image?: string
    featured?: boolean
    order: number
    variants: { label: L10n; sku?: string; price?: number }[]
    certifications?: string[]
  }[]
  posts: {
    slug: string
    title: L10n
    excerpt: L10n
    kind: 'salud' | 'recetas' | 'prensa' | 'comunidad' | 'novedades'
    source?: string
    url?: string
    publishedAt?: string // si no se conoce la fecha, se omite
    paragraphs?: L10n[]
  }[]
  pages: { slug: string; title: L10n; intro?: L10n; image?: string; paragraphs: L10n[] }[]
  stores: {
    name: string
    kind: 'supermercado' | 'farmacia' | 'restaurante' | 'tienda' | 'otro'
    region: 'gran-asuncion' | 'interior'
    city?: string
    address?: string
    phone?: string
    lat?: number
    lng?: number
    mapsUrl?: string
  }[]
  /** Botones de la página /links. kind: web | whatsapp | phone | email | instagram | facebook | tiktok | maps | other */
  linkPage?: { cover?: string; title?: L10n; bio?: L10n; links: { label: L10n; kind: string; value?: string; message?: L10n; image?: string; tone?: 'default' | 'tone1' | 'tone2' | 'tone3' | 'tone4'; asIcon?: boolean }[] }
  /** Diapositivas de la portada (se cargan solo si todavía no hay ninguna en el panel) */
  homeCarousel?: {
    autoplay?: boolean
    intervalSeconds?: number
    slides: {
      title: L10n
      text?: L10n
      kind?: 'image' | 'certifications'
      image?: string
      fit?: 'cover' | 'contain'
      seal?: string
      cta?: { label: L10n; link: string }
      cta2?: { label: L10n; link: string }
    }[]
  }
  deliveryZones: { name: L10n; price: number; eta?: L10n }[]
}
