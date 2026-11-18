import { mkdirSync } from 'node:fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { es } from '@payloadcms/translations/languages/es'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { AuditLog } from './collections/AuditLog'
import { Brands } from './collections/Brands'
import { Categories } from './collections/Categories'
import { Certifications } from './collections/Certifications'
import { Customers } from './collections/Customers'
import { DeliveryZones } from './collections/DeliveryZones'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { StoreLocations } from './collections/StoreLocations'
import { Users } from './collections/Users'
import { HomeCarousel } from './globals/HomeCarousel'
import { LinkPage } from './globals/LinkPage'
import { SiteSettings } from './globals/SiteSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const rawDatabaseUrl = process.env.DATABASE_URL || 'file:./data/dev.db'

if (process.env.NODE_ENV === 'production' && (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 32)) {
  throw new Error('Falta PAYLOAD_SECRET (mínimo 32 caracteres). Ver .env.example')
}

// SQLite necesita que la carpeta exista (data/ no se sube a Git): se crea sola.
// Además se usa la ruta absoluta del archivo, para que funcione igual en Windows, Mac y Linux.
let databaseUrl = rawDatabaseUrl.trim()
if (databaseUrl.startsWith('file:')) {
  const filePath = path.resolve(process.cwd(), databaseUrl.replace(/^file:/, ''))
  mkdirSync(path.dirname(filePath), { recursive: true })
  databaseUrl = pathToFileURL(filePath).href
}

// Desarrollo: SQLite (un archivo). Producción: PostgreSQL. Se elige solo según DATABASE_URL.
const db = databaseUrl.startsWith('postgres')
  ? postgresAdapter({ pool: { connectionString: databaseUrl } })
  : sqliteAdapter({ client: { url: databaseUrl } })

export default buildConfig({
  serverURL,
  secret: process.env.PAYLOAD_SECRET || 'solo-para-desarrollo-local-no-usar-en-produccion',
  admin: {
    user: Users.slug,
    avatar: 'default', // no pedir avatares a servicios externos (privacidad)
    meta: { titleSuffix: ' | Panel de administración' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: { supportedLanguages: { es }, fallbackLanguage: 'es' }, // panel en español
  localization: {
    locales: [
      { label: 'Español', code: 'es' },
      { label: 'English', code: 'en' },
      { label: 'Português', code: 'pt' },
    ],
    defaultLocale: 'es',
    fallback: true,
  },
  collections: [Users, Media, Categories, Brands, Products, Certifications, Pages, Posts, StoreLocations, Leads, DeliveryZones, Customers, Orders, AuditLog],
  globals: [SiteSettings, HomeCarousel, LinkPage],
  // Correo (verificación de cuentas y recuperación de contraseña). Sin SMTP_HOST no se envían correos.
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM || 'no-responder@localhost',
        defaultFromName: process.env.SMTP_FROM_NAME || 'Tienda',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
        },
      })
    : undefined,
  editor: lexicalEditor(),
  db,
  sharp,
  graphQL: { disable: true }, // no se usa: menos superficie de ataque
  csrf: [serverURL],
  cors: [serverURL],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
