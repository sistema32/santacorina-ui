/**
 * Generaliza el panel deslizante que ya tiene `.lateral` en movil, para
 * usarlo en *otra* cosa (ej. un panel de filtros), no solo el menu.
 */
export function iniciarCajones(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>("[data-cajon-toggle]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const destino = boton.dataset.cajonToggle;
      if (!destino) return;
      const cajon = document.querySelector<HTMLElement>(`[data-cajon="${destino}"]`);
      const fondo = cajon?.querySelector<HTMLElement>(".cajon-fondo") ?? document.querySelector<HTMLElement>(`[data-cajon-fondo="${destino}"]`);
      cajon?.classList.toggle("abierto");
      fondo?.classList.toggle("visible");
    });
  });

  raiz.querySelectorAll<HTMLElement>("[data-cajon-fondo]").forEach((fondo) => {
    fondo.addEventListener("click", () => {
      const destino = fondo.dataset.cajonFondo;
      if (!destino) return;
      document.querySelector<HTMLElement>(`[data-cajon="${destino}"]`)?.classList.remove("abierto");
      fondo.classList.remove("visible");
    });
  });
}
