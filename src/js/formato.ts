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

/** Formatea un RUT chileno a "12.345.678-9" -- acepta con o sin puntos/guion. */
export function rut(valor: string): string {
  const limpio = valor.replace(/[^0-9kK]/g, "").toUpperCase();
  if (limpio.length < 2) return limpio;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  const conPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${conPuntos}-${dv}`;
}

/**
 * Valida el digito verificador de un RUT chileno (modulo 11) -- `rut()`
 * arriba SOLO formatea, nunca valido. Funcion pura: la pantalla la
 * conecta a `setCustomValidity()` del campo, mismo criterio que
 * cualquier regla propia del consumidor (el paquete no la aplica
 * automaticamente en ningun lado).
 */
export function rutValido(valor: string): boolean {
  const limpio = valor.replace(/[^0-9kK]/g, "").toUpperCase();
  if (limpio.length < 2) return false;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return dv === dvEsperado;
}

/**
 * Repara mojibake: texto que paso por UTF-8 -> Latin-1 -> UTF-8 sin
 * querer (comun en exportaciones de Excel/correo con tildes rotas, ej.
 * "InformaciÃ³n" en vez de "Información"). Repara cada fragmento roto
 * por separado -- no exige que TODO el string sea Latin-1, asi que un
 * texto mixto como "InformaciÃ³n — prueba" tambien se corrige (el
 * guion largo, que ya es Unicode real, queda intacto). Lo que NO
 * cubre: mojibake que paso por Windows-1252 en vez de Latin-1 (ej.
 * "â€™" en vez de apostrofe) -- ahi los bytes 0x80-0x9F
 * mapean a simbolos distintos (euro, comillas, etc.) y hace falta otra
 * tabla de conversion.
 */
export function limpiarMojibake(texto: string): string {
  return texto.replace(/[ÂÃ][-¿]+/g, (fragmento) => {
    try {
      const bytes = Uint8Array.from(fragmento, (c) => c.charCodeAt(0));
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      return fragmento;
    }
  });
}
