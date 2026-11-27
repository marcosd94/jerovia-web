# Backlog

Lista de tareas pendientes del proyecto. Se actualiza en cada sesión de trabajo.

**Cómo leerla:** *Origen* = quién lo pidió (Marcos) o quién lo sugiere (Claude). *Prioridad*: **P1** necesario para publicar, **P2** importante, **P3** mejora. *Tamaño*: S (menos de medio día), M (1 a 2 días), L (más de 2 días).

## 1. Pedidos de Marcos (nuevos)

| ID | Tarea | Prioridad | Tamaño | Notas |
| --- | --- | --- | --- | --- |
| ~~B-01~~ | ~~Botón para cambiar de idioma~~ **HECHO** | P2 | M | Selector desplegable (globo + código) en el encabezado, con ES / EN / PT; conserva la página al cambiar. Los tres idiomas quedan activos. **Pendiente:** la página `/links` sigue solo en español, y no se recuerda el idioma elegido entre visitas. |
| ~~B-02~~ | ~~Página de enlaces: botones menos altos~~ **HECHO** | P3 | S | Ahora miden 48 px (antes 64) y los logos 34 px, todos con la misma altura. |
| B-03 | Dónde comprar: mapa con los puntos de venta | P2 | M | **Hecho el mapa (OpenStreetMap).** Faltan las coordenadas de 14 de los 18 locales: ver "Locales para confirmar" más abajo. | El listado de locales muestra un botón "Ir a" (Google Maps) en cada local que ya tiene coordenadas.
| B-05 | Menú del header con más vida y versión móvil (icono de tres rayas, portada compacta) | P2 | M | **Hecho.** Página activa con hoja, botón principal "Dónde comprar", menú fijo que se achica. |
| B-06 | Portada con carrusel administrable desde el panel | P2 | M | **Hecho.** 5 diapositivas cargadas (yerba, azúcar, stevia, comunidad, certificaciones). Pendiente: foto real para la de comunidad (hoy es el logo de la Fundación Moisés Bertoni), imágenes de mayor resolución y traducciones al inglés y portugués. |
| B-04 | Footer: logos de certificaciones en una fila a todo el ancho, sin links repetidos del header | P3 | S | **Hecho.** En móvil los logos quedan en vertical. |

**Detalle B-03 (mapa) — estado**

- Hecho: campos de latitud y longitud, mapa con OpenStreetMap (Leaflet, sin clave), botones "Asunción y Gran Asunción / Interior / Todo el país", ventana con nombre, dirección, teléfono y "Cómo llegar".
- En el panel, al pegar el enlace largo de Google Maps en *Puntos de venta*, la latitud y la longitud se completan solas.
- Pendiente: probar los mosaicos del mapa en el sitio publicado y, antes de salir con mucho tráfico, evaluar un proveedor de mosaicos (la política de OpenStreetMap pide uso moderado).

**Detalle B-03 (propuesta original)**

- **Opción recomendada:** Leaflet con mapa de OpenStreetMap. Es gratis, no necesita clave ni tarjeta, y no manda datos de visitantes a Google.
- **Alternativa:** Google Maps. Se ve más familiar para el público, pero requiere clave, cuenta de facturación, aviso de cookies y ajustar la política de seguridad del sitio.
- **Cambios en el panel:** dos campos nuevos en *Puntos de venta* (latitud y longitud). Se pueden completar solos a partir del enlace de Google Maps que ya tiene cada punto.
- **En el sitio:** mapa con marcadores, la lista actual al lado, y al tocar un marcador se muestra nombre, dirección, teléfono y "Cómo llegar".
- **Opcional (P3):** filtro por tipo y zona, y botón "cerca de mí" (pide permiso de ubicación).
- **Datos que faltan:** coordenadas de los 18 puntos actuales.

### Locales para confirmar (mapa)

Con coordenadas (4): Real Villa Morra, Gran Vía (Asunción), María Castaña (Rca. Argentina) y Cooperativa Fernheim (Filadelfia).

