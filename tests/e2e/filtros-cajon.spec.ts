import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = "file://" + path.resolve(__dirname, "fixtures/filtros-cajon.html");

test("barra-filtros se apila dentro de un cajon angosto, no solo por ancho de ventana", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto(url);
  await page.click("#abrir");
  const barra = page.locator("#barra");
  await expect(barra).toHaveCSS("flex-direction", "column");
});
