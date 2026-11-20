import type { Metadata } from 'next'
import { siteUrl } from '@/lib/site-url'
import { notFound } from 'next/navigation'
import { brand } from '@brand'
import { Analytics } from '@/components/Analytics'
import { LinkButton } from '@/components/LinkButton'
import { getLinkPage, getSettings, mediaUrl } from '@/lib/data'
import { buildHref, type LinkKind } from '@/lib/links'
import { t } from '@/lib/messages'

export const dynamic = 'force-dynamic'

const locale = brand.defaultLocale

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(siteUrl),
    title: `${brand.name} — ${t(locale, 'linksTitle')}`,
    description: brand.seo.description[locale] ?? brand.seo.description.es,
  }
}

export default async function LinksPage() {
  if (!brand.features.links) notFound()
  const [page, settings] = await Promise.all([getLinkPage(locale), getSettings(locale)])
  if (!page.enabled) notFound()

  const items = (page.links ?? [])
    .filter((l) => l.active !== false)
    .map((l) => ({
      id: l.id ?? l.label,
      label: l.label,
      kind: l.kind as LinkKind,
      image: mediaUrl(l.image, 'card'),
      tone: l.tone ?? 'default',
      asIcon: Boolean(l.asIcon),
      href: buildHref(l.kind as LinkKind, l.value, {
        locale,
        whatsapp: settings.whatsapp,
        phone: settings.phone,
        email: settings.email,
        message: l.message,
        whatsappText: t(locale, 'whatsappGeneral'),
      }),
    }))
    .filter((l): l is typeof l & { href: string } => Boolean(l.href))

  const cover = mediaUrl(page.cover, 'hero')
  const icons = items.filter((l) => l.asIcon)
  const buttons = items.filter((l) => !l.asIcon)

  return (
    <main className="links-page">
      {cover ? <div className="links-cover"><img src={cover} alt="" /></div> : null}
      <header className={`links-head${cover ? ' with-cover' : ''}`}>
        <div className="links-logo">
          <img src={`/brand/${brand.logo.file}`} alt={brand.logo.alt} width={190} height={76} />
        </div>
        <h1>{page.title || brand.name}</h1>
        {page.bio ? <p>{page.bio}</p> : null}
      </header>
      {icons.length > 0 ? (
        <ul className="links-icons">
          {icons.map((l) => (
            <li key={l.id}>
              <LinkButton {...l} />
            </li>
          ))}
        </ul>
      ) : null}
      {buttons.length > 0 ? (
        <ul className="links-list">
          {buttons.map((l) => (
            <li key={l.id}>
              <LinkButton {...l} />
            </li>
          ))}
        </ul>
      ) : icons.length === 0 ? (
        <p className="links-empty">{t(locale, 'linksEmpty')}</p>
      ) : null}
      <footer className="links-foot">{brand.legalName}</footer>
      <Analytics locale={locale} />
    </main>
  )
}
