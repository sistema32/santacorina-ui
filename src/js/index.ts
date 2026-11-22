export * as formato from "./formato.js";
export { debounce } from "./debounce.js";
export { copiarAlPortapapeles } from "./portapapeles.js";
export { abrirModal, cerrarModal, iniciarModales } from "./modal.js";
export { mostrarToast } from "./toast.js";
export { iniciarLateral } from "./lateral.js";
export { iniciarTabs } from "./tabs.js";
export { iniciarRangoFechas } from "./rango-fechas.js";
export { iniciarCalendario } from "./calendario.js";
export { iniciarBuscadores } from "./buscador.js";
export { iniciarContadores } from "./contador.js";
export { iniciarPopovers } from "./popover.js";
export { iniciarColapsables } from "./colapsar.js";
export { iniciarCajones } from "./cajon.js";
export { iniciarCombobox } from "./combobox.js";
export { iniciarMedidorClave } from "./medidor-clave.js";
export { irAPaso, iniciarAsistentes } from "./asistente.js";

import { iniciarModales } from "./modal.js";
import { iniciarLateral } from "./lateral.js";
import { iniciarTabs } from "./tabs.js";
import { iniciarRangoFechas } from "./rango-fechas.js";
import { iniciarCalendario } from "./calendario.js";
import { iniciarBuscadores } from "./buscador.js";
import { iniciarContadores } from "./contador.js";
import { iniciarPopovers } from "./popover.js";
import { iniciarColapsables } from "./colapsar.js";
import { iniciarCajones } from "./cajon.js";
import { iniciarCombobox } from "./combobox.js";
import { iniciarMedidorClave } from "./medidor-clave.js";
import { iniciarAsistentes } from "./asistente.js";

/** Conecta todo lo auto-iniciable. */
export function iniciarTodo(raiz: ParentNode = document): void {
  iniciarModales(raiz);
  iniciarLateral(raiz);
  iniciarTabs(raiz);
  iniciarRangoFechas(raiz);
  iniciarCalendario(raiz);
  iniciarBuscadores(raiz);
  iniciarContadores(raiz);
  iniciarPopovers(raiz);
  iniciarColapsables(raiz);
  iniciarCajones(raiz);
  iniciarCombobox(raiz);
  iniciarMedidorClave(raiz);
  iniciarAsistentes(raiz);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => iniciarTodo());
  } else {
    iniciarTodo();
  }
}
