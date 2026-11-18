import type { GlobalConfig } from 'payload'
import { everyone, isAdminOrGestor, visibleTo } from '../access'

/** Los enlaces pueden ser de este sitio (/productos) o seguros (https://…) */
const linkOk = (value: string | null | undefined) => {
  const v = (value ?? '').trim()
  if (!v) return true
  if (v.startsWith('//')) return 'Dirección no válida.'
  if (!/^https:\/\//i.test(v) && !v.startsWith('/')) return 'Debe empezar con https:// o con / (una página de este sitio, ej.: /productos).'
  return true
}

export const HomeCarousel: GlobalConfig = {
  slug: 'home-carousel',
  label: 'Carrusel de la portada',
  admin: {
    group: 'Contenido',
    hidden: visibleTo('admin', 'gestor', 'visor'),
    description: 'Las diapositivas que se ven arriba de todo en la página de inicio. Si no hay ninguna visible, se muestra la portada fija de siempre.',
  },
  access: { read: everyone, update: isAdminOrGestor },
  fields: [
    { name: 'enabled', type: 'checkbox', label: 'Mostrar el carrusel', defaultValue: true },
    {
      type: 'row',
      fields: [
        { name: 'autoplay', type: 'checkbox', label: 'Pasar solo', defaultValue: true, admin: { description: 'Se detiene al pasar el mouse o tocarlo, y quien lo prefiera puede pausarlo. No avanza solo si la persona tiene activada la opción de reducir movimiento.' } },
        { name: 'intervalSeconds', type: 'number', label: 'Segundos por diapositiva', defaultValue: 7, min: 4, max: 20, admin: { condition: (data) => Boolean(data?.autoplay) } },
      ],
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Diapositivas',
      labels: { singular: 'Diapositiva', plural: 'Diapositivas' },
      admin: { description: 'Arrastrá para cambiar el orden. La primera es la que se ve al entrar al sitio. Desmarcá "Visible" para ocultar una sin borrarla.', initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', label: 'Título', required: true, localized: true, admin: { description: 'Corto y claro. Ej.: Stevia: endulzante sin calorías.' } },
        { name: 'text', type: 'textarea', label: 'Texto de apoyo', localized: true, admin: { description: 'Una o dos frases.' } },
        {
          name: 'kind',
          type: 'select',
          label: 'Qué se muestra a la derecha',
          required: true,
          defaultValue: 'image',
          options: [
            { label: 'Una imagen', value: 'image' },
            { label: 'Todos los logos de certificaciones', value: 'certifications' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen',
          admin: { description: 'Recomendado: cuadrada o un poco más alta que ancha, de 1200 px o más de lado.', condition: (_, sibling) => sibling?.kind !== 'certifications' },
          validate: (value: unknown, { siblingData }: { siblingData: { kind?: string } }) => (siblingData?.kind !== 'certifications' && !value ? 'Elegí una imagen.' : true),
        },
        {
          name: 'fit',
          type: 'select',
          label: 'Cómo se acomoda la imagen',
          defaultValue: 'cover',
          options: [
            { label: 'Llenar el marco (puede recortar los bordes)', value: 'cover' },
            { label: 'Mostrarla completa sobre fondo blanco (para logos)', value: 'contain' },
          ],
          admin: { condition: (_, sibling) => sibling?.kind !== 'certifications' },
        },
        { name: 'seal', type: 'relationship', relationTo: 'certifications', label: 'Sello sobre la imagen (opcional)', admin: { description: 'Aparece como un círculo en la esquina de la imagen.', condition: (_, sibling) => sibling?.kind !== 'certifications' } },
        {
          type: 'row',
          fields: [
            { name: 'ctaLabel', type: 'text', label: 'Botón principal: texto', localized: true },
            { name: 'ctaLink', type: 'text', label: 'Botón principal: enlace', validate: linkOk, admin: { description: 'Ej.: /productos o https://…' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'cta2Label', type: 'text', label: 'Botón secundario: texto', localized: true },
            { name: 'cta2Link', type: 'text', label: 'Botón secundario: enlace', validate: linkOk },
          ],
        },
        { name: 'active', type: 'checkbox', label: 'Visible', defaultValue: true },
      ],
    },
  ],
}
