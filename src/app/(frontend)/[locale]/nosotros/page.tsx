import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { copy } from '@brand'
import { asMedia, getCertifications, getMediaByFilename, getPage, getSettings, localePath, mediaUrl } from '@/lib/data'
import { isLocale, pick } from '@/lib/locale'
import { RichTextView } from '@/components/RichTextView'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: isLocale(locale) && copy.aboutPage ? pick(copy.aboutPage.title, locale) : 'Nosotros' }
}

const svg = (d: ReactNode) => (
  <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
)
const ICONS: Record<string, ReactNode> = {
  economic: svg(<><circle cx="24" cy="24" r="16" /><path d="M24 14v20M29 18.5c-1.2-1.6-3-2.3-5-2.3-3 0-5 1.5-5 3.6s2 3.2 5 3.9 5 1.6 5 4-2 3.8-5 3.8c-2.2 0-4.2-.9-5.3-2.600" /></>),
  social: svg(<><circle cx="17" cy="18" r="5" /><circle cx="33" cy="20" r="4" /><path d="M7 38c0-6 4.5-10 10-10s10 4 10 10M29 29c5-1 12 1.5 12 8" /></>),
  environment: svg(<><path d="M10 38C10 20 20 10 38 10c0 18-10 28-28 28Z" /><path d="M10 38 28 20" /></>),
  nation: svg(<><path d="M12 42V8" /><path d="M12 10h24l-5 7 5 7H12" /></>),
  gluten: svg(<><path d="M24 40V18M24 18c-4-1-6-4-6-8 4 1 6 4 6 8Zm0 0c4-1 6-4 6-8-4 1-6 4-6 8Zm0 10c-4-1-6-4-6-8 4 1 6 4 6 8Zm0 0c4-1 6-4 6-8-4 1-6 4-6 8Z" /><path d="M8 40 40 8" /></>),
  health: svg(<><path d="M24 40S8 30 8 19a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 11-16 21-16 21Z" /></>),
  fair: svg(<><path d="M24 8v32M12 40h24M10 16h28" /><path d="m10 16-5 12a6 6 0 0 0 10 0l-5-12Zm28 0-5 12a6 6 0 0 0 10 0l-5-12Z" /></>),
  box: svg(<><path d="M6 15 24 6l18 9v20L24 44 6 35V15Z" /><path d="m6 15 18 9 18-9M24 24v20" /></>),
  bag: svg(<><path d="M12 16h24l2 26H10l2-26Z" /><path d="M18 20v-4a6 6 0 0 1 12 0v4" /></>),
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const a = copy.aboutPage
  if (!a) {
    // La marca no define un diseño propio: se muestra la página institucional cargada en el panel
    const page = await getPage(locale, 'nosotros')
    if (!page) notFound()
    return (
      <div className="wrap" style={{ paddingBottom: '4rem' }}>
        <div className="page-head"><h1>{page.title}</h1>{page.intro ? <p>{page.intro}</p> : null}</div>
        <RichTextView data={page.content} />
      </div>
    )
  }
  const [certs, settings, community] = await Promise.all([getCertifications(locale), getSettings(locale), getPage(locale, 'comunidad')])
  const s = settings as unknown as { address?: string; phone?: string; whatsapp?: string; email?: string }
  const logo = await getMediaByFilename(a.community.image)
  const photo = mediaUrl(logo ?? community?.image, 'card')
  const photoAlt = asMedia(logo ?? community?.image)?.alt ?? ''
  const t = (l: Parameters<typeof pick>[0]) => pick(l, locale)
  const pillarIcons = ['economic', 'social', 'environment']
  const productIcons = ['nation', 'gluten', 'health', 'fair']
  const packIcons = ['box', 'bag']
  const tel = s.phone?.replace(/[^\d+]/g, '')

  return (
    <div className="about">
      <section className="about-hero">
        <div className="wrap">
          <p className="about-kicker">{t(a.mission.kicker)}</p>
          <h1>{t(a.mission.title)}</h1>
          <div className="about-lead">{a.mission.text.map((p, i) => <p key={i}>{t(p)}</p>)}</div>
        </div>
      </section>

      {a.videos ? (
        <section className="wrap about-section">
          <h2>{t(a.videos.title)}</h2>
          <div className="about-videos">
            {a.videos.items.map((v) => (
              <figure key={v.youtubeId}>
                <div className="about-video">
                  <iframe src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`} title={`${t(a.videos!.title)} - ${t(v.label)}`} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
                </div>
                <figcaption>{t(v.label)}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="wrap about-section">
        <h2>{t(a.pillarsTitle)}</h2>
        <div className="about-pillars">
          {a.pillars.map((p, i) => (
            <article key={i} className="about-pillar">
              <span className="about-icon">{ICONS[pillarIcons[i]]}</span>
              <h3>{t(p.title)}</h3>
              <p>{t(p.text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-community">
        <div className="wrap about-community-in">
          <div>
            <h2>{t(a.community.title)}</h2>
            <p>{t(a.community.text)}</p>
            <Link className="btn btn-fresh" href={localePath(locale, '/comunidad')}>{t(a.community.cta)}</Link>
          </div>
          {photo ? <img src={photo} alt={photoAlt} /> : null}
        </div>
      </section>

      <section className="wrap about-section">
        <h2>{t(a.productTitle)}</h2>
        <div className="about-features">
          {a.product.map((p, i) => (
            <article key={i} className="about-feature">
              <span className="about-icon">{ICONS[productIcons[i]]}</span>
              <div><h3>{t(p.title)}</h3><p>{t(p.text)}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-pack">
        <div className="wrap">
          <h2>{t(a.packagingTitle)}</h2>
          <p className="about-pack-intro">{t(a.packagingIntro)}</p>
          <div className="about-pack-steps">
            {a.packaging.map((p, i) => (
              <article key={i} className="about-pack-step">
                <span className="about-icon">{ICONS[packIcons[i]]}</span>
                <h3>{t(p.title)}</h3>
                <p>{t(p.text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {certs.length > 0 ? (
        <section className="wrap about-section">
          <h2>{t(a.certsTitle)}</h2>
          <ul className="about-certs">
            {certs.map((c) => {
              const logo = mediaUrl(c.logo, 'card')
              return <li key={c.id}>{logo ? <img src={logo} alt={asMedia(c.logo)?.alt ?? c.name} /> : <span>{c.name}</span>}<small>{c.name}</small></li>
            })}
          </ul>
        </section>
      ) : null}

      <section className="wrap about-section about-contact">
        <h2>{t(a.contactTitle)}</h2>
        <address>
          {s.address ? <p>{s.address}</p> : null}
          {s.phone ? <p><a href={`tel:${tel}`}>{s.phone}</a></p> : null}
          {s.email ? <p><a href={`mailto:${s.email}`}>{s.email}</a></p> : null}
        </address>
        <Link className="btn btn-primary" href={localePath(locale, '/productos')}>{t(a.cta)}</Link>
      </section>
    </div>
  )
}
