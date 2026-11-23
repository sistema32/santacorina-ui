/**
 * Barra de navegacion horizontal con submenus desplegables, que colapsa
 * en un boton bajo el breakpoint de 900px (el mismo que ya usa
 * `.lateral`, no uno nuevo).
 *
 * Casi todo lo hace HTML nativo, a proposito:
 *
 * - Abrir/cerrar un submenu es `<details>/<summary>`: ya expone
 *   `aria-expanded` al lector de pantalla y responde a Enter/Espacio sin
 *   una linea de JS. Mismo criterio que `menu.ts`.
 * - Que abrir un submenu cierre el anterior es el atributo `name` de
 *   `<details>` (accordion exclusivo nativo). Donde el navegador no lo
 *   soporte quedan dos abiertos a la vez: feo, no roto.
 *
 * Queda para JS solo lo que el navegador no da: voltear el panel hacia
 * arriba si no hay espacio debajo (`flotante.ts`), cerrar con clic
 * afuera, que Escape cierre SOLO la capa de arriba (`una-vez.ts`, la
 * misma pila que modal/cajon/popover) y el colapso en movil.
 *
 * Sin JS la barra sigue sirviendo: los submenus abren igual (son
 * `<details>`) y en movil la lista se ve entera, estirada hacia abajo,
 * en vez de esconderse detras de un boton que no responderia. Por eso
 * el CSS que la colapsa cuelga de `[data-js]`, que pone este archivo:
 * si el script no corre, no hay nada escondido.
 *
 * Lo que NO hace, y es deliberado: no pone `role="menu"`/`"menuitem"`
 * como `menu.ts`. Eso es para menus de aplicacion (acciones); esto es
 * navegacion, y ahi el patron de ARIA es "disclosure navigation":
 * enlaces normales dentro de una lista, que el lector de pantalla
 * anuncia como enlaces y puede contar. Marcarlos `menuitem` les quita
 * esa semantica a cambio de nada.
 */
import { posicionarFlotante } from "./flotante.js";
import { activar, apilarCapa, desactivar, primeraVez, registrarDestructor } from "./una-vez.js";

export function iniciarBarraNav(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(".barra-nav").forEach((barra) => {
    const lista = barra.querySelector<HTMLElement>(".barra-nav-lista");
    const boton = barra.querySelector<HTMLButtonElement>(".barra-nav-toggle");

    if (lista && boton && primeraVez(barra, "barra-nav-toggle")) {
      // Recien aca se permite que el CSS esconda la lista en movil: si
      // este archivo no corriera, el boton no haria nada y la lista
      // quedaria inalcanzable.
      barra.dataset.js = "";
      boton.setAttribute("aria-expanded", "false");
      boton.addEventListener("click", () => {
        const abierta = lista.classList.toggle("abierta");
        boton.setAttribute("aria-expanded", String(abierta));
      });
      // Navegar cierra el menu: en movil la lista tapa la pantalla y
      // un ancla de la misma pagina no recarga nada.
      lista.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).closest("a")) {
          lista.classList.remove("abierta");
          boton.setAttribute("aria-expanded", "false");
        }
      });
    }

    barra.querySelectorAll<HTMLDetailsElement>("details.barra-nav-grupo").forEach((grupo) => {
      const resumen = grupo.querySelector<HTMLElement>("summary");
      const panel = grupo.querySelector<HTMLElement>(".barra-nav-panel");
      if (!resumen || !panel) return;

      if (primeraVez(grupo, "barra-nav")) {
        let desapilar: (() => void) | null = null;
        grupo.addEventListener("toggle", () => {
          if (grupo.open) {
            // Solo flota en escritorio: bajo el breakpoint el panel es
            // estatico y medir el espacio libre no significa nada.
            if (getComputedStyle(panel).position === "absolute") posicionarFlotante(resumen, panel);
            desapilar = apilarCapa(() => {
              grupo.open = false;
              resumen.focus();
            });
          } else {
            desapilar?.();
            desapilar = null;
          }
        });
      }

      // El listener de `document` va aparte del bloque de arriba: se
      // apaga con `destruirTodo(raiz)` y se vuelve a encender si la
      // pantalla se remonta sobre el mismo nodo (ver `una-vez.ts`).
      if (!activar(grupo, "barra-nav-doc")) return;
      const alClicAfuera = (e: Event) => {
        if (grupo.open && !grupo.contains(e.target as Node)) grupo.open = false;
      };
      document.addEventListener("click", alClicAfuera);
      registrarDestructor(raiz, () => {
        document.removeEventListener("click", alClicAfuera);
        desactivar(grupo, "barra-nav-doc");
      });
    });
  });
}
