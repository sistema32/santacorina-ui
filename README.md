# @sistema32/santacorina-ui

Plugin de Tailwind CSS v4 del Servicio Local de Educación Pública Santa
Corina: los tokens de marca (colores) y los componentes que Tailwind no
trae de fábrica (`.tarjeta`, `.kpi`, `.etiqueta`, `.boton`, `.pastilla`,
`.aviso`, `.campo`, helpers de tabla, `.dato`, `.luz`, `.linea-tiempo`,
`.vacio`). Pensado para que lo use más de un sistema (sgp, y lo que venga
después) sin copiar CSS entre repos.

## Instalación

```bash
npm install @sistema32/santacorina-ui
```

## Uso — con tu propio build de Tailwind

```css
/* src/estilos.css */
@import "tailwindcss";
@plugin "@sistema32/santacorina-ui";
```

Eso agrega los ~16 colores de marca (como utilidades: `bg-navy`,
`text-azul-oscuro`, `border-rojo-fondo`, ...) y los componentes listados
arriba, disponibles en cualquier plantilla/componente que Tailwind ya esté
escaneando.

## Uso — sin Node (backend sin build propio)

```html
<link rel="stylesheet" href="node_modules/@sistema32/santacorina-ui/dist/ui.css">
```

`dist/ui.css` es el plugin ya compilado contra Tailwind — no necesita que
el consumidor tenga Tailwind instalado ni un paso de build. Es el caso real
de hoy: el backend Python de `sgp` no tiene Node en su imagen de
producción, así que ese archivo se commitea (ver `CHANGELOG.md` para
cuándo se regeneró por última vez).

## Utilidades JS

Desde 0.6.0 el paquete también trae JS (antes solo CSS), en dos modos de
consumo, igual criterio que `dist/ui.css`:

```html
<!-- sin bundler (plantillas Jinja) -->
<script src="node_modules/@sistema32/santacorina-ui/dist/js.global.js"></script>
<!-- expone window.Santacorina; .lateral-toggle, .tabs, data-rango-fechas
     y data-calendario ya funcionan solos al cargar la página -->
```

```ts
// con bundler (Vue u otro)
import { formato, mostrarToast, abrirModal } from "@sistema32/santacorina-ui/js";
```

