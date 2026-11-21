import plugin from "tailwindcss/plugin";
import { defaultTheme, type SantacorinaTheme } from "./theme.js";
import { buildComponents } from "./components.js";

export interface SantacorinaUIOptions {
  /**
   * Sobreescribe uno o mas colores de marca (ej. { azul: "#1d4ed8" }).
   * Solo alcanzable invocando el plugin desde JS/TS directamente -- la
   * sintaxis `@plugin "pkg" { ... }` de Tailwind v4 no pasa opciones a
   * `plugin.withOptions` (probado). Para el caso comun (CSS puro, sin
   * build propio de JS) usa el override por variable CSS, ver mas abajo.
   */
  colors?: Partial<SantacorinaTheme["colors"]>;
}

/**
 * Plugin de Tailwind CSS v4 del Servicio Local de Educacion Publica Santa
 * Corina: tokens de marca + los componentes que Tailwind no trae de
 * fabrica (tarjeta, kpi, etiqueta, boton, pastilla, aviso, campo, tabla,
 * dato, semaforo, linea de tiempo, estado vacio).
 *
 * Uso (Tailwind v4, CSS-first):
 *   @import "tailwindcss";
 *   @plugin "@santacorina/ui";
 *
 * Para cambiar un color de marca, la opcion `colors` del plugin via
 * `withOptions` NO es alcanzable desde la sintaxis `@plugin "pkg" { ... }`
 * de Tailwind v4 (probado: no tiene efecto). El mecanismo verificado es
 * sobreescribir la custom property despues del import, SIN envolverla en
 * un @layer (una regla sin layer le gana a cualquier regla en @layer,
 * sea cual sea el orden en el archivo):
 *   @import "tailwindcss";
 *   @plugin "@santacorina/ui";
 *
 *   :root { --color-azul: #1d4ed8; }
 */
function resolveColors(options: SantacorinaUIOptions): Record<string, string> {
  return { ...defaultTheme.colors, ...options.colors } as Record<string, string>;
}

export default plugin.withOptions<SantacorinaUIOptions>(
  (options = {}) => {
    return ({ addBase }) => {
      const colors = resolveColors(options);
      // Las utilidades que genera `theme.extend.colors` (bg-navy, etc.)
      // inlinean el hex directo -- NO definen `--color-navy` en ningun
      // lado. Los componentes de abajo usan var(--color-navy) para poder
      // responder a `colors` sin repetir el valor, asi que esas custom
      // properties hay que declararlas nosotros mismos, desde la misma
      // fuente (resolveColors) que alimenta theme.extend.
      addBase({
        ":root": Object.fromEntries(
          Object.entries(colors).map(([nombre, valor]) => [`--color-${nombre}`, valor])
        ),
      });

      // addComponents en Tailwind v4 es un alias de addUtilities (exige
      // selectores de una sola clase, sin combinadores ni atributos) -- no
      // sirve para ".tarjeta h3", "input[type=text]" o "tr:last-child td".
      // addBase no tiene esa restriccion: acepta cualquier selector CSS
      // valido, que es justo lo que estos componentes necesitan.
      addBase({
        body: {
          backgroundColor: "var(--color-fondo)",
          color: "var(--color-texto)",
          font: "15px/1.55 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        },
        a: { color: "inherit", textDecoration: "none" },
      });
      addBase(buildComponents());
    };
  },
  (options = {}) => {
    return { theme: { extend: { colors: resolveColors(options) } } };
  }
);
