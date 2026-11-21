import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.cts", "src/theme.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".mjs" };
  },
});
