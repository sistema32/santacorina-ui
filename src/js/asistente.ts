/**
 * Asistente de varios pasos (wizard): mueve `.visible` en `[data-paso]`
 * y `.activo`/`.completado` en `[data-chip]` dentro del contenedor.
 * Avanzar sigue siendo decision de cada pantalla -- cada una valida
 * *antes* de llamar `irAPaso` (ej. una validacion async antes de pasar
 * al paso 2), el paquete no auto-avanza un boton "Continuar".
 */
export function irAPaso(asistente: HTMLElement, n: number): void {
  asistente.querySelectorAll<HTMLElement>("[data-paso]").forEach((panel) => {
    panel.classList.toggle("visible", panel.dataset.paso === String(n));
  });
  asistente.querySelectorAll<HTMLElement>("[data-chip]").forEach((chip) => {
    const num = Number(chip.dataset.chip);
    chip.classList.toggle("activo", num === n);
    chip.classList.toggle("completado", num < n);
  });
}

/**
 * Conecta el clic en un chip ya completado o activo para volver a ese
 * paso -- no deja saltar a uno todavia no alcanzado.
 */
import { primeraVez } from "./una-vez.js";

export function iniciarAsistentes(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>("[data-asistente]").forEach((asistente) => {
    if (!primeraVez(asistente, "asistente")) return;
    asistente.addEventListener("click", (e) => {
      const chip = (e.target as Element).closest<HTMLElement>("[data-chip]");
      if (!chip || !asistente.contains(chip)) return;
      if (!chip.classList.contains("completado") && !chip.classList.contains("activo")) return;
      irAPaso(asistente, Number(chip.dataset.chip));
    });
  });
}
