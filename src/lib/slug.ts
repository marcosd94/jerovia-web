import type { FieldHook } from 'payload'

export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Genera la dirección web (slug) a partir del nombre si el campo quedó vacío */
export const slugFrom =
  (source: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const base = (data as Record<string, unknown> | undefined)?.[source]
    return typeof base === 'string' ? slugify(base) : value
  }
