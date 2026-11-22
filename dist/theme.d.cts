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
interface SantacorinaTheme {
    colors: Record<string, string>;
    fonts: {
        sans: string;
    };
}
declare const defaultTheme: SantacorinaTheme;

export { type SantacorinaTheme, defaultTheme };