Sin coordenadas: son cadenas con varias sucursales o no se pudieron identificar en Google Maps. Hace falta saber **qué sucursal vende Jerovia** (o pasar el enlace de Google Maps de cada una):

| Local | Qué encontré |
| --- | --- |
| Archi (Pinedo) y Archi (Lambaré) | En Google Maps aparece "Areté", con sucursales en Pinedo y Lambaré. Probablemente es el mismo comercio con otro nombre. Confirmar. |
| Cadena Superseis, Cadena Stock, Casa Rica, Cadena Puntofarma | Cadenas con muchas sucursales. Indicar cuáles. |
| Supermercados España | No coincide ningún resultado con el teléfono de la lista. |
| Casa Grutter (Defensores) | Google solo muestra la sucursal de Fernando de la Mora. |
| Mitsubi Multimarcas (Asunción y Ciudad del Este) | Solo aparece un taller. Confirmar que sea el mismo local. |
| Supermercados Gran Vía (Ciudad del Este) | Hay al menos 5 sucursales. |
| Maxi Super (Pedro Juan Caballero) | No hay coincidencia clara. |
| La Semilla y Be Okay | No se identificaron los locales. |

### Mejoras anotadas del carrusel y la portada

- Usar fotos propias en alta resolución (las actuales son capturas de unos 700 px).
- Asignar las fotos nuevas (frasco Morena, caja de mate cocido) a sus productos del catálogo desde el panel. Ya están en la biblioteca de medios.
- Producto "Mate cocido" sin ficha en el catálogo todavía.

## 2. Tienda (fase siguiente)

| ID | Tarea | Prioridad | Tamaño | Notas |
| --- | --- | --- | --- | --- |
| B-10 | Carrito y checkout con tres opciones (ingresar, crear cuenta, invitado) | ✅ Hecho | L | Carrito, checkout y confirmación con cobro manual. Ver `docs/TIENDA-CARRITO-Y-CHECKOUT.md`. Falta: precios y zonas reales, datos de transferencia, probar en el notebook. |
| B-11 | Pago con Pagopar (y evaluar Bancard) con webhook firmado | P1 | L | Pago en la página de la pasarela: nunca pasan datos de tarjeta por nuestro servidor. Requiere cuenta de comercio. Hoy el cobro es manual (transferencia/QR o contra entrega). Pagopar: riesgo por su casa matriz; evaluar Bancard vPOS 2.0 (ver `docs/TIENDA-CARRITO-Y-CHECKOUT.md`). |
| B-12 | Seguimiento de pedido para invitados por enlace del correo | P1 | M | El código secreto del pedido ya se genera. Falta la página y el correo. |
| B-13 | Oferta de crear cuenta después de comprar y vinculación de pedidos por correo verificado | P2 | M | Solo pide elegir contraseña. |
| B-14 | Correos de la tienda (confirmación de pedido, cambio de estado, envío) | P1 | M | Depende de B-30. Textos en tres idiomas. |
| B-15 | Costos y tiempos de envío por zona, con la cobertura real; **compra mínima configurable ya hecha** | P1 | S | Las zonas existen y hay 3 de PRUEBA (Asunción, Gran Asunción, Interior); faltan las tarifas reales de la empresa. |
| B-16 | Stock y disponibilidad por presentación | P2 | M | Hoy solo hay "Disponible" sí o no. Decidir si se controla cantidad. |
| B-17 | Pantalla de conciliación de cobros contra el extracto | P2 | M | El modelo de datos ya está (campos de cobro y "Conciliado"). |
| B-18 | Factura: definir cómo se emite (factura electrónica SIFEN u otro sistema) | P1 | M | Decisión con el contador de la empresa. Los datos de RUC y razón social ya se guardan. |
| B-19 | Política de cambios, devoluciones y plazos de entrega | P2 | S | Texto legal y comercial a definir con la empresa. |
| B-20a | Panel de pedidos de inicio con filtros y globo de pendientes en el menú | ✅ Hecho | M | Ver `docs/MANUAL-DE-USUARIO.md`. Mejoras futuras: exportar a CSV, comparar contra el período anterior, agregaciones en base si hay muchos pedidos. |
| B-20b | Marca / Línea / Categoría separadas, aprobación de pedidos, contacto con el comprador y buscador del catálogo | ✅ Hecho | M | Ver `docs/MANUAL-DE-USUARIO.md`. Pendiente: pantalla propia de envíos para Logística (hoy ve los pedidos aprobados en la lista de Pedidos) y borrar las marcas viejas vacías. |

