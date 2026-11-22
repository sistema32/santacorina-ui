/**
 * Encabezado de tabla ordenable -- de Carbon Design System (tabla de
 * datos). Solo la piel y el estado: al hacer clic alterna
 * `aria-sort` entre "ascending"/"descending"/ninguno y dispara un
 * evento para que el consumidor reordene sus propias filas, mismo
 * criterio que `.buscador`/`.combobox`/`.zona-arrastre` (visual si,
 * logica de negocio no).
 */
export function iniciarTablasOrdenables(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLTableCellElement>("th[data-ordenable]").forEach((th) => {
    th.setAttribute("role", "columnheader");
    th.setAttribute("tabindex", "0");
    if (!th.hasAttribute("aria-sort")) th.setAttribute("aria-sort", "none");

    const alternar = () => {
      const tabla = th.closest("table");
      tabla?.querySelectorAll("th[data-ordenable]").forEach((otro) => {
        if (otro !== th) otro.setAttribute("aria-sort", "none");
      });

      const actual = th.getAttribute("aria-sort");
      const siguiente = actual === "ascending" ? "descending" : "ascending";
      th.setAttribute("aria-sort", siguiente);

      th.dispatchEvent(
        new CustomEvent("santacorina:ordenar", {
          bubbles: true,
          detail: { columna: th.dataset.ordenable || th.textContent?.trim(), direccion: siguiente },
        })
      );
    };

    th.addEventListener("click", alternar);
    th.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        alternar();
      }
    });
  });
}
