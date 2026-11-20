# Despliegue de prueba en Vercel

Guía para publicar una **versión de prueba** (demo) del sitio en Vercel. Es un build real (`next build`), no el modo desarrollo.

## Qué cambia respecto al notebook

| Tema | Notebook | Vercel |
| --- | --- | --- |
| Base de datos | SQLite (`data/dev.db`) | PostgreSQL (Neon), por `DATABASE_URL` |
| Fotos subidas | Carpeta `media/` | Vercel Blob, por `BLOB_READ_WRITE_TOKEN` |

El código elige solo: si `DATABASE_URL` empieza con `postgres` usa PostgreSQL; si existe `BLOB_READ_WRITE_TOKEN` guarda las fotos en Blob. Sin esas variables todo sigue como en el notebook.

## Paso a paso

1. **Subir el código:** `git push` a GitHub (rama `main` o la que uses).
2. **Crear el proyecto:** en vercel.com → *Add New → Project* → importar el repositorio. Framework: Next.js (se detecta solo). No cambies el comando de build (`npm run build`).
3. **Base de datos:** en el proyecto → *Storage* → *Create* → **Neon (Postgres)** → conectar al proyecto. Vercel carga `DATABASE_URL` (si la variable se llama distinto, copiá la URL que empieza con `postgres://` y creá `DATABASE_URL`).
4. **Fotos:** *Storage* → *Create* → **Blob** → conectar al proyecto. Vercel carga `BLOB_READ_WRITE_TOKEN`. El store debe ser **público**.
5. **Variables** (*Settings → Environment Variables*):
   - `PAYLOAD_SECRET`: clave de 32+ caracteres. Generala con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   - `NEXT_PUBLIC_SERVER_URL`: la dirección del despliegue, sin barra final (ej. `https://jerovia-web.vercel.app`). Si todavía no la sabés, desplegá una vez, copiala y volvé a desplegar.
   - `NEXT_PUBLIC_DEFAULT_LOCALE=es`
   - Opcionales: ver `.env.example` (SMTP, Google Analytics).
6. **Desplegar:** *Deploy*. Cada rama o *pull request* genera además una URL de vista previa.
7. **Cargar datos de ejemplo (una sola vez), desde tu notebook** con las variables de Vercel:
   - Bajarlas: `vercel env pull .env.vercel` (requiere Vercel CLI) o copiarlas a mano.
   - Correr: `SEED_SHOP_ENABLED=1 npm run seed` usando ese `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` (una contraseña **nueva**, no la de desarrollo). Si aparece «index … already exists», repetí el comando.
8. **Proteger la demo:** *Settings → Deployment Protection* → activar protección (contraseña o Vercel Authentication) para que solo vean quienes vos invites.
9. **Probar:** ingresar a `/admin`, hacer un pedido de prueba, subir una foto y confirmar que se ve.

## Antes de pasar a producción real

- Migraciones de base de datos (hoy el esquema se aplica automáticamente, válido para la demo).
- Límite de intentos compartido (hoy en memoria; con varias instancias cada una cuenta aparte).
- Proveedor de correo (SMTP) y pasarela de pago.
- Mosaicos del mapa de un proveedor comercial.
- Dominio propio y `NEXT_PUBLIC_SERVER_URL` definitivo.
