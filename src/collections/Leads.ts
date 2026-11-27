import type { CollectionConfig } from 'payload'
import { canReadBackoffice, isAdminOrGestor, visibleTo, softDeleteOnly } from '../access'

// Solicitudes de empresas (distribuidores y supermercados). Se crean desde el formulario público
// del sitio (con validación en el servidor); desde el panel solo se leen y se les da seguimiento.
export const Leads: CollectionConfig = {
  slug: 'leads',
  trash: true, // eliminación lógica: los registros van a la papelera, nunca se pierden
  labels: { singular: 'Solicitud de empresa', plural: 'Solicitudes de empresas' },
  admin: { useAsTitle: 'company', group: 'Ventas', defaultColumns: ['company', 'name', 'kind', 'status', 'createdAt'], hidden: visibleTo('admin', 'gestor', 'visor') },
  defaultSort: '-createdAt',
  access: { read: canReadBackoffice, create: isAdminOrGestor, update: isAdminOrGestor, delete: softDeleteOnly },
  fields: [
    { name: 'status', type: 'select', label: 'Estado', defaultValue: 'nuevo', options: [{ label: 'Nuevo', value: 'nuevo' }, { label: 'Contactado', value: 'contactado' }, { label: 'Cliente', value: 'cliente' }, { label: 'Descartado', value: 'descartado' }], admin: { position: 'sidebar' } },
    { name: 'company', type: 'text', label: 'Empresa', required: true },
    { name: 'name', type: 'text', label: 'Contacto', required: true },
    { name: 'email', type: 'email', label: 'Correo', required: true },
    { name: 'phone', type: 'text', label: 'Teléfono', required: true },
    { name: 'city', type: 'text', label: 'Ciudad' },
    { name: 'kind', type: 'select', label: 'Tipo de empresa', options: [{ label: 'Distribuidor', value: 'distribuidor' }, { label: 'Supermercado o cadena', value: 'supermercado' }, { label: 'Otro', value: 'otro' }] },
    { name: 'message', type: 'textarea', label: 'Mensaje' },
    { name: 'notes', type: 'textarea', label: 'Notas internas del vendedor' },
    { name: 'locale', type: 'text', label: 'Idioma del sitio', admin: { readOnly: true, position: 'sidebar' } },
  ],
}
