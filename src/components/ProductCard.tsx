import Link from 'next/link'
import type { Locale } from '@brand/types'
import { asMedia, formatPrice, localePath, mediaUrl } from '../lib/data'
import { t } from '../lib/messages'
import type { Category, Product } from '../payload-types'
import { LeafMark } from './LeafMark'

export function ProductCard({ product, locale, showPrice }: { product: Product; locale: Locale; showPrice: boolean }) {
  const category = typeof product.category === 'object' ? (product.category as Category) : null
  const image = mediaUrl(product.image, 'card')
  const alt = asMedia(product.image)?.alt ?? product.name
  const variants = product.variants ?? []
  const prices = variants.map((v) => v.price).filter((p): p is number => typeof p === 'number')
  const minPrice = prices.length ? Math.min(...prices) : null

  return (
    <article className={`card tone-${category?.tone ?? 'tone1'}`}>
      <Link href={localePath(locale, `/productos/${product.slug}`)} className="card-link">
        <div className="card-media">
          {image ? <img src={image} alt={alt} loading="lazy" /> : <LeafMark className="card-placeholder" />}
        </div>
        <div className="card-body">
          <h3>{product.name}</h3>
          {product.summary ? <p className="card-summary">{product.summary}</p> : null}
          <p className="card-meta">{variants.map((v) => v.label).join(', ')}</p>
          <p className="card-cta">
            {showPrice && minPrice !== null ? <strong>{`${t(locale, 'priceFrom')} ${formatPrice(minPrice)}`}</strong> : <span>{t(locale, 'moreInfo')}</span>}
          </p>
        </div>
      </Link>
    </article>
  )
}
