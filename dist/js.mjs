var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/js/formato.ts
var formato_exports = {};
__export(formato_exports, {
  conSigno: () => conSigno,
  fechaCorta: () => fechaCorta,
  pct: () => pct,
  pesos: () => pesos
});
function pesos(n) {
  return Math.round(n || 0).toLocaleString("es-CL");
}
function conSigno(n) {
  return n < 0 ? `-$${pesos(-n)}` : `$${pesos(n)}`;
}
function pct(x) {
  return (x * 100).toFixed(1).replace(".", ",") + "%";
}
function fechaCorta(fecha) {
  const dd = String(fecha.getDate()).padStart(2, "0");
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${fecha.getFullYear()}`;
}

// src/js/debounce.ts
function debounce(fn, ms = 300) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), ms);
  };
}

// src/js/portapapeles.ts
async function copiarAlPortapapeles(texto) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch {
    }
  }
  const area = document.createElement("textarea");
  area.value = texto;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

// src/js/modal.ts
function abrirModal(el) {
  el.classList.add("visible");
}
function cerrarModal(el) {
  el.classList.remove("visible");
}
function cerrarSiCorresponde(modal, objetivo) {
  if (objetivo === modal || objetivo instanceof Element && objetivo.closest("[data-cerrar-modal]")) {
    cerrarModal(modal);
  }
}
function iniciarModales(raiz = document) {
  raiz.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => cerrarSiCorresponde(modal, e.target));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    raiz.querySelectorAll(".modal.visible").forEach((modal) => cerrarModal(modal));
  });
}

// src/js/toast.ts
function contenedor() {
  let el = document.querySelector(".toast-contenedor");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast-contenedor";
    document.body.appendChild(el);
  }
  return el;
}
function mostrarToast(mensaje, tipo, duracionMs = 4e3) {
  const toast = document.createElement("div");
  toast.className = tipo ? `toast ${tipo}` : "toast";
  const texto = document.createElement("span");
  texto.textContent = mensaje;
  toast.appendChild(texto);
  const cerrar = document.createElement("button");
  cerrar.type = "button";
  cerrar.className = "cerrar";
  cerrar.textContent = "\xD7";
  cerrar.addEventListener("click", () => toast.remove());
  toast.appendChild(cerrar);
  contenedor().appendChild(toast);
  if (duracionMs > 0) setTimeout(() => toast.remove(), duracionMs);
  return toast;
}

// src/js/lateral.ts
function iniciarLateral(raiz = document) {
  const toggle = raiz.querySelector(".lateral-toggle");
  const lateral = raiz.querySelector(".lateral");
  const fondo = raiz.querySelector(".lateral-fondo");
  if (!toggle || !lateral) return;
  const cerrar = () => {
    lateral.classList.remove("abierta");
    fondo?.classList.remove("visible");
  };
  const alternar = () => {
    lateral.classList.toggle("abierta");
    fondo?.classList.toggle("visible");
  };
  toggle.addEventListener("click", alternar);
  fondo?.addEventListener("click", cerrar);
}

// src/js/tabs.ts
function iniciarTabs(raiz = document) {
  raiz.querySelectorAll(".tabs").forEach((tabs) => {
    tabs.addEventListener("click", (e) => {
      const el = e.target.closest("a, button");
      if (!el || !tabs.contains(el)) return;
      tabs.querySelectorAll(".activo").forEach((a) => a.classList.remove("activo"));
      el.classList.add("activo");
    });
  });
}

// src/js/rango-fechas.ts
function iniciarRangoFechas(raiz = document) {
  raiz.querySelectorAll("[data-rango-fechas]").forEach((contenedor2) => {
    const [desde, hasta] = contenedor2.querySelectorAll("input[type=date]");
    if (!desde || !hasta) return;
    const sincronizar = () => {
      if (desde.value) hasta.min = desde.value;
      else hasta.removeAttribute("min");
      if (hasta.value) desde.max = hasta.value;
      else desde.removeAttribute("max");
    };
    desde.addEventListener("change", sincronizar);
    hasta.addEventListener("change", sincronizar);
    sincronizar();
  });
}

// src/js/calendario.ts
var DOW = ["L", "M", "M", "J", "V", "S", "D"];
var MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre"
];
function mismaFecha(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function construirGrilla(panel, mesVisible, seleccionada, onElegir, onCambiarMes) {
  panel.innerHTML = "";
  const cabecera = document.createElement("div");
  cabecera.className = "calendario-cabecera";
  const btnAnt = document.createElement("button");
  btnAnt.type = "button";
  btnAnt.className = "calendario-nav";
  btnAnt.textContent = "\u2039";
  const titulo = document.createElement("span");
  titulo.textContent = `${MESES[mesVisible.getMonth()]} ${mesVisible.getFullYear()}`;
  const btnSig = document.createElement("button");
  btnSig.type = "button";
  btnSig.className = "calendario-nav";
  btnSig.textContent = "\u203A";
  cabecera.append(btnAnt, titulo, btnSig);
  panel.appendChild(cabecera);
  const grilla = document.createElement("div");
  grilla.className = "calendario-grilla";
  DOW.forEach((d) => {
    const el = document.createElement("div");
    el.className = "calendario-dow";
    el.textContent = d;
    grilla.appendChild(el);
  });
  const primerDiaMes = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), 1);
  const offsetLunes = (primerDiaMes.getDay() + 6) % 7;
  const inicio = new Date(primerDiaMes);
  inicio.setDate(inicio.getDate() - offsetLunes);
  const hoy = /* @__PURE__ */ new Date();
  for (let i = 0; i < 42; i++) {
    const dia = new Date(inicio);
    dia.setDate(inicio.getDate() + i);
    const el = document.createElement("div");
    el.className = "calendario-dia";
    if (dia.getMonth() !== mesVisible.getMonth()) el.classList.add("fuera");
    if (mismaFecha(dia, hoy)) el.classList.add("hoy");
    if (seleccionada && mismaFecha(dia, seleccionada)) el.classList.add("activo");
    el.textContent = String(dia.getDate());
    el.addEventListener("click", () => onElegir(dia));
    grilla.appendChild(el);
  }
  panel.appendChild(grilla);
  btnAnt.addEventListener("click", (e) => {
    e.stopPropagation();
    const m = new Date(mesVisible);
    m.setMonth(m.getMonth() - 1);
    onCambiarMes(m);
  });
  btnSig.addEventListener("click", (e) => {
    e.stopPropagation();
    const m = new Date(mesVisible);
    m.setMonth(m.getMonth() + 1);
    onCambiarMes(m);
  });
}
function iniciarCalendario(raiz = document) {
  raiz.querySelectorAll("[data-calendario]").forEach((contenedor2) => {
    const input = contenedor2.querySelector("input");
    const panel = contenedor2.querySelector(".calendario-panel");
    if (!input || !panel) return;
    let seleccionada = null;
    let mesVisible = /* @__PURE__ */ new Date();
    const redibujar = () => {
      construirGrilla(
        panel,
        mesVisible,
        seleccionada,
        (dia) => {
          seleccionada = dia;
          mesVisible = dia;
          input.value = fechaCorta(dia);
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
          cerrar();
        },
        (mes) => {
          mesVisible = mes;
          redibujar();
        }
      );
    };
    const abrir = () => {
      redibujar();
      panel.classList.add("visible");
    };
    const cerrar = () => panel.classList.remove("visible");
    input.addEventListener("click", (e) => {
      e.stopPropagation();
      abrir();
    });
    document.addEventListener("click", (e) => {
      if (!contenedor2.contains(e.target)) cerrar();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") cerrar();
    });
  });
}

// src/js/buscador.ts
function iniciarBuscadores(raiz = document) {
  raiz.querySelectorAll(".buscador").forEach((caja) => {
    const input = caja.querySelector("input");
    const limpiar = caja.querySelector(".limpiar");
    if (!input || !limpiar) return;
    const actualizar = () => limpiar.classList.toggle("visible", input.value.length > 0);
    input.addEventListener("input", actualizar);
    limpiar.addEventListener("click", () => {
      input.value = "";
      input.focus();
      input.dispatchEvent(new Event("input", { bubbles: true }));
      actualizar();
    });
    actualizar();
  });
}

// src/js/contador.ts
function iniciarContadores(raiz = document) {
  raiz.querySelectorAll("textarea[data-contador]").forEach((textarea) => {
    const max = textarea.maxLength;
    if (!max || max < 0) return;
    const contador = textarea.parentElement?.querySelector(".contador-caracteres");
    if (!contador) return;
    const actualizar = () => {
      const n = textarea.value.length;
      contador.textContent = `${n}/${max}`;
      contador.classList.toggle("cerca", n >= max * 0.9 && n < max);
      contador.classList.toggle("lleno", n >= max);
    };
    textarea.addEventListener("input", actualizar);
    actualizar();
  });
}

// src/js/index.ts
function iniciarTodo(raiz = document) {
  iniciarModales(raiz);
  iniciarLateral(raiz);
  iniciarTabs(raiz);
  iniciarRangoFechas(raiz);
  iniciarCalendario(raiz);
  iniciarBuscadores(raiz);
  iniciarContadores(raiz);
}
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => iniciarTodo());
  } else {
    iniciarTodo();
  }
}
export {
  abrirModal,
  cerrarModal,
  copiarAlPortapapeles,
  debounce,
  formato_exports as formato,
  iniciarBuscadores,
  iniciarCalendario,
  iniciarContadores,
  iniciarLateral,
  iniciarModales,
  iniciarRangoFechas,
  iniciarTabs,
  iniciarTodo,
  mostrarToast
};
