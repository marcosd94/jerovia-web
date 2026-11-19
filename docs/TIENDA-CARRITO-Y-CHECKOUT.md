# Tienda: carrito, checkout y cobro

Estado: **carrito, checkout y confirmación implementados con cobro manual** (sin pasarela). Fuera de alcance por ahora: seguimiento de pedido en línea y correos de la tienda.

## Cómo funciona
0. **Catálogo:** un producto = una presentación = un precio (campos `presentation`, `sku`, `price`, `available`, `family`). `/productos` es el catálogo: cada tarjeta tiene selector de cantidad y "Agregar". El campo anterior `variants` quedó oculto solo como respaldo de la migración; se puede eliminar más adelante.
1. **Carrito** (`/carrito`): el navegador guarda solo producto y cantidad (`localStorage`, clave `jv_cart`). Precio, nombre y disponibilidad los lee el servidor cada vez (`src/lib/shop.ts`).
2. **Checkout** (`/checkout`), tres opciones: *Ingresar* y *Crear cuenta* (llevan a `/cuenta/...?next=checkout` y vuelven; el carrito se conserva) o *Comprar sin cuenta*. Con sesión iniciada el formulario viene prellenado.
3. **Entrega:** envío por zona (costo desde *Zonas de entrega*) o retiro en el local.
4. **Pago manual:** transferencia/QR o contra entrega / al retirar (se activan en *Configuración del sitio*).
5. **Pedido:** la Server Action `placeOrder` recalcula todo (precios, envío, total, disponibilidad), valida, limita intentos por IP y crea el pedido con permiso de servidor, en estado `pendiente_pago`, `payment.gateway = manual`. Los ítems se guardan en español.
6. **Confirmación** (`/pedido/<número>?t=<código>`): acceso solo con el código secreto del enlace o desde la cuenta dueña. Muestra cómo pagar y ofrece crear cuenta a quien compró sin ella. Vacía el carrito.

## Seguridad
- Ningún precio viene del navegador; ni datos de tarjeta pasan por el servidor.
- Campo trampa anti-robots, límite de 8 pedidos por IP cada 30 min, carrito acotado (40 líneas, 99 por línea).
- La página del pedido no se indexa y no envía referencia a otros sitios.

## Datos de prueba (provisionales)
`npm run seed` separa cada presentación en su propio producto (la primera conserva la dirección web; las demás son `<slug>-<presentacion>`, ej. `yerba-mate-organica-250-g`) y carga precios, códigos y 3 zonas de envío **solo donde estén vacíos** (no pisa lo editado en el panel). Para encender la tienda al sembrar: `SEED_SHOP_ENABLED=1 npm run seed` (el seed nunca la apaga).

| Producto | Precios cargados (Gs.) | Origen |
|---|---|---|
| Yerba mate | 500 g 15.650 · 400 g 13.200 · 250 g 8.500 · 25 saquitos 9.500 | 500 g y 400 g: Supermas. 250 g y saquitos: estimados |
| Mate cocido | 500 g 16.500 · 250 g 9.000 · 25 saquitos 8.500 | Estimados (Biggie: saquitos ≈ 7.500–8.000) |
| Azúcar orgánico | 1 kg 11.500 · 2 kg 20.950 · 5 kg 48.500 · 500 g 6.500 · 250 g 3.500 | 1, 2 y 5 kg: Supermas. 500 g y 250 g: estimados |
| Sobres de azúcar | Bolsa de 100 sobres 19.600 · sobrecito 200 | Bolsa: Supermas. Sobrecito: estimado |
| Stevia | 100 sobres 31.800 · 200 sobres 53.800 | Supermas |
| Natural Mate Tea | Mix naranja 85 g, siempre viva 40 g, manzanilla 40 g, mix de mate 100 g: 14.200 cada una | Supermas |
| Catuaba | 25 saquitos 9.000 | Estimado |

Fuente de referencia: el catálogo de Jerovia en Supermas (`supermas.com.py/catalogo/jerovia-m1868`, consultado el 18/11/2026; son precios de góndola, no de lista de la empresa). Los precios de prueba anteriores se actualizan solos si nadie los tocó en el panel.
Los tres productos "A confirmar" quedan sin precio (se muestran como "Consultar").
Zonas de prueba: Asunción 15.000 · Gran Asunción 25.000 · Interior 40.000.

## Pasarela de pago (pendiente)
- **Pagopar:** no se confirmó que haya cerrado, pero su casa matriz (Grupo M S.A.) pertenece en un 50 % a Itti (Grupo Vázquez), vinculado a la crisis del Ueno Bank (procedimiento de resolución del BCP). Hay riesgo de contraparte: verificar con la empresa antes de depender de él.
- **Bancard (vPOS 2.0):** API REST, pago en iframe o redirección con 3DS, compra simple o con tarjeta guardada, ambiente de pruebas. Requiere contrato de comercio con Bancard.
- El BCP está regulando a los proveedores de pago en 2026. El QR representa ~68 % de los pagos digitales en Paraguay: la transferencia/QR manual es una alternativa razonable mientras tanto.
- Integrar cualquiera deja intacto el flujo: solo cambia el paso de pago y se agrega un webhook firmado que marca el pedido como `pagado`.

## Pendiente
Datos reales (precios, zonas, datos de transferencia), seguimiento de pedido para invitados, correos de confirmación (requiere SMTP), pasarela, migraciones de base de datos antes de producción (el campo nuevo `payments` de *Configuración del sitio*).
