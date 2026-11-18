import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { brand } from '@brand'
import { isLocale } from '@/lib/locale'
import { ta } from '@/lib/messages-account'
import { ResetForm } from '../AccountForms'

export const metadata: Metadata = { title: 'Nueva contraseña', robots: { index: false, follow: false } }

export default async function Reset({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string }> }) {
  const { locale } = await params
  const { token } = await searchParams
  if (!isLocale(locale) || !brand.features.accounts) notFound()
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{ta(locale, 'resetTitle')}</h1>
      </div>
      <div style={{ maxWidth: '34rem', paddingBottom: '4rem' }}>
        {token ? (
          <ResetForm locale={locale} token={token} />
        ) : (
          <div className="notice error" role="alert">
            <p style={{ margin: 0 }}>{ta(locale, 'resetInvalid')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
