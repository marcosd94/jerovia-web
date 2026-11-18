import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const label = (doc: Record<string, unknown>): string => {
  const v = doc.name ?? doc.title ?? doc.orderNumber ?? doc.email ?? doc.id
  return typeof v === 'string' || typeof v === 'number' ? String(v) : String(doc.id ?? '')
}

/** Deja constancia de quién creó o modificó un registro (colección "Registro de actividad") */
export const auditChange =
  (collection: string): CollectionAfterChangeHook =>
  async ({ doc, operation, req }) => {
    try {
      await req.payload.create({
        collection: 'audit-log',
        data: { collection, docId: String(doc.id), action: operation, userEmail: req.user?.email ?? 'sistema', summary: label(doc) },
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
