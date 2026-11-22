/**
 * Atrapa el foco de teclado dentro de un contenedor (modal, cajon): Tab
 * no se escapa, y al liberar el foco vuelve a quien lo tenia antes de
 * abrir. Compartido por modal.ts y cajon.ts para no duplicar esta logica.
 */
const SELECTOR_ENFOCABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function atraparFoco(contenedor: HTMLElement): () => void {
  const previo = document.activeElement as HTMLElement | null;

  const enfocables = () => Array.from(contenedor.querySelectorAll<HTMLElement>(SELECTOR_ENFOCABLE));
  const primero = enfocables()[0];
  if (!primero && !contenedor.hasAttribute("tabindex")) contenedor.setAttribute("tabindex", "-1");
  (primero ?? contenedor).focus();

  const manejarTab = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const items = enfocables();
    if (items.length === 0) return;
    const [inicio, fin] = [items[0], items[items.length - 1]];
    if (e.shiftKey && document.activeElement === inicio) {
      e.preventDefault();
      fin.focus();
    } else if (!e.shiftKey && document.activeElement === fin) {
      e.preventDefault();
      inicio.focus();
    }
  };
  contenedor.addEventListener("keydown", manejarTab);

  return () => {
    contenedor.removeEventListener("keydown", manejarTab);
    previo?.focus();
  };
}

let contadorId = 0;
/** Devuelve el `id` de `el`, generando uno nuevo si no tiene. */
export function idDe(el: HTMLElement, prefijo: string): string {
  if (!el.id) el.id = `${prefijo}-${++contadorId}`;
  return el.id;
}
