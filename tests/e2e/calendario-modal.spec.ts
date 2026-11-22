import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = "file://" + path.resolve(__dirname, "fixtures/calendario-modal.html");

test("calendario dentro de un modal, operado solo con teclado: Escape cierra el calendario antes que el modal", async ({ page }) => {
  await page.goto(url);
  await page.click("#abrir-modal");
  await expect(page.locator("#modal1")).toHaveClass(/visible/);

  // Tab atrapado en el modal (foco de teclado, ver foco.ts).
  await page.click("#fecha");
  const panel = page.locator("#modal1 .calendario-panel");
  await expect(panel).toHaveClass(/visible/);

  const diaInicial = await page.evaluate(() => document.activeElement?.textContent);
  await page.keyboard.press("ArrowRight");
  const diaSiguiente = await page.evaluate(() => document.activeElement?.textContent);
  expect(diaSiguiente).not.toBe(diaInicial);

  await page.keyboard.press("Escape");
  await expect(panel).not.toHaveClass(/visible/);
  await expect(page.locator("#modal1")).toHaveClass(/visible/);

  await page.keyboard.press("Escape");
  await expect(page.locator("#modal1")).not.toHaveClass(/visible/);
});
