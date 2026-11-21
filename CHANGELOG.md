# Changelog

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
