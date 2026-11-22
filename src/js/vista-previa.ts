/**
 * Vista previa de documentos: intercepta el clic en `[data-vista-previa]`
 * (ej. el "Ver" de `.documento-fila`) y abre un `.modal` con la imagen
 * o el PDF (`<iframe>`) en vez de navegar. Solo visor -- no sube ni
 * descarga nada, esa sigue siendo decision de cada pantalla.
 */
import { abrirModal, cerrarModal } from "./modal.js";
import { primeraVez } from "./una-vez.js";

function esImagen(url: string): boolean {
  return /\.(png|jpe?g|gif|webp|svg)(\?|#|$)/i.test(url);
}

export function iniciarVistaPrevia(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLAnchorElement>("[data-vista-previa]").forEach((link) => {
    if (!primeraVez(link, "vista-previa")) return;
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const url = link.href;

      const modal = document.createElement("div");
      modal.className = "modal";
      modal.innerHTML = '<div class="modal-panel vista-previa-panel"></div>';
      const panel = modal.querySelector<HTMLElement>(".modal-panel")!;

      if (esImagen(url)) {
        const img = document.createElement("img");
        img.src = url;
        img.alt = link.textContent ?? "";
        panel.appendChild(img);
      } else {
        const iframe = document.createElement("iframe");
        iframe.src = url;
        panel.appendChild(iframe);
      }
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "cerrar";
      boton.textContent = "Cerrar";
      boton.setAttribute("data-cerrar-modal", "");
      panel.appendChild(boton);

      modal.addEventListener("click", (ev) => {
        if (ev.target === modal || (ev.target as Element).closest("[data-cerrar-modal]")) cerrarModal(modal);
      });
      modal.addEventListener("santacorina:modal-cerrar", () => modal.remove(), { once: true });

      document.body.appendChild(modal);
      abrirModal(modal);
    });
  });
}
