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

// src/js/foco.ts
var SELECTOR_ENFOCABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function atraparFoco(contenedor2) {
  const previo = document.activeElement;
  const enfocables = () => Array.from(contenedor2.querySelectorAll(SELECTOR_ENFOCABLE));
  const primero = enfocables()[0];
  if (!primero && !contenedor2.hasAttribute("tabindex")) contenedor2.setAttribute("tabindex", "-1");
  (primero ?? contenedor2).focus();
  const manejarTab = (e) => {
    if (e.key !== "Tab") return;
    const items = enfocables();
    if (items.length === 0) return;
    const [inicio, fin] = [items[0], items[items.length - 1]];
    if (e.shiftKey && document.activeElement === inicio) {
      e.preventDefault();
      fin.focus();
    } else if (!e.shiftKey && document.activeElement === fin) {
      e.preventDefault();
      inicio.focus();
    }
  };
  contenedor2.addEventListener("keydown", manejarTab);
  return () => {
    contenedor2.removeEventListener("keydown", manejarTab);
    previo?.focus();
  };
}
var contadorId = 0;
function idDe(el, prefijo) {
  if (!el.id) el.id = `${prefijo}-${++contadorId}`;
  return el.id;
}

// src/js/modal.ts
var liberadores = /* @__PURE__ */ new WeakMap();
function abrirModal(el) {
  if (!el.getAttribute("role")) el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.classList.add("visible");
  const panel = el.querySelector(".modal-panel") ?? el;
  liberadores.set(el, atraparFoco(panel));
}
function cerrarModal(el) {
  el.classList.remove("visible");
  liberadores.get(el)?.();
  liberadores.delete(el);
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
  const cerrar2 = document.createElement("button");
  cerrar2.type = "button";
  cerrar2.className = "cerrar";
  cerrar2.textContent = "\xD7";
  cerrar2.addEventListener("click", () => toast.remove());
  toast.appendChild(cerrar2);
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
  const cerrar2 = () => {
    lateral.classList.remove("abierta");
    fondo?.classList.remove("visible");
  };
  const alternar = () => {
    lateral.classList.toggle("abierta");
    fondo?.classList.toggle("visible");
  };
  toggle.addEventListener("click", alternar);
  fondo?.addEventListener("click", cerrar2);
}

