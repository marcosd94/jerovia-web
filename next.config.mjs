import { withPayload } from '@payloadcms/next/withPayload'

const isProd = process.env.NODE_ENV === 'production'
const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'es'

// Política de seguridad de contenido (CSP). Next.js y el panel de Payload necesitan scripts/estilos "inline";
// en la fase de seguridad (docs/SEGURIDAD.md) se pasa a CSP con nonce.
// Google Analytics: solo se permiten sus dominios si hay un ID configurado (NEXT_PUBLIC_GA_ID)
const ga = Boolean(process.env.NEXT_PUBLIC_GA_ID?.trim())
const gaScript = ga ? ' https://www.googletagmanager.com' : ''
const gaConnect = ga ? ' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com' : ''
const gaImg = ga ? ' https://*.google-analytics.com https://*.googletagmanager.com' : ''

const csp = [
  "default-src 'self'",
  `img-src 'self' data: blob: https://tile.openstreetmap.org${gaImg}`,
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${gaScript}${isProd ? '' : " 'unsafe-eval'"}`,
  `connect-src 'self'${gaConnect}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  agentRules: false, // no generar AGENTS.md en cada arranque
  // Desarrollo: permite abrir el sitio desde otro equipo de la red (celular, otra PC) por IP, ej. 192.168.100.74:3000.
  // Sin esto Next bloquea sus recursos y la página no se activa (menú, formularios). No afecta a producción.
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '172.16.*.*', '127.0.0.1'],
  async redirects() {
    return [{ source: '/', destination: `/${defaultLocale}`, permanent: false }]
  },
  async headers() {
    const common = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
      { key: 'Content-Security-Policy', value: csp },
    ]
    if (isProd) common.push({ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' })
    return [{ source: '/:path*', headers: common }]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
