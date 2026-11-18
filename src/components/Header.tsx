import Link from 'next/link'
import { brand } from '@brand'
import type { Locale } from '@brand/types'
import { localePath } from '../lib/data'
import { pick } from '../lib/locale'
import { t } from '../lib/messages'
import { ta } from '../lib/messages-account'
import { LocaleSwitch } from './LocaleSwitch'
import { NavLinks, type NavItem } from './NavLinks'
import { MobileNav } from './MobileNav'
import { HeaderScroll } from './HeaderScroll'

export function Header({ locale, announcement, showAccount }: { locale: Locale; announcement?: string | null; showAccount?: boolean }) {
  const items = brand.nav.filter((i) => {
    if (i.href === '/blog') return brand.features.blog
    if (i.href === '/para-empresas') return brand.features.b2b
    if (i.href === '/puntos-de-venta') return brand.features.storeLocator
    if (i.href === '/certificaciones') return brand.features.certifications
    return true
  })
  const links: NavItem[] = items.map((i) => ({ href: localePath(locale, i.href), label: pick(i.label, locale), cta: i.href === brand.headerCta }))
  // el botón principal va al final del menú
  links.sort((x, y) => Number(Boolean(x.cta)) - Number(Boolean(y.cta)))
  if (showAccount) links.splice(links.findIndex((l) => l.cta) === -1 ? links.length : links.findIndex((l) => l.cta), 0, { href: localePath(locale, '/cuenta'), label: ta(locale, 'title') })
  const navLabel = t(locale, 'menu')
  return (
    <>
      <a className="skip" href="#contenido">
        {t(locale, 'skip')}
      </a>
      {announcement ? <p className="announcement">{announcement}</p> : null}
      <header className="site-header">
        <HeaderScroll />
        <div className="wrap header-row">
          <Link href={localePath(locale)} className="brand-link">
            <img src={`/brand/${brand.logo.file}`} alt={brand.logo.alt} width={168} height={66} />
          </Link>
          <NavLinks items={links} label="Principal" />
          <LocaleSwitch locales={brand.enabledLocales} current={locale} label={t(locale, 'language')} />
          <MobileNav items={links} label={navLabel} />
        </div>
      </header>
    </>
  )
}
