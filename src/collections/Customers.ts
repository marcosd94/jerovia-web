import type { CollectionConfig } from 'payload'
import { siteUrl } from '../lib/site-url'
import { fieldAdminOrGestor, hasRole, isCustomer, visibleTo, softDeleteOnly } from '../access'
import { auditChange, auditDelete } from '../lib/audit'

const serverURL = siteUrl
// Con un servicio de correo configurado (SMTP_HOST) se exige verificar el correo; sin él (desarrollo) las cuentas quedan activas al crearse.
const emailEnabled = Boolean(process.env.SMTP_HOST)

export const MIN_PASSWORD = 10

const mail = (title: string, body: string, url: string, button: string) =>
  `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#2a1710"><h2>${title}</h2><p>${body}</p><p><a href="${url}" style="background:#961f33;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block">${button}</a></p><p style="font-size:13px;color:#6b5a50">Si no fuiste vos, ignorá este mensaje.</p></div>`

/** Cuentas de clientes de la tienda. Colección separada del personal (users): un cliente nunca entra al panel. */
export const Customers: CollectionConfig = {
  slug: 'customers',
  trash: true, // eliminación lógica: los registros van a la papelera, nunca se pierden
  labels: { singular: 'Cliente', plural: 'Clientes' },
  admin: {
    useAsTitle: 'email',
    group: 'Ventas',
    defaultColumns: ['email', 'name', 'phone', 'createdAt'],
    hidden: visibleTo('admin', 'gestor', 'visor'),
    description: 'Personas que crearon una cuenta en la tienda. Las compras sin cuenta no aparecen acá, solo en Pedidos.',
  },
  defaultSort: '-createdAt',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7, // la sesión dura 7 días
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    cookies: { secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' },
    verify: emailEnabled
      ? {
          generateEmailSubject: () => 'Confirmá tu correo',
          generateEmailHTML: ({ token }: { token?: string } = {}) =>
            mail('Confirmá tu correo', 'Gracias por crear tu cuenta. Confirmá tu correo para empezar a comprar.', `${serverURL}/es/cuenta/verificar?token=${token}`, 'Confirmar correo'),
        }
      : false,
    forgotPassword: {
      generateEmailSubject: () => 'Restablecé tu contraseña',
      generateEmailHTML: ({ token }: { token?: string } = {}) =>
        mail('Restablecé tu contraseña', 'Recibimos un pedido para cambiar tu contraseña. El enlace vence en 1 hora.', `${serverURL}/es/cuenta/restablecer?token=${token}`, 'Elegir nueva contraseña'),
    },
  },
  access: {
    // Las cuentas se crean solo desde el sitio (acción de servidor que valida y limita intentos) o por el personal
    create: ({ req: { user } }) => hasRole(user, 'admin', 'gestor'),
    read: ({ req: { user } }) => {
      if (hasRole(user, 'admin', 'gestor', 'visor')) return true
      if (isCustomer(user) && user) return { id: { equals: user.id } }
      return false
    },
    update: ({ req: { user } }) => {
      if (hasRole(user, 'admin', 'gestor')) return true
      if (isCustomer(user) && user) return { id: { equals: user.id } }
      return false
    },
    delete: softDeleteOnly, // el cliente elimina su cuenta desde el sitio (acción de servidor)
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.password && String(data.password).length < MIN_PASSWORD) {
          throw new Error(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`)
        }
        return data
      },
    ],
    afterChange: [auditChange('customers')],
    afterDelete: [auditDelete('customers')],
  },
  fields: [
    { name: 'emailAnterior', type: 'text', label: 'Correo original (cuenta eliminada)', admin: { readOnly: true, description: 'Se completa cuando la cuenta se elimina: el correo queda libre para registrarse de nuevo y el dato original se conserva acá.' } },
    { name: 'name', type: 'text', label: 'Nombre y apellido', required: true },
    { name: 'phone', type: 'text', label: 'Teléfono o WhatsApp', required: true },
    {
      name: 'billing',
      type: 'group',
      label: 'Datos de facturación',
      fields: [
        {
          name: 'documentType',
          type: 'select',
          label: 'Tipo de documento',
          defaultValue: 'ci',
          options: [
            { label: 'Cédula de identidad (C.I.)', value: 'ci' },
            { label: 'RUC', value: 'ruc' },
            { label: 'Pasaporte o documento extranjero', value: 'other' },
          ],
        },
        { name: 'documentNumber', type: 'text', label: 'Número de C.I. o RUC' },
        { name: 'businessName', type: 'text', label: 'Razón social', admin: { description: 'Nombre que sale en la factura. Si queda vacío, se usa el nombre de la persona.' } },
      ],
    },
    {
      name: 'addresses',
      type: 'array',
      label: 'Direcciones de entrega',
      labels: { singular: 'Dirección', plural: 'Direcciones' },
      maxRows: 10,
      fields: [
        { name: 'label', type: 'text', label: 'Nombre (ej: Casa, Oficina)', required: true },
        { name: 'recipient', type: 'text', label: 'Quién recibe (si es otra persona)' },
        { name: 'phone', type: 'text', label: 'Teléfono de contacto para la entrega' },
        { name: 'address', type: 'textarea', label: 'Dirección', required: true },
        { name: 'reference', type: 'text', label: 'Referencia (ej: portón verde, frente a la plaza)' },
        { name: 'city', type: 'text', label: 'Ciudad' },
        { name: 'department', type: 'text', label: 'Departamento' },
        { name: 'zone', type: 'relationship', relationTo: 'delivery-zones', label: 'Zona de entrega' },
        { name: 'mapsUrl', type: 'text', label: 'Ubicación en Google Maps (opcional)' },
        { name: 'isDefault', type: 'checkbox', label: 'Usar por defecto', defaultValue: false },
      ],
    },
    {
      name: 'preferredLocale',
      type: 'select',
      label: 'Idioma preferido',
      defaultValue: 'es',
      options: [
        { label: 'Español', value: 'es' },
        { label: 'English', value: 'en' },
        { label: 'Português', value: 'pt' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'privacyAcceptedAt',
      type: 'date',
      label: 'Aceptó la política de privacidad',
      access: { update: fieldAdminOrGestor },
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'marketingOptIn', type: 'checkbox', label: 'Acepta recibir novedades y promociones', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'marketingOptInAt',
      type: 'date',
      label: 'Fecha de aceptación de novedades',
      access: { update: fieldAdminOrGestor },
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Notas internas',
      access: { read: ({ req: { user } }) => hasRole(user, 'admin', 'gestor', 'visor'), update: fieldAdminOrGestor, create: fieldAdminOrGestor },
      admin: { description: 'Solo las ve el personal. El cliente no.' },
    },
  ],
}
