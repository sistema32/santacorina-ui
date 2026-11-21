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
    entry: { js: "src/js/index.ts" },
    format: ["esm", "cjs", "iife"],
    globalName: "Santacorina",
    dts: true,
    clean: false,
    outExtension({ format }) {
      if (format === "cjs") return { js: ".cjs" };
      if (format === "iife") return { js: ".global.js" };
      return { js: ".mjs" };
    },
  },
]);
