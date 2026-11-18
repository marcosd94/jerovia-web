'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import type { Locale } from '@brand/types'
import { CONSENT_KEY, GA_ID } from '../lib/analytics'
import { t } from '../lib/messages'

type Choice = 'granted' | 'denied' | null

/** Aviso de cookies y carga de Google Analytics. No muestra nada ni carga nada si no hay ID configurado. */
export function Analytics({ locale }: { locale: Locale }) {
  const [choice, setChoice] = useState<Choice>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_KEY)
      if (saved === 'granted' || saved === 'denied') setChoice(saved)
    } catch {}
    setReady(true)
  }, [])

  if (!GA_ID) return null

  const decide = (value: 'granted' | 'denied') => {
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch {}
    setChoice(value)
  }

  return (
    <>
      {choice === 'granted' ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}</Script>
        </>
      ) : null}
      {ready && choice === null ? (
        <div className="consent" role="dialog" aria-label={t(locale, 'consentTitle')}>
          <p>{t(locale, 'consentText')}</p>
          <div className="consent-actions">
            <button type="button" className="btn btn-primary" onClick={() => decide('granted')}>{t(locale, 'consentAccept')}</button>
            <button type="button" className="btn btn-ghost" onClick={() => decide('denied')}>{t(locale, 'consentReject')}</button>
          </div>
        </div>
      ) : null}
    </>
  )
}
