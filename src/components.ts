/**
 * Componentes que Tailwind no trae de fabrica: nombres semanticos para los
 * patrones que se repiten en toda la plataforma (tarjeta, kpi, etiqueta,
 * boton, pastilla, aviso, campo, tabla, dato, semaforo, linea de tiempo,
 * estado vacio). Tailwind da utilidades sueltas; esto da la pieza
 * terminada para no repetir la misma combinacion de 8 propiedades en cada
 * pantalla nueva.
 *
 * La mayoria vienen trasladados tal cual desde sgp/web/static/portal.css
 * (la version que corria en produccion) -- ver el README para la
 * procedencia de cada uno. `.columnas`, `.modal` y `.toast` son la
 * excepcion: no existia una version unica de ninguno de los tres (cada
 * pantalla que necesitaba un modal hizo el suyo, nunca hubo un toast) --
 * estos son nuevos, generalizando lo que ya habia disperso, para que la
 * proxima pantalla que necesite uno no vuelva a reinventarlo.
 */
/**
 * Forma real que espera `addBase` en Tailwind v4 (`CssInJs`, interna en
 * `tailwindcss/dist/types-*.d.mts`, sin exportar como API publica). Antes
 * este tipo se importaba de `tailwindcss/types/config` -- un path de
 * Tailwind v3 que ya no existe en v4 (confirmado: `tsc` tira
 * `TS2307: Cannot find module` con el tailwindcss instalado de verdad).
 * El propio build igual generaba un `dist/index.d.ts` roto: el bundler de
 * tipos de tsup partia los tipos profundos de ese import (PluginAPI,
 * UserConfig, etc. -- nada de lo cual usa este paquete) en un chunk
 * (`resolve-config-*.mjs`) que nunca se emitia al dist real, asi que
 * cualquier consumidor que hiciera `tsc` sobre el paquete instalado
 * recibia el mismo `TS2307` por la importacion ausente. Un tipo local
 * minimo evita las dos roturas a la vez.
 */
type CssEnJs = {
  [clave: string]: string | string[] | CssEnJs | CssEnJs[];
};

