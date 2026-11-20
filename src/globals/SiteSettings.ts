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
      name: 'minOrder',
      type: 'number',
      label: 'Compra mínima de la tienda (Gs.)',
      defaultValue: 100000,
      min: 0,
      admin: { description: 'Monto mínimo de productos para poder confirmar un pedido (sin contar el envío). 0 = sin mínimo.', step: 1000 },
    },
    {
      name: 'payments',
      type: 'group',
      label: 'Formas de pago de la tienda',
      admin: { description: 'Cobro manual mientras no haya pasarela de pagos. Estos datos se muestran al cliente al confirmar el pedido.' },
      fields: [
        { name: 'transferEnabled', type: 'checkbox', label: 'Aceptar transferencia o QR', defaultValue: true },
        {
          name: 'transferInstructions',
          type: 'textarea',
          label: 'Datos para transferir (banco, cuenta, titular, alias o QR)',
          localized: true,
          admin: { description: 'El cliente los ve al confirmar el pedido. Pedile que envíe el comprobante por WhatsApp.' },
        },
        {
          name: 'receiptPhone',
          type: 'text',
          label: 'Teléfono (WhatsApp) para recibir comprobantes',
          admin: { description: 'Solo números, con código de país. Ejemplo: 595981123456. El cliente lo ve al confirmar un pedido por transferencia y desde ahí puede enviar el comprobante. Si queda vacío se usa el WhatsApp de contacto.' },
        },
        { name: 'cashEnabled', type: 'checkbox', label: 'Aceptar pago contra entrega o al retirar', defaultValue: true },
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
