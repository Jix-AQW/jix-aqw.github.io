let scrollSearch = null;
let scrollRes = null;
let scrollList = null;
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
  const q = scrollSearch.value.trim();
  
  if (kill) {
    scrollList.classList.remove("active");
    scrollList.innerHTML = "";
    return;
  }
  
  if (!q) {
    scrollList.classList.remove("active");
    scrollList.innerHTML = "";
    return;
  }
  
  const filtered = Object.keys(SCROLLS)
    .filter(s => s.toLowerCase().includes(q.toLowerCase()))
    .sort();
  
  scrollList.innerHTML = filtered
    .map(s => `<div class="pot-item" onclick="selectScroll('${s.replace(/'/g, "\\'")}')">${s}</div>`)
    .join("");
  
  scrollList.classList.add("active");
};

const selectScroll = (name) => {
  scrollSearch.value = name;
  filterScrolls(true);
  showScroll(name);
};

// ==========================
// SHOW SCROLL
// ==========================
const showScroll = (name) => {
  const s = SCROLLS[name];
  if (!s) return;

  let html = `
    <div class="scroll-header">
      ${s.icon ? `<img src="${s.icon}" class="scroll-icon">` : ""}
      <h3>${s.name}</h3>
    </div>
  `;

  if (s.notes && s.notes.length) {
    html += `
      <h4>Notas</h4>
      <ul class="scroll-notes">
        ${s.notes.map(n => `<li>${n}</li>`).join("")}
      </ul>
    `;
  }

  if (s.combination_image) {
    html += `
      <div class="scroll-combination">
        <h4>Combinação (SpellCraft)</h4>
        <img src="${s.combination_image}" class="combo-img">
      </div>
    `;
  } else {
    html += `<p>Combinação não encontrada</p>`;
  }

  if (s.source) {
    html += `
      <p class="scroll-source">
        Fonte: <a href="${s.source}" target="_blank" class="result-link">AQW Wiki</a>
      </p>
    `;
  }

  scrollRes.innerHTML = html;
};

// Fechar lista ao clicar fora
document.addEventListener("click", (e) => {
  if (!e.target.closest("#scroll-dropdown")) {
    scrollList.classList.remove("active");
  }
});

// ==========================
// INIT HTML
// ==========================
document.getElementById("scroll-calculator").innerHTML = `
<div class="pot-search-container">
  <div id="scroll-dropdown" class="dropdown-content">
    <input id="scroll-input" class="pot-input" placeholder="Digite o nome do scroll..." onkeyup="filterScrolls()" autocomplete="off">
    <div id="scroll-list" class="pot-list"></div>
  </div>
  
  <div id="scroll-result" class="result-box">
    <p>Pesquise um scroll para ver o ícone, notas e combinação.</p>
  </div>
  
  <div class="hover-tooltip-container">
    <span class="hover-tooltip">?</span>
    <div class="hover-tooltip-box">
      <p>Dica: Comece a digitar o nome do scroll para ver sugestões automáticas.</p>
      <p>Clique em uma sugestão para ver detalhes completos.</p>
    </div>
  </div>
</div>
`;

scrollSearch = document.getElementById("scroll-input");
scrollRes = document.getElementById("scroll-result");
scrollList = document.getElementById("scroll-list");