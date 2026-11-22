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
  limpiarMojibake: () => limpiarMojibake,
  pct: () => pct,
  pesos: () => pesos,
  rut: () => rut
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
function rut(valor) {
  const limpio = valor.replace(/[^0-9kK]/g, "").toUpperCase();
  if (limpio.length < 2) return limpio;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  const conPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${conPuntos}-${dv}`;
}
function limpiarMojibake(texto) {
  return texto.replace(/[ÂÃ][-¿]+/g, (fragmento) => {
    try {
      const bytes = Uint8Array.from(fragmento, (c) => c.charCodeAt(0));
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      return fragmento;
    }
  });
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

// src/js/una-vez.ts
var marcas = /* @__PURE__ */ new WeakMap();
function primeraVez(el, nombre) {
  let claves = marcas.get(el);
  if (!claves) {
    claves = /* @__PURE__ */ new Set();
    marcas.set(el, claves);
  }
  if (claves.has(nombre)) return false;
  claves.add(nombre);
  return true;
}
var destructores = /* @__PURE__ */ new WeakMap();
function registrarDestructor(raiz, fn) {
  let lista = destructores.get(raiz);
  if (!lista) {
    lista = [];
    destructores.set(raiz, lista);
  }
  lista.push(fn);
}
function destruirTodo(raiz = document) {
  const lista = destructores.get(raiz);
  if (!lista) return;
  lista.forEach((fn) => fn());
  destructores.delete(raiz);
}
var activos = /* @__PURE__ */ new WeakMap();
function activar(el, nombre) {
  let claves = activos.get(el);
  if (!claves) {
    claves = /* @__PURE__ */ new Set();
    activos.set(el, claves);
  }
  if (claves.has(nombre)) return false;
  claves.add(nombre);
  return true;
}
function desactivar(el, nombre) {
  activos.get(el)?.delete(nombre);
}
var pila = [];
var escapeActivo = false;
function apilarCapa(cerrar2) {
  if (!escapeActivo) {
    escapeActivo = true;
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const capa2 = pila.pop();
      capa2?.cerrar();
    });
  }
  const capa = { cerrar: cerrar2 };
  pila.push(capa);
  return () => {
    const i = pila.indexOf(capa);
    if (i !== -1) pila.splice(i, 1);
  };
}

// src/js/modal.ts
var liberadores = /* @__PURE__ */ new WeakMap();
var desapiladores = /* @__PURE__ */ new WeakMap();
function abrirModal(el) {
  if (!el.getAttribute("role")) el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.classList.add("visible");
  const panel = el.querySelector(".modal-panel") ?? el;
  liberadores.set(el, atraparFoco(panel));
  desapiladores.set(el, apilarCapa(() => cerrarModal(el)));
  el.dispatchEvent(new CustomEvent("santacorina:modal-abrir", { bubbles: true }));
}
function cerrarModal(el) {
  if (!el.classList.contains("visible")) return;
  el.classList.remove("visible");
  liberadores.get(el)?.();
  liberadores.delete(el);
  desapiladores.get(el)?.();
  desapiladores.delete(el);
  el.dispatchEvent(new CustomEvent("santacorina:modal-cerrar", { bubbles: true }));
}
function cerrarSiCorresponde(modal, objetivo) {
  if (objetivo === modal || objetivo instanceof Element && objetivo.closest("[data-cerrar-modal]")) {
    cerrarModal(modal);
  }
}
function iniciarModales(raiz = document) {
  raiz.querySelectorAll(".modal").forEach((modal) => {
    if (!primeraVez(modal, "modal")) return;
    modal.addEventListener("click", (e) => cerrarSiCorresponde(modal, e.target));
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
  if (!primeraVez(toggle, "lateral")) return;
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
    if (!primeraVez(tabs, "tabs")) return;
    if (!tabs.getAttribute("role")) tabs.setAttribute("role", "tablist");
    const botones = tabs.querySelectorAll("a, button");
    const destinosDeEsteGrupo = new Set(
      Array.from(botones).map((b) => b.dataset.tab).filter((d) => Boolean(d))
    );
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
        const panelId = panel.dataset.tabPanel;
        if (!panelId || !destinosDeEsteGrupo.has(panelId)) return;
        const activo = panelId === destino;
        panel.classList.toggle("activo", activo);
        if (!panel.getAttribute("role")) panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-hidden", activo ? "false" : "true");
      });
      tabs.dispatchEvent(new CustomEvent("santacorina:tab-cambiar", { bubbles: true, detail: { destino } }));
    });
  });
}

// src/js/rango-fechas.ts
function iniciarRangoFechas(raiz = document) {
  raiz.querySelectorAll("[data-rango-fechas]").forEach((contenedor2) => {
    if (!primeraVez(contenedor2, "rango-fechas")) return;
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

// src/js/flotante.ts
function posicionarFlotante(ancla, panel) {
  const rect = ancla.getBoundingClientRect();
  const alturaPanel = panel.offsetHeight || panel.scrollHeight;
  const espacioAbajo = window.innerHeight - rect.bottom;
  const espacioArriba = rect.top;
  if (espacioAbajo < alturaPanel && espacioArriba > espacioAbajo) {
    panel.dataset.posicion = "arriba";
  } else {
    delete panel.dataset.posicion;
  }
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
function primerDiaDe(fecha) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
}
function construirGrilla(panel, mesVisible, seleccionada, focoDia, onElegir, onCambiarMes) {
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
    const el = document.createElement("button");
    el.type = "button";
    el.className = "calendario-dia";
    if (dia.getMonth() !== mesVisible.getMonth()) el.classList.add("fuera");
    if (mismaFecha(dia, hoy)) el.classList.add("hoy");
    if (seleccionada && mismaFecha(dia, seleccionada)) el.classList.add("activo");
    el.textContent = String(dia.getDate());
    el.tabIndex = mismaFecha(dia, focoDia) ? 0 : -1;
    el.addEventListener("click", () => onElegir(dia));
    grilla.appendChild(el);
  }
  panel.appendChild(grilla);
  btnAnt.addEventListener("click", (e) => {
    e.stopPropagation();
    onCambiarMes(new Date(mesVisible.getFullYear(), mesVisible.getMonth() - 1, 1));
  });
  btnSig.addEventListener("click", (e) => {
    e.stopPropagation();
    onCambiarMes(new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 1));
  });
}
var cerrarDe = /* @__PURE__ */ new WeakMap();
function iniciarCalendario(raiz = document) {
  raiz.querySelectorAll("[data-calendario]").forEach((contenedor2) => {
    if (primeraVez(contenedor2, "calendario")) {
      const input = contenedor2.querySelector("input");
      const panel = contenedor2.querySelector(".calendario-panel");
      if (!input || !panel) return;
      let seleccionada = null;
      let mesVisible = primerDiaDe(/* @__PURE__ */ new Date());
      let focoDia = /* @__PURE__ */ new Date();
      const enfocarDiaActual = () => {
        panel.querySelector(".calendario-dia[tabindex='0']")?.focus();
      };
      let desapilar = null;
      const redibujar = () => {
        construirGrilla(panel, mesVisible, seleccionada, focoDia, elegir, cambiarMes);
      };
      const elegir = (dia) => {
        seleccionada = dia;
        focoDia = dia;
        mesVisible = primerDiaDe(dia);
        input.value = fechaCorta(dia);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        cerrar3();
      };
      const cambiarMes = (mes) => {
        mesVisible = mes;
        redibujar();
      };
      const moverFoco = (delta) => {
        const nuevo = new Date(focoDia);
        nuevo.setDate(nuevo.getDate() + delta);
        focoDia = nuevo;
        mesVisible = primerDiaDe(focoDia);
        redibujar();
        enfocarDiaActual();
      };
      const abrir2 = () => {
        focoDia = seleccionada ?? /* @__PURE__ */ new Date();
        mesVisible = primerDiaDe(focoDia);
        redibujar();
        panel.classList.add("visible");
        posicionarFlotante(input, panel);
        enfocarDiaActual();
        desapilar = apilarCapa(() => cerrar3(true));
        contenedor2.dispatchEvent(new CustomEvent("santacorina:calendario-abrir", { bubbles: true }));
      };
      const cerrar3 = (devolverFoco = false) => {
        if (!panel.classList.contains("visible")) return;
        panel.classList.remove("visible");
        desapilar?.();
        desapilar = null;
        if (devolverFoco) input.focus();
        contenedor2.dispatchEvent(new CustomEvent("santacorina:calendario-cerrar", { bubbles: true }));
      };
      input.addEventListener("click", (e) => {
        e.stopPropagation();
        abrir2();
      });
      panel.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          moverFoco(-1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          moverFoco(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          moverFoco(-7);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          moverFoco(7);
        }
      });
      cerrarDe.set(contenedor2, cerrar3);
    }
    const cerrar2 = cerrarDe.get(contenedor2);
    if (!cerrar2 || !activar(contenedor2, "calendario-doc")) return;
    const alClicAfuera = (e) => {
      if (!contenedor2.contains(e.target)) cerrar2();
    };
    document.addEventListener("click", alClicAfuera);
    registrarDestructor(raiz, () => {
      document.removeEventListener("click", alClicAfuera);
      desactivar(contenedor2, "calendario-doc");
    });
  });
}

// src/js/buscador.ts
function iniciarBuscadores(raiz = document) {
  raiz.querySelectorAll(".buscador").forEach((caja) => {
    if (!primeraVez(caja, "buscador")) return;
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
    if (!primeraVez(textarea, "contador")) return;
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
var instancias = /* @__PURE__ */ new WeakMap();
function iniciarPopovers(raiz = document) {
  raiz.querySelectorAll("[data-popover]").forEach((contenedor2) => {
    if (primeraVez(contenedor2, "popover")) {
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
      let desapilar = null;
      const cerrar2 = (devolverFoco = false) => {
        if (!panel.classList.contains("visible")) return;
        panel.classList.remove("visible");
        trigger.setAttribute("aria-expanded", "false");
        desapilar?.();
        desapilar = null;
        if (devolverFoco) trigger.focus();
        contenedor2.dispatchEvent(new CustomEvent("santacorina:popover-cerrar", { bubbles: true }));
      };
      const alternar = (e) => {
        e.stopPropagation();
        if (panel.classList.contains("visible")) {
          cerrar2();
          return;
        }
        panel.classList.add("visible");
        posicionarFlotante(trigger, panel);
        trigger.setAttribute("aria-expanded", "true");
        desapilar = apilarCapa(() => cerrar2(true));
        contenedor2.dispatchEvent(new CustomEvent("santacorina:popover-abrir", { bubbles: true }));
      };
      trigger.addEventListener("click", alternar);
      instancias.set(contenedor2, { panel, cerrar: cerrar2 });
    }
    const instancia = instancias.get(contenedor2);
    if (!instancia || !activar(contenedor2, "popover-doc")) return;
    const alClicAfuera = (e) => {
      if (!contenedor2.contains(e.target)) instancia.cerrar();
    };
    document.addEventListener("click", alClicAfuera);
    registrarDestructor(raiz, () => {
      document.removeEventListener("click", alClicAfuera);
      desactivar(contenedor2, "popover-doc");
    });
  });
}

// src/js/colapsar.ts
function iniciarColapsables(raiz = document) {
  raiz.querySelectorAll("[data-colapsar]").forEach((boton) => {
    if (!primeraVez(boton, "colapsar")) return;
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
      boton.dispatchEvent(
        new CustomEvent(abierto ? "santacorina:colapsar-abrir" : "santacorina:colapsar-cerrar", { bubbles: true })
      );
    });
  });
}

// src/js/cajon.ts
var liberadores2 = /* @__PURE__ */ new WeakMap();
var desapiladores2 = /* @__PURE__ */ new WeakMap();
function abrir(cajon, fondo) {
  if (!cajon.getAttribute("role")) cajon.setAttribute("role", "dialog");
  cajon.setAttribute("aria-modal", "true");
  cajon.classList.add("abierto");
  fondo?.classList.add("visible");
  liberadores2.set(cajon, atraparFoco(cajon));
  desapiladores2.set(cajon, apilarCapa(() => cerrar(cajon, fondo)));
  cajon.dispatchEvent(new CustomEvent("santacorina:cajon-abrir", { bubbles: true }));
}
function cerrar(cajon, fondo) {
  if (!cajon.classList.contains("abierto")) return;
  cajon.classList.remove("abierto");
  fondo?.classList.remove("visible");
  liberadores2.get(cajon)?.();
  liberadores2.delete(cajon);
  desapiladores2.get(cajon)?.();
  desapiladores2.delete(cajon);
  cajon.dispatchEvent(new CustomEvent("santacorina:cajon-cerrar", { bubbles: true }));
}
function iniciarCajones(raiz = document) {
  raiz.querySelectorAll("[data-cajon-toggle]").forEach((boton) => {
    if (!primeraVez(boton, "cajon-toggle")) return;
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
    if (!primeraVez(fondo, "cajon-fondo")) return;
    fondo.addEventListener("click", () => {
      const destino = fondo.dataset.cajonFondo;
      if (!destino) return;
      const cajon = document.querySelector(`[data-cajon="${destino}"]`);
      if (cajon) cerrar(cajon, fondo);
    });
  });
}

// src/js/combobox.ts
var instancias2 = /* @__PURE__ */ new WeakMap();
function iniciarCombobox(raiz = document) {
  raiz.querySelectorAll(".combobox").forEach((caja) => {
    if (!primeraVez(caja, "combobox")) {
      const instancia2 = instancias2.get(caja);
      if (instancia2) activarListenersGlobales(caja, instancia2, raiz);
      return;
    }
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
      caja.dispatchEvent(
        new CustomEvent("santacorina:combobox-seleccionar", {
          bubbles: true,
          detail: { valor: opcion.value, texto: opcion.textContent ?? "" }
        })
      );
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
    let desapilar = null;
    const abrir2 = () => {
      const yaVisible = lista.classList.contains("visible");
      redibujar(input.value);
      if (yaVisible) return;
      lista.classList.add("visible");
      posicionarFlotante(input, lista);
      input.setAttribute("aria-expanded", "true");
      desapilar = apilarCapa(cerrar2);
    };
    const cerrar2 = () => {
      if (!lista.classList.contains("visible")) return;
      lista.classList.remove("visible");
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      desapilar?.();
      desapilar = null;
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
    const reconciliar = () => {
      const texto = normalizar(input.value.trim());
      const coincide = opciones.find((o) => normalizar(o.textContent ?? "") === texto);
      if (coincide) {
        select.value = coincide.value;
        input.value = coincide.textContent ?? "";
        select.dispatchEvent(new Event("change", { bubbles: true }));
        return;
      }
      const actual = opciones.find((o) => o.value === select.value);
      input.value = actual?.textContent ?? "";
    };
    input.addEventListener("blur", reconciliar);
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
      }
    });
    if (select.value) {
      const actual = opciones.find((o) => o.value === select.value);
      if (actual) input.value = actual.textContent ?? "";
    }
    const instancia = { reconciliar, cerrar: cerrar2 };
    instancias2.set(caja, instancia);
    activarListenersGlobales(caja, instancia, raiz);
  });
}
function activarListenersGlobales(caja, instancia, raiz) {
  if (!activar(caja, "combobox-doc")) return;
  const alClicAfuera = (e) => {
    if (!caja.contains(e.target)) instancia.cerrar();
  };
  const alEnviar = (e) => {
    const form = e.target;
    if (form instanceof HTMLFormElement && form.contains(caja)) instancia.reconciliar();
  };
  document.addEventListener("click", alClicAfuera);
  document.addEventListener("submit", alEnviar, true);
  registrarDestructor(raiz, () => {
    document.removeEventListener("click", alClicAfuera);
    document.removeEventListener("submit", alEnviar, true);
    desactivar(caja, "combobox-doc");
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
    if (!primeraVez(input, "medidor-clave")) return;
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
    if (!primeraVez(asistente, "asistente")) return;
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
    if (!primeraVez(zona, "arrastre")) return;
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

// src/js/toggletip.ts
var instancias3 = /* @__PURE__ */ new WeakMap();
function iniciarToggletips(raiz = document) {
  raiz.querySelectorAll("[data-toggletip]").forEach((contenedor2) => {
    if (primeraVez(contenedor2, "toggletip")) {
      const trigger = contenedor2.querySelector("[data-toggletip-trigger]") ?? contenedor2.firstElementChild;
      const fuente = contenedor2.querySelector("[data-toggletip-contenido]");
      if (!trigger || !fuente) return;
      const panel = document.createElement("div");
      panel.className = "toggletip-panel";
      panel.setAttribute("role", "tooltip");
      panel.innerHTML = fuente.innerHTML;
      contenedor2.appendChild(panel);
      trigger.setAttribute("aria-describedby", idDe(panel, "toggletip"));
      trigger.setAttribute("aria-expanded", "false");
      let desapilar = null;
      const cerrar2 = (devolverFoco = false) => {
        if (!panel.classList.contains("visible")) return;
        panel.classList.remove("visible");
        trigger.setAttribute("aria-expanded", "false");
        desapilar?.();
        desapilar = null;
        if (devolverFoco) trigger.focus();
        contenedor2.dispatchEvent(new CustomEvent("santacorina:toggletip-cerrar", { bubbles: true }));
      };
      const alternar = (e) => {
        e.stopPropagation();
        if (panel.classList.contains("visible")) {
          cerrar2();
          return;
        }
        panel.classList.add("visible");
        posicionarFlotante(trigger, panel);
        trigger.setAttribute("aria-expanded", "true");
        desapilar = apilarCapa(() => cerrar2(true));
        contenedor2.dispatchEvent(new CustomEvent("santacorina:toggletip-abrir", { bubbles: true }));
      };
      trigger.addEventListener("click", alternar);
      instancias3.set(contenedor2, { panel, cerrar: cerrar2 });
    }
    const instancia = instancias3.get(contenedor2);
    if (!instancia || !activar(contenedor2, "toggletip-doc")) return;
    const alClicAfuera = (e) => {
      if (!contenedor2.contains(e.target)) instancia.cerrar();
    };
    document.addEventListener("click", alClicAfuera);
    registrarDestructor(raiz, () => {
      document.removeEventListener("click", alClicAfuera);
      desactivar(contenedor2, "toggletip-doc");
    });
  });
}

// src/js/resumen-errores.ts
function iniciarResumenErrores(raiz = document) {
  raiz.querySelectorAll(".resumen-errores").forEach((caja) => {
    if (!primeraVez(caja, "resumen-errores")) return;
    const links = caja.querySelectorAll("a[href^='#']");
    if (links.length === 0) return;
    if (!caja.hasAttribute("tabindex")) caja.setAttribute("tabindex", "-1");
    caja.focus();
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        const destino = document.querySelector(link.getAttribute("href"));
        if (!destino) return;
        e.preventDefault();
        destino.scrollIntoView({ behavior: "smooth", block: "center" });
        destino.focus({ preventScroll: true });
      });
    });
  });
}

// src/js/tabla-ordenable.ts
function iniciarTablasOrdenables(raiz = document) {
  raiz.querySelectorAll("th[data-ordenable]").forEach((th) => {
    if (!primeraVez(th, "tabla-ordenable")) return;
    th.setAttribute("role", "columnheader");
    th.setAttribute("tabindex", "0");
    if (!th.hasAttribute("aria-sort")) th.setAttribute("aria-sort", "none");
    const alternar = () => {
      const tabla = th.closest("table");
      tabla?.querySelectorAll("th[data-ordenable]").forEach((otro) => {
        if (otro !== th) otro.setAttribute("aria-sort", "none");
      });
      const actual = th.getAttribute("aria-sort");
      const siguiente = actual === "ascending" ? "descending" : "ascending";
      th.setAttribute("aria-sort", siguiente);
      th.dispatchEvent(
        new CustomEvent("santacorina:ordenar", {
          bubbles: true,
          detail: { columna: th.dataset.ordenable || th.textContent?.trim(), direccion: siguiente }
        })
      );
    };
    th.addEventListener("click", alternar);
    th.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        alternar();
      }
    });
  });
}

// src/js/carousel.ts
var controles = /* @__PURE__ */ new WeakMap();
function iniciarCarruseles(raiz = document) {
  raiz.querySelectorAll(".carousel").forEach((carousel) => {
    if (!primeraVez(carousel, "carousel")) return;
    const pista = carousel.querySelector(".carousel-pista");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    if (!pista || slides.length === 0) return;
    let indice = 0;
    const contenedorIndicadores = carousel.querySelector(".carousel-indicadores");
    let indicadores = [];
    if (contenedorIndicadores) {
      if (contenedorIndicadores.children.length === 0) {
        indicadores = slides.map((_, i) => {
          const boton = document.createElement("button");
          boton.type = "button";
          boton.setAttribute("aria-label", `Ir a la diapositiva ${i + 1}`);
          contenedorIndicadores.appendChild(boton);
          return boton;
        });
      } else {
        indicadores = Array.from(contenedorIndicadores.children);
      }
      indicadores.forEach((boton, i) => boton.addEventListener("click", () => ir(i)));
    }
    function render() {
      pista.style.transform = `translateX(-${indice * 100}%)`;
      indicadores.forEach((boton, i) => boton.classList.toggle("activo", i === indice));
    }
    function ir(destino) {
      indice = (destino + slides.length) % slides.length;
      render();
      carousel.dispatchEvent(new CustomEvent("santacorina:carousel-cambiar", { bubbles: true, detail: { indice } }));
    }
    const anterior = () => ir(indice - 1);
    const siguiente = () => ir(indice + 1);
    carousel.querySelector(".carousel-anterior")?.addEventListener("click", anterior);
    carousel.querySelector(".carousel-siguiente")?.addEventListener("click", siguiente);
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") anterior();
      else if (e.key === "ArrowRight") siguiente();
    });
    if (!carousel.hasAttribute("tabindex")) carousel.setAttribute("tabindex", "0");
    render();
    controles.set(carousel, { ir, siguiente, anterior });
  });
}
function avanzarCarrusel(carousel, direccion = 1) {
  const control = controles.get(carousel);
  if (!control) return;
  if (direccion === 1) control.siguiente();
  else control.anterior();
}

// src/js/formulario.ts
function mensajeDe(campo) {
  return campo.dataset.mensajeError || campo.validationMessage;
}
var describedByOriginal = /* @__PURE__ */ new WeakMap();
function limpiarCampo(campo) {
  campo.removeAttribute("aria-invalid");
  const contenedor2 = campo.closest(".campo") ?? campo.parentElement;
  contenedor2?.querySelector(".campo-error")?.remove();
  if (describedByOriginal.has(campo)) {
    const original = describedByOriginal.get(campo);
    if (original) campo.setAttribute("aria-describedby", original);
    else campo.removeAttribute("aria-describedby");
    describedByOriginal.delete(campo);
  }
}
function marcarInvalido(campo) {
  campo.setAttribute("aria-invalid", "true");
  const contenedor2 = campo.closest(".campo") ?? campo.parentElement;
  let error = contenedor2?.querySelector(".campo-error");
  if (!error) {
    error = document.createElement("p");
    error.className = "campo-error";
    contenedor2?.appendChild(error);
  }
  error.innerHTML = "";
  const icono = document.createElement("span");
  icono.className = "icono icono-advertencia";
  error.append(icono, document.createTextNode(mensajeDe(campo)));
  if (!describedByOriginal.has(campo)) {
    describedByOriginal.set(campo, campo.getAttribute("aria-describedby") ?? "");
  }
  const errorId = idDe(error, "campo-error");
  const original = describedByOriginal.get(campo);
  campo.setAttribute("aria-describedby", original ? `${original} ${errorId}` : errorId);
}
function validarYMostrar(form) {
  const campos = Array.from(form.querySelectorAll("input, select, textarea"));
  const invalidos = campos.filter((c) => !c.checkValidity());
  campos.forEach((c) => c.checkValidity() ? limpiarCampo(c) : marcarInvalido(c));
  form.querySelector(".resumen-errores")?.remove();
  if (invalidos.length === 0) return true;
  const resumen = document.createElement("div");
  resumen.className = "resumen-errores";
  const titulo = document.createElement("h2");
  titulo.textContent = invalidos.length === 1 ? "Hay 1 problema con el formulario" : `Hay ${invalidos.length} problemas con el formulario`;
  const lista = document.createElement("ul");
  invalidos.forEach((campo) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${idDe(campo, "campo")}`;
    link.textContent = mensajeDe(campo);
    li.appendChild(link);
    lista.appendChild(li);
  });
  resumen.append(titulo, lista);
  form.insertBefore(resumen, form.firstChild);
  iniciarResumenErrores(form);
  return false;
}
var escucharActivo = false;
function iniciarFormularios(raiz = document) {
  raiz.querySelectorAll("form[data-validar]").forEach((form) => {
    if (!primeraVez(form, "formulario")) return;
    form.noValidate = true;
  });
  if (escucharActivo) return;
  escucharActivo = true;
  const alEscribir = (e) => {
    const campo = e.target;
    if (!campo.closest?.("form[data-validar]")) return;
    if (campo.checkValidity?.()) limpiarCampo(campo);
  };
  const alEnviar = (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement) || !form.matches("form[data-validar]")) return;
    if (!validarYMostrar(form)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  };
  document.addEventListener("input", alEscribir, true);
  document.addEventListener("submit", alEnviar, true);
  registrarDestructor(raiz, () => {
    document.removeEventListener("input", alEscribir, true);
    document.removeEventListener("submit", alEnviar, true);
    escucharActivo = false;
  });
}
function ponerCargando(boton) {
  boton.dataset.cargando = "";
  boton.setAttribute("aria-busy", "true");
  boton.disabled = true;
}
function quitarCargando(boton) {
  delete boton.dataset.cargando;
  boton.removeAttribute("aria-busy");
  boton.disabled = false;
}

