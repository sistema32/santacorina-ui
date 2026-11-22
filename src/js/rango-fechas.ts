/**
 * Sincroniza min/max entre dos `input[type=date]` (desde/hasta) dentro de
 * un `[data-rango-fechas]` -- no se puede elegir un "hasta" anterior al
 * "desde". Sobre inputs nativos, cero CSS nuevo.
 */
import { primeraVez } from "./una-vez.js";

export function iniciarRangoFechas(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>("[data-rango-fechas]").forEach((contenedor) => {
    if (!primeraVez(contenedor, "rango-fechas")) return;
    const [desde, hasta] = contenedor.querySelectorAll<HTMLInputElement>("input[type=date]");
    if (!desde || !hasta) return;
    const sincronizar = () => {
      if (desde.value) hasta.min = desde.value;
      else hasta.removeAttribute("min");
      if (hasta.value) desde.max = hasta.value;
      else desde.removeAttribute("max");
    };
    desde.addEventListener("change", sincronizar);
    hasta.addEventListener("change", sincronizar);
    sincronizar();
  });
}