| Utilidad | Qué hace | Se auto-inicia |
|---|---|---|
| `formato.pesos/conSigno/pct/fechaCorta` | Formato chileno de moneda, porcentaje y fecha corta | — |
| `abrirModal`/`cerrarModal` | Abre/cierra un `.modal`; backdrop, Escape y `[data-cerrar-modal]` cierran solos | parcial (el cierre) |
| `mostrarToast(mensaje, tipo?)` | Crea y descarta un `.toast` | — |
| `iniciarLateral` | Conecta `.lateral-toggle` con `.abierta`/`.visible` | ✓ |
| `iniciarTabs` | Mueve `.activo` al hacer clic dentro de `.tabs` | ✓ |
| `iniciarRangoFechas` | Sincroniza `min`/`max` entre dos `input[type=date]` en `[data-rango-fechas]` | ✓ |
| `iniciarCalendario` | Panel de calendario sobre `[data-calendario]` | ✓ |
| `iniciarBuscadores` | Muestra/oculta y conecta el botón `.limpiar` de `.buscador` | ✓ |
| `iniciarContadores` | Actualiza `.contador-caracteres` de un `textarea[data-contador]` | ✓ |
| `iniciarTabs` (ampliado en 0.10.0) | Con `data-tab`/`data-tab-panel`, también muestra/oculta el panel — sin esos atributos sigue siendo solo un segmented control, retrocompatible | ✓ |
| `iniciarPopovers` | Abre/cierra `.popover-panel` al hacer clic en `[data-popover-trigger]` | ✓ |
| `iniciarColapsables` | Alterna `.activo` en `[data-colapsable]` al hacer clic en `[data-colapsar]` | ✓ |
| `iniciarCajones` | Conecta `[data-cajon-toggle]`/`[data-cajon-fondo]` con `.cajon` | ✓ |
| `iniciarCombobox` | Filtra `.combobox-opciones` (sin distinguir tildes), navegación por teclado | ✓ |
| `iniciarMedidorClave` | Actualiza `.medidor-clave` junto a `input[data-medidor-clave]` | ✓ |
| `irAPaso(asistente, n)` | Muestra el `[data-paso]` n-ésimo y marca los `[data-chip]` — la llama cada pantalla después de su propia validación | — |
| `iniciarAsistentes` | Conecta el clic en un chip ya completado/activo para volver a ese paso (no deja saltar a uno no alcanzado) | ✓ |
| `iniciarZonasArrastre` | Alterna `.activa` en `.zona-arrastre` con dragover/dragleave/drop — la subida real sigue siendo de cada pantalla | ✓ |
| `iniciarToggletips` | Abre/cierra `.toggletip-panel` al hacer clic en `[data-toggletip]` — alternativa a `[data-tooltip]` con soporte táctil | ✓ |
| `iniciarResumenErrores` | Enfoca `.resumen-errores` al aparecer y mueve el foco al campo destino al hacer clic en un link — de GOV.UK Design System ([error summary](https://design-system.service.gov.uk/components/error-summary/)) | ✓ |
| `iniciarTablasOrdenables` | Alterna `aria-sort` en `th[data-ordenable]` y dispara `santacorina:ordenar` — el consumidor reordena sus propias filas | ✓ |
| `iniciarCarruseles` / `avanzarCarrusel(el, dir)` | Cambia la slide activa de `.carousel` por clic/indicador/flechas de teclado; `avanzarCarrusel` queda exportado para quien quiera autoplay con su propio `setInterval` | ✓ (`iniciarCarruseles`) |
| `destruirTodo(raiz?)` | Libera los listeners de `document` (Escape, clic-afuera) que `iniciarTodo(raiz)` registró — para una SPA que desmonta y vuelve a montar `raiz` | — |
| `iniciarFormularios` | Valida con la Constraint Validation API nativa en cada `<form data-validar>`; si falla, marca `.campo-error`/`[aria-invalid]` y arma `.resumen-errores` | ✓ |
| `ponerCargando(boton)` / `quitarCargando(boton)` | Estado "Guardando…" en un `.boton` sin cambiar su ancho (`aria-busy` + `disabled`, evita doble envío) | — |
| `iniciarSeleccionTabla` | Checkbox de cabecera (marca/desmarca/`indeterminate`) + checkboxes de fila en `table[data-seleccion]`, dispara `santacorina:seleccion-cambiar` y muestra/oculta `.barra-seleccion` | ✓ |
| `debounce(fn, ms)` | Retrasa `fn` hasta que pasan `ms` sin una nueva llamada | — |
| `copiarAlPortapapeles(texto)` | Copia al portapapeles, con fallback para contextos sin HTTPS | — |

Las marcadas "✓" las conecta `iniciarTodo()` solo con cargar el script
(auto-ejecuta al `DOMContentLoaded`, como el `data-bs-*` de Bootstrap). El
resto se llama a mano desde el código de cada pantalla, porque dependen de
cuándo esa pantalla decide mostrar un modal, un toast, etc.

`iniciarTodo()` (y cada `iniciar*` individual) es seguro de llamar más de
una vez sobre el mismo DOM — útil si una pantalla la llama a mano además
del auto-run, o en un framework con remontaje/HMR. Cada módulo marca los
elementos que ya inicializó (`src/js/una-vez.ts`), así que no se
duplican listeners ni se repiten eventos por un mismo clic. Si en cambio
`raiz` se **desmonta** (el nodo se saca del DOM) y luego se vuelve a montar
un nodo equivalente, llamar `destruirTodo(raiz)` antes de desmontar libera
los listeners que algunos módulos (modal, cajón, popover, toggletip,
calendario, combobox) ponen sobre `document` — esos no se liberan solos
porque `document` nunca se destruye.

### Eventos `santacorina:*`

Todos burbujean (`bubbles: true`) y se disparan en el propio elemento —
el consumidor los escucha donde le convenga (el elemento, un ancestro,
o `document`):

| Evento | Se dispara en | `detail` |
|---|---|---|
| `santacorina:modal-abrir` / `-cerrar` | `.modal` | — |
| `santacorina:cajon-abrir` / `-cerrar` | `.cajon` | — |
| `santacorina:popover-abrir` / `-cerrar` | `[data-popover]` | — |
| `santacorina:toggletip-abrir` / `-cerrar` | `[data-toggletip]` | — |
| `santacorina:calendario-abrir` / `-cerrar` | `[data-calendario]` | — |
| `santacorina:colapsar-abrir` / `-cerrar` | `[data-colapsar]` | — |
| `santacorina:tab-cambiar` | `.tabs` | `{ destino }` |
| `santacorina:combobox-seleccionar` | `.combobox` | `{ valor, texto }` |
| `santacorina:carousel-cambiar` | `.carousel` | `{ indice }` |
| `santacorina:ordenar` | `th[data-ordenable]` | `{ columna, direccion }` |
| `santacorina:seleccion-cambiar` | `table[data-seleccion]` | `{ ids, total }` |

`formato` viene de duplicación real: `peso()`/`conSigno()`/`pct()` estaban
copiados idénticos en `FinanzasPresupuestoView.vue` y
`FinanzasMatrizView.vue`. El resto son agregados preventivos (sin uso
actual en ningún repo todavía), pedidos explícitamente para cubrir
necesidad futura — igual que Bootstrap trae su propio JS de componentes
sin que cada consumidor lo haya pedido antes.

## Cambiar un color de marca

```css
@import "tailwindcss";
@plugin "@sistema32/santacorina-ui";

:root {
  --color-azul: #1d4ed8;
}
```

Importante: la variable va **sin** envolver en un `@layer` — una regla sin
layer le gana a cualquier regla dentro de un layer (el plugin define sus
colores dentro de `@layer base`), sin importar el orden en que aparezcan
en el archivo. Se probó explícitamente; ver "Decisiones verificadas" abajo.

## Tipografía de marca

**Public Sans** (licencia SIL Open Font) es la fuente por defecto, vía la
variable `--font-sans` — mismo mecanismo que los colores: el plugin
declara el valor en un `:root` sin `@layer` en `src/plugin.ts`, lo que
le gana a cualquier regla dentro de un layer sin importar el orden. El
paquete no carga el `<link>` de Google Fonts por su cuenta (una petición
de red no debe imponerla un plugin); sin él, cae a `system-ui` — exactamente
el aspecto de antes de 0.9.0.

```css
@import "tailwindcss";
@plugin "@sistema32/santacorina-ui";

/* opcional: para que se vea con Public Sans de verdad */
/* <link> en el <head>: https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;700&display=swap */

/* para usar otra tipografia en vez de Public Sans */
:root { --font-sans: 'Inter', sans-serif; }
```

`--font-sans` es el mismo nombre que usa el tema por defecto de Tailwind
v4 para su utilidad `font-sans` — el override (sin `@layer`) también le
gana a esa utilidad y al `<html>` base, no solo a `body`: toda la
plataforma queda en una sola tipografía, consistente.

## Modo oscuro

Sigue `prefers-color-scheme` por defecto; `data-theme="dark"`/`"light"`
en cualquier ancestro (típicamente `<html>`) lo fuerza a mano — mismo
mecanismo que ya usan los colores/la tipografía, solo variables CSS.

```css
/* no hace falta nada mas para que respete el tema del sistema operativo */
```

```html
<!-- forzar oscuro sin importar el SO -->
<html data-theme="dark">
```

Reactivos al tema: `--color-fondo`, `--color-texto`, `--color-tenue`,
`--color-borde`, `--color-gris-fondo`/`-texto`, `--color-superficie`
(fondo de tarjeta/modal/panel/input — antes `#fff` literal en 47
lugares, sin variable), `--color-titulo` (texto de título/etiqueta —
separado de `--color-navy` a propósito) y los 4 pares de tono
`--color-azul/verde/naranjo/rojo-fondo`/`-texto`.

**Fijos, no reactivos, a propósito**: `--color-navy` (sigue siendo el
fondo de marca de `.lateral`/`.hero`/`.toast` en cualquier tema — son
franjas oscuras por diseño, no por tema) y los colores saturados base
(`--color-azul`/`-azul-oscuro`/`-verde`/`-naranjo`/`-rojo`/`-gris`,
usados como fondo de botón/badge con texto blanco fijo o como borde —
su variante de *texto* reactiva es la versión `-texto` de cada uno).

## Componentes incluidos

Convención para variantes de diseño: desde 0.17.0, el tono de color y
el tamaño de un componente se eligen con los atributos `data-tono`/
`data-tamano` en vez de una clase suelta (`<span class="etiqueta"
data-tono="azul">` en vez de `<span class="etiqueta azul">`) — mismo
criterio que ya usan los componentes interactivos (`data-ordenable`,
`data-toggletip`). Solo se migraron los 9 componentes que ya tenían
este patrón (`.kpi`, `.etiqueta`, `.pastilla`, `.aviso`/`.aviso-pagina`,
`.luz`, `.chip`, `.avatar`, `.insignia-icono`, `.insignia`); las clases
de **estado** que alterna el propio JS (`.visible`, `.activo`,
`.abierta`...) siguen siendo clases, igual que `.boton.secundario`/
`.peligro` (eso es "intención", no tono ni tamaño). No se tocó
vocabulario: los valores (`azul`, `celeste`, `info`, `chica`...) son
los mismos de antes, solo cambió el mecanismo.

| Clase | Qué es |
|---|---|
| `.tarjeta` | Contenedor base de un bloque de contenido |
| `.kpis` / `.kpi` (`data-tono="azul\|verde\|naranjo\|rojo\|gris"`) | Cifra destacada con color de estado |
| `.etiqueta` (mismos `data-tono`) | Estado corto en línea con texto, no clicable |
| `.boton` (`.secundario`/`.peligro`) | Acción principal |
| `.boton[data-cargando]` | Estado "Guardando…" sin cambiar de ancho — JS en `/js` (`ponerCargando`/`quitarCargando`) |
| `.btn-chico`, `a.btn-chico` (`.peligro`) | Acción secundaria por fila/celda |
| `.pastilla` (`data-tono="celeste\|roja"`) | Decisión clicable con forma de botón |
| `.aviso` (`data-tono="info\|ok\|alerta\|error"`) | Banner de nivel de pantalla |
| `.aviso-pagina` (mismos `data-tono`) | Franja persistente bajo la cabecera (no por fila como `.aviso`, no transitoria como `.toast`) — de [GOV.UK notification banner](https://design-system.service.gov.uk/components/notification-banner/)/USWDS site alert |
| `.campo` + `input`/`select`/`textarea` | Control de formulario con etiqueta y ayuda |
| `[aria-invalid="true"]` + `.campo-error` | Borde rojo en el control + mensaje junto a él; complementa `.resumen-errores` (el resumen enlaza al campo, esto muestra por qué) |
| `fieldset.campo-grupo` + `legend` | Agrupa varios `.campo-check` bajo una pregunta, con el HTML nativo correcto |
| `.barra-filtros` + `.limpiar-filtros` | Agrupa `.buscador` + campos sueltos + `.chip` (sin cambios) + "Limpiar filtros" en una fila; en móvil pasa a columna sin reordenar |
| tabla base + `.tabla-scroll`, `.peso`/`.der`/`.cen`/`.codigo` | Listados tabulares, montos alineados |
| `.tabla-cabecera-fija` / `.tabla-compacta` | Encabezado fijo con scroll vertical (reusa `--z-flotante`) y densidad compacta, para listados largos |
| `table[data-seleccion]` + `.barra-seleccion` | Checkbox de cabecera (`[data-seleccionar-todo]`) + de fila (`[data-seleccionar-fila]`) y barra "N seleccionados" (calcada de `.total-caja`) — JS en `/js` (`iniciarSeleccionTabla`) |
| `th[data-ordenable]` | Flecha + `aria-sort`; JS en `/js` (`iniciarTablasOrdenables`) — de [Carbon Design System](https://carbondesignsystem.com/components/data-table/usage/) (tabla de datos) |
| `.resumen-revision` + `.resumen-revision-item` (`.cambiar`) | Pares clave/valor con acción "Cambiar", para la pantalla de revisión antes de enviar (cierra `.asistente`) — de [GOV.UK summary list](https://design-system.service.gov.uk/components/summary-list/) |
| `.resumen-errores` | Caja de errores al inicio del formulario, enfocada automáticamente; JS en `/js` (`iniciarResumenErrores`) — de [GOV.UK error summary](https://design-system.service.gov.uk/components/error-summary/), el patrón de a11y de formularios mejor documentado que encontré |
| `[data-toggletip]` + `.toggletip-panel` | Tooltip accesible en touch (abre con clic, no con hover); JS en `/js` (`iniciarToggletips`) |
| `.dato` | Par etiqueta/valor |
| `.ficha` | Grilla de datos más ancha que una columna |
| `.luz` (`data-tono="verde\|naranjo\|rojo\|gris"`) | Punto de semáforo en listas de validación |
| `.linea-tiempo` | Historial de eventos |
| `.vacio` | Estado vacío de un listado |
| `.columnas` | Grilla responsiva de varias columnas |
| `.modal` / `.modal-panel` (`.visible`) | Diálogo modal |
| `.toast-contenedor` / `.toast` (`.ok`/`.alerta`/`.error`) | Notificación flotante |
| `.stepper` / `.stepper-paso` (`.activo`/`.completado`/`.rechazado`/`.omitido`) | Progreso de un flujo de varios pasos |
| `.barra-progreso` / `.relleno` (`.alerta`/`.pasada`) | Barra de progreso |
| `.tabs` (`.activo`) | Navegación por pestañas |
| `[data-tooltip]` | Tooltip solo-CSS, sin JS |
| `.breadcrumb` | «Estás viendo: X → Y» |
| `.skeleton` / `.skeleton-texto` (`.corto`) | Estado de carga |
| `.campo-check` + `input[type=checkbox\|radio]` | Checkbox/radio nativos con color de marca |
| `.interruptor` | Switch on/off |
| `.chip` (`data-tono="azul\|verde\|naranjo\|rojo"`) | Etiqueta removible (filtros seleccionados) |
| `.avatar` (`data-tamano="chico\|grande"` + `data-tono`, mismos tonos) | Iniciales en círculo |
| `.divisor` | Separador de dos bloques, con o sin texto |
| `.acordeon` (sobre `<details>`/`<summary>`) | Contenido expandible |
| `.paginacion` (`.activo`) | Navegación por páginas |
| `.menu` / `.menu-panel` (sobre `<details>`/`<summary>`) | Menú desplegable anclado |
| `.insignia` (`.punto` sigue siendo clase; color con `data-tono="azul\|verde\|naranjo\|gris"`) | Punto o número de notificación |
| `.cargando` (`.oscuro`/`.chico`/`.grande`) | Spinner de carga |
| `.app` / `.principal` / `.contenido` (`.ancho`) | Armazón flex de página completa |
| `.cabecera` + `.cabecera-datos`/`.punto`/`.cabecera-usuario`/`.usuario-nombre`/`.usuario-rol` | Header |
| `.pie` | Footer |
| `.lateral` + `.item` (`.activo`/`.inactivo`/`.salir`), `.grupo`, `.contador`, `.ubicacion` | Menú lateral, con responsivo (`.lateral-toggle`, `.lateral-fondo`, `.abierta`) bajo 900px |
| `.calendario` / `.calendario-panel` (sobre `[data-calendario]`) | Selector de fecha en grilla visual — el JS vive en `/js` |
| `.buscador` + `.limpiar` | Input de búsqueda con ícono y botón de limpiar propio (oculta el nativo de `type=search`) — JS en `/js` |
| `.contador-caracteres` (`.cerca`/`.lleno`, sobre `textarea[data-contador]`) | Contador de caracteres de un textarea — JS en `/js` |
| `.icono` + `.icono-check/cerrar/flecha-derecha/chevron-izq/chevron-der/mas-opciones/menu/buscar/agregar/candado/filtro/eliminar/editar/ver/advertencia/info` (`.chico`/`.grande`) | Ícono 100% CSS, hereda el color de texto |
| `.cabecera-compacta` / `.cabecera-centrada` / `.cabecera-con-buscador` | Variantes de `.cabecera` |
| `.pie-compacto` | Variante de `.pie` |
| `.formulario-seccion` + `.formulario-seccion-titulo`/`.formulario-seccion-nota` | Agrupa los `.campo` de un formulario largo |
| `.tab-panel` (sobre `[data-tab-panel]`) | Panel real para `.tabs` con `data-tab` |
| `.columnas-2` / `.columnas-4` | Variantes de `.columnas` |
| `.gutters-0` / `.gutters-chico` / `.gutters-grande` (sobre `.columnas`) | Espaciado — "gutters" de Bootstrap, modificadores del mismo `.columnas`, no un segundo sistema de grid |
| `.contenedor` / `.contenedor-fluido` | De Bootstrap — contenedor centrado reusable *fuera* del armazón `.app`. Se llama `.contenedor`, no `.container`: Tailwind v4 ya genera su propia utilidad `.container` en `@layer utilities` que le ganaba a la nuestra (confirmado) |
| `.z-flotante` / `.z-flotante-alto` / `.z-cajon` / `.z-modal` / `.z-toast` | Utilidades de la escala de z-index (`--z-*`) que ya usan `.menu-panel`/`.cajon`/`.modal`/`.toast` — para apilar tu propio HTML sin adivinar un número |
| `.masonry` | Empaquetado tipo Pinterest, vía `columns` CSS |
| `.hero` | Banner de introducción (dashboard/bienvenida) |
| `.carousel` + `.carousel-pista`/`.carousel-slide` + `.carousel-controles`/`.carousel-indicadores` | De Bootstrap — en 0.11.0 se dejó fuera por falta de caso de uso real, se agrega ahora como paridad de framework (preventivo, mismo criterio que `.hero`). Sin autoplay por defecto; JS en `/js` (`iniciarCarruseles`, `avanzarCarrusel`) |
| `.grupo-botones` | Botones de acción visualmente unidos |
| `.lista-grupo` + `.lista-grupo-item` (`.activo`) | Lista vertical de ítems clicables |
| `.grupo-campo` + `.prefijo`/`.sufijo` | Prefijo/sufijo pegado a un input (ej. montos en pesos) |
| `[data-popover]` + `.popover-panel` | Tooltip con contenido rico, abierto por clic — JS en `/js` |
| `[data-colapsar]` + `[data-colapsable]` (reusa `.tab-panel`) | Collapse genérico, paneles independientes — JS en `/js` |
| `.cajon` / `.cajon-fondo` | Panel deslizante genérico (ej. filtros) — JS en `/js` |
| `.combobox` + `.combobox-opciones` | Select con autocompletado, sin distinguir tildes — JS en `/js` |
| `.medidor-clave` | Medidor de fuerza de contraseña — JS en `/js` |
| `.paso` (sobre `[data-paso]`) + `.acciones` | Panel de contenido y fila de botones de un asistente — la fila de chips reutiliza `.stepper`/`.stepper-paso` (`.completado` ≡ el "listo" de producción); JS en `/js` |
| `.rastreador` + `.rastreador-item` (`.hecho`/`.actual`/`.pendiente`) | Lista vertical de etapas de un proceso, con descripción y responsable |
| `.validacion` + `.validacion-txt` (junto a `.luz`) | Fila de chequeo con semáforo |
| `.detalle-tecnico` (sobre `<details>`) | Información técnica opcional dentro de `.validacion-txt` |
| `.total-caja` | Caja de total (parecida a `.hero`, pero chica, para un formulario) |
| `.col-ancha` | Para usar dentro de `.columnas`/`.fila`/`.masonry`: el ítem ocupa todo el ancho de la grilla |
| `.insignia-icono` (`data-tamano="chica\|grande"` + `data-tono`, mismos 4 tonos) | Caja con ícono — de `acepta/frontend` (`IconBadge.vue`, 23 usos) |
| `.tarjeta-accion` | Ícono + título + descripción, clicable — de `acepta/frontend` (`.home-section-card`) |
| `.pildora-archivo` (`.tenue`) | Link/botón outline para documentos — de `acepta/frontend` (`.file-pill`, 21 usos) |
| `.zona-arrastre` (`.activa`) + `.lista-documentos`/`.documento-fila` | Drag & drop + fila de documento — de `acepta/frontend`; JS en `/js` |
| `.calendario-estado` + `.calendario-estado-dia` + `.punto-estado` (`.hecho`/`.en-curso`/`.fallido`) | Heatmap mensual de actividad — de `acepta/frontend`, distinto de `.calendario` (ese es un selector de fecha) |
| `td strong, td small` (en el bloque de tabla existente) | Celda de dos líneas — de `acepta/frontend` (41 ocurrencias) |

Dos ajustes responsivos nuevos, sin clase nueva, bajo 600px (teléfono —
el 900px del resto del paquete es muy ancho para esto): `.breadcrumb`
trunca cada tramo con `…` en vez de desbordar, y `.menu-panel` pasa de
panel flotante anclado al trigger a una hoja fija abajo (anclado a la
derecha de un trigger angosto, se sale del viewport en una pantalla
angosta — se vio justo eso al verificar).

El toggle móvil del menú lateral no es solo-CSS: agrega un *click handler*
de unas líneas en el consumidor que alterne `.abierta` en `.lateral` y
`.visible` en `.lateral-fondo` (el estado tiene que sobrevivir a cambios de
página en una app multi-página, no reiniciarse solo como un `<details>`).

Ajustes sin clase nueva: `select` ya no usa la flecha del sistema
operativo, el bloque de inputs de `.campo` cubre también `email`, `tel`,
`date`, `search` y `password` (antes solo `text` y `number`),
`input[type=file]::file-selector-button` e `input[type=range]` tienen
color de marca, `.tabla-scroll` usa una barra de scroll delgada en vez de
la del sistema operativo, y un `:focus-visible` global reemplaza el foco
que antes solo cubría input/select/textarea.

Ver `guia/index.html` para cada uno renderizado con datos reales.

## Accesibilidad

Desde 0.12.0, los componentes interactivos manejan ARIA y foco —
`sgp` es una plataforma de un servicio público, donde esto no es
opcional:

| Componente | Qué hace |
|---|---|
| `.modal`, `.cajon` | `role="dialog"` + `aria-modal`. Atrapan el foco con Tab mientras están abiertos (`src/js/foco.ts`) y lo devuelven al elemento que los abrió al cerrar. |
| `.tabs` | `role="tablist"`/`"tab"` + `aria-selected`; los `[data-tab-panel]` reciben `role="tabpanel"` + `aria-hidden` en espejo con `.activo`. |
| `[data-popover]` | El trigger recibe `aria-haspopup`/`aria-expanded`; el panel, `role="dialog"`; Escape devuelve el foco al trigger — pero solo si ese popover está realmente abierto (ver más abajo, "Decisiones verificadas"). |
| `.combobox` | Patrón ARIA 1.2 completo: `role="combobox"` + `aria-expanded`/`aria-controls`/`aria-activedescendant` en el input; `role="listbox"`/`"option"` en la lista. |
| `[data-colapsar]` | `aria-expanded` + `aria-controls` apuntando al panel. |
| `.acordeon`, `.menu` | Ya accesibles de fábrica — son `<details>`/`<summary>` nativos, el navegador resuelve foco, teclado y el estado expandido/colapsado. |

## Decisiones verificadas (no asumidas)

Dos cosas que parecían deberían funcionar y no funcionaban — quedan acá
para no repetir la investigación:

1. **`addComponents` en Tailwind v4 es un alias de `addUtilities`.** Exige
   que cada selector sea una sola clase (`.foo`), sin combinadores ni
   atributos — rompe con `.tarjeta h3`, `input[type=text]`,
   `tr:last-child td`. Por eso este plugin usa `addBase` para todo el
   bloque de componentes, que no tiene esa restricción.
2. **`theme.extend.colors` no genera `--color-X` en ningún lado** — solo
   inlinea el hex en cada utilidad (`bg-navy { background-color: #0c2d4a }`).
   Como los componentes usan `var(--color-navy)` para poder responder a un
   override, el plugin declara esas custom properties él mismo en `:root`
   (ver `src/plugin.ts`), desde la misma fuente de colores que alimenta
   `theme.extend`.
3. **La opción `colors` de `plugin.withOptions` no es alcanzable desde
   `@plugin "pkg" { ... }`** (probado, sin efecto). Solo sirve invocando el
   plugin desde JS/TS directamente. Para el caso común, usar el override
   por variable CSS de la sección anterior.
4. **Un listener de `Escape` a nivel `document` sin guardia afecta a toda
   la página, no solo a su propio componente.** `iniciarPopovers` cerraba
   su panel y devolvía el foco a su trigger con cualquier `Escape`, aunque
   ese popover especifico estuviera cerrado — así que cerrar un `.modal`
   con Escape en una pantalla que también tiene un popover (cerrado) le
   robaba el foco de vuelta al trigger del popover. Se vio recién al
   instrumentar el DOM con un log de `focusin`/`keydown` (Playwright con
   Patchright no expone `console.log` de la página — es una medida
   anti-detección). Arreglado: el handler de Escape de cada componente
   primero comprueba que *su propio* panel/modal/cajón esté abierto antes
   de actuar.
5. **Dentro de un mismo `addBase` (un solo layer, igual especificidad),
   la regla que aparece más abajo en el CSS generado gana, exista o no
   una media query de por medio.** Una regla sin media (`.popover-panel
   { width: 260px }`) que aparece después de un `@media (max-width:
   600px) { .popover-panel { width: auto } }` en el objeto le gana a esa
   media query incluso bajo 600px, porque la cascada no mira "¿aplica la
   condición?" para decidir el empate, mira el orden de aparición. Se
   vio al arreglar que `.calendario-panel`/`.popover-panel` se salieran
   del viewport en móvil: la primera versión del fix fusionaba la regla
   dentro del bloque `600px` que ya existía (para no repetir el bug de
   claves `"@media"` duplicadas), pero ese bloque estaba *antes* de las
   reglas base de esos dos paneles en el archivo — medido con
   Playwright (`bounding_box()` a 360px de ancho), el panel seguía con
   `width:260px` pese a la media query. Se corrigió moviendo el bloque
   `600px` a después de las tres reglas base (`.menu-panel`,
   `.calendario-panel`, `.popover-panel`) que modifica.
6. **`tailwindcss/types/config` no existe en Tailwind v4 — es un path
   de v3.** `CSSRuleObject` se importaba de ahí para tipar
   `buildComponents()`; con el `tailwindcss` real instalado, `tsc`
   tira `TS2307`. Peor: el `.d.ts` que generaba tsup para ESTE paquete
   igual compilaba (el bundler de tipos resolvía el import por algún
   lado), pero el resultado importaba un chunk
   (`resolve-config-*.mjs`) que nunca se emitía al `dist/` real —
   cualquier consumidor que instalara el paquete y corriera `tsc`
   recibía el mismo `TS2307` por un archivo que no existía. Se
   reemplazó por un tipo local mínimo (`CssEnJs`, la forma real que
   espera `addBase` en v4). Verificado con el método que debería
   usarse siempre para esto: `npm pack` + instalar el tarball en un
   proyecto aparte + `tsc --noEmit` sobre un `import` real, no solo
   `tsc` dentro del propio repo.
7. **Un `WeakMap` como guardia de "ya inicializado" no sirve si la
   clave puede ser `undefined`.** `document.documentElement` es
   siempre un `Element` real en un navegador real, pero cualquier stub
   de `document` en Node (para probar el bundle fuera del navegador)
   que no lo defina revienta con "Invalid value used as weak map key"
   — si alguna vez se prueba el paquete fuera de un navegador de
   verdad, hay que stubear `documentElement` también.
8. **Un color de marca no puede ser "texto reactivo al tema" y "fondo
   fijo de marca" a la vez con el mismo token.** El primer intento de
   modo oscuro solo tocó `guia/guia.css` (fondo de demo siempre
   blanco) — tapaba el síntoma, no la causa: el paquete en sí no tenía
   modo oscuro. Al hacerlo de verdad, `--color-navy` resultó tener dos
   roles en conflicto: texto de título (debía aclararse en oscuro) y
   fondo fijo de `.lateral`/`.hero`/`.toast` (no debía cambiar nunca).
   Se separaron en dos tokens (`--color-titulo` reactivo, `--color-navy`
   fijo). El mismo conflicto apareció de nuevo con `--color-rojo`/
   `-naranjo`/`-azul-oscuro` usados como texto suelto (breadcrumb,
   contador de caracteres, etc.): aclararlos para que el texto
   contrastara en oscuro habría aclarado también sus usos como fondo
   de badge/insignia con texto blanco fijo, empeorando ESE contraste.
   Se resolvió reusando los pares `-texto` ya creados para los tonos
   (mismo valor claro, variante oscura con buen contraste propia) en
   vez de tocar el color base. Verificado con un cálculo real de ratio
   WCAG (no "se ve bien a ojo") para cada combinación texto/fondo
   nueva, en los dos temas.

## Desarrollo

```bash
npm install
npm run build       # tsup (plugin JS/TS) + scripts/build-css.mjs (dist/ui.css)
npm run dev:guia     # sirve guia/ contra el CSS recien compilado
```

Desde 0.18.0 `guia/` ya no es un solo archivo de 1300 líneas: está
dividida en `index.html` (portada + tokens/tipografía/íconos + índice
de referencia completo con las ~75 clases/funciones del paquete),
`layout.html`, `formularios.html`, `componentes.html` y
`js-utilidades.html`, con el CSS de la guía compartido en `guia/guia.css`
(antes duplicado en un `<style>` inline). El nav de la izquierda es el
mismo en las 5 páginas (agrupado por tema), así que se navega entre
ellas sin perder contexto.

Cualquier cambio en `src/components.ts` o `src/theme.ts` necesita
`npm run build` y un release nuevo — `dist/` se commitea porque hay
consumidores (el backend de `sgp`) sin Node en su pipeline de deploy.

## Qué falta para que esto sea de verdad "externo"

- [x] Repo: `github.com/sistema32/santacorina-ui`.
- [x] Registry elegido: GitHub Packages (`publishConfig` en este
      `package.json` ya apunta a `npm.pkg.github.com`).
- [ ] **Publicar `v0.1.0`.** Requiere un Personal Access Token de GitHub
      con permiso `write:packages`, de alguien con acceso al org
      `sistema32` (no se puede automatizar sin esa credencial):
      ```bash
      npm login --registry=https://npm.pkg.github.com --scope=@sistema32
      # usuario: tu usuario de GitHub; password: el token (no tu clave real)
      npm publish
      ```
- [ ] En cada consumidor (`sgp/frontend` primero), cambiar la dependencia
      `file:` local por `"@sistema32/santacorina-ui": "^0.1.0"` una vez
      publicado, y agregar un `.npmrc` con
      `@sistema32:registry=https://npm.pkg.github.com` para que `npm
      install` sepa de dónde bajarlo.
