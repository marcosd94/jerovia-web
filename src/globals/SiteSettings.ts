import type { GlobalConfig } from 'payload'
import { everyone, fieldAdminOnly, isAdminOrGestor } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Configuración del sitio',
  admin: { group: 'Sistema' },
  access: { read: everyone, update: isAdminOrGestor },
  fields: [
    {
      name: 'shopEnabled',
      type: 'checkbox',
      label: 'Activar tienda (carrito y pagos)',
      defaultValue: false,
      access: { update: fieldAdminOnly },
      admin: { description: 'Apagado: el sitio funciona como catálogo e institucional. Solo el Administrador puede cambiarlo.' },
    },
    { name: 'announcement', type: 'text', label: 'Aviso en la parte superior (opcional)', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'whatsapp', type: 'text', label: 'WhatsApp (solo números, con código de país)', admin: { description: 'Ejemplo: 595981123456' } },
        { name: 'phone', type: 'text', label: 'Teléfono' },
      ],
    },
    { name: 'email', type: 'email', label: 'Correo de contacto' },
    { name: 'address', type: 'textarea', label: 'Dirección' },
    {
      name: 'pickup',
      type: 'group',
      label: 'Retiro en el local',
      fields: [
        { name: 'enabled', type: 'checkbox', label: 'Permitir retiro en el local', defaultValue: true },
        { name: 'address', type: 'textarea', label: 'Dirección y horarios de retiro' },
      ],
    },
    {
      name: 'social',
      type: 'array',
      label: 'Redes sociales',
      labels: { singular: 'Red social', plural: 'Redes sociales' },
      fields: [
        { name: 'label', type: 'text', label: 'Nombre (ej: Instagram)', required: true },
        { name: 'url', type: 'text', label: 'Enlace', required: true },
      ],
    },
    { name: 'footerNote', type: 'textarea', label: 'Texto del pie de página', localized: true },
  ],
}
