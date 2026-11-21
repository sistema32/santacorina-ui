/**
 * Alterna `.activo` al hacer clic dentro de `.tabs` -- solo mueve la
 * clase, el filtrado de contenido lo sigue resolviendo cada pantalla.
 */
export function iniciarTabs(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(".tabs").forEach((tabs) => {
    tabs.addEventListener("click", (e) => {
      const el = (e.target as Element).closest<HTMLElement>("a, button");
      if (!el || !tabs.contains(el)) return;
      tabs.querySelectorAll(".activo").forEach((a) => a.classList.remove("activo"));
      el.classList.add("activo");
    });
  });
}
