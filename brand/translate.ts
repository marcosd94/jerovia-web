import type { L10n } from './types'

type Dict = Record<string, { en: string; pt: string }>

const isL10n = (v: unknown): v is L10n => typeof v === 'object' && v !== null && typeof (v as L10n).es === 'string'

/**
 * Recorre cualquier estructura (config, textos, datos de partida) y completa el inglés y el portugués
 * de cada texto { es } que no los tenga, usando el diccionario. Lo que ya está escrito no se toca.
 */
export function fillL10n<T>(value: T, dict: Dict): T {
  if (Array.isArray(value)) return value.map((v) => fillL10n(v, dict)) as unknown as T
  if (isL10n(value)) {
    const found = dict[value.es]
    return { ...value, en: value.en ?? found?.en, pt: value.pt ?? found?.pt } as unknown as T
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fillL10n(v, dict)])) as T
  }
  return value
}

/** Textos en español que siguen sin inglés o portugués (para revisar al agregar contenido nuevo) */
export function missingL10n(value: unknown, path = '$'): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => missingL10n(v, `${path}[${i}]`))
  if (isL10n(value)) return !value.en || !value.pt ? [`${path}: ${value.es.slice(0, 70)}`] : []
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([k, v]) => missingL10n(v, `${path}.${k}`))
  return []
}
