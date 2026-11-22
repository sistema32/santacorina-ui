/**
 * Formato chileno de moneda y porcentaje. Trasladado tal cual desde
 * `peso()`/`conSigno()`/`pct()`, duplicados identicos en
 * FinanzasPresupuestoView.vue y FinanzasMatrizView.vue.
 */
declare function pesos(n: number): string;
declare function conSigno(n: number): string;
declare function pct(x: number): string;
declare function fechaCorta(fecha: Date): string;
/** Formatea un RUT chileno a "12.345.678-9" -- acepta con o sin puntos/guion. */
declare function rut(valor: string): string;
/**
 * Valida el digito verificador de un RUT chileno (modulo 11) -- `rut()`
 * arriba SOLO formatea, nunca valido. Funcion pura: la pantalla la
 * conecta a `setCustomValidity()` del campo, mismo criterio que
 * cualquier regla propia del consumidor (el paquete no la aplica
 * automaticamente en ningun lado).
 */
declare function rutValido(valor: string): boolean;
/**
 * Repara mojibake: texto que paso por UTF-8 -> Latin-1 -> UTF-8 sin
 * querer (comun en exportaciones de Excel/correo con tildes rotas, ej.
 * "InformaciÃ³n" en vez de "Información"). Repara cada fragmento roto
 * por separado -- no exige que TODO el string sea Latin-1, asi que un
 * texto mixto como "InformaciÃ³n — prueba" tambien se corrige (el
 * guion largo, que ya es Unicode real, queda intacto). Lo que NO
 * cubre: mojibake que paso por Windows-1252 en vez de Latin-1 (ej.
 * "â€™" en vez de apostrofe) -- ahi los bytes 0x80-0x9F
 * mapean a simbolos distintos (euro, comillas, etc.) y hace falta otra
 * tabla de conversion.
 */
declare function limpiarMojibake(texto: string): string;

declare const formato_conSigno: typeof conSigno;
declare const formato_fechaCorta: typeof fechaCorta;
declare const formato_limpiarMojibake: typeof limpiarMojibake;
declare const formato_pct: typeof pct;
declare const formato_pesos: typeof pesos;
declare const formato_rut: typeof rut;
declare const formato_rutValido: typeof rutValido;
declare namespace formato {
  export { formato_conSigno as conSigno, formato_fechaCorta as fechaCorta, formato_limpiarMojibake as limpiarMojibake, formato_pct as pct, formato_pesos as pesos, formato_rut as rut, formato_rutValido as rutValido };
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
/** Conecta clic en el backdrop, `[data-cerrar-modal]` y Escape (solo la capa superior, ver `una-vez.ts`) para cada `.modal`. */
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

type Opcion = {
    valor: string;
    texto: string;
};
/**
 * Activa busqueda remota en `caja` (un `.combobox` ya presente en el
 * DOM): `buscar(texto)` la implementa el consumidor -- el paquete
 * debounca 250ms y descarta respuestas viejas (si la busqueda de "mar"
 * tarda mas que la de "maria", su respuesta llega despues y no debe
 * pisar la lista ya actualizada). Puede llamarse antes o despues de
 * `iniciarCombobox`/`iniciarTodo`.
 */
declare function iniciarComboboxRemoto(caja: HTMLElement, buscar: (texto: string) => Promise<Opcion[]>): void;
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

/** Libera los listeners globales (document) que `iniciarTodo(raiz)` registro. */
declare function destruirTodo(raiz?: ParentNode): void;

/** Valida nativamente al enviar; arma `.resumen-errores` y `.campo-error` si falla. */
declare function iniciarFormularios(raiz?: ParentNode): void;
/** Estado "guardando" en un boton -- no cambia su ancho (ver `.boton[data-cargando]`). */
declare function ponerCargando(boton: HTMLButtonElement): void;
declare function quitarCargando(boton: HTMLButtonElement): void;

declare function iniciarSeleccionTabla(raiz?: ParentNode): void;

declare function iniciarMenus(raiz?: ParentNode): void;

/**
 * Posicionamiento compartido para capas flotantes (popover, toggletip,
 * calendario, combobox, menu): hoy todas abren siempre hacia abajo,
 * ancladas a un lado fijo -- un menu en la ultima fila de una tabla
 * larga se abre fuera de la pantalla si no hay espacio debajo. La
 * JS solo MIDE y marca `data-posicion="arriba"`; los valores reales
 * de `top`/`bottom` los define el CSS (mismo criterio que
 * `aria-sort`/`data-tono` en el resto del paquete -- nunca estilos
 * inline desde JS).
 *
 * Alcance: solo colision vertical (arriba/abajo). Colision horizontal
 * (desborda los costados) queda fuera -- no hay un caso concreto que
 * lo pida.
 */
declare function posicionarFlotante(ancla: HTMLElement, panel: HTMLElement): void;

/** Sincroniza los campos con `name` de `form` con la URL (query string). */
declare function iniciarFiltrosUrl(form: HTMLFormElement): void;

/** true si `form` difiere de la foto tomada por `iniciarCambiosSinGuardar`. */
declare function huboCambios(form: HTMLFormElement): boolean;
/** Toma una foto de `form` y avisa (`beforeunload`) si se sale con cambios sin guardar. */
declare function iniciarCambiosSinGuardar(form: HTMLFormElement): void;

declare function iniciarGruposRepetibles(raiz?: ParentNode): void;

/** Valor numerico real del campo -- `null` si esta vacio, distinto de `0`. */
declare function valorClp(input: HTMLInputElement): number | null;
declare function iniciarCamposClp(raiz?: ParentNode): void;

declare function iniciarReintento(contenedor: HTMLElement, cargar: () => Promise<void>): void;

interface OpcionesConfirmar {
    titulo: string;
    mensaje: string;
    textoConfirmar?: string;
    textoCancelar?: string;
    peligro?: boolean;
}
declare function confirmar(opciones: OpcionesConfirmar): Promise<boolean>;

declare function iniciarVistaPrevia(raiz?: ParentNode): void;

type SubirArchivo = (file: File, onProgreso: (pct: number) => void, señal: AbortSignal) => Promise<void>;
/** `zona` es el contenedor con `.zona-arrastre` (drop) + `input[type=file]` + un `[data-adjuntos-lista]` donde van las filas. */
declare function iniciarColaAdjuntos(zona: HTMLElement, subirArchivo: SubirArchivo): void;

declare function iniciarScrollspy(nav: HTMLElement, contenedor?: ParentNode): void;

/** Conecta todo lo auto-iniciable. */
declare function iniciarTodo(raiz?: ParentNode): void;

export { abrirModal, avanzarCarrusel, cerrarModal, confirmar, copiarAlPortapapeles, debounce, destruirTodo, formato, huboCambios, iniciarAsistentes, iniciarBuscadores, iniciarCajones, iniciarCalendario, iniciarCambiosSinGuardar, iniciarCamposClp, iniciarCarruseles, iniciarColaAdjuntos, iniciarColapsables, iniciarCombobox, iniciarComboboxRemoto, iniciarContadores, iniciarFiltrosUrl, iniciarFormularios, iniciarGruposRepetibles, iniciarLateral, iniciarMedidorClave, iniciarMenus, iniciarModales, iniciarPopovers, iniciarRangoFechas, iniciarReintento, iniciarResumenErrores, iniciarScrollspy, iniciarSeleccionTabla, iniciarTablasOrdenables, iniciarTabs, iniciarTodo, iniciarToggletips, iniciarVistaPrevia, iniciarZonasArrastre, irAPaso, mostrarToast, ponerCargando, posicionarFlotante, quitarCargando, valorClp };