// src/js/seleccion.ts
function esSeleccionable(fila) {
  if (fila.disabled || fila.hidden) return false;
  const tr = fila.closest("tr");
  if (!tr || tr.hidden) return false;
  const estilo = getComputedStyle(tr);
  return estilo.display !== "none" && estilo.visibility !== "hidden";
}
function iniciarSeleccionTabla(raiz = document) {
  raiz.querySelectorAll("table[data-seleccion]").forEach((tabla) => {
    if (!primeraVez(tabla, "seleccion-tabla")) return;
    const todo = tabla.querySelector("[data-seleccionar-todo]");
    const filas = () => Array.from(tabla.querySelectorAll("[data-seleccionar-fila]")).filter(esSeleccionable);
    const barra = tabla.dataset.seleccionBarra ? document.querySelector(tabla.dataset.seleccionBarra) : tabla.parentElement?.querySelector(".barra-seleccion") ?? null;
    const emitir = () => {
      const marcadas = filas().filter((f) => f.checked);
      const ids = marcadas.map((f) => f.value);
      tabla.dispatchEvent(
        new CustomEvent("santacorina:seleccion-cambiar", {
          bubbles: true,
          detail: { ids, total: filas().length }
        })
      );
      if (barra) {
        barra.classList.toggle("visible", ids.length > 0);
        const contador = barra.querySelector("[data-seleccion-contador]");
        if (contador) contador.textContent = `${ids.length} seleccionado${ids.length === 1 ? "" : "s"}`;
      }
      if (todo) {
        todo.checked = marcadas.length > 0 && marcadas.length === filas().length;
        todo.indeterminate = marcadas.length > 0 && marcadas.length < filas().length;
      }
    };
    todo?.addEventListener("change", () => {
      filas().forEach((f) => f.checked = todo.checked);
      emitir();
    });
    filas().forEach((f) => f.addEventListener("change", emitir));
    emitir();
  });
}

