import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = "file://" + path.resolve(__dirname, "fixtures/barra-nav.html");

test("escritorio: el submenu flota, se cierra con clic afuera y con Escape", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 700 });
  await page.goto(url);

  const compras = page.locator("#grupo-compras");
  const panel = compras.locator(".barra-nav-panel");
  await expect(panel).toBeHidden();
  await expect(page.locator("#toggle")).toBeHidden();

  await compras.locator("summary").click();
  await expect(panel).toBeVisible();
  // Flota sobre el contenido, no lo empuja.
  await expect(panel).toHaveCSS("position", "absolute");

  await page.click("#afuera");
  await expect(panel).toBeHidden();

  await compras.locator("summary").click();
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
});

test("escritorio: abrir un grupo cierra el otro", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 700 });
  await page.goto(url);

  await page.locator("#grupo-compras summary").click();
  await expect(page.locator("#grupo-compras")).toHaveAttribute("open", "");

  await page.locator("#grupo-finanzas summary").click();
  await expect(page.locator("#grupo-finanzas")).toHaveAttribute("open", "");
  await expect(page.locator("#grupo-compras")).not.toHaveAttribute("open", "");
});

test("movil: la lista colapsa tras el boton y el panel deja de flotar", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto(url);

  const boton = page.locator("#toggle");
  const lista = page.locator("#nav-lista");
  await expect(boton).toBeVisible();
  await expect(lista).toBeHidden();
  await expect(boton).toHaveAttribute("aria-expanded", "false");

  await boton.click();
  await expect(lista).toBeVisible();
  await expect(boton).toHaveAttribute("aria-expanded", "true");

  // El objetivo tactil llega a 44px.
  const alto = await page.locator("#nav-lista > li > a").first().boundingBox();
  expect(alto!.height).toBeGreaterThanOrEqual(44);

  await page.locator("#grupo-compras summary").click();
  await expect(page.locator("#grupo-compras .barra-nav-panel")).toHaveCSS("position", "static");

  // Navegar cierra el menu: en movil la lista tapa la pantalla.
  await page.locator("#grupo-compras .barra-nav-panel a").first().click();
  await expect(lista).toBeHidden();
  await expect(boton).toHaveAttribute("aria-expanded", "false");
});

test("sin JS la lista queda visible en movil, no escondida tras un boton muerto", async ({ browser }) => {
  const contexto = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 700 } });
  const page = await contexto.newPage();
  await page.goto(url);

  await expect(page.locator("#nav-lista")).toBeVisible();
  // El <details> nativo sigue abriendo sin una linea de JS.
  await page.locator("#grupo-compras summary").click();
  await expect(page.locator("#grupo-compras .barra-nav-panel")).toBeVisible();
  await contexto.close();
});
