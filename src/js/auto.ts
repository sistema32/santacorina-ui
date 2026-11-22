/**
 * Entrada con auto-arranque -- usada SOLO por el build IIFE
 * (`dist/js.global.js`, para `<script src>` sin bundler, ej. Jinja).
 * La entrada que consume un bundler (Vite/Vue, `dist/js.mjs`/`js.cjs`,
 * `src/js/index.ts`) NO tiene este efecto secundario: cada pantalla
 * llama `iniciarTodo(suContenedor)` a mano cuando le corresponde, y
 * `destruirTodo(suContenedor)` al desmontar -- importar el paquete no
 * debe ejecutar nada por su cuenta.
 */
export * from "./index.js";
import { iniciarTodo } from "./index.js";

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => iniciarTodo());
  } else {
    iniciarTodo();
  }
}
