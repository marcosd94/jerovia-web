import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { brand, copy } from '@brand'
import { getStores } from '@/lib/data'
import { isLocale, pick } from '@/lib/locale'
import { t, type MessageKey } from '@/lib/messages'
import { StoresMapLoader } from '@/components/StoresMapLoader'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: isLocale(locale) ? pick(copy.storesPage.title, locale) : 'Puntos de venta' }
}

const REGIONS = [
  { value: 'gran-asuncion', key: 'region_gran_asuncion' },
  { value: 'interior', key: 'region_interior' },
] as const
const KINDS = ['supermercado', 'tienda', 'farmacia', 'restaurante', 'otro'] as const

export default async function Stores({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale) || !brand.features.storeLocator) notFound()
  const stores = await getStores()
  const points = stores.flatMap((s) =>
    typeof s.lat === 'number' && typeof s.lng === 'number'
      ? [{ id: s.id, name: s.name, region: s.region, lat: s.lat, lng: s.lng, address: [s.address, s.city].filter(Boolean).join(', ') || undefined, phone: s.phone ?? undefined }]
      : [],
  )
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{pick(copy.storesPage.title, locale)}</h1>
        <p>{pick(copy.storesPage.intro, locale)}</p>
      </div>
      {points.length > 0 ? (
        <>
          <StoresMapLoader points={points} label={t(locale, 'mapLabel')} directionsLabel={t(locale, 'mapDirections')} views={[{ key: 'gran-asuncion', label: t(locale, 'region_gran_asuncion') }, { key: 'interior', label: t(locale, 'region_interior') }, { key: 'all', label: t(locale, 'mapAll') }]} />
          {points.length < stores.length ? <p className="map-note">{t(locale, 'mapPending')}</p> : <div style={{ marginBottom: '2.5rem' }} />}
        </>
      ) : null}
      {REGIONS.map((r) => {
        const inRegion = stores.filter((s) => s.region === r.value)
        if (!inRegion.length) return null
        return (
          <section key={r.value} className="region">
            <h2>{t(locale, r.key)}</h2>
            <div className="store-groups">
              {KINDS.map((k) => {
                const list = inRegion.filter((s) => s.kind === k)
                if (!list.length) return null
                return (
                  <div key={k}>
                    <h3>{t(locale, `kind_${k}` as MessageKey)}</h3>
                    <ul className="store-list">
                      {list.map((s) => (
                        <li key={s.id}>
                          <span>
                            {s.name}
                            {s.city || s.address ? <small>{[s.city, s.address].filter(Boolean).join(', ')}</small> : null}
                          </span>
                          <span className="store-actions">
                            {s.phone ? <a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`}>{s.phone}</a> : null}
                            {typeof s.lat === 'number' && typeof s.lng === 'number' ? (
                              <a
                                className="store-go"
                                href={`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${t(locale, 'mapDirections')}: ${s.name}`}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11 21 3l-8 18-2-8-8-2Z" /></svg>
                                {t(locale, 'goTo')}
                              </a>
                            ) : null}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
