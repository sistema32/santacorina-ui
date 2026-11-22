/**
 * Tooltip con contenido rico, abierto por clic (no por hover como
 * `[data-tooltip]`). El contenido vive oculto en `[data-popover-contenido]`
 * dentro del mismo `[data-popover]`, y se clona al panel la primera vez.
 * El trigger recibe `aria-haspopup`/`aria-expanded`; el panel,
 * `role="dialog"`; al cerrar con Escape el foco vuelve al trigger.
 */
import { idDe } from "./foco.js";
import { primeraVez, registrarDestructor } from "./una-vez.js";

export function iniciarPopovers(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>("[data-popover]").forEach((contenedor) => {
    if (!primeraVez(contenedor, "popover")) return;
    const trigger = contenedor.querySelector<HTMLElement>("[data-popover-trigger]") ?? contenedor.firstElementChild as HTMLElement;
    const fuente = contenedor.querySelector<HTMLElement>("[data-popover-contenido]");
    if (!trigger || !fuente) return;

    const panel = document.createElement("div");
    panel.className = "popover-panel";
    panel.setAttribute("role", "dialog");
    panel.innerHTML = fuente.innerHTML;
    contenedor.appendChild(panel);

    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-controls", idDe(panel, "popover"));
    trigger.setAttribute("aria-expanded", "false");

    const cerrar = (devolverFoco = false) => {
      if (!panel.classList.contains("visible")) return;
      panel.classList.remove("visible");
      trigger.setAttribute("aria-expanded", "false");
      if (devolverFoco) trigger.focus();
      contenedor.dispatchEvent(new CustomEvent("santacorina:popover-cerrar", { bubbles: true }));
    };
    const alternar = (e: Event) => {
      e.stopPropagation();
      const abrir = !panel.classList.contains("visible");
      panel.classList.toggle("visible", abrir);
      trigger.setAttribute("aria-expanded", String(abrir));
      if (abrir) contenedor.dispatchEvent(new CustomEvent("santacorina:popover-abrir", { bubbles: true }));
      else contenedor.dispatchEvent(new CustomEvent("santacorina:popover-cerrar", { bubbles: true }));
    };
    const alClicAfuera = (e: Event) => {
      if (!contenedor.contains(e.target as Node)) cerrar();
    };
    const alTeclado = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panel.classList.contains("visible")) cerrar(true);
    };

    trigger.addEventListener("click", alternar);
    document.addEventListener("click", alClicAfuera);
    document.addEventListener("keydown", alTeclado);
    registrarDestructor(raiz, () => {
      document.removeEventListener("click", alClicAfuera);
      document.removeEventListener("keydown", alTeclado);
    });
  });
}
