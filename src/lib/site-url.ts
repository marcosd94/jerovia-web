/**
 * Dirección pública del sitio, sin barra final.
 * 1) NEXT_PUBLIC_SERVER_URL si está definida (dominio propio o definitivo).
 * 2) En Vercel, la dirección que Vercel ya conoce: la estable del proyecto en producción
 *    (VERCEL_PROJECT_PRODUCTION_URL) o la del despliegue en las vistas previas (VERCEL_URL).
 * 3) En el notebook: http://localhost:3000
 */
const clean = (u: string) => u.trim().replace(/\/+$/, '')

export const siteUrl = (() => {
  const explicit = process.env.NEXT_PUBLIC_SERVER_URL?.trim()
  if (explicit) return clean(explicit)
  const host = process.env.VERCEL_ENV === 'production' ? process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_URL
  if (host) return `https://${host.trim()}`
  return 'http://localhost:3000'
})()
