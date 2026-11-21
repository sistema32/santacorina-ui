/**
 * Selector de fecha en grilla visual, anclado a un input de texto -- mismo
 * patron de capa flotante que `.menu`/`.menu-panel`. Agregado preventivo
 * (sin uso real hoy en sgp), pedido explicitamente por el usuario.
 */
import { fechaCorta } from "./formato.js";

const DOW = ["L", "M", "M", "J", "V", "S", "D"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function mismaFecha(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function construirGrilla(
  panel: HTMLElement,
  mesVisible: Date,
  seleccionada: Date | null,
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

export function iniciarCalendario(raiz: ParentNode = document): void {
  raiz.querySelectorAll<HTMLElement>("[data-calendario]").forEach((contenedor) => {
    const input = contenedor.querySelector<HTMLInputElement>("input");
    const panel = contenedor.querySelector<HTMLElement>(".calendario-panel");
    if (!input || !panel) return;

    let seleccionada: Date | null = null;
    let mesVisible = new Date();

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
        },
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
      if (!contenedor.contains(e.target as Node)) cerrar();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") cerrar();
    });
  });
}
