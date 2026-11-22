/**
 * Select con autocompletado sobre un `<select>` oculto -- sigue
 * funcionando con un form normal si el JS falla. Filtra por texto (sin
 * distinguir tildes), flechas arriba/abajo + Enter para elegir, clic en
 * una opcion tambien. Sigue el patron ARIA 1.2 de combobox: el input
 * `role="combobox"` + `aria-expanded`/`aria-controls`/
 * `aria-activedescendant`; la lista `role="listbox"`; cada opcion
 * `role="option"` + `aria-selected`.
 *
 * Busqueda remota (`iniciarComboboxRemoto`, 0.26.0): el paquete aporta
 * el debounce, descarta respuestas que ya no corresponden a lo ultimo
 * escrito, y arma la lista -- la funcion de busqueda real (el `fetch`)
 * la da el consumidor, mismo criterio de siempre (piel, no logica de
 * negocio).
 */
import { idDe } from "./foco.js";
import { posicionarFlotante } from "./flotante.js";
import { activar, apilarCapa, desactivar, primeraVez, registrarDestructor } from "./una-vez.js";

type Opcion = { valor: string; texto: string };

const instancias = new WeakMap<HTMLElement, { reconciliar: () => void; cerrar: () => void }>();
const buscadoresRemotos = new WeakMap<HTMLElement, (texto: string) => Promise<Opcion[]>>();

/**
 * Activa busqueda remota en `caja` (un `.combobox` ya presente en el
 * DOM): `buscar(texto)` la implementa el consumidor -- el paquete
 * debounca 250ms y descarta respuestas viejas (si la busqueda de "mar"
 * tarda mas que la de "maria", su respuesta llega despues y no debe
 * pisar la lista ya actualizada). Puede llamarse antes o despues de
 * `iniciarCombobox`/`iniciarTodo`.
 */
export function iniciarComboboxRemoto(caja: HTMLElement, buscar: (texto: string) => Promise<Opcion[]>): void {
  buscadoresRemotos.set(caja, buscar);
}

