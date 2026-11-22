/**
 * Carousel -- de Bootstrap. En 0.11.0 se dejo fuera a proposito ("sin
 * caso de uso en un portal de compras publicas"); se agrega ahora como
 * paridad de framework (preventivo, mismo criterio que `.hero`).
 *
 * Sin autoplay por defecto: el paquete resuelve clic en
 * anterior/siguiente/indicadores y las flechas de teclado -- si una
 * pantalla quiere que avance solo, llama `avanzarCarrusel(el, 1)` con
 * su propio `setInterval` (igual criterio que `.zona-arrastre`: la
 * piel y la interaccion visual son del paquete, la decision de
 * negocio de cada pantalla).
 */
import { primeraVez } from "./una-vez.js";

interface ControlCarousel {
  ir: (indice: number) => void;
  siguiente: () => void;
  anterior: () => void;
}

const controles = new WeakMap<HTMLElement, ControlCarousel>();

export function iniciarCarruseles(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(".carousel").forEach((carousel) => {
    if (!primeraVez(carousel, "carousel")) return;
    const pista = carousel.querySelector<HTMLElement>(".carousel-pista");
    const slides = Array.from(carousel.querySelectorAll<HTMLElement>(".carousel-slide"));
    if (!pista || slides.length === 0) return;

    let indice = 0;
    const contenedorIndicadores = carousel.querySelector<HTMLElement>(".carousel-indicadores");
    let indicadores: HTMLElement[] = [];

    if (contenedorIndicadores) {
      if (contenedorIndicadores.children.length === 0) {
        indicadores = slides.map((_, i) => {
          const boton = document.createElement("button");
          boton.type = "button";
          boton.setAttribute("aria-label", `Ir a la diapositiva ${i + 1}`);
          contenedorIndicadores.appendChild(boton);
          return boton;
        });
      } else {
        indicadores = Array.from(contenedorIndicadores.children) as HTMLElement[];
      }
      indicadores.forEach((boton, i) => boton.addEventListener("click", () => ir(i)));
    }

    function render(): void {
      pista!.style.transform = `translateX(-${indice * 100}%)`;
      indicadores.forEach((boton, i) => boton.classList.toggle("activo", i === indice));
    }

    function ir(destino: number): void {
      indice = (destino + slides.length) % slides.length;
      render();
    }

    const anterior = () => ir(indice - 1);
    const siguiente = () => ir(indice + 1);

    carousel.querySelector(".carousel-anterior")?.addEventListener("click", anterior);
    carousel.querySelector(".carousel-siguiente")?.addEventListener("click", siguiente);
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") anterior();
      else if (e.key === "ArrowRight") siguiente();
    });

    if (!carousel.hasAttribute("tabindex")) carousel.setAttribute("tabindex", "0");
    render();
    controles.set(carousel, { ir, siguiente, anterior });
  });
}

/** Avanza (o retrocede) un carousel ya iniciado -- para autoplay manual. */
export function avanzarCarrusel(carousel: HTMLElement, direccion: 1 | -1 = 1): void {
  const control = controles.get(carousel);
  if (!control) return;
  if (direccion === 1) control.siguiente();
  else control.anterior();
}
