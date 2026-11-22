/**
 * Campo de monto CLP: formatea con `formato.pesos()` al perder el
 * foco (no en vivo mientras se escribe -- reformatear en cada tecla
 * mueve el cursor al final, el bug clasico de estos campos). El valor
 * numerico real se guarda aparte del texto visible (mismo criterio
 * que `combobox.ts`: el texto en pantalla y el valor que viaja pueden
 * no ser el mismo string) -- `valorClp(input)` distingue "vacio"
 * (`null`) de "0" escrito a proposito.
 */
import { pesos } from "./formato.js";
import { primeraVez } from "./una-vez.js";

const valores = new WeakMap<HTMLInputElement, number | null>();

function parsear(texto: string): number | null {
  const limpio = texto.replace(/[^0-9]/g, "");
  return limpio === "" ? null : Number(limpio);
}

/** Valor numerico real del campo -- `null` si esta vacio, distinto de `0`. */
export function valorClp(input: HTMLInputElement): number | null {
  return valores.get(input) ?? null;
}

export function iniciarCamposClp(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLInputElement>("input[data-campo-clp]").forEach((input) => {
    if (!primeraVez(input, "campo-clp")) return;
    input.inputMode = "numeric";

    const valor = parsear(input.value);
    valores.set(input, valor);
    if (valor !== null) input.value = pesos(valor);

    input.addEventListener("input", () => {
      valores.set(input, parsear(input.value));
    });
    input.addEventListener("blur", () => {
      const actual = valores.get(input) ?? null;
      input.value = actual === null ? "" : pesos(actual);
    });
  });
}
