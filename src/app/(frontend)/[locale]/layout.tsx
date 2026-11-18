import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { brand } from '@brand'
import { Analytics } from '@/components/Analytics'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getCertifications, getSettings } from '@/lib/data'
import { isLocale, pick } from '@/lib/locale'
import '../globals.css'

// El contenido sale de la base de datos y cambia desde el panel: no se genera en la compilación.
export const dynamic = 'force-dynamic'

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const { locale } = await params
  const l = isLocale(locale) ? locale : brand.defaultLocale
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: brand.name, template: brand.seo.titleTemplate },
    description: pick(brand.seo.description, l),
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!isLocale(locale) || !brand.enabledLocales.includes(locale)) notFound()
  const [settings, certifications] = await Promise.all([getSettings(locale), getCertifications(locale, { footer: true })])
  return (
    <html lang={locale}>
      <body>
        <Header locale={locale} announcement={settings.announcement} showAccount={Boolean(settings.shopEnabled) && brand.features.accounts} />
        <main id="contenido">{children}</main>
        <Footer locale={locale} settings={settings} certifications={certifications} />
        <Analytics locale={locale} />
      </body>
    </html>
  )
}
