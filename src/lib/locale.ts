import type { L10n, Locale } from '@brand/types'

export const ALL_LOCALES: Locale[] = ['es', 'en', 'pt']

export function isLocale(value: string): value is Locale {
  return (ALL_LOCALES as string[]).includes(value)
}

/** Devuelve el texto en el idioma pedido, o en español si falta la traducción */
export function pick(text: L10n | undefined, locale: Locale): string {
  if (!text) return ''
  return text[locale] || text.es
}
