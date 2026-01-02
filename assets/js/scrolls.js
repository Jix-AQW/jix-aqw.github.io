let scrollSearch = null;
let scrollRes = null;
let SCROLLS = {};

// ==========================
// LOAD JSON
// ==========================
fetch("/assets/js/scrolls.json")
  .then(r => r.json())
  .then(data => {
    data.forEach(s => SCROLLS[s.name] = s);
  })
  .catch(err => console.error("Erro ao carregar scrolls.json", err));

// ==========================
// FILTER SCROLLS
// ==========================
const filterScrolls = (kill) => {
  const q = scrollSearch.value;
  const list = document.getElementById("scroll-list");

  if (!q || kill) {
    list.innerHTML = "";
    return;
  }

  list.innerHTML = "";

  Object.keys(SCROLLS)
    .filter(s => s.toLowerCase().includes(q.toLowerCase()))
    .sort()
    .forEach(s => {
      list.innerHTML += `
        <div class="pot-item" onclick="showScroll('${s.replace(/'/g, "\\'")}')">
          ${s}
        </div>`;
    });
};

// ==========================
// SHOW SCROLL
// ==========================
const showScroll = (name) => {
  const s = SCROLLS[name];
  if (!s) return;

  filterScrolls(true);
  scrollSearch.value = name;

  scrollRes.innerHTML = `
    <div class="scroll-header">
      ${s.icon ? `<img src="${s.icon}" class="scroll-icon">` : ""}
      <h3>${s.name}</h3>
    </div>

    ${s.notes && s.notes.length ? `
      <h4>Notas</h4>
      <ul class="scroll-notes">
        ${s.notes.map(n => `<li>${n}</li>`).join("")}
      </ul>
    ` : ""}

    ${s.combination_image ? `
      <div class="scroll-combination">
        <h4>Combinação (SpellCraft)</h4>
        <img src="${s.combination_image}" class="combo-img">
      </div>
    ` : "<p>Combinação não encontrada</p>"}

    ${s.source ? `
      <p class="scroll-source">
        Fonte: <a href="${s.source}" target="_blank">AQW Wiki</a>
      </p>
    ` : ""}
  `;
};

// ==========================
// INIT HTML
// ==========================
document.getElementById("scroll-calculator").innerHTML = `
<div class="pot-search-container">
  <input id="scroll-input"
         placeholder="Digite o nome do scroll..."
         onkeyup="filterScrolls()"
         autocomplete="off">

  <div id="scroll-list" class="pot-list"></div>

  <div id="scroll-result" class="result-box">
    <p>Pesquise um scroll para ver o ícone, notas e combinação.</p>
  </div>
</div>
`;

scrollSearch = document.getElementById("scroll-input");
scrollRes = document.getElementById("scroll-result");
