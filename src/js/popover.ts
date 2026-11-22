/**
 * Tooltip con contenido rico, abierto por clic (no por hover como
 * `[data-tooltip]`). El contenido vive oculto en `[data-popover-contenido]`
 * dentro del mismo `[data-popover]`, y se clona al panel la primera vez.
 */
export function iniciarPopovers(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>("[data-popover]").forEach((contenedor) => {
    const trigger = contenedor.querySelector<HTMLElement>("[data-popover-trigger]") ?? contenedor.firstElementChild;
    const fuente = contenedor.querySelector<HTMLElement>("[data-popover-contenido]");
    if (!trigger || !fuente) return;

    const panel = document.createElement("div");
    panel.className = "popover-panel";
    panel.innerHTML = fuente.innerHTML;
    contenedor.appendChild(panel);

    const cerrar = () => panel.classList.remove("visible");
    const alternar = (e: Event) => {
      e.stopPropagation();
      panel.classList.toggle("visible");
    };

    trigger.addEventListener("click", alternar);
    document.addEventListener("click", (e) => {
      if (!contenedor.contains(e.target as Node)) cerrar();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") cerrar();
    });
  });
}
