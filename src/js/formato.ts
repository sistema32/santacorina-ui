/**
 * Formato chileno de moneda y porcentaje. Trasladado tal cual desde
 * `peso()`/`conSigno()`/`pct()`, duplicados identicos en
 * FinanzasPresupuestoView.vue y FinanzasMatrizView.vue.
 */
export function pesos(n: number): string {
  return Math.round(n || 0).toLocaleString("es-CL");
}

export function conSigno(n: number): string {
  return n < 0 ? `-$${pesos(-n)}` : `$${pesos(n)}`;
}

export function pct(x: number): string {
  return (x * 100).toFixed(1).replace(".", ",") + "%";
}

export function fechaCorta(fecha: Date): string {
  const dd = String(fecha.getDate()).padStart(2, "0");
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${fecha.getFullYear()}`;
}