// src/js/tabs.ts
function iniciarTabs(raiz = document) {
  raiz.querySelectorAll(".tabs").forEach((tabs) => {
    if (!tabs.getAttribute("role")) tabs.setAttribute("role", "tablist");
    const botones = tabs.querySelectorAll("a, button");
    botones.forEach((boton) => {
      if (!boton.getAttribute("role")) boton.setAttribute("role", "tab");
      boton.setAttribute("aria-selected", boton.classList.contains("activo") ? "true" : "false");
    });
    tabs.addEventListener("click", (e) => {
      const el = e.target.closest("a, button");
      if (!el || !tabs.contains(el)) return;
      botones.forEach((b) => {
        b.classList.remove("activo");
        b.setAttribute("aria-selected", "false");
      });
      el.classList.add("activo");
      el.setAttribute("aria-selected", "true");
      const destino = el.dataset.tab;
      if (!destino) return;
      document.querySelectorAll("[data-tab-panel]").forEach((panel) => {
        const activo = panel.dataset.tabPanel === destino;
        panel.classList.toggle("activo", activo);
        if (!panel.getAttribute("role")) panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-hidden", activo ? "false" : "true");
      });
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
          cerrar2();
        },
        (mes) => {
          mesVisible = mes;
          redibujar();
        }
      );
    };
    const abrir2 = () => {
      redibujar();
      panel.classList.add("visible");
    };
    const cerrar2 = () => panel.classList.remove("visible");
    input.addEventListener("click", (e) => {
      e.stopPropagation();
      abrir2();
    });
    document.addEventListener("click", (e) => {
      if (!contenedor2.contains(e.target)) cerrar2();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") cerrar2();
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

// src/js/popover.ts
function iniciarPopovers(raiz = document) {
  raiz.querySelectorAll("[data-popover]").forEach((contenedor2) => {
    const trigger = contenedor2.querySelector("[data-popover-trigger]") ?? contenedor2.firstElementChild;
    const fuente = contenedor2.querySelector("[data-popover-contenido]");
    if (!trigger || !fuente) return;
    const panel = document.createElement("div");
    panel.className = "popover-panel";
    panel.setAttribute("role", "dialog");
    panel.innerHTML = fuente.innerHTML;
    contenedor2.appendChild(panel);
    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-controls", idDe(panel, "popover"));
    trigger.setAttribute("aria-expanded", "false");
    const cerrar2 = (devolverFoco = false) => {
      panel.classList.remove("visible");
      trigger.setAttribute("aria-expanded", "false");
      if (devolverFoco) trigger.focus();
    };
    const alternar = (e) => {
      e.stopPropagation();
      const abrir2 = !panel.classList.contains("visible");
      panel.classList.toggle("visible", abrir2);
      trigger.setAttribute("aria-expanded", String(abrir2));
    };
    trigger.addEventListener("click", alternar);
    document.addEventListener("click", (e) => {
      if (!contenedor2.contains(e.target)) cerrar2();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("visible")) cerrar2(true);
    });
  });
}

// src/js/colapsar.ts
function iniciarColapsables(raiz = document) {
  raiz.querySelectorAll("[data-colapsar]").forEach((boton) => {
    const destino = boton.dataset.colapsar;
    if (!destino) return;
    const paneles = Array.from(document.querySelectorAll(`[data-colapsable="${destino}"]`));
    if (paneles.length > 0) {
      boton.setAttribute("aria-controls", paneles.map((p) => idDe(p, "colapsable")).join(" "));
    }
    boton.setAttribute("aria-expanded", paneles.some((p) => p.classList.contains("activo")) ? "true" : "false");
    boton.addEventListener("click", () => {
      let abierto = false;
      paneles.forEach((panel) => {
        panel.classList.toggle("activo");
        abierto = abierto || panel.classList.contains("activo");
      });
      boton.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
  });
}

// src/js/cajon.ts
var liberadores2 = /* @__PURE__ */ new WeakMap();
function abrir(cajon, fondo) {
  if (!cajon.getAttribute("role")) cajon.setAttribute("role", "dialog");
  cajon.setAttribute("aria-modal", "true");
  cajon.classList.add("abierto");
  fondo?.classList.add("visible");
  liberadores2.set(cajon, atraparFoco(cajon));
}
function cerrar(cajon, fondo) {
  cajon.classList.remove("abierto");
  fondo?.classList.remove("visible");
  liberadores2.get(cajon)?.();
  liberadores2.delete(cajon);
}
function iniciarCajones(raiz = document) {
  raiz.querySelectorAll("[data-cajon-toggle]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const destino = boton.dataset.cajonToggle;
      if (!destino) return;
      const cajon = document.querySelector(`[data-cajon="${destino}"]`);
      if (!cajon) return;
      const fondo = cajon.querySelector(".cajon-fondo") ?? document.querySelector(`[data-cajon-fondo="${destino}"]`);
      if (cajon.classList.contains("abierto")) cerrar(cajon, fondo);
      else abrir(cajon, fondo);
    });
  });
  raiz.querySelectorAll("[data-cajon-fondo]").forEach((fondo) => {
    fondo.addEventListener("click", () => {
      const destino = fondo.dataset.cajonFondo;
      if (!destino) return;
      const cajon = document.querySelector(`[data-cajon="${destino}"]`);
      if (cajon) cerrar(cajon, fondo);
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    raiz.querySelectorAll(".cajon.abierto").forEach((cajon) => {
      const destino = cajon.dataset.cajon;
      const fondo = cajon.querySelector(".cajon-fondo") ?? (destino ? document.querySelector(`[data-cajon-fondo="${destino}"]`) : null);
      cerrar(cajon, fondo);
    });
  });
}

// src/js/combobox.ts
function iniciarCombobox(raiz = document) {
  raiz.querySelectorAll(".combobox").forEach((caja) => {
    const input = caja.querySelector("input[type=text]");
    const select = caja.querySelector("select");
    const lista = caja.querySelector(".combobox-opciones");
    if (!input || !select || !lista) return;
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-controls", idDe(lista, "combobox-lista"));
    input.setAttribute("aria-autocomplete", "list");
    lista.setAttribute("role", "listbox");
    const opciones = Array.from(select.options).filter((o) => o.value);
    let resaltada = -1;
    const seleccionar = (opcion) => {
      select.value = opcion.value;
      input.value = opcion.textContent ?? "";
      select.dispatchEvent(new Event("change", { bubbles: true }));
      cerrar2();
    };
    const normalizar = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const redibujar = (filtro) => {
      lista.innerHTML = "";
      const texto = normalizar(filtro.trim());
      const visibles = opciones.filter((o) => normalizar(o.textContent ?? "").includes(texto));
      resaltada = -1;
      if (visibles.length === 0) {
        const li = document.createElement("li");
        li.className = "sin-resultados";
        li.textContent = "Sin resultados";
        lista.appendChild(li);
        return;
      }
      visibles.forEach((opcion) => {
        const li = document.createElement("li");
        li.textContent = opcion.textContent ?? "";
        li.id = `${lista.id}-op-${opcion.value}`;
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", opcion.value === select.value ? "true" : "false");
        li.addEventListener("click", () => seleccionar(opcion));
        li.dataset.valor = opcion.value;
        lista.appendChild(li);
      });
    };
    const abrir2 = () => {
      redibujar(input.value);
      lista.classList.add("visible");
      input.setAttribute("aria-expanded", "true");
    };
    const cerrar2 = () => {
      lista.classList.remove("visible");
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
    };
    const marcarResaltada = (indice) => {
      const items = Array.from(lista.querySelectorAll("li:not(.sin-resultados)"));
      items.forEach((el) => el.classList.remove("resaltada"));
      if (items[indice]) {
        items[indice].classList.add("resaltada");
        items[indice].scrollIntoView({ block: "nearest" });
        input.setAttribute("aria-activedescendant", items[indice].id);
      } else {
        input.removeAttribute("aria-activedescendant");
      }
    };
    input.addEventListener("input", () => abrir2());
    input.addEventListener("focus", () => abrir2());
    input.addEventListener("keydown", (e) => {
      const items = Array.from(lista.querySelectorAll("li:not(.sin-resultados)"));
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!lista.classList.contains("visible")) return abrir2();
        resaltada = Math.min(resaltada + 1, items.length - 1);
        marcarResaltada(resaltada);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        resaltada = Math.max(resaltada - 1, 0);
        marcarResaltada(resaltada);
      } else if (e.key === "Enter") {
        if (resaltada >= 0 && opciones.length) {
          e.preventDefault();
          const elegida = opciones.find((o) => o.value === items[resaltada]?.dataset.valor);
          if (elegida) seleccionar(elegida);
        }
      } else if (e.key === "Escape") {
        cerrar2();
      }
    });
    document.addEventListener("click", (e) => {
      if (!caja.contains(e.target)) cerrar2();
    });
    if (select.value) {
      const actual = opciones.find((o) => o.value === select.value);
      if (actual) input.value = actual.textContent ?? "";
    }
  });
}

// src/js/medidor-clave.ts
function puntaje(clave) {
  if (!clave) return 0;
  let p = 0;
  if (clave.length >= 8) p++;
  if (clave.length >= 12) p++;
  if (/[a-z]/.test(clave) && /[A-Z]/.test(clave)) p++;
  if (/\d/.test(clave)) p++;
  if (/[^a-zA-Z0-9]/.test(clave)) p++;
  return Math.min(p, 4);
}
var ETIQUETAS = ["", "D\xE9bil", "Regular", "Buena", "Fuerte"];
var NIVELES = ["", "debil", "regular", "buena", "fuerte"];
function iniciarMedidorClave(raiz = document) {
  raiz.querySelectorAll("input[data-medidor-clave]").forEach((input) => {
    const medidor = document.createElement("div");
    medidor.className = "medidor-clave";
    medidor.innerHTML = '<div class="segmentos"><span></span><span></span><span></span><span></span></div><span class="etiqueta"></span>';
    input.insertAdjacentElement("afterend", medidor);
    const segmentos = medidor.querySelectorAll(".segmentos span");
    const etiqueta = medidor.querySelector(".etiqueta");
    const actualizar = () => {
      const n = puntaje(input.value);
      segmentos.forEach((seg, i) => {
        seg.className = i < n ? `activo ${NIVELES[n]}` : "";
      });
      etiqueta.textContent = input.value ? ETIQUETAS[n] : "";
    };
    input.addEventListener("input", actualizar);
    actualizar();
  });
}

// src/js/asistente.ts
function irAPaso(asistente, n) {
  asistente.querySelectorAll("[data-paso]").forEach((panel) => {
    panel.classList.toggle("visible", panel.dataset.paso === String(n));
  });
  asistente.querySelectorAll("[data-chip]").forEach((chip) => {
    const num = Number(chip.dataset.chip);
    chip.classList.toggle("activo", num === n);
    chip.classList.toggle("completado", num < n);
  });
}
function iniciarAsistentes(raiz = document) {
  raiz.querySelectorAll("[data-asistente]").forEach((asistente) => {
    asistente.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-chip]");
      if (!chip || !asistente.contains(chip)) return;
      if (!chip.classList.contains("completado") && !chip.classList.contains("activo")) return;
      irAPaso(asistente, Number(chip.dataset.chip));
    });
  });
}

// src/js/arrastre.ts
function iniciarZonasArrastre(raiz = document) {
  raiz.querySelectorAll(".zona-arrastre").forEach((zona) => {
    zona.addEventListener("dragover", (e) => {
      e.preventDefault();
      zona.classList.add("activa");
    });
    zona.addEventListener("dragleave", () => zona.classList.remove("activa"));
    zona.addEventListener("drop", (e) => {
      e.preventDefault();
      zona.classList.remove("activa");
    });
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
  iniciarPopovers(raiz);
  iniciarColapsables(raiz);
  iniciarCajones(raiz);
  iniciarCombobox(raiz);
  iniciarMedidorClave(raiz);
  iniciarAsistentes(raiz);
  iniciarZonasArrastre(raiz);
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
  iniciarAsistentes,
  iniciarBuscadores,
  iniciarCajones,
  iniciarCalendario,
  iniciarColapsables,
  iniciarCombobox,
  iniciarContadores,
  iniciarLateral,
  iniciarMedidorClave,
  iniciarModales,
  iniciarPopovers,
  iniciarRangoFechas,
  iniciarTabs,
  iniciarTodo,
  iniciarZonasArrastre,
  irAPaso,
  mostrarToast
};
