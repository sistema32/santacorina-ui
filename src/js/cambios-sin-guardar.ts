/**
 * Avisa antes de salir si un formulario tiene cambios sin guardar.
 * Compara contra una foto (`FormData` serializado) tomada al iniciar
 * -- si la pantalla recarga el form tras guardar (ej. vuelve a pedir
 * los datos), debe llamar `iniciarCambiosSinGuardar` de nuevo para
 * tomar una foto nueva. `beforeunload` cubre recargar/cerrar la
 * pestaña; para navegacion DENTRO de una SPA (un router que no
 * dispara `beforeunload`), `huboCambios(form)` queda exportada suelta
 * para que la pantalla la use en su propio guard de navegacion (ej.
 * `beforeRouteLeave` de Vue Router).
 */
import { primeraVez } from "./una-vez.js";

function serializar(form: HTMLFormElement): string {
  const partes: string[] = [];
  new FormData(form).forEach((valor, clave) => partes.push(`${clave}=${typeof valor === "string" ? valor : valor.name}`));
  return partes.join("&");
}

const fotos = new WeakMap<HTMLFormElement, string>();
// WeakMap no se puede recorrer -- se necesita una lista aparte para
// saber CUALES forms chequear en `beforeunload` (un solo listener
// compartido, no uno por form).
const formularios: HTMLFormElement[] = [];

/** true si `form` difiere de la foto tomada por `iniciarCambiosSinGuardar`. */
export function huboCambios(form: HTMLFormElement): boolean {
  const foto = fotos.get(form);
  return foto !== undefined && foto !== serializar(form);
}

let avisoActivo = false;

/** Toma una foto de `form` y avisa (`beforeunload`) si se sale con cambios sin guardar. */
export function iniciarCambiosSinGuardar(form: HTMLFormElement): void {
  fotos.set(form, serializar(form));
  if (!primeraVez(form, "cambios-sin-guardar")) return;
  formularios.push(form);

  if (!avisoActivo) {
    avisoActivo = true;
    window.addEventListener("beforeunload", (e) => {
      if (formularios.some((f) => huboCambios(f))) e.preventDefault();
    });
  }
}
