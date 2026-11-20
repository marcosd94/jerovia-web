# Manual de usuario — Administración del sitio web

> Versión en el repositorio (para versionar en git). La versión editable y compartible vive en Claude Docs: https://claude.ai/artifact/QVk3AfaB6xMSy9Nc1kB7MU
> Si hay diferencias, mantener ambas sincronizadas al actualizar el panel.

## Resumen general

El sitio se administra desde un panel privado que se abre agregando `/admin` a la dirección del sitio (por ejemplo, tusitio.com.py/admin). Todo lo que se ve en la web —productos, notas, puntos de venta, textos, fotos— se carga y edita ahí, sin tocar código.

**Cómo ingresar**

1. Abrí el navegador y entrá a la dirección del sitio seguida de /admin.
2. Escribí tu correo y tu contraseña, y presioná el botón de ingresar.
3. Vas a ver el panel con el menú lateral a la izquierda, ordenado en grupos: Catálogo, Contenido, Ventas y Sistema.

**Cómo se gestiona cualquier sección**

Todas las pantallas funcionan igual (lo que en sistemas se llama ABM: altas, bajas y modificaciones):

- **Ver la lista:** al entrar a una sección aparece la lista de registros, con buscador y filtros.
- **Crear:** botón *Crear nuevo*, arriba a la derecha. Se completan los campos y se guarda.
- **Editar:** se hace clic en el registro, se cambian los campos y se presiona *Guardar*.
- **Eliminar:** dentro del registro, menú de los tres puntos y opción *Eliminar*. Antes de borrar conviene ocultarlo (ver más abajo).

**Qué puede hacer cada rol**

| Rol | Qué puede hacer |
| --- | --- |
| Administrador | Todo, incluidos usuarios, configuración y activar o desactivar la tienda. |
| Gestor | Cargar y editar contenido, precios, pedidos y cobros. |
| Visor | Solo mirar; no puede cambiar nada. |
| Logística | Solo ve los pedidos aprobados, para preparar los envíos. |

Si un menú no aparece, es porque tu rol no tiene acceso a esa sección.

**Reglas de oro**

- Para sacar algo del sitio sin perderlo, desmarcá *Visible en el sitio* (o dejalo como borrador) en lugar de eliminarlo.
- Los campos marcados como obligatorios deben completarse para poder guardar.
- Los textos se cargan primero en español, que es el idioma principal del sitio. El inglés y el portugués se completan en las pestañas de idioma de cada campo; si una pestaña queda vacía, el sitio muestra el texto en español. Las traducciones iniciales son un borrador: conviene que las revise una persona nativa.
- Las fotos siempre llevan una descripción corta; ayuda a personas con lectores de pantalla y al posicionamiento en Google.
- Cada cambio queda registrado con el usuario que lo hizo (ver *Registro de actividad*).

## Ingresar al panel y recorrer la pantalla principal

La pantalla de ingreso pide dos datos: **Correo** y **Contraseña**. Después de ingresar se abre el panel principal.

| Zona de la pantalla | Para qué sirve |
| --- | --- |
| Menú lateral (izquierda) | Lista todas las secciones, agrupadas en Catálogo, Contenido, Ventas y Sistema. Cada persona ve solo las que su rol permite. |
| Panel central | Atajos a cada sección con la cantidad de registros cargados. |
| Arriba a la derecha | Acceso a tu cuenta, donde podés cambiar tu nombre y tu contraseña, y la opción de cerrar sesión. |

**Si olvidaste la contraseña:** usá el enlace de recuperación de la pantalla de ingreso, o pedí a un Administrador que te genere una nueva. *(A verificar en el panel real.)*

**Al terminar:** cerrá sesión, sobre todo si usaste una computadora compartida.

## Productos

**Menú:** Catálogo → Productos. Cada producto tiene su página en el sitio y aparece dentro de su categoría.

**Crear un producto**

1. Entrá a Productos y presioná *Crear nuevo*.
2. Completá los datos principales (tabla de abajo).
3. Completá la *Presentación* (ej: 500 g), el precio y el código. **Un producto es una sola presentación**: si la yerba viene en 250 g y 500 g, son dos productos.
4. Subí la foto principal y, si querés, más fotos.
5. Elegí las certificaciones que correspondan.
6. Guardá como borrador para revisar o publicá para que se vea en el sitio.

