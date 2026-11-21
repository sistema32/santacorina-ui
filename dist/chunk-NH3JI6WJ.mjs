var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/theme.ts
var defaultTheme;
var init_theme = __esm({
  "src/theme.ts"() {
    defaultTheme = {
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
      }
    };
  }
});

export {
  __esm,
  __commonJS,
  defaultTheme,
  init_theme
};
