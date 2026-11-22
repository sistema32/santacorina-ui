/**
 * Zona de arrastrar-y-soltar: solo alterna `.activa` en
 * dragover/dragleave/drop -- la subida real del archivo (FormData,
 * endpoint) sigue siendo de cada pantalla, igual criterio que
 * `.buscador`/`.combobox`: el paquete resuelve la interaccion visual,
 * no la logica de negocio.
 */
export function iniciarZonasArrastre(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(".zona-arrastre").forEach((zona) => {
    zona.addEventListener("dragover", (e) => {
      e.preventDefault();
      zona.classList.add("activa");
    });
    zona.addEventListener("dragleave", () => zona.classList.remove("activa"));
    zona.addEventListener("drop", (e) => {
      e.preventDefault();
      zona.classList.remove("activa");
    });
  });
}
