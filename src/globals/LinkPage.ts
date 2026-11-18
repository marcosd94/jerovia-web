import type { GlobalConfig } from 'payload'
import { everyone, isAdminOrGestor, visibleTo } from '../access'

const needsUrl = ['web', 'instagram', 'facebook', 'tiktok', 'maps', 'other']

export const LinkPage: GlobalConfig = {
  slug: 'link-page',
  label: 'Página de enlaces (Instagram)',
  admin: { group: 'Contenido', hidden: visibleTo('admin', 'gestor', 'visor'), description: 'La página de enlaces para poner en la biografía de Instagram. Se ve en /links.' },
  access: { read: everyone, update: isAdminOrGestor },
  fields: [
    { name: 'enabled', type: 'checkbox', label: 'Página activa', defaultValue: true },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Foto de portada (opcional)', admin: { description: 'Imagen ancha que va arriba de todo. Recomendado: 1600 x 600 px.' } },
    { name: 'title', type: 'text', label: 'Título (si queda vacío se usa el nombre de la marca)', localized: true },
    { name: 'bio', type: 'textarea', label: 'Frase corta debajo del título', localized: true },
    {
      name: 'links',
      type: 'array',
      label: 'Botones',
      labels: { singular: 'Botón', plural: 'Botones' },
      admin: { description: 'Para enlaces importantes: redes sociales, WhatsApp, ubicación, etc. Todos los botones tienen el mismo tamaño. Arrastrá para cambiar el orden.', initCollapsed: false },
      fields: [
        { name: 'label', type: 'text', label: 'Texto del botón', required: true, localized: true },
        {
          name: 'kind',
          type: 'select',
          label: 'Tipo',
          required: true,
          defaultValue: 'web',
          options: [
            { label: 'Sitio web o enlace', value: 'web' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Llamar por teléfono', value: 'phone' },
            { label: 'Correo electrónico', value: 'email' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Mapa o ubicación', value: 'maps' },
            { label: 'Otro enlace', value: 'other' },
          ],
        },
        {
          name: 'value',
          type: 'text',
          label: 'Dirección, número o correo',
          admin: {
            description:
              'Web: https://… o una página del sitio (ejemplo: /productos). WhatsApp y teléfono: solo números con código de país. Correo: la dirección. Si es WhatsApp, teléfono o correo y queda vacío, se usa el de Configuración del sitio.',
          },
          validate: (value: string | null | undefined, { siblingData }: { siblingData: { kind?: string } }) => {
            const v = (value ?? '').trim()
            const kind = siblingData?.kind ?? 'web'
            if (needsUrl.includes(kind)) {
              if (!v) return 'Completá la dirección del enlace.'
              if (!/^https:\/\//i.test(v) && !v.startsWith('/')) return 'Debe empezar con https:// o con / (una página de este sitio).'
              if (v.startsWith('//')) return 'Dirección no válida.'
            }
            if ((kind === 'whatsapp' || kind === 'phone') && v && !/^\+?[\d\s()-]{6,}$/.test(v)) return 'Escribí solo números, con código de país.'
            if (kind === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Revisá el correo electrónico.'
            return true
          },
        },
        {
          name: 'message',
          type: 'text',
          label: 'Mensaje de WhatsApp (opcional)',
          localized: true,
          admin: { description: 'Texto que aparece escrito al abrir el chat. Ejemplo: Hola, quiero consultar por Fortunata.', condition: (_: unknown, sibling: { kind?: string }) => sibling?.kind === 'whatsapp' },
        },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Logo o imagen del botón (opcional)' },
        {
          name: 'tone',
          type: 'select',
          label: 'Color del botón',
          defaultValue: 'default',
          options: [
            { label: 'Blanco (normal)', value: 'default' },
            { label: 'Verde fresco', value: 'tone1' },
            { label: 'Dorado', value: 'tone2' },
            { label: 'Bordó', value: 'tone3' },
            { label: 'Verde hoja', value: 'tone4' },
          ],
        },
        { name: 'highlight', type: 'checkbox', defaultValue: false, admin: { hidden: true } }, // en desuso
        { name: 'asIcon', type: 'checkbox', label: 'Mostrar como ícono redondo arriba (sin texto)', defaultValue: false },
        { name: 'active', type: 'checkbox', label: 'Visible', defaultValue: true },
      ],
    },
  ],
}
