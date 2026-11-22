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
 * Alterna `.activo` al hacer clic dentro de `.tabs`. Si el boton tiene
 * `data-tab="x"`, tambien muestra `[data-tab-panel="x"]` y oculta el
 * resto -- retrocompatible: un `.tabs` sin `data-tab` sigue siendo solo
 * un segmented control, como hasta 0.9.0. `.tabs` recibe `role="tablist"`,
 * cada boton `role="tab"` + `aria-selected`, y cada panel `role="tabpanel"`
 * + `aria-hidden` en espejo con `.activo`.
 */
declare function iniciarTabs(raiz?: ParentNode): void;

/**
 * Sincroniza min/max entre dos `input[type=date]` (desde/hasta) dentro de
 * un `[data-rango-fechas]` -- no se puede elegir un "hasta" anterior al
 * "desde". Sobre inputs nativos, cero CSS nuevo.
 */
declare function iniciarRangoFechas(raiz?: ParentNode): void;

declare function iniciarCalendario(raiz?: ParentNode): void;

/**
 * Muestra/oculta el boton `.limpiar` de `.buscador` segun si el input
 * tiene texto, y lo conecta para vaciarlo (dispara `input` para que
 * cualquier `debounce`/v-model enganchado lo reciba).
 */
declare function iniciarBuscadores(raiz?: ParentNode): void;

/**
 * Actualiza un `.contador-caracteres` junto a un `textarea[data-contador]`
 * con `maxlength`, marcando `.cerca` (90%) y `.lleno` (100%).
 */
declare function iniciarContadores(raiz?: ParentNode): void;

declare function iniciarPopovers(raiz?: ParentNode): void;

declare function iniciarColapsables(raiz?: ParentNode): void;

declare function iniciarCajones(raiz?: ParentNode): void;

declare function iniciarCombobox(raiz?: ParentNode): void;

declare function iniciarMedidorClave(raiz?: ParentNode): void;

/**
 * Asistente de varios pasos (wizard): mueve `.visible` en `[data-paso]`
 * y `.activo`/`.completado` en `[data-chip]` dentro del contenedor.
 * Avanzar sigue siendo decision de cada pantalla -- cada una valida
 * *antes* de llamar `irAPaso` (ej. una validacion async antes de pasar
 * al paso 2), el paquete no auto-avanza un boton "Continuar".
 */
declare function irAPaso(asistente: HTMLElement, n: number): void;
/**
 * Conecta el clic en un chip ya completado o activo para volver a ese
 * paso -- no deja saltar a uno todavia no alcanzado.
 */
declare function iniciarAsistentes(raiz?: ParentNode): void;

/**
 * Zona de arrastrar-y-soltar: solo alterna `.activa` en
 * dragover/dragleave/drop -- la subida real del archivo (FormData,
 * endpoint) sigue siendo de cada pantalla, igual criterio que
 * `.buscador`/`.combobox`: el paquete resuelve la interaccion visual,
 * no la logica de negocio.
 */
declare function iniciarZonasArrastre(raiz?: ParentNode): void;

/** Conecta todo lo auto-iniciable. */
declare function iniciarTodo(raiz?: ParentNode): void;

export { abrirModal, cerrarModal, copiarAlPortapapeles, debounce, formato, iniciarAsistentes, iniciarBuscadores, iniciarCajones, iniciarCalendario, iniciarColapsables, iniciarCombobox, iniciarContadores, iniciarLateral, iniciarMedidorClave, iniciarModales, iniciarPopovers, iniciarRangoFechas, iniciarTabs, iniciarTodo, iniciarZonasArrastre, irAPaso, mostrarToast };
