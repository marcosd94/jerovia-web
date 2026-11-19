import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { brand } from '@brand'
import { CheckoutForm } from '@/components/cart/CheckoutForm'
import { getCustomer } from '@/lib/customer'
import { getSettings, localePath } from '@/lib/data'
import { isLocale } from '@/lib/locale'
import { shopMessages, ts } from '@/lib/messages-shop'
import { getZones } from '@/lib/shop'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return isLocale(locale) ? { title: ts(locale, 'checkoutTitle'), robots: { index: false } } : {}
}

export default async function CheckoutPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale) || !brand.features.shop) notFound()
  const settings = await getSettings(locale)
  if (!settings.shopEnabled) notFound()
  const [zones, customer] = await Promise.all([getZones(locale), getCustomer()])
  const first = customer?.addresses?.[0]
  const defaults = {
    name: customer?.name ?? '',
    phone: customer?.phone ?? '',
    email: customer?.email ?? '',
    ruc: customer?.billing?.documentNumber ?? '',
    businessName: customer?.billing?.businessName ?? '',
    address: first ? [first.address, first.reference].filter(Boolean).join('. ') : '',
    zone: first?.zone ? String(typeof first.zone === 'object' ? first.zone.id : first.zone) : '',
  }
  return (
    <div className="wrap shop-page">
      <h1>{ts(locale, 'checkoutTitle')}</h1>
      <CheckoutForm
        locale={locale}
        base={localePath(locale)}
        m={shopMessages(locale)}
        zones={zones}
        pickup={{ enabled: settings.pickup?.enabled !== false, address: settings.pickup?.address ?? settings.address ?? '' }}
        pay={{ transfer: settings.payments?.transferEnabled !== false, cash: settings.payments?.cashEnabled !== false }}
        customerName={customer?.name ?? null}
        defaults={defaults}
        accounts={brand.features.accounts}
      />
    </div>
  )
}
