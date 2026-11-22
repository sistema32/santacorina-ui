/**
 * Collapse generico: a diferencia de `.acordeon` (auto-contenido en
 * `<details>`), el boton y el panel pueden vivir en cualquier parte del
 * DOM, y varios son independientes entre si (no mutuamente excluyentes
 * como `.tabs`). Reutiliza `.tab-panel`/`.tab-panel.activo`. El boton
 * recibe `aria-expanded`/`aria-controls` apuntando al panel.
 */
import { idDe } from "./foco.js";
import { primeraVez } from "./una-vez.js";

export function iniciarColapsables(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>("[data-colapsar]").forEach((boton) => {
    if (!primeraVez(boton, "colapsar")) return;
    const destino = boton.dataset.colapsar;
    if (!destino) return;
    const paneles = Array.from(document.querySelectorAll<HTMLElement>(`[data-colapsable="${destino}"]`));
    if (paneles.length > 0) {
      boton.setAttribute("aria-controls", paneles.map((p) => idDe(p, "colapsable")).join(" "));
    }
    boton.setAttribute("aria-expanded", paneles.some((p) => p.classList.contains("activo")) ? "true" : "false");

    boton.addEventListener("click", () => {
      let abierto = false;
      paneles.forEach((panel) => {
        panel.classList.toggle("activo");
        abierto = abierto || panel.classList.contains("activo");
      });
      boton.setAttribute("aria-expanded", abierto ? "true" : "false");
      boton.dispatchEvent(
        new CustomEvent(abierto ? "santacorina:colapsar-abrir" : "santacorina:colapsar-cerrar", { bubbles: true }),
      );
    });
  });
}
