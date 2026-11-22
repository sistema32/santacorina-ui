/**
 * Actualiza un `.contador-caracteres` junto a un `textarea[data-contador]`
 * con `maxlength`, marcando `.cerca` (90%) y `.lleno` (100%).
 */
import { primeraVez } from "./una-vez.js";

export function iniciarContadores(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLTextAreaElement>("textarea[data-contador]").forEach((textarea) => {
    if (!primeraVez(textarea, "contador")) return;
    const max = textarea.maxLength;
    if (!max || max < 0) return;
    const contador = textarea.parentElement?.querySelector<HTMLElement>(".contador-caracteres");
    if (!contador) return;

    const actualizar = () => {
      const n = textarea.value.length;
      contador.textContent = `${n}/${max}`;
      contador.classList.toggle("cerca", n >= max * 0.9 && n < max);
      contador.classList.toggle("lleno", n >= max);
    };
    textarea.addEventListener("input", actualizar);
    actualizar();
  });
}
