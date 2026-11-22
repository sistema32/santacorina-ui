// Autochequeo de las funciones puras del paquete -- sin framework, el
// minimo que falla si la logica se rompe (ver ponytail: logica no
// trivial necesita un check). Corre contra el build ya compilado.
import assert from "node:assert/strict";
import { formato, debounce } from "../dist/js.cjs";

// Valores reales de sgp/CLAUDE.md, seccion "Finanzas: el presupuesto".
assert.equal(formato.conSigno(-6014510), "-$6.014.510");
assert.equal(formato.pct(1.098), "109,8%");
assert.equal(formato.pesos(1422169), "1.422.169");
assert.equal(formato.conSigno(718704), "$718.704");
assert.equal(formato.fechaCorta(new Date(2026, 9, 14)), "14-10-2026");

await new Promise((listo) => {
  let llamadas = 0;
  const avisar = debounce(() => llamadas++, 20);
  avisar();
  avisar();
  avisar();
  setTimeout(() => {
    assert.equal(llamadas, 1, "debounce debe agrupar llamadas seguidas en una sola");
    listo();
  }, 60);
});

console.log("autocheck: OK");
