/**
 * Filas repetibles (contactos, partidas de una compra, etc.):
 * `[data-grupo-repetible]` con un `<template data-fila-plantilla>`,
 * un contenedor `[data-filas]` y un boton `[data-agregar-fila]`. Cada
 * campo de la plantilla usa `__i__` donde iria el indice (ej.
 * `name="contactos[__i__][nombre]"`) -- se reemplaza por el numero de
 * fila real al clonar. Las filas resultantes son `.campo`/inputs
 * normales: `iniciarFormularios` las valida sin cambios, el paquete
 * no sabe nada de la forma real de los datos.
 */
import { primeraVez } from "./una-vez.js";

function reindexar(fila: HTMLElement, indice: number): void {
  fila.querySelectorAll<HTMLElement>("[name], [id], [for]").forEach((el) => {
    (["name", "id", "for"] as const).forEach((attr) => {
      const valor = el.getAttribute(attr);
      if (valor?.includes("__i__")) el.setAttribute(attr, valor.replace(/__i__/g, String(indice)));
    });
  });
}

export function iniciarGruposRepetibles(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>("[data-grupo-repetible]").forEach((grupo) => {
    if (!primeraVez(grupo, "grupo-repetible")) return;
    const plantilla = grupo.querySelector<HTMLTemplateElement>("template[data-fila-plantilla]");
    const contenedor = grupo.querySelector<HTMLElement>("[data-filas]");
    const botonAgregar = grupo.querySelector<HTMLElement>("[data-agregar-fila]");
    if (!plantilla || !contenedor || !botonAgregar) return;

    let contador = contenedor.children.length;

    const conectarQuitar = (fila: Element) => {
      fila.querySelector<HTMLElement>("[data-quitar-fila]")?.addEventListener("click", () => fila.remove());
    };

    Array.from(contenedor.children).forEach(conectarQuitar);

    botonAgregar.addEventListener("click", () => {
      const origen = plantilla.content.firstElementChild;
      if (!origen) return;
      const fila = origen.cloneNode(true) as HTMLElement;
      reindexar(fila, contador++);
      contenedor.appendChild(fila);
      conectarQuitar(fila);
    });
  });
}
