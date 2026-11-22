/**
 * Resumen de errores -- patron de accesibilidad de GOV.UK Design
 * System (design-system.service.gov.uk/components/error-summary): una
 * caja al inicio del formulario que lista cada error con un link al
 * campo correspondiente. Al existir (tiene al menos un link), recibe
 * el foco apenas se renderiza, para que un lector de pantalla lo
 * anuncie antes de llegar al formulario -- el consumidor decide
 * cuando renderizarla (tras un intento de envio fallido), este modulo
 * solo maneja el foco y la navegacion a cada campo.
 */
import { primeraVez } from "./una-vez.js";

export function iniciarResumenErrores(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(".resumen-errores").forEach((caja) => {
    if (!primeraVez(caja, "resumen-errores")) return;
    const links = caja.querySelectorAll<HTMLAnchorElement>("a[href^='#']");
    if (links.length === 0) return;

    if (!caja.hasAttribute("tabindex")) caja.setAttribute("tabindex", "-1");
    caja.focus();

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        const destino = document.querySelector<HTMLElement>(link.getAttribute("href")!);
        if (!destino) return;
        e.preventDefault();
        destino.scrollIntoView({ behavior: "smooth", block: "center" });
        destino.focus({ preventScroll: true });
      });
    });
  });
}
