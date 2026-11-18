import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { brand } from '@brand'
import { isLocale } from '@/lib/locale'
import { ta } from '@/lib/messages-account'

export const metadata: Metadata = { title: 'Confirmar correo', robots: { index: false, follow: false } }

export default async function Verify({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string }> }) {
  const { locale } = await params
  const { token } = await searchParams
  if (!isLocale(locale) || !brand.features.accounts) notFound()
  let ok = false
  if (token) {
    try {
      const payload = await getPayload({ config })
      ok = Boolean(await payload.verifyEmail({ collection: 'customers', token }))
    } catch {
      ok = false
    }
  }
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{ta(locale, 'title')}</h1>
      </div>
      <div style={{ maxWidth: '34rem', paddingBottom: '4rem' }} className={ok ? 'notice' : 'notice error'} role="status">
        <p style={{ margin: 0 }}>{ok ? ta(locale, 'verifyDone') : ta(locale, 'resetInvalid')}</p>
        {ok ? (
          <p style={{ margin: '0.6rem 0 0' }}>
            <Link href={`/${locale}/cuenta/ingresar`}>{ta(locale, 'login')}</Link>
          </p>
        ) : null}
      </div>
    </div>
  )
}
