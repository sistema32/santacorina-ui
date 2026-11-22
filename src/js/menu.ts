/**
 * Mejora progresiva sobre `.menu` (`<details>/<summary>` nativo, 0.11.0):
 * el abrir/cerrar basico sigue funcionando sin JS -- esto solo agrega
 * roles ARIA de menu, navegacion por flechas entre items, foco inicial
 * al abrir, posicionamiento (hacia arriba si no hay espacio abajo, ver
 * `flotante.ts`) y que Escape cierre solo esta capa (ver `una-vez.ts`).
 */
import { posicionarFlotante } from "./flotante.js";
import { apilarCapa, primeraVez } from "./una-vez.js";

export function iniciarMenus(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLDetailsElement>("details.menu").forEach((detalle) => {
    if (!primeraVez(detalle, "menu")) return;
    const resumen = detalle.querySelector<HTMLElement>("summary");
    const panel = detalle.querySelector<HTMLElement>(".menu-panel");
    if (!resumen || !panel) return;

    panel.setAttribute("role", "menu");
    const items = () => Array.from(panel.querySelectorAll<HTMLElement>(":scope > a, :scope > button"));
    items().forEach((item) => item.setAttribute("role", "menuitem"));

    let desapilar: (() => void) | null = null;
    detalle.addEventListener("toggle", () => {
      if (detalle.open) {
        posicionarFlotante(resumen, panel);
        items()[0]?.focus();
        desapilar = apilarCapa(() => {
          detalle.open = false;
        });
      } else {
        desapilar?.();
        desapilar = null;
      }
    });

    panel.addEventListener("keydown", (e) => {
      const lista = items();
      const actual = lista.indexOf(document.activeElement as HTMLElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        lista[Math.min(actual + 1, lista.length - 1)]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        lista[Math.max(actual - 1, 0)]?.focus();
      }
    });
  });
}
