/**
 * Abrir/cerrar `.modal` -- el README de 0.1.0 nunca dijo como hacerlo,
 * cada pantalla lo habria inventado distinto. Atrapa el foco mientras
 * esta abierto y lo devuelve al cerrar (ver foco.ts).
 */
import { atraparFoco } from "./foco.js";
import { apilarCapa, primeraVez } from "./una-vez.js";

const liberadores = new WeakMap<HTMLElement, () => void>();
const desapiladores = new WeakMap<HTMLElement, () => void>();

export function abrirModal(el: HTMLElement): void {
  if (!el.getAttribute("role")) el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.classList.add("visible");
  const panel = el.querySelector<HTMLElement>(".modal-panel") ?? el;
  liberadores.set(el, atraparFoco(panel));
  desapiladores.set(el, apilarCapa(() => cerrarModal(el)));
  el.dispatchEvent(new CustomEvent("santacorina:modal-abrir", { bubbles: true }));
}

export function cerrarModal(el: HTMLElement): void {
  if (!el.classList.contains("visible")) return;
  el.classList.remove("visible");
  liberadores.get(el)?.();
  liberadores.delete(el);
  desapiladores.get(el)?.();
  desapiladores.delete(el);
  el.dispatchEvent(new CustomEvent("santacorina:modal-cerrar", { bubbles: true }));
}

function cerrarSiCorresponde(modal: HTMLElement, objetivo: EventTarget | null): void {
  if (objetivo === modal || (objetivo instanceof Element && objetivo.closest("[data-cerrar-modal]"))) {
    cerrarModal(modal);
  }
}

/** Conecta clic en el backdrop, `[data-cerrar-modal]` y Escape (solo la capa superior, ver `una-vez.ts`) para cada `.modal`. */
export function iniciarModales(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(".modal").forEach((modal) => {
    if (!primeraVez(modal, "modal")) return;
    modal.addEventListener("click", (e) => cerrarSiCorresponde(modal, e.target));
  });
}