| Campo | Qué poner |
| --- | --- |
| Nombre (obligatorio) | Nombre del producto tal como lo ve el cliente. |
| Dirección web | Se genera sola a partir del nombre; no hace falta tocarla. |
| Categoría (obligatorio) | La categoría donde aparece. Debe existir antes. |
| Marca | Marca del producto, si corresponde. |
| Destacado en la portada | Lo muestra en la página de inicio. |
| Orden | Número menor = aparece primero. |
| Resumen | Una o dos líneas (máximo 220 caracteres). |
| Descripción completa | Texto largo con formato. |
| Foto principal y Más fotos | Imágenes de la biblioteca de Medios. |
| Presentación, código (SKU), precio y *Disponible* | Una sola presentación por producto, con su precio en guaraníes. |
| Grupo de presentaciones | Mismo texto en los productos que son la misma cosa en distinto tamaño (ej: `yerba-mate-organica`). Solo sirve para organizarte. |
| Certificaciones del producto | Una o varias, elegidas de la lista. |

**Precios:** si dejás el precio vacío, el sitio muestra "Consultar precio". Se escribe solo el número, sin puntos ni Gs.

**Cambiar un precio:** abrí el producto, modificá el precio y guardá.

**Agotado:** desmarcá *Disponible* en ese producto.

**Despublicar:** pasá el producto a borrador. No se pierde nada y podés volver a publicarlo.

## Categorías

**Menú:** Catálogo → Categorías. Agrupan los productos y arman las tarjetas de la sección de catálogo.

| Campo | Qué poner |
| --- | --- |
| Nombre (obligatorio) | Ej: Yerbas, Aceites, Especias. |
| Dirección web | Se completa sola. |
| Descripción | Frase corta que acompaña a la categoría. |
| Color de la tarjeta | Color 1 a Color 4; define el color de la tarjeta en el sitio. |
| Orden | Menor número = primero. |
| Visible en el sitio | Desmarcar la oculta sin borrarla. |

**Importante:** antes de eliminar una categoría, mové sus productos a otra. Un producto necesita categoría para poder guardarse.

## Marcas

**Menú:** Catálogo → Marcas. Sirve para asociar productos a una marca.

| Campo | Qué poner |
| --- | --- |
| Nombre (obligatorio) | Nombre de la marca. |
| Dirección web | Se completa sola. |
| Logo | Imagen de la biblioteca de Medios. |
| Descripción | Texto breve sobre la marca. |

**Paso a paso:** *Crear nuevo* → completar nombre y logo → *Guardar*. Luego, en cada producto, elegir la marca en el campo *Marca*.

## Líneas

**Menú:** Catálogo → Líneas. Una **marca** puede tener varias **líneas**: por ejemplo, la marca *Jerovia* tiene las líneas *Orgánico* y *Natural*. No son marcas distintas.

Cómo se ordena el catálogo:

| Concepto | Pregunta que responde | Ejemplo |
| --- | --- | --- |
| Marca | ¿De quién es? | Jerovia |
| Línea | ¿De qué familia de la marca? | Orgánico, Natural |
| Categoría | ¿Qué tipo de producto es? | Yerba mate, azúcar, stevia |

| Campo | Qué poner |
| --- | --- |
| Nombre de la línea (obligatorio) | Solo el nombre, sin repetir la marca. Ej.: Orgánico. |
| Marca (obligatorio) | La marca a la que pertenece. |
| Orden | Número menor = aparece primero. |

En cada producto se elige la *Marca* y luego la *Línea* (la lista ofrece solo las líneas de esa marca). En el sitio, la ficha muestra «Jerovia · Orgánico» y el catálogo permite filtrar por línea.
## Certificaciones

**Menú:** Catálogo → Certificaciones. Son los sellos (orgánico, comercio justo, etc.) que se muestran en los productos y, si se elige, en el pie de página.

| Campo | Qué poner |
| --- | --- |
| Nombre (obligatorio) | Nombre del sello. |
| Logo o sello | Imagen. Si no hay, se muestra el nombre. |
| Qué significa | Explicación para el cliente. |
| Enlace a más información | Opcional; página del organismo certificador. |
| Mostrar en el pie de página | Lo suma al final de todas las páginas. |
| Orden | Menor número = primero. |

Para que un sello aparezca en un producto, hay que elegirlo dentro del producto, en *Certificaciones del producto*.

