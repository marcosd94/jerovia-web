# Seguridad

Referencias: OWASP Top 10 / ASVS nivel 2, PCI DSS SAQ A (nunca se tocan datos de tarjeta), Ley 7593/2025 de datos personales (Paraguay).
Ningún sitio es "100 % seguro": esta lista dice qué está hecho y qué falta.

## Aplicado
- Roles con permisos por colección y por campo (Logística solo cambia estado y nota del pedido; no ve precios ni pagos).
- Bloqueo tras 5 intentos fallidos de inicio de sesión (10 min); sesión de 2 h; cookies seguras.
- GraphQL desactivado; CSRF y CORS limitados al dominio propio.
- Cabeceras de seguridad y CSP; HSTS en producción.
- Arranque en producción falla si `PAYLOAD_SECRET` tiene menos de 32 caracteres.
- Registro de auditoría inmutable (solo lectura para el Administrador).
- Subida de archivos con lista de tipos permitidos (sin SVG).
- Formulario "Para empresas": validación en servidor, campo trampa anti-spam y límite de envíos por IP.
- El primer usuario creado es Administrador; avatares externos desactivados.

- Google Analytics: solo carga con consentimiento de la persona, con IP anonimizada, y el CSP permite los dominios de Google solo si hay un ID configurado.
- Botones de la página de enlaces: solo se aceptan direcciones https, tel, mailto y páginas del propio sitio (se bloquea `javascript:`).
- Cuentas de clientes (colección `customers`, separada del personal): sesión en cookie propia (`jv_customer`, httpOnly, 7 días), contraseña mínima de 10 caracteres, bloqueo tras 5 intentos fallidos, límite de intentos por IP en registro, ingreso y recuperación, respuesta idéntica en "olvidé mi contraseña" exista o no el correo.
- Cada cliente solo lee y edita su propia cuenta y sus pedidos (regla de acceso en la base, no en la pantalla). Probado: un cliente no puede leer cuentas ni pedidos ajenos, ni usuarios del personal, ni el registro de actividad; tampoco crear cuentas ni pedidos por la API.
- Los campos de pago, el código de seguimiento del pedido y las notas internas no son visibles para el cliente.
- Un cliente con sesión nunca se confunde con el personal: las reglas distinguen la colección de origen de la sesión.
- Baja de cuenta desde el sitio (pide la contraseña): borra datos de contacto y direcciones; los pedidos quedan como registro de la tienda.

## Pendiente (antes de publicar)
- Servicio de correo (SMTP) configurado en producción: sin él no hay verificación de correo ni recuperación de contraseña.
- Verificación del correo al crear cuentas (se activa sola al definir `SMTP_HOST`) y vinculación de pedidos de invitado por correo verificado.
- Doble factor de autenticación (TOTP) para el panel.
- CSP con nonce, WAF/CDN (p. ej. Cloudflare) y Turnstile en formularios.
- Límite de envíos compartido entre servidores (hoy es en memoria; en Vercel cada instancia cuenta por separado, así que en la demo es solo orientativo).
- La CSP permite, además, los videos de YouTube (`youtube-nocookie.com`, `frame-src`) y las fotos de Vercel Blob (`img-src`).
- Copias de seguridad automáticas con prueba de restauración.
- Verificación de firma del webhook de la pasarela de pagos.
- Páginas legales y política de privacidad revisadas por un abogado (Ley 7593/2025).
- Prueba de penetración antes del lanzamiento.
- Rotar claves y credenciales de producción; nunca usar las de desarrollo.


## Eliminación lógica de datos

Todas las colecciones usan la papelera de Payload (`trash: true`): eliminar solo marca `deletedAt`. La regla `softDeleteOnly` (`src/access/index.ts`) permite únicamente enviar a la papelera (solo Administrador) y bloquea el borrado definitivo, también por API. La cuenta de un cliente que se da de baja desde el sitio también se archiva: el correo original queda en `emailAnterior` y el correo activo se libera. El Registro de actividad no se puede borrar. Los pedidos del listado se abren filtrados en *Por atender* (editable en `OrdersListFilter.tsx`).
