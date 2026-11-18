import Link from 'next/link'
import type { Locale } from '@brand/types'
import { asMedia, localePath, mediaUrl } from '../lib/data'
import { t } from '../lib/messages'
import type { Certification, HomeCarousel } from '../payload-types'
import { Carousel } from './Carousel'
import { LeafMark } from './LeafMark'

const safeHref = (locale: Locale, link?: string | null) => {
  const v = (link ?? '').trim()
  if (!v) return null
  if (v.startsWith('/') && !v.startsWith('//')) return localePath(locale, v)
  return /^https:\/\//i.test(v) ? v : null
}

function Cta({ locale, label, link, ghost }: { locale: Locale; label?: string | null; link?: string | null; ghost?: boolean }) {
  const href = safeHref(locale, link)
  if (!label || !href) return null
  const external = href.startsWith('https://')
  const cls = ghost ? 'btn btn-ghost' : 'btn btn-primary'
  return external ? (
    <a className={cls} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
  ) : (
    <Link className={cls} href={href}>{label}</Link>
  )
}

/** Portada con carrusel. Cada diapositiva usa la misma estructura que la portada fija. */
export function HeroCarousel({ locale, data, certs }: { locale: Locale; data: HomeCarousel; certs: Certification[] }) {
  const slides = (data.slides ?? []).filter((s) => s.active !== false)
  const logos = certs.filter((c) => mediaUrl(c.logo, 'card'))
  const nodes = slides.map((s, i) => {
    const Title = i === 0 ? 'h1' : 'h2'
    const img = mediaUrl(s.image, 'hero')
    const seal = typeof s.seal === 'object' && s.seal ? s.seal : null
    const sealUrl = mediaUrl(seal?.logo, 'card')
    return (
      <div className="hero hero-slide" key={s.id ?? i}>
        <div className="wrap hero-grid">
          <div>
            <Title className="slide-title">{s.title}</Title>
            {s.text ? <p className="hero-text">{s.text}</p> : null}
            <div className="hero-actions">
              <Cta locale={locale} label={s.ctaLabel} link={s.ctaLink} />
              <Cta locale={locale} label={s.cta2Label} link={s.cta2Link} ghost />
            </div>
          </div>
          <div className="hero-art">
            {s.kind === 'certifications' ? (
              <ul className="cert-wall" aria-label={s.title}>
                {logos.map((c) => (
                  <li key={c.id}>
                    <img src={mediaUrl(c.logo, 'card') ?? ''} alt={asMedia(c.logo)?.alt ?? c.name} loading="lazy" />
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <div className={`leaf-frame${s.fit === 'contain' ? ' contain' : ''}`}>
                  {img ? <img src={img} alt={asMedia(s.image)?.alt ?? ''} {...(i === 0 ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })} /> : <LeafMark className="card-placeholder" />}
                </div>
                {sealUrl ? (
                  <div className="seal">
                    <img src={sealUrl} alt={asMedia(seal?.logo)?.alt ?? ''} />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    )
  })
  if (nodes.length === 0) return null
  return (
    <Carousel
      slides={nodes}
      autoplay={Boolean(data.autoplay)}
      interval={data.intervalSeconds ?? 7}
      labels={{
        region: t(locale, 'carouselLabel'),
        prev: t(locale, 'carouselPrev'),
        next: t(locale, 'carouselNext'),
        pause: t(locale, 'carouselPause'),
        play: t(locale, 'carouselPlay'),
        slide: t(locale, 'carouselSlide'),
        goTo: t(locale, 'carouselGoTo'),
      }}
    />
  )
}
