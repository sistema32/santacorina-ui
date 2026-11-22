/**
 * Select con autocompletado sobre un `<select>` oculto -- sigue
 * funcionando con un form normal si el JS falla. Filtra por texto (sin
 * distinguir tildes), flechas arriba/abajo + Enter para elegir, clic en
 * una opcion tambien. Sigue el patron ARIA 1.2 de combobox: el input
 * `role="combobox"` + `aria-expanded`/`aria-controls`/
 * `aria-activedescendant`; la lista `role="listbox"`; cada opcion
 * `role="option"` + `aria-selected`.
 */
import { idDe } from "./foco.js";
import { primeraVez, registrarDestructor } from "./una-vez.js";

export function iniciarCombobox(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(".combobox").forEach((caja) => {
    if (!primeraVez(caja, "combobox")) return;
    const input = caja.querySelector<HTMLInputElement>("input[type=text]");
    const select = caja.querySelector<HTMLSelectElement>("select");
    const lista = caja.querySelector<HTMLUListElement>(".combobox-opciones");
    if (!input || !select || !lista) return;

    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-controls", idDe(lista, "combobox-lista"));
    input.setAttribute("aria-autocomplete", "list");
    lista.setAttribute("role", "listbox");

    const opciones = Array.from(select.options).filter((o) => o.value);
    let resaltada = -1;

    const seleccionar = (opcion: HTMLOptionElement) => {
      select.value = opcion.value;
      input.value = opcion.textContent ?? "";
      select.dispatchEvent(new Event("change", { bubbles: true }));
      caja.dispatchEvent(
        new CustomEvent("santacorina:combobox-seleccionar", {
          bubbles: true,
          detail: { valor: opcion.value, texto: opcion.textContent ?? "" },
        }),
      );
      cerrar();
    };

    const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

    const redibujar = (filtro: string) => {
      lista.innerHTML = "";
      const texto = normalizar(filtro.trim());
      const visibles = opciones.filter((o) => normalizar(o.textContent ?? "").includes(texto));
      resaltada = -1;
      if (visibles.length === 0) {
        const li = document.createElement("li");
        li.className = "sin-resultados";
        li.textContent = "Sin resultados";
        lista.appendChild(li);
        return;
      }
      visibles.forEach((opcion) => {
        const li = document.createElement("li");
        li.textContent = opcion.textContent ?? "";
        li.id = `${lista.id}-op-${opcion.value}`;
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", opcion.value === select.value ? "true" : "false");
        li.addEventListener("click", () => seleccionar(opcion));
        li.dataset.valor = opcion.value;
        lista.appendChild(li);
      });
    };

    const abrir = () => {
      redibujar(input.value);
      lista.classList.add("visible");
      input.setAttribute("aria-expanded", "true");
    };
    const cerrar = () => {
      lista.classList.remove("visible");
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
    };

    const marcarResaltada = (indice: number) => {
      const items = Array.from(lista.querySelectorAll<HTMLElement>("li:not(.sin-resultados)"));
      items.forEach((el) => el.classList.remove("resaltada"));
      if (items[indice]) {
        items[indice].classList.add("resaltada");
        items[indice].scrollIntoView({ block: "nearest" });
        input.setAttribute("aria-activedescendant", items[indice].id);
      } else {
        input.removeAttribute("aria-activedescendant");
      }
    };

    /**
     * Si el usuario escribe texto libre y nunca elige una opcion (clic o
     * Enter), `select.value` se queda en la ultima opcion realmente
     * elegida mientras el input muestra otro texto -- el value que viaja
     * en un submit normal no es el que se ve en pantalla. Al perder el
     * foco sin haber elegido, se resuelve una de dos formas: si lo
     * escrito coincide exactamente (sin tildes) con una opcion, se elige
     * esa; si no, el input vuelve al texto de la opcion que sigue
     * seleccionada en el `<select>` real (o se vacia si no habia
     * ninguna) -- nunca queda un texto en pantalla que no corresponda al
     * value que se envia.
     */
    input.addEventListener("blur", () => {
      const texto = normalizar(input.value.trim());
      const coincide = opciones.find((o) => normalizar(o.textContent ?? "") === texto);
      if (coincide) {
        select.value = coincide.value;
        input.value = coincide.textContent ?? "";
        select.dispatchEvent(new Event("change", { bubbles: true }));
        return;
      }
      const actual = opciones.find((o) => o.value === select.value);
      input.value = actual?.textContent ?? "";
    });

    input.addEventListener("input", () => abrir());
    input.addEventListener("focus", () => abrir());
    input.addEventListener("keydown", (e) => {
      const items = Array.from(lista.querySelectorAll<HTMLElement>("li:not(.sin-resultados)"));
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!lista.classList.contains("visible")) return abrir();
        resaltada = Math.min(resaltada + 1, items.length - 1);
        marcarResaltada(resaltada);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        resaltada = Math.max(resaltada - 1, 0);
        marcarResaltada(resaltada);
      } else if (e.key === "Enter") {
        if (resaltada >= 0 && opciones.length) {
          e.preventDefault();
          const elegida = opciones.find((o) => o.value === items[resaltada]?.dataset.valor);
          if (elegida) seleccionar(elegida);
        }
      } else if (e.key === "Escape") {
        cerrar();
      }
    });
    const alClicAfuera = (e: Event) => {
      if (!caja.contains(e.target as Node)) cerrar();
    };
    document.addEventListener("click", alClicAfuera);
    registrarDestructor(raiz, () => {
      document.removeEventListener("click", alClicAfuera);
    });

    if (select.value) {
      const actual = opciones.find((o) => o.value === select.value);
      if (actual) input.value = actual.textContent ?? "";
    }
  });
}
