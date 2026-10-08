const GRAVEDAD_TIERRA = 9.81;

const mundos = [
  { nombre: "Mercurio", g: 3.70 },
  { nombre: "Venus",    g: 8.87 },
  { nombre: "Tierra",   g: 9.81 },
  { nombre: "Luna",     g: 1.62 },
  { nombre: "Marte",    g: 3.71 },
  { nombre: "Júpiter",  g: 24.79 },
  { nombre: "Saturno",  g: 10.44 },
  { nombre: "Urano",    g: 8.69 },
  { nombre: "Neptuno",  g: 11.15 },
  { nombre: "Plutón",   g: 0.62 }
];

const $peso = document.getElementById("peso");
const $lista = document.getElementById("lista");
const $nombre = document.getElementById("nombre");
const $resultado = document.getElementById("resultado");
const $detalle = document.getElementById("detalle");

let seleccionado = "Marte";

const formato = (n) =>
  n.toLocaleString("es", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const pesoEn = (pesoTierra, g) => pesoTierra * (g / GRAVEDAD_TIERRA);

function construirLista() {
  mundos.forEach((m) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button type="button" class="fila" data-mundo="${m.nombre}" aria-pressed="false">
        <span class="mundo">${m.nombre}</span>
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
  const pesoTierra = parseFloat($peso.value);
  const valido = Number.isFinite(pesoTierra) && pesoTierra > 0;

  const maximo = valido
    ? Math.max(...mundos.map((m) => pesoEn(pesoTierra, m.g)))
    : 1;

  document.querySelectorAll(".fila").forEach((fila) => {
    const m = mundos.find((x) => x.nombre === fila.dataset.mundo);
    const valor = valido ? pesoEn(pesoTierra, m.g) : 0;
    fila.querySelector(".barra").style.width = valido ? `${(valor / maximo) * 100}%` : "0%";
    fila.querySelector(".valor").textContent = valido ? `${formato(valor)} kg` : "—";
    fila.setAttribute("aria-pressed", String(m.nombre === seleccionado));
  });

  const m = mundos.find((x) => x.nombre === seleccionado);
  $nombre.textContent = m.nombre;

  if (!valido) {
    $resultado.textContent = "—";
    $detalle.textContent = "Escribe un peso mayor que 0 para ver el resultado.";
    return;
  }

  const valor = pesoEn(pesoTierra, m.g);
  const dif = valor - pesoTierra;
  $resultado.textContent = formato(valor);

  let comparacion;
  if (Math.abs(dif) < 0.05) comparacion = "Igual que en la Tierra";
  else if (dif < 0) comparacion = `${formato(Math.abs(dif))} kg menos que en la Tierra`;
  else comparacion = `${formato(dif)} kg más que en la Tierra`;

  $detalle.textContent = `${comparacion} · gravedad de ${m.g.toLocaleString("es")} m/s²`;
}

$peso.addEventListener("input", actualizar);

construirLista();
actualizar();