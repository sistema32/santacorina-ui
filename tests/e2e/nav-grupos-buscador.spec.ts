import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = "file://" + path.resolve(__dirname, "../../guia/index.html");

test("nav: grupos colapsables con persistencia en localStorage", async ({ page }) => {
  await page.goto(url);
  const primerGrupo = page.locator("#doc-nav button.grupo").first();
  await expect(primerGrupo).toBeVisible();
  await expect(primerGrupo).toHaveAttribute("aria-expanded", "true");

  const contenido = primerGrupo.locator("+ .grupo-contenido");
  await expect(contenido).toBeVisible();

  await primerGrupo.click();
  await expect(primerGrupo).toHaveAttribute("aria-expanded", "false");
  await expect(contenido).toBeHidden();

  await page.reload();
  const primerGrupoDespues = page.locator("#doc-nav button.grupo").first();
  await expect(primerGrupoDespues).toHaveAttribute("aria-expanded", "false");
});

test("nav: buscador filtra links por texto (sin acentos) y muestra 'sin resultados'", async ({ page }) => {
  await page.goto(url);
  const buscador = page.locator("#nav-buscar");
  await buscador.fill("combobox");
  await expect(page.locator('#doc-nav a[href="formularios.html#combobox"]')).toBeVisible();
  await expect(page.locator('#doc-nav a[href^="layout.html"]').first()).toBeHidden();

  await buscador.fill("zzzznoexiste");
  await expect(page.locator("#nav-sin-resultados")).toHaveClass(/visible/);

  await buscador.fill("");
  await expect(page.locator("#nav-sin-resultados")).not.toHaveClass(/visible/);
  await expect(page.locator('#doc-nav a[href^="layout.html"]').first()).toBeVisible();
});
