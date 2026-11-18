import config from '@payload-config'
import { getPayload } from 'payload'
import type { Locale } from '@brand/types'
import type { Category, Certification, HomeCarousel, LinkPage, Media, Page, Post, Product, SiteSetting, StoreLocation } from '../payload-types'

// Lectura pública de contenido. overrideAccess:false hace que se apliquen las reglas de acceso:
// una persona sin sesión solo ve lo publicado y lo marcado como visible.
const common = { overrideAccess: false, depth: 2, pagination: false } as const

export async function getSettings(locale: Locale): Promise<SiteSetting> {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'site-settings', locale, overrideAccess: false })
}

export async function getHomeCarousel(locale: Locale): Promise<HomeCarousel> {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'home-carousel', locale, overrideAccess: false })
}

export async function getLinkPage(locale: Locale): Promise<LinkPage> {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'link-page', locale, overrideAccess: false })
}

export async function getCategories(locale: Locale): Promise<Category[]> {
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'categories', locale, where: { active: { equals: true } }, sort: 'order', ...common })
  return res.docs
}

export async function getProducts(locale: Locale, opts: { categorySlug?: string; featured?: boolean; limit?: number; excludeId?: number } = {}): Promise<Product[]> {
  const payload = await getPayload({ config })
  const and: Record<string, unknown>[] = [{ _status: { equals: 'published' } }]
  if (opts.featured) and.push({ featured: { equals: true } })
  if (opts.categorySlug) and.push({ 'category.slug': { equals: opts.categorySlug } })
  if (opts.excludeId) and.push({ id: { not_equals: opts.excludeId } })
  const res = await payload.find({ collection: 'products', locale, where: { and } as never, sort: 'order', limit: opts.limit, ...common, pagination: false })
  return res.docs
}

export async function getProduct(locale: Locale, slug: string): Promise<Product | null> {
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'products', locale, where: { slug: { equals: slug }, _status: { equals: 'published' } }, limit: 1, overrideAccess: false, depth: 2 })
  return res.docs[0] ?? null
}

export async function getCertifications(locale: Locale, opts: { footer?: boolean } = {}): Promise<Certification[]> {
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'certifications', locale, where: opts.footer ? { showInFooter: { equals: true } } : undefined, sort: 'order', ...common })
  return res.docs
}

export async function getPosts(locale: Locale, opts: { kind?: Post['kind']; limit?: number } = {}): Promise<Post[]> {
  const payload = await getPayload({ config })
  const and: Record<string, unknown>[] = [{ _status: { equals: 'published' } }]
  if (opts.kind) and.push({ kind: { equals: opts.kind } })
  const res = await payload.find({ collection: 'posts', locale, where: { and } as never, sort: '-publishedAt', limit: opts.limit, ...common, pagination: false })
  return res.docs
}

export async function getPost(locale: Locale, slug: string): Promise<Post | null> {
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'posts', locale, where: { slug: { equals: slug }, _status: { equals: 'published' } }, limit: 1, overrideAccess: false, depth: 2 })
  return res.docs[0] ?? null
}

export async function getPage(locale: Locale, slug: string): Promise<Page | null> {
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'pages', locale, where: { slug: { equals: slug }, _status: { equals: 'published' } }, limit: 1, overrideAccess: false, depth: 2 })
  return res.docs[0] ?? null
}

export async function getStores(): Promise<StoreLocation[]> {
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'store-locations', sort: 'name', ...common, depth: 0 })
  return res.docs
}

// ---- Ayudas de presentación ----
export const asMedia = (value: unknown): Media | null => (value && typeof value === 'object' ? (value as Media) : null)

/** Quita el dominio de la dirección de la imagen: así funciona igual en cualquier dominio (www, pruebas, producción) */
const relative = (url: string): string => url.replace(/^https?:\/\/[^/]+/, '')

export const mediaUrl = (value: unknown, size: 'thumb' | 'card' | 'hero' = 'card'): string | null => {
  const m = asMedia(value)
  if (!m) return null
  const url = m.sizes?.[size]?.url ?? m.url
  return url ? relative(url) : null
}

export const formatPrice = (value: number): string =>
  new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(value)

export const whatsappLink = (number: string | null | undefined, text: string): string | null =>
  number ? `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}` : null

export const localePath = (locale: Locale, path = ''): string => `/${locale}${path}`