## Carrusel de la portada

**Menú:** Contenido → Carrusel de la portada. Son las diapositivas que se ven arriba de todo en la página de inicio, una detrás de otra. Cada una tiene un título, un texto corto, una imagen y hasta dos botones. Se pueden agregar todas las que se quiera.

**Opciones generales**

| Campo | Qué hace |
| --- | --- |
| Mostrar el carrusel | Si se desmarca (o no hay ninguna diapositiva visible), la portada vuelve a mostrar el mensaje fijo de siempre. |
| Pasar solo | Las diapositivas cambian solas. Se detienen al pasar el mouse por encima, al tocarlas o con el botón de pausa. Si la persona tiene activada la opción de reducir movimiento en su equipo, no cambian solas. |
| Segundos por diapositiva | Entre 4 y 20. Recomendado: 7. |

**Cada diapositiva**

| Campo | Qué poner |
| --- | --- |
| Título (obligatorio) | Corto y claro. La primera diapositiva es el título principal de la página. |
| Texto de apoyo | Una o dos frases. |
| Qué se muestra a la derecha | *Una imagen* o *Todos los logos de certificaciones* (muestra los logos cargados en Certificaciones, sin tener que elegirlos). |
| Imagen | Cuadrada o un poco más alta que ancha, de 1200 px o más de lado. Se sube o elige desde la biblioteca de medios. |
| Cómo se acomoda la imagen | *Llenar el marco* recorta los bordes para que no queden espacios. *Mostrarla completa* es para logos: queda entera sobre fondo blanco. |
| Sello sobre la imagen | Opcional. Un círculo en la esquina, tomado de Certificaciones (por ejemplo, "Paraguayo como vos"). |
| Botón principal y secundario | Texto y enlace. El enlace puede ser una página de este sitio (por ejemplo `/productos` o `/productos/stevia-endulzante`) o una dirección que empiece con `https://`. Si falta el texto o el enlace, el botón no se muestra. |
| Visible | Desmarcar para ocultar una diapositiva sin borrarla. |

**Alta, orden y baja:** *Agregar diapositiva*, completar y *Guardar*. Para cambiar el orden se arrastra cada diapositiva; la primera es la que se ve al entrar. Para sacar una, se desmarca *Visible* o se elimina.

**Consejo:** usar fotos buenas y con el producto bien visible, y títulos de pocas palabras. Con 3 a 6 diapositivas alcanza: más que eso, casi nadie las ve.

## Puntos de venta

**Menú:** Contenido → Puntos de venta. Es la lista de comercios donde se consigue el producto, que el cliente ve en el sitio.

| Campo | Qué poner |
| --- | --- |
| Nombre del comercio (obligatorio) | Ej: Supermercado Stock Luque. |
| Tipo (obligatorio) | Supermercado, farmacia, etc. Se elige de la lista. |
| Zona (obligatorio) | Asunción y Gran Asunción, Interior, etc. Se elige de la lista. |
| Ciudad y Dirección | Opcionales. |
| Teléfono | Contacto del comercio. |
| Enlace a Google Maps | Opcional. Abrir el local en Google Maps en la computadora, copiar la dirección completa de la barra del navegador y pegarla acá. Al guardar, la latitud y la longitud se completan solas. No sirven los enlaces cortos (maps.app.goo.gl) de *Compartir*. |
| Latitud y Longitud | Hacen que el local aparezca en el mapa de "Dónde comprar". Se completan solas con el enlace de arriba; si no, se pueden escribir a mano (ej.: -25.297136 y -57.578614). Un local sin coordenadas figura igual en la lista, pero no en el mapa. |
| Visible en el sitio | Desmarcar si el comercio dejó de vender el producto. |

**Alta:** *Crear nuevo*, completar y *Guardar*.

**Baja:** desmarcar *Visible en el sitio*. Eliminar solo si se cargó por error.

## Blog y novedades

**Menú:** Contenido → Notas (blog y prensa). Sirve para novedades, recetas, consejos de salud, historias de la comunidad y notas de prensa de otros medios.

