import Link from 'next/link'
import { notFound } from 'next/navigation'
import { brand, copy } from '@brand'
import { ProductCard } from '@/components/ProductCard'
import { HeroCarousel } from '@/components/HeroCarousel'
import { asMedia, getCategories, getCertifications, getHomeCarousel, getPage, getPosts, getProducts, getSettings, localePath, mediaUrl } from '@/lib/data'
import { isLocale, pick } from '@/lib/locale'
import { t } from '@/lib/messages'
import { LeafMark } from '@/components/LeafMark'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const c = copy.home
  const [settings, categories, featured, certs, press, community, carousel] = await Promise.all([
    getSettings(locale),
    getCategories(locale),
    getProducts(locale, { featured: true, limit: 8 }),
    getCertifications(locale),
    brand.features.blog ? getPosts(locale, { kind: 'prensa', limit: 4 }) : Promise.resolve([]),
    getPage(locale, 'comunidad'),
    getHomeCarousel(locale).catch(() => null), // si todavía no existe en la base, se usa la portada fija
  ])
  const useCarousel = Boolean(carousel?.enabled && (carousel.slides ?? []).some((x) => x.active !== false))
  const all = await getProducts(locale)
  const counts = new Map<number, number>()
  for (const p of all) {
    const id = typeof p.category === 'object' ? p.category.id : p.category
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }
  const heroProduct = featured.find((p) => mediaUrl(p.image, 'hero'))
  const heroImage = mediaUrl(heroProduct?.image, 'hero')
  const heroSeal = certs.find((x) => x.slug === brand.heroCertificationSlug)
  const sealUrl = mediaUrl(heroSeal?.logo, 'card')
  const certLogos = certs.filter((x) => mediaUrl(x.logo, 'card'))
  const bertoni = asMedia(community?.image)
  const bertoniUrl = mediaUrl(community?.image, 'card')
  const showPrice = Boolean(settings.shopEnabled)

  return (
    <>
      {useCarousel && carousel ? <HeroCarousel locale={locale} data={carousel} certs={certs} /> : null}
      {!useCarousel ? (
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>{pick(c.heroTitle, locale)}</h1>
            <p className="hero-text">{pick(c.heroText, locale)}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href={localePath(locale, '/productos')}>
                {pick(c.heroPrimaryCta, locale)}
              </Link>
              {brand.features.b2b ? (
                <Link className="btn btn-ghost" href={localePath(locale, '/para-empresas')}>
                  {pick(c.heroSecondaryCta, locale)}
                </Link>
              ) : null}
            </div>
          </div>
          <div className="hero-art">
            <div className="leaf-frame">
              {heroImage ? <img src={heroImage} alt={asMedia(heroProduct?.image)?.alt ?? ''} /> : <LeafMark className="card-placeholder" />}
            </div>
            {sealUrl ? (
              <div className="seal">
                <img src={sealUrl} alt={asMedia(heroSeal?.logo)?.alt ?? ''} />
              </div>
            ) : null}
          </div>
        </div>
      </section>
      ) : null}

      {categories.length > 0 ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <h2>{pick(c.categoriesTitle, locale)}</h2>
            </div>
            <div className="tiles">
              {categories.map((cat) => (
                <Link key={cat.id} className={`tile tone-${cat.tone ?? 'tone1'}`} href={localePath(locale, `/productos?categoria=${cat.slug}`)}>
                  <h3>{cat.name}</h3>
                  <span>{(counts.get(cat.id) ?? 0) === 1 ? t(locale, 'productCountOne') : t(locale, 'productCount', { n: String(counts.get(cat.id) ?? 0) })}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {featured.length > 0 ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <h2>{pick(c.featuredTitle, locale)}</h2>
              <Link className="link-quiet" href={localePath(locale, '/productos')}>
                {pick(c.heroPrimaryCta, locale)}
              </Link>
            </div>
            <div className="grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} showPrice={showPrice} canBuy={showPrice && brand.features.shop} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {brand.features.certifications && certLogos.length > 0 ? (
        <section className="cert-strip">
          <div className="wrap cert-row">
            <h2>{pick(c.certificationsTitle, locale)}</h2>
            <ul className="cert-logos">
              {certLogos.map((x) => (
                <li key={x.id}>
                  <img src={mediaUrl(x.logo, 'card') as string} alt={asMedia(x.logo)?.alt ?? x.name} loading="lazy" />
                </li>
              ))}
            </ul>
            <Link className="btn btn-ghost" href={localePath(locale, '/certificaciones')}>
              {pick(copy.certificationsPage.title, locale)}
            </Link>
          </div>
        </section>
      ) : null}

      <section className="section band-community" style={{ marginTop: '3rem' }}>
        <div className="wrap band-grid">
          <h2>{pick(c.communityTitle, locale)}</h2>
          <div>
            {bertoniUrl ? (
              <div className="bertoni">
                <img src={bertoniUrl} alt={bertoni?.alt ?? ''} />
              </div>
            ) : null}
            <p>{pick(c.communityText, locale)}</p>
            <Link className="btn btn-fresh" href={localePath(locale, '/comunidad')}>
              {pick(c.communityCta, locale)}
            </Link>
          </div>
        </div>
      </section>

      {brand.features.b2b ? (
        <section className="section band-b2b">
          <div className="wrap band-grid">
            <h2>{pick(c.b2bTitle, locale)}</h2>
            <div>
              <p>{pick(c.b2bText, locale)}</p>
              <Link className="btn btn-primary" href={localePath(locale, '/para-empresas')}>
                {pick(c.b2bCta, locale)}
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {press.length > 0 ? (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h2>{pick(c.pressTitle, locale)}</h2>
              <Link className="link-quiet" href={localePath(locale, '/blog')}>
                {pick(copy.blogPage.title, locale)}
              </Link>
            </div>
            <ul className="press-list">
              {press.map((n) => (
                <li key={n.id}>
                  <div className="press-item">
                    <span className="press-source">{n.source}</span>
                    <strong>{n.title}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  )
}
