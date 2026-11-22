import { SantacorinaTheme } from './theme.cjs';

interface SantacorinaUIOptions {
    /**
     * Sobreescribe uno o mas colores de marca (ej. { azul: "#1d4ed8" }).
     * Solo alcanzable invocando el plugin desde JS/TS directamente -- la
     * sintaxis `@plugin "pkg" { ... }` de Tailwind v4 no pasa opciones a
     * `plugin.withOptions` (probado). Para el caso comun (CSS puro, sin
     * build propio de JS) usa el override por variable CSS, ver mas abajo.
     */
    colors?: Partial<SantacorinaTheme["colors"]>;
    /**
     * Sobreescribe la tipografia de marca (ej. { sans: "'Inter', sans-serif" }).
     * Misma limitacion que `colors`: solo alcanzable invocando el plugin
     * desde JS/TS. Para CSS puro, sobreescribe `--font-sans` igual que se
     * sobreescribe `--color-azul` (ver README).
     */
    fonts?: Partial<SantacorinaTheme["fonts"]>;
}
/**
 * Forma minima que necesita quien invoca el plugin desde JS/TS
 * directamente (ver `colors`/`fonts` arriba). Sin esta anotacion
 * explicita, el tipo real de `plugin.withOptions(...)` obliga a TS a
 * nombrar un tipo interno y no exportado de `tailwindcss` para generar
 * el `.d.ts` -- confirmado: produce `TS2742 (cannot be named)` al
 * compilar el paquete, y antes de 0.19.0 el `CSSRuleObject` importado
 * de `tailwindcss/types/config` (un path de Tailwind v3 que ya no
 * existe en v4) causaba el mismo problema de otra forma: un
 * `dist/index.d.ts` que importaba un chunk nunca emitido
 * (`resolve-config-*.mjs`), rompiendo `tsc` para cualquier consumidor
 * del paquete instalado con `TS2307`.
 */
type SantacorinaPlugin = (options?: SantacorinaUIOptions) => unknown;
declare const santacorinaUI: SantacorinaPlugin;

export { santacorinaUI as default };
