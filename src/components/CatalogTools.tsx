'use client'
import { useEffect, useMemo, useState, type ReactNode } from 'react'

export type CatalogItem = { id: number | string; text: string; node: ReactNode }
type Labels = { search: string; placeholder: string; clear: string; none: string; grid: string; list: string; count: string; countOne: string }

// Sin acentos ni mayúsculas, para que "azucar" encuentre "azúcar"
const norm = (v: string) => v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
const KEY = 'jv_catalog_view'

/** Buscador instantáneo y, en el celular, elección entre ver los productos en grilla o en filas (se recuerda la elección). */
export function CatalogTools({ items, labels }: { items: CatalogItem[]; labels: Labels }) {
  const [q, setQ] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    try { if (localStorage.getItem(KEY) === 'list') setView('list') } catch { /* sin almacenamiento: queda en grilla */ }
  }, [])
  const choose = (v: 'grid' | 'list') => {
    setView(v)
    try { localStorage.setItem(KEY, v) } catch { /* se usa solo para esta visita */ }
  }

  const shown = useMemo(() => {
    const tokens = norm(q).split(/\s+/).filter(Boolean)
    if (!tokens.length) return items
    return items.filter((it) => { const hay = norm(it.text); return tokens.every((t) => hay.includes(t)) })
  }, [items, q])

  return (
    <>
      <div className="catalog-tools">
        <form className="catalog-search" role="search" onSubmit={(e) => e.preventDefault()}>
          <label className="sr-only" htmlFor="catalog-q">{labels.search}</label>
          <input id="catalog-q" type="search" inputMode="search" enterKeyHint="search" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} placeholder={labels.placeholder} />
          {q ? <button type="button" className="catalog-clear" onClick={() => setQ('')} aria-label={labels.clear}>×</button> : null}
        </form>
        <div className="view-toggle" role="group" aria-label={`${labels.grid} / ${labels.list}`}>
          <button type="button" aria-pressed={view === 'grid'} onClick={() => choose('grid')} title={labels.grid}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z" /></svg>
            <span className="sr-only">{labels.grid}</span>
          </button>
          <button type="button" aria-pressed={view === 'list'} onClick={() => choose('list')} title={labels.list}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M3 4h18v4H3zm0 6h18v4H3zm0 6h18v4H3z" /></svg>
            <span className="sr-only">{labels.list}</span>
          </button>
        </div>
      </div>
      <p className="catalog-count" aria-live="polite">{shown.length === 1 ? labels.countOne : labels.count.replace('{n}', String(shown.length))}</p>
      {shown.length === 0 ? (
        <p className="catalog-none">{labels.none.replace('{q}', q.trim())}</p>
      ) : (
        <div className={`grid catalog-grid view-${view}`} style={{ paddingBottom: '4rem' }}>
          {shown.map((it) => <div key={it.id} className="catalog-item">{it.node}</div>)}
        </div>
      )}
    </>
  )
}
