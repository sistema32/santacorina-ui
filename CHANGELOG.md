# Changelog

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