export function buildComponents(): CssEnJs {
  return {
    /* ---------------------------------------------------------------
     * Armazon de pagina -- trasladado de portal.css, que lo dejaba fuera
     * de la Fase 3 por "especifico de una pantalla" cuando en realidad lo
     * usa toda plantilla que extiende portal_base.html.
     * ------------------------------------------------------------- */
    ".app": { display: "flex", minHeight: "100vh" },
    ".principal": { flex: "1", minWidth: "0", display: "flex", flexDirection: "column" },
    ".cabecera": {
      backgroundColor: "var(--color-superficie)",
      borderBottom: "1px solid var(--color-borde)",
      padding: "var(--esp-4) var(--esp-6)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "var(--esp-5)",
      flexWrap: "wrap",
    },
    ".cabecera h1": { margin: "0", fontSize: "var(--t-lead)", color: "var(--color-titulo)" },
    ".cabecera-datos": { margin: "var(--esp-1) 0 0", fontSize: "var(--t-cuerpo)", color: "var(--color-tenue)" },
    ".punto": { opacity: "0.45", margin: "0 var(--esp-1)" },
    ".cabecera-usuario": { textAlign: "right", fontSize: "var(--t-cuerpo)", lineHeight: "1.4" },
    ".usuario-nombre": { display: "block", fontWeight: "700", color: "var(--color-titulo)" },
    ".usuario-rol": { display: "block", color: "var(--color-tenue)", fontSize: "var(--t-menor)" },
    ".contenido": { flex: "1", padding: "var(--esp-5) var(--esp-6) var(--esp-7)", maxWidth: "1180px", width: "100%" },
    ".contenido.ancho": { maxWidth: "1400px" },
    ".pie": {
      padding: "var(--esp-4) var(--esp-6) var(--esp-5)",
      fontSize: "var(--t-menor)",
      color: "var(--color-tenue)",
      borderTop: "1px solid var(--color-borde)",
    },

    /* ---------------------------------------------------------------
     * Variantes de cabecera/pie -- `.cabecera`/`.pie` siguen siendo las
     * de produccion, sin cambios. Estas son nuevas: hoy sgp usa
     * deliberadamente un solo tipo de cabecera (confirmado: unidad_base
     * y portal_base son casi identicas, y el propio AppShell.vue lo dice
     * explicito), asi que no hay una segunda variante que extraer -- son
     * preventivas, para la proxima pantalla que necesite un header
     * distinto (un modal, un login, una bandeja con buscador integrado).
     * ------------------------------------------------------------- */
    ".cabecera-compacta": { padding: "var(--esp-3) var(--esp-5)" },
    ".cabecera-compacta h1": { fontSize: "var(--t-lead)" },
    ".cabecera-centrada": { justifyContent: "center", textAlign: "center" },
    ".cabecera-centrada .cabecera-usuario": { display: "none" },
    ".cabecera-con-buscador": { alignItems: "center" },
    ".cabecera-con-buscador .buscador": { maxWidth: "320px" },
    ".pie-compacto": { textAlign: "center", borderTop: "0", padding: "var(--esp-4) var(--esp-5)" },

    /* ---------------------------------------------------------------
     * Cabecera adaptable -- titulo + pastilla de estado + accion
     * principal, para el encabezado de una pantalla de detalle (no
     * reemplaza `.cabecera`, que sigue siendo el header de toda la
     * app). Se mide a si misma (`container-type`) y colapsa el TEXTO
     * de la accion (deja el icono solo) cuando no hay espacio -- sin
     * JS, solo `@container`.
     * ------------------------------------------------------------- */
    ".cabecera-adaptable": {
      containerType: "inline-size",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--esp-4)",
      flexWrap: "wrap",
      padding: "var(--esp-4) var(--esp-5)",
      backgroundColor: "var(--color-superficie)",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
    },
    ".cabecera-adaptable-titulo": { display: "flex", alignItems: "center", gap: "var(--esp-3)", minWidth: "0" },
    ".cabecera-adaptable-titulo h1": {
      margin: "0",
      fontSize: "var(--t-lead)",
      color: "var(--color-titulo)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    ".cabecera-adaptable-accion": { flex: "none" },
    "@container (max-width: 420px)": {
      ".cabecera-adaptable-accion .texto": { display: "none" },
    },

    /* ---------------------------------------------------------------
     * Menu lateral -- trasladado de lateral.css tal cual (incluido el
     * patron responsivo con hamburguesa/overlay bajo 900px). El toggle
     * movil necesita que el consumidor agregue un click handler de unas
     * lineas (ver README): no es solo-CSS como `.acordeon`/`.menu` porque
     * el estado tiene que sobrevivir a cambios de pagina en una app
     * multi-pagina, no reiniciarse solo como un `<details>`.
     * ------------------------------------------------------------- */
    ".lateral": {
      width: "var(--lat-ancho, 264px)",
      flex: "0 0 var(--lat-ancho, 264px)",
      backgroundColor: "var(--color-navy)",
      color: "#dce6f0",
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: "0",
      height: "100vh",
      maxHeight: "100vh",
      overflowY: "auto",
      boxSizing: "border-box",
      scrollbarWidth: "thin",
      scrollbarColor: "rgba(255,255,255,0.35) transparent",
    },
    ".lateral::-webkit-scrollbar": { width: "8px" },
    ".lateral::-webkit-scrollbar-track": { backgroundColor: "transparent" },
    ".lateral::-webkit-scrollbar-thumb": { backgroundColor: "rgba(255,255,255,0.3)", borderRadius: "var(--radio)" },
    ".lateral::-webkit-scrollbar-thumb:hover": { backgroundColor: "rgba(255,255,255,0.5)" },
    ".lateral.lateral-fija": { position: "fixed", left: "0", top: "0", zIndex: "var(--z-lateral)" },
    ".lateral *": { boxSizing: "border-box" },
    ".lateral a": { color: "inherit", textDecoration: "none" },
    ".lateral .lateral-marca": {
      display: "block",
      padding: "var(--esp-5) var(--esp-5) var(--esp-4)",
      borderBottom: "1px solid rgba(255,255,255,0.12)",
    },
    ".lateral .lateral-logo": { display: "block", width: "100%", maxWidth: "200px", height: "auto" },
    ".lateral .lateral-sub": { display: "block", fontSize: "var(--t-menor)", opacity: "0.72", marginTop: "var(--esp-2)" },
    ".lateral nav": { padding: "var(--esp-4) var(--esp-3) var(--esp-5)" },
    ".lateral .grupo": {
      fontSize: "var(--t-menor)",
      opacity: "0.62",
      padding: "var(--esp-4) var(--esp-3) var(--esp-2)",
      fontWeight: "700",
    },
    ".lateral .item": {
      display: "flex",
      alignItems: "center",
      gap: "var(--esp-3)",
      padding: "var(--esp-2) var(--esp-3)",
      borderRadius: "var(--radio)",
      fontSize: "var(--t-cuerpo)",
      color: "#dce6f0",
      marginBottom: "var(--esp-1)",
      width: "100%",
      backgroundColor: "transparent",
      border: "0",
      fontFamily: "inherit",
      textAlign: "left",
      cursor: "pointer",
      lineHeight: "1.4",
    },
    ".lateral a.item:hover, .lateral button.item:hover": { backgroundColor: "rgba(255,255,255,0.09)" },
    ".lateral .item.activo": { backgroundColor: "var(--color-azul)", color: "#fff", fontWeight: "600" },
    ".lateral .item.inactivo": { opacity: "0.38", cursor: "default" },
    ".lateral .item.salir:hover": { backgroundColor: "rgba(200,54,47,0.35)" },
    ".lateral .ico": { width: "18px", textAlign: "center", fontSize: "var(--t-cuerpo)", opacity: "0.85", flex: "0 0 18px" },
    ".lateral .salir-form": { margin: "0" },
    ".lateral .contador": {
      marginLeft: "auto",
      backgroundColor: "var(--color-azul)",
      color: "#fff",
      borderRadius: "var(--radio-pastilla)",
      padding: "var(--esp-1) var(--esp-2)",
      fontSize: "var(--t-menor)",
      fontWeight: "700",
    },
    ".lateral .item.activo .contador": { backgroundColor: "rgba(255,255,255,0.28)" },
    ".lateral .ubicacion": {
      marginTop: "var(--esp-5)",
      padding: "var(--esp-3) var(--esp-4)",
      borderRadius: "var(--radio)",
      backgroundColor: "rgba(255,255,255,0.07)",
      fontSize: "var(--t-menor)",
      lineHeight: "1.5",
      opacity: "0.9",
    },
    ".lateral .ubicacion strong": { display: "block", marginTop: "var(--esp-1)", fontSize: "var(--t-cuerpo)" },
    ".lateral-toggle": {
      display: "none",
      position: "fixed",
      top: "12px",
      left: "12px",
      zIndex: "var(--z-cajon-control)",
      width: "40px",
      height: "40px",
      borderRadius: "var(--radio)",
      border: "0",
      backgroundColor: "var(--color-navy)",
      color: "#fff",
      fontSize: "var(--t-lead)",
      lineHeight: "1",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 2px 10px rgba(12,45,74,0.35)",
    },
    ".lateral-fondo": {
      display: "none",
      position: "fixed",
      inset: "0",
      backgroundColor: "rgba(8,20,34,0.5)",
      zIndex: "var(--z-cajon-fondo)",
    },
    ".masonry": { columnCount: "3", columnGap: "var(--esp-4)" },
    ".masonry > *": { breakInside: "avoid", marginBottom: "var(--esp-4)" },

    /* ---------------------------------------------------------------
     * Barra de navegacion horizontal con submenus desplegables.
     * Reusa `.menu` en todo lo que puede: el submenu es el mismo
     * `<details>` de siempre y el panel flotante se voltea con el mismo
     * `posicionarFlotante`. Lo propio es la barra, el colapso en movil
     * (breakpoint 900px, el que ya usa `.lateral` -- no uno nuevo) y
     * que los enlaces sean enlaces: navegacion, no menu de aplicacion
     * (ver `barra-nav.ts`).
     *
     * Sin la barra no se podia armar una cabecera con navegacion
     * horizontal: el paquete solo tenia `.lateral` (vertical, de
     * aplicacion) y `.menu` (un desplegable suelto).
     * ------------------------------------------------------------- */
    ".barra-nav": {
      display: "flex",
      alignItems: "center",
      gap: "var(--esp-4)",
      flexWrap: "wrap",
    },
    ".barra-nav-lista": {
      display: "flex",
      alignItems: "center",
      gap: "var(--esp-1)",
      listStyle: "none",
      margin: "0",
      padding: "0",
      flexWrap: "wrap",
    },
    ".barra-nav-lista > li": { position: "relative" },
    /* Un solo juego de estilos para el enlace suelto y para el
       `<summary>` que abre un submenu: en la barra son lo mismo. */
    ".barra-nav-lista > li > a, .barra-nav-grupo > summary": {
      display: "flex",
      alignItems: "center",
      gap: "var(--esp-1)",
      padding: "var(--esp-2) var(--esp-3)",
      color: "var(--color-texto)",
      fontSize: "var(--t-cuerpo)",
      fontWeight: "600",
      textDecoration: "none",
      cursor: "pointer",
      listStyle: "none",
      borderRadius: "var(--radio)",
      // Sin esto, el navegador espera 300ms por un posible doble toque
      // antes de disparar el clic.
      touchAction: "manipulation",
    },
    ".barra-nav-grupo > summary::-webkit-details-marker": { display: "none" },
    ".barra-nav-lista > li > a:hover, .barra-nav-grupo > summary:hover": {
      backgroundColor: "var(--color-gris-fondo)",
    },
    ".barra-nav-grupo[open] > summary": { backgroundColor: "var(--color-gris-fondo)" },
    /* `:focus-visible` y no `:focus`: el anillo tiene que aparecer para
       quien navega con teclado, no para quien acaba de hacer clic. */
    ".barra-nav-lista > li > a:focus-visible, .barra-nav-grupo > summary:focus-visible": {
      outline: "2px solid var(--color-azul-oscuro)",
      outlineOffset: "2px",
    },
    /* La pagina actual no se marca solo con color: lleva peso y una
       marca de 3px, y en el HTML `aria-current="page"`, que es lo que
       el lector de pantalla anuncia. */
    ".barra-nav-lista a[aria-current='page']": {
      color: "var(--color-titulo)",
      fontWeight: "700",
      boxShadow: "inset 0 -3px 0 var(--color-azul-oscuro)",
    },
    ".barra-nav-grupo > summary .icono": {
      transform: "rotate(90deg)",
      transition: "transform 0.15s ease",
    },
    ".barra-nav-grupo[open] > summary .icono": { transform: "rotate(-90deg)" },
    ".barra-nav-panel": {
      position: "absolute",
      top: "calc(100% + 4px)",
      left: "0",
      zIndex: "var(--z-flotante)",
      minWidth: "220px",
      backgroundColor: "var(--color-superficie)",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      boxShadow: "0 10px 30px rgba(12, 45, 74, 0.18)",
      padding: "var(--esp-2)",
    },
    ".barra-nav-panel[data-posicion='arriba']": { top: "auto", bottom: "calc(100% + 4px)" },
    ".barra-nav-panel a": {
      display: "block",
      padding: "var(--esp-2) var(--esp-3)",
      borderRadius: "var(--radio)",
      color: "var(--color-texto)",
      fontSize: "var(--t-cuerpo)",
      textDecoration: "none",
      touchAction: "manipulation",
    },
    ".barra-nav-panel a:hover": { backgroundColor: "var(--color-gris-fondo)" },
    ".barra-nav-panel a:focus-visible": {
      outline: "2px solid var(--color-azul-oscuro)",
      outlineOffset: "-2px",
    },
    ".barra-nav-panel a[aria-current='page']": { fontWeight: "700", color: "var(--color-titulo)" },
    ".barra-nav-toggle": {
      display: "none",
      alignItems: "center",
      gap: "var(--esp-2)",
      padding: "var(--esp-2) var(--esp-3)",
      border: "0",
      borderRadius: "var(--radio)",
      backgroundColor: "var(--color-gris-fondo)",
      color: "var(--color-texto)",
      fontFamily: "inherit",
      fontSize: "var(--t-cuerpo)",
      fontWeight: "600",
      cursor: "pointer",
      touchAction: "manipulation",
    },
    ".barra-nav-toggle:focus-visible": {
      outline: "2px solid var(--color-azul-oscuro)",
      outlineOffset: "2px",
    },

    "@media (max-width: 900px)": {
      ".app": { flexDirection: "column" },
      ".contenido": { padding: "var(--esp-5) var(--esp-4) var(--esp-6)" },
      ".cabecera": { padding: "var(--esp-4)" },
      ".lateral, .lateral.lateral-fija": {
        position: "fixed",
        left: "0",
        top: "0",
        width: "min(280px, 85vw)",
        flex: "none",
        height: "100vh",
        maxHeight: "100vh",
        zIndex: "var(--z-cajon)",
        transform: "translateX(-100%)",
        transition: "transform 0.22s ease",
      },
      ".lateral.abierta": { transform: "translateX(0)" },
      ".lateral-toggle": { display: "flex" },
      ".lateral-fondo.visible": { display: "block" },
      ".masonry": { columnCount: "2" },
      /* Barra de navegacion horizontal -> columna. Estas reglas viven
         aca y no en un bloque propio a proposito: son claves de un
         mismo objeto literal, asi que un segundo
         "@media (max-width: 900px)" no se suma, PISA a este y se
         pierden las reglas de arriba sin ningun aviso. Un bloque por
         consulta, siempre. */
      ".barra-nav": { alignItems: "stretch", flexDirection: "column", gap: "var(--esp-2)" },
      /* `[data-js]` lo pone `iniciarBarraNav`: si el script no corre,
         nada queda escondido detras de un boton que no responderia. */
      ".barra-nav[data-js] .barra-nav-toggle": { display: "inline-flex", alignSelf: "flex-start" },
      ".barra-nav[data-js] .barra-nav-lista:not(.abierta)": { display: "none" },
      ".barra-nav-lista": { flexDirection: "column", alignItems: "stretch", gap: "0", width: "100%" },
      ".barra-nav-grupo, .barra-nav-grupo > summary": { width: "100%" },
      /* 44px de alto minimo: el objetivo tactil recomendado. */
      ".barra-nav-lista > li > a, .barra-nav-grupo > summary": {
        minHeight: "44px",
        padding: "var(--esp-2) var(--esp-3)",
      },
      /* En movil el panel deja de flotar y pasa a ser una sangria: sin
         borde, sin sombra y sin medir espacio libre. */
      ".barra-nav-panel": {
        position: "static",
        minWidth: "0",
        border: "0",
        boxShadow: "none",
        padding: "0 0 var(--esp-2) var(--esp-4)",
      },
      ".barra-nav-panel a": { minHeight: "44px", display: "flex", alignItems: "center" },
    },

    /* ---------------------------------------------------------------
     * Tarjeta -- contenedor base de cualquier bloque de contenido.
     * ------------------------------------------------------------- */
    ".tarjeta": {
      backgroundColor: "var(--color-superficie)",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      padding: "var(--esp-5) var(--esp-5)",
      marginBottom: "var(--esp-5)",
    },
    ".tarjeta h3": {
      margin: "0 0 var(--esp-4)",
      fontSize: "var(--t-cuerpo)",
      color: "var(--color-titulo)",
    },
    "h2.seccion": {
      fontSize: "var(--t-lead)",
      color: "var(--color-titulo)",
      margin: "0 0 var(--esp-4)",
    },

    /* ---------------------------------------------------------------
     * KPI -- cifra destacada con color de estado a la izquierda.
     * ------------------------------------------------------------- */
    ".kpis": {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(158px, 1fr))",
      gap: "var(--esp-5)",
      marginBottom: "var(--esp-5)",
    },
    /* Era una caja con borde de 1px y un filo de color a la izquierda:
       cuatro iguales en fila, la postal del tablero generado. En una
       "stat tile" la cifra ES el grafico, asi que manda ella y la caja
       sobra -- el numero a 34px se ancla solo, sin recuadro que lo
       sostenga. El filo de color pasa a ser una marca corta ARRIBA del
       numero: sigue estando, pero como marca y no como marco.

       Dos reglas de visualizacion de datos que el componente violaba:
       1. Digitos proporcionales, no tabulares, en una cifra grande y
          suelta: `tabular-nums` le da a cada digito el ancho de un 0 y
          un "121" se ve flojo a 34px. Lo tabular es para columnas que
          tienen que alinearse (ahi esta, en `td.peso`).
       2. El estado no puede viajar solo en el color. En el uso real la
          etiqueta `.t` ya lo dice ("Sobregirado", "Pendientes"), y esa
          es la condicion para que `data-tono` sea legitimo: refuerza,
          no reemplaza. Documentado en la guia. */
    ".kpi": {
      backgroundColor: "transparent",
      border: "0",
      padding: "0",
    },
    ".kpi::before": {
      content: '""',
      display: "block",
      width: "28px",
      height: "4px",
      backgroundColor: "var(--kpi-tono, var(--color-gris))",
      marginBottom: "var(--esp-3)",
    },
    ".kpi .n": {
      fontSize: "var(--t-display)",
      fontWeight: "700",
      color: "var(--color-titulo)",
      lineHeight: "1",
      fontVariantNumeric: "proportional-nums",
    },
    ".kpi .t": { fontSize: "var(--t-menor)", color: "var(--color-tenue)", marginTop: "var(--esp-2)" },
    /* Variacion contra un periodo con nombre -- opcional y nueva. El
       signo lo pone `formato.conSigno()`; aca solo el color, que es la
       unica vez que un texto lleva color de dato: la direccion. */
    ".kpi .delta": { fontSize: "var(--t-menor)", fontWeight: "600", marginTop: "var(--esp-1)" },
    ".kpi .delta[data-direccion='sube']": { color: "var(--color-verde-texto)" },
    ".kpi .delta[data-direccion='baja']": { color: "var(--color-rojo-texto)" },
    /* El tono viaja en una variable en vez de repetir el color en cada
       pieza: lo consumen la marca de arriba y las barras del grafico. */
    ".kpi[data-tono='azul']": { "--kpi-tono": "var(--color-azul)" },
    ".kpi[data-tono='verde']": { "--kpi-tono": "var(--color-verde)" },
    ".kpi[data-tono='naranjo']": { "--kpi-tono": "var(--color-naranjo)" },
    ".kpi[data-tono='rojo']": { "--kpi-tono": "var(--color-rojo)" },
    ".kpi[data-tono='gris']": { "--kpi-tono": "var(--color-gris)" },

    /* ---------------------------------------------------------------
     * KPI con mini grafico. La cifra sola dice "99%" y no dice si
     * viene subiendo; siete barras al lado le dan forma sin ocupar
     * una pantalla de grafico. Es el `trend` que la ficha de dato
     * pide y que faltaba.
     *
     * Sin libreria de graficos: son divs con una altura en porcentaje.
     * Para siete barras, traerse 500 KB de ApexCharts (lo que hace la
     * plantilla de la que salio la idea) es desproporcionado -- y una
     * libreria de charts no se puede renderizar desde una plantilla
     * Jinja sin JS, que es justo el caso de `sgp/web`.
     *
     * Cada barra lleva su pista de fondo, como en el original: sin la
     * pista, siete barras cortas flotando no se leen como una serie.
     * Extremos rectos y no redondeados, al reves de lo que recomienda
     * la guia de visualizacion: manda la decision del sistema
     * (`--radio: 0`), y a 7px de ancho la diferencia no se ve.
     * ------------------------------------------------------------- */
    ".kpi-periodo": {
      fontSize: "var(--t-menor)",
      color: "var(--color-tenue)",
      margin: "var(--esp-1) 0 0",
    },
    ".kpi-grafico": {
      display: "flex",
      alignItems: "flex-end",
      gap: "var(--esp-1)",
      height: "60px",
      /* El ancho del grafico se topa a proposito: si siguiera al de la
         tarjeta, en una columna ancha quedarian siete barras flacas
         perdidas en un campo vacio. La serie se lee por la proporcion
         entre barra y hueco, no por lo ancha que sea. */
      maxWidth: "190px",
      margin: "var(--esp-3) 0",
    },
    ".kpi-grafico .barra": {
      flex: "1",
      minWidth: "4px",
      maxWidth: "14px",
      height: "100%",
      display: "flex",
      alignItems: "flex-end",
      backgroundColor: "var(--color-gris-fondo)",
    },
    /* `--v` es el valor, de 0 a 100, y lo pone el consumidor por barra:
       `<span class="barra" style="--v:75">`. Sin JS y sin SVG. */
    ".kpi-grafico .barra > *": {
      display: "block",
      width: "100%",
      height: "calc(var(--v, 0) * 1%)",
      backgroundColor: "var(--kpi-tono, var(--color-azul))",
    },
    /* La barra que importa (hoy, el maximo, el mes en curso) va en el
       tono pleno y el resto apagado -- "destacar una y bajar el resto"
       en vez de siete barras gritando lo mismo. */
    ".kpi-grafico .barra:not(.actual) > *": { opacity: "0.38" },
    /* Cifra y variacion en una sola fila, la cifra a la izquierda y el
       delta pegado a la derecha. */
    /* Cifra y variacion juntas, en esa orden de lectura. NO separadas
       a los extremos: con `space-between`, en una tarjeta ancha el
       delta se va a la otra punta y deja de pertenecer al numero. */
    ".kpi-cifra": {
      display: "flex",
      alignItems: "baseline",
      flexWrap: "wrap",
      gap: "0 var(--esp-3)",
    },
    ".kpi-cifra .delta": { marginTop: "0" },
    /* Con grafico, la marca de color de arriba sobra: el color ya lo
       llevan las barras. */
    ".kpi:has(.kpi-grafico)::before": { display: "none" },
    /* La etiqueta puede ir arriba (variante con grafico) o debajo de la
       cifra (variante simple); el margen superior es solo para la
       segunda. */
    ".kpi > .t:first-child": { marginTop: "0" },

    /* ---------------------------------------------------------------
     * Etiqueta -- estado corto, en linea con texto (no es clicable).
     * ------------------------------------------------------------- */
    ".etiqueta": {
      display: "inline-block",
      padding: "var(--esp-1) var(--esp-3)",
      borderRadius: "var(--radio-pastilla)",
      fontSize: "var(--t-menor)",
      fontWeight: "600",
      whiteSpace: "nowrap",
    },
    ".etiqueta[data-tono='gris']": { backgroundColor: "var(--color-gris-fondo)", color: "var(--color-gris-texto)" },
    ".etiqueta[data-tono='azul']": { backgroundColor: "var(--color-azul-fondo)", color: "var(--color-azul-texto)" },
    ".etiqueta[data-tono='verde']": { backgroundColor: "var(--color-verde-fondo)", color: "var(--color-verde-texto)" },
    ".etiqueta[data-tono='naranjo']": { backgroundColor: "var(--color-naranjo-fondo)", color: "var(--color-naranjo-texto)" },
    ".etiqueta[data-tono='rojo']": { backgroundColor: "var(--color-rojo-fondo)", color: "var(--color-rojo-texto)" },

    /* ---------------------------------------------------------------
     * Boton -- la accion principal de una pantalla o formulario.
     * ------------------------------------------------------------- */
    ".boton": {
      display: "inline-block",
      padding: "var(--esp-3) var(--esp-4)",
      borderRadius: "var(--radio)",
      border: "0",
      backgroundColor: "var(--color-azul-oscuro)",
      color: "#fff",
      fontWeight: "600",
      fontSize: "var(--t-cuerpo)",
      cursor: "pointer",
    },
    ".boton:hover": { backgroundColor: "var(--color-navy)" },
    ".boton:disabled": { backgroundColor: "#b7c3d0", cursor: "not-allowed" },
    ".boton.secundario": {
      backgroundColor: "var(--color-superficie)",
      color: "var(--color-titulo)",
      border: "1px solid var(--color-borde)",
    },
    ".boton.secundario:hover": { backgroundColor: "var(--color-gris-fondo)" },
    ".boton.peligro": {
      backgroundColor: "var(--color-superficie)",
      color: "var(--color-rojo-texto)",
      border: "1px solid #f0c4c1",
    },
    ".boton.peligro:hover": { backgroundColor: "var(--color-rojo-fondo)" },

    /* ---------------------------------------------------------------
     * Estado "guardando" -- el texto real sigue ahi (oculto con
     * color:transparent, no con display:none/opacity:0) para que el
     * boton ocupe exactamente el mismo espacio; el ::after superpone
     * el texto de carga encima.
     * ------------------------------------------------------------- */
    ".boton[data-cargando]": { position: "relative", color: "transparent", cursor: "not-allowed" },
    ".boton[data-cargando]::after": {
      content: '"Guardando…"',
      position: "absolute",
      inset: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
    },
    ".boton.secundario[data-cargando]::after": { color: "var(--color-titulo)" },
    ".boton.peligro[data-cargando]::after": { color: "var(--color-rojo-texto)" },

    /* ---------------------------------------------------------------
     * Grupo de botones -- botones de accion visualmente unidos (ej.
     * "Aprobar / Rechazar / Revisar" en una fila de bandeja).
     * ------------------------------------------------------------- */
    ".grupo-botones": { display: "inline-flex", maxWidth: "100%", overflowX: "auto" },
    ".grupo-botones .boton": { borderRadius: "var(--radio)", marginLeft: "-1px" },
    ".grupo-botones .boton:first-child": { borderRadius: "var(--radio)", marginLeft: "0" },
    ".grupo-botones .boton:last-child": { borderRadius: "var(--radio)" },
    ".grupo-botones .boton.secundario": { position: "relative" },
    ".grupo-botones .boton.secundario:hover": { zIndex: "1" },

    /* Boton chico -- accion secundaria en una fila o celda de tabla. */
    ".btn-chico": { fontSize: "var(--t-menor)", padding: "var(--esp-1) var(--esp-2)" },
    "a.btn-chico": {
      display: "inline-block",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      backgroundColor: "var(--color-superficie)",
      color: "var(--color-titulo)",
      textDecoration: "none",
    },
    "a.btn-chico:hover": { borderColor: "var(--color-azul)", backgroundColor: "#f6faff" },
    "a.btn-chico.peligro": { color: "var(--color-rojo-texto)", borderColor: "#f0c4c1" },
    "a.btn-chico.peligro:hover": {
      backgroundColor: "var(--color-rojo-fondo)",
      borderColor: "var(--color-rojo)",
    },

    /* Pastilla -- decision clicable con forma de boton, no de etiqueta. */
    ".pastilla": {
      display: "inline-block",
      padding: "var(--esp-1) var(--esp-4)",
      borderRadius: "var(--radio-pastilla)",
      fontSize: "var(--t-menor)",
      fontWeight: "600",
      lineHeight: "1.35",
      border: "1px solid transparent",
      cursor: "pointer",
      textDecoration: "none",
      fontFamily: "inherit",
      whiteSpace: "nowrap",
    },
    ".pastilla[data-tono='celeste']": {
      backgroundColor: "var(--color-azul-fondo)",
      borderColor: "#cfe0f6",
      color: "var(--color-azul-texto)",
    },
    ".pastilla[data-tono='celeste']:hover": { backgroundColor: "#d7e7fa" },
    ".pastilla[data-tono='roja']": {
      backgroundColor: "var(--color-rojo-fondo)",
      borderColor: "#f3d3cf",
      color: "var(--color-rojo-texto)",
    },
    ".pastilla[data-tono='roja']:hover": { backgroundColor: "#fbdedb" },
    ".pastilla:disabled": { opacity: "0.55", cursor: "default" },

    /* ---------------------------------------------------------------
     * Aviso -- banner de nivel de pantalla completa (no por fila).
     * ------------------------------------------------------------- */
    ".aviso": {
      padding: "var(--esp-3) var(--esp-4)",
      borderRadius: "var(--radio)",
      fontSize: "var(--t-cuerpo)",
      marginBottom: "var(--esp-4)",
      borderLeft: "4px solid",
    },
    ".aviso[data-tono='info']": { backgroundColor: "var(--color-azul-fondo)", borderColor: "var(--color-azul)", color: "var(--color-azul-texto)" },
    ".aviso[data-tono='ok']": { backgroundColor: "var(--color-verde-fondo)", borderColor: "var(--color-verde)", color: "var(--color-verde-texto)" },
    ".aviso[data-tono='alerta']": {
      backgroundColor: "var(--color-naranjo-fondo)",
      borderColor: "var(--color-naranjo)",
      color: "var(--color-naranjo-texto)",
    },
    ".aviso[data-tono='error']": { backgroundColor: "var(--color-rojo-fondo)", borderColor: "var(--color-rojo)", color: "var(--color-rojo-texto)" },

    /* ---------------------------------------------------------------
     * Aviso de pagina -- de GOV.UK "notification banner"/USWDS "site
     * alert": a diferencia de `.aviso` (dentro de una tarjeta) y
     * `.toast` (transitorio, esquina), esta es una franja fija bajo la
     * cabecera para algo persistente a nivel de pantalla completa
     * (ej. "Hay 3 solicitudes pendientes de tu aprobacion").
     * ------------------------------------------------------------- */
    ".aviso-pagina": {
      padding: "var(--esp-4) var(--esp-6)",
      fontSize: "var(--t-cuerpo)",
      borderBottom: "1px solid var(--color-borde)",
    },
    ".aviso-pagina strong": { display: "block", marginBottom: "var(--esp-1)" },
    ".aviso-pagina[data-tono='info']": { backgroundColor: "var(--color-azul-fondo)", color: "var(--color-azul-texto)" },
    ".aviso-pagina[data-tono='ok']": { backgroundColor: "var(--color-verde-fondo)", color: "var(--color-verde-texto)" },
    ".aviso-pagina[data-tono='alerta']": { backgroundColor: "var(--color-naranjo-fondo)", color: "var(--color-naranjo-texto)" },
    ".aviso-pagina[data-tono='error']": { backgroundColor: "var(--color-rojo-fondo)", color: "var(--color-rojo-texto)" },

    /* ---------------------------------------------------------------
     * Reintento en listados -- banner de error + boton "Reintentar"
     * cuando falla una carga/actualizacion. Mismos tonos que `.aviso`,
     * el JS vive en `/js` (`iniciarReintento`) -- el loader real
     * (el fetch de verdad) lo da el consumidor.
     * ------------------------------------------------------------- */
    ".lista-error": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--esp-4)",
      padding: "var(--esp-3) var(--esp-4)",
      borderRadius: "var(--radio)",
      fontSize: "var(--t-cuerpo)",
      marginBottom: "var(--esp-4)",
      borderLeft: "4px solid var(--color-rojo)",
      backgroundColor: "var(--color-rojo-fondo)",
      color: "var(--color-rojo-texto)",
    },
    ".lista-error [data-reintentar]": {
      border: "1px solid var(--color-rojo-texto)",
      backgroundColor: "transparent",
      color: "var(--color-rojo-texto)",
      borderRadius: "var(--radio)",
      padding: "var(--esp-2) var(--esp-3)",
      fontWeight: "600",
      fontSize: "var(--t-cuerpo)",
      cursor: "pointer",
      flex: "none",
    },
    ".lista-error [data-reintentar]:hover": { opacity: "0.75" },

    /* ---------------------------------------------------------------
     * Campo -- un control de formulario con su etiqueta y ayuda.
     * ------------------------------------------------------------- */
    ".campo": { marginBottom: "var(--esp-4)" },
    ".campo label": {
      display: "block",
      fontSize: "var(--t-cuerpo)",
      fontWeight: "600",
      color: "var(--color-titulo)",
      marginBottom: "var(--esp-1)",
    },
    ".campo .ayuda": { fontSize: "var(--t-menor)", color: "var(--color-tenue)", margin: "var(--esp-1) 0 0" },
    ".campo-error": {
      display: "flex",
      alignItems: "center",
      gap: "var(--esp-1)",
      fontSize: "var(--t-menor)",
      color: "var(--color-rojo-texto)",
      margin: "var(--esp-1) 0 0",
    },
    [[
      "input[type=text]",
      "input[type=number]",
      "input[type=email]",
      "input[type=tel]",
      "input[type=date]",
      "input[type=search]",
      "input[type=password]",
      "select",
      "textarea",
    ].join(", ")]: {
      width: "100%",
      padding: "var(--esp-3) var(--esp-3)",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      fontSize: "var(--t-cuerpo)",
      backgroundColor: "var(--color-superficie)",
      color: "var(--color-texto)",
    },
    textarea: { resize: "vertical", minHeight: "88px" },
    "input:disabled, input[readonly]": { backgroundColor: "var(--color-gris-fondo)", color: "var(--color-tenue)" },
    /* Error de campo -- complementa `.resumen-errores` (0.16.0): el
       resumen enlaza al campo, esto muestra por que, junto al control.
       Selector de atributo (no una lista de input[type=...]) para que
       aplique igual a select/textarea sin repetirla. Va DESPUES del
       bloque de controles de arriba (misma especificidad, mismo layer
       -- si fuera antes, pierde contra el `border` sin condicion de
       ese bloque, como ya paso una vez con `.popover-panel`). */
    /* Especificidad a proposito: igual o mayor que `input[type=text]`
       etc. del bloque de arriba (element+atributo = 0,1,1) -- un
       selector de atributo solo (`[aria-invalid=true]`, 0,1,0) pierde
       contra esas reglas sin importar el orden (se vio al verificar:
       el borde se quedaba en gris). */
    "input[aria-invalid='true'], select[aria-invalid='true'], textarea[aria-invalid='true']": {
      borderColor: "var(--color-rojo)",
    },
    "input[aria-invalid='true']:focus-visible, select[aria-invalid='true']:focus-visible, textarea[aria-invalid='true']:focus-visible": {
      outline: "2px solid var(--color-rojo)",
      outlineOffset: "2px",
    },
    ".fila": { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "var(--esp-4)" },

    /* ---------------------------------------------------------------
     * Seccion de formulario -- agrupa los `.campo` de un formulario
     * largo bajo un titulo, en vez de dejarlos todos sueltos uno tras
     * otro (hoy `solicitud_form.html` solo tiene `h2.seccion` para
     * separar bloques, sin agrupar visualmente los campos de cada uno).
     * ------------------------------------------------------------- */
    ".formulario-seccion": { marginBottom: "var(--esp-6)" },
    ".formulario-seccion + .formulario-seccion": {
      borderTop: "1px solid var(--color-borde)",
      paddingTop: "28px",
    },
    ".formulario-seccion-titulo": { color: "var(--color-titulo)", margin: "0 0 var(--esp-1)", fontSize: "var(--t-lead)" },
    ".formulario-seccion-nota": { color: "var(--color-tenue)", margin: "0 0 var(--esp-4)", fontSize: "var(--t-cuerpo)" },

    /* ---------------------------------------------------------------
     * Barra de acciones fija -- Guardar/Cancelar siempre al alcance en
     * un formulario largo, sin tapar contenido (position:sticky, no
     * fixed -- se acomoda al ancho real de su contenedor). Reusa
     * --z-flotante, igual criterio que `.tabla-cabecera-fija`.
     * ------------------------------------------------------------- */
    ".formulario-acciones-fijas": {
      position: "sticky",
      bottom: "0",
      display: "flex",
      gap: "var(--esp-3)",
      justifyContent: "flex-end",
      backgroundColor: "var(--color-superficie)",
      borderTop: "1px solid var(--color-borde)",
      padding: "var(--esp-4) 0",
      zIndex: "var(--z-flotante)",
    },

    /* select -- quita la flecha del sistema operativo, pone una de marca. */
    select: {
      appearance: "none",
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%235b6b7c' d='M1 1l5 5 5-5'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
      paddingRight: "32px",
    },

    /* ---------------------------------------------------------------
     * Buscador -- input[type=search] ya trae el boton nativo de limpiar,
     * pero depende del navegador y no tiene icono. El JS vive en
     * `@sistema32/santacorina-ui/js` (`iniciarBuscadores`).
     * ------------------------------------------------------------- */
    ".buscador": { position: "relative", display: "block", width: "100%" },
    ".buscador input": {
      paddingLeft: "34px",
      paddingRight: "30px",
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 15 15'%3E%3Ccircle cx='6.5' cy='6.5' r='5' fill='none' stroke='%235b6b7c' stroke-width='1.5'/%3E%3Cline x1='10.3' y1='10.3' x2='14' y2='14' stroke='%235b6b7c' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "10px center",
    },
    ".buscador .limpiar": {
      display: "none",
      position: "absolute",
      right: "6px",
      top: "50%",
      transform: "translateY(-50%)",
      border: "0",
      backgroundColor: "transparent",
      cursor: "pointer",
      color: "var(--color-tenue)",
      fontSize: "var(--t-lead)",
      lineHeight: "1",
      padding: "var(--esp-1)",
    },
    ".buscador .limpiar.visible": { display: "block" },
    ".buscador .limpiar:hover": { color: "var(--color-titulo)" },
    ".buscador input::-webkit-search-cancel-button": { appearance: "none" },

    /* ---------------------------------------------------------------
     * Grupo de campo -- prefijo/sufijo pegado a un input (ej. "$" en un
     * monto -- esta plataforma maneja pesos en cada tabla).
     * ------------------------------------------------------------- */
    ".grupo-campo": {
      display: "flex",
      alignItems: "stretch",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      overflow: "hidden",
      backgroundColor: "var(--color-superficie)",
    },
    ".grupo-campo .prefijo, .grupo-campo .sufijo": {
      display: "flex",
      alignItems: "center",
      padding: "0 var(--esp-3)",
      backgroundColor: "var(--color-gris-fondo)",
      color: "var(--color-tenue)",
      fontSize: "var(--t-cuerpo)",
      whiteSpace: "nowrap",
    },
    ".grupo-campo .prefijo": { borderRight: "1px solid var(--color-borde)" },
    ".grupo-campo .sufijo": { borderLeft: "1px solid var(--color-borde)" },
    ".grupo-campo input": { border: "0", borderRadius: "var(--radio)", flex: "1", minWidth: "0" },
    ".grupo-campo input:focus-visible": { outline: "0" },

    /* ---------------------------------------------------------------
     * Barra de filtros -- agrupa `.buscador` + campos sueltos + `.chip`
     * (ya existentes, sin cambios) + "Limpiar filtros" en una sola
     * fila. En movil pasa a columna (ver el bloque 600px mas abajo,
     * fusionado ahi -- no una clave nueva) sin reordenar los hijos.
     * ------------------------------------------------------------- */
    ".barra-filtros": {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "var(--esp-3)",
      padding: "var(--esp-4) var(--esp-4)",
      backgroundColor: "var(--color-superficie)",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      marginBottom: "var(--esp-4)",
    },
    ".barra-filtros .buscador": { flex: "1 1 220px", minWidth: "180px", width: "auto" },
    ".barra-filtros select": { width: "auto", flex: "0 1 170px" },
    ".barra-filtros .limpiar-filtros": {
      marginLeft: "auto",
      border: "0",
      backgroundColor: "transparent",
      color: "var(--color-azul-texto)",
      fontSize: "var(--t-cuerpo)",
      fontWeight: "600",
      cursor: "pointer",
      padding: "0",
    },
    ".barra-filtros .limpiar-filtros:hover": { textDecoration: "underline" },

    /* ---------------------------------------------------------------
     * Barra de seleccion -- calcada de `.total-caja`: "N
     * seleccionados" + acciones. `iniciarSeleccionTabla` la
     * muestra/oculta agregando/quitando `.visible` segun haya o no
     * filas marcadas en `table[data-seleccion]`.
     * ------------------------------------------------------------- */
    ".barra-seleccion": {
      display: "none",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--esp-4)",
      flexWrap: "wrap",
      backgroundColor: "var(--color-navy)",
      color: "#fff",
      borderRadius: "var(--radio)",
      padding: "var(--esp-3) var(--esp-4)",
      marginBottom: "var(--esp-4)",
    },
    ".barra-seleccion.visible": { display: "flex" },
    ".barra-seleccion span": { fontSize: "var(--t-cuerpo)", fontWeight: "600" },
    ".barra-seleccion .acciones": { display: "flex", gap: "var(--esp-2)", flexWrap: "wrap" },
    "table[data-seleccion] th:has([data-seleccionar-todo])": { width: "1%" },
    "table[data-seleccion] td:has([data-seleccionar-fila])": { width: "1%" },

    /* ---------------------------------------------------------------
     * Contador de caracteres -- para un textarea con `maxlength`. El JS
     * vive en `@sistema32/santacorina-ui/js` (`iniciarContadores`).
     * ------------------------------------------------------------- */
    ".contador-caracteres": {
      display: "block",
      textAlign: "right",
      fontSize: "var(--t-menor)",
      color: "var(--color-tenue)",
      marginTop: "var(--esp-1)",
    },
    ".contador-caracteres.cerca": { color: "var(--color-naranjo-texto)" },
    ".contador-caracteres.lleno": { color: "var(--color-rojo-texto)", fontWeight: "600" },

    /* ---------------------------------------------------------------
     * Checkbox / radio -- nativos, solo con el color de marca (en vez
     * de reconstruirlos con un input oculto + div decorado: el navegador
     * ya resuelve foco, teclado y el estado marcado/sin marcar).
     * ------------------------------------------------------------- */
    "input[type=checkbox], input[type=radio]": {
      accentColor: "var(--color-azul)",
      width: "17px",
      height: "17px",
      cursor: "pointer",
    },
    ".campo-check": { display: "flex", alignItems: "center", gap: "var(--esp-2)", marginBottom: "var(--esp-3)" },
    ".campo-check label": { margin: "0", fontWeight: "400", color: "var(--color-texto)", cursor: "pointer" },

    /* `fieldset`/`legend` -- el HTML nativo correcto para agrupar un
       conjunto de `.campo-check` bajo una sola pregunta ("Elige una
       opcion"). Antes solo existia el estilo del item individual. */
    "fieldset.campo-grupo": { border: "1px solid var(--color-borde)", borderRadius: "var(--radio)", padding: "var(--esp-4) var(--esp-4)", marginBottom: "var(--esp-4)" },
    "fieldset.campo-grupo legend": { padding: "0 var(--esp-2)", fontSize: "var(--t-cuerpo)", fontWeight: "600", color: "var(--color-titulo)" },
    "fieldset.campo-grupo .campo-check:last-child": { marginBottom: "0" },

    /* ---------------------------------------------------------------
     * Filas repetibles -- contactos, partidas u otros grupos de campos
     * que se repiten. El JS vive en `/js` (`iniciarGruposRepetibles`):
     * clona un `<template>`, reindexa `name`/`id`/`for` y conecta
     * "Agregar otro"/"Quitar". Las filas son `.campo`/inputs normales
     * -- `iniciarFormularios` ya las valida sin cambios.
     * ------------------------------------------------------------- */
    ".grupo-repetible-fila": {
      display: "flex",
      gap: "var(--esp-3)",
      alignItems: "flex-end",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      padding: "var(--esp-4) var(--esp-4)",
      marginBottom: "var(--esp-3)",
    },
    ".grupo-repetible-fila > :first-child": { flex: "1", minWidth: "0" },
    ".grupo-repetible-fila [data-quitar-fila]": { flex: "none" },

    /* input[type=file] -- solo el boton "Elegir archivo"; el cuadro de
       dialogo del sistema operativo no se toca. */
    "input[type=file]::file-selector-button": {
      padding: "var(--esp-2) var(--esp-4)",
      borderRadius: "var(--radio)",
      border: "1px solid var(--color-borde)",
      backgroundColor: "var(--color-gris-fondo)",
      color: "var(--color-titulo)",
      fontWeight: "600",
      fontSize: "var(--t-cuerpo)",
      cursor: "pointer",
      marginRight: "var(--esp-3)",
    },
    "input[type=file]::file-selector-button:hover": { backgroundColor: "#e6eaef" },

    /* input[type=range] -- mismos colores que `.barra-progreso`. */
    "input[type=range]": {
      appearance: "none",
      width: "100%",
      height: "7px",
      borderRadius: "var(--radio-pastilla)",
      backgroundColor: "#e8ebef",
      cursor: "pointer",
    },
    "input[type=range]::-webkit-slider-thumb": {
      appearance: "none",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      backgroundColor: "var(--color-azul)",
      border: "2px solid #fff",
      boxShadow: "0 1px 3px rgba(12, 45, 74, 0.35)",
    },
    "input[type=range]::-moz-range-thumb": {
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      backgroundColor: "var(--color-azul)",
      border: "2px solid #fff",
      boxShadow: "0 1px 3px rgba(12, 45, 74, 0.35)",
    },
    "input[type=range]::-moz-range-track": { height: "7px", borderRadius: "var(--radio-pastilla)", backgroundColor: "#e8ebef" },

    /* ---------------------------------------------------------------
     * Tabla -- base de cualquier listado tabular.
     * ------------------------------------------------------------- */
    table: { width: "100%", borderCollapse: "collapse", fontSize: "var(--t-cuerpo)" },
    th: {
      textAlign: "left",
      fontSize: "var(--t-menor)",
      fontWeight: "600",
      color: "var(--color-tenue)",
      padding: "var(--esp-2) var(--esp-3)",
      borderBottom: "2px solid var(--color-borde)",
    },
    td: { padding: "var(--esp-3) var(--esp-3)", borderBottom: "1px solid var(--color-borde)", verticalAlign: "top" },
    "tr:last-child td": { borderBottom: "0" },
    ".tabla-scroll": {
      overflowX: "auto",
      scrollbarColor: "var(--color-borde) transparent",
      scrollbarWidth: "thin",
    },
    ".tabla-scroll::-webkit-scrollbar": { height: "8px" },
    ".tabla-scroll::-webkit-scrollbar-thumb": { backgroundColor: "var(--color-borde)", borderRadius: "var(--radio-pastilla)" },
    ".tabla-scroll::-webkit-scrollbar-track": { backgroundColor: "transparent" },
    "td.peso, th.der, td.der": { textAlign: "right" },
    "td.peso": { fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" },
    "th.cen, td.cen": { textAlign: "center" },
    // td.codigo lleva identificadores literales (clases, funciones, RUT): es codigo.
    "td.codigo": { fontFamily: "ui-monospace, Consolas, monospace", fontSize: "var(--t-menor)" }, // taste-skill-ignore
    /* Celda de dos lineas -- de acepta/frontend (41 ocurrencias reales:
       "Factura N / fecha-tipo DTE", "Proveedor / RUT", "OC / nombre
       OC"). No es una clase nueva, era una regla que faltaba aca. */
    "td strong, td small": { display: "block" },
    "td small": { color: "var(--color-tenue)", marginTop: "var(--esp-1)", fontSize: "var(--t-menor)", lineHeight: "1.35" },

    /* Variantes de tabla -- para listados largos (presupuestos,
       facturas): encabezado fijo al hacer scroll vertical dentro de un
       contenedor con altura, y densidad compacta. `.tabla-cabecera-fija`
       reusa `--z-flotante` (0.18.0) en vez de inventar otro numero. */
    ".tabla-cabecera-fija thead th": {
      position: "sticky",
      top: "0",
      backgroundColor: "var(--color-superficie)",
      zIndex: "var(--z-flotante)",
    },
    ".tabla-compacta th": { padding: "var(--esp-2) var(--esp-2)" },
    ".tabla-compacta td": { padding: "var(--esp-2) var(--esp-2)" },

    /* Densidad por bloque -- generaliza `.tabla-compacta` (una sola
     * tabla) a cualquier contenedor, mismo criterio que `data-tono`/
     * `data-tamano` (0.17.0): un atributo, no una clase nueva por
     * componente. Una tabla puede usar `[data-densidad="compacta"]`
     * mientras el formulario vecino sigue con controles comodos --
     * `.tabla-compacta` queda intacta (equivale a aplicar el atributo
     * solo a esa tabla).
     */
    "[data-densidad='compacta'] .campo": { marginBottom: "var(--esp-3)" },
    "[data-densidad='compacta'] .tarjeta": { padding: "var(--esp-3) var(--esp-4)", marginBottom: "var(--esp-3)" },
    "[data-densidad='compacta'] table th": { padding: "var(--esp-2) var(--esp-2)" },
    "[data-densidad='compacta'] table td": { padding: "var(--esp-2) var(--esp-2)" },

    /* Encabezado de tabla ordenable -- de Carbon Design System (tabla
       de datos). Solo la flecha y el estado `[aria-sort]`; el JS vive
       en `/js` (`iniciarTablasOrdenables`) y solo dispara un evento --
       quien reordena las filas es el consumidor. */
    "th[data-ordenable]": { cursor: "pointer", userSelect: "none", paddingRight: "20px", position: "relative" },
    "th[data-ordenable]:hover": { color: "var(--color-titulo)" },
    "th[data-ordenable]::after": {
      content: '""',
      position: "absolute",
      right: "6px",
      top: "50%",
      width: "0",
      height: "0",
      borderLeft: "4px solid transparent",
      borderRight: "4px solid transparent",
      opacity: "0.35",
    },
    "th[data-ordenable][aria-sort=none]::after": { borderBottom: "5px solid currentColor", transform: "translateY(-6px)" },
    "th[data-ordenable][aria-sort=ascending]::after": { borderBottom: "5px solid var(--color-azul)", transform: "translateY(-6px)", opacity: "1" },
    "th[data-ordenable][aria-sort=descending]::after": { borderTop: "5px solid var(--color-azul)", transform: "translateY(1px)", opacity: "1" },

    /* ---------------------------------------------------------------
     * Resumen de revision -- de GOV.UK "check your answers": pares
     * clave/valor con un link "Cambiar" por fila, para la pantalla de
     * revision antes de enviar un formulario multi-paso (cierra el
     * flujo de `.asistente`/`.paso`).
     * ------------------------------------------------------------- */
    ".resumen-revision": { border: "1px solid var(--color-borde)", borderRadius: "var(--radio)", overflow: "hidden" },
    ".resumen-revision-item": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "var(--esp-4)",
      padding: "var(--esp-3) var(--esp-4)",
      borderBottom: "1px solid var(--color-borde)",
      fontSize: "var(--t-cuerpo)",
    },
    ".resumen-revision-item:last-child": { borderBottom: "0" },
    ".resumen-revision-item span": { color: "var(--color-tenue)" },
    ".resumen-revision-item strong": { color: "var(--color-titulo)", fontWeight: "600" },
    ".resumen-revision-item .cambiar": { color: "var(--color-azul-texto)", fontSize: "var(--t-cuerpo)", fontWeight: "600", flex: "none" },
    ".resumen-revision-item .cambiar:hover": { textDecoration: "underline" },

    /* ---------------------------------------------------------------
     * Comparacion de valores -- vista antes/despues para revisar un
     * cambio (ej. aprobar una edicion de solicitud). Misma estructura
     * visual que `.resumen-revision` (par clave/valor), pero con DOS
     * valores por fila en vez de uno. Se apila en movil/contenedor
     * angosto (ver los bloques de @media 600px / @container 480px).
     * ------------------------------------------------------------- */
    ".comparacion-valores": { border: "1px solid var(--color-borde)", borderRadius: "var(--radio)", overflow: "hidden" },
    ".comparacion-valores-item": {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "var(--esp-4)",
      alignItems: "center",
      padding: "var(--esp-3) var(--esp-4)",
      borderBottom: "1px solid var(--color-borde)",
      fontSize: "var(--t-cuerpo)",
    },
    ".comparacion-valores-item:last-child": { borderBottom: "0" },
    ".comparacion-valores-item > span:first-child": { color: "var(--color-tenue)" },
    ".comparacion-valores-item .anterior": { color: "var(--color-rojo-texto)", textDecoration: "line-through" },
    ".comparacion-valores-item .nuevo": { color: "var(--color-verde-texto)", fontWeight: "600" },

    /* ---------------------------------------------------------------
     * Resumen de errores -- el patron de accesibilidad de formularios
     * mas documentado de GOV.UK (design-system.service.gov.uk/
     * components/error-summary): lista cada error con un link al
     * campo, recibe el foco apenas se renderiza (lo hace
     * `iniciarResumenErrores` en `/js`) para que un lector de pantalla
     * lo anuncie antes de llegar al formulario.
     * ------------------------------------------------------------- */
    ".resumen-errores": {
      border: "1px solid #f0c4c1",
      backgroundColor: "#fdf4f3",
      borderRadius: "var(--radio)",
      padding: "var(--esp-4) var(--esp-4)",
      marginBottom: "var(--esp-5)",
    },
    ".resumen-errores h2": { margin: "0 0 var(--esp-3)", fontSize: "var(--t-cuerpo)", color: "var(--color-rojo-texto)" },
    ".resumen-errores ul": { margin: "0", padding: "0 0 0 var(--esp-4)", fontSize: "var(--t-cuerpo)" },
    ".resumen-errores li": { marginBottom: "var(--esp-1)" },
    ".resumen-errores a": { color: "var(--color-rojo-texto)", fontWeight: "600" },
    ".resumen-errores a:hover": { textDecoration: "underline" },

    /* ---------------------------------------------------------------
     * Dato -- par etiqueta/valor, la unidad minima de cualquier resumen.
     * ------------------------------------------------------------- */
    ".dato": {
      display: "flex",
      justifyContent: "space-between",
      gap: "var(--esp-4)",
      padding: "var(--esp-2) 0",
      borderBottom: "1px solid var(--color-borde)",
      fontSize: "var(--t-cuerpo)",
    },
    ".dato:last-child": { borderBottom: "0" },
    ".dato span": { color: "var(--color-tenue)" },
    ".dato strong": { textAlign: "right", color: "var(--color-titulo)", fontWeight: "600" },

    /* Ficha -- grilla de datos, para resumenes mas anchos que una columna. */
    ".ficha": {
      backgroundColor: "var(--color-gris-fondo)",
      borderRadius: "var(--radio)",
      padding: "var(--esp-4) var(--esp-4)",
      marginBottom: "var(--esp-5)",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
      gap: "var(--esp-3)",
    },
    ".ficha div span": {
      display: "block",
      fontSize: "var(--t-menor)",
      color: "var(--color-tenue)",
    },
    ".ficha div strong": { fontSize: "var(--t-cuerpo)", color: "var(--color-titulo)", fontWeight: "600" },

    /* ---------------------------------------------------------------
     * Luz / semaforo -- punto de estado, para listas de validacion.
     * ------------------------------------------------------------- */
    ".luz": {
      width: "13px",
      height: "13px",
      borderRadius: "50%",
      flex: "0 0 13px",
      marginTop: "var(--esp-1)",
      display: "inline-block",
    },
    ".luz[data-tono='verde']": { backgroundColor: "var(--color-verde)" },
    ".luz[data-tono='naranjo']": { backgroundColor: "var(--color-naranjo)" },
    ".luz[data-tono='rojo']": { backgroundColor: "var(--color-rojo)" },
    ".luz[data-tono='gris']": { backgroundColor: "var(--color-gris)" },

    /* ---------------------------------------------------------------
     * Linea de tiempo -- historial de eventos, mas reciente abajo.
     * ------------------------------------------------------------- */
    ".linea-tiempo": { listStyle: "none", margin: "0", padding: "0" },
    ".linea-tiempo li": {
      padding: "var(--esp-3) 0 var(--esp-3) var(--esp-5)",
      borderLeft: "2px solid var(--color-borde)",
      position: "relative",
    },
    ".linea-tiempo li::before": {
      content: "''",
      position: "absolute",
      left: "-6px",
      top: "16px",
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: "var(--color-azul)",
    },
    ".linea-tiempo .ts": { fontSize: "var(--t-menor)", color: "var(--color-tenue)" },
    ".linea-tiempo .txt": { fontSize: "var(--t-cuerpo)" },

    /* ---------------------------------------------------------------
     * Estado vacio -- cuando un listado no tiene filas que mostrar.
     * ------------------------------------------------------------- */
    ".vacio": { textAlign: "center", padding: "var(--esp-6) var(--esp-5)", color: "var(--color-tenue)" },

    /* ---------------------------------------------------------------
     * Lista de grupo -- lista vertical de items clicables/seleccionables
     * con borde, distinta de `.lateral .item` (solo del menu) y de una
     * tabla (no tiene columnas).
     * ------------------------------------------------------------- */
    ".lista-grupo": {
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      overflow: "hidden",
    },
    ".lista-grupo-item": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--esp-3)",
      padding: "var(--esp-3) var(--esp-4)",
      borderBottom: "1px solid var(--color-borde)",
      color: "var(--color-texto)",
      backgroundColor: "var(--color-superficie)",
    },
    "a.lista-grupo-item, button.lista-grupo-item": { cursor: "pointer", width: "100%", textAlign: "left", border: "0" },
    "a.lista-grupo-item:hover, button.lista-grupo-item:hover": { backgroundColor: "var(--color-gris-fondo)" },
    ".lista-grupo-item:last-child": { borderBottom: "0" },
    ".lista-grupo-item.activo": { backgroundColor: "var(--color-azul-fondo)", color: "var(--color-azul-texto)", fontWeight: "600" },
    ".vacio p": { margin: "0 0 var(--esp-4)" },

    ".tenue": { color: "var(--color-tenue)" },

    /* ---------------------------------------------------------------
     * Columnas -- layout de pantalla de detalle (ancho variable, nunca
     * tres columnas iguales: la del medio es la que lleva el contenido
     * principal). Se achica a una sola columna en pantallas angostas.
     * ------------------------------------------------------------- */
    ".columnas": {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr) minmax(0, 0.85fr)",
      gap: "var(--esp-4)",
      alignItems: "start",
    },
    ".columnas.columnas-2": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
    ".columnas.columnas-4": { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" },
    /* Gutters -- control de espaciado de Bootstrap ("gutters"), sin
       crear un segundo sistema de grid: son modificadores del mismo
       `.columnas` de siempre (default sin clase extra: 18px). */
    ".columnas.gutters-0": { gap: "0" },
    ".columnas.gutters-chico": { gap: "var(--esp-2)" },
    ".columnas.gutters-grande": { gap: "var(--esp-6)" },
    "@media (max-width: 1150px)": {
      ".columnas, .columnas.columnas-2, .columnas.columnas-4": { gridTemplateColumns: "1fr" },
    },

    /* ---------------------------------------------------------------
     * Container / container-fluid -- de Bootstrap (Layout): un
     * contenedor centrado reusable *fuera* del armazon `.app`/
     * `.principal` (ese ya tiene `.contenido`/`.contenido.ancho`, que
     * sigue siendo lo correcto dentro del armazon). Pensado para una
     * pantalla standalone (ej. un login) que no vive dentro de
     * `.app`.
     * ------------------------------------------------------------- */
    ".contenedor": { width: "100%", marginInline: "auto", paddingInline: "20px" },
    ".contenedor-fluido": { width: "100%", paddingInline: "20px" },
    "@media (min-width: 600px)": { ".contenedor": { maxWidth: "600px" } },
    "@media (min-width: 900px)": { ".contenedor": { maxWidth: "900px" } },
    "@media (min-width: 1150px)": { ".contenedor": { maxWidth: "1150px" } },

    /* ---------------------------------------------------------------
     * Masonry -- empaquetado tipo Pinterest via `columns` CSS, no
     * `grid-template-rows: masonry` (hoy solo Firefox tras flag) ni una
     * libreria JS: con soporte universal y sin JS alcanza.
     * ------------------------------------------------------------- */
    "@media (max-width: 560px)": {
      ".masonry": { columnCount: "1" },
      ".documento-fila": { gridTemplateColumns: "1fr auto" },
      ".documento-nombre": { gridColumn: "1 / -1" },
      ".hero": { padding: "var(--esp-5) var(--esp-5)" },
      ".hero h1": { fontSize: "var(--t-titulo)" },
    },

    /* ---------------------------------------------------------------
     * Hero -- banner de introduccion para un dashboard o pantalla de
     * bienvenida. Nuevo: no hay nada parecido hoy en sgp.
     * ------------------------------------------------------------- */
    ".hero": {
      backgroundColor: "var(--color-navy)",
      color: "#fff",
      borderRadius: "var(--radio)",
      padding: "var(--esp-6) var(--esp-6)",
      marginBottom: "var(--esp-5)",
    },
    ".hero h1": { margin: "0 0 var(--esp-3)", fontSize: "var(--t-titulo)" },
    ".hero p": { margin: "0 0 var(--esp-5)", maxWidth: "60ch", color: "#c9d6e4", fontSize: "var(--t-cuerpo)", lineHeight: "1.6" },
    ".hero .acciones": { display: "flex", gap: "var(--esp-3)", flexWrap: "wrap" },
    ".hero .boton.secundario": { backgroundColor: "rgba(255,255,255,0.12)", color: "#fff", border: "0" },
    ".hero .boton.secundario:hover": { backgroundColor: "rgba(255,255,255,0.2)" },

    /* ---------------------------------------------------------------
     * Tarjeta de accion -- de acepta/frontend/src/styles.css
     * (`.home-section-card`/`.process-card`), para grillas de acceso
     * rapido de un dashboard: icono + titulo + descripcion, clicable.
     * ------------------------------------------------------------- */
    ".tarjeta-accion": {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      minHeight: "154px",
      padding: "var(--esp-5)",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      backgroundColor: "var(--color-superficie)",
      color: "var(--color-texto)",
      textDecoration: "none",
      transition: "border-color 0.15s ease, background-color 0.15s ease, transform 0.15s ease",
    },
    ".tarjeta-accion:hover": {
      borderColor: "var(--color-azul-oscuro)",
      backgroundColor: "var(--color-gris-fondo)",
      transform: "translateY(-1px)",
    },
    ".tarjeta-accion .insignia-icono": { marginBottom: "var(--esp-4)" },
    ".tarjeta-accion strong": { fontSize: "var(--t-cuerpo)", fontWeight: "600" },
    ".tarjeta-accion small": { maxWidth: "260px", marginTop: "var(--esp-2)", color: "var(--color-tenue)", fontSize: "var(--t-menor)", lineHeight: "1.5" },

    /* ---------------------------------------------------------------
     * Modal -- superpuesto de pantalla completa + panel centrado.
     * Nuevo: generaliza los dos modales que ya existian cada uno a mano
     * (aviso de rechazo, progreso de actualizacion) en un solo par de
     * clases. El `.visible` lo pone JS al abrirlo; empieza oculto.
     * ------------------------------------------------------------- */
    ".modal": {
      position: "fixed",
      inset: "0",
      backgroundColor: "rgba(15, 23, 42, 0.55)",
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "var(--z-modal)",
      padding: "var(--esp-5)",
    },
    ".modal.visible": { display: "flex" },
    ".modal-panel": {
      backgroundColor: "var(--color-superficie)",
      borderRadius: "var(--radio)",
      padding: "var(--esp-5) var(--esp-6)",
      maxWidth: "620px",
      width: "100%",
      maxHeight: "82vh",
      overflow: "auto",
      boxShadow: "0 22px 60px rgba(4, 20, 36, 0.4)",
      containerType: "inline-size",
    },
    ".modal-panel h3": { margin: "0 0 var(--esp-3)", fontSize: "var(--t-lead)", color: "var(--color-titulo)" },
    ".modal-panel .cerrar": {
      marginTop: "var(--esp-4)",
      padding: "var(--esp-3) var(--esp-4)",
      border: "0",
      borderRadius: "var(--radio)",
      backgroundColor: "var(--color-azul)",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
    },
    ".modal-acciones": { display: "flex", justifyContent: "flex-end", gap: "var(--esp-3)", marginTop: "var(--esp-4)" },

    /* Vista previa de documentos -- .modal-panel con una imagen o un
     * PDF embebido (iframe) en vez de texto. El JS vive en `/js`
     * (`iniciarVistaPrevia`); solo visor, no sube ni descarga nada. */
    ".vista-previa-panel": { padding: "0", maxWidth: "900px", display: "flex", flexDirection: "column" },
    ".vista-previa-panel img": { display: "block", width: "100%", maxHeight: "80vh", objectFit: "contain" },
    ".vista-previa-panel iframe": { width: "100%", height: "75vh", border: "0" },
    ".vista-previa-panel .cerrar": { margin: "var(--esp-3)", alignSelf: "flex-end" },

    /* ---------------------------------------------------------------
     * Toast -- notificacion flotante que aparece y se retira sola.
     * Nuevo: no existia ninguna version de esto -- todo lo puntual usaba
     * `.aviso` (banner fijo en la pantalla, no algo que entra y sale).
     * ------------------------------------------------------------- */
    ".toast-contenedor": {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "var(--esp-3)",
      zIndex: "var(--z-toast)",
      maxWidth: "360px",
    },
    ".toast": {
      display: "flex",
      alignItems: "center",
      gap: "var(--esp-3)",
      minWidth: "220px",
      padding: "var(--esp-3) var(--esp-4)",
      borderRadius: "var(--radio)",
      backgroundColor: "var(--color-navy)",
      color: "#fff",
      fontSize: "var(--t-cuerpo)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      animation: "santacorina-toast-in 0.18s ease",
    },
    ".toast.ok": { backgroundColor: "var(--color-verde-texto)" },
    ".toast.alerta": { backgroundColor: "var(--color-naranjo-texto)" },
    ".toast.error": { backgroundColor: "var(--color-rojo-texto)" },
    ".toast .cerrar": {
      marginLeft: "auto",
      border: "0",
      background: "none",
      color: "inherit",
      opacity: "0.75",
      cursor: "pointer",
      fontSize: "var(--t-cuerpo)",
      lineHeight: "1",
      padding: "0",
    },
    ".toast .cerrar:hover": { opacity: "1" },
    "@keyframes santacorina-toast-in": {
      from: { opacity: "0", transform: "translateY(8px)" },
      to: { opacity: "1", transform: "translateY(0)" },
    },

    /* ---------------------------------------------------------------
     * Stepper -- consolida dos versiones que ya existian por separado:
     * `.paso-chip` (wizard de carga, el usuario avanza) y `.etapas-fila`
     * (estado de un proceso ya corrido, de solo lectura). Mismo lenguaje
     * visual, un solo nombre: `.stepper-paso` + estado.
     * ------------------------------------------------------------- */
    ".stepper": {
      listStyle: "none",
      margin: "0",
      padding: "0",
      display: "flex",
      gap: "var(--esp-2)",
      flexWrap: "wrap",
      alignItems: "center",
    },
    ".stepper-paso": {
      display: "flex",
      alignItems: "center",
      gap: "var(--esp-2)",
      padding: "var(--esp-2) var(--esp-4)",
      borderRadius: "var(--radio-pastilla)",
      backgroundColor: "var(--color-superficie)",
      border: "1px solid var(--color-borde)",
      fontSize: "var(--t-cuerpo)",
      color: "var(--color-tenue)",
    },
    ".stepper-paso .num": {
      width: "21px",
      height: "21px",
      borderRadius: "50%",
      backgroundColor: "var(--color-gris-fondo)",
      color: "var(--color-tenue)",
      display: "grid",
      placeItems: "center",
      fontSize: "var(--t-menor)",
      fontWeight: "700",
      flex: "none",
    },
    ".stepper-paso.activo": { borderColor: "var(--color-azul)", color: "var(--color-titulo)", fontWeight: "600" },
    ".stepper-paso.activo .num": { backgroundColor: "var(--color-azul)", color: "#fff" },
    ".stepper-paso.completado": { borderColor: "#bfe3ce", color: "var(--color-verde-texto)" },
    ".stepper-paso.completado .num": { backgroundColor: "var(--color-verde)", color: "#fff" },
    ".stepper-paso.rechazado": {
      borderColor: "#f0bdba",
      color: "var(--color-rojo-texto)",
      fontWeight: "600",
      backgroundColor: "#fdf4f3",
    },
    ".stepper-paso.rechazado .num": { backgroundColor: "var(--color-rojo)", color: "#fff" },
    ".stepper-paso.omitido": { opacity: "0.55", textDecoration: "line-through" },

    /* ---------------------------------------------------------------
     * Asistente -- trasladado de portal.css:43-54 (usado en 5 pantallas
     * reales: compras_dashboard, compras_solicitud, solicitud_form,
     * tesoreria_dashboard, tesoreria_solicitud). La fila de chips
     * reutiliza `.stepper`/`.stepper-paso` ya existente desde 0.1.0
     * (`.stepper-paso.completado` es el equivalente de lo que en esas
     * pantallas se llama `.paso-chip.listo`) -- lo que faltaba era el
     * panel de contenido y la fila de acciones. El JS vive en `/js`
     * (`irAPaso`/`iniciarAsistentes`): avanzar sigue siendo decision de
     * cada pantalla (valida antes de llamar `irAPaso`), el paquete solo
     * resuelve mostrar/ocultar y dejar volver a un paso ya completado.
     * ------------------------------------------------------------- */
    ".paso": { display: "none" },
    ".paso.visible": { display: "block" },
    ".acciones": {
      display: "flex",
      justifyContent: "space-between",
      gap: "var(--esp-3)",
      marginTop: "var(--esp-5)",
      flexWrap: "wrap",
    },

    /* ---------------------------------------------------------------
     * Rastreador de proceso -- trasladado de portal.css:230-248
     * (`.pasos-compra`, usado en compras_dashboard/compras_solicitud).
     * Nombre generico (no "-compra"): sirve para cualquier proceso de
     * varias etapas, no solo compras. Distinto de `.linea-tiempo` (solo
     * un log de eventos) y de `.stepper` (horizontal, sin descripcion).
     * ------------------------------------------------------------- */
    ".rastreador": {
      listStyle: "none",
      margin: "0",
      padding: "0",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
      gap: "var(--esp-3)",
    },
    ".rastreador-item": {
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      padding: "var(--esp-3) var(--esp-4)",
      backgroundColor: "var(--color-superficie)",
    },
    ".rastreador-item .n": {
      display: "inline-grid",
      placeItems: "center",
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      backgroundColor: "var(--color-gris-fondo)",
      color: "var(--color-tenue)",
      fontSize: "var(--t-menor)",
      fontWeight: "700",
      marginBottom: "var(--esp-2)",
    },
    ".rastreador-item .titulo": {
      display: "block",
      fontWeight: "600",
      color: "var(--color-titulo)",
      fontSize: "var(--t-cuerpo)",
      marginBottom: "var(--esp-1)",
    },
    ".rastreador-item .descripcion": { display: "block", fontSize: "var(--t-menor)", color: "var(--color-tenue)", lineHeight: "1.5" },
    ".rastreador-item .responsable": {
      display: "inline-block",
      marginTop: "var(--esp-2)",
      fontSize: "var(--t-menor)",
      color: "var(--color-tenue)",
      backgroundColor: "var(--color-gris-fondo)",
      padding: "var(--esp-1) var(--esp-2)",
      borderRadius: "var(--radio-pastilla)",
    },
    ".rastreador-item.hecho": { borderColor: "#bfe3ce", backgroundColor: "#f4faf6" },
    ".rastreador-item.hecho .n": { backgroundColor: "var(--color-verde)", color: "#fff" },
    ".rastreador-item.actual": { borderColor: "var(--color-azul)", borderLeftWidth: "4px" },
    ".rastreador-item.actual .n": { backgroundColor: "var(--color-azul)", color: "#fff" },
    ".rastreador-item.pendiente": { opacity: "0.62" },

    /* ---------------------------------------------------------------
     * Validacion -- trasladado de portal.css:56-62 (usado en 6
     * pantallas: atp_solicitud, presupuesto_solicitud,
     * rendicion_solicitud, revision_solicitud, solicitud_detalle,
     * solicitud_form). Siempre va junto a `.luz`, que ya existe.
     * ------------------------------------------------------------- */
    ".validacion": { display: "flex", gap: "var(--esp-3)", padding: "var(--esp-4) 0", borderBottom: "1px solid var(--color-borde)" },
    ".validacion:last-child": { borderBottom: "0" },
    ".validacion-txt": { flex: "1", minWidth: "0" },
    ".validacion-txt h4": { margin: "0 0 var(--esp-1)", fontSize: "var(--t-cuerpo)", color: "var(--color-titulo)" },
    ".validacion-txt p": { margin: "0", fontSize: "var(--t-cuerpo)", color: "var(--color-tenue)" },
    ".validacion-txt ul": { margin: "var(--esp-2) 0 0", paddingLeft: "19px", fontSize: "var(--t-cuerpo)", color: "var(--color-tenue)" },

    /* Detalle tecnico -- trasladado de portal.css:63-67, sobre
       `<details>` nativo (mismo criterio que `.acordeon`: el navegador
       resuelve abrir/cerrar), pensado para ir dentro de `.validacion-txt`. */
    ".detalle-tecnico": { marginTop: "var(--esp-2)", fontSize: "var(--t-menor)" },
    ".detalle-tecnico summary": { cursor: "pointer", color: "var(--color-azul)" },
    ".detalle-tecnico pre": {
      backgroundColor: "var(--color-gris-fondo)",
      padding: "var(--esp-3)",
      borderRadius: "var(--radio)",
      overflowX: "auto",
      margin: "var(--esp-2) 0 0",
      fontSize: "var(--t-menor)",
    },

    /* ---------------------------------------------------------------
     * Total -- trasladado de portal.css:68-71 (`.total-caja`, usado en
     * solicitud_form). Parecido a `.hero`, pero chico y pensado para ir
     * dentro de un formulario, no como banner de pagina.
     * ------------------------------------------------------------- */
    ".total-caja": {
      backgroundColor: "var(--color-navy)",
      color: "#fff",
      borderRadius: "var(--radio)",
      padding: "var(--esp-4) var(--esp-5)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "var(--esp-4)",
      flexWrap: "wrap",
    },
    ".total-caja span": { fontSize: "var(--t-cuerpo)", opacity: "0.82" },
    ".total-caja strong": { fontSize: "var(--t-titulo)", fontWeight: "700" },

    /* Columna ancha -- para usar dentro de .columnas/.fila/.masonry
       cuando un item debe ocupar todo el ancho de la grilla, en vez de
       un style inline por pantalla. */
    ".col-ancha": { gridColumn: "1 / -1" },

    /* ---------------------------------------------------------------
     * Barra de progreso -- generaliza `.barra-reparto` (existia solo
     * para presupuesto, con los mismos tres colores que ya son
     * semanticos en el resto de la libreria).
     * ------------------------------------------------------------- */
    ".barra-progreso": {
      height: "7px",
      borderRadius: "var(--radio-pastilla)",
      backgroundColor: "#e8ebef",
      overflow: "hidden",
    },
    ".barra-progreso .relleno": {
      height: "100%",
      borderRadius: "var(--radio-pastilla)",
      backgroundColor: "var(--color-azul)",
    },
    ".barra-progreso .relleno.alerta": { backgroundColor: "var(--color-naranjo)" },
    ".barra-progreso .relleno.pasada": { backgroundColor: "var(--color-rojo)" },

    /* ---------------------------------------------------------------
     * Tabs -- generaliza `.filtro-ver` (existia solo para la lista de
     * establecimientos). `.activo` en vez de `.elegido`: mismo nombre de
     * estado que usa `.stepper-paso`.
     * ------------------------------------------------------------- */
    ".tabs": { display: "inline-flex", gap: "var(--esp-1)", fontSize: "var(--t-cuerpo)" },
    ".tabs a, .tabs button": {
      padding: "var(--esp-1) var(--esp-3)",
      borderRadius: "var(--radio-pastilla)",
      color: "var(--color-tenue)",
      border: "1px solid transparent",
      backgroundColor: "transparent",
      cursor: "pointer",
      font: "inherit",
      textDecoration: "none",
    },
    ".tabs a:hover, .tabs button:hover": { backgroundColor: "var(--color-gris-fondo)" },
    ".tabs a.activo, .tabs button.activo": {
      backgroundColor: "var(--color-azul-fondo)",
      borderColor: "#cfe0f6",
      color: "var(--color-azul-texto)",
      fontWeight: "600",
    },
    /* Panel real de pestana -- opcional: `.tabs` sin `data-tab` sigue
       siendo solo un segmented control, como hasta 0.9.0. Con
       `data-tab`/`data-tab-panel`, `iniciarTabs()` (en
       @sistema32/santacorina-ui/js) muestra/oculta el panel. */
    ".tab-panel": { display: "none" },
    ".tab-panel.activo": { display: "block" },

    /* ---------------------------------------------------------------
     * Carousel -- de Bootstrap (Components). En 0.11.0 se dejo fuera a
     * proposito ("sin caso de uso en un portal de compras publicas");
     * se agrega ahora como paridad de framework, mismo criterio
     * preventivo que `.hero`. Mismo patron de "una sola cosa visible a
     * la vez" que `.tab-panel.activo`. El JS vive en `/js`
     * (`iniciarCarruseles`) -- sin autoplay por defecto, ver README.
     * ------------------------------------------------------------- */
    ".carousel": { position: "relative", overflow: "hidden", borderRadius: "var(--radio)" },
    ".carousel-pista": { display: "flex", transition: "transform 0.25s ease" },
    ".carousel-slide": { flex: "0 0 100%", minWidth: "0" },
    ".carousel-controles button": {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: "var(--z-flotante)",
      width: "34px",
      height: "34px",
      borderRadius: "50%",
      border: "0",
      backgroundColor: "rgba(12,45,74,0.55)",
      color: "#fff",
      cursor: "pointer",
      display: "grid",
      placeItems: "center",
      fontSize: "var(--t-lead)",
    },
    ".carousel-controles button:hover": { backgroundColor: "rgba(12,45,74,0.75)" },
    ".carousel-anterior": { left: "10px" },
    ".carousel-siguiente": { right: "10px" },
    ".carousel-indicadores": {
      position: "absolute",
      bottom: "12px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: "var(--z-flotante)",
      display: "flex",
      gap: "var(--esp-2)",
    },
    ".carousel-indicadores button": {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      border: "0",
      padding: "0",
      backgroundColor: "rgba(255,255,255,0.55)",
      cursor: "pointer",
    },
    ".carousel-indicadores button.activo": { backgroundColor: "#fff" },

    /* ---------------------------------------------------------------
     * Tooltip -- nuevo, no existia nada (solo `title=""` nativo, sin
     * estilo y que se corta en movil). Solo CSS, via `data-tooltip`.
     * ------------------------------------------------------------- */
    "[data-tooltip]": { position: "relative", cursor: "help" },
    "[data-tooltip]::after": {
      content: "attr(data-tooltip)",
      position: "absolute",
      bottom: "calc(100% + 6px)",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "var(--color-navy)",
      color: "#fff",
      padding: "var(--esp-2) var(--esp-3)",
      borderRadius: "var(--radio)",
      fontSize: "var(--t-menor)",
      maxWidth: "220px",
      width: "max-content",
      textAlign: "center",
      opacity: "0",
      pointerEvents: "none",
      transition: "opacity 0.12s ease",
      zIndex: "var(--z-tooltip)",
    },
    "[data-tooltip]::before": {
      content: "''",
      position: "absolute",
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      border: "5px solid transparent",
      borderTopColor: "var(--color-navy)",
      opacity: "0",
      pointerEvents: "none",
      transition: "opacity 0.12s ease",
    },
    "[data-tooltip]:hover::after, [data-tooltip]:hover::before, [data-tooltip]:focus-visible::after, [data-tooltip]:focus-visible::before":
      { opacity: "1" },

    /* ---------------------------------------------------------------
     * Breadcrumb -- generaliza el "Estas viendo: X -> Y" que hoy es
     * texto suelto armado a mano en cada pantalla que lo necesita.
     * ------------------------------------------------------------- */
    ".breadcrumb": {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "var(--esp-2)",
      fontSize: "var(--t-cuerpo)",
      color: "var(--color-tenue)",
      margin: "0 0 var(--esp-4)",
    },
    ".breadcrumb a": { color: "var(--color-azul-texto)" },
    ".breadcrumb a:hover": { textDecoration: "underline" },
    ".breadcrumb .sep": { opacity: "0.5" },
    ".breadcrumb .actual": { color: "var(--color-titulo)", fontWeight: "600" },

    /* ---------------------------------------------------------------
     * Skeleton -- nuevo, no existia ningun estado de carga: hoy una
     * pantalla cargando no muestra nada hasta que llega el dato.
     * ------------------------------------------------------------- */
    ".skeleton": {
      backgroundColor: "var(--color-gris-fondo)",
      // El degradado ES el barrido del skeleton (la animacion de carga), no un fondo.
      backgroundImage:
        "linear-gradient(90deg, var(--color-gris-fondo) 25%, #e4e9ee 37%, var(--color-gris-fondo) 63%)", // taste-skill-ignore
      backgroundSize: "400% 100%",
      animation: "santacorina-skeleton 1.4s ease infinite",
      borderRadius: "var(--radio)",
    },
    ".skeleton-texto": { height: "14px", marginBottom: "var(--esp-2)" },
    ".skeleton-texto.corto": { width: "40%" },
    "@keyframes santacorina-skeleton": {
      "0%": { backgroundPosition: "100% 50%" },
      "100%": { backgroundPosition: "0 50%" },
    },

    /* ---------------------------------------------------------------
     * Interruptor (switch) -- on/off, para activar/desactivar algo
     * (ej. un destino de Finanzas) sin el checkbox cuadrado.
     * ------------------------------------------------------------- */
    ".interruptor": {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      cursor: "pointer",
    },
    ".interruptor input": { position: "absolute", opacity: "0", width: "0", height: "0" },
    ".interruptor .pista": {
      width: "38px",
      height: "22px",
      backgroundColor: "var(--color-gris-fondo)",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio-pastilla)",
      transition: "background-color 0.15s ease",
      flex: "none",
    },
    ".interruptor .pista::after": {
      content: "''",
      display: "block",
      width: "16px",
      height: "16px",
      margin: "var(--esp-1)",
      borderRadius: "50%",
      backgroundColor: "var(--color-superficie)",
      boxShadow: "0 1px 2px rgba(12, 45, 74, 0.25)",
      transition: "transform 0.15s ease",
    },
    ".interruptor input:checked ~ .pista": { backgroundColor: "var(--color-azul)", borderColor: "var(--color-azul)" },
    ".interruptor input:checked ~ .pista::after": { transform: "translateX(16px)" },
    ".interruptor input:disabled ~ .pista": { opacity: "0.5", cursor: "not-allowed" },

    /* ---------------------------------------------------------------
     * Chip -- como `.etiqueta`, pero removible (filtros seleccionados).
     * ------------------------------------------------------------- */
    ".chip": {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--esp-2)",
      padding: "var(--esp-1) var(--esp-2) var(--esp-1) var(--esp-3)",
      borderRadius: "var(--radio-pastilla)",
      fontSize: "var(--t-menor)",
      fontWeight: "600",
      backgroundColor: "var(--color-gris-fondo)",
      color: "var(--color-gris-texto)",
    },
    ".chip[data-tono='azul']": { backgroundColor: "var(--color-azul-fondo)", color: "var(--color-azul-texto)" },
    ".chip[data-tono='verde']": { backgroundColor: "var(--color-verde-fondo)", color: "var(--color-verde-texto)" },
    ".chip[data-tono='naranjo']": { backgroundColor: "var(--color-naranjo-fondo)", color: "var(--color-naranjo-texto)" },
    ".chip[data-tono='rojo']": { backgroundColor: "var(--color-rojo-fondo)", color: "var(--color-rojo-texto)" },
    ".chip .quitar": {
      display: "grid",
      placeItems: "center",
      width: "15px",
      height: "15px",
      borderRadius: "50%",
      border: "0",
      padding: "0",
      cursor: "pointer",
      backgroundColor: "rgba(0,0,0,0.08)",
      color: "inherit",
      fontSize: "var(--t-menor)",
      lineHeight: "1",
    },
    ".chip .quitar:hover": { backgroundColor: "rgba(0,0,0,0.16)" },

    /* ---------------------------------------------------------------
     * Avatar -- iniciales en circulo (listas de usuarios/aprobadores).
     * ------------------------------------------------------------- */
    ".avatar": {
      display: "inline-grid",
      placeItems: "center",
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      backgroundColor: "var(--color-gris-fondo)",
      color: "var(--color-titulo)",
      fontSize: "var(--t-cuerpo)",
      fontWeight: "700",
      flex: "none",
    },
    ".avatar[data-tamano='chico']": { width: "26px", height: "26px", fontSize: "var(--t-menor)" },
    ".avatar[data-tamano='grande']": { width: "48px", height: "48px", fontSize: "var(--t-lead)" },
    ".avatar[data-tono='azul']": { backgroundColor: "var(--color-azul-fondo)", color: "var(--color-azul-texto)" },
    ".avatar[data-tono='verde']": { backgroundColor: "var(--color-verde-fondo)", color: "var(--color-verde-texto)" },
    ".avatar[data-tono='naranjo']": { backgroundColor: "var(--color-naranjo-fondo)", color: "var(--color-naranjo-texto)" },
    ".avatar[data-tono='rojo']": { backgroundColor: "var(--color-rojo-fondo)", color: "var(--color-rojo-texto)" },

    /* ---------------------------------------------------------------
     * Insignia de icono -- de acepta/frontend/src/components/IconBadge.vue
     * (23 usos en ConfiguracionView/DashboardView/ProcesosView). El
     * propio comentario del componente dice que reemplazo "~6 variantes
     * casi identicas" que habia antes -- se empaqueta una vez para que
     * ningun otro sistema la reinvente una septima vez. Mismos 5 tonos
     * que `.etiqueta`/`.chip`/`.avatar` (no una sexta paleta aparte).
     * ------------------------------------------------------------- */
    ".insignia-icono": {
      display: "inline-grid",
      placeItems: "center",
      flex: "none",
      width: "36px",
      height: "36px",
      borderRadius: "var(--radio)",
      backgroundColor: "var(--color-gris-fondo)",
      color: "var(--color-tenue)",
    },
    ".insignia-icono[data-tamano='chica']": { width: "28px", height: "28px", borderRadius: "var(--radio)" },
    ".insignia-icono[data-tamano='grande']": { width: "44px", height: "44px", borderRadius: "var(--radio)" },
    ".insignia-icono[data-tono='azul']": { backgroundColor: "var(--color-azul-fondo)", color: "var(--color-azul-texto)" },
    ".insignia-icono[data-tono='verde']": { backgroundColor: "var(--color-verde-fondo)", color: "var(--color-verde-texto)" },
    ".insignia-icono[data-tono='naranjo']": { backgroundColor: "var(--color-naranjo-fondo)", color: "var(--color-naranjo-texto)" },
    ".insignia-icono[data-tono='rojo']": { backgroundColor: "var(--color-rojo-fondo)", color: "var(--color-rojo-texto)" },

    /* ---------------------------------------------------------------
     * Divisor -- separa dos bloques, con o sin texto en medio.
     * ------------------------------------------------------------- */
    ".divisor": {
      display: "flex",
      alignItems: "center",
      gap: "var(--esp-3)",
      margin: "var(--esp-4) 0",
      fontSize: "var(--t-menor)",
      color: "var(--color-tenue)",
    },
    ".divisor::before, .divisor::after": {
      content: "''",
      flex: "1",
      borderTop: "1px solid var(--color-borde)",
    },

    /* ---------------------------------------------------------------
     * Acordeon -- marca sobre `<details>/<summary>` nativos: el
     * navegador resuelve abrir/cerrar, foco y teclado; esto es solo piel.
     * ------------------------------------------------------------- */
    ".acordeon": {
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      marginBottom: "var(--esp-3)",
      overflow: "hidden",
    },
    ".acordeon summary": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "var(--esp-4) var(--esp-4)",
      cursor: "pointer",
      fontWeight: "600",
      color: "var(--color-titulo)",
      listStyle: "none",
    },
    ".acordeon summary::-webkit-details-marker": { display: "none" },
    ".acordeon summary::after": {
      content: "''",
      width: "8px",
      height: "8px",
      borderRight: "2px solid var(--color-tenue)",
      borderBottom: "2px solid var(--color-tenue)",
      transform: "rotate(45deg)",
      transition: "transform 0.15s ease",
      flex: "none",
    },
    ".acordeon[open] summary::after": { transform: "rotate(225deg)" },
    ".acordeon .cuerpo": {
      padding: "0 var(--esp-4) var(--esp-4)",
      fontSize: "var(--t-cuerpo)",
      color: "var(--color-texto)",
    },

    /* ---------------------------------------------------------------
     * Paginacion -- mismo estado `.activo` que `.tabs`/`.stepper-paso`.
     * ------------------------------------------------------------- */
    ".paginacion": { display: "inline-flex", gap: "var(--esp-1)", fontSize: "var(--t-cuerpo)" },
    ".paginacion a, .paginacion button": {
      display: "grid",
      placeItems: "center",
      minWidth: "30px",
      height: "30px",
      padding: "0 var(--esp-2)",
      borderRadius: "var(--radio)",
      border: "1px solid var(--color-borde)",
      backgroundColor: "var(--color-superficie)",
      color: "var(--color-tenue)",
      textDecoration: "none",
      cursor: "pointer",
      font: "inherit",
    },
    ".paginacion a:hover, .paginacion button:hover": { backgroundColor: "var(--color-gris-fondo)" },
    ".paginacion a.activo, .paginacion button.activo": {
      backgroundColor: "var(--color-azul)",
      borderColor: "var(--color-azul)",
      color: "#fff",
    },
    ".paginacion button:disabled": { opacity: "0.45", cursor: "not-allowed" },

    /* ---------------------------------------------------------------
     * Menu -- igual tecnica que `.acordeon` (details/summary nativo),
     * pero el panel flota anclado al trigger en vez de empujar el layout.
     * ------------------------------------------------------------- */
    ".menu": { position: "relative", display: "inline-block" },
    ".menu summary": {
      listStyle: "none",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "30px",
      height: "30px",
      borderRadius: "var(--radio)",
      color: "var(--color-tenue)",
    },
    ".menu summary::-webkit-details-marker": { display: "none" },
    ".menu summary:hover": { backgroundColor: "var(--color-gris-fondo)" },
    ".menu[open] summary": { backgroundColor: "var(--color-gris-fondo)" },
    ".menu-panel": {
      position: "absolute",
      top: "calc(100% + 4px)",
      right: "0",
      zIndex: "var(--z-flotante)",
      minWidth: "180px",
      backgroundColor: "var(--color-superficie)",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      boxShadow: "0 10px 30px rgba(12, 45, 74, 0.18)",
      padding: "var(--esp-2)",
    },
    /* `data-posicion="arriba"` lo pone `posicionarFlotante()` (JS en
     * `/js`, `flotante.ts`) cuando no hay espacio debajo del ancla --
     * mismo criterio que `aria-sort`/`data-tono`: la JS solo decide y
     * marca el atributo, el CSS define los valores reales. */
    ".menu-panel[data-posicion='arriba']": { top: "auto", bottom: "calc(100% + 4px)" },
    ".menu-panel a, .menu-panel button": {
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: "var(--esp-2) var(--esp-3)",
      borderRadius: "var(--radio)",
      border: "0",
      backgroundColor: "transparent",
      color: "var(--color-texto)",
      fontSize: "var(--t-cuerpo)",
      fontFamily: "inherit",
      cursor: "pointer",
      textDecoration: "none",
    },
    ".menu-panel a:hover, .menu-panel button:hover": { backgroundColor: "var(--color-gris-fondo)" },
    ".menu-panel button.peligro, .menu-panel a.peligro": { color: "var(--color-rojo-texto)" },
    ".menu-panel hr": { border: "0", borderTop: "1px solid var(--color-borde)", margin: "var(--esp-2) 0" },


    /* ---------------------------------------------------------------
     * Calendario -- selector de fecha en grilla visual, mismo patron de
     * capa flotante que `.menu`. El JS vive en `@sistema32/santacorina-ui/js`
     * (`iniciarCalendario`), esto es solo la piel.
     * ------------------------------------------------------------- */
    ".calendario": { position: "relative", display: "inline-block" },
    ".calendario input": { cursor: "pointer", backgroundColor: "var(--color-superficie)" },
    ".calendario-panel": {
      display: "none",
      position: "absolute",
      top: "calc(100% + 4px)",
      left: "0",
      zIndex: "var(--z-flotante)",
      width: "260px",
      backgroundColor: "var(--color-superficie)",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      boxShadow: "0 10px 30px rgba(12,45,74,0.18)",
      padding: "var(--esp-3)",
    },
    ".calendario-panel.visible": { display: "block" },
    ".calendario-panel[data-posicion='arriba']": { top: "auto", bottom: "calc(100% + 4px)" },
    ".calendario-cabecera": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "var(--esp-2)",
      fontWeight: "600",
      color: "var(--color-titulo)",
      fontSize: "var(--t-cuerpo)",
      textTransform: "capitalize",
    },
    ".calendario-nav": {
      border: "0",
      backgroundColor: "transparent",
      cursor: "pointer",
      color: "var(--color-tenue)",
      fontSize: "var(--t-cuerpo)",
      padding: "var(--esp-1) var(--esp-2)",
      borderRadius: "var(--radio)",
    },
    ".calendario-nav:hover": { backgroundColor: "var(--color-gris-fondo)" },
    ".calendario-grilla": { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "var(--esp-1)", fontSize: "var(--t-menor)" },
    ".calendario-dow": {
      textAlign: "center",
      color: "var(--color-tenue)",
      fontSize: "var(--t-menor)",
      padding: "var(--esp-1) 0",
      fontWeight: "600",
    },
    ".calendario-dia": {
      display: "grid",
      placeItems: "center",
      height: "30px",
      borderRadius: "var(--radio)",
      cursor: "pointer",
      color: "var(--color-texto)",
      border: "0",
      backgroundColor: "transparent",
      font: "inherit",
      width: "100%",
    },
    ".calendario-dia:hover": { backgroundColor: "var(--color-gris-fondo)" },
    ".calendario-dia.fuera": { color: "var(--color-tenue)", opacity: "0.4" },
    ".calendario-dia.hoy": { border: "1px solid var(--color-azul)" },
    ".calendario-dia.activo": { backgroundColor: "var(--color-azul)", color: "#fff", fontWeight: "600" },

    /* ---------------------------------------------------------------
     * Popover -- como `[data-tooltip]`, pero con contenido rico y
     * abierto por clic, no por hover. Mismo patron de capa flotante que
     * `.menu-panel`. El JS vive en `@sistema32/santacorina-ui/js`
     * (`iniciarPopovers`).
     * ------------------------------------------------------------- */
    "[data-popover]": { position: "relative", display: "inline-block" },
    ".popover-panel": {
      display: "none",
      position: "absolute",
      top: "calc(100% + 8px)",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: "var(--z-flotante-alto)",
      width: "260px",
      backgroundColor: "var(--color-superficie)",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      boxShadow: "0 10px 30px rgba(12,45,74,0.18)",
      padding: "var(--esp-4) var(--esp-4)",
      fontSize: "var(--t-cuerpo)",
      color: "var(--color-texto)",
    },
    ".popover-panel.visible": { display: "block" },
    ".popover-panel[data-posicion='arriba']": { top: "auto", bottom: "calc(100% + 8px)" },
    ".popover-panel .titulo": { display: "block", fontWeight: "700", color: "var(--color-titulo)", marginBottom: "var(--esp-1)" },

    /* ---------------------------------------------------------------
     * Toggletip -- como `[data-tooltip]`, pero se abre con clic/tap en
     * vez de hover (sin soporte en pantallas tactiles). Misma capa
     * flotante que `.popover-panel`, mismo ancho fijo -- entra tambien
     * en la correccion de panel-flotante-angosto de abajo. El JS vive
     * en `/js` (`iniciarToggletips`).
     * ------------------------------------------------------------- */
    "[data-toggletip]": { position: "relative", display: "inline-block" },
    ".toggletip-panel": {
      display: "none",
      position: "absolute",
      top: "calc(100% + 8px)",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: "var(--z-flotante-alto)",
      width: "220px",
      backgroundColor: "var(--color-navy)",
      color: "#fff",
      borderRadius: "var(--radio)",
      boxShadow: "0 10px 30px rgba(12,45,74,0.18)",
      padding: "var(--esp-3) var(--esp-3)",
      fontSize: "var(--t-menor)",
      lineHeight: "1.5",
    },
    ".toggletip-panel.visible": { display: "block" },
    ".toggletip-panel[data-posicion='arriba']": { top: "auto", bottom: "calc(100% + 8px)" },

    /* Bajo 600px (telefono, no tablet -- el 900px del resto del paquete
       es muy ancho para esto): el breadcrumb trunca cada tramo en vez de
       desbordar o partirse a media palabra, y los tres paneles flotantes
       anclados con ancho fijo (`.menu-panel`, `.calendario-panel` con
       `left:0`, `.popover-panel` con `left:50%; transform:translateX(-50%)`)
       pasan de panel anclado al trigger a una hoja fija abajo -- anclados,
       en una pantalla angosta se salen del viewport (se vio justo eso al
       verificar). Esta clave va DESPUES de las reglas base de los tres
       paneles (mismo layer/especificidad -- si fuera antes, la regla base
       sin media gana por venir despues en el CSS generado). */
    "@media (max-width: 600px)": {
      ".barra-filtros": { flexDirection: "column", alignItems: "stretch" },
      ".barra-filtros .buscador, .barra-filtros select": { flex: "none", width: "100%" },
      ".barra-filtros .limpiar-filtros": { marginLeft: "0", textAlign: "center" },
      ".breadcrumb a, .breadcrumb .actual": {
        display: "inline-block",
        maxWidth: "40vw",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        verticalAlign: "bottom",
      },
      ".menu-panel, .calendario-panel": {
        position: "fixed",
        top: "auto",
        left: "16px",
        right: "16px",
        bottom: "16px",
        width: "auto",
      },
      ".popover-panel, .toggletip-panel": {
        position: "fixed",
        top: "auto",
        left: "16px",
        right: "16px",
        bottom: "16px",
        width: "auto",
        transform: "none",
      },
      ".comparacion-valores-item": { gridTemplateColumns: "1fr" },
    },

    /* `.cajon`/`.modal-panel` ya son `container-type: inline-size` (ver
     * sus reglas arriba) -- esto hace que `.barra-filtros` se apile
     * tambien por ESPACIO DISPONIBLE, no solo por ancho de ventana: un
     * cajon angosto en una pantalla ancha hoy dejaba la barra de
     * filtros apretada contra el borde sin apilarse (el `@media 600px`
     * de arriba no se activa si la VENTANA es ancha, aunque el cajon
     * en si sea angosto). Mismas reglas, misma razon de orden (despues
     * de las reglas base para ganar el empate de cascada). */
    "@container (max-width: 480px)": {
      ".barra-filtros": { flexDirection: "column", alignItems: "stretch" },
      ".barra-filtros .buscador, .barra-filtros select": { flex: "none", width: "100%" },
      ".barra-filtros .limpiar-filtros": { marginLeft: "0", textAlign: "center" },
      ".comparacion-valores-item": { gridTemplateColumns: "1fr" },
    },

    /* ---------------------------------------------------------------
     * Colapsar (generico) -- a diferencia de `.acordeon` (auto-contenido
     * en `<details>`), el boton y el panel pueden vivir en cualquier
     * parte del DOM, y varios paneles son independientes entre si (no
     * mutuamente excluyentes como `.tabs`/`.tab-panel`). Reutiliza
     * `.tab-panel`/`.tab-panel.activo` para mostrar/ocultar -- el JS
     * vive en `/js` (`iniciarColapsables`).
     * ------------------------------------------------------------- */
    "[data-colapsar]": { cursor: "pointer" },

    /* ---------------------------------------------------------------
     * Cajon -- generaliza el panel deslizante que ya tiene `.lateral` en
     * movil, para usarlo en *otra* cosa (ej. un panel de filtros), no
     * solo el menu. El JS vive en `/js` (`iniciarCajones`).
     * ------------------------------------------------------------- */
    ".cajon": {
      position: "fixed",
      top: "0",
      right: "0",
      height: "100vh",
      width: "min(380px, 90vw)",
      backgroundColor: "var(--color-superficie)",
      boxShadow: "-8px 0 30px rgba(12,45,74,0.18)",
      zIndex: "var(--z-cajon)",
      transform: "translateX(100%)",
      transition: "transform 0.22s ease",
      overflowY: "auto",
      padding: "var(--esp-5) var(--esp-5)",
      containerType: "inline-size",
    },
    ".cajon.abierto": { transform: "translateX(0)" },
    ".cajon-fondo": {
      display: "none",
      position: "fixed",
      inset: "0",
      backgroundColor: "rgba(8,20,34,0.5)",
      zIndex: "var(--z-cajon-fondo)",
    },
    ".cajon-fondo.visible": { display: "block" },
    ".cajon-cabecera": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "var(--esp-4)",
    },
    ".cajon-cabecera h3": { margin: "0", fontSize: "var(--t-lead)", color: "var(--color-titulo)" },

    /* ---------------------------------------------------------------
     * Combobox -- select con autocompletado. Conexion real: elegir uno
     * de 105 establecimientos en un `<select>` plano es incomodo. Sobre
     * un `<select>` oculto (sigue funcionando sin JS en un form normal).
     * El JS vive en `/js` (`iniciarCombobox`).
     * ------------------------------------------------------------- */
    ".combobox": { position: "relative" },
    ".combobox select": { position: "absolute", width: "1px", height: "1px", opacity: "0", pointerEvents: "none" },
    ".combobox-opciones": {
      display: "none",
      position: "absolute",
      top: "calc(100% + 4px)",
      left: "0",
      right: "0",
      zIndex: "var(--z-flotante)",
      maxHeight: "220px",
      overflowY: "auto",
      backgroundColor: "var(--color-superficie)",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      boxShadow: "0 10px 30px rgba(12,45,74,0.18)",
      padding: "var(--esp-2)",
      margin: "0",
      listStyle: "none",
    },
    ".combobox-opciones.visible": { display: "block" },
    ".combobox-opciones[data-posicion='arriba']": { top: "auto", bottom: "calc(100% + 4px)" },
    ".combobox-opciones li": {
      padding: "var(--esp-2) var(--esp-3)",
      borderRadius: "var(--radio)",
      cursor: "pointer",
      fontSize: "var(--t-cuerpo)",
    },
    ".combobox-opciones li:hover, .combobox-opciones li.resaltada": { backgroundColor: "var(--color-gris-fondo)" },
    ".combobox-opciones li.sin-resultados": { color: "var(--color-tenue)", cursor: "default" },
    ".combobox-opciones li.sin-resultados:hover": { backgroundColor: "transparent" },

    /* ---------------------------------------------------------------
     * Medidor de clave -- heuristica simple (longitud + variedad de
     * caracteres) para una guia visual, no para validar seguridad real
     * (eso lo sigue haciendo el backend). El JS vive en `/js`
     * (`iniciarMedidorClave`).
     * ------------------------------------------------------------- */
    ".medidor-clave": { marginTop: "var(--esp-2)" },
    ".medidor-clave .segmentos": { display: "flex", gap: "var(--esp-1)", marginBottom: "var(--esp-1)" },
    ".medidor-clave .segmentos span": {
      height: "4px",
      flex: "1",
      borderRadius: "var(--radio-pastilla)",
      backgroundColor: "var(--color-gris-fondo)",
    },
    ".medidor-clave .segmentos span.activo.debil": { backgroundColor: "var(--color-rojo)" },
    ".medidor-clave .segmentos span.activo.regular": { backgroundColor: "var(--color-naranjo)" },
    ".medidor-clave .segmentos span.activo.buena": { backgroundColor: "#cbb400" },
    ".medidor-clave .segmentos span.activo.fuerte": { backgroundColor: "var(--color-verde)" },
    ".medidor-clave .etiqueta": { fontSize: "var(--t-menor)", color: "var(--color-tenue)" },

    /* ---------------------------------------------------------------
     * Insignia -- punto o numero sobre un padre `position:relative`
     * (un icono, una pastilla) para avisar pendientes sin empujar texto.
     * ------------------------------------------------------------- */
    ".insignia": {
      position: "absolute",
      top: "-6px",
      right: "-6px",
      display: "inline-grid",
      placeItems: "center",
      minWidth: "17px",
      height: "17px",
      padding: "0 var(--esp-1)",
      borderRadius: "var(--radio-pastilla)",
      backgroundColor: "var(--color-rojo)",
      color: "#fff",
      fontSize: "var(--t-menor)",
      fontWeight: "700",
      lineHeight: "1",
      border: "2px solid #fff",
    },
    ".insignia.punto": { minWidth: "10px", width: "10px", height: "10px", padding: "0" },
    ".insignia[data-tono='azul']": { backgroundColor: "var(--color-azul)" },
    ".insignia[data-tono='verde']": { backgroundColor: "var(--color-verde)" },
    ".insignia[data-tono='naranjo']": { backgroundColor: "var(--color-naranjo)" },
    ".insignia[data-tono='gris']": { backgroundColor: "var(--color-gris)" },

    /* ---------------------------------------------------------------
     * Spinner -- para meter dentro de `.boton` mientras se envia algo.
     * ------------------------------------------------------------- */
    ".cargando": {
      display: "inline-block",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      border: "2px solid rgba(255, 255, 255, 0.4)",
      borderTopColor: "#fff",
      animation: "santacorina-girar 0.7s linear infinite",
    },
    ".cargando.oscuro": { border: "2px solid var(--color-borde)", borderTopColor: "var(--color-azul)" },
    ".cargando.chico": { width: "12px", height: "12px", borderWidth: "2px" },
    ".cargando.grande": { width: "24px", height: "24px", borderWidth: "3px" },
    "@keyframes santacorina-girar": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },

    /* ---------------------------------------------------------------
     * Foco de teclado -- uno solo para todo lo navegable, en vez de un
     * `:focus` por componente (antes solo cubria input/select/textarea).
     * ------------------------------------------------------------- */
    ":focus-visible": { outline: "2px solid var(--color-azul)", outlineOffset: "2px" },

    /* ---------------------------------------------------------------
     * Utilidades de z-index -- misma escala que ya usan `.menu-panel`,
     * `.cajon`, `.modal`, `.toast`, etc. (ver `--z-*` en `src/plugin.ts`),
     * expuesta para que el consumidor apile sus propios elementos sin
     * adivinar un numero. No se exponen los pasos internos del grupo
     * cajon/lateral (`--z-lateral`/`--z-cajon-fondo`/`--z-cajon-control`)
     * por ser demasiado especificos del propio componente.
     * ------------------------------------------------------------- */
    ".z-flotante": { zIndex: "var(--z-flotante)" },
    ".z-flotante-alto": { zIndex: "var(--z-flotante-alto)" },
    ".z-cajon": { zIndex: "var(--z-cajon)" },
    ".z-modal": { zIndex: "var(--z-modal)" },
    ".z-toast": { zIndex: "var(--z-toast)" },

    /* ---------------------------------------------------------------
     * Pack de iconos -- glifos sueltos (check, x, flechas) estaban
     * repetidos a mano en decenas de plantillas de sgp, cada una con su
     * propio caracter unicode -- incluso inconsistentes entre si (unas
     * pantallas usan "check", otras "heavy check", distinto glifo para
     * lo mismo). 100% CSS via `mask-image` + `background-color:
     * currentColor`, asi el icono hereda el color de texto como
     * cualquier letra -- la alternativa (SVG inline en cada uso) obliga
     * a repetir marcado en cada pantalla, que es exactamente el defecto
     * que esto reemplaza.
     * ------------------------------------------------------------- */
    ".icono": {
      display: "inline-block",
      width: "16px",
      height: "16px",
      backgroundColor: "currentColor",
      WebkitMaskImage: "var(--icono-svg)",
      maskImage: "var(--icono-svg)",
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      verticalAlign: "middle",
      flex: "none",
    },
    ".icono.chico": { width: "12px", height: "12px" },
    ".icono.grande": { width: "20px", height: "20px" },
    ".icono-check": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12l5 5L20 6'/%3E%3C/svg%3E\")",
    },
    ".icono-cerrar": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M5 5l14 14M19 5L5 19'/%3E%3C/svg%3E\")",
    },
    ".icono-flecha-derecha": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12h16M14 6l6 6-6 6'/%3E%3C/svg%3E\")",
    },
    ".icono-chevron-izq": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 5l-7 7 7 7'/%3E%3C/svg%3E\")",
    },
    ".icono-chevron-der": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 5l7 7-7 7'/%3E%3C/svg%3E\")",
    },
    ".icono-mas-opciones": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='12' cy='5' r='2'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Ccircle cx='12' cy='19' r='2'/%3E%3C/svg%3E\")",
    },
    ".icono-menu": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M4 6h16M4 12h16M4 18h16'/%3E%3C/svg%3E\")",
    },
    ".icono-buscar": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round'%3E%3Ccircle cx='10.5' cy='10.5' r='7'/%3E%3Cline x1='16' y1='16' x2='21' y2='21'/%3E%3C/svg%3E\")",
    },
    /* Ocho mas, agregados preventivos sobre conceptos reales de sgp (ver
       CHANGELOG 0.9.0 para la evidencia de cada uno: ＋ "Agregar
       productos" en solicitud_form.html, año cerrado/solo lectura en
       periodo.py, filtros de listado, ✕ usado para "eliminar fila" taste-skill-ignore
       cuando ya significa "cerrar" en otra parte, etc). */
    ".icono-agregar": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M12 4v16M4 12h16'/%3E%3C/svg%3E\")",
    },
    ".icono-candado": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='11' width='14' height='9' rx='2'/%3E%3Cpath d='M8 11V7a4 4 0 0 1 8 0v4'/%3E%3C/svg%3E\")",
    },
    ".icono-filtro": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 5h16l-6 7v6l-4 2v-8z'/%3E%3C/svg%3E\")",
    },
    ".icono-eliminar": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 7h14M10 11v6M14 11v6M7 7l1-3h8l1 3M6 7l1 13h10l1-13'/%3E%3C/svg%3E\")",
    },
    ".icono-editar": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 20l4-1 11-11-3-3L5 16l-1 4z'/%3E%3Cpath d='M14 5l3 3'/%3E%3C/svg%3E\")",
    },
    ".icono-ver": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E\")",
    },
    ".icono-advertencia": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 4l9 16H3z'/%3E%3Cline x1='12' y1='10' x2='12' y2='14'/%3E%3Cline x1='12' y1='17' x2='12' y2='17.01'/%3E%3C/svg%3E\")",
    },
    ".icono-info": {
      "--icono-svg":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cline x1='12' y1='11' x2='12' y2='16'/%3E%3Cline x1='12' y1='7' x2='12' y2='7.01'/%3E%3C/svg%3E\")",
    },

    /* ---------------------------------------------------------------
     * Pildora de archivo -- de acepta/frontend/src/styles.css (21 usos:
     * EdicionFacturasView, FacturasView, CorreosView,
     * RecepcionesSeView). Link/boton outline para "descargar/ver
     * documento" (XML, PDF, OC, CDP) -- distinto de `.pastilla` (fondo
     * solido, para una decision) y de `.btn-chico`.
     * ------------------------------------------------------------- */
    ".pildora-archivo": {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--esp-1)",
      width: "fit-content",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      padding: "var(--esp-1) var(--esp-2)",
      backgroundColor: "var(--color-superficie)",
      color: "var(--color-azul-texto)",
      textDecoration: "none",
      cursor: "pointer",
      fontSize: "var(--t-menor)",
      lineHeight: "1.2",
      fontFamily: "inherit",
    },
    ".pildora-archivo:hover": { borderColor: "var(--color-azul)", backgroundColor: "#f6faff" },
    ".pildora-archivo.tenue": { color: "var(--color-tenue)", backgroundColor: "var(--color-gris-fondo)" },

    /* ---------------------------------------------------------------
     * Zona de arrastre + lista de documentos -- de acepta/frontend
     * (EdicionFacturasView, v2/views/FacturasView): subir XML/PDF/
     * recepcion conforme firmada. El JS vive en `/js`
     * (`iniciarZonasArrastre`): solo alterna `.activa` en
     * dragover/dragleave/drop -- la subida real (FormData, endpoint)
     * sigue siendo de cada pantalla, igual criterio que `.buscador`.
     * ------------------------------------------------------------- */
    ".zona-arrastre": {
      display: "flex",
      alignItems: "center",
      gap: "var(--esp-3)",
      padding: "var(--esp-3) var(--esp-4)",
      border: "1px dashed var(--color-borde)",
      borderRadius: "var(--radio)",
    },
    ".zona-arrastre.activa": { borderColor: "var(--color-azul)", backgroundColor: "var(--color-azul-fondo)" },
    ".zona-arrastre .pista": { fontSize: "var(--t-cuerpo)", color: "var(--color-tenue)" },
    ".lista-documentos": { display: "flex", flexDirection: "column", gap: "var(--esp-2)" },
    ".documento-fila": {
      display: "grid",
      gridTemplateColumns: "90px minmax(0, 1fr) auto auto",
      alignItems: "center",
      gap: "var(--esp-2)",
      padding: "var(--esp-2)",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      backgroundColor: "var(--color-superficie)",
    },
    ".documento-tipo": { color: "var(--color-tenue)", fontSize: "var(--t-menor)", fontWeight: "800" },
    ".documento-nombre": { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--color-texto)", fontSize: "var(--t-cuerpo)" },

    /* ---------------------------------------------------------------
     * Cola de adjuntos -- igual armazon que `.documento-fila`, pero
     * para un archivo QUE SE ESTA subiendo: barra de progreso en vez
     * de los links "Ver"/"Quitar". El JS vive en `/js`
     * (`iniciarColaAdjuntos`) -- `subirArchivo(file, onProgreso, señal)`
     * la implementa el consumidor (XHR/fetch real), el paquete solo
     * arma la fila y el estado.
     * ------------------------------------------------------------- */
    ".adjunto-fila": {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) 90px auto",
      alignItems: "center",
      gap: "var(--esp-3)",
      padding: "var(--esp-2)",
      border: "1px solid var(--color-borde)",
      borderRadius: "var(--radio)",
      backgroundColor: "var(--color-superficie)",
      marginBottom: "var(--esp-2)",
      fontSize: "var(--t-cuerpo)",
    },
    ".adjunto-nombre": { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--color-texto)" },
    ".adjunto-progreso": { height: "6px", borderRadius: "var(--radio)", backgroundColor: "var(--color-gris-fondo)", overflow: "hidden" },
    ".adjunto-progreso > span": { display: "block", height: "100%", backgroundColor: "var(--color-azul)", transition: "width 0.2s ease" },
    ".adjunto-fila[data-estado='error'] .adjunto-progreso": { backgroundColor: "var(--color-rojo-fondo)" },
    ".adjunto-fila[data-estado='error'] .adjunto-progreso > span": { backgroundColor: "var(--color-rojo)" },
    ".adjunto-fila[data-estado='listo'] .adjunto-progreso > span": { backgroundColor: "var(--color-verde)" },
    ".adjunto-accion": {
      border: "0",
      backgroundColor: "transparent",
      color: "var(--color-azul-texto)",
      fontWeight: "600",
      fontSize: "var(--t-menor)",
      cursor: "pointer",
    },

    /* ---------------------------------------------------------------
     * Calendario de estado -- de acepta/frontend
     * (CalendarioScrapingView.vue): grilla mensual tipo heatmap con un
     * punto de color por dia (hecho/en-curso/fallido). Proposito
     * distinto de `.calendario`/`iniciarCalendario` (ese es un selector
     * de fecha para un input) -- nombre propio para no confundirlos.
     * Solo CSS: el consumidor arma la grilla con sus propios datos.
     * ------------------------------------------------------------- */
    ".calendario-estado": { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "var(--esp-1)", fontSize: "var(--t-menor)" },
    ".calendario-estado-dia": {
      display: "grid",
      gridTemplateColumns: "1fr auto",
      alignContent: "space-between",
      gap: "var(--esp-2)",
      minHeight: "64px",
      padding: "var(--esp-2)",
      border: "0",
      borderRadius: "var(--radio)",
      backgroundColor: "transparent",
      color: "var(--color-texto)",
      textAlign: "left",
    },
    "button.calendario-estado-dia": { cursor: "pointer" },
    "button.calendario-estado-dia:hover": { backgroundColor: "var(--color-gris-fondo)" },
    ".calendario-estado-dia small": { gridColumn: "1 / -1", color: "var(--color-tenue)", fontSize: "var(--t-menor)" },
    ".punto-estado": { display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--color-gris)" },
    ".punto-estado.hecho": { backgroundColor: "var(--color-verde)" },
    ".punto-estado.en-curso": { backgroundColor: "var(--color-naranjo)" },
    ".punto-estado.fallido": { backgroundColor: "var(--color-rojo)" },

    /* ---------------------------------------------------------------
     * Movimiento reducido -- quien activo esta preferencia del sistema
     * no quiere que nada se deslice ni gire. Van al final a proposito
     * (mismo criterio que el bloque de 600px): pisan la transicion/
     * animacion que cada regla base ya definio, sin tocarlas alla.
     * ------------------------------------------------------------- */
    "@media (prefers-reduced-motion: reduce)": {
      ".cajon, .lateral, .lateral.lateral-fija": { transition: "none" },
      ".barra-nav-grupo > summary .icono": { transition: "none" },
      ".toast": { animation: "none" },
      ".cargando": { animation: "none" },
      ".skeleton": { animation: "none" },
      ".adjunto-progreso > span": { transition: "none" },
    },

    /* ---------------------------------------------------------------
     * Alto contraste (Windows "forced-colors") -- el navegador
     * reemplaza todos los colores por la paleta del sistema; estos
     * indicadores comunican su estado SOLO con el color de fondo, asi
     * que sin un borde quedan indistinguibles entre si.
     * ------------------------------------------------------------- */
    "@media (forced-colors: active)": {
      ".insignia, .etiqueta, .luz, .chip": { border: "1px solid CanvasText" },
    },
  };
}
