/**
 * Conecta la Constraint Validation API nativa del navegador (no se
 * inventa un motor de reglas propio: `checkValidity()`/
 * `setCustomValidity()` ya resuelven reglas entre campos) a
 * `.campo-error`/`.resumen-errores` (ya existentes desde 0.19-0.20).
 * El envio real (la peticion al servidor) sigue siendo decision de
 * cada pantalla -- este modulo solo decide si el formulario esta
 * valido y, si no, donde mostrarlo.
 */
import { idDe } from "./foco.js";
import { primeraVez, registrarDestructor } from "./una-vez.js";
import { iniciarResumenErrores } from "./resumen-errores.js";

type Campo = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function mensajeDe(campo: Campo): string {
  return campo.dataset.mensajeError || campo.validationMessage;
}

function limpiarCampo(campo: Campo): void {
  campo.removeAttribute("aria-invalid");
  const contenedor = campo.closest<HTMLElement>(".campo") ?? campo.parentElement;
  contenedor?.querySelector(".campo-error")?.remove();
}

function marcarInvalido(campo: Campo): void {
  campo.setAttribute("aria-invalid", "true");
  const contenedor = campo.closest<HTMLElement>(".campo") ?? campo.parentElement;
  let error = contenedor?.querySelector<HTMLElement>(".campo-error");
  if (!error) {
    error = document.createElement("p");
    error.className = "campo-error";
    contenedor?.appendChild(error);
  }
  error.innerHTML = "";
  const icono = document.createElement("span");
  icono.className = "icono icono-advertencia";
  error.append(icono, document.createTextNode(mensajeDe(campo)));
  campo.setAttribute("aria-describedby", idDe(error, "campo-error"));
}

function validarYMostrar(form: HTMLFormElement): boolean {
  const campos = Array.from(form.querySelectorAll<Campo>("input, select, textarea"));
  const invalidos = campos.filter((c) => !c.checkValidity());
  campos.forEach((c) => (c.checkValidity() ? limpiarCampo(c) : marcarInvalido(c)));
  if (invalidos.length === 0) return true;

  form.querySelector(".resumen-errores")?.remove();
  const resumen = document.createElement("div");
  resumen.className = "resumen-errores";
  const titulo = document.createElement("h2");
  titulo.textContent =
    invalidos.length === 1 ? "Hay 1 problema con el formulario" : `Hay ${invalidos.length} problemas con el formulario`;
  const lista = document.createElement("ul");
  invalidos.forEach((campo) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${idDe(campo, "campo")}`;
    link.textContent = mensajeDe(campo);
    li.appendChild(link);
    lista.appendChild(li);
  });
  resumen.append(titulo, lista);
  form.insertBefore(resumen, form.firstChild);
  iniciarResumenErrores(form);
  return false;
}

let escucharActivo = false;

/** Valida nativamente al enviar; arma `.resumen-errores` y `.campo-error` si falla. */
export function iniciarFormularios(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLFormElement>("form[data-validar]").forEach((form) => {
    if (!primeraVez(form, "formulario")) return;
    // Sin esto el navegador bloquea el evento `submit` por su cuenta
    // (y muestra su propio globo de error) antes de que este modulo
    // pueda intervenir -- `checkValidity()` sigue funcionando igual.
    form.noValidate = true;
  });

  if (escucharActivo) return;
  escucharActivo = true;

  const alEscribir = (e: Event) => {
    const campo = e.target as Campo;
    if (!campo.closest?.("form[data-validar]")) return;
    if (campo.checkValidity?.()) limpiarCampo(campo);
  };

  // Captura en `document`, no en cada `<form>`: si se registrara en el
  // propio form, un listener de "submit" que el consumidor agregue
  // directamente sobre ESE form (para hacer su propio fetch) correria
  // en el mismo orden de registro -- y si su script corre antes de que
  // `iniciarTodo()` termine (nada raro, ambos suelen esperar
  // DOMContentLoaded), su envio ganaria la carrera y mandaria datos
  // invalidos. Un listener en fase de captura sobre `document` siempre
  // corre antes que cualquier listener puesto directamente en el form,
  // sin importar el orden de registro -- y `stopImmediatePropagation()`
  // corta el envio del consumidor si el formulario no es valido.
  const alEnviar = (e: Event) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement) || !form.matches("form[data-validar]")) return;
    if (!validarYMostrar(form)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  };

  document.addEventListener("input", alEscribir, true);
  document.addEventListener("submit", alEnviar, true);
  registrarDestructor(raiz, () => {
    document.removeEventListener("input", alEscribir, true);
    document.removeEventListener("submit", alEnviar, true);
    escucharActivo = false;
  });
}

/** Estado "guardando" en un boton -- no cambia su ancho (ver `.boton[data-cargando]`). */
export function ponerCargando(boton: HTMLButtonElement): void {
  boton.dataset.cargando = "";
  boton.setAttribute("aria-busy", "true");
  boton.disabled = true;
}

export function quitarCargando(boton: HTMLButtonElement): void {
  delete boton.dataset.cargando;
  boton.removeAttribute("aria-busy");
  boton.disabled = false;
}