| Campo | Qué poner |
| --- | --- |
| Título (obligatorio) | Título de la nota. |
| Tipo de nota (obligatorio) | Novedades, Salud y bienestar, Recetas, Comunidad o Prensa. |
| Fecha de publicación | Las notas se ordenan por esta fecha, la más nueva primero. |
| Resumen | Hasta 300 caracteres; aparece en el listado. |
| Imagen de portada | Imagen de la biblioteca de Medios. |
| Contenido | Texto con formato: títulos, listas, enlaces e imágenes. |
| Medio y Enlace a la nota original | Solo para notas de tipo Prensa. |

**Borrador y publicación:** una nota nueva queda como borrador y no se ve en el sitio hasta que se publica. Podés guardar el borrador las veces que quieras y publicar cuando esté lista.

**Consejo:** revisá el texto en español y leé la nota completa una vez antes de publicar.

## Páginas del sitio

**Menú:** Contenido → Páginas. Son las páginas de texto fijo: nosotros, políticas, términos y similares.

| Campo | Qué poner |
| --- | --- |
| Título (obligatorio) | Título de la página. |
| Dirección web | Se genera del título. Cambiarla rompe los enlaces que ya apuntan a la página. |
| Frase de apertura | Texto destacado arriba. |
| Imagen | Opcional. |
| Contenido | Texto con formato. |

Como las notas, las páginas tienen estado borrador o publicada.

## Medios: fotos y archivos

**Menú:** Contenido → Imágenes. Es la biblioteca de todas las fotos y logos. Productos, notas, marcas y páginas eligen sus imágenes de aquí.

**Subir una imagen**

1. Entrá a Imágenes y presioná *Crear nuevo*.
2. Arrastrá el archivo o elegilo desde tu computadora.
3. Escribí la *Descripción de la imagen* (obligatoria): describí lo que se ve.
4. *Guardar*.

**Buenas prácticas**

- Usá fotos nítidas y no demasiado pesadas; el panel genera los tamaños necesarios.
- Poné nombres de archivo claros, por ejemplo yerba-mate-500g.jpg.
- Antes de eliminar una imagen, verificá que no la esté usando ningún producto, nota o página.

## Solicitudes de empresas

**Menú:** Ventas → Solicitudes de empresas. Acá llegan los formularios que completan distribuidores, supermercados y otras empresas desde el sitio. No se crean a mano: se reciben, se leen y se les da seguimiento.

| Campo | Qué muestra |
| --- | --- |
| Empresa, Contacto, Correo, Teléfono, Ciudad | Datos que cargó quien escribió. |
| Tipo de empresa | Distribuidor, supermercado u otro. |
| Mensaje | Lo que escribió la empresa. |
| Estado | Nuevo, Contactado, Cliente, etc. Lo actualiza el equipo. |
| Notas internas del vendedor | Seguimiento interno; no lo ve nadie fuera del panel. |

**Rutina sugerida:** revisar las solicitudes con estado *Nuevo* cada día, contactar a la empresa y cambiar el estado a *Contactado*. Anotar el resultado en las notas internas.

## Página de enlaces (Instagram)

**Menú:** Contenido → Página de enlaces (Instagram). Es la página que se coloca en la biografía de Instagram y se ve en la dirección del sitio seguida de /links.

**Datos de la página**

| Campo | Qué poner |
| --- | --- |
| Página activa | Desmarcar para apagarla. |
| Foto de portada | Opcional. Recomendado: 1600 x 600 px. |
| Título | Si queda vacío, se usa el nombre de la marca. |
| Frase corta debajo del título | Ej: ¿Cómo te ayudamos? |

**Botones**

Se agregan en la lista *Botones* con *Agregar Botón*. Se arrastran para cambiar el orden. Todos tienen el mismo tamaño.

| Campo | Qué poner |
| --- | --- |
| Texto del botón (obligatorio) | Lo que lee la persona. |
| Tipo | Sitio web, WhatsApp, Llamar, Correo, Instagram, Facebook, TikTok, Mapa u Otro enlace. |
| Dirección, número o correo | Según el tipo: un enlace, un número con código de país (595...), o un correo. El panel avisa si el formato no es válido. |
| Mensaje de WhatsApp | Solo para WhatsApp; texto que aparece escrito al abrir el chat. |
| Logo o imagen | Opcional. |
| Color del botón | Blanco, Verde fresco, Dorado, Bordó o Verde hoja. |
| Mostrar como ícono redondo | Lo pasa arriba, sin texto (ideal para WhatsApp o redes). |
| Visible | Desmarcar para ocultarlo sin borrarlo. |

