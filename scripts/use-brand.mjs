// Cambia la marca activa del sitio:  npm run brand:use -- nombre-de-la-carpeta
// Copia de partida para una empresa nueva:  copiar brand/_template a brand/<nueva-empresa> y luego usar este comando.
import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const id = process.argv[2]
if (!id) {
  console.error('Uso: npm run brand:use -- <carpeta-de-marca>   (por ejemplo: jerovia)')
  process.exit(1)
}
const dir = join('brand', id)
if (!existsSync(join(dir, 'index.ts')) || !existsSync(join(dir, 'theme.css'))) {
  console.error(`No existe una marca válida en ${dir} (faltan index.ts o theme.css).`)
  process.exit(1)
}
writeFileSync(
  join('brand', 'active.ts'),
  `// ARCHIVO GENERADO por "npm run brand:use". No editar a mano.\nexport * from './${id}/index'\nexport const brandDir = 'brand/${id}'\n`,
)
writeFileSync(join('brand', 'active.css'), `/* GENERADO por "npm run brand:use". No editar a mano. */\n@import './${id}/theme.css';\n`)
import("node:child_process").then(({ execSync }) => execSync("node scripts/sync-brand-assets.mjs", { stdio: "inherit" }))
console.log(`Marca activa: ${id}. Reiniciá "npm run dev" y ejecutá "npm run seed" si es una base nueva.`)
