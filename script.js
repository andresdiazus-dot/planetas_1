 const GRAVEDAD_TIERRA = 9.81;

const mundos = [
  { id: "mercurio", g: 3.70,  nombre: { es: "Mercurio", en: "Mercury" } },
  { id: "venus",    g: 8.87,  nombre: { es: "Venus",    en: "Venus" } },
  { id: "tierra",   g: 9.81,  nombre: { es: "Tierra",   en: "Earth" } },
  { id: "luna",     g: 1.62,  nombre: { es: "Luna",     en: "Moon" } },
  { id: "marte",    g: 3.71,  nombre: { es: "Marte",    en: "Mars" } },
  { id: "jupiter",  g: 24.79, nombre: { es: "Júpiter",  en: "Jupiter" } },
  { id: "saturno",  g: 10.44, nombre: { es: "Saturno",  en: "Saturn" } },
  { id: "urano",    g: 8.69,  nombre: { es: "Urano",    en: "Uranus" } },
  { id: "neptuno",  g: 11.15, nombre: { es: "Neptuno",  en: "Neptune" } },
  { id: "pluton",   g: 0.62,  nombre: { es: "Plutón",   en: "Pluto" } }
];

const textos = {
  es: {
    titulo: "Báscula cósmica",
    altLogo: "Logo de Báscula Cósmica",
    idioma: "Idioma",
    nav_inicio: "Inicio",
    nav_peso: "Mi peso",
    nav_mundos: "Los mundos",
    label_peso: "Si en la Tierra pesas",
    frase_pre: "En",
    frase_post: "marcarías",
    mundos_titulo: "Compara todos los mundos",
    nota: "Cálculo: peso en el mundo = tu peso en la Tierra × (gravedad del mundo ÷ 9,81).",
    invalido: "Escribe un peso mayor que 0 para ver el resultado.",
    igual: "Igual que en la Tierra",
    menos: (x) => `${x} kg menos que en la Tierra`,
    mas: (x) => `${x} kg más que en la Tierra`,
    gravedad: "gravedad de",
    aria: (n) => `${n} animado`
  },
  en: {
    titulo: "Cosmic Scale",
    altLogo: "Cosmic Scale logo",
    idioma: "Language",
    nav_inicio: "Home",
    nav_peso: "My weight",
    nav_mundos: "The worlds",
    label_peso: "If you weigh on Earth",
    frase_pre: "On",
    frase_post: "you would weigh",
    mundos_titulo: "Compare all the worlds",
    nota: "Formula: weight on the world = your weight on Earth × (world gravity ÷ 9.81).",
    invalido: "Enter a weight greater than 0 to see the result.",
    igual: "Same as on Earth",
    menos: (x) => `${x} kg less than on Earth`,
    mas: (x) => `${x} kg more than on Earth`,
    gravedad: "gravity of",
    aria: (n) => `${n} animated`
  }
};

const $peso = document.getElementById("peso");
const $lista = document.getElementById("lista");
const $nombre = document.getElementById("nombre");
const $resultado = document.getElementById("resultado");
const $detalle = document.getElementById("detalle");
const $escena = document.getElementById("planeta-escena");
const $idiomaBtn = document.getElementById("idioma-btn");
const $idiomaMenu = document.getElementById("idioma-menu");

let seleccionado = "marte";
let idioma = "es";

try {
  const guardado = localStorage.getItem("idioma");
  if (guardado && textos[guardado]) idioma = guardado;
} catch (e) {}

const formato = (n) =>
  n.toLocaleString(idioma, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const formatoGravedad = (n) =>
  n.toLocaleString(idioma, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const pesoEn = (pesoTierra, g) => pesoTierra * (g / GRAVEDAD_TIERRA);

function construirLista() {
  mundos.forEach((m) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button type="button" class="fila" data-mundo="${m.id}" aria-pressed="false">
        <span class="mundo"></span>
        <span class="pista"><span class="barra"></span></span>
        <span class="valor"></span>
      </button>`;
    $lista.appendChild(li);
  });

  $lista.addEventListener("click", (e) => {
    const fila = e.target.closest(".fila");
    if (!fila) return;
    seleccionado = fila.dataset.mundo;
    actualizar();
  });
}

function actualizar() {
  const t = textos[idioma];
  const pesoTierra = parseFloat($peso.value);
  const valido = Number.isFinite(pesoTierra) && pesoTierra > 0;

  const maximo = valido
    ? Math.max(...mundos.map((m) => pesoEn(pesoTierra, m.g)))
    : 1;

  document.querySelectorAll(".fila").forEach((fila) => {
    const m = mundos.find((x) => x.id === fila.dataset.mundo);
    const valor = valido ? pesoEn(pesoTierra, m.g) : 0;
    fila.querySelector(".mundo").textContent = m.nombre[idioma];
    fila.querySelector(".barra").style.width = valido ? `${(valor / maximo) * 100}%` : "0%";
    fila.querySelector(".valor").textContent = valido ? `${formato(valor)} kg` : "—";
    fila.setAttribute("aria-pressed", String(m.id === seleccionado));
  });

  const m = mundos.find((x) => x.id === seleccionado);
  const nombreMundo = m.nombre[idioma];

  $nombre.textContent = nombreMundo;
  $escena.className = "planeta-escena " + m.id;
  $escena.setAttribute("aria-label", t.aria(nombreMundo));

  if (!valido) {
    $resultado.textContent = "—";
    $detalle.textContent = t.invalido;
    return;
  }

  const valor = pesoEn(pesoTierra, m.g);
  const dif = valor - pesoTierra;
  $resultado.textContent = formato(valor);

  let comparacion;
  if (Math.abs(dif) < 0.05) comparacion = t.igual;
  else if (dif < 0) comparacion = t.menos(formato(Math.abs(dif)));
  else comparacion = t.mas(formato(dif));

  $detalle.textContent = `${comparacion} · ${t.gravedad} ${formatoGravedad(m.g)} m/s²`;
}

function aplicarIdioma(nuevo) {
  idioma = nuevo;
  const t = textos[idioma];

  document.documentElement.lang = idioma;
  document.title = t.titulo;
  document.getElementById("logo").alt = t.altLogo;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t[el.dataset.i18n];
  });

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === idioma));
  });

  try { localStorage.setItem("idioma", idioma); } catch (e) {}

  actualizar();
}

/* ---------- Menú de idioma ---------- */
function abrirMenu(abrir) {
  $idiomaMenu.hidden = !abrir;
  $idiomaBtn.setAttribute("aria-expanded", String(abrir));
}

$idiomaBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  abrirMenu($idiomaMenu.hidden);
});

$idiomaMenu.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-lang]");
  if (!btn) return;
  aplicarIdioma(btn.dataset.lang);
  abrirMenu(false);
});

document.addEventListener("click", () => abrirMenu(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") abrirMenu(false);
});

$peso.addEventListener("input", actualizar);

construirLista();
aplicarIdioma(idioma);