Esta página está pensada para enlaces importantes: redes sociales, WhatsApp, ubicación. No hace falta incluir páginas del propio sitio.

**Medición:** la página está preparada para Google Analytics y registra cada clic en un botón, siempre que el visitante acepte el aviso de cookies y se haya configurado el código de medición.

## Configuración del sitio

**Menú:** Sistema → Configuración del sitio. Es una sola pantalla con los datos generales; no tiene lista, se edita directamente.

| Campo | Qué hace |
| --- | --- |
| Activar tienda (carrito y pagos) | Apagado: el sitio funciona como catálogo e institucional. Solo el Administrador puede cambiarlo. |
| Aviso en la parte superior | Cinta de aviso en todo el sitio (ej: promociones, feriados). Vacío = no se muestra. |
| WhatsApp | Solo números, con código de país. Ejemplo: 595981123456. |
| Teléfono, Correo de contacto, Dirección | Datos de contacto que se ven en el sitio. |
| Retiro en el local | Permite retirar pedidos; se completa con dirección y horarios. |
| Redes sociales | Lista con nombre y enlace de cada red. |
| Texto del pie de página | Frase final de todas las páginas. |

Los cambios se ven en el sitio apenas se guarda.

## Tienda: cómo se compra y cómo se cobra

- La tienda se enciende en *Configuración del sitio* → "Activar tienda" (solo el Administrador). Apagada, el sitio es solo catálogo.
- Un producto se puede comprar si tiene **precio** y no está marcada como agotada. Sin precio se muestra "Consultar precio".
- En *Configuración del sitio* → "Formas de pago de la tienda" cargá los datos para transferir (banco, cuenta, titular, alias/QR). El cliente los ve al confirmar el pedido. Si queda vacío, se le avisa que lo vas a contactar.
- Cada pedido entra en *Pedidos* como "Pendiente de pago". Cuando llega el comprobante, cambiá el estado a "Pagado" y completá la conciliación.
- Los **precios y zonas de envío cargados hoy son de prueba**: reemplazalos desde *Productos* y *Zonas de entrega*.

## Panel de pedidos (pantalla de inicio)

Al entrar al panel de administración lo primero que se ve es el **Panel de pedidos**.

- **Globo rojo en el menú:** junto a "Pedidos" aparece un número con los pedidos que esperan acción antes de poder enviarse (nuevos pendientes de pago + pagados por aprobar). Para el rol Logística cuenta los pedidos aprobados, listos para enviar. Se actualiza solo cada minuto y al volver a la pestaña.
- **Aviso rojo** arriba: lleva directo a la lista de pedidos que esperan acción.
- **Filtros:** atajos de fechas (Hoy, Últimos 7 días, Últimos 30 días, Este mes, Todo), rango Desde/Hasta, estado, entrega (domicilio o retiro), forma de pago, cliente (con cuenta o invitado) y zona de envío. Se aplican con el botón **Aplicar**; **Limpiar** vuelve a los últimos 30 días.
- **Cifras:** cantidad de pedidos, ventas (sin cancelados), ticket promedio y pedidos que esperan acción.
- **Pedidos por estado:** una tarjeta por estado (nuevos, por aprobar, listos para enviar, listos para retirar, en camino, entregados, cancelados). Al hacer clic se abre la lista de pedidos de ese estado.
- **Pedidos por día**, desglose por entrega, forma de pago, cliente y zona, y los productos más pedidos.
- Cada rol ve solo lo que le corresponde: Logística no ve montos ni formas de pago, y solo pedidos aprobados en adelante.

Las fechas se toman en hora de Paraguay.

## Preparación de pedidos

En el menú de la izquierda, **Inicio** lleva al panel de pedidos y, al final del menú, el grupo **Logística / Envíos** tiene **Preparación de pedidos**: la lista de trabajo del equipo de logística.

- **Por preparar**: todos los pedidos aprobados. Cada tarjeta muestra qué armar (cantidades y productos), la dirección o si retira en el local, y el teléfono ya verificado con botones de **WhatsApp** y **Llamar**.
- **En camino o para retirar**: los pedidos ya enviados o listos para retirar.
- Los botones de cada tarjeta cambian el estado (enviado, listo para retirar, entregado) y se puede guardar la nota de envío (guía, courier).
- Los pedidos aprobados **siguen apareciendo** en la lista general de Pedidos.
- El mensaje de WhatsApp saluda con nombre y apellido e incluye la fecha del pedido, los productos con cantidades y el total.
- Si el teléfono de un pedido no sirve para WhatsApp, aparece una advertencia y los botones no se muestran: corregir el número en el pedido.

