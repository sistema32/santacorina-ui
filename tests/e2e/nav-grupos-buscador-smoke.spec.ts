import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const paginas = ["index.html", "instalacion.html", "fundamentos.html", "layout.html", "formularios.html", "componentes.html", "js-utilidades.html"];

for (const pagina of paginas) {
  test(`${pagina}: nav sin errores de consola, grupos y buscador presentes`, async ({ page }) => {
    const errores: string[] = [];
    page.on("pageerror", (e) => errores.push(e.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errores.push(msg.text());
    });

    const url = "file://" + path.resolve(__dirname, "../../guia", pagina);
    await page.goto(url);

    const grupos = page.locator("#doc-nav button.grupo");
    await expect(grupos.first()).toBeVisible();
    expect(await grupos.count()).toBeGreaterThan(1);

    const buscador = page.locator("#nav-buscar");
    await expect(buscador).toBeVisible();
    await buscador.fill("combobox");
    await expect(page.locator('#doc-nav a[href$="#combobox"]')).toBeVisible();
    await buscador.fill("");

    expect(errores, "no debe haber errores de consola/JS").toEqual([]);
  });
}
