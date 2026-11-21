/**
 * Abrir/cerrar `.modal` -- el README de 0.1.0 nunca dijo como hacerlo,
 * cada pantalla lo habria inventado distinto.
 */
export function abrirModal(el: HTMLElement): void {
  el.classList.add("visible");
}

export function cerrarModal(el: HTMLElement): void {
  el.classList.remove("visible");
}

function cerrarSiCorresponde(modal: HTMLElement, objetivo: EventTarget | null): void {
  if (objetivo === modal || (objetivo instanceof Element && objetivo.closest("[data-cerrar-modal]"))) {
    cerrarModal(modal);
  }
}

/** Conecta clic en el backdrop, `[data-cerrar-modal]` y Escape para cada `.modal`. */
export function iniciarModales(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => cerrarSiCorresponde(modal, e.target));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    raiz.querySelectorAll<HTMLElement>(".modal.visible").forEach((modal) => cerrarModal(modal));
  });
}
