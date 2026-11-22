/**
 * Generaliza el panel deslizante que ya tiene `.lateral` en movil, para
 * usarlo en *otra* cosa (ej. un panel de filtros), no solo el menu.
 * Mismo manejo de foco que `.modal` (ver foco.ts): son el mismo patron
 * de capa modal/deslizante.
 */
import { atraparFoco } from "./foco.js";

const liberadores = new WeakMap<HTMLElement, () => void>();

function abrir(cajon: HTMLElement, fondo: HTMLElement | null | undefined): void {
  if (!cajon.getAttribute("role")) cajon.setAttribute("role", "dialog");
  cajon.setAttribute("aria-modal", "true");
  cajon.classList.add("abierto");
  fondo?.classList.add("visible");
  liberadores.set(cajon, atraparFoco(cajon));
}

function cerrar(cajon: HTMLElement, fondo: HTMLElement | null | undefined): void {
  cajon.classList.remove("abierto");
  fondo?.classList.remove("visible");
  liberadores.get(cajon)?.();
  liberadores.delete(cajon);
}

export function iniciarCajones(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>("[data-cajon-toggle]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const destino = boton.dataset.cajonToggle;
      if (!destino) return;
      const cajon = document.querySelector<HTMLElement>(`[data-cajon="${destino}"]`);
      if (!cajon) return;
      const fondo = cajon.querySelector<HTMLElement>(".cajon-fondo") ?? document.querySelector<HTMLElement>(`[data-cajon-fondo="${destino}"]`);
      if (cajon.classList.contains("abierto")) cerrar(cajon, fondo);
      else abrir(cajon, fondo);
    });
  });

  raiz.querySelectorAll<HTMLElement>("[data-cajon-fondo]").forEach((fondo) => {
    fondo.addEventListener("click", () => {
      const destino = fondo.dataset.cajonFondo;
      if (!destino) return;
      const cajon = document.querySelector<HTMLElement>(`[data-cajon="${destino}"]`);
      if (cajon) cerrar(cajon, fondo);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    raiz.querySelectorAll<HTMLElement>(".cajon.abierto").forEach((cajon) => {
      const destino = cajon.dataset.cajon;
      const fondo = cajon.querySelector<HTMLElement>(".cajon-fondo") ?? (destino ? document.querySelector<HTMLElement>(`[data-cajon-fondo="${destino}"]`) : null);
      cerrar(cajon, fondo);
    });
  });
}
