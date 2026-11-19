'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CART_KEY, MAX_QTY, sanitizeCart, type CartLine } from '@/lib/cart'

type CartApi = {
  lines: CartLine[]
  count: number
  ready: boolean
  add: (p: number, q?: number) => void
  setQty: (p: number, q: number) => void
  remove: (p: number) => void
  clear: () => void
}

const Ctx = createContext<CartApi | null>(null)

function read(): CartLine[] {
  try {
    return sanitizeCart(JSON.parse(localStorage.getItem(CART_KEY) ?? '[]'))
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setLines(read())
    setReady(true)
    // sincroniza entre pestañas
    const onStorage = (e: StorageEvent) => { if (e.key === CART_KEY) setLines(read()) }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const commit = useCallback((next: CartLine[]) => {
    setLines(next)
    try { localStorage.setItem(CART_KEY, JSON.stringify(next)) } catch { /* sin almacenamiento: el carrito vive solo en esta página */ }
  }, [])

  const api = useMemo<CartApi>(() => ({
    lines,
    ready,
    count: lines.reduce((n, l) => n + l.q, 0),
    add: (p, q = 1) => {
      const cur = read()
      const i = cur.findIndex((l) => l.p === p)
      if (i >= 0) cur[i] = { ...cur[i], q: Math.min(MAX_QTY, cur[i].q + q) }
      else cur.push({ p, q: Math.min(MAX_QTY, q) })
      commit(sanitizeCart(cur))
    },
    setQty: (p, q) => commit(sanitizeCart(read().map((l) => (l.p === p ? { ...l, q } : l)))),
    remove: (p) => commit(read().filter((l) => l.p !== p)),
    clear: () => commit([]),
  }), [lines, ready, commit])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useCart(): CartApi {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart debe usarse dentro de CartProvider')
  return c
}
