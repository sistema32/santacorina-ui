/**
 * Alterna `.activo` al hacer clic dentro de `.tabs`. Si el boton tiene
 * `data-tab="x"`, tambien muestra `[data-tab-panel="x"]` y oculta el
 * resto -- retrocompatible: un `.tabs` sin `data-tab` sigue siendo solo
 * un segmented control, como hasta 0.9.0.
 */
export function iniciarTabs(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(".tabs").forEach((tabs) => {
    tabs.addEventListener("click", (e) => {
      const el = (e.target as Element).closest<HTMLElement>("a, button");
      if (!el || !tabs.contains(el)) return;
      tabs.querySelectorAll(".activo").forEach((a) => a.classList.remove("activo"));
      el.classList.add("activo");

      const destino = el.dataset.tab;
      if (!destino) return;
      document.querySelectorAll<HTMLElement>("[data-tab-panel]").forEach((panel) => {
        panel.classList.toggle("activo", panel.dataset.tabPanel === destino);
      });
    });
  });
}
