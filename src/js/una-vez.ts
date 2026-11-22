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

/**
 * Los listeners que un modulo pone sobre un elemento DENTRO de `raiz`
 * (buscador, contador, lateral, tabla-ordenable, etc.) se liberan solos
 * cuando una SPA descarta ese subarbol del DOM -- recoleccion de basura
 * normal, no hace falta nada. El problema real son los listeners que
 * algunos modulos agregan a `document` (Escape, clic-afuera: modal,
 * cajon, popover, toggletip, calendario, combobox): `document` nunca se
 * destruye, asi que si `raiz` se desmonta y se vuelve a montar, esos
 * listeners (y la clausura que retiene el elemento viejo) quedan para
 * siempre -- fuga de memoria real. `registrarDestructor` guarda la
 * funcion que los saca; `destruirTodo(raiz)` las corre todas.
 */
const destructores = new WeakMap<ParentNode, Array<() => void>>();

export function registrarDestructor(raiz: ParentNode, fn: () => void): void {
  let lista = destructores.get(raiz);
  if (!lista) {
    lista = [];
    destructores.set(raiz, lista);
  }
  lista.push(fn);
}

/** Libera los listeners globales (document) que `iniciarTodo(raiz)` registro. */
export function destruirTodo(raiz: ParentNode = document): void {
  const lista = destructores.get(raiz);
  if (!lista) return;
  lista.forEach((fn) => fn());
  destructores.delete(raiz);
}

/**
 * Como `primeraVez`, pero reversible -- para el listener de `document`
 * que popover/toggletip/calendario/combobox activan POR INSTANCIA.
 * `primeraVez` marca un elemento para siempre (correcto para no volver
 * a crear el panel ni duplicar los listeners de ELEMENTO), pero eso
 * mismo impedia reactivar el listener de `document` tras un
 * `destruirTodo(raiz)` sobre un `raiz` que NO se reemplaza: al llamar
 * `iniciarTodo(raiz)` de nuevo, `primeraVez` ya estaba marcado y todo
 * el bloque -- incluida la re-registracion del listener de document --
 * se saltaba entero, dejando el popover/calendario abrible pero sin
 * forma de cerrarlo con clic-afuera o Escape (se vio exactamente eso
 * al verificar). `activar`/`desactivar` llevan su propio estado,
 * independiente del de `primeraVez`, para que el destructor pueda
 * "apagarlo" y una llamada posterior a `iniciarTodo()` pueda volver a
 * "encenderlo" sin tocar la parte de la inicializacion que si debe
 * ocurrir una sola vez.
 */
const activos = new WeakMap<Element, Set<string>>();

export function activar(el: Element, nombre: string): boolean {
  let claves = activos.get(el);
  if (!claves) {
    claves = new Set();
    activos.set(el, claves);
  }
  if (claves.has(nombre)) return false;
  claves.add(nombre);
  return true;
}

export function desactivar(el: Element, nombre: string): void {
  activos.get(el)?.delete(nombre);
}
