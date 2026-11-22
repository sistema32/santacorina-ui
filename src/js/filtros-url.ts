/**
 * Filtros con URL compartible -- al cambiar un campo de filtro, su
 * valor queda en `URLSearchParams` (via `history.replaceState`, no
 * `pushState`: cada tecla en un buscador generaria una entrada de
 * historial, saturando "Atras" con texto parcial). Al cargar la
 * pagina, el form se restaura desde la URL -- recargar o usar "Atras"
 * conserva busqueda, orden y pagina. El paquete solo sincroniza el
 * form <-> la URL; volver a pedir los datos filtrados sigue siendo
 * decision de cada pantalla (escucha el `change`/`input` del form o
 * `santacorina:filtros-cambiar`).
 */
import { primeraVez } from "./una-vez.js";

type CampoFiltro = HTMLInputElement | HTMLSelectElement;

function camposDe(form: HTMLFormElement): CampoFiltro[] {
  return Array.from(form.querySelectorAll<CampoFiltro>("input[name], select[name]"));
}

function restaurarDesdeUrl(form: HTMLFormElement): void {
  const params = new URLSearchParams(location.search);
  camposDe(form).forEach((campo) => {
    const valor = params.get(campo.name);
    if (valor === null) return;
    if (campo instanceof HTMLInputElement && campo.type === "checkbox") {
      campo.checked = valor === "1";
    } else {
      campo.value = valor;
    }
  });
}

function sincronizarUrl(form: HTMLFormElement): void {
  const params = new URLSearchParams(location.search);
  camposDe(form).forEach((campo) => {
    const valor =
      campo instanceof HTMLInputElement && campo.type === "checkbox"
        ? (campo.checked ? "1" : "")
        : campo.value;
    if (valor) params.set(campo.name, valor);
    else params.delete(campo.name);
  });
  const query = params.toString();
  history.replaceState(history.state, "", query ? `?${query}` : location.pathname);
  form.dispatchEvent(
    new CustomEvent("santacorina:filtros-cambiar", { bubbles: true, detail: { params: Object.fromEntries(params) } }),
  );
}

/** Sincroniza los campos con `name` de `form` con la URL (query string). */
export function iniciarFiltrosUrl(form: HTMLFormElement): void {
  if (!primeraVez(form, "filtros-url")) return;
  restaurarDesdeUrl(form);
  form.addEventListener("input", () => sincronizarUrl(form));
  form.addEventListener("change", () => sincronizarUrl(form));
  window.addEventListener("popstate", () => restaurarDesdeUrl(form));
}
