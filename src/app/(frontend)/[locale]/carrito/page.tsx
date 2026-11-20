import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { brand } from '@brand'
import { CartSuggestions } from '@/components/cart/CartSuggestions'
import { CartView } from '@/components/cart/CartView'
import { getSettings, localePath } from '@/lib/data'
import { isLocale } from '@/lib/locale'
import { shopMessages, ts } from '@/lib/messages-shop'
import { getSuggestions } from '@/lib/shop'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return isLocale(locale) ? { title: ts(locale, 'cart'), robots: { index: false } } : {}
}

export default async function CartPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale) || !brand.features.shop) notFound()
  const settings = await getSettings(locale)
  if (!settings.shopEnabled) notFound()
  const suggestions = await getSuggestions(locale)
  return (
    <div className="wrap shop-page">
      <h1>{ts(locale, 'cart')}</h1>
      <CartView locale={locale} m={shopMessages(locale)} base={localePath(locale)} minOrder={settings.minOrder ?? 100000} />
      <CartSuggestions items={suggestions} base={localePath(locale)} m={shopMessages(locale)} />
    </div>
  )
}
