// Carrito: se guarda en el navegador (solo producto y cantidad). Los precios NUNCA vienen del navegador:
// el servidor los vuelve a leer de la base de datos al mostrar el carrito y al confirmar el pedido.
// Cada producto es una sola presentación con un solo precio.
export type CartLine = { p: number; q: number }

export const CART_KEY = 'jv_cart'
export const MAX_QTY = 99
export const MAX_LINES = 40

export function sanitizeCart(input: unknown): CartLine[] {
  if (!Array.isArray(input)) return []
  const seen = new Set<number>()
  const out: CartLine[] = []
  for (const raw of input) {
    if (!raw || typeof raw !== 'object') continue
    const { p, q } = raw as Record<string, unknown>
    if (typeof p !== 'number' || !Number.isInteger(p) || p <= 0 || seen.has(p)) continue
    seen.add(p)
    out.push({ p, q: typeof q === 'number' && Number.isFinite(q) ? Math.min(MAX_QTY, Math.max(1, Math.floor(q))) : 1 })
    if (out.length >= MAX_LINES) break
  }
  return out
}
