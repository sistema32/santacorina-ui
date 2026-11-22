/**
 * Alterna `.activo` al hacer clic dentro de `.tabs`. Si el boton tiene
 * `data-tab="x"`, tambien muestra `[data-tab-panel="x"]` y oculta el
 * resto -- retrocompatible: un `.tabs` sin `data-tab` sigue siendo solo
 * un segmented control, como hasta 0.9.0. `.tabs` recibe `role="tablist"`,
 * cada boton `role="tab"` + `aria-selected`, y cada panel `role="tabpanel"`
 * + `aria-hidden` en espejo con `.activo`.
 */
export function iniciarTabs(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(".tabs").forEach((tabs) => {
    if (!tabs.getAttribute("role")) tabs.setAttribute("role", "tablist");
    const botones = tabs.querySelectorAll<HTMLElement>("a, button");
    botones.forEach((boton) => {
      if (!boton.getAttribute("role")) boton.setAttribute("role", "tab");
      boton.setAttribute("aria-selected", boton.classList.contains("activo") ? "true" : "false");
    });

    tabs.addEventListener("click", (e) => {
      const el = (e.target as Element).closest<HTMLElement>("a, button");
      if (!el || !tabs.contains(el)) return;
      botones.forEach((b) => {
        b.classList.remove("activo");
        b.setAttribute("aria-selected", "false");
      });
      el.classList.add("activo");
      el.setAttribute("aria-selected", "true");

      const destino = el.dataset.tab;
      if (!destino) return;
      document.querySelectorAll<HTMLElement>("[data-tab-panel]").forEach((panel) => {
        const activo = panel.dataset.tabPanel === destino;
        panel.classList.toggle("activo", activo);
        if (!panel.getAttribute("role")) panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-hidden", activo ? "false" : "true");
      });
    });
  });
}
