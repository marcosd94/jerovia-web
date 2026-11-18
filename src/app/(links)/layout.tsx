import { brand } from '@brand'
import '../(frontend)/globals.css'

// Layout propio: la página de enlaces no lleva el menú ni el pie del sitio.
export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={brand.defaultLocale}>
      <body className="links-body">{children}</body>
    </html>
  )
}
