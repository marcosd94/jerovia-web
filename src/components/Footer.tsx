import { brand } from '@brand'
import type { Locale } from '@brand/types'
import { asMedia, mediaUrl, whatsappLink } from '../lib/data'
import { t } from '../lib/messages'
import type { Certification, SiteSetting } from '../payload-types'

export function Footer({ locale, settings, certifications }: { locale: Locale; settings: SiteSetting; certifications: Certification[] }) {
  const wa = brand.features.whatsapp ? whatsappLink(settings.whatsapp, t(locale, 'whatsappGeneral')) : null
  return (
    <footer className="site-footer">
      <div className="wrap">
        {certifications.length > 0 ? (
          <ul className="footer-certs" aria-label={t(locale, 'certificationsOfProduct')}>
            {certifications.map((c) => {
              const logo = mediaUrl(c.logo, 'card')
              return (
                <li key={c.id}>
                  {logo ? <img src={logo} alt={asMedia(c.logo)?.alt ?? c.name} loading="lazy" /> : <span>{c.name}</span>}
                </li>
              )
            })}
          </ul>
        ) : null}
        <div className="footer-grid">
          <div>
            <p className="footer-brand">{brand.name}</p>
            {settings.footerNote ? <p>{settings.footerNote}</p> : null}
          </div>
          <div>
            <h2>{t(locale, 'contact')}</h2>
            <ul>
              {settings.address ? <li>{settings.address}</li> : null}
              {settings.phone ? <li><a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}>{settings.phone}</a></li> : null}
              {settings.email ? <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li> : null}
              {wa ? <li><a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a></li> : null}
              {(settings.social ?? []).map((s) => (
                <li key={s.id ?? s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="footer-legal">{`© ${new Date().getFullYear()} ${brand.legalName}. ${t(locale, 'rights')}`}</p>
      </div>
    </footer>
  )
}
