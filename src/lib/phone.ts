// Teléfonos: se guardan siempre en formato internacional "+595981123456" (sin espacios), listo para abrir un chat de WhatsApp.

export type Country = { code: string; dial: string; flag: string; name: { es: string; en: string; pt: string }; min: number; max: number; start?: string }

/** Paraguay primero (valor por defecto). Para Paraguay se pide el celular de 9 cifras que empieza con 9 (ej.: 981 123 456). */
export const COUNTRIES: Country[] = [
  { code: 'PY', dial: '595', flag: '🇵🇾', name: { es: 'Paraguay', en: 'Paraguay', pt: 'Paraguai' }, min: 9, max: 9, start: '9' },
  { code: 'AR', dial: '54', flag: '🇦🇷', name: { es: 'Argentina', en: 'Argentina', pt: 'Argentina' }, min: 10, max: 11 },
  { code: 'BR', dial: '55', flag: '🇧🇷', name: { es: 'Brasil', en: 'Brazil', pt: 'Brasil' }, min: 10, max: 11 },
  { code: 'UY', dial: '598', flag: '🇺🇾', name: { es: 'Uruguay', en: 'Uruguay', pt: 'Uruguai' }, min: 8, max: 9 },
  { code: 'BO', dial: '591', flag: '🇧🇴', name: { es: 'Bolivia', en: 'Bolivia', pt: 'Bolívia' }, min: 8, max: 8 },
  { code: 'CL', dial: '56', flag: '🇨🇱', name: { es: 'Chile', en: 'Chile', pt: 'Chile' }, min: 9, max: 9 },
  { code: 'PE', dial: '51', flag: '🇵🇪', name: { es: 'Perú', en: 'Peru', pt: 'Peru' }, min: 9, max: 9 },
  { code: 'CO', dial: '57', flag: '🇨🇴', name: { es: 'Colombia', en: 'Colombia', pt: 'Colômbia' }, min: 10, max: 10 },
  { code: 'EC', dial: '593', flag: '🇪🇨', name: { es: 'Ecuador', en: 'Ecuador', pt: 'Equador' }, min: 9, max: 9 },
  { code: 'VE', dial: '58', flag: '🇻🇪', name: { es: 'Venezuela', en: 'Venezuela', pt: 'Venezuela' }, min: 10, max: 10 },
  { code: 'MX', dial: '52', flag: '🇲🇽', name: { es: 'México', en: 'Mexico', pt: 'México' }, min: 10, max: 10 },
  { code: 'US', dial: '1', flag: '🇺🇸', name: { es: 'Estados Unidos / Canadá', en: 'United States / Canada', pt: 'Estados Unidos / Canadá' }, min: 10, max: 10 },
  { code: 'ES', dial: '34', flag: '🇪🇸', name: { es: 'España', en: 'Spain', pt: 'Espanha' }, min: 9, max: 9 },
  { code: 'DE', dial: '49', flag: '🇩🇪', name: { es: 'Alemania', en: 'Germany', pt: 'Alemanha' }, min: 10, max: 11 },
  { code: 'IT', dial: '39', flag: '🇮🇹', name: { es: 'Italia', en: 'Italy', pt: 'Itália' }, min: 9, max: 10 },
  { code: 'PT', dial: '351', flag: '🇵🇹', name: { es: 'Portugal', en: 'Portugal', pt: 'Portugal' }, min: 9, max: 9 },
]
export const DEFAULT_COUNTRY = COUNTRIES[0]

const byDialLongestFirst = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length)

/** Solo dígitos del número nacional, sin ceros iniciales (los usuarios suelen escribir 0981…) */
export const cleanNational = (v: string): string => v.replace(/\D/g, '').replace(/^0+/, '')

/** País + número nacional → "+595981123456", o null si no es válido */
export function buildPhone(country: Country, national: string): string | null {
  const n = cleanNational(national)
  if (n.length < country.min || n.length > country.max) return null
  if (country.start && !n.startsWith(country.start)) return null
  return `+${country.dial}${n}`
}

/** Separa un teléfono guardado en país y número nacional. Los números viejos sin prefijo se toman como de Paraguay. */
export function splitPhone(raw: string | null | undefined): { country: Country; national: string } {
  const text = (raw ?? '').trim()
  const digits = text.replace(/\D/g, '')
  if (text.startsWith('+') || text.startsWith('00')) {
    const d = text.startsWith('00') ? digits.slice(2) : digits
    const c = byDialLongestFirst.find((x) => d.startsWith(x.dial))
    if (c) return { country: c, national: d.slice(c.dial.length).replace(/^0+/, '') }
  }
  if (digits.startsWith('595')) return { country: DEFAULT_COUNTRY, national: digits.slice(3).replace(/^0+/, '') }
  return { country: DEFAULT_COUNTRY, national: cleanNational(digits) }
}

/** Cualquier texto de teléfono (nuevo o de antes) → "+595981123456" o null si no sirve para WhatsApp */
export function normalizePhone(raw: string | null | undefined): string | null {
  const { country, national } = splitPhone(raw)
  return buildPhone(country, national)
}

/** "+595981123456" → "+595 981 123 456" (para mostrar y revisar a simple vista) */
export function formatPhone(e164: string | null | undefined): string {
  const v = normalizePhone(e164)
  if (!v) return (e164 ?? '').trim()
  const { country, national } = splitPhone(v)
  const groups = national.match(/.{1,3}/g)?.join(' ') ?? national
  return `+${country.dial} ${groups}`
}

/** Número para wa.me (solo dígitos). Argentina necesita un 9 después del 54 para los celulares. */
export function whatsappDigits(raw: string | null | undefined): string | null {
  const v = normalizePhone(raw)
  if (!v) return null
  const d = v.slice(1)
  return d.startsWith('54') && !d.startsWith('549') ? `549${d.slice(2)}` : d
}
