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
  /**
   * Sobreescribe la tipografia de marca (ej. { sans: "'Inter', sans-serif" }).
   * Misma limitacion que `colors`: solo alcanzable invocando el plugin
   * desde JS/TS. Para CSS puro, sobreescribe `--font-sans` igual que se
   * sobreescribe `--color-azul` (ver README).
   */
  fonts?: Partial<SantacorinaTheme["fonts"]>;
}

/**
 * Plugin de Tailwind CSS v4 del Servicio Local de Educacion Publica Santa
 * Corina: tokens de marca + los componentes que Tailwind no trae de
 * fabrica (tarjeta, kpi, etiqueta, boton, pastilla, aviso, campo, tabla,
 * dato, semaforo, linea de tiempo, estado vacio).
 *
 * Uso (Tailwind v4, CSS-first):
 *   @import "tailwindcss";
 *   @plugin "@sistema32/santacorina-ui";
 *
 * Para cambiar un color de marca, la opcion `colors` del plugin via
 * `withOptions` NO es alcanzable desde la sintaxis `@plugin "pkg" { ... }`
 * de Tailwind v4 (probado: no tiene efecto). El mecanismo verificado es
 * sobreescribir la custom property despues del import, SIN envolverla en
 * un @layer (una regla sin layer le gana a cualquier regla en @layer,
 * sea cual sea el orden en el archivo):
 *   @import "tailwindcss";
 *   @plugin "@sistema32/santacorina-ui";
 *
 *   :root { --color-azul: #1d4ed8; }
 */
function resolveColors(options: SantacorinaUIOptions): Record<string, string> {
  return { ...defaultTheme.colors, ...options.colors } as Record<string, string>;
}

function resolveFonts(options: SantacorinaUIOptions): SantacorinaTheme["fonts"] {
  return { ...defaultTheme.fonts, ...options.fonts };
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

const santacorinaUI: SantacorinaPlugin = plugin.withOptions<SantacorinaUIOptions>(
  (options = {}) => {
    return ({ addBase }) => {
      const colors = resolveColors(options);
      // Las utilidades que genera `theme.extend.colors` (bg-navy, etc.)
      // inlinean el hex directo -- NO definen `--color-navy` en ningun
      // lado. Los componentes de abajo usan var(--color-navy) para poder
      // responder a `colors` sin repetir el valor, asi que esas custom
      // properties hay que declararlas nosotros mismos, desde la misma
      // fuente (resolveColors) que alimenta theme.extend.
      const fonts = resolveFonts(options);
      addBase({
        ":root": {
          ...Object.fromEntries(
            Object.entries(colors).map(([nombre, valor]) => [`--color-${nombre}`, valor])
          ),
          "--font-sans": fonts.sans,
          // Escala de z-index -- antes de 0.18.0 habia 9 literales
          // (100/200/1000/1150/1200/1300/9000/9500/9999) repartidos sin
          // ninguna relacion documentada entre si. Misma idea que
          // --color-*: una sola fuente de verdad, consumida por los
          // componentes del paquete y por las utilidades .z-* publicas
          // para que el consumidor apile sus propios elementos sin
          // adivinar un numero.
          "--z-fondo": "0",
          "--z-flotante": "100",
          "--z-flotante-alto": "200",
          "--z-lateral": "1000",
          "--z-cajon-fondo": "1150",
          "--z-cajon": "1200",
          "--z-cajon-control": "1300",
          "--z-modal": "9000",
          "--z-toast": "9500",
          "--z-tooltip": "9999",
        },
        /* ---------------------------------------------------------------
         * Modo oscuro -- mismo mecanismo que ya documenta el README para
         * `--color-*`/`--font-sans`: variables CSS, sin logica de JS. Por
         * defecto sigue `prefers-color-scheme`; `data-theme="dark"`/
         * `"light"` en <html> (o cualquier ancestro) lo fuerza a mano,
         * igual que ya hace `guia/guia.css` para la guia (ese mismo
         * mecanismo, ahora tambien en el paquete real).
         *
         * Solo son reactivos al tema los tokens de "superficie de
         * pagina" (fondo/texto/tenue/borde/gris-fondo/gris-texto/
         * superficie/titulo) y los 4 pares fondo+texto de tono. Los
         * colores de marca saturados (navy, navy-claro, azul, verde,
         * naranjo, rojo, gris) quedan FIJOS a proposito: son el fondo
         * de `.lateral`/`.hero`/`.toast` (franjas de marca oscuras
         * siempre, no reactivas) o sirven de texto blanco sobre un
         * boton/insignia de color (no dependen del tema de la pagina).
         * `titulo` existe aparte de `navy` por lo mismo: `navy` no
         * puede aclararse para el texto de titulo sin tambien aclarar
         * el fondo fijo de `.lateral`, asi que son dos tokens.
         * ------------------------------------------------------------- */
        "@media (prefers-color-scheme: dark)": {
          ":root:not([data-theme='light'])": {
            "--color-fondo": "#0b1420",
            "--color-texto": "#e6ecf2",
            "--color-tenue": "#93a4b7",
            "--color-borde": "#223246",
            "--color-gris-fondo": "#26323d",
            "--color-gris-texto": "#b7c3ce",
            "--color-superficie": "#121d2b",
            "--color-titulo": "#cfe0f6",
            "--color-azul-fondo": "#16314f",
            "--color-azul-texto": "#8fc0f0",
            "--color-verde-fondo": "#123524",
            "--color-verde-texto": "#7bd9a8",
            "--color-naranjo-fondo": "#3a2a12",
            "--color-naranjo-texto": "#f0b86b",
            "--color-rojo-fondo": "#3a1715",
            "--color-rojo-texto": "#f0938c",
          },
        },
        "[data-theme='dark']": {
          "--color-fondo": "#0b1420",
          "--color-texto": "#e6ecf2",
          "--color-tenue": "#93a4b7",
          "--color-borde": "#223246",
          "--color-gris-fondo": "#26323d",
          "--color-gris-texto": "#b7c3ce",
          "--color-superficie": "#121d2b",
          "--color-titulo": "#cfe0f6",
          "--color-azul-fondo": "#16314f",
          "--color-azul-texto": "#8fc0f0",
          "--color-verde-fondo": "#123524",
          "--color-verde-texto": "#7bd9a8",
          "--color-naranjo-fondo": "#3a2a12",
          "--color-naranjo-texto": "#f0b86b",
          "--color-rojo-fondo": "#3a1715",
          "--color-rojo-texto": "#f0938c",
        },
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
          fontFamily: "var(--font-sans)",
          fontSize: "15px",
          lineHeight: "1.55",
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

export default santacorinaUI;
