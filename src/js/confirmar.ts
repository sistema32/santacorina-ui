/**
 * Confirmacion reutilizable sobre `.modal`: arma el modal al vuelo
 * reusando `abrirModal`/`cerrarModal` (foco atrapado, Escape via la
 * pila de capas, backdrop -- todo gratis, ver `modal.ts`/`una-vez.ts`).
 * Resuelve `true`/`false` segun el boton que se clickee, o `false` si
 * se cierra con Escape o clic en el fondo. Foco inicial en Cancelar,
 * salvo que `peligro` sea `false` explicito -- una accion no
 * destructiva no necesita ese resguardo.
 */
import { abrirModal, cerrarModal } from "./modal.js";

export interface OpcionesConfirmar {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  peligro?: boolean;
}

export function confirmar(opciones: OpcionesConfirmar): Promise<boolean> {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-panel">
        <h3></h3>
        <p></p>
        <div class="modal-acciones">
          <button type="button" class="boton secundario" data-accion="cancelar"></button>
          <button type="button" class="boton" data-accion="confirmar"></button>
        </div>
      </div>
    `;
    modal.querySelector("h3")!.textContent = opciones.titulo;
    modal.querySelector("p")!.textContent = opciones.mensaje;
    const btnCancelar = modal.querySelector<HTMLButtonElement>("[data-accion='cancelar']")!;
    const btnConfirmar = modal.querySelector<HTMLButtonElement>("[data-accion='confirmar']")!;
    btnCancelar.textContent = opciones.textoCancelar ?? "Cancelar";
    btnConfirmar.textContent = opciones.textoConfirmar ?? "Confirmar";
    if (opciones.peligro !== false) btnConfirmar.classList.add("peligro");

    let resultado = false;
    btnCancelar.addEventListener("click", () => {
      resultado = false;
      cerrarModal(modal);
    });
    btnConfirmar.addEventListener("click", () => {
      resultado = true;
      cerrarModal(modal);
    });
    modal.addEventListener(
      "santacorina:modal-cerrar",
      () => {
        resolve(resultado);
        modal.remove();
      },
      { once: true },
    );

    document.body.appendChild(modal);
    abrirModal(modal);
    (opciones.peligro === false ? btnConfirmar : btnCancelar).focus();
  });
}
