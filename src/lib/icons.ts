import type { Metadata } from 'next'
import { brand } from '@brand'

/** Íconos de la pestaña (favicon) de la marca activa; vacío si la marca no define ninguno */
export function brandIcons(): Metadata['icons'] | undefined {
  const i = brand.icons
  if (!i) return undefined
  return {
    icon: [
      ...(i.svg ? [{ url: `/brand/${i.svg}`, type: 'image/svg+xml' }] : []),
      ...(i.png ? [{ url: `/brand/${i.png}`, type: 'image/png', sizes: '32x32' }] : []),
    ],
    apple: i.apple ? [{ url: `/brand/${i.apple}`, sizes: '180x180' }] : undefined,
  }
}
