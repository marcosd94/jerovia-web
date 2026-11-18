// Google Analytics 4 — preparado pero apagado hasta que se cargue el ID en NEXT_PUBLIC_GA_ID (formato G-XXXXXXXXXX).
// Solo se activa si la persona acepta las cookies de medición.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || ''
export const CONSENT_KEY = 'analytics-consent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/** Envía un evento a Google Analytics. Si no hay ID o la persona no aceptó, no hace nada. */
export function track(event: string, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window === 'undefined' || !GA_ID || typeof window.gtag !== 'function') return
  window.gtag('event', event, params)
}
