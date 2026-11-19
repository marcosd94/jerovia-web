'use server'
import { isLocale } from '@/lib/locale'
import { allow, clientIp } from '@/lib/ratelimit'
import { quoteLines, type Quote } from '@/lib/shop'

/** Devuelve el carrito con los precios y la disponibilidad actuales (el navegador solo guarda producto, presentación y cantidad) */
export async function quoteCart(locale: string, lines: unknown): Promise<Quote | { error: true }> {
  if (!isLocale(locale)) return { error: true }
  if (!allow(`quote:${await clientIp()}`, 120, 60 * 1000)) return { error: true }
  try {
    return await quoteLines(locale, lines)
  } catch {
    return { error: true }
  }
}
