# Cómo crear el sitio de otra empresa

Todo lo propio de una empresa está en `brand/<id>/`. El resto del código no se toca.

## Pasos
1. Copiar la carpeta `brand/_template` como `brand/<nueva-empresa>` (sin espacios ni tildes).
2. En `index.ts`: cambiar `id` (igual al nombre de la carpeta), nombres, menú, funciones activas (`features`) y textos (`copy`).
3. En `theme.css`: colores y tipografías.
4. En `assets/`: logo y fotos; el nombre del logo se indica en `brand.logo.file`.
5. En `seed.ts`: contenido de partida (categorías, productos, etc.). También se puede cargar todo desde el panel.
6. Activar: `npm run brand:use -- <nueva-empresa>`.
7. Base nueva: borrar `data/` (desarrollo) o apuntar `DATABASE_URL` a otra base, y ejecutar `npm run seed`.
8. Revisar con `npm run typecheck` y `npm run build`.

## Quitar o poner funciones
En `features`: `shop`, `blog`, `b2b`, `storeLocator`, `certifications`, `whatsapp`. La tienda además tiene
un interruptor en el panel (Configuración del sitio), que solo puede cambiar el Administrador.

## Botón principal del menú
`headerCta` (en `index.ts`) indica qué enlace del menú se muestra como botón destacado al final de la barra, por ejemplo `'/puntos-de-venta'`. Si se omite, todos los enlaces se ven iguales. El menú marca la página actual con una hoja (verde de la marca, `--leaf`) y, al bajar por la página, se achica y muestra una sombra.

## Carrusel de la portada
Las diapositivas de la portada se administran desde el panel (global `home-carousel`). En `seed.ts` de la marca, `homeCarousel` define las diapositivas iniciales; solo se cargan si el panel todavía no tiene ninguna.

## Favicon
Colocar en `brand/<marca>/assets` el favicon (`favicon.svg`, `favicon-32.png`) y el ícono para iPhone (`apple-touch-icon.png`, 180×180) y declararlos en `icons` dentro de `brand/<marca>/index.ts`. Si la marca no define `icons`, el sitio no muestra ícono propio.

## Panel de administración
El logo de la pantalla de ingreso y el ícono de la barra superior salen de la marca activa (`logo` e `icons` en `brand/<marca>/index.ts`). El menú lateral usa colores neutros (fondo claro y grupos en azul pizarra), iguales para cualquier empresa; solo toma la fuente de la marca. Los estilos propios están en `src/app/(payload)/custom.css`; los componentes, en `src/components/admin/`. Si se agrega un componente nuevo al panel, ejecutar `npx payload generate:importmap`.

## Idiomas
Poner `enabledLocales: ['es', 'en', 'pt']`. El selector de idioma aparece solo en el encabezado cuando hay dos o más idiomas.

Las traducciones de los datos de partida se escriben en `brand/<marca>/translations.ts` (un diccionario: texto en español → inglés y portugués). `fillL10n` (en `brand/translate.ts`) las aplica a la marca, los textos y el seed, y `npm run seed` completa solo lo que esté vacío en cada idioma, sin pisar lo editado en el panel. Después se pueden corregir desde el panel (cada campo traducible tiene pestañas por idioma).

## Una instalación por empresa
Cada empresa debe tener su propia base de datos, su `.env` y su despliegue. Nunca se mezclan datos entre empresas.
