// Genera dist/ui.css: el plugin ya compilado (dist/index.cjs) contra un
// entry minimo, para quien consume esta libreria sin tener su propio
// build de Tailwind -- el backend Python de sgp, por ejemplo (ver README,
// seccion "Sin Node").
import { writeFileSync, rmSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const entrada = "scripts/.entrada-build.css";
writeFileSync(entrada, '@import "tailwindcss";\n@plugin "../dist/index.cjs";\n');

try {
  execFileSync(
    "npx",
    ["@tailwindcss/cli", "-i", entrada, "-o", "dist/ui.css", "--minify"],
    { stdio: "inherit", shell: true }
  );
  console.log("dist/ui.css generado.");
} finally {
  if (existsSync(entrada)) rmSync(entrada);
}
