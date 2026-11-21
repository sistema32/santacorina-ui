/**
 * Formato chileno de moneda y porcentaje. Trasladado tal cual desde
 * `peso()`/`conSigno()`/`pct()`, duplicados identicos en
 * FinanzasPresupuestoView.vue y FinanzasMatrizView.vue.
 */
declare function pesos(n: number): string;
declare function conSigno(n: number): string;
declare function pct(x: number): string;
declare function fechaCorta(fecha: Date): string;

declare const formato_conSigno: typeof conSigno;
declare const formato_fechaCorta: typeof fechaCorta;
declare const formato_pct: typeof pct;
declare const formato_pesos: typeof pesos;
declare namespace formato {
  export { formato_conSigno as conSigno, formato_fechaCorta as fechaCorta, formato_pct as pct, formato_pesos as pesos };
}

/** Retrasa `fn` hasta que pasen `ms` sin una nueva llamada -- para inputs de busqueda. */
declare function debounce<A extends unknown[]>(fn: (...args: A) => void, ms?: number): (...args: A) => void;

/**
 * `navigator.clipboard` exige un contexto seguro (HTTPS); la plataforma
 * hoy corre sobre HTTP en red interna (ver sgp/CLAUDE.md, "Seguridad"),
 * asi que sin el fallback esto fallaria en silencio en produccion.
 */
declare function copiarAlPortapapeles(texto: string): Promise<boolean>;

/**
 * Abrir/cerrar `.modal` -- el README de 0.1.0 nunca dijo como hacerlo,
 * cada pantalla lo habria inventado distinto.
 */
declare function abrirModal(el: HTMLElement): void;
declare function cerrarModal(el: HTMLElement): void;
/** Conecta clic en el backdrop, `[data-cerrar-modal]` y Escape para cada `.modal`. */
declare function iniciarModales(raiz?: ParentNode): void;

/**
 * Crear y descartar `.toast` -- el CHANGELOG de 0.1.0 ya decia "necesita
 * JS para aparecer/desaparecer" y nadie lo habia escrito todavia.
 */
type TipoToast = "ok" | "alerta" | "error" | undefined;
declare function mostrarToast(mensaje: string, tipo?: TipoToast, duracionMs?: number): HTMLElement;

/**
 * Conecta `.lateral-toggle` con `.lateral`/`.lateral-fondo` -- el README
 * de 0.5.0 decia que el consumidor debia agregar "un click handler de
 * unas lineas"; con esto ya no hace falta escribir nada.
 */
declare function iniciarLateral(raiz?: ParentNode): void;

/**
 * Alterna `.activo` al hacer clic dentro de `.tabs` -- solo mueve la
 * clase, el filtrado de contenido lo sigue resolviendo cada pantalla.
 */
declare function iniciarTabs(raiz?: ParentNode): void;

/**
 * Sincroniza min/max entre dos `input[type=date]` (desde/hasta) dentro de
 * un `[data-rango-fechas]` -- no se puede elegir un "hasta" anterior al
 * "desde". Sobre inputs nativos, cero CSS nuevo.
 */
declare function iniciarRangoFechas(raiz?: ParentNode): void;

declare function iniciarCalendario(raiz?: ParentNode): void;

/** Conecta todo lo auto-iniciable (modal, lateral, tabs, rango de fechas, calendario). */
declare function iniciarTodo(raiz?: ParentNode): void;

export { abrirModal, cerrarModal, copiarAlPortapapeles, debounce, formato, iniciarCalendario, iniciarLateral, iniciarModales, iniciarRangoFechas, iniciarTabs, iniciarTodo, mostrarToast };
