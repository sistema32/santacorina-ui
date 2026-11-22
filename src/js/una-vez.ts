/**
 * `iniciarTodo()` queda expuesto como funcion publica ademas de
 * auto-ejecutarse al cargar -- nada impide que un consumidor (o un
 * framework con HMR/remontaje) la llame una segunda vez sobre el mismo
 * DOM. Sin guardia, cada `iniciar*` volveria a registrar sus listeners
 * desde cero sobre los mismos elementos: un solo clic dispara el
 * handler N veces (se vio exactamente eso en `iniciarTablasOrdenables`,
 * un clic alternaba ascendente->descendente en la misma pasada). Cada
 * modulo marca "ya inicializado" con su propio nombre por elemento, asi
 * que dos modulos distintos sobre el mismo elemento no se pisan entre si.
 */
const marcas = new WeakMap<Element, Set<string>>();

/** true la primera vez que se llama para este (elemento, nombre); false despues. */
export function primeraVez(el: Element, nombre: string): boolean {
  let claves = marcas.get(el);
  if (!claves) {
    claves = new Set();
    marcas.set(el, claves);
  }
  if (claves.has(nombre)) return false;
  claves.add(nombre);
  return true;
}