## Pedidos y zonas de entrega

Estas secciones se usan cuando la tienda está activada (*Configuración del sitio*). Con la tienda apagada, el sitio solo muestra el catálogo.

**Zonas de entrega** (Ventas → Zonas de entrega)

| Campo | Qué poner |
| --- | --- |
| Zona (obligatorio) | Ej: Asunción centro. |
| Costo de envío en guaraníes (obligatorio) | Solo el número. |
| Tiempo estimado | Ej: 24 a 48 horas. |
| Disponible | Desmarcar para dejar de ofrecer la zona. |

**Pedidos** (Ventas → Pedidos)

Cada pedido tiene número propio, datos del cliente (nombre, teléfono, correo, RUC o C.I. y razón social para la factura), los productos con cantidad y precio, la entrega y el cobro.

| Estado | Qué significa |
| --- | --- |
| Pendiente de pago | El cliente hizo el pedido pero todavía no pagó. |
| Pagado | Se recibió el cobro. |
| Aprobado (listo para enviar) | Revisado; Logística ya lo ve para preparar el envío. |
| Enviado | Salió con el courier. |
| Listo para retirar | Esperando al cliente en el local. |
| Entregado | Pedido cerrado. |
| Cancelado | No se concreta. |

**Cobro y conciliación:** en cada pedido se registra el medio de cobro, el código de transacción que informa la pasarela, la fecha y el monto cobrado. Cuando el cobro coincide con el extracto bancario se marca *Conciliado*, con una nota si hace falta.

**Contactar a quien compró:** al abrir un pedido, arriba queda fija una barra con el nombre y el teléfono del cliente y los botones **WhatsApp** (abre el chat con un saludo ya escrito) y **Llamar**. Se ve en todos los roles que pueden abrir pedidos.

**Aprobar un pedido** (Administración y Gestión): cuando el cobro está verificado (llegó la transferencia, el pago por la pasarela o el pedido es contra entrega), en la barra de arriba se toca **Aprobar pedido**, se marca *Verifiqué que el cobro llegó* y se confirma. El pedido pasa a *Aprobado (listo para enviar)*, queda registrado quién lo aprobó y cuándo (sección *Aprobación del pedido*) y Logística lo ve en su lista para prepararlo. Se puede agregar una nota (por ejemplo, el comprobante). Si hay cambios sin guardar en el pedido, primero hay que guardarlos. Un pedido ya aprobado no se puede aprobar dos veces.

**Envío:** Logística anota la guía o el courier en *Nota de envío* y avanza el estado a *Enviado*.

## Clientes (cuentas de la tienda)

**Menú:** Ventas → Clientes. Son las personas que crearon una cuenta en la tienda. Las cuentas se crean solas desde el sitio (en `/es/cuenta/registro`); el personal no las da de alta a mano. Quien compra sin cuenta no aparece acá, solo en *Pedidos*.

| Campo | Qué muestra |
| --- | --- |
| Correo | Es el usuario con el que el cliente ingresa. |
| Nombre y apellido, Teléfono o WhatsApp | Contacto para coordinar la entrega. |
| Datos de facturación | Tipo de documento, número de C.I. o RUC y razón social para la factura. |
| Direcciones de entrega | Hasta 10 por cliente, con referencia y zona de entrega. |
| Idioma preferido | Idioma en el que el cliente usa el sitio. |
| Aceptó la política de privacidad | Fecha y hora de aceptación. No se puede modificar. |
| Acepta novedades | Si aceptó recibir promociones, y desde cuándo. Solo se le escribe a quien lo aceptó. |
| Notas internas | Solo las ve el personal. El cliente no. |

**Qué puede hacer cada rol:** Administrador y Gestor ven y corrigen los datos; Visor solo mira; solo el Administrador elimina cuentas. Logística no tiene acceso.

**Situaciones habituales**

