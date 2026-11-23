import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const urlDe = (pagina: string) => "file://" + path.resolve(__dirname, "../../guia", pagina);

test("portada: las 6 tarjetas llevan a su página, sin tokens/iconos mezclados ahí", async ({ page }) => {
  await page.goto(urlDe("index.html"));

  const tarjetas = page.locator(".portada-card");
  await expect(tarjetas).toHaveCount(6);
  await expect(page.locator("#tokens")).toHaveCount(0);
  await expect(page.locator("#icono-grid")).toHaveCount(0);

  await page.click('.portada-card[href="instalacion.html"]');
  await expect(page).toHaveURL(/instalacion\.html$/);
});

test("instalacion.html: muestra los pasos de instalación y el botón copiar funciona", async ({ page }) => {
  await page.goto(urlDe("instalacion.html"));
  await expect(page.locator("#npm")).toBeVisible();
  await expect(page.locator("#con-tailwind")).toBeVisible();
  await expect(page.locator("#sin-node")).toBeVisible();

  const primerCodigo = page.locator("pre.codigo").first();
  await expect(primerCodigo).toContainText("npm install @sistema32/santacorina-ui");
  await primerCodigo.locator(".copiar-boton").click();
  await expect(page.locator(".toast")).toBeVisible();
});

test("fundamentos.html: tokens, tipografia e iconos con grilla de 16 iconos nombrados", async ({ page }) => {
  await page.goto(urlDe("fundamentos.html"));
  await expect(page.locator("#tokens .token")).toHaveCount(6);
  await expect(page.locator("#iconos .icono-card")).toHaveCount(16);
  await expect(page.locator("#iconos .icono-card .nombre").first()).toHaveText("icono-check");
});
