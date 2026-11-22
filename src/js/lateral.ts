/**
 * Conecta `.lateral-toggle` con `.lateral`/`.lateral-fondo` -- el README
 * de 0.5.0 decia que el consumidor debia agregar "un click handler de
 * unas lineas"; con esto ya no hace falta escribir nada.
 */
import { primeraVez } from "./una-vez.js";

export function iniciarLateral(raiz: ParentNode = document): void {
  const toggle = raiz.querySelector<HTMLElement>(".lateral-toggle");
  const lateral = raiz.querySelector<HTMLElement>(".lateral");
  const fondo = raiz.querySelector<HTMLElement>(".lateral-fondo");
  if (!toggle || !lateral) return;
  if (!primeraVez(toggle, "lateral")) return;

  const cerrar = () => {
    lateral.classList.remove("abierta");
    fondo?.classList.remove("visible");
  };
  const alternar = () => {
    lateral.classList.toggle("abierta");
    fondo?.classList.toggle("visible");
  };

  toggle.addEventListener("click", alternar);
  fondo?.addEventListener("click", cerrar);
}
