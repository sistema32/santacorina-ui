/**
 * Toggletip -- como `[data-tooltip]`, pero se abre con clic/tap en vez
 * de hover: `[data-tooltip]` no tiene ningun soporte en pantallas
 * tactiles (no hay hover). Mismo patron de capa flotante que
 * `.popover-panel`, pero sin `atraparFoco` completo -- un toggletip no
 * es modal, solo recibe el foco inicial al abrir.
 */
import { idDe } from "./foco.js";

export function iniciarToggletips(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>("[data-toggletip]").forEach((contenedor) => {
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
      panel.classList.remove("visible");
      trigger.setAttribute("aria-expanded", "false");
      if (devolverFoco) trigger.focus();
    };
    const alternar = (e: Event) => {
      e.stopPropagation();
      const abrir = !panel.classList.contains("visible");
      panel.classList.toggle("visible", abrir);
      trigger.setAttribute("aria-expanded", String(abrir));
    };

    trigger.addEventListener("click", alternar);
    document.addEventListener("click", (e) => {
      if (!contenedor.contains(e.target as Node)) cerrar();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("visible")) cerrar(true);
    });
  });
}
