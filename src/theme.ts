/**
 * Tokens de color del Servicio Local de Educacion Publica Santa Corina.
 * Fuente unica: cualquier sistema que use este paquete (o el que venga
 * despues) parte de los mismos valores, no de una aproximacion propia.
 *
 * Estos mismos nombres quedan disponibles como utilidades de Tailwind
 * (bg-navy, text-azul-oscuro, border-rojo-fondo, ...) via `theme.extend.colors`
 * en plugin.ts. Un consumidor puede sobreescribir cualquiera de estos valores
 * al cargar el plugin (ver README, seccion "Configurar colores").
 */
export interface SantacorinaTheme {
  colors: Record<string, string>;
  fonts: {
    sans: string;
  };
}

export const defaultTheme: SantacorinaTheme = {
  colors: {
    navy: "#0c2d4a",
    "navy-claro": "#123f66",
    azul: "#2a78d6",
    "azul-oscuro": "#1f5fae",
    verde: "#1e8e5a",
    "verde-fondo": "#e8f6ee",
    naranjo: "#d97a12",
    "naranjo-fondo": "#fdf3e3",
    rojo: "#c8362f",
    "rojo-fondo": "#fdecea",
    gris: "#7a8794",
    "gris-fondo": "#f0f3f6",
    texto: "#1c2733",
    tenue: "#5b6b7c",
    borde: "#dde4ec",
    fondo: "#f4f7fa",
  },
  fonts: {
    // Public Sans: disenada para el US Web Design System (licencia SIL
    // Open Font), pensada para texto denso en tablas y formularios de
    // gobierno -- encaja con lo que es esta plataforma. El plugin no
    // carga el <link> de Google Fonts por su cuenta (ver README); sin
    // el, el navegador cae al mismo system-ui de siempre.
    sans: "'Public Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
};