- **El cliente olvidó su contraseña:** debe usar el enlace *Olvidé mi contraseña* del sitio. El personal nunca ve ni puede cambiar contraseñas.
- **El cliente pide corregir un dato:** puede hacerlo él mismo en *Mi cuenta*. Si pide ayuda, el Gestor lo corrige acá.
- **El cliente pide dar de baja su cuenta:** puede hacerlo desde *Mi cuenta*. Si lo pide por otro medio, el Administrador elimina el registro. Sus pedidos anteriores se conservan como registro de la tienda.
- **Ver las compras de un cliente:** en *Pedidos*, cada pedido indica a qué cuenta pertenece.

**Cuidado con los datos:** son datos personales protegidos por la Ley 7593/2025. No se copian a planillas ni a chats, y se usan solo para gestionar las compras. Para enviar novedades, solo a quienes marcaron que aceptan recibirlas.

## Usuarios, roles y registro de actividad

Estas dos secciones están en el grupo Sistema y solo las ve el Administrador.

**Usuarios**

| Campo | Qué poner |
| --- | --- |
| Correo | Es el usuario con el que se ingresa. |
| Contraseña | La define el Administrador al crear la cuenta; cada persona puede cambiarla luego. |
| Nombre | Nombre de la persona. |
| Rol | Administrador, Gestor, Visor o Logística (ver tabla del Resumen general). |

**Alta de una persona:** *Crear nuevo* → correo, contraseña, nombre y rol → *Guardar*.

**Baja:** si alguien deja la empresa, eliminar su usuario ese mismo día.

Para cada persona asigná el rol más bajo que le alcance para trabajar.

**Registro de actividad**

Es una lista de consulta: muestra quién cambió qué y cuándo (fecha, usuario, sección, acción y detalle). No se edita. Sirve para aclarar quién modificó un precio o una nota.

## Preguntas frecuentes y qué hacer si algo falla

| Situación | Qué hacer |
| --- | --- |
| No me deja ingresar | Revisá el correo y la contraseña, y que las mayúsculas estén bien. Si sigue, pedí a un Administrador que restablezca tu contraseña. |
| No veo una sección del menú | Tu rol no tiene acceso. Pedile al Administrador que revise tu rol. |
| Guardé un cambio y no se ve en el sitio | Verificá que el registro esté publicado (no en borrador) y que *Visible en el sitio* esté marcado. Actualizá la página del sitio. |
| No puedo guardar | Hay un campo obligatorio vacío o con formato inválido; el panel lo marca en rojo. |
| Borré algo por error | Avisá enseguida a un Administrador; se puede consultar el Registro de actividad y la copia de seguridad. |
| Una foto no aparece | Confirmá que está subida en Imágenes y elegida en el registro. |
| El botón de WhatsApp no abre el chat | El número debe tener solo dígitos y código de país (595...). |

**Antes de empezar a cargar contenido real:** cambiá tu contraseña inicial y usá una larga y única. Nunca compartas tu usuario con otra persona; cada una debe tener el suyo.

## Novedades de la ronda 5 (tienda y pedidos)

- **Compra mínima:** en *Configuración del sitio* hay un campo *Compra mínima* (por defecto Gs. 100.000). Si el carrito no llega, el cliente ve cuánto le falta y no puede confirmar.
- **Teléfono para recibir comprobantes:** en *Configuración del sitio → Pagos*. Es el número de WhatsApp al que el cliente envía el comprobante; si está vacío se usa el WhatsApp general.
- **Pedidos → Productos del pedido:** ahora se ven en una tarjeta compacta (cantidad × producto, precio y subtotal). Se quita un producto con el ícono de basurero; para agregar o corregir se abre *Agregar o corregir productos*. Los cambios se aplican al **Guardar**.
- **Preparación de pedidos:** abre dentro del panel (con el menú). El rótulo de cada tarjeta distingue *Retiro en el local* (violeta) de *Envío a domicilio* (azul).
- **Productos del sitio:** el selector de cantidad y los botones agregar / actualizar / quitar quedan a la derecha del producto; el teléfono tiene selector de país con banderas.

- **Pedidos de retiro** se marcan en naranja en *Preparación de pedidos* (los envíos, en azul).
- **Agregar o corregir productos:** los ítems aparecen cerrados con el título «Item 01 - NOMBRE DEL PRODUCTO»; el botón verde *Añadir Item* suma productos.
- **Nosotros:** incluye la sección *Audiovisual Jerovia* con los videos en español e inglés.
