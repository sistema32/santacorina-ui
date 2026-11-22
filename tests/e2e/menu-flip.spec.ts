import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = "file://" + path.resolve(__dirname, "fixtures/menu-flip.html");

test("un menu en la ultima fila de una tabla abre hacia arriba", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 700 });
  await page.goto(url);
  await page.locator("#fila-ultima").scrollIntoViewIfNeeded();
  await page.click("#menu-fila summary");
  const panel = page.locator("#menu-fila .menu-panel");
  await expect(panel).toHaveAttribute("data-posicion", "arriba");
});
