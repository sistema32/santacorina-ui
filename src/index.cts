import santacorinaUI from "./plugin.js";

// `export =` (no `export default`): Tailwind v4 carga el plugin de
// `@plugin "pkg"` con un `require()` plano y espera que `module.exports`
// SEA la funcion del plugin, no un objeto `{ default: fn }` -- que es
// justo lo que un `export default` de TS genera en su salida CJS.
// Probado: con `export default` el build falla en tiempo de carga
// ("TypeError: ... is not a function"); con `export =` funciona.
export = santacorinaUI;
