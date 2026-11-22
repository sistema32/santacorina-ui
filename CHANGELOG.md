# Changelog

## 0.21.0 — sin publicar — modo oscuro real

El fix anterior (fondo de `.demo` siempre blanco en `guia/guia.css`)
tapó el síntoma, no la causa — correcto: el paquete en sí no tenía
modo oscuro. `--color-navy`/`--color-texto`/`--color-tenue` y 47
fondos `"#fff"` literales estaban pensados solo para una página clara;
cualquier consumidor real (no solo la guía) que pusiera un componente
sobre un fondo oscuro tenía el mismo problema.

Se agrega modo oscuro real, mismo mecanismo que ya usan
`--color-*`/`--font-sans` (variables CSS, `prefers-color-scheme` +
`data-theme="dark"`/`"light"` para forzarlo a mano):

- **`--color-superficie`** (nuevo) — reemplaza los 47 `"#fff"`
  literales de tarjeta/modal/cajón/menú/calendario/popover/combobox/
  inputs/paginación/etc.
- **`--color-titulo`** (nuevo) — separa el rol de "texto de título" de
  `--color-navy`, que se deja fijo (sigue siendo el fondo de marca de
  `.lateral`/`.hero`/`.toast`, no reactivo a propósito).
- **`--color-fondo`/`-texto`/`-tenue`/`-borde`/`-gris-fondo`** (ya
  existían) pasan a ser reactivos al tema.
- **4 pares fondo+texto por tono** (`--color-azul/verde/naranjo/rojo-fondo`/
  `-texto`) — consolidan ~8 literales casi duplicados que repetían el
  mismo color con variaciones de 1-3 unidades RGB entre `.etiqueta`/
  `.chip`/`.avatar`/`.insignia-icono`/`.aviso`/`.aviso-pagina`.
- Mismo tratamiento para los usos de `--color-rojo`/`-naranjo`/
  `-azul-oscuro` como texto suelto (breadcrumb, contador de
  caracteres, links de "cambiar") — redirigidos a sus pares `-texto`
  reactivos en vez de aclarar el color base (que rompería su uso como
  fondo de badge con texto blanco fijo).
- `guia/guia.css`: se revierte el parche anterior — `.demo` vuelve a
  `var(--doc-surface)`, ya no hace falta fijarlo en blanco.

Verificado con un cálculo real de contraste WCAG (no a ojo) para cada
combinación texto/fondo nueva en ambos temas — todas ≥4.5:1, varias
sobre 7:1. Playwright confirma además que ningún texto queda con el
mismo color que su fondo (el bug original) en tarjeta/kpi/etiqueta/
chip/avatar/aviso/campo/breadcrumb/lista-grupo, en los dos temas.

## 0.20.0 — sin publicar

Otra revisión externa del catálogo (`README.md#componentes-incluidos`)
priorizó 3 piezas para pantallas de gestión. Confirmé cada gap contra
`src/components.ts` antes de agregar nada:

- **`[aria-invalid="true"]` + `.campo-error`** — borde rojo en el
  control + mensaje junto a él. Complementa `.resumen-errores`
  (0.16.0): el resumen enlaza al campo, esto muestra por qué. Se
  encontró y corrigió un problema de especificidad al verificar: un
  selector de atributo solo (`[aria-invalid=true]`, especificidad
  0,1,0) pierde contra `input[type=text]` del bloque de controles
  (0,1,1) sin importar el orden — el borde se quedaba gris. Se
  corrigió calificando el selector con el elemento
  (`input[aria-invalid='true'], select[...], textarea[...]`).
- **`.tabla-cabecera-fija` / `.tabla-compacta`** — encabezado fijo
  (`position: sticky`, reusa `--z-flotante` de 0.18.0 en vez de un
  número nuevo) y densidad compacta, para presupuestos/facturas
  largas dentro de un contenedor con scroll vertical.
- **`.barra-filtros`** — agrupa `.buscador` + campos sueltos + `.chip`
  (todos ya existentes, sin cambios) + "Limpiar filtros" en una fila;
  en móvil pasa a columna sin reordenar los hijos (mismo criterio que
  el resto del paquete: layout nuevo sobre componentes que ya existen,
  no una reinvención).

Quedan fuera, como el propio reporte sugería para después: acciones
masivas en tablas y estilos de impresión.

Verificado con Playwright: scroll vertical real dentro de una tabla
confirma que el `thead` se queda fijo (`bounding_box()` sin cambiar),
`.tabla-compacta` reduce el padding medido, y `.barra-filtros` pasa a
columna a 375px conservando el orden de sus hijos.

## 0.19.0 — sin publicar — fixes de una revisión externa

Alguien revisó `main` en el commit `2162f31` (v0.18.0) y reportó 6
hallazgos con evidencia reproducible. Verifiqué cada uno contra el
código real antes de tocar nada — los 6 eran reales:

