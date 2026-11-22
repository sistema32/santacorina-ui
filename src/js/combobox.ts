/**
 * Select con autocompletado sobre un `<select>` oculto -- sigue
 * funcionando con un form normal si el JS falla. Filtra por texto,
 * flechas arriba/abajo + Enter para elegir, clic en una opcion tambien.
 */
export function iniciarCombobox(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>(".combobox").forEach((caja) => {
    const input = caja.querySelector<HTMLInputElement>("input[type=text]");
    const select = caja.querySelector<HTMLSelectElement>("select");
    const lista = caja.querySelector<HTMLUListElement>(".combobox-opciones");
    if (!input || !select || !lista) return;

    const opciones = Array.from(select.options).filter((o) => o.value);
    let resaltada = -1;

    const seleccionar = (opcion: HTMLOptionElement) => {
      select.value = opcion.value;
      input.value = opcion.textContent ?? "";
      select.dispatchEvent(new Event("change", { bubbles: true }));
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
        li.addEventListener("click", () => seleccionar(opcion));
        li.dataset.valor = opcion.value;
        lista.appendChild(li);
      });
    };

    const abrir = () => {
      redibujar(input.value);
      lista.classList.add("visible");
    };
    const cerrar = () => lista.classList.remove("visible");

    const marcarResaltada = (indice: number) => {
      const items = Array.from(lista.querySelectorAll<HTMLElement>("li:not(.sin-resultados)"));
      items.forEach((el) => el.classList.remove("resaltada"));
      if (items[indice]) {
        items[indice].classList.add("resaltada");
        items[indice].scrollIntoView({ block: "nearest" });
      }
    };

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
    document.addEventListener("click", (e) => {
      if (!caja.contains(e.target as Node)) cerrar();
    });

    if (select.value) {
      const actual = opciones.find((o) => o.value === select.value);
      if (actual) input.value = actual.textContent ?? "";
    }
  });
}
