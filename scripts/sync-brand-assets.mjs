// Copia las imágenes de la marca activa (brand/<marca>/assets) a public/brand para que el sitio las sirva.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const active = readFileSync(join('brand', 'active.ts'), 'utf8')
const dir = /brandDir = '([^']+)'/.exec(active)?.[1]
if (!dir) throw new Error('No se pudo leer la marca activa en brand/active.ts. Ejecutá: npm run brand:use -- <marca>')
const from = join(dir, 'assets')
const to = join('public', 'brand')
rmSync(to, { recursive: true, force: true })
mkdirSync(to, { recursive: true })
if (existsSync(from)) cpSync(from, to, { recursive: true })
console.log(`Imágenes de marca copiadas: ${from} -> ${to}`)
