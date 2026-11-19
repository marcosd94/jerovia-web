import Link from 'next/link'
import type { Locale } from '@brand/types'
import { asMedia, formatPrice, localePath, mediaUrl } from '../lib/data'
import { t } from '../lib/messages'
import { shopMessages } from '../lib/messages-shop'
import type { Category, Product } from '../payload-types'
import { AddToCart } from './cart/AddToCart'
import { LeafMark } from './LeafMark'

type Props = { product: Product; locale: Locale; showPrice: boolean; canBuy?: boolean }

export function ProductCard({ product, locale, showPrice, canBuy = false }: Props) {
  const category = typeof product.category === 'object' ? (product.category as Category) : null
  const image = mediaUrl(product.image, 'card')
  const alt = asMedia(product.image)?.alt ?? product.name
  const hasPrice = typeof product.price === 'number' && product.price > 0
  const soldOut = product.available === false
  const buyable = canBuy && hasPrice && !soldOut

  return (
    <article className={`card tone-${category?.tone ?? 'tone1'}`}>
      <Link href={localePath(locale, `/productos/${product.slug}`)} className="card-link">
        <div className="card-media">
          {image ? <img src={image} alt={alt} loading="lazy" /> : <LeafMark className="card-placeholder" />}
        </div>
        <div className="card-body">
          <h3>{product.name}</h3>
          {product.presentation ? <p className="card-meta">{product.presentation}</p> : null}
          {product.summary ? <p className="card-summary">{product.summary}</p> : null}
          <p className="card-cta">
            {soldOut ? <span>{t(locale, 'soldOut')}</span> : showPrice && hasPrice ? <strong>{formatPrice(product.price as number)}</strong> : <span>{showPrice ? t(locale, 'askPrice') : t(locale, 'moreInfo')}</span>}
          </p>
        </div>
      </Link>
      {buyable ? (
        <div className="card-buy">
          <AddToCart productId={product.id} label={[product.name, product.presentation].filter(Boolean).join(' ')} m={shopMessages(locale)} />
        </div>
      ) : null}
    </article>
  )
}
