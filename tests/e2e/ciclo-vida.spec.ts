import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = "file://" + path.resolve(__dirname, "fixtures/ciclo-vida.html");

test("montar, destruirTodo(), desmontar y remontar un nodo equivalente dispara un solo evento por cambio real", async ({ page }) => {
  await page.goto(url);
  // El fixture reinicia el contador a 0 cada vez que (re)conecta su
  // propio listener de prueba, ANTES de que `iniciarTodo`/`iniciarSeleccionTabla`
  // emita su "0 seleccionados" inicial -- asi que cada escenario ve
  // exactamente: 1 emision inicial + 1 por la marca real = 2. Si
  // hubiera un listener viejo + uno nuevo acumulados (la fuga que esto
  // prueba), la marca real sumaria 2 en vez de 1 y el total daria 3.
  await page.check("table[data-seleccion] tbody tr:nth-child(1) input");
  let log = JSON.parse(await page.locator("#log").innerText());
  expect(log.eventos).toBe(2);
  expect(log.detalle.ids).toEqual(["1"]);

  await page.click("#btn-remontar");

  await page.check("table[data-seleccion] tbody tr:nth-child(2) input");
  log = JSON.parse(await page.locator("#log").innerText());
  expect(log.eventos).toBe(2);
  // El clon arrastra el estado "marcado" real de la fila 1 -- el
  // remontaje no perdio esa seleccion, y la fila 2 se suma a ella.
  expect(log.detalle.ids).toEqual(["1", "2"]);
});
