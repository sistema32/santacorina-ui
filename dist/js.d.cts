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

declare function iniciarLateral(raiz?: ParentNode): void;

declare function iniciarTabs(raiz?: ParentNode): void;

declare function iniciarRangoFechas(raiz?: ParentNode): void;

declare function iniciarCalendario(raiz?: ParentNode): void;

declare function iniciarBuscadores(raiz?: ParentNode): void;

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
declare function iniciarAsistentes(raiz?: ParentNode): void;

declare function iniciarZonasArrastre(raiz?: ParentNode): void;

declare function iniciarToggletips(raiz?: ParentNode): void;

declare function iniciarResumenErrores(raiz?: ParentNode): void;

declare function iniciarTablasOrdenables(raiz?: ParentNode): void;

declare function iniciarCarruseles(raiz?: ParentNode): void;
/** Avanza (o retrocede) un carousel ya iniciado -- para autoplay manual. */
declare function avanzarCarrusel(carousel: HTMLElement, direccion?: 1 | -1): void;

/** Conecta todo lo auto-iniciable. */
declare function iniciarTodo(raiz?: ParentNode): void;

export { abrirModal, avanzarCarrusel, cerrarModal, copiarAlPortapapeles, debounce, formato, iniciarAsistentes, iniciarBuscadores, iniciarCajones, iniciarCalendario, iniciarCarruseles, iniciarColapsables, iniciarCombobox, iniciarContadores, iniciarLateral, iniciarMedidorClave, iniciarModales, iniciarPopovers, iniciarRangoFechas, iniciarResumenErrores, iniciarTablasOrdenables, iniciarTabs, iniciarTodo, iniciarToggletips, iniciarZonasArrastre, irAPaso, mostrarToast };
