import { randomBytes } from 'node:crypto'
import type { CollectionConfig, Field, Where } from 'payload'
import { fieldAdminOrGestor, fieldBackoffice, fieldBackofficeOrCustomer, hasRole, isAdmin, isCustomer, visibleTo } from '../access'
import { auditChange, auditDelete } from '../lib/audit'

// Los pedidos de la tienda se crean desde el servidor (fase "Carrito y pagos").
// Esta colección ya deja listo el modelo de datos, los roles y la conciliación de cobros.
const STATUS_LOGISTICA = ['aprobado', 'listo_retiro', 'enviado', 'entregado']

/** Solo Administrador y Gestor pueden editar estos campos; Logística edita únicamente el estado y la nota de envío */
const lockFields = (fields: Field[], editable: string[]): Field[] =>
  fields.map((field) =>
    'name' in field && field.name && !editable.includes(field.name)
      ? ({ ...field, access: { ...(field as { access?: object }).access, update: fieldAdminOrGestor } } as Field)
      : field,
  )

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Pedido', plural: 'Pedidos' },
  admin: { useAsTitle: 'orderNumber', group: 'Ventas', defaultColumns: ['orderNumber', 'status', 'total', 'createdAt'], hidden: visibleTo('admin', 'gestor', 'visor', 'logistica') },
  defaultSort: '-createdAt',
  access: {
    read: ({ req: { user } }): boolean | Where => {
      if (hasRole(user, 'admin', 'gestor', 'visor')) return true
      if (hasRole(user, 'logistica')) return { status: { in: STATUS_LOGISTICA } } // solo pedidos aprobados para enviar
      if (isCustomer(user) && user) return { account: { equals: user.id } } // cada cliente ve solo sus pedidos
      return false
    },
    create: ({ req: { user } }) => hasRole(user, 'admin', 'gestor'),
    update: ({ req: { user } }) => hasRole(user, 'admin', 'gestor', 'logistica'),
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create' && data) {
          const next = { ...data }
          if (!next.orderNumber) next.orderNumber = `PED-${Date.now().toString(36).toUpperCase()}`
          // Código secreto para que quien compró sin cuenta pueda seguir su pedido desde el enlace del correo
          if (!next.accessToken) next.accessToken = randomBytes(24).toString('base64url')
          return next
        }
        return data
      },
    ],
    afterChange: [auditChange('orders')],
    afterDelete: [auditDelete('orders')],
  },
  fields: lockFields(
    [
      { name: 'orderNumber', type: 'text', label: 'Número de pedido', unique: true, admin: { readOnly: true, position: 'sidebar' } },
      {
        name: 'status',
        type: 'select',
        label: 'Estado',
        required: true,
        defaultValue: 'pendiente_pago',
        options: [
          { label: 'Pendiente de pago', value: 'pendiente_pago' },
          { label: 'Pagado', value: 'pagado' },
          { label: 'Aprobado (listo para enviar)', value: 'aprobado' },
          { label: 'Enviado', value: 'enviado' },
          { label: 'Listo para retirar', value: 'listo_retiro' },
          { label: 'Entregado', value: 'entregado' },
          { label: 'Cancelado', value: 'cancelado' },
        ],
        admin: { position: 'sidebar' },
      },
      {
        name: 'account',
        type: 'relationship',
        relationTo: 'customers',
        label: 'Cuenta del cliente',
        admin: { position: 'sidebar', description: 'Vacío = compra sin cuenta (invitado).' },
      },
      { name: 'accessToken', type: 'text', admin: { hidden: true, readOnly: true }, access: { read: fieldBackoffice } },
      {
        name: 'customer',
        type: 'group',
        label: 'Datos del cliente en este pedido',
        fields: [
          { name: 'name', type: 'text', label: 'Nombre y apellido', required: true },
          { name: 'email', type: 'email', label: 'Correo' },
          { name: 'phone', type: 'text', label: 'Teléfono', required: true },
          { name: 'ruc', type: 'text', label: 'RUC o C.I. (para la factura)' },
          { name: 'businessName', type: 'text', label: 'Razón social (para la factura)' },
        ],
      },
      {
        name: 'items',
        type: 'array',
        label: 'Productos del pedido',
        fields: [
          { name: 'product', type: 'relationship', relationTo: 'products', label: 'Producto' },
          { name: 'label', type: 'text', label: 'Detalle (producto y presentación)', required: true },
          { name: 'sku', type: 'text', label: 'Código' },
          { name: 'quantity', type: 'number', label: 'Cantidad', required: true, min: 1, defaultValue: 1 },
          { name: 'unitPrice', type: 'number', label: 'Precio unitario (Gs.)', required: true, min: 0, access: { read: fieldBackofficeOrCustomer } },
        ],
      },
      {
        name: 'delivery',
        type: 'group',
        label: 'Entrega',
        fields: [
          { name: 'method', type: 'select', label: 'Modalidad', required: true, defaultValue: 'courier', options: [{ label: 'Envío por courier', value: 'courier' }, { label: 'Retiro en el local', value: 'pickup' }] },
          { name: 'zone', type: 'relationship', relationTo: 'delivery-zones', label: 'Zona' },
          { name: 'address', type: 'textarea', label: 'Dirección y referencias' },
        ],
      },
      { name: 'subtotal', type: 'number', label: 'Subtotal (Gs.)', min: 0, access: { read: fieldBackofficeOrCustomer } },
      { name: 'shippingCost', type: 'number', label: 'Envío (Gs.)', min: 0, access: { read: fieldBackofficeOrCustomer } },
      { name: 'total', type: 'number', label: 'Total (Gs.)', min: 0, access: { read: fieldBackofficeOrCustomer } },
      {
        name: 'payment',
        type: 'group',
        label: 'Cobro y conciliación',
        access: { read: fieldBackoffice },
        fields: [
          { name: 'gateway', type: 'select', label: 'Medio de cobro', options: [{ label: 'Pagopar', value: 'pagopar' }, { label: 'Bancard', value: 'bancard' }, { label: 'Transferencia o QR (manual)', value: 'manual' }] },
          { name: 'method', type: 'text', label: 'Forma de pago (tarjeta, QR…)' },
          { name: 'transactionId', type: 'text', label: 'Código de transacción', admin: { description: 'Lo informa la pasarela. Sirve para conciliar contra el extracto.' } },
          { name: 'paidAt', type: 'date', label: 'Fecha y hora del cobro' },
          { name: 'amountPaid', type: 'number', label: 'Monto cobrado (Gs.)', min: 0 },
          { name: 'reconciled', type: 'checkbox', label: 'Conciliado', defaultValue: false },
          { name: 'reconciliationNote', type: 'textarea', label: 'Nota de conciliación' },
        ],
      },
      { name: 'notes', type: 'textarea', label: 'Observaciones del cliente' },
      { name: 'logisticsNote', type: 'textarea', label: 'Nota de envío (guía, courier, etc.)' },
    ],
    ['status', 'logisticsNote'],
  ),
}
