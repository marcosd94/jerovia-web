'use server'
import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import { isLocale } from '@/lib/locale'

export type LeadState = {
  status: 'idle' | 'ok' | 'error'
  errors?: Record<string, 'required' | 'email'>
  message?: 'generic' | 'limit'
  /** Lo que la persona ya escribió, para no perderlo cuando hay un error */
  values?: Record<string, string>
}

// Límite básico de envíos por dirección IP (en memoria). La protección fuerte va en Cloudflare (ver docs/SEGURIDAD.md).
const hits = new Map<string, number[]>()
const WINDOW = 10 * 60 * 1000
const MAX = 5

const clean = (v: FormDataEntryValue | null, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  // Trampa para robots: un campo oculto que una persona nunca completa
  if (clean(formData.get('website'), 50)) return { status: 'ok' }

  const h = await headers()
  const ip = h.get('cf-connecting-ip') || h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW)
  if (recent.length >= MAX) return { status: 'error', message: 'limit' }
  hits.set(ip, [...recent, now])

  const name = clean(formData.get('name'), 120)
  const company = clean(formData.get('company'), 160)
  const email = clean(formData.get('email'), 200)
  const phone = clean(formData.get('phone'), 40)
  const city = clean(formData.get('city'), 100)
  const message = clean(formData.get('message'), 2000)
  const kindRaw = clean(formData.get('kind'), 30)
  const kind = (['distribuidor', 'supermercado', 'otro'] as const).find((k) => k === kindRaw) ?? 'otro'
  const localeRaw = clean(formData.get('locale'), 5)

  const values = { name, company, email, phone, city, message, kind: kindRaw }
  const errors: NonNullable<LeadState['errors']> = {}
  if (!name) errors.name = 'required'
  if (!company) errors.company = 'required'
  if (!phone || !/^[+\d\s().-]{6,40}$/.test(phone)) errors.phone = 'required'
  if (!email) errors.email = 'required'
  else if (!EMAIL.test(email)) errors.email = 'email'
  if (Object.keys(errors).length) return { status: 'error', errors, values }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'leads',
      data: { name, company, email, phone, city, message, kind, status: 'nuevo', locale: isLocale(localeRaw) ? localeRaw : 'es' },
      overrideAccess: true, // el público no tiene permiso de escritura; esta función valida todo antes de guardar
    })
    return { status: 'ok' }
  } catch (error) {
    console.error('No se pudo guardar la solicitud de empresa', error)
    return { status: 'error', message: 'generic', values }
  }
}
