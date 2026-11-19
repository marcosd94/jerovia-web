import type { Metadata } from 'next'
import { brand } from '@brand'
import { brandIcons } from '@/lib/icons'
import '../(frontend)/globals.css'

export const metadata: Metadata = { icons: brandIcons() }

// Layout propio: la página de enlaces no lleva el menú ni el pie del sitio.
export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={brand.defaultLocale}>
      <body className="links-body">{children}</body>
    </html>
  )
}
