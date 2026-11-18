import { headers } from 'next/headers'

// Límite básico en memoria por clave (ver docs/SEGURIDAD.md: la protección fuerte va en Cloudflare / el proveedor de hosting).
const buckets = new Map<string, number[]>()

/** Devuelve true si todavía se puede intentar, y registra el intento */
export function allow(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= max) {
    buckets.set(key, recent)
    return false
  }
  buckets.set(key, [...recent, now])
  return true
}

export async function clientIp(): Promise<string> {
  const h = await headers()
  return h.get('cf-connecting-ip') || h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
}
