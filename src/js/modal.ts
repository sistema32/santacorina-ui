/**
 * Abrir/cerrar `.modal` -- el README de 0.1.0 nunca dijo como hacerlo,
 * cada pantalla lo habria inventado distinto. Atrapa el foco mientras
 * esta abierto y lo devuelve al cerrar (ver foco.ts).
 */
import { atraparFoco } from "./foco.js";
import { primeraVez } from "./una-vez.js";

const liberadores = new WeakMap<HTMLElement, () => void>();

export function abrirModal(el: HTMLElement): void {
  if (!el.getAttribute("role")) el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.classList.add("visible");
  const panel = el.querySelector<HTMLElement>(".modal-panel") ?? el;
  liberadores.set(el, atraparFoco(panel));
}

export function cerrarModal(el: HTMLElement): void {
  el.classList.remove("visible");
  liberadores.get(el)?.();
  liberadores.delete(el);
}

function cerrarSiCorresponde(modal: HTMLElement, objetivo: EventTarget | null): void {
  if (objetivo === modal || (objetivo instanceof Element && objetivo.closest("[data-cerrar-modal]"))) {
    cerrarModal(modal);
  }
}

/** Conecta clic en el backdrop, `[data-cerrar-modal]` y Escape para cada `.modal`. */
export function iniciarModales(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(".modal").forEach((modal) => {
    if (!primeraVez(modal, "modal")) return;
    modal.addEventListener("click", (e) => cerrarSiCorresponde(modal, e.target));
  });
  if (primeraVez(document.documentElement, "modal-escape-global")) {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      document.querySelectorAll<HTMLElement>(".modal.visible").forEach((modal) => cerrarModal(modal));
    });
  }
}