## 3. Contenido, idiomas y diseño

| ID | Tarea | Prioridad | Tamaño | Notas |
| --- | --- | --- | --- | --- |
| B-20 | Traducciones al inglés y portugués: **borrador cargado**, falta revisión nativa | P2 | S | Se cargaron 116 textos (productos, certificaciones, páginas Nosotros/Comunidad, portada, carrusel, enlaces, textos de imágenes) desde `brand/jerovia/translations.ts` con `npm run seed`. Las notas de prensa quedan en español a propósito. Una persona nativa debe revisar el inglés y el portugués antes de publicar. |
| B-21 | Imágenes y logos en alta resolución | P1 | S | Los logos de Fortunata y Surya Henna y la portada de la página de enlaces son recortes de baja resolución (provisorios). Pedir originales a la empresa. |
| B-22 | Fortunata y Surya Henna en el catálogo | P2 | M | Hoy solo existen como botones de la página de enlaces. Definir si son marcas dentro del sitio o sitios aparte. |
| B-23 | Favicon, ícono de la app e imagen para compartir en redes | P2 | S | **Favicon hecho** (hoja verde de tres folíolos que apuntan a la derecha, como en el logo, con marco bordó; el mismo ícono en el sitio, /links y el panel, en `brand/jerovia/assets/favicon.*`, y ícono para iPhone). **Falta:** imagen para compartir en redes (Open Graph). |
| B-24 | SEO: mapa del sitio, `robots.txt`, datos estructurados de productos, textos para buscadores | P2 | M | Importante para que el sitio nuevo no pierda posicionamiento frente al actual. |
| B-25 | Redirecciones desde las direcciones del sitio actual | P1 | S | Evita enlaces rotos y pérdida de posicionamiento al cambiar de sitio. Requiere la lista de direcciones actuales. |
| B-26 | Buscador de productos y filtros (por categoría, certificación, marca) | P3 | M | |
| B-27 | Revisión de diseño con las guías de interfaz web de Vercel y la guía de React/Next.js | P2 | M | Barrido completo del proyecto con checklist de accesibilidad, rendimiento y buenas prácticas. |
| B-28 | Auditoría de accesibilidad (teclado, lectores de pantalla, contraste) | P2 | M | |
| B-29 | Página 404 y páginas de error con el estilo de la marca | P3 | S | |

## 4. Plataforma, seguridad y operación

