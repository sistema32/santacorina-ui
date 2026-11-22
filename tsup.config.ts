import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.cts", "src/theme.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: false,
    outExtension({ format }) {
      return { js: format === "cjs" ? ".cjs" : ".mjs" };
    },
  },
  {
    // Sin auto-arranque -- para quien consume con bundler (Vite/Vue):
    // importar esto no ejecuta nada por su cuenta (ver `auto.ts`).
    entry: { js: "src/js/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    clean: false,
    outExtension({ format }) {
      return { js: format === "cjs" ? ".cjs" : ".mjs" };
    },
  },
  {
    // Con auto-arranque -- para `<script src>` sin bundler (Jinja).
    // Mismo nombre de archivo final (`dist/js.global.js`) que antes de
    // separar las dos entradas.
    entry: { js: "src/js/auto.ts" },
    format: ["iife"],
    globalName: "Santacorina",
    dts: false,
    clean: false,
    outExtension() {
      return { js: ".global.js" };
    },
  },
]);
