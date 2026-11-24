import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = "file://" + path.resolve(__dirname, "../../guia/componentes.html");

// El mini grafico es CSS puro: la altura sale de `--v`. Si alguien
// cambia la unidad o la formula, las barras quedan todas iguales y el
// grafico miente sin romperse -- que es la peor forma de romperse.
test("el mini grafico del KPI traduce --v a la altura real de la barra", async ({ page }) => {
  await page.goto(url);
  const grafico = page.locator("#kpi .kpi-grafico").first();
  await grafico.scrollIntoViewIfNeeded();

  const pista = await grafico.locator(".barra").first().boundingBox();
  const barras = grafico.locator(".barra > *");
  await expect(barras).toHaveCount(7);

  const altos: number[] = [];
  for (let i = 0; i < 7; i++) {
    const caja = await barras.nth(i).boundingBox();
    altos.push(Math.round(caja!.height));
  }

  // Valores de la demo: 75, 65, 25, 55, 60, 40, 88 sobre una pista de 60px.
  const esperados = [75, 65, 25, 55, 60, 40, 88].map((v) => Math.round((v / 100) * pista!.height));
  expect(altos).toEqual(esperados);

  // La barra destacada va en el tono pleno y el resto apagado.
  await expect(grafico.locator(".barra.actual > *")).toHaveCSS("opacity", "1");
  await expect(grafico.locator(".barra:not(.actual) > *").first()).not.toHaveCSS("opacity", "1");
});

test("el grafico se anuncia como imagen con su serie en el nombre", async ({ page }) => {
  await page.goto(url);
  const grafico = page.locator("#kpi .kpi-grafico").first();
  await expect(grafico).toHaveAttribute("role", "img");
  await expect(grafico).toHaveAttribute("aria-label", /75.*88/);
});
