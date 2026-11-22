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
    fondo: "#f4f7fa"
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
