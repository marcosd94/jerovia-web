import { brand } from '@brand'

/** Logo de la empresa en la pantalla de ingreso del panel (reemplaza el de Payload) */
export function AdminLogo() {
  return <img src={`/brand/${brand.logo.file}`} alt={brand.name} width={220} style={{ height: 'auto', maxWidth: '100%' }} />
}
