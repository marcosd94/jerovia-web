import Link from 'next/link'
import { brand } from '@brand'

export default function NotFound() {
  const t = {
    es: ['No encontramos esa página', 'Puede que el enlace haya cambiado. Volvé al inicio o mirá nuestros productos.', 'Volver al inicio'],
  }.es
  return (
    <div className="wrap page-head" style={{ paddingBottom: '5rem' }}>
      <h1>{t[0]}</h1>
      <p>{t[1]}</p>
      <p>
        <Link className="btn btn-primary" href={`/${brand.defaultLocale}`}>
          {t[2]}
        </Link>
      </p>
    </div>
  )
}
