/**
 * Crear y descartar `.toast` -- el CHANGELOG de 0.1.0 ya decia "necesita
 * JS para aparecer/desaparecer" y nadie lo habia escrito todavia.
 */
export type TipoToast = "ok" | "alerta" | "error" | undefined;

function contenedor(): HTMLElement {
  let el = document.querySelector<HTMLElement>(".toast-contenedor");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast-contenedor";
    document.body.appendChild(el);
  }
  return el;
}

export function mostrarToast(mensaje: string, tipo?: TipoToast, duracionMs = 4000): HTMLElement {
  const toast = document.createElement("div");
  toast.className = tipo ? `toast ${tipo}` : "toast";

  const texto = document.createElement("span");
  texto.textContent = mensaje;
  toast.appendChild(texto);

  const cerrar = document.createElement("button");
  cerrar.type = "button";
  cerrar.className = "cerrar";
  cerrar.textContent = "×";
  cerrar.addEventListener("click", () => toast.remove());
  toast.appendChild(cerrar);

  contenedor().appendChild(toast);
  if (duracionMs > 0) setTimeout(() => toast.remove(), duracionMs);
  return toast;
}