1. **Tipos rotos (alta).** `import type { CSSRuleObject } from
   "tailwindcss/types/config"` — ese path es de Tailwind v3 y no
   existe en v4 (confirmado: `tsc` tira `TS2307` contra el
   `tailwindcss` instalado de verdad). Además el propio `dist/index.d.ts`
   importaba un chunk (`resolve-config-*.mjs`) que el bundler de tipos
   de tsup nunca emitía, rompiendo `tsc` en cualquier proyecto que
   instalara el paquete. Arreglado con un tipo local mínimo
   (`CssEnJs`) en vez de depender de tipos internos/no públicos de
   Tailwind; `src/plugin.ts` necesitó además una anotación explícita
   del tipo exportado para evitar un `TS2742` relacionado. Verificado
   de punta a punta: `npm pack` real + instalar el tarball en un
   proyecto limpio + `tsc --noEmit` sobre un `import` real — pasa sin
   errores.
2. **Combobox podía enviar un valor distinto al mostrado (alta).**
   Si se escribía texto libre sin elegir una opción, `select.value`
   quedaba en la última opción elegida mientras el input mostraba otro
   texto. Se agregó un handler de `blur`: si el texto coincide
   exactamente con una opción, la elige; si no, el input vuelve al
   texto de la opción que sigue seleccionada — nunca queda un texto en
   pantalla que no corresponda al value real.
3. **Dos grupos de `.tabs` interferían entre sí (media).** La
   búsqueda de paneles al hacer clic abarcaba todo el documento, así
   que cambiar de pestaña en un grupo podía quitarle `.activo` al
   panel de otro grupo completamente distinto. Se acotó la búsqueda a
   los `data-tab` que declara ese mismo grupo.
4. **El calendario podía saltarse un mes (media).** `mesVisible` se
   guardaba con el día real (ej. 31); `setMonth()` sobre un día 31
   desde marzo cae en mayo (abril no tiene 31 días). Se normaliza a
   guardar siempre el día 1 del mes visible.
5. **`iniciarTodo()` registraba listeners duplicados si se llamaba
   más de una vez (media).** Nuevo módulo compartido
   `src/js/una-vez.ts` (`primeraVez(el, nombre)`) aplicado a los 18
   `iniciar*`: cada uno ahora es idempotente, un clic dispara su
   handler una sola vez sin importar cuántas veces se haya llamado
   `iniciarTodo()`/la función individual sobre el mismo DOM.
6. **`npm run dev:guia` servía sin el CSS/JS del paquete (media).**
   `npx serve guia` fijaba la raíz del servidor en `guia/`, y las
   páginas referencian `../dist/...` — fuera de los límites de esa
   raíz, 404 real. Se cambió a servir desde la raíz del repo
   (`npx serve .`), igual que ya funcionaba abriendo los archivos
   directo con `file://`.

Verificado todo con Playwright real (no solo revisión de código):
blur revierte/adopta el value del combobox correctamente, un grupo de
tabs no le quita `.activo` al panel de otro grupo, elegir el día 31 y
avanzar de mes dos veces da meses secuenciales sin salto, y llamar
`iniciarTodo()` dos veces seguido de un clic en un encabezado
ordenable dispara exactamente un evento `santacorina:ordenar` (antes
disparaba dos, uno ascendente y uno descendente, en la misma pasada).

## 0.18.0 — sin publicar

Feedback sobre la guía: faltaban referencias (ej. `.avatar` existe
hace rondas y no se encontró navegando) y el archivo era demasiado
grande (1306 líneas en uno solo). Se dividió `guia/` en 5 páginas —
ver nota en el README, sección Desarrollo (sin bump de versión esa
parte, `guia/` no está en `package.json["files"]`).

Además se pidió verificar componentes de Bootstrap que faltaban:
carousel, container, album, gutters, grid, z-index, textarea, label,
form control, avatar. Revisados uno por uno:

**Ya cubiertos, sin CSS nuevo** (solo quedan mejor referenciados en el
índice nuevo): Avatar (`.avatar`, 0.6.0), Textarea (selector `textarea`),
Label (`.campo label`), Form control (`input[type=...]/select/textarea`
ya es el equivalente exacto, con otro nombre de capa), Album (es una
página de ejemplo de Bootstrap, no un componente — se arma combinando
`.tarjeta` + `.columnas`/`.fila`, que ya existen).

**Gaps reales, agregados esta ronda:**

