/**
 * Cola de adjuntos con progreso: cada archivo soltado/elegido se
 * agrega como una `.adjunto-fila` con barra de progreso, y se sube
 * llamando `subirArchivo(file, onProgreso, señal)` -- el XHR/fetch
 * real lo implementa el consumidor (igual criterio que
 * `.zona-arrastre`/`iniciarZonasArrastre`: el paquete arma la fila y
 * el estado visual, nunca hace la subida). `señal` es un
 * `AbortSignal` real: "Cancelar" lo aborta si el consumidor lo usa en
 * su propio `fetch`.
 */
import { primeraVez } from "./una-vez.js";

type SubirArchivo = (file: File, onProgreso: (pct: number) => void, señal: AbortSignal) => Promise<void>;

function crearFila(nombre: string): { fila: HTMLElement; barra: HTMLElement; accion: HTMLButtonElement } {
  const fila = document.createElement("div");
  fila.className = "adjunto-fila";
  fila.innerHTML = `
    <span class="adjunto-nombre"></span>
    <span class="adjunto-progreso"><span style="width:0%"></span></span>
    <button type="button" class="adjunto-accion">Cancelar</button>
  `;
  fila.querySelector(".adjunto-nombre")!.textContent = nombre;
  return {
    fila,
    barra: fila.querySelector<HTMLElement>(".adjunto-progreso > span")!,
    accion: fila.querySelector<HTMLButtonElement>(".adjunto-accion")!,
  };
}

function subir(file: File, lista: HTMLElement, subirArchivo: SubirArchivo): void {
  const { fila, barra, accion } = crearFila(file.name);
  lista.appendChild(fila);

  const intentar = () => {
    fila.removeAttribute("data-estado");
    barra.style.width = "0%";
    accion.textContent = "Cancelar";
    const controlador = new AbortController();
    accion.onclick = () => controlador.abort();

    subirArchivo(file, (pct) => (barra.style.width = `${Math.min(100, Math.max(0, pct))}%`), controlador.signal)
      .then(() => {
        fila.dataset.estado = "listo";
        barra.style.width = "100%";
        accion.textContent = "Quitar";
        accion.onclick = () => fila.remove();
      })
      .catch(() => {
        fila.dataset.estado = "error";
        accion.textContent = "Reintentar";
        accion.onclick = () => intentar();
      });
  };
  intentar();
}

/** `zona` es el contenedor con `.zona-arrastre` (drop) + `input[type=file]` + un `[data-adjuntos-lista]` donde van las filas. */
export function iniciarColaAdjuntos(zona: HTMLElement, subirArchivo: SubirArchivo): void {
  if (!primeraVez(zona, "cola-adjuntos")) return;
  const dropzone = zona.querySelector<HTMLElement>(".zona-arrastre");
  const input = zona.querySelector<HTMLInputElement>("input[type=file]");
  const lista = zona.querySelector<HTMLElement>("[data-adjuntos-lista]");
  if (!lista) return;

  const encolar = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => subir(file, lista, subirArchivo));
  };

  input?.addEventListener("change", () => {
    encolar(input.files);
    input.value = "";
  });
  dropzone?.addEventListener("drop", (e) => {
    e.preventDefault();
    encolar(e.dataTransfer?.files ?? null);
  });
}
