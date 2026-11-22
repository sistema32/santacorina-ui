/**
 * Heuristica simple (longitud + variedad de caracteres) para una guia
 * visual, no para validar seguridad real -- eso lo sigue haciendo el
 * backend (scrypt, ver sgp/CLAUDE.md).
 */
function puntaje(clave: string): number {
  if (!clave) return 0;
  let p = 0;
  if (clave.length >= 8) p++;
  if (clave.length >= 12) p++;
  if (/[a-z]/.test(clave) && /[A-Z]/.test(clave)) p++;
  if (/\d/.test(clave)) p++;
  if (/[^a-zA-Z0-9]/.test(clave)) p++;
  return Math.min(p, 4);
}

const ETIQUETAS = ["", "Débil", "Regular", "Buena", "Fuerte"];
const NIVELES = ["", "debil", "regular", "buena", "fuerte"];

import { primeraVez } from "./una-vez.js";

export function iniciarMedidorClave(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLInputElement>("input[data-medidor-clave]").forEach((input) => {
    if (!primeraVez(input, "medidor-clave")) return;
    const medidor = document.createElement("div");
    medidor.className = "medidor-clave";
    medidor.innerHTML = '<div class="segmentos"><span></span><span></span><span></span><span></span></div><span class="etiqueta"></span>';
    input.insertAdjacentElement("afterend", medidor);

    const segmentos = medidor.querySelectorAll<HTMLElement>(".segmentos span");
    const etiqueta = medidor.querySelector<HTMLElement>(".etiqueta")!;

    const actualizar = () => {
      const n = puntaje(input.value);
      segmentos.forEach((seg, i) => {
        seg.className = i < n ? `activo ${NIVELES[n]}` : "";
      });
      etiqueta.textContent = input.value ? ETIQUETAS[n] : "";
    };
    input.addEventListener("input", actualizar);
    actualizar();
  });
}
