/**
 * Collapse generico: a diferencia de `.acordeon` (auto-contenido en
 * `<details>`), el boton y el panel pueden vivir en cualquier parte del
 * DOM, y varios son independientes entre si (no mutuamente excluyentes
 * como `.tabs`). Reutiliza `.tab-panel`/`.tab-panel.activo`.
 */
export function iniciarColapsables(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>("[data-colapsar]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const destino = boton.dataset.colapsar;
      if (!destino) return;
      document.querySelectorAll<HTMLElement>(`[data-colapsable="${destino}"]`).forEach((panel) => {
        panel.classList.toggle("activo");
      });
    });
  });
}
