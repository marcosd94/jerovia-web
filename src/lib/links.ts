import type { Locale } from '@brand/types'
import { ALL_LOCALES } from './locale'
import { whatsappLink } from './data'

export type LinkKind = 'web' | 'whatsapp' | 'phone' | 'email' | 'instagram' | 'facebook' | 'tiktok' | 'maps' | 'other'

type Ctx = { message?: string | null; locale: Locale; whatsapp?: string | null; phone?: string | null; email?: string | null; whatsappText: string }

/**
 * Arma la dirección final de un botón. Solo admite https, tel, mailto y páginas del propio sitio:
 * nunca "javascript:" ni otros esquemas, aunque alguien los escriba en el panel.
 */
export function buildHref(kind: LinkKind, rawValue: string | null | undefined, ctx: Ctx): string | null {
  const value = (rawValue ?? '').trim()
  switch (kind) {
    case 'whatsapp':
      return whatsappLink(value || ctx.whatsapp, ctx.message?.trim() || ctx.whatsappText)
    case 'phone': {
      const n = (value || ctx.phone || '').replace(/[^\d+]/g, '')
      return n ? `tel:${n}` : null
    }
    case 'email': {
      const e = value || ctx.email || ''
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? `mailto:${e}` : null
    }
    default: {
      if (value.startsWith('/') && !value.startsWith('//')) {
        const hasLocale = ALL_LOCALES.some((l) => value === `/${l}` || value.startsWith(`/${l}/`))
        const path = hasLocale ? value : `/${ctx.locale}${value === '/' ? '' : value}`
        // Etiquetas para que Google Analytics sepa que la visita vino de la página de enlaces
        const sep = path.includes('?') ? '&' : '?'
        return `${path}${sep}utm_source=instagram&utm_medium=bio_link&utm_campaign=links`
      }
      return /^https:\/\//i.test(value) ? value : null
    }
  }
}
