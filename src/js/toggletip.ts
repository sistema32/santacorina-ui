/**
 * Toggletip -- como `[data-tooltip]`, pero se abre con clic/tap en vez
 * de hover: `[data-tooltip]` no tiene ningun soporte en pantallas
 * tactiles (no hay hover). Mismo patron de capa flotante que
 * `.popover-panel`, pero sin `atraparFoco` completo -- un toggletip no
 * es modal, solo recibe el foco inicial al abrir.
 */
import { idDe } from "./foco.js";
import { activar, desactivar, primeraVez, registrarDestructor } from "./una-vez.js";

const instancias = new WeakMap<HTMLElement, { panel: HTMLElement; cerrar: (devolverFoco?: boolean) => void }>();

export function iniciarToggletips(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>("[data-toggletip]").forEach((contenedor) => {
    if (primeraVez(contenedor, "toggletip")) {
      const trigger = contenedor.querySelector<HTMLElement>("[data-toggletip-trigger]") ?? (contenedor.firstElementChild as HTMLElement);
      const fuente = contenedor.querySelector<HTMLElement>("[data-toggletip-contenido]");
      if (!trigger || !fuente) return;

      const panel = document.createElement("div");
      panel.className = "toggletip-panel";
      panel.setAttribute("role", "tooltip");
      panel.innerHTML = fuente.innerHTML;
      contenedor.appendChild(panel);

      trigger.setAttribute("aria-describedby", idDe(panel, "toggletip"));
      trigger.setAttribute("aria-expanded", "false");

      const cerrar = (devolverFoco = false) => {
        if (!panel.classList.contains("visible")) return;
        panel.classList.remove("visible");
        trigger.setAttribute("aria-expanded", "false");
        if (devolverFoco) trigger.focus();
        contenedor.dispatchEvent(new CustomEvent("santacorina:toggletip-cerrar", { bubbles: true }));
      };
      const alternar = (e: Event) => {
        e.stopPropagation();
        const abrir = !panel.classList.contains("visible");
        panel.classList.toggle("visible", abrir);
        trigger.setAttribute("aria-expanded", String(abrir));
        if (abrir) contenedor.dispatchEvent(new CustomEvent("santacorina:toggletip-abrir", { bubbles: true }));
        else contenedor.dispatchEvent(new CustomEvent("santacorina:toggletip-cerrar", { bubbles: true }));
      };

      trigger.addEventListener("click", alternar);
      instancias.set(contenedor, { panel, cerrar });
    }

    // Separado del bloque de arriba (que corre una sola vez por
    // elemento): `destruirTodo(raiz)` puede apagar este listener sin
    // que `raiz` se reemplace, y una llamada posterior a
    // `iniciarTodo(raiz)` sobre el MISMO nodo debe poder reactivarlo.
    const instancia = instancias.get(contenedor);
    if (!instancia || !activar(contenedor, "toggletip-doc")) return;
    const alClicAfuera = (e: Event) => {
      if (!contenedor.contains(e.target as Node)) instancia.cerrar();
    };
    const alTeclado = (e: KeyboardEvent) => {
      if (e.key === "Escape" && instancia.panel.classList.contains("visible")) instancia.cerrar(true);
    };
    document.addEventListener("click", alClicAfuera);
    document.addEventListener("keydown", alTeclado);
    registrarDestructor(raiz, () => {
      document.removeEventListener("click", alClicAfuera);
      document.removeEventListener("keydown", alTeclado);
      desactivar(contenedor, "toggletip-doc");
    });
  });
}
