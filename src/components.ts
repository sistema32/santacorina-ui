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
import type { CSSRuleObject } from "tailwindcss/types/config";

export function buildComponents(): CSSRuleObject {
  return {
    /* ---------------------------------------------------------------
     * Tarjeta -- contenedor base de cualquier bloque de contenido.
     * ------------------------------------------------------------- */
    ".tarjeta": {
      backgroundColor: "#fff",
      border: "1px solid var(--color-borde)",
      borderRadius: "11px",
      padding: "20px 22px",
      marginBottom: "20px",
    },
    ".tarjeta h3": {
      margin: "0 0 14px",
      fontSize: "15px",
      color: "var(--color-navy)",
    },
    "h2.seccion": {
      fontSize: "16px",
      color: "var(--color-navy)",
      margin: "0 0 14px",
    },

    /* ---------------------------------------------------------------
     * KPI -- cifra destacada con color de estado a la izquierda.
     * ------------------------------------------------------------- */
    ".kpis": {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(158px, 1fr))",
      gap: "13px",
      marginBottom: "22px",
    },
    ".kpi": {
      backgroundColor: "#fff",
      border: "1px solid var(--color-borde)",
      borderRadius: "11px",
      padding: "15px 17px",
      borderLeft: "4px solid var(--color-gris)",
    },
    ".kpi .n": {
      fontSize: "26px",
      fontWeight: "700",
      color: "var(--color-navy)",
      lineHeight: "1.1",
    },
    ".kpi .t": { fontSize: "12.5px", color: "var(--color-tenue)", marginTop: "3px" },
    ".kpi.azul": { borderLeftColor: "var(--color-azul)" },
    ".kpi.verde": { borderLeftColor: "var(--color-verde)" },
    ".kpi.naranjo": { borderLeftColor: "var(--color-naranjo)" },
    ".kpi.rojo": { borderLeftColor: "var(--color-rojo)" },
    ".kpi.gris": { borderLeftColor: "var(--color-gris)" },

    /* ---------------------------------------------------------------
     * Etiqueta -- estado corto, en linea con texto (no es clicable).
     * ------------------------------------------------------------- */
    ".etiqueta": {
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "600",
      whiteSpace: "nowrap",
    },
    ".etiqueta.gris": { backgroundColor: "var(--color-gris-fondo)", color: "#4c5966" },
    ".etiqueta.azul": { backgroundColor: "#e7f0fc", color: "var(--color-azul-oscuro)" },
    ".etiqueta.verde": { backgroundColor: "var(--color-verde-fondo)", color: "#146540" },
    ".etiqueta.naranjo": { backgroundColor: "var(--color-naranjo-fondo)", color: "#8a4e08" },
    ".etiqueta.rojo": { backgroundColor: "var(--color-rojo-fondo)", color: "#8d241e" },

    /* ---------------------------------------------------------------
     * Boton -- la accion principal de una pantalla o formulario.
     * ------------------------------------------------------------- */
    ".boton": {
      display: "inline-block",
      padding: "10px 18px",
      borderRadius: "8px",
      border: "0",
      backgroundColor: "var(--color-azul)",
      color: "#fff",
      fontWeight: "600",
      fontSize: "14px",
      cursor: "pointer",
    },
    ".boton:hover": { backgroundColor: "var(--color-azul-oscuro)" },
    ".boton:disabled": { backgroundColor: "#b7c3d0", cursor: "not-allowed" },
    ".boton.secundario": {
      backgroundColor: "#fff",
      color: "var(--color-navy)",
      border: "1px solid var(--color-borde)",
    },
    ".boton.secundario:hover": { backgroundColor: "var(--color-gris-fondo)" },
    ".boton.peligro": {
      backgroundColor: "#fff",
      color: "var(--color-rojo)",
      border: "1px solid #f0c4c1",
    },
    ".boton.peligro:hover": { backgroundColor: "var(--color-rojo-fondo)" },

    /* Boton chico -- accion secundaria en una fila o celda de tabla. */
    ".btn-chico": { fontSize: "12px", padding: "4px 9px" },
    "a.btn-chico": {
      display: "inline-block",
      border: "1px solid var(--color-borde)",
      borderRadius: "6px",
      backgroundColor: "#fff",
      color: "var(--color-navy)",
      textDecoration: "none",
    },
    "a.btn-chico:hover": { borderColor: "var(--color-azul)", backgroundColor: "#f6faff" },
    "a.btn-chico.peligro": { color: "var(--color-rojo)", borderColor: "#f0c4c1" },
    "a.btn-chico.peligro:hover": {
      backgroundColor: "var(--color-rojo-fondo)",
      borderColor: "var(--color-rojo)",
    },

    /* Pastilla -- decision clicable con forma de boton, no de etiqueta. */
    ".pastilla": {
      display: "inline-block",
      padding: "5px 14px",
      borderRadius: "999px",
      fontSize: "12.5px",
      fontWeight: "600",
      lineHeight: "1.35",
      border: "1px solid transparent",
      cursor: "pointer",
      textDecoration: "none",
      fontFamily: "inherit",
      whiteSpace: "nowrap",
    },
    ".pastilla.celeste": {
      backgroundColor: "#e7f0fc",
      borderColor: "#cfe0f6",
      color: "var(--color-azul-oscuro)",
    },
    ".pastilla.celeste:hover": { backgroundColor: "#d7e7fa" },
    ".pastilla.roja": {
      backgroundColor: "var(--color-rojo-fondo)",
      borderColor: "#f3d3cf",
      color: "#8d241e",
    },
    ".pastilla.roja:hover": { backgroundColor: "#fbdedb" },
    ".pastilla:disabled": { opacity: "0.55", cursor: "default" },

    /* ---------------------------------------------------------------
     * Aviso -- banner de nivel de pantalla completa (no por fila).
     * ------------------------------------------------------------- */
    ".aviso": {
      padding: "12px 15px",
      borderRadius: "8px",
      fontSize: "14px",
      marginBottom: "18px",
      borderLeft: "4px solid",
    },
    ".aviso.info": { backgroundColor: "#eaf2fc", borderColor: "var(--color-azul)", color: "#1a4b8a" },
    ".aviso.ok": { backgroundColor: "var(--color-verde-fondo)", borderColor: "var(--color-verde)", color: "#14603c" },
    ".aviso.alerta": {
      backgroundColor: "var(--color-naranjo-fondo)",
      borderColor: "var(--color-naranjo)",
      color: "#8a4e08",
    },
    ".aviso.error": { backgroundColor: "var(--color-rojo-fondo)", borderColor: "var(--color-rojo)", color: "#8d241e" },

    /* ---------------------------------------------------------------
     * Campo -- un control de formulario con su etiqueta y ayuda.
     * ------------------------------------------------------------- */
    ".campo": { marginBottom: "17px" },
    ".campo label": {
      display: "block",
      fontSize: "13px",
      fontWeight: "600",
      color: "var(--color-navy)",
      marginBottom: "5px",
    },
    ".campo .ayuda": { fontSize: "12.5px", color: "var(--color-tenue)", margin: "4px 0 0" },
    "input[type=text], input[type=number], select, textarea": {
      width: "100%",
      padding: "10px 12px",
      border: "1px solid var(--color-borde)",
      borderRadius: "8px",
      fontSize: "15px",
      backgroundColor: "#fff",
      color: "var(--color-texto)",
    },
    textarea: { resize: "vertical", minHeight: "88px" },
    "input:focus, select:focus, textarea:focus": {
      outline: "2px solid var(--color-azul)",
      outlineOffset: "1px",
    },
    "input:disabled, input[readonly]": { backgroundColor: "var(--color-gris-fondo)", color: "var(--color-tenue)" },
    ".fila": { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "16px" },

    /* ---------------------------------------------------------------
     * Tabla -- base de cualquier listado tabular.
     * ------------------------------------------------------------- */
    table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
    th: {
      textAlign: "left",
      fontSize: "11.5px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      color: "var(--color-tenue)",
      padding: "9px 10px",
      borderBottom: "2px solid var(--color-borde)",
    },
    td: { padding: "11px 10px", borderBottom: "1px solid var(--color-borde)", verticalAlign: "top" },
    "tr:last-child td": { borderBottom: "0" },
    ".tabla-scroll": { overflowX: "auto" },
    "td.peso, th.der, td.der": { textAlign: "right" },
    "td.peso": { fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" },
    "th.cen, td.cen": { textAlign: "center" },
    "td.codigo": { fontFamily: "ui-monospace, Consolas, monospace", fontSize: "12.5px" },

    /* ---------------------------------------------------------------
     * Dato -- par etiqueta/valor, la unidad minima de cualquier resumen.
     * ------------------------------------------------------------- */
    ".dato": {
      display: "flex",
      justifyContent: "space-between",
      gap: "14px",
      padding: "8px 0",
      borderBottom: "1px solid var(--color-borde)",
      fontSize: "14px",
    },
    ".dato:last-child": { borderBottom: "0" },
    ".dato span": { color: "var(--color-tenue)" },
    ".dato strong": { textAlign: "right", color: "var(--color-navy)", fontWeight: "600" },

    /* Ficha -- grilla de datos, para resumenes mas anchos que una columna. */
    ".ficha": {
      backgroundColor: "var(--color-gris-fondo)",
      borderRadius: "9px",
      padding: "15px 17px",
      marginBottom: "20px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
      gap: "12px",
    },
    ".ficha div span": {
      display: "block",
      fontSize: "11.5px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      color: "var(--color-tenue)",
    },
    ".ficha div strong": { fontSize: "14px", color: "var(--color-navy)", fontWeight: "600" },

    /* ---------------------------------------------------------------
     * Luz / semaforo -- punto de estado, para listas de validacion.
     * ------------------------------------------------------------- */
    ".luz": {
      width: "13px",
      height: "13px",
      borderRadius: "50%",
      flex: "0 0 13px",
      marginTop: "5px",
      display: "inline-block",
    },
    ".luz.verde": { backgroundColor: "var(--color-verde)" },
    ".luz.naranjo": { backgroundColor: "var(--color-naranjo)" },
    ".luz.rojo": { backgroundColor: "var(--color-rojo)" },
    ".luz.gris": { backgroundColor: "var(--color-gris)" },

    /* ---------------------------------------------------------------
     * Linea de tiempo -- historial de eventos, mas reciente abajo.
     * ------------------------------------------------------------- */
    ".linea-tiempo": { listStyle: "none", margin: "0", padding: "0" },
    ".linea-tiempo li": {
      padding: "11px 0 11px 20px",
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
    ".linea-tiempo .ts": { fontSize: "12px", color: "var(--color-tenue)" },
    ".linea-tiempo .txt": { fontSize: "14px" },

    /* ---------------------------------------------------------------
     * Estado vacio -- cuando un listado no tiene filas que mostrar.
     * ------------------------------------------------------------- */
    ".vacio": { textAlign: "center", padding: "38px 20px", color: "var(--color-tenue)" },
    ".vacio p": { margin: "0 0 14px" },

    ".tenue": { color: "var(--color-tenue)" },

    /* ---------------------------------------------------------------
     * Columnas -- layout de pantalla de detalle (ancho variable, nunca
     * tres columnas iguales: la del medio es la que lleva el contenido
     * principal). Se achica a una sola columna en pantallas angostas.
     * ------------------------------------------------------------- */
    ".columnas": {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr) minmax(0, 0.85fr)",
      gap: "18px",
      alignItems: "start",
    },
    "@media (max-width: 1150px)": {
      ".columnas": { gridTemplateColumns: "1fr" },
    },

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
      zIndex: "9000",
      padding: "20px",
    },
    ".modal.visible": { display: "flex" },
    ".modal-panel": {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "26px 28px",
      maxWidth: "620px",
      width: "100%",
      maxHeight: "82vh",
      overflow: "auto",
      boxShadow: "0 22px 60px rgba(4, 20, 36, 0.4)",
    },
    ".modal-panel h3": { margin: "0 0 12px", fontSize: "17px", color: "var(--color-navy)" },
    ".modal-panel .cerrar": {
      marginTop: "16px",
      padding: "10px 18px",
      border: "0",
      borderRadius: "8px",
      backgroundColor: "var(--color-azul)",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
    },

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
      gap: "10px",
      zIndex: "9500",
      maxWidth: "360px",
    },
    ".toast": {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      minWidth: "220px",
      padding: "12px 16px",
      borderRadius: "8px",
      backgroundColor: "var(--color-navy)",
      color: "#fff",
      fontSize: "13.5px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      animation: "santacorina-toast-in 0.18s ease",
    },
    ".toast.ok": { backgroundColor: "#146540" },
    ".toast.alerta": { backgroundColor: "#8a4e08" },
    ".toast.error": { backgroundColor: "#8d241e" },
    ".toast .cerrar": {
      marginLeft: "auto",
      border: "0",
      background: "none",
      color: "inherit",
      opacity: "0.75",
      cursor: "pointer",
      fontSize: "15px",
      lineHeight: "1",
      padding: "0",
    },
    ".toast .cerrar:hover": { opacity: "1" },
    "@keyframes santacorina-toast-in": {
      from: { opacity: "0", transform: "translateY(8px)" },
      to: { opacity: "1", transform: "translateY(0)" },
    },
  };
}
