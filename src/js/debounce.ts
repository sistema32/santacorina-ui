/** Retrasa `fn` hasta que pasen `ms` sin una nueva llamada -- para inputs de busqueda. */
export function debounce<A extends unknown[]>(fn: (...args: A) => void, ms = 300): (...args: A) => void {
  let temporizador: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), ms);
  };
}
