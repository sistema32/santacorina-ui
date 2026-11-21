/**
 * Muestra/oculta el boton `.limpiar` de `.buscador` segun si el input
 * tiene texto, y lo conecta para vaciarlo (dispara `input` para que
 * cualquier `debounce`/v-model enganchado lo reciba).
 */
export function iniciarBuscadores(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(".buscador").forEach((caja) => {
    const input = caja.querySelector<HTMLInputElement>("input");
    const limpiar = caja.querySelector<HTMLButtonElement>(".limpiar");
    if (!input || !limpiar) return;

    const actualizar = () => limpiar.classList.toggle("visible", input.value.length > 0);
    input.addEventListener("input", actualizar);
    limpiar.addEventListener("click", () => {
      input.value = "";
      input.focus();
      input.dispatchEvent(new Event("input", { bubbles: true }));
      actualizar();
    });
    actualizar();
  });
}
