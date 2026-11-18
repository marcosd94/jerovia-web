import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { brand, copy } from '@brand'
import { isLocale, pick } from '@/lib/locale'
import { LeadForm } from './LeadForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: isLocale(locale) ? pick(copy.b2bPage.title, locale) : 'Para empresas' }
}

export default async function ForBusiness({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale) || !brand.features.b2b) notFound()
  const c = copy.b2bPage
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{pick(c.title, locale)}</h1>
      </div>
      <div className="form-layout">
        <div>
          <p style={{ fontSize: '1.15rem', maxWidth: '55ch' }}>{pick(c.intro, locale)}</p>
          <ul className="benefits">
            {c.benefits.map((b, i) => (
              <li key={i}>{pick(b, locale)}</li>
            ))}
          </ul>
        </div>
        <LeadForm locale={locale} />
      </div>
    </div>
  )
}