| ID | Tarea | Prioridad | Tamaño | Notas |
| --- | --- | --- | --- | --- |
| B-30 | Elegir proveedor de correo (SMTP) y configurarlo | P1 | S | Sin él no hay verificación de correo ni recuperación de contraseña. Opciones: Resend, Postmark, Amazon SES o el correo de la empresa. |
| B-31 | Elegir hosting y pasar a PostgreSQL con migraciones | P1 | L | Define dónde corre el sitio y la base. Incluye almacenamiento persistente para las fotos. |
| B-32 | Copias de seguridad automáticas con prueba de restauración | P1 | M | |
| B-33 | Doble factor de autenticación para el personal | P1 | M | |
| B-34 | Protección en el borde: WAF/CDN (Cloudflare), Turnstile en formularios, CSP con nonce | P1 | M | |
| B-35 | Límite de intentos compartido entre servidores | P2 | S | Hoy es en memoria (sirve con un solo servidor). |
| B-36 | Páginas legales: privacidad, términos y cookies, revisadas por un abogado (Ley 7593/2025) | P1 | M | El aviso de cookies de la medición también necesita revisión legal. |
| B-37 | Dominio, HTTPS y variables de producción (claves nuevas) | P1 | S | |
| B-38 | Pruebas automáticas (registro, ingreso, compra, permisos) y revisión en cada cambio | P2 | L | Los flujos de cuentas se probaron a mano; conviene dejarlos como pruebas repetibles. |
| B-39 | Integración continua en GitHub (compilar y revisar tipos en cada cambio) | P2 | S | |
| B-40 | Monitoreo de errores y de disponibilidad | P2 | S | |
| B-41 | Prueba de penetración antes del lanzamiento | P1 | M | |
| ~~B-42~~ | ~~Subir el repositorio privado a GitHub~~ **HECHO** | P1 | S | Repositorio en GitHub; Vercel despliega en cada `git push`. |
| B-43 | Demo en Vercel (Neon + Blob): cargar datos con el seed, proteger con *Deployment Protection* y probar el sitio completo | P1 | S | Guía: `docs/DESPLIEGUE-VERCEL.md`. Estado: desplegado; faltaba el seed para crear las tablas. En la demo el límite de intentos es orientativo (B-35). |

## 5. Panel y análisis

| ID | Tarea | Prioridad | Tamaño | Notas |
| --- | --- | --- | --- | --- |
| B-50 | Tablero para el rol Visor: ventas, pedidos, productos más vistos, origen del tráfico | P2 | L | Aprovecha Google Analytics y los pedidos. |
| B-51 | Exportar clientes, pedidos y solicitudes a CSV | P3 | S | Con cuidado por los datos personales. |
| B-52 | Avisos al equipo (correo o WhatsApp) cuando llega un pedido o una solicitud de empresa | P2 | M | |
| B-53 | Cambiar el estado de varios pedidos a la vez | P3 | S | |
| B-55 | Resumen por correo 3 veces al día (08:00, 12:00 y 17:00, hora de Paraguay): pedidos nuevos, pedidos pendientes de pago o de aprobación, aprobados pendientes de envío y estado general, para que cada responsable gestione lo que le toca | P2 | M | Depende de B-30 (correo) y de una tarea programada. Cada rol recibe solo lo suyo (Logística: por preparar y en camino). Evitar enviar si no hay nada pendiente. |
| B-54 | Medición de Google Analytics: ID real, eventos de compra y de la página de enlaces | P2 | S | Hace falta crear la propiedad GA4. |

## 6. Verificaciones abiertas

| ID | Qué hay que confirmar |
| --- | --- |
| V-01 | Que `npm run seed` funcione en la notebook de Marcos con Windows (el error de la base SQLite se corrigió dos veces; falta la confirmación). |
| V-02 | Los nombres de botones del panel citados en el manual de usuario (*Crear nuevo*, *Guardar*, *Eliminar*) y el enlace de recuperación de contraseña, recorriendo el panel real. |
| V-03 | Que los datos de ejemplo del sitio (puntos de venta, productos, textos) estén validados por la empresa. Ver `docs/CONTENIDO-A-CONFIRMAR.md`. |
| V-04 | Que el sitio de la demo en Vercel cargue con datos, que las fotos se guarden en Blob y que los videos de YouTube de *Nosotros* se vean (en el sandbox no se pudieron probar). |
| V-05 | Que el historial de GitHub no tenga líneas de coautoría de herramientas (`git log --format=%B` sin «claude»). |

## Orden de trabajo sugerido

1. **Mejoras rápidas pedidas:** B-23 (solo falta la imagen para compartir en redes).
2. **Mapa de puntos de venta:** B-03, una vez que se consigan las coordenadas.
3. **Idiomas:** revisión nativa de B-20 (el selector B-01 ya está).
4. **Tienda:** B-30, B-10, B-11, B-12, B-14 y B-15, en ese orden.
5. **Salida a producción:** B-31 a B-37, B-41 y B-25.
