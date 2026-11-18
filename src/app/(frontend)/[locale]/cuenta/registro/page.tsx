import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { brand } from '@brand'
import { getCustomer } from '@/lib/customer'
import { localePath } from '@/lib/data'
import { isLocale } from '@/lib/locale'
import { ta } from '@/lib/messages-account'
import { RegisterForm } from '../AccountForms'

export const metadata: Metadata = { title: 'Crear cuenta', robots: { index: false, follow: false } }

export default async function Register({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale) || !brand.features.accounts) notFound()
  if (await getCustomer()) redirect(localePath(locale, '/cuenta'))
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{ta(locale, 'register')}</h1>
        <p>{ta(locale, 'registerIntro')}</p>
      </div>
      <div style={{ maxWidth: '34rem', paddingBottom: '4rem' }}>
        <RegisterForm locale={locale} />
      </div>
    </div>
  )
}
