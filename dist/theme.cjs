"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/theme.ts
var theme_exports = {};
__export(theme_exports, {
  defaultTheme: () => defaultTheme
});
module.exports = __toCommonJS(theme_exports);
var defaultTheme = {
  colors: {
    navy: "#0c2d4a",
    "navy-claro": "#123f66",
    azul: "#2a78d6",
    "azul-oscuro": "#1f5fae",
    "azul-fondo": "#e7f0fc",
    "azul-texto": "#1f5fae",
    verde: "#1e8e5a",
    "verde-fondo": "#e8f6ee",
    "verde-texto": "#146540",
    naranjo: "#d97a12",
    "naranjo-fondo": "#fdf3e3",
    "naranjo-texto": "#8a4e08",
    rojo: "#c8362f",
    "rojo-fondo": "#fdecea",
    "rojo-texto": "#8d241e",
    "gris-texto": "#4c5966",
    gris: "#7a8794",
    "gris-fondo": "#f0f3f6",
    texto: "#1c2733",
    tenue: "#5b6b7c",
    borde: "#dde4ec",
    fondo: "#f4f7fa",
    // Superficie -- fondo de tarjeta/modal/panel flotante/input (antes
    // "#fff" literal en 47 lugares, sin variable: no se podian
    // oscurecer sin tocar cada uno).
    superficie: "#ffffff",
    // Titulo -- separado de `navy` a proposito: `navy` tambien es el
    // fondo de marca fijo de `.lateral`/`.hero`/`.toast` (no debe
    // cambiar con el tema, son franjas oscuras siempre). `titulo` es
    // solo el rol de texto de encabezado/etiqueta, que si debe
    // aclararse en modo oscuro.
    titulo: "#0c2d4a"
  },
  fonts: {
    // Public Sans: disenada para el US Web Design System (licencia SIL
    // Open Font), pensada para texto denso en tablas y formularios de
    // gobierno -- encaja con lo que es esta plataforma. El plugin no
    // carga el <link> de Google Fonts por su cuenta (ver README); sin
    // el, el navegador cae al mismo system-ui de siempre.
    sans: "'Public Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defaultTheme
});
