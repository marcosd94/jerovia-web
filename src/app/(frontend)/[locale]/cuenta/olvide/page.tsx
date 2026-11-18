import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { brand } from '@brand'
import { isLocale } from '@/lib/locale'
import { ta } from '@/lib/messages-account'
import { ForgotForm } from '../AccountForms'

export const metadata: Metadata = { title: 'Recuperar contraseña', robots: { index: false, follow: false } }

export default async function Forgot({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale) || !brand.features.accounts) notFound()
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{ta(locale, 'forgot')}</h1>
        <p>{ta(locale, 'forgotIntro')}</p>
      </div>
      <div style={{ maxWidth: '34rem', paddingBottom: '4rem' }}>
        <ForgotForm locale={locale} />
      </div>
    </div>
  )
}
