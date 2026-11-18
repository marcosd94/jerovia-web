# Sitio web de marca (Next.js + Payload CMS)

Sitio institucional + catálogo + tienda (apagada por defecto) con panel de administración en español.
Está pensado para reutilizarse con otras empresas: toda la identidad vive en `brand/<empresa>/`.
Marca activa hoy: **Jerovia Orgánico**.

## Qué incluye
- Sitio público (es; estructura lista para en/pt): portada, productos, certificaciones, dónde comprar, blog, "Para empresas" (alta de clientes).
- Panel en `/admin` con roles: Administrador, Gestor, Visor, Logística.
- Base de datos: SQLite en desarrollo, PostgreSQL en producción (se elige solo por `DATABASE_URL`).

## Primera vez (en tu computadora)
Requisitos: Node.js 20 o superior y Git.

1. `npm install`
2. Copiá `.env.example` como `.env` y completá:
   - `PAYLOAD_SECRET`: texto aleatorio de 32+ caracteres (nunca lo subas a Git).
   - `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD`: tu usuario administrador inicial.
3. `npm run seed` carga el contenido de ejemplo de la marca activa (se puede repetir sin duplicar).
4. `npm run dev` y abrí http://localhost:3000 (panel: http://localhost:3000/admin).

## Página de enlaces (Instagram) y Google Analytics
- La página de enlaces para la biografía de Instagram está en `/links` (ejemplo: `https://tudominio.com/links`). Se arma desde el panel: **Contenido > Página de enlaces (Instagram)**: se agregan, ordenan, destacan y ocultan botones sin tocar código.
- Los enlaces internos llevan etiquetas UTM (`utm_source=instagram`) para saber en Analytics cuántas visitas llegan desde Instagram.
- Para activar Google Analytics 4: crear la propiedad en Google, copiar el ID (`G-XXXXXXXXXX`) y ponerlo en `NEXT_PUBLIC_GA_ID` del `.env`; reiniciar y volver a compilar. Sin ID no se carga nada. Con ID, aparece un aviso de cookies y Google solo se carga si la persona acepta.
- Cada clic en un botón envía el evento `link_click` (con el nombre, tipo y destino del botón).

## Cuentas de clientes
- Páginas en `/es/cuenta` (registro, ingreso, mis datos, direcciones, mis pedidos, cambio y recuperación de contraseña, baja). El menú muestra "Mi cuenta" cuando la tienda está activada en el panel.
- Los clientes están en **Ventas > Clientes** (solo lectura de gestión; solo el personal autorizado los ve).
- Correo: definir `SMTP_*` en `.env` para exigir verificación de correo y enviar la recuperación de contraseña. Ver `docs/DISENO-CUENTAS-DE-CLIENTE.md`.
- Después de bajar estos cambios: `npm install` (se agregó `@payloadcms/email-nodemailer`).

## Comandos
| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Versión de producción |
| `npm run seed` | Carga contenido inicial |
| `npm run brand:use -- <carpeta>` | Cambia la marca activa |
| `npm run typecheck` | Revisa errores de tipos |

## Subir a GitHub (repositorio privado)
1. Creá en github.com un repositorio **privado** llamado `jerovia-web` (sin README).
2. En la carpeta del proyecto: `git add .`, `git commit -m "Primera versión"`, `git branch -M main`,
   `git remote add origin https://github.com/TU-USUARIO/jerovia-web.git`, `git push -u origin main`.
3. Verificá que `.env` NO aparezca en GitHub (está en `.gitignore`).

## Documentación
- `docs/WHITE-LABEL.md`: cómo crear el sitio de otra empresa.
- `docs/SEGURIDAD.md`: medidas aplicadas y pendientes.
- `docs/CONTENIDO-A-CONFIRMAR.md`: textos y datos que la empresa debe validar.
- `docs/MANUAL-DE-USUARIO.md`: manual para el personal que administra el sitio.
- `docs/BACKLOG.md`: lista de pendientes priorizada.
- `docs/MANUAL-TECNICO.md`: tecnología de base, tipos de API, carpetas, modelos, permisos, variables de entorno, despliegue y pendientes.
- `docs/GUIA-TECNICA.md`: cómo funciona el sitio, cómo crear un ABM nuevo, cómo viaja un clic hasta la base.
- `docs/infografia-arquitectura.html`: versión visual de la guía técnica (abrir en el navegador).
- `docs/DISENO-CUENTAS-DE-CLIENTE.md`: diseño de cuentas de cliente y compra como invitado (pendiente de implementar).
