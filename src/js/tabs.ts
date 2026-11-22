/**
 * Alterna `.activo` al hacer clic (o con flechas izquierda/derecha,
 * 0.26.0) dentro de `.tabs`. Si el boton tiene `data-tab="x"`, tambien
 * muestra `[data-tab-panel="x"]` y oculta el resto -- retrocompatible:
 * un `.tabs` sin `data-tab` sigue siendo solo un segmented control,
 * como hasta 0.9.0. `.tabs` recibe `role="tablist"`, cada boton
 * `role="tab"` + `aria-selected`, y cada panel `role="tabpanel"` +
 * `aria-hidden` en espejo con `.activo`.
 *
 * Deep-link (0.26.0): `.tabs[data-tab-url]` sincroniza el destino
 * activo con `location.hash` (via `history.replaceState`) y lo lee al
 * cargar -- compartir el link deja la misma pestaña activa.
 */
import { primeraVez } from "./una-vez.js";

export function iniciarTabs(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(".tabs").forEach((tabs) => {
    if (!primeraVez(tabs, "tabs")) return;
    if (!tabs.getAttribute("role")) tabs.setAttribute("role", "tablist");
    const botones = tabs.querySelectorAll<HTMLElement>("a, button");
    // Solo los destinos que declara ESTE grupo -- si se buscara en todo
    // el documento sin filtrar, un segundo `.tabs` en la misma pagina con
    // sus propios paneles perdia `.activo` como efecto secundario de
    // cualquier clic en el primero (se vio al verificar con dos grupos
    // reales en la misma pantalla).
    const destinosDeEsteGrupo = new Set(
      Array.from(botones)
        .map((b) => b.dataset.tab)
        .filter((d): d is string => Boolean(d))
    );
    botones.forEach((boton) => {
      if (!boton.getAttribute("role")) boton.setAttribute("role", "tab");
      boton.setAttribute("aria-selected", boton.classList.contains("activo") ? "true" : "false");
      boton.tabIndex = boton.classList.contains("activo") ? 0 : -1;
    });

    const conUrl = tabs.hasAttribute("data-tab-url");

    const activar = (el: HTMLElement) => {
      botones.forEach((b) => {
        b.classList.remove("activo");
        b.setAttribute("aria-selected", "false");
        b.tabIndex = -1;
      });
      el.classList.add("activo");
      el.setAttribute("aria-selected", "true");
      el.tabIndex = 0;

      const destino = el.dataset.tab;
      if (!destino) return;
      document.querySelectorAll<HTMLElement>("[data-tab-panel]").forEach((panel) => {
        const panelId = panel.dataset.tabPanel;
        if (!panelId || !destinosDeEsteGrupo.has(panelId)) return;
        const activo = panelId === destino;
        panel.classList.toggle("activo", activo);
        if (!panel.getAttribute("role")) panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-hidden", activo ? "false" : "true");
      });
      if (conUrl) history.replaceState(history.state, "", `#${destino}`);
      tabs.dispatchEvent(new CustomEvent("santacorina:tab-cambiar", { bubbles: true, detail: { destino } }));
    };

    tabs.addEventListener("click", (e) => {
      const el = (e.target as Element).closest<HTMLElement>("a, button");
      if (!el || !tabs.contains(el)) return;
      activar(el);
    });

    tabs.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const lista = Array.from(botones);
      const actual = lista.indexOf(document.activeElement as HTMLElement);
      if (actual === -1) return;
      e.preventDefault();
      const siguiente = e.key === "ArrowRight" ? Math.min(actual + 1, lista.length - 1) : Math.max(actual - 1, 0);
      lista[siguiente].focus();
      activar(lista[siguiente]);
    });

    if (conUrl && location.hash) {
      const destino = location.hash.slice(1);
      const boton = Array.from(botones).find((b) => b.dataset.tab === destino);
      if (boton) activar(boton);
    }
  });
}
