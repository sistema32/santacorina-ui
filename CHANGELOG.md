# Changelog

## 0.1.0 — sin publicar

Primera versión. Extraída de `sgp/frontend/src/legado.css` +
`sgp/web/static/portal.css` (el CSS que corría en producción) — no se
inventó ningún valor nuevo, solo se trasladó a un plugin de Tailwind v4
instalable desde otros repos.

- Tokens de color (16 valores: navy, azul, verde, naranjo, rojo, gris +
  variantes `-fondo`/`-oscuro`/`-claro`).
- Componentes: tarjeta, kpi, etiqueta, boton, btn-chico, pastilla, aviso,
  campo + inputs, tabla base + helpers de alineación, dato, ficha, luz,
  linea-tiempo, vacio.
- `dist/ui.css` precompilado para consumidores sin Tailwind propio.
- Guía visual en `guia/index.html`.
