import { defineConfig } from "@playwright/test";

/**
 * Las fixtures cargan `../../dist/ui.css`/`js.global.js` directo via
 * `file://` -- no hace falta servidor (`npm run build` corre antes en
 * CI). Mismo motivo por el que cada fixture tiene su propio
 * `<meta charset="utf-8">`: ver la memoria del bug de Patchright/
 * Chromium con HTML 100% ASCII sin charset -- aplica igual con
 * Playwright puro sobre Chromium.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    trace: "retain-on-failure",
  },
});
