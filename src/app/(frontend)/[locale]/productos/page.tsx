import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { brand, copy } from '@brand'
import { ProductCard } from '@/components/ProductCard'
import { getCategories, getProducts, getSettings, localePath } from '@/lib/data'
import { isLocale, pick } from '@/lib/locale'
import { t } from '@/lib/messages'
import { ts } from '@/lib/messages-shop'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ categoria?: string }> }

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const { locale } = await params
  return { title: isLocale(locale) ? pick(copy.productsPage.title, locale) : 'Productos' }
}

export default async function Products({ params, searchParams }: Props) {
  const { locale } = await params
  const { categoria } = await searchParams
  if (!isLocale(locale)) notFound()
  const [settings, categories, products] = await Promise.all([getSettings(locale), getCategories(locale), getProducts(locale, { categorySlug: categoria })])
  const canBuy = Boolean(settings.shopEnabled) && brand.features.shop
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{pick(copy.productsPage.title, locale)}</h1>
        <p>{pick(copy.productsPage.intro, locale)}</p>
      </div>
      <nav className="filters" aria-label={pick(copy.productsPage.title, locale)}>
        <Link href={localePath(locale, '/productos')} aria-current={!categoria ? 'true' : undefined}>
          {t(locale, 'allProducts')}
        </Link>
        {categories.map((c) => (
          <Link key={c.id} href={localePath(locale, `/productos?categoria=${c.slug}`)} aria-current={categoria === c.slug ? 'true' : undefined}>
            {c.name}
          </Link>
        ))}
      </nav>
      {canBuy ? (
        <p className="catalog-cart">
          <Link className="btn btn-ghost btn-sm" href={localePath(locale, '/carrito')}>{ts(locale, 'viewCart')}</Link>
        </p>
      ) : null}
      {products.length === 0 ? (
        <p>{t(locale, 'noProducts')}</p>
      ) : (
        <div className="grid" style={{ paddingBottom: '4rem' }}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} showPrice={Boolean(settings.shopEnabled)} canBuy={canBuy} />
          ))}
        </div>
      )}
    </div>
  )
}