- **`.carousel`** + `iniciarCarruseles`/`avanzarCarrusel` — en 0.11.0
  se dejó fuera a propósito ("sin caso de uso en un portal de compras
  públicas"). Se revierte esa decisión: ahora se pide como paridad de
  framework, no por un caso de uso de `sgp`, mismo criterio preventivo
  que `.hero`. Sin autoplay por defecto.
- **`.contenedor` / `.contenedor-fluido`** — equivalente de
  `.container`/`.container-fluid` de Bootstrap. Se llama distinto a
  propósito: Tailwind v4 ya genera su propia utilidad `.container` en
  `@layer utilities`, que le ganaba a la nuestra (se encontró al
  verificar con Playwright — `max-width` nunca se aplicaba, quedaba en
  1280px en vez de 1150px).
- **Gutters en `.columnas`** (`.gutters-0`/`.gutters-chico`/`.gutters-grande`)
  — sin crear un segundo sistema de grid paralelo, son modificadores
  del mismo `.columnas` que ya existía.
- **Escala de z-index** — había 9 valores sueltos
  (100/200/1000/1150/1200/1300/9000/9500/9999) sin ninguna relación
  documentada; ahora son variables CSS (`--z-*`) + 5 utilidades
  públicas (`.z-flotante`/`.z-flotante-alto`/`.z-cajon`/`.z-modal`/`.z-toast`).

Verificado con Playwright: `.contenedor` realmente topa en 1150px (no
en el breakpoint de Tailwind), los 3 gutters dan el gap correcto, el
carousel responde a clic/indicador/teclado con wrap-around, y las 5
páginas de la guía cargan sin errores de JS con el nav, el selector de
tema, el nav móvil y los botones de copiar funcionando en todas.

## guia/index.html — demos interactivos + copiar código (sin cambio de versión)

No toca `dist/` ni nada en `package.json["files"]` — `guia/` es una
herramienta de desarrollo local (`npm run dev:guia`), no se publica.

Auditando la guía encontré que **no cargaba ningún `<script>`**: todos
los demos interactivos (popover, cajón, toggletip, combobox, medidor
de clave, tabla ordenable, colapsar) se veían pero no respondían a
clics — HTML estático con las clases correctas, nada más. Y ningún
bloque de código tenía botón de copiar.

- Se agregó `<script src="../dist/js.global.js">` — la mayoría de los
  demos ya tenía los atributos `data-*` correctos y quedaron vivos
  solo con cargar el script.
- Se encontró y arregló un demo roto de verdad: el de `.cajon` solo
  tenía el botón disparador, nunca el panel ni el fondo — hacer clic
  no hacía nada porque el elemento `[data-cajon="g-filtros"]` no
  existía en el DOM.
- `.resumen-errores` se cambió para empezar oculto detrás de un botón
  "Simular envío fallido" — si quedaba visible desde el `<body>`, le
  robaba el foco a la página apenas cargaba (demo más honesta además:
  en la vida real tampoco aparece antes de un envío fallido).
- Botón "Copiar" en cada `pre.codigo`, usando `copiarAlPortapapeles` y
  `mostrarToast` que el propio paquete ya expone — sin clipboard logic
  nueva.
- Botón "☰ Componentes" para el nav en móvil — antes desaparecía por
  completo bajo 760px sin ningún reemplazo.

Verificado con Playwright: popover/cajón responden a clic, el resumen
de errores no roba foco hasta el clic en "Simular", el botón copiar
deja el texto real en el portapapeles y muestra el toast, y el nav
móvil se abre con la hamburguesa.

## 0.17.0 — sin publicar — cambio incompatible de markup

El usuario preguntó si podíamos mejorar cómo se llaman las clases CSS
y eligió: pasar las variantes de diseño (tono de color, tamaño) de
clase suelta a atributo `data-*`, el mismo criterio que ya usan los
componentes interactivos más nuevos (`data-ordenable`, `data-toggletip`).

Antes de migrar todo, audité qué se rompería: confirmé con `grep` en
`sgp/frontend/src` que, aunque `style.css` ya importa
`@plugin "@sistema32/santacorina-ui"`, ningún `.vue` usa hoy las clases
`etiqueta`/`chip`/`avatar`/`insignia-icono`/`kpi`/`luz`/`insignia`/
`pastilla` (0 coincidencias cada una). No había markup real que
romper, así que se migraron los 9 componentes completos:

- `.kpi`, `.etiqueta`, `.pastilla`, `.aviso`/`.aviso-pagina`, `.luz`,
  `.chip`, `.avatar`, `.insignia-icono`, `.insignia` — el tono pasa de
  clase (`.azul`) a `data-tono="azul"`; el tamaño (`.avatar`,
  `.insignia-icono`) pasa a `data-tamano="chica"`.

**Antes:** `<span class="etiqueta azul">ACEPTADA</span>`
**Ahora:** `<span class="etiqueta" data-tono="azul">ACEPTADA</span>`

No se tocó vocabulario (los valores son los mismos), ni las clases de
estado que alterna el propio JS (`.visible`/`.activo`/`.abierta`...) —
esas no ganan nada con el cambio y hubiera obligado a reescribir cada
módulo de `/js`. Tampoco `.boton.secundario`/`.peligro` ni
`.insignia.punto` (no son tono ni tamaño).

Verificado: `grep` confirma cero selectores de clase viejos a medio
migrar en `src/components.ts`; captura de pantalla de los 9
componentes con `data-tono`/`data-tamano` confirmando que se ven
exactamente igual que antes (cambio de mecanismo, no de diseño).

## 0.16.0 — sin publicar

Investigué qué componentes faltaban comparando el inventario actual
contra tres sistemas de diseño de gobierno reales ([GOV.UK Design
System](https://design-system.service.gov.uk/), [USWDS](https://designsystem.digital.gov/)
— ya es la fuente de Public Sans — y [Carbon Design System](https://carbondesignsystem.com/)).
La mayoría de sus componentes ya existían con otro nombre; seis eran
gaps reales:

- `.resumen-revision` + `.resumen-revision-item` (`.cambiar`) — de
  GOV.UK "summary list"/"check your answers", para la pantalla de
  revisión antes de enviar (cierra el flujo de `.asistente`/`.paso`).
- `.resumen-errores` + `iniciarResumenErrores` — de GOV.UK "error
  summary", el patrón de accesibilidad de formularios mejor
  documentado que encontré: caja al inicio del formulario que recibe
  el foco automáticamente y enlaza cada error a su campo.
- `fieldset.campo-grupo` + `legend` — faltaba el estilo del HTML
  nativo para agrupar varios `.campo-check` bajo una pregunta.
- `.aviso-pagina` — de GOV.UK "notification banner"/USWDS "site
  alert": franja persistente bajo la cabecera, distinta de `.aviso`
  (por tarjeta) y `.toast` (transitorio).
- `[data-toggletip]` + `.toggletip-panel` + `iniciarToggletips` —
  gap real de accesibilidad: `[data-tooltip]` solo responde a hover,
  sin soporte en pantallas táctiles. Reutiliza el mismo cuidado de
  "Escape global" que ya se aprendió con `.popover-panel` (verificado
  con Playwright: cerrar un modal con Escape no debe afectar un
  toggletip ya cerrado), y entra en la misma corrección de panel-
  flotante-angosto de 0.15.0 (`@media (max-width: 600px)`).
- `th[data-ordenable]` + `iniciarTablasOrdenables` — de Carbon "data
  table": flecha + `aria-sort`, dispara `santacorina:ordenar` — el
  consumidor reordena sus propias filas, mismo criterio que
  `.buscador`/`.combobox`/`.zona-arrastre`.

Fuera de alcance: un selector de chips de multiselección (Carbon
"Multiselect") — componente interactivo bastante más grande, se
planifica aparte si se pide.

Verificado con Playwright: foco automático en `.resumen-errores` y
foco en el campo destino al hacer clic en un error; apertura/cierre
de toggletip por clic y por clic-afuera; Escape con un modal abierto
no reabre ni afecta un toggletip ya cerrado; clic en
`th[data-ordenable]` alterna `aria-sort` y dispara el evento con el
detalle correcto.

## 0.15.0 — sin publicar

Auditoría de responsividad: no se agregó ningún componente, se revisó
el inventario de breakpoints ya existente (`900px`/`1150px`/`560px`/
`600px`) buscando el mismo tipo de bug que ya se había encontrado y
arreglado una vez para `.menu-panel` (panel flotante anclado con ancho
fijo que se sale del viewport en móvil), para ver si quedó aplicado en
sus hermanos.

- `.calendario-panel` y `.popover-panel` se salían del viewport bajo
  600px — exactamente el mismo bug que `.menu-panel` ya tenía
  documentado y arreglado, nunca replicado en estos dos (agregados
  después). Ahora los tres comparten la misma hoja fija
  (`position:fixed; inset:auto 16px 16px; width:auto`) bajo 600px.
  Importante para el propio código del paquete: la regla de media
  query tuvo que moverse a **después** de las reglas base de los tres
  paneles en `src/components.ts` — como todas viven en el mismo layer
  (`addBase`) con igual especificidad, una regla sin media que aparece
  más abajo en el CSS generado le gana a una regla con media que
  aparece más arriba, aunque la media sí aplique.
- `.grupo-botones` no tenía manejo de desborde — con 4+ botones en un
  contenedor angosto se salía sin ninguna señal visual. Ahora usa
  `overflowX:auto` (mismo criterio que `.tabla-scroll`), para no romper
  el borde unido de "pastilla" que tendría con `flexWrap:wrap`.
- `.hero` usaba relleno pensado para escritorio (`38px 36px`, h1 a
  26px) — bajo 560px (breakpoint ya existente, fusionado, no uno
  nuevo) baja a `24px 20px` / 21px.

Verificado con Playwright a 360px de ancho: `bounding_box()` de los
tres paneles flotantes dentro de los límites del viewport,
`scrollWidth > clientWidth` en `.grupo-botones` confirmando el scroll
horizontal en vez de desborde.

## 0.14.0 — sin publicar

Primera vez que se revisa `acepta/frontend` (la app principal del repo,
no `sgp`) en vez de `sgp/web`. Un agente de exploración encontró que
varios patrones ya existían con otro nombre (`.status-tag`/`Pill.vue` ↔
`.pastilla`, `.metric-card` ↔ `.kpi`, `DetailGrid.vue` ↔ `.ficha`) — esos
no se tocaron. Seis sí eran nuevos, confirmados con archivo/línea real:

- `.insignia-icono` — de `IconBadge.vue` (23 usos). El propio componente
  ya documentaba que reemplazó "~6 variantes casi idénticas".
- `.tarjeta-accion` — de `.home-section-card`/`.process-card`.
- `.pildora-archivo` — de `.file-pill` (21 usos).
- `.zona-arrastre` + `.lista-documentos`/`.documento-fila` +
  `iniciarZonasArrastre` — de `EdicionFacturasView`/
  `v2/views/FacturasView`. El JS solo alterna `.activa`; la subida real
  sigue siendo de cada pantalla.
- `.calendario-estado` + `.punto-estado` — de `CalendarioScrapingView.vue`,
  un heatmap de actividad, **no** una variante de `.calendario` (ese es
  explícitamente un selector de fecha, propósito distinto).
- `td strong, td small` en el bloque de tabla existente — 41
  ocurrencias reales, no era una clase nueva sino una regla faltante.

## 0.13.0 — sin publicar

Migración pendiente del mismo tipo que `.cabecera`/`.lateral` en su
momento: componentes reales de producción (`portal.css`) que nunca se
extrajeron por "específicos de una pantalla" cuando en realidad los usa
toda la plataforma.

- `.paso` (sobre `[data-paso]`) + `.acciones` + `irAPaso`/
  `iniciarAsistentes` — asistente de varios pasos, trasladado de
  `portal.css:43-54` (5 pantallas reales). La fila de chips reutiliza
  `.stepper`/`.stepper-paso` ya existente (`.completado` ≡ el "listo" de
  producción). Avanzar sigue siendo decisión de cada pantalla — el
  paquete no auto-avanza un botón "Continuar", solo resuelve
  mostrar/ocultar y dejar volver a un paso ya completado.
- `.rastreador` + `.rastreador-item` (`.hecho`/`.actual`/`.pendiente`) —
  trasladado de `.pasos-compra` en `portal.css:230-248` (usado en
  `compras_dashboard`/`compras_solicitud`), con nombre genérico.
- `.validacion` + `.validacion-txt` — trasladado de `portal.css:56-62`
  (6 pantallas), siempre junto a `.luz`.
- `.detalle-tecnico` — trasladado de `portal.css:63-67`, sobre
  `<details>` nativo.
- `.total-caja` — trasladado de `portal.css:68-71`.
- `.col-ancha` — nuevo, para usar dentro de `.columnas`/`.fila`/
  `.masonry` (hasta ahora cada pantalla necesitaba un `style` inline;
  incluso la propia vitrina de 0.11.0 tenía su propia `.sc-ancho`
  interna, nunca empaquetada).

## 0.12.0 — sin publicar

**Accesibilidad (ARIA + manejo de foco)** — cero atributos ARIA en todo
el paquete hasta ahora, pese a tener 7 componentes interactivos propios;
`sgp` es una plataforma de un servicio público, donde esto no es
opcional. Nuevo `src/js/foco.ts` (`atraparFoco`, compartido por modal y
cajón: atrapa Tab mientras está abierto, devuelve el foco al cerrar).

- `.modal`/`.cajon` — `role="dialog"` + `aria-modal`, foco atrapado y
  devuelto.
- `.tabs` — `role="tablist"`/`"tab"` + `aria-selected`; paneles con
  `role="tabpanel"` + `aria-hidden`.
- `[data-popover]` — `aria-haspopup`/`aria-expanded`, `role="dialog"` en
  el panel.
- `.combobox` — patrón ARIA 1.2 completo (`combobox`/`listbox`/`option`
  + `aria-activedescendant`).
- `[data-colapsar]` — `aria-expanded`/`aria-controls`.
- `.acordeon`/`.menu` quedan sin cambios — ya son accesibles de fábrica
  por ser `<details>`/`<summary>` nativos.

**Bug real encontrado y corregido durante la verificación**: el listener
de `Escape` de `iniciarPopovers` no comprobaba si *su propio* panel
estaba abierto — así que cerrar un `.modal` con Escape en una pantalla
que también tenía un popover (cerrado) igual le devolvía el foco al
trigger de ese popover. Se detectó instrumentando el DOM con un log de
`focusin`/`keydown` (Patchright no expone `console.log` de la página).
Los cuatro componentes con Escape global ahora comprueban su propio
estado antes de actuar.

**Autochequeo** — `scripts/autocheck.mjs` (`npm run check`), sin
framework: verifica `formato.*` contra los valores reales de
`sgp/CLAUDE.md` y que `debounce` agrupe llamadas seguidas.

## 0.11.0 — sin publicar

Revisión de paridad contra **Bootstrap 6** (alpha real, lanzada
8-oct-2026) — qué ya teníamos, qué faltaba con conexión real a `sgp` (se
agregó) y qué se dejó fuera a propósito.

Ya cubierto antes de esta revisión: Alert→`.aviso`, Avatar, Badge→`.insignia`,
Breadcrumb, Button→`.boton`, Card→`.tarjeta`, Dialog→`.modal`, Menu,
Pagination, Placeholder→`.skeleton`, Progress, Spinner→`.cargando`,
Stepper, Tab, Toasts, Tooltip, Chips, Datepicker→`.calendario`,
Checkbox/Radio/Switch/Range.

Agregado esta ronda:

- `.grupo-botones` — botones de acción unidos.
- `.lista-grupo` + `.lista-grupo-item` — lista vertical clicable.
- `.grupo-campo` — prefijo/sufijo en un input (conexión real: montos en
  pesos en cada tabla de la plataforma).
- `[data-popover]` + `iniciarPopovers` — tooltip con contenido rico,
  por clic.
- `[data-colapsar]` + `iniciarColapsables` — collapse genérico (a
  diferencia de `.acordeon`, botón y panel en cualquier parte del DOM,
  paneles independientes entre sí).
- `.cajon` + `iniciarCajones` — generaliza el panel deslizante de
  `.lateral` para otro uso (ej. filtros).
- `.combobox` + `iniciarCombobox` — select con autocompletado.
  Encontrado y corregido antes de terminar: el filtro no encontraba
  "República" al escribir "repub" (sin tilde) — se normalizan acentos
  en ambos lados de la comparación (`normalize("NFD")`), algo
  especialmente relevante en español.
- `.medidor-clave` + `iniciarMedidorClave` — heurística simple de
  fuerza de contraseña (conexión real: `sgp/CLAUDE.md` documenta el
  flujo de hash scrypt + regenerar claves).

Deliberadamente fuera: Carousel (sin caso de uso en un portal de
compras públicas), Navbar/Toggler genérico (ya se decidió que `sgp` usa
sidebar, no barra superior), Nav overflow y Scrollspy (nicho, sin caso
de uso concreto), Floating labels (reemplazaría un patrón de formulario
ya consistente, no lo completa), OTP input (sin 2FA en `sgp`), Form
adorn (ya resuelto por `.grupo-campo` + el ícono de `.buscador`).

## 0.10.0 — sin publicar

- `.formulario-seccion` (+ `-titulo`/`-nota`) — agrupa los `.campo` de un
  formulario largo. Preventivo: `solicitud_form.html` hoy solo usa
  `h2.seccion` para separar bloques, sin agrupar visualmente los campos.
- **`iniciarTabs` ampliado, retrocompatible** — con `data-tab`/
  `data-tab-panel`, también muestra/oculta el `.tab-panel`
  correspondiente. Sin esos atributos, `.tabs` sigue siendo exactamente
  el segmented control de 0.2.0, sin cambios.
- `.columnas-2` / `.columnas-4` — variantes de `.columnas` (antes solo
  3 columnas fijas).
- `.masonry` — empaquetado tipo Pinterest vía `columns` CSS (no
  `grid-template-rows: masonry`, soporte real hoy es solo Firefox tras
  flag; tampoco una librería JS).
- `.hero` — banner de introducción, agregado preventivo (sin uso real
  hoy en `sgp`).

## 0.9.0 — sin publicar

**Ocho íconos más**, cada uno con un concepto real y verificable en
`sgp` (mismo mecanismo `mask-image` de 0.8.0):

- `.icono-agregar` — `solicitud_form.html:84` usa literalmente "＋
  Agregar productos" como botón.
- `.icono-candado` — "año cerrado / solo lectura" (`periodo.py`,
  `_selector_anio.html`, `tesoreria_*.html`).
- `.icono-filtro` — filtros de listado ya existentes (`admin_bitacora`,
  `admin_usuarios`, `finanzas_presupuesto`).
- `.icono-eliminar` (tacho) — distinto de `.icono-cerrar`: las pantallas
  que usan `✕` para "eliminar fila" se leen mejor con un tacho que con
  una X, que ya significa "cerrar".
- `.icono-editar`, `.icono-ver` — acciones repetidas en bandejas.
- `.icono-advertencia`, `.icono-info` — para usar junto a
  `.aviso.alerta`/`.aviso.info`.

**Tipografía de marca** — primera vez que el paquete define una fuente
propia en vez de `system-ui`. **Public Sans** (licencia SIL Open Font,
diseñada para el US Web Design System) como valor por defecto de la
nueva variable `--font-sans`, mismo mecanismo de override sin `@layer`
que ya tienen los colores. El plugin no carga el `<link>` de Google
Fonts — sin él, cae a `system-ui` exactamente como antes. `SantacorinaTheme`
gana `fonts: { sans }` y `SantacorinaUIOptions` gana `fonts?`.
Verificado con `document.fonts` que la fuente real solo se registra
cuando el consumidor carga el `<link>`, y que sin él el fallback es
transparente.

## 0.8.0 — sin publicar

**Pack de íconos** — 100% CSS vía `mask-image` + `background-color:
currentColor` (con `-webkit-mask-*` para Safari). Confirmado contra
duplicación real en `sgp`: `✓`/`✔` usados de forma inconsistente para lo
mismo en distintas plantillas, `✕`/`×`, `→`, `☰`, `⋮` repetidos a mano
en decenas de archivos. Ocho íconos: `.icono-check`, `.icono-cerrar`,
`.icono-flecha-derecha`, `.icono-chevron-izq`, `.icono-chevron-der`,
`.icono-mas-opciones`, `.icono-menu`, `.icono-buscar` (`.chico`/`.grande`).

**Variantes de cabecera/pie** — agregados preventivos: `sgp` usa
deliberadamente un solo tipo de cabecera hoy (`unidad_base.html` y
`portal_base.html` son casi idénticas; el propio `AppShell.vue` lo dice
explícito). `.cabecera-compacta` (contextos densos/embebidos),
`.cabecera-centrada` (pantallas standalone, sin bloque de usuario),
`.cabecera-con-buscador` (integra el `.buscador` de 0.7.0), y
`.pie-compacto`.

## 0.7.1 — sin publicar

Dos ajustes responsivos bajo 600px (teléfono — el 900px del resto del
paquete es muy ancho para esto), sin clase nueva:

- `.breadcrumb` trunca cada tramo con `…` en vez de desbordar o partirse
  a media palabra.
- `.menu-panel` pasa de panel flotante anclado al trigger a una hoja fija
  abajo — anclado a la derecha de un trigger angosto, se salía del
  viewport en una pantalla angosta (se vio justo eso al verificar).

## 0.7.0 — sin publicar

- `.buscador` + `.limpiar` (CSS) + `iniciarBuscadores` (JS) — input de
  búsqueda con ícono y botón de limpiar de marca; se oculta
  `::-webkit-search-cancel-button` para no mostrar dos botones de limpiar
  (el nativo de `type=search` y el propio) duplicados.
- `.contador-caracteres` (CSS) + `iniciarContadores` (JS) — contador de
  caracteres para un `textarea[data-contador][maxlength]`, con `.cerca`
  (90%) y `.lleno` (100%).

Agregados preventivos, pedidos explícitamente por el usuario.

## 0.6.0 — sin publicar

Primera vez que el paquete incluye JS, no solo CSS. Empaquetado en dos
formatos: ESM/CJS para bundlers (`@sistema32/santacorina-ui/js`) y un IIFE
(`dist/js.global.js`, `window.Santacorina`) para consumo sin Node, igual
criterio que `dist/ui.css`.

Duplicación real confirmada y extraída:

- `formato.pesos/conSigno/pct/fechaCorta` — trasladado tal cual desde
  `peso()`/`conSigno()`/`pct()`, copiados idénticos en
  `FinanzasPresupuestoView.vue` y `FinanzasMatrizView.vue`.

Cierra una promesa que el propio paquete ya había documentado sin
resolver (el README decía "necesita JS propio" y nadie lo había escrito):

- `abrirModal`/`cerrarModal` para `.modal` (0.1.0).
- `mostrarToast` para `.toast` (0.1.0).
- `iniciarLateral` para `.lateral-toggle` (0.5.0).
- `iniciarTabs` para `.tabs` (0.2.0).

Agregados preventivos, sin uso actual en ningún repo todavía, pedidos
explícitamente por el usuario:

- `.calendario` (CSS) + `iniciarCalendario` (JS) — selector de fecha en
  grilla visual, mismo patrón de capa flotante que `.menu`.
- `iniciarRangoFechas` — sincroniza `min`/`max` entre dos
  `input[type=date]`, sobre el input nativo, sin widget nuevo.
- `debounce(fn, ms)`.
- `copiarAlPortapapeles(texto)` — con fallback porque la plataforma hoy
  corre sobre HTTP en red interna y el Clipboard API moderno exige un
  contexto seguro.

## 0.5.0 — sin publicar

La migración pendiente desde Fase 3: `.tarjeta`/`.kpi`/etc. se trasladaron
a este paquete en 0.1.0, pero el armazón de página y el menú lateral se
dejaron fuera por "específicos de una pantalla" cuando en realidad los usa
toda la plataforma. Trasladado tal cual desde `portal.css`/`lateral.css`
(producción), no inventado:

- `.app` / `.principal` / `.contenido` (`.ancho`) — armazón flex de página.
- `.cabecera` (+ `.cabecera-datos`, `.punto`, `.cabecera-usuario`,
  `.usuario-nombre`, `.usuario-rol`) — header.
- `.pie` — footer.
- `.lateral` — menú lateral completo (marca, grupos, items con estado,
  contador, ubicación) con el patrón responsivo íntegro: hamburguesa,
  overlay y panel deslizante bajo 900px.

Queda fuera, a propósito: los parches de compatibilidad del dashboard
heredado (`body.emisa-tablero`, `.emisa-*`) y el modal de rechazo, que ya
duplica `.modal`/`.modal-panel` — ninguno de los dos es un componente
reusable, son específicos de una sola pantalla.

## 0.4.0 — sin publicar

Confirmado cada gap contra uso real en `sgp` antes de agregarlo
(`input[type=file]` en 6 pantallas, `.tabla-scroll` en 30+ plantillas).

Estilo de marca sobre lo que el navegador ya resuelve:

- `input[type=file]::file-selector-button` — botón "Elegir archivo" de marca.
- `input[type=range]` — thumb y track con los mismos colores que `.barra-progreso`.
- `.tabla-scroll` — barra de scroll delgada (`scrollbar-color` + fallback `::-webkit-scrollbar`).

Componentes nuevos, sin equivalente previo:

- `.menu` / `.menu-panel` — menú desplegable, misma técnica que `.acordeon`
  (`<details>`/`<summary>` nativo) pero el panel flota anclado al trigger.
- `.insignia` (`.punto`, mismos 5 colores) — punto o número de notificación.
- `.cargando` (`.oscuro`/`.chico`/`.grande`) — spinner de carga para meter
  dentro de `.boton`.

## 0.3.0 — sin publicar

Estilo de marca sobre lo que el navegador ya resuelve (en vez de
reconstruirlo con markup propio):

- Checkbox y radio: `accent-color` de marca.
- `<select>`: flecha propia en vez de la del sistema operativo.
- `.campo` ahora cubre también `input[type=email|tel|date|search|password]`
  (antes solo `text` y `number`).
- `.acordeon`: piel sobre `<details>`/`<summary>` nativos (chevron que rota).
- `:focus-visible` global — reemplaza el foco que antes solo cubría
  input/select/textarea, ahora cualquier elemento navegable por teclado.

Componentes nuevos, sin equivalente previo:

- `.interruptor` — switch on/off.
- `.chip` (mismos 5 colores que `.etiqueta`) — etiqueta removible.
- `.avatar` (`.chico`/`.grande`, mismos 5 colores) — iniciales en círculo.
- `.divisor` — separador de dos bloques, con o sin texto.
- `.paginacion` (`.activo`, mismo patrón que `.tabs`/`.stepper-paso`).

## 0.2.0 — sin publicar

Seis componentes nuevos, ninguno copiado de un uso existente (no había
equivalente en producción para ninguno de estos):

- `.stepper` / `.stepper-paso` (`.activo`/`.completado`/`.rechazado`/`.omitido`) —
  progreso de un flujo de varios pasos.
- `.barra-progreso` / `.relleno` (`.alerta`/`.pasada`) — generaliza
  `.barra-reparto`, que existía solo para presupuesto.
- `.tabs` (`.activo`) — generaliza `.filtro-ver`, que existía solo para la
  lista de establecimientos.
- `[data-tooltip]` — tooltip solo-CSS, sin JS.
- `.breadcrumb` — generaliza el «Estás viendo: X → Y» armado a mano.
- `.skeleton` / `.skeleton-texto` (`.corto`) — primer estado de carga de la
  librería; antes una pantalla cargando no mostraba nada.

## 0.1.0 — sin publicar

Primera versión. Extraída de `sgp/frontend/src/legado.css` +
`sgp/web/static/portal.css` (el CSS que corría en producción) — no se
inventó ningún valor nuevo, solo se trasladó a un plugin de Tailwind v4
instalable desde otros repos.

- Tokens de color (16 valores: navy, azul, verde, naranjo, rojo, gris +
  variantes `-fondo`/`-oscuro`/`-claro`).
- Componentes: tarjeta, kpi, etiqueta, boton, btn-chico, pastilla, aviso,
  campo + inputs, tabla base + helpers de alineación, dato, ficha, luz,
  linea-tiempo, vacio.
- `dist/ui.css` precompilado para consumidores sin Tailwind propio.
- Guía visual en `guia/index.html`.
