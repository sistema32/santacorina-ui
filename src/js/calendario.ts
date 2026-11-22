/**
 * Selector de fecha en grilla visual, anclado a un input de texto -- mismo
 * patron de capa flotante que `.menu`/`.menu-panel`. Agregado preventivo
 * (sin uso real hoy en sgp), pedido explicitamente por el usuario.
 */
import { fechaCorta } from "./formato.js";
import { posicionarFlotante } from "./flotante.js";
import { activar, apilarCapa, desactivar, primeraVez, registrarDestructor } from "./una-vez.js";

const DOW = ["L", "M", "M", "J", "V", "S", "D"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function mismaFecha(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/**
 * El mes visible SIEMPRE se guarda como el dia 1 de ese mes. Si se
 * guardara con el dia real (ej. 31, el dia que el usuario clickeo o la
 * fecha de hoy), avanzar con `setMonth()` desde un 31 de marzo cae en
 * mayo (abril no tiene 31 dias) -- `setMonth` no trunca, desborda al mes
 * siguiente. Se vio exactamente asi al verificar.
 */
function primerDiaDe(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
}

function construirGrilla(
  panel: HTMLElement,
  mesVisible: Date,
  seleccionada: Date | null,
  focoDia: Date,
  onElegir: (dia: Date) => void,
  onCambiarMes: (mes: Date) => void,
): void {
  panel.innerHTML = "";

  const cabecera = document.createElement("div");
  cabecera.className = "calendario-cabecera";
  const btnAnt = document.createElement("button");
  btnAnt.type = "button";
  btnAnt.className = "calendario-nav";
  btnAnt.textContent = "‹";
  const titulo = document.createElement("span");
  titulo.textContent = `${MESES[mesVisible.getMonth()]} ${mesVisible.getFullYear()}`;
  const btnSig = document.createElement("button");
  btnSig.type = "button";
  btnSig.className = "calendario-nav";
  btnSig.textContent = "›";
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

  const hoy = new Date();
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

const cerrarDe = new WeakMap<HTMLElement, () => void>();

export function iniciarCalendario(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>("[data-calendario]").forEach((contenedor) => {
    if (primeraVez(contenedor, "calendario")) {
      const input = contenedor.querySelector<HTMLInputElement>("input");
      const panel = contenedor.querySelector<HTMLElement>(".calendario-panel");
      if (!input || !panel) return;

      let seleccionada: Date | null = null;
      let mesVisible = primerDiaDe(new Date());
      let focoDia = new Date();

      const enfocarDiaActual = () => {
        panel.querySelector<HTMLElement>(".calendario-dia[tabindex='0']")?.focus();
      };

      let desapilar: (() => void) | null = null;

      const redibujar = () => {
        construirGrilla(panel, mesVisible, seleccionada, focoDia, elegir, cambiarMes);
      };
      const elegir = (dia: Date): void => {
        seleccionada = dia;
        focoDia = dia;
        mesVisible = primerDiaDe(dia);
        input.value = fechaCorta(dia);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        cerrar();
      };
      const cambiarMes = (mes: Date): void => {
        mesVisible = mes;
        redibujar();
      };
      const moverFoco = (delta: number): void => {
        const nuevo = new Date(focoDia);
        nuevo.setDate(nuevo.getDate() + delta);
        focoDia = nuevo;
        mesVisible = primerDiaDe(focoDia);
        redibujar();
        enfocarDiaActual();
      };

      const abrir = () => {
        focoDia = seleccionada ?? new Date();
        mesVisible = primerDiaDe(focoDia);
        redibujar();
        panel.classList.add("visible");
        posicionarFlotante(input, panel);
        enfocarDiaActual();
        desapilar = apilarCapa(() => cerrar(true));
        contenedor.dispatchEvent(new CustomEvent("santacorina:calendario-abrir", { bubbles: true }));
      };
      const cerrar = (devolverFoco = false) => {
        if (!panel.classList.contains("visible")) return;
        panel.classList.remove("visible");
        desapilar?.();
        desapilar = null;
        if (devolverFoco) input.focus();
        contenedor.dispatchEvent(new CustomEvent("santacorina:calendario-cerrar", { bubbles: true }));
      };

      input.addEventListener("click", (e) => {
        e.stopPropagation();
        abrir();
      });
      panel.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); moverFoco(-1); }
        else if (e.key === "ArrowRight") { e.preventDefault(); moverFoco(1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); moverFoco(-7); }
        else if (e.key === "ArrowDown") { e.preventDefault(); moverFoco(7); }
      });
      cerrarDe.set(contenedor, cerrar);
    }

    // Separado del bloque de arriba (que corre una sola vez por
    // elemento): `destruirTodo(raiz)` puede apagar este listener sin
    // que `raiz` se reemplace, y una llamada posterior a
    // `iniciarTodo(raiz)` sobre el MISMO nodo debe poder reactivarlo --
    // `activar`/`desactivar` llevan su propio estado para eso.
    const cerrar = cerrarDe.get(contenedor);
    if (!cerrar || !activar(contenedor, "calendario-doc")) return;
    const alClicAfuera = (e: Event) => {
      if (!contenedor.contains(e.target as Node)) cerrar();
    };
    document.addEventListener("click", alClicAfuera);
    registrarDestructor(raiz, () => {
      document.removeEventListener("click", alClicAfuera);
      desactivar(contenedor, "calendario-doc");
    });
  });
}
