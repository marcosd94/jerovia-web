// Carga el contenido inicial de la marca activa (brand/active.ts). Se puede ejecutar varias veces sin duplicar datos.
// Uso:  npm run seed
import path from 'path'
import { getPayload, type Payload } from 'payload'

import { brandDir, seed } from '../../brand/active'
import type { L10n } from '../../brand/types'
import config from '../payload.config'
import { toLexical } from '../lib/lexical'

type Slugged = 'categories' | 'brands' | 'certifications' | 'products' | 'posts' | 'pages'

async function main() {
  const payload = await getPayload({ config })
  const log = (msg: string) => payload.logger.info(msg)

  // ---------- Usuarios ----------
  const adminEmail = process.env.SEED_ADMIN_EMAIL
  const adminPassword = process.env.SEED_ADMIN_PASSWORD
  if (adminEmail && adminPassword) {
    const exists = await payload.count({ collection: 'users', where: { email: { equals: adminEmail } } })
    if (!exists.totalDocs) {
      await payload.create({ collection: 'users', data: { email: adminEmail, password: adminPassword, name: 'Administrador', roles: ['admin'] } })
      log(`Usuario administrador creado: ${adminEmail}`)
    }
    if (process.env.SEED_DEMO_USERS === 'true') {
      for (const role of ['gestor', 'visor', 'logistica'] as const) {
        const email = `demo.${role}@example.com`
        const has = await payload.count({ collection: 'users', where: { email: { equals: email } } })
        if (!has.totalDocs) {
          await payload.create({ collection: 'users', data: { email, password: adminPassword, name: `Demo ${role}`, roles: [role] } })
          log(`Usuario de ejemplo creado: ${email}`)
        }
      }
    }
  } else {
    log('Sin SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD: no se crea usuario. Podés crear el primero entrando a /admin.')
  }

  // ---------- Utilidades ----------
  const findBySlug = async (collection: Slugged, slug: string) => {
    const res = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })
    return res.docs[0] as { id: number | string } | undefined
  }
  /** Carga las traducciones (en/pt) de campos simples de un documento ya creado en español */
  const translate = async (collection: Slugged, id: number | string, fields: Record<string, L10n | undefined>) => {
    for (const locale of ['en', 'pt'] as const) {
      const data: Record<string, string> = {}
      for (const [key, value] of Object.entries(fields)) if (value?.[locale]) data[key] = value[locale] as string
      if (Object.keys(data).length) {
        await payload.update({ collection, id, locale, data, overrideAccess: true, depth: 0 } as Parameters<Payload['update']>[0])
      }
    }
  }

  // ---------- Imágenes ----------
  const mediaIds = new Map<string, number | string>()
  for (const m of seed.media) {
    const existing = await payload.find({ collection: 'media', where: { filename: { equals: m.file } }, limit: 1, depth: 0 })
    if (existing.docs[0]) {
      mediaIds.set(m.key, existing.docs[0].id)
      continue
    }
    const doc = await payload.create({ collection: 'media', data: { alt: m.alt.es }, filePath: path.resolve(process.cwd(), brandDir, 'assets', m.file), locale: 'es' })
    mediaIds.set(m.key, doc.id)
    log(`Imagen cargada: ${m.file}`)
  }

  // ---------- Categorías y marcas ----------
  const categoryIds = new Map<string, number | string>()
  for (const c of seed.categories) {
    const found = await findBySlug('categories', c.slug)
    if (found) { categoryIds.set(c.slug, found.id); continue }
    const doc = await payload.create({ collection: 'categories', locale: 'es', data: { name: c.name.es, slug: c.slug, description: c.description?.es, tone: c.tone, order: c.order, active: true } })
    await translate('categories', doc.id, { name: c.name, description: c.description })
    categoryIds.set(c.slug, doc.id)
  }
  const brandIds = new Map<string, number | string>()
  for (const b of seed.brands) {
    const found = await findBySlug('brands', b.slug)
    if (found) { brandIds.set(b.slug, found.id); continue }
    const doc = await payload.create({ collection: 'brands', locale: 'es', data: { name: b.name.es, slug: b.slug, description: b.description?.es, logo: b.logo ? (mediaIds.get(b.logo) as number) : undefined } })
    brandIds.set(b.slug, doc.id)
  }

  // ---------- Certificaciones ----------
  const certIds = new Map<string, number | string>()
  for (const c of seed.certifications) {
    const found = await findBySlug('certifications', c.slug)
    if (found) { certIds.set(c.slug, found.id); continue }
    const doc = await payload.create({
      collection: 'certifications',
      locale: 'es',
      data: { name: c.name.es, slug: c.slug, description: c.description.es, logo: c.logo ? (mediaIds.get(c.logo) as number) : undefined, showInFooter: Boolean(c.footer), order: c.order },
    })
    await translate('certifications', doc.id, { name: c.name, description: c.description })
    certIds.set(c.slug, doc.id)
  }

  // ---------- Productos ----------
  for (const p of seed.products) {
    if (await findBySlug('products', p.slug)) continue
    const doc = await payload.create({
      collection: 'products',
      locale: 'es',
      draft: false,
      data: {
        _status: 'published',
        name: p.name.es,
        slug: p.slug,
        category: categoryIds.get(p.category) as number,
        brand: brandIds.get(p.brand) as number,
        summary: p.summary.es,
        description: toLexical(p.paragraphs.map((x) => x.es)) as never,
        image: p.image ? (mediaIds.get(p.image) as number) : undefined,
        featured: Boolean(p.featured),
        order: p.order,
        variants: p.variants.map((v) => ({ label: v.label.es, sku: v.sku, price: v.price, available: true })),
        certifications: (p.certifications ?? []).map((c) => certIds.get(c) as number),
      },
    })
    await translate('products', doc.id, { name: p.name, summary: p.summary })
    log(`Producto cargado: ${p.name.es}`)
  }

  // ---------- Notas ----------
  for (const n of seed.posts) {
    if (await findBySlug('posts', n.slug)) continue
    await payload.create({
      collection: 'posts',
      locale: 'es',
      draft: false,
      data: {
        _status: 'published',
        title: n.title.es,
        slug: n.slug,
        kind: n.kind,
        excerpt: n.excerpt.es,
        source: n.source,
        publishedAt: n.publishedAt ? new Date(n.publishedAt).toISOString() : undefined,
        content: n.paragraphs ? (toLexical(n.paragraphs.map((x) => x.es)) as never) : undefined,
      },
    })
  }

  // ---------- Páginas ----------
  for (const pg of seed.pages) {
    const found = await findBySlug('pages', pg.slug)
    if (found) continue
    const doc = await payload.create({
      collection: 'pages',
      locale: 'es',
      draft: false,
      data: {
        _status: 'published',
        title: pg.title.es,
        slug: pg.slug,
        intro: pg.intro?.es,
        image: pg.image ? (mediaIds.get(pg.image) as number) : undefined,
        content: toLexical(pg.paragraphs.map((x) => x.es)) as never,
      },
    })
    await translate('pages', doc.id, { title: pg.title, intro: pg.intro })
  }

  // ---------- Puntos de venta ----------
  const storeCount = await payload.count({ collection: 'store-locations' })
  if (!storeCount.totalDocs) {
    for (const s of seed.stores) await payload.create({ collection: 'store-locations', data: { ...s, active: true } })
    log(`Puntos de venta cargados: ${seed.stores.length}`)
  } else {
    // Bases ya cargadas: completa solo las coordenadas que falten (no pisa lo editado desde el panel)
    for (const s of seed.stores) {
      if (typeof s.lat !== 'number' || typeof s.lng !== 'number') continue
      const found = await payload.find({ collection: 'store-locations', where: { name: { equals: s.name } }, limit: 5, depth: 0, overrideAccess: true })
      for (const doc of found.docs) {
        if (doc.lat == null && doc.lng == null) await payload.update({ collection: 'store-locations', id: doc.id, data: { lat: s.lat, lng: s.lng }, overrideAccess: true })
      }
    }
  }

  // ---------- Zonas de entrega ----------
  const zoneCount = await payload.count({ collection: 'delivery-zones' })
  if (!zoneCount.totalDocs) {
    for (const z of seed.deliveryZones) await payload.create({ collection: 'delivery-zones', locale: 'es', data: { name: z.name.es, price: z.price, eta: z.eta?.es, active: true } })
  }

  // ---------- Configuración del sitio ----------
  const s = seed.settings
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'es',
    data: {
      shopEnabled: false,
      whatsapp: s.whatsapp,
      phone: s.phone,
      email: s.email,
      address: s.address,
      pickup: { enabled: true, address: s.pickupAddress ?? s.address },
      social: s.social,
      footerNote: s.footerNote.es,
    },
  })

  // ---------- Carrusel de la portada (no pisa lo que ya se haya cargado desde el panel) ----------
  if (seed.homeCarousel) {
    const current = await payload.findGlobal({ slug: 'home-carousel', locale: 'es', depth: 0 })
    if (!current.slides?.length) {
      await payload.updateGlobal({
        slug: 'home-carousel',
        locale: 'es',
        data: {
          enabled: true,
          autoplay: seed.homeCarousel.autoplay ?? true,
          intervalSeconds: seed.homeCarousel.intervalSeconds ?? 7,
          slides: seed.homeCarousel.slides.map((sl) => ({
            title: sl.title.es,
            text: sl.text?.es,
            kind: sl.kind ?? 'image',
            image: sl.image ? (mediaIds.get(sl.image) as number) : undefined,
            fit: sl.fit ?? 'cover',
            seal: sl.seal ? (certIds.get(sl.seal) as number) : undefined,
            ctaLabel: sl.cta?.label.es,
            ctaLink: sl.cta?.link,
            cta2Label: sl.cta2?.label.es,
            cta2Link: sl.cta2?.link,
            active: true,
          })),
        },
      })
      log(`Carrusel de portada cargado: ${seed.homeCarousel.slides.length} diapositivas`)
    }
  }

  // ---------- Página de enlaces (no pisa lo que ya se haya cargado desde el panel) ----------
  if (seed.linkPage) {
    const current = await payload.findGlobal({ slug: 'link-page', locale: 'es' })
    if (!current.links?.length) {
      await payload.updateGlobal({
        slug: 'link-page',
        locale: 'es',
        data: {
          enabled: true,
          cover: seed.linkPage.cover ? (mediaIds.get(seed.linkPage.cover) as number) : undefined,
          title: seed.linkPage.title?.es,
          bio: seed.linkPage.bio?.es,
          links: seed.linkPage.links.map((l) => ({
            label: l.label.es,
            kind: l.kind as 'web',
            value: l.value,
            message: l.message?.es,
            image: l.image ? (mediaIds.get(l.image) as number) : undefined,
            tone: l.tone ?? 'default',
            asIcon: Boolean(l.asIcon),
            active: true,
          })),
        },
      })
      log('Página de enlaces cargada.')
    }
  }


  // ---------- Traducciones (en/pt) en bases ya cargadas ----------
  // Completa solo lo que esté vacío en ese idioma: no pisa lo que se haya escrito o corregido desde el panel.
  const empty = (v: unknown) => v == null || v === '' || (typeof v === 'object' && !(v as { root?: { children?: unknown[] } }).root?.children?.length)
  const opts = { overrideAccess: true, depth: 0, fallbackLocale: false } as const
  const upd = (args: Record<string, unknown>) => payload.update({ ...opts, ...args } as unknown as Parameters<Payload['update']>[0])
  let filled = 0
  for (const locale of ['en', 'pt'] as const) {
    for (const m of seed.media) {
      const id = mediaIds.get(m.key)
      if (!id || !m.alt[locale]) continue
      const doc = await payload.findByID({ collection: 'media', id, locale, ...opts })
      if (empty(doc.alt)) { await upd({ collection: 'media', id, locale, data: { alt: m.alt[locale] } }); filled++ }
    }
    for (const c of seed.categories) {
      const id = categoryIds.get(c.slug)
      if (!id) continue
      const doc = (await payload.findByID({ collection: 'categories', id, locale, ...opts })) as unknown as Record<string, unknown>
      const data: Record<string, string> = {}
      if (empty(doc.name) && c.name[locale]) data.name = c.name[locale] as string
      if (empty(doc.description) && c.description?.[locale]) data.description = c.description[locale] as string
      if (Object.keys(data).length) { await upd({ collection: 'categories', id, locale, data }); filled++ }
    }
    for (const c of seed.certifications) {
      const id = certIds.get(c.slug)
      if (!id) continue
      const doc = (await payload.findByID({ collection: 'certifications', id, locale, ...opts })) as unknown as Record<string, unknown>
      const data: Record<string, string> = {}
      if (empty(doc.name) && c.name[locale]) data.name = c.name[locale] as string
      if (empty(doc.description) && c.description[locale]) data.description = c.description[locale] as string
      if (Object.keys(data).length) { await upd({ collection: 'certifications', id, locale, data }); filled++ }
    }
    for (const p of seed.products) {
      const found = await findBySlug('products', p.slug)
      if (!found) continue
      const doc = (await payload.findByID({ collection: 'products', id: found.id, locale, ...opts })) as unknown as Record<string, unknown>
      const data: Record<string, unknown> = {}
      if (empty(doc.name) && p.name[locale]) data.name = p.name[locale]
      if (empty(doc.summary) && p.summary[locale]) data.summary = p.summary[locale]
      if (empty(doc.description) && p.paragraphs.some((x) => x[locale])) data.description = toLexical(p.paragraphs.map((x) => x[locale] ?? x.es))
      const rows = (doc.variants ?? []) as { id?: string; label?: string }[]
      if (rows.length === p.variants.length && rows.some((r, i) => empty(r.label) && p.variants[i].label[locale])) {
        data.variants = rows.map((r, i) => ({ ...r, label: empty(r.label) ? (p.variants[i].label[locale] ?? p.variants[i].label.es) : r.label }))
      }
      if (Object.keys(data).length) { await upd({ collection: 'products', id: found.id, locale, draft: false, data }); filled++ }
    }
    for (const pg of seed.pages) {
      const found = await findBySlug('pages', pg.slug)
      if (!found) continue
      const doc = (await payload.findByID({ collection: 'pages', id: found.id, locale, ...opts })) as unknown as Record<string, unknown>
      const data: Record<string, unknown> = {}
      if (empty(doc.title) && pg.title[locale]) data.title = pg.title[locale]
      if (empty(doc.intro) && pg.intro?.[locale]) data.intro = pg.intro[locale]
      if (empty(doc.content) && pg.paragraphs.some((x) => x[locale])) data.content = toLexical(pg.paragraphs.map((x) => x[locale] ?? x.es))
      if (Object.keys(data).length) { await upd({ collection: 'pages', id: found.id, locale, draft: false, data }); filled++ }
    }
    const site = (await payload.findGlobal({ slug: 'site-settings', locale, ...opts })) as unknown as Record<string, unknown>
    if (empty(site.footerNote) && seed.settings.footerNote[locale]) {
      await payload.updateGlobal({ slug: 'site-settings', locale, data: { footerNote: seed.settings.footerNote[locale] }, ...opts } as never); filled++
    }
    if (seed.homeCarousel) {
      const es = (await payload.findGlobal({ slug: 'home-carousel', locale: 'es', ...opts })) as { slides?: { title?: string }[] }
      const cur = (await payload.findGlobal({ slug: 'home-carousel', locale, ...opts })) as { slides?: Record<string, unknown>[] }
      const src = seed.homeCarousel.slides
      const slides = cur.slides ?? []
      // solo si las diapositivas siguen siendo las de la carga inicial (mismo orden y mismos títulos)
      if (slides.length === src.length && es.slides?.every((x, i) => x.title === src[i].title.es)) {
        let changed = false
        const next = slides.map((r, i) => {
          const sl = src[i]
          const row = { ...r }
          const set = (key: string, v?: string) => { if (empty(row[key]) && v) { row[key] = v; changed = true } }
          set('title', sl.title[locale]); set('text', sl.text?.[locale]); set('ctaLabel', sl.cta?.label[locale]); set('cta2Label', sl.cta2?.label[locale])
          return row
        })
        if (changed) { await payload.updateGlobal({ slug: 'home-carousel', locale, data: { slides: next }, ...opts } as never); filled++ }
      }
    }
    if (seed.linkPage) {
      const lp = seed.linkPage
      const es = (await payload.findGlobal({ slug: 'link-page', locale: 'es', ...opts })) as { links?: { label?: string }[] }
      const cur = (await payload.findGlobal({ slug: 'link-page', locale, ...opts })) as unknown as Record<string, unknown> & { links?: Record<string, unknown>[] }
      const links = cur.links ?? []
      if (links.length === lp.links.length && es.links?.every((x, i) => x.label === lp.links[i].label.es)) {
        let changed = false
        const data: Record<string, unknown> = {}
        if (empty(cur.title) && lp.title?.[locale]) { data.title = lp.title[locale]; changed = true }
        if (empty(cur.bio) && lp.bio?.[locale]) { data.bio = lp.bio[locale]; changed = true }
        data.links = links.map((r, i) => {
          const l = lp.links[i]
          const row = { ...r }
          if (empty(row.label)) { row.label = l.label[locale] ?? l.label.es; changed = true }
          if (empty(row.message) && l.message?.[locale]) { row.message = l.message[locale]; changed = true }
          return row
        })
        if (changed) { await payload.updateGlobal({ slug: 'link-page', locale, data, ...opts } as never); filled++ }
      }
    }
  }
  if (filled) log(`Traducciones completadas (en/pt): ${filled} elementos. Son un borrador: conviene que las revise una persona nativa.`)

  log('Contenido inicial cargado.')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  console.error(JSON.stringify((error as { data?: unknown }).data ?? (error as { cause?: unknown }).cause, null, 1)?.slice(0, 1500))
  process.exit(1)
})
