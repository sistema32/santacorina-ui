/**
 * Scrollspy (de Bootstrap) -- alterna `.activo` en los links de `nav`
 * segun que seccion esta visible, via `IntersectionObserver`. Solo
 * visual: no hace scroll ni cambia la URL, cada link sigue siendo un
 * `<a href="#seccion">` normal.
 */
import { primeraVez } from "./una-vez.js";

export function iniciarScrollspy(nav: HTMLElement, contenedor: ParentNode = document): void {
  if (!primeraVez(nav, "scrollspy")) return;
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a[href^='#']"));
  const secciones = links
    .map((link) => ({ link, seccion: contenedor.querySelector<HTMLElement>(link.getAttribute("href")!) }))
    .filter((s): s is { link: HTMLAnchorElement; seccion: HTMLElement } => Boolean(s.seccion));

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        const item = secciones.find((s) => s.seccion === entrada.target);
        if (!item) return;
        links.forEach((l) => l.classList.remove("activo"));
        item.link.classList.add("activo");
      });
    },
    { rootMargin: "-20% 0px -70% 0px" },
  );
  secciones.forEach((s) => observador.observe(s.seccion));
}
