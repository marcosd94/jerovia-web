import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { brand, copy } from '@brand'
import { CatalogTools, type CatalogItem } from '@/components/CatalogTools'
import { ProductCard } from '@/components/ProductCard'
import { getCategories, getLines, getProducts, getSettings, localePath } from '@/lib/data'
import { isLocale, pick } from '@/lib/locale'
import { t } from '@/lib/messages'
import { ts } from '@/lib/messages-shop'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ categoria?: string; linea?: string }> }

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const { locale } = await params
  return { title: isLocale(locale) ? pick(copy.productsPage.title, locale) : 'Productos' }
}

export default async function Products({ params, searchParams }: Props) {
  const { locale } = await params
  const { categoria, linea } = await searchParams
  if (!isLocale(locale)) notFound()
  const [settings, categories, lines, products] = await Promise.all([getSettings(locale), getCategories(locale), getLines(locale), getProducts(locale, { categorySlug: categoria, lineSlug: linea })])
  const canBuy = Boolean(settings.shopEnabled) && brand.features.shop
  // Enlaces de filtros: categoría y línea se combinan
  const href = (c?: string, l?: string) => {
    const q = new URLSearchParams()
    if (c) q.set('categoria', c)
    if (l) q.set('linea', l)
    const qs = q.toString()
    return localePath(locale, `/productos${qs ? `?${qs}` : ''}`)
  }
  const items: CatalogItem[] = products.map((p) => {
    const cat = typeof p.category === 'object' ? p.category : null
    const ln = typeof p.line === 'object' ? p.line : null
    return {
      id: p.id,
      text: [p.name, p.presentation, p.summary, p.sku, cat?.name, ln?.name].filter(Boolean).join(' '),
      node: <ProductCard product={p} locale={locale} showPrice={Boolean(settings.shopEnabled)} canBuy={canBuy} />,
    }
  })
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{pick(copy.productsPage.title, locale)}</h1>
        <p>{pick(copy.productsPage.intro, locale)}</p>
      </div>
      <nav className="filters" aria-label={pick(copy.productsPage.title, locale)}>
        <Link href={href(undefined, linea)} aria-current={!categoria ? 'true' : undefined}>
          {t(locale, 'allProducts')}
        </Link>
        {categories.map((c) => (
          <Link key={c.id} href={href(c.slug, linea)} aria-current={categoria === c.slug ? 'true' : undefined}>
            {c.name}
          </Link>
        ))}
      </nav>
      {lines.length > 1 ? (
        <nav className="filters filters-lines" aria-label={t(locale, 'lineLabel')}>
          <span className="filters-label">{t(locale, 'lineLabel')}</span>
          <Link href={href(categoria)} aria-current={!linea ? 'true' : undefined}>{t(locale, 'allLines')}</Link>
          {lines.map((l) => (
            <Link key={l.id} href={href(categoria, l.slug)} aria-current={linea === l.slug ? 'true' : undefined}>{l.name}</Link>
          ))}
        </nav>
      ) : null}
      {canBuy ? (
        <p className="catalog-cart">
          <Link className="btn btn-ghost btn-sm" href={localePath(locale, '/carrito')}>{ts(locale, 'viewCart')}</Link>
        </p>
      ) : null}
      {products.length === 0 ? (
        <p>{t(locale, 'noProducts')}</p>
      ) : (
        <CatalogTools
          key={`${categoria ?? ''}|${linea ?? ''}`}
          items={items}
          labels={{
            search: t(locale, 'searchLabel'),
            placeholder: t(locale, 'searchPlaceholder'),
            clear: t(locale, 'searchClear'),
            none: t(locale, 'searchNone'),
            grid: t(locale, 'viewGrid'),
            list: t(locale, 'viewList'),
            count: t(locale, 'productCount'),
            countOne: t(locale, 'productCountOne'),
          }}
        />
      )}
    </div>
  )
}