// src/js/menu.ts
function iniciarMenus(raiz = document) {
  raiz.querySelectorAll("details.menu").forEach((detalle) => {
    if (!primeraVez(detalle, "menu")) return;
    const resumen = detalle.querySelector("summary");
    const panel = detalle.querySelector(".menu-panel");
    if (!resumen || !panel) return;
    panel.setAttribute("role", "menu");
    const items = () => Array.from(panel.querySelectorAll(":scope > a, :scope > button"));
    items().forEach((item) => item.setAttribute("role", "menuitem"));
    let desapilar = null;
    detalle.addEventListener("toggle", () => {
      if (detalle.open) {
        posicionarFlotante(resumen, panel);
        items()[0]?.focus();
        desapilar = apilarCapa(() => {
          detalle.open = false;
        });
      } else {
        desapilar?.();
        desapilar = null;
      }
    });
    panel.addEventListener("keydown", (e) => {
      const lista = items();
      const actual = lista.indexOf(document.activeElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        lista[Math.min(actual + 1, lista.length - 1)]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        lista[Math.max(actual - 1, 0)]?.focus();
      }
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
  iniciarToggletips(raiz);
  iniciarResumenErrores(raiz);
  iniciarTablasOrdenables(raiz);
  iniciarCarruseles(raiz);
  iniciarFormularios(raiz);
  iniciarSeleccionTabla(raiz);
  iniciarMenus(raiz);
}
export {
  abrirModal,
  avanzarCarrusel,
  cerrarModal,
  copiarAlPortapapeles,
  debounce,
  destruirTodo,
  formato_exports as formato,
  iniciarAsistentes,
  iniciarBuscadores,
  iniciarCajones,
  iniciarCalendario,
  iniciarCarruseles,
  iniciarColapsables,
  iniciarCombobox,
  iniciarContadores,
  iniciarFormularios,
  iniciarLateral,
  iniciarMedidorClave,
  iniciarMenus,
  iniciarModales,
  iniciarPopovers,
  iniciarRangoFechas,
  iniciarResumenErrores,
  iniciarSeleccionTabla,
  iniciarTablasOrdenables,
  iniciarTabs,
  iniciarTodo,
  iniciarToggletips,
  iniciarZonasArrastre,
  irAPaso,
  mostrarToast,
  ponerCargando,
  posicionarFlotante,
  quitarCargando
};
