/**
 * Reintento en listados: conecta `[data-reintentar]` dentro de
 * `contenedor` para volver a llamar `cargar()` -- el loader real
 * (el fetch de verdad) lo implementa el consumidor. Si `cargar()`
 * rechaza, se muestra de nuevo `.lista-error` dentro de `contenedor`
 * (si existe); si resuelve, se oculta.
 */
import { primeraVez } from "./una-vez.js";

export function iniciarReintento(contenedor: HTMLElement, cargar: () => Promise<void>): void {
  if (!primeraVez(contenedor, "reintento")) return;
  const banner = contenedor.querySelector<HTMLElement>(".lista-error");

  contenedor.addEventListener("click", (e) => {
    if (!(e.target as HTMLElement).closest("[data-reintentar]")) return;
    banner?.setAttribute("hidden", "");
    cargar().catch(() => banner?.removeAttribute("hidden"));
  });
}
