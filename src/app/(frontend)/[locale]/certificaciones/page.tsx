import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { brand, copy } from '@brand'
import { asMedia, getCertifications, mediaUrl } from '@/lib/data'
import { isLocale, pick } from '@/lib/locale'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: isLocale(locale) ? pick(copy.certificationsPage.title, locale) : 'Certificaciones' }
}

export default async function Certifications({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale) || !brand.features.certifications) notFound()
  const certs = await getCertifications(locale)
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{pick(copy.certificationsPage.title, locale)}</h1>
        <p>{pick(copy.certificationsPage.intro, locale)}</p>
      </div>
      <div className="cert-grid" style={{ paddingBottom: '4rem' }}>
        {certs.map((c) => {
          const logo = mediaUrl(c.logo, 'card')
          return (
            <article key={c.id} className="cert-card">
              <div className="cert-logo">{logo ? <img src={logo} alt={asMedia(c.logo)?.alt ?? c.name} /> : <span className="cert-badge" aria-hidden="true">{c.name.charAt(0)}</span>}</div>
              <h2 style={{ fontSize: '1.3rem' }}>{c.name}</h2>
              {c.description ? <p>{c.description}</p> : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}
