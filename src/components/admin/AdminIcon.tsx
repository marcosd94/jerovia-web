import { brand } from '@brand'

/** Ícono chico de la barra superior del panel: el favicon de la empresa */
export function AdminIcon() {
  const src = `/brand/${brand.icons?.png ?? brand.logo.file}`
  return <img src={src} alt={brand.name} width={26} height={26} style={{ display: 'block', borderRadius: 6 }} />
}
