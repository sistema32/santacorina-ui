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
| `debounce(fn, ms)` | Retrasa `fn` hasta que pasan `ms` sin una nueva llamada | — |
| `copiarAlPortapapeles(texto)` | Copia al portapapeles, con fallback para contextos sin HTTPS | — |

Las marcadas "✓" las conecta `iniciarTodo()` solo con cargar el script
(auto-ejecuta al `DOMContentLoaded`, como el `data-bs-*` de Bootstrap). El
resto se llama a mano desde el código de cada pantalla, porque dependen de
cuándo esa pantalla decide mostrar un modal, un toast, etc.

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

## Componentes incluidos

| Clase | Qué es |
|---|---|
| `.tarjeta` | Contenedor base de un bloque de contenido |
| `.kpis` / `.kpi` (`.azul`/`.verde`/`.naranjo`/`.rojo`/`.gris`) | Cifra destacada con color de estado |
| `.etiqueta` (mismos colores) | Estado corto en línea con texto, no clicable |
| `.boton` (`.secundario`/`.peligro`) | Acción principal |
| `.btn-chico`, `a.btn-chico` (`.peligro`) | Acción secundaria por fila/celda |
| `.pastilla` (`.celeste`/`.roja`) | Decisión clicable con forma de botón |
| `.aviso` (`.info`/`.ok`/`.alerta`/`.error`) | Banner de nivel de pantalla |
| `.campo` + `input`/`select`/`textarea` | Control de formulario con etiqueta y ayuda |
| tabla base + `.tabla-scroll`, `.peso`/`.der`/`.cen`/`.codigo` | Listados tabulares, montos alineados |
| `.dato` | Par etiqueta/valor |
| `.ficha` | Grilla de datos más ancha que una columna |
| `.luz` (`.verde`/`.naranjo`/`.rojo`/`.gris`) | Punto de semáforo en listas de validación |
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
| `.chip` (mismos colores) | Etiqueta removible (filtros seleccionados) |
| `.avatar` (`.chico`/`.grande`, mismos colores) | Iniciales en círculo |
| `.divisor` | Separador de dos bloques, con o sin texto |
| `.acordeon` (sobre `<details>`/`<summary>`) | Contenido expandible |
| `.paginacion` (`.activo`) | Navegación por páginas |
| `.menu` / `.menu-panel` (sobre `<details>`/`<summary>`) | Menú desplegable anclado |
| `.insignia` (`.punto`, mismos colores) | Punto o número de notificación |
| `.cargando` (`.oscuro`/`.chico`/`.grande`) | Spinner de carga |
| `.app` / `.principal` / `.contenido` (`.ancho`) | Armazón flex de página completa |
| `.cabecera` + `.cabecera-datos`/`.punto`/`.cabecera-usuario`/`.usuario-nombre`/`.usuario-rol` | Header |
| `.pie` | Footer |
| `.lateral` + `.item` (`.activo`/`.inactivo`/`.salir`), `.grupo`, `.contador`, `.ubicacion` | Menú lateral, con responsivo (`.lateral-toggle`, `.lateral-fondo`, `.abierta`) bajo 900px |
| `.calendario` / `.calendario-panel` (sobre `[data-calendario]`) | Selector de fecha en grilla visual — el JS vive en `/js` |
| `.buscador` + `.limpiar` | Input de búsqueda con ícono y botón de limpiar propio (oculta el nativo de `type=search`) — JS en `/js` |
| `.contador-caracteres` (`.cerca`/`.lleno`, sobre `textarea[data-contador]`) | Contador de caracteres de un textarea — JS en `/js` |

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

## Desarrollo

```bash
npm install
npm run build       # tsup (plugin JS/TS) + scripts/build-css.mjs (dist/ui.css)
npm run dev:guia     # sirve guia/index.html contra el CSS recien compilado
```

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
