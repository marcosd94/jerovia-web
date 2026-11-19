import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { brand } from '@brand'
import { AddToCart } from '@/components/cart/AddToCart'
import { LeafMark } from '@/components/LeafMark'
import { ProductCard } from '@/components/ProductCard'
import { RichTextView } from '@/components/RichTextView'
import { asMedia, formatPrice, getProduct, getProducts, getSettings, localePath, mediaUrl, whatsappLink } from '@/lib/data'
import { isLocale } from '@/lib/locale'
import { t } from '@/lib/messages'
import { shopMessages, ts } from '@/lib/messages-shop'
import type { Category, Certification } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const p = await getProduct(locale, slug)
  return p ? { title: p.name, description: p.summary ?? undefined } : {}
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const product = await getProduct(locale, slug)
  if (!product) notFound()
  const settings = await getSettings(locale)
  const category = typeof product.category === 'object' ? (product.category as Category) : null
  const related = category ? await getProducts(locale, { categorySlug: category.slug, excludeId: product.id, limit: 12 }) : []
  const image = mediaUrl(product.image, 'hero')
  const showPrice = Boolean(settings.shopEnabled)
  const canBuy = showPrice && brand.features.shop
  const hasPrice = typeof product.price === 'number' && product.price > 0
  const buyable = hasPrice && product.available !== false
  const wa = brand.features.whatsapp ? whatsappLink(settings.whatsapp, t(locale, 'whatsappProduct', { name: product.name })) : null
  const certs = (product.certifications ?? []).filter((c): c is Certification => typeof c === 'object')

  return (
    <div className="wrap">
      <div className="product-grid">
        <div className="product-media">
          {image ? <img src={image} alt={asMedia(product.image)?.alt ?? product.name} /> : <LeafMark className="card-placeholder" />}
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          {product.summary ? <p className="summary">{product.summary}</p> : null}
          {product.presentation ? <p className="product-presentation">{product.presentation}</p> : null}
          <p className="product-price">
            {product.available === false ? t(locale, 'soldOut') : showPrice && hasPrice ? formatPrice(product.price as number) : t(locale, 'askPrice')}
          </p>
          {canBuy && buyable ? <AddToCart productId={product.id} label={[product.name, product.presentation].filter(Boolean).join(' ')} m={shopMessages(locale)} /> : null}
          {canBuy ? (
            <p className="muted" style={{ margin: '0.8rem 0 1.2rem' }}>
              <Link href={localePath(locale, '/carrito')}>{ts(locale, 'viewCart')}</Link>
            </p>
          ) : null}
          <div className="product-actions">
            {wa ? (
              <a className="btn btn-primary" href={wa} target="_blank" rel="noopener noreferrer">
                {t(locale, 'askWhatsapp')}
              </a>
            ) : null}
            {brand.features.storeLocator ? (
              <Link className="btn btn-ghost" href={localePath(locale, '/puntos-de-venta')}>
                {t(locale, 'whereToBuy')}
              </Link>
            ) : null}
          </div>
          <RichTextView data={product.description} />
          {certs.length > 0 ? (
            <ul className="mini-certs" aria-label={t(locale, 'certificationsOfProduct')}>
              {certs.map((c) => {
                const logo = mediaUrl(c.logo, 'card')
                return <li key={c.id}>{logo ? <img src={logo} alt={asMedia(c.logo)?.alt ?? c.name} /> : <span>{c.name}</span>}</li>
              })}
            </ul>
          ) : null}
        </div>
      </div>
      {related.length > 0 ? (
        <section style={{ paddingBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>{t(locale, 'related')}</h2>
          <div className="grid">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} showPrice={showPrice} canBuy={canBuy} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
