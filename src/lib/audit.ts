import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const label = (doc: Record<string, unknown>): string => {
  const v = doc.name ?? doc.title ?? doc.orderNumber ?? doc.email ?? doc.id
  return typeof v === 'string' || typeof v === 'number' ? String(v) : String(doc.id ?? '')
}

/** Deja constancia de quién creó o modificó un registro (colección "Registro de actividad") */
export const auditChange =
  (collection: string): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, operation, req }) => {
    // Enviar a la papelera se registra como eliminación; restaurar, como modificación
    const trashed = operation === 'update' && Boolean((doc as { deletedAt?: unknown }).deletedAt) && !(previousDoc as { deletedAt?: unknown } | undefined)?.deletedAt
    const action = trashed ? 'delete' : operation
    try {
      await req.payload.create({
        collection: 'audit-log',
        data: { collection, docId: String(doc.id), action, userEmail: req.user?.email ?? 'sistema', summary: label(doc) },
        overrideAccess: true,
        req,
      })
    } catch (error) {
      req.payload.logger.error({ err: error, msg: 'No se pudo registrar la actividad' })
    }
    return doc
  }

export const auditDelete =
  (collection: string): CollectionAfterDeleteHook =>
  async ({ doc, req }) => {
    try {
      await req.payload.create({
        collection: 'audit-log',
        data: { collection, docId: String(doc.id), action: 'delete', userEmail: req.user?.email ?? 'sistema', summary: label(doc) },
        overrideAccess: true,
        req,
      })
    } catch (error) {
      req.payload.logger.error({ err: error, msg: 'No se pudo registrar la actividad' })
    }
    return doc
  }
