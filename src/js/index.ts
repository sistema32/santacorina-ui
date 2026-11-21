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

import { iniciarModales } from "./modal.js";
import { iniciarLateral } from "./lateral.js";
import { iniciarTabs } from "./tabs.js";
import { iniciarRangoFechas } from "./rango-fechas.js";
import { iniciarCalendario } from "./calendario.js";
import { iniciarBuscadores } from "./buscador.js";
import { iniciarContadores } from "./contador.js";

/** Conecta todo lo auto-iniciable (modal, lateral, tabs, rango de fechas, calendario, buscador, contador). */
export function iniciarTodo(raiz: ParentNode = document): void {
  iniciarModales(raiz);
  iniciarLateral(raiz);
  iniciarTabs(raiz);
  iniciarRangoFechas(raiz);
  iniciarCalendario(raiz);
  iniciarBuscadores(raiz);
  iniciarContadores(raiz);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => iniciarTodo());
  } else {
    iniciarTodo();
  }
}
