/**
 * Seleccion de filas y acciones masivas -- de Carbon Design System
 * (data table). El checkbox de cabecera marca/desmarca solo las filas
 * VISIBLES en esa tabla (la pagina actual); el paquete no sabe cuantas
 * filas hay en otras paginas del servidor, asi que "seleccionar todas
 * las N paginas" queda fuera de alcance (ver README/CHANGELOG) -- esto
 * solo deja el evento y `.barra-seleccion` como base para que cada
 * pantalla agregue ese banner si lo necesita.
 */
import { primeraVez } from "./una-vez.js";

export function iniciarSeleccionTabla(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLTableElement>("table[data-seleccion]").forEach((tabla) => {
    if (!primeraVez(tabla, "seleccion-tabla")) return;
    const todo = tabla.querySelector<HTMLInputElement>("[data-seleccionar-todo]");
    const filas = () => Array.from(tabla.querySelectorAll<HTMLInputElement>("[data-seleccionar-fila]"));
    const barra = tabla.dataset.seleccionBarra
      ? document.querySelector<HTMLElement>(tabla.dataset.seleccionBarra)
      : (tabla.parentElement?.querySelector<HTMLElement>(".barra-seleccion") ?? null);

    const emitir = () => {
      const marcadas = filas().filter((f) => f.checked);
      const ids = marcadas.map((f) => f.value);
      tabla.dispatchEvent(
        new CustomEvent("santacorina:seleccion-cambiar", {
          bubbles: true,
          detail: { ids, total: filas().length },
        })
      );
      if (barra) {
        barra.classList.toggle("visible", ids.length > 0);
        const contador = barra.querySelector("[data-seleccion-contador]");
        if (contador) contador.textContent = `${ids.length} seleccionado${ids.length === 1 ? "" : "s"}`;
      }
      if (todo) {
        todo.checked = marcadas.length > 0 && marcadas.length === filas().length;
        todo.indeterminate = marcadas.length > 0 && marcadas.length < filas().length;
      }
    };

    todo?.addEventListener("change", () => {
      filas().forEach((f) => (f.checked = todo.checked));
      emitir();
    });
    filas().forEach((f) => f.addEventListener("change", emitir));

    emitir();
  });
}