export function iniciarCombobox(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(".combobox").forEach((caja) => {
    if (!primeraVez(caja, "combobox")) {
      const instancia = instancias.get(caja);
      if (instancia) activarListenersGlobales(caja, instancia, raiz);
      return;
    }
    const input = caja.querySelector<HTMLInputElement>("input[type=text]");
    const select = caja.querySelector<HTMLSelectElement>("select");
    const lista = caja.querySelector<HTMLUListElement>(".combobox-opciones");
    if (!input || !select || !lista) return;

    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-controls", idDe(lista, "combobox-lista"));
    input.setAttribute("aria-autocomplete", "list");
    lista.setAttribute("role", "listbox");

    const opcionesLocales = Array.from(select.options)
      .filter((o) => o.value)
      .map((o) => ({ valor: o.value, texto: o.textContent ?? "" }));
    let opcionesActuales: Opcion[] = opcionesLocales;
    let resaltada = -1;

    const seleccionar = (item: Opcion) => {
      let opcion = Array.from(select.options).find((o) => o.value === item.valor);
      if (!opcion) {
        opcion = document.createElement("option");
        opcion.value = item.valor;
        opcion.textContent = item.texto;
        select.appendChild(opcion);
      }
      select.value = opcion.value;
      input.value = item.texto;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      caja.dispatchEvent(
        new CustomEvent("santacorina:combobox-seleccionar", { bubbles: true, detail: { valor: item.valor, texto: item.texto } }),
      );
      cerrar();
    };

    const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

    const pintarOpciones = (items: Opcion[]) => {
      opcionesActuales = items;
      lista.innerHTML = "";
      resaltada = -1;
      if (items.length === 0) {
        const li = document.createElement("li");
        li.className = "sin-resultados";
        li.textContent = "Sin resultados";
        lista.appendChild(li);
        return;
      }
      items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.texto;
        li.id = `${lista.id}-op-${item.valor}`;
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", item.valor === select.value ? "true" : "false");
        li.addEventListener("click", () => seleccionar(item));
        li.dataset.valor = item.valor;
        lista.appendChild(li);
      });
    };

    let temporizadorBusqueda: ReturnType<typeof setTimeout> | undefined;
    let tokenBusqueda = 0;

    const redibujar = (filtro: string) => {
      const buscar = buscadoresRemotos.get(caja);
      if (!buscar) {
        const texto = normalizar(filtro.trim());
        pintarOpciones(opcionesLocales.filter((o) => normalizar(o.texto).includes(texto)));
        return;
      }
      clearTimeout(temporizadorBusqueda);
      const miToken = ++tokenBusqueda;
      lista.innerHTML = "";
      const cargando = document.createElement("li");
      cargando.className = "sin-resultados";
      cargando.textContent = "Buscando…";
      lista.appendChild(cargando);
      temporizadorBusqueda = setTimeout(() => {
        buscar(filtro.trim()).then((resultados) => {
          if (miToken !== tokenBusqueda) return; // respuesta vieja, ya no corresponde a lo ultimo escrito
          pintarOpciones(resultados);
        });
      }, 250);
    };

    let desapilar: (() => void) | null = null;
    const abrir = () => {
      const yaVisible = lista.classList.contains("visible");
      redibujar(input.value);
      if (yaVisible) return;
      lista.classList.add("visible");
      posicionarFlotante(input, lista);
      input.setAttribute("aria-expanded", "true");
      desapilar = apilarCapa(cerrar);
    };
    const cerrar = () => {
      if (!lista.classList.contains("visible")) return;
      lista.classList.remove("visible");
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      desapilar?.();
      desapilar = null;
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
     * en un submit normal no es el que se ve en pantalla. Se reconcilia
     * de una de dos formas: si lo escrito coincide exactamente (sin
     * tildes) con una opcion CONOCIDA, se elige esa; si no, el input
     * vuelve al texto de la opcion que sigue seleccionada en el
     * `<select>` real (o se vacia si no habia ninguna) -- nunca queda un
     * texto en pantalla que no corresponda al value que se envia. En
     * modo remoto, "opcion conocida" son los resultados de la ultima
     * busqueda (no existe un listado completo contra el cual comparar).
     *
     * Se llama al perder el foco (`blur`) Y ANTES de cada `submit` del
     * form que contiene la caja: si el usuario nunca sale del campo (ej.
     * un boton dispara `form.requestSubmit()` sin mover el foco), `blur`
     * no llega a dispararse y el valor viejo se habria enviado igual.
     */
    const reconciliar = () => {
      const texto = normalizar(input.value.trim());
      const coincide = opcionesActuales.find((o) => normalizar(o.texto) === texto);
      if (coincide) {
        seleccionar(coincide);
        return;
      }
      const actual = Array.from(select.options).find((o) => o.value === select.value);
      input.value = actual?.textContent ?? "";
    };
    input.addEventListener("blur", reconciliar);

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
        if (resaltada >= 0 && opcionesActuales.length) {
          e.preventDefault();
          const elegida = opcionesActuales.find((o) => o.valor === items[resaltada]?.dataset.valor);
          if (elegida) seleccionar(elegida);
        }
      }
    });
    if (select.value) {
      const actual = opcionesLocales.find((o) => o.valor === select.value);
      if (actual) input.value = actual.texto;
    }

    const instancia = { reconciliar, cerrar };
    instancias.set(caja, instancia);
    activarListenersGlobales(caja, instancia, raiz);
  });
}

// Separado del bloque de arriba (que corre una sola vez por elemento):
// `destruirTodo(raiz)` puede apagar estos listeners sin que `raiz` se
// reemplace, y una llamada posterior a `iniciarTodo(raiz)` sobre el
// MISMO nodo debe poder reactivarlos.
function activarListenersGlobales(
  caja: HTMLElement,
  instancia: { reconciliar: () => void; cerrar: () => void },
  raiz: ParentNode,
): void {
  if (!activar(caja, "combobox-doc")) return;
  const alClicAfuera = (e: Event) => {
    if (!caja.contains(e.target as Node)) instancia.cerrar();
  };
  const alEnviar = (e: Event) => {
    const form = e.target;
    if (form instanceof HTMLFormElement && form.contains(caja)) instancia.reconciliar();
  };
  document.addEventListener("click", alClicAfuera);
  document.addEventListener("submit", alEnviar, true);
  registrarDestructor(raiz, () => {
    document.removeEventListener("click", alClicAfuera);
    document.removeEventListener("submit", alEnviar, true);
    desactivar(caja, "combobox-doc");
  });
}
