/**
 * Posicionamiento compartido para capas flotantes (popover, toggletip,
 * calendario, combobox, menu): hoy todas abren siempre hacia abajo,
 * ancladas a un lado fijo -- un menu en la ultima fila de una tabla
 * larga se abre fuera de la pantalla si no hay espacio debajo. La
 * JS solo MIDE y marca `data-posicion="arriba"`; los valores reales
 * de `top`/`bottom` los define el CSS (mismo criterio que
 * `aria-sort`/`data-tono` en el resto del paquete -- nunca estilos
 * inline desde JS).
 *
 * Alcance: solo colision vertical (arriba/abajo). Colision horizontal
 * (desborda los costados) queda fuera -- no hay un caso concreto que
 * lo pida.
 */
export function posicionarFlotante(ancla: HTMLElement, panel: HTMLElement): void {
  const rect = ancla.getBoundingClientRect();
  const alturaPanel = panel.offsetHeight || panel.scrollHeight;
  const espacioAbajo = window.innerHeight - rect.bottom;
  const espacioArriba = rect.top;

  if (espacioAbajo < alturaPanel && espacioArriba > espacioAbajo) {
    panel.dataset.posicion = "arriba";
  } else {
    delete panel.dataset.posicion;
  }
}
