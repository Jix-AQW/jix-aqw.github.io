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
const getSearchableText = (scroll) => {
  let text = "";

  // Nome
  if (scroll.name) text += scroll.name + " ";

  // Campos simples
  if (scroll.description) text += scroll.description + " ";
  if (scroll.type) text += scroll.type + " ";
  if (scroll.location) text += scroll.location + " ";
  if (scroll.price) text += scroll.price + " ";
  if (scroll.sellback) text += scroll.sellback + " ";
  if (scroll.required_item) text += scroll.required_item + " ";

  // Notas (array)
  if (Array.isArray(scroll.notes)) {
    text += scroll.notes.join(" ") + " ";
  }

  return text.toLowerCase();
};

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
  
  const query = q.toLowerCase();

  const filtered = Object.values(SCROLLS)
    .filter(scroll => getSearchableText(scroll).includes(query))
    .map(scroll => scroll.name)
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
// FUNÇÃO PARA CRIAR LINK DE ITEM
// ==========================
const createItemLink = (itemName) => {
  if (!itemName || itemName === "N/A") return itemName;
  
  const encodedName = encodeURIComponent(itemName.replace(/\s/g, '-'));
  return `<a href="http://aqwwiki.wikidot.com/${encodedName}" target="_blank" class="result-link">${itemName}</a>`;
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

  // Descrição
  if (s.description) {
    html += `<p><strong>Descrição:</strong> ${s.description}</p>`;
  }

  // Tipo
  if (s.type) {
    html += `<p><strong>Tipo:</strong> ${s.type}</p>`;
  }

  // Localização
  if (s.location && s.location !== "N/A" && s.location !== "") {
    html += `<p><strong>Localização:</strong> ${s.location}</p>`;
  }

  // Preço
  if (s.price && s.price !== "N/A" && s.price !== "") {
    html += `<p><strong>Preço:</strong> ${s.price}</p>`;
  }

  // Sellback
  if (s.sellback && s.sellback !== "N/A") {
    html += `<p><strong>Venda:</strong> ${s.sellback}</p>`;
  }

  // Required Item com link para a wiki
  if (s.required_item && s.required_item !== "N/A") {
    html += `<p><strong>Item necessário:</strong> ${createItemLink(s.required_item)}</p>`;
  }

  // Notas
  if (s.notes && s.notes.length) {
    html += `
      <h4>Notas</h4>
      <ul class="scroll-notes">
        ${s.notes.map(n => `<li>${n}</li>`).join("")}
      </ul>
    `;
  }

  // Imagem de combinação
  if (s.combination_image) {
    html += `
      <div class="scroll-combination">
        <h4>Combinação (SpellCraft)</h4>
        <img src="${s.combination_image}" class="combo-img">
      </div>
    `;
  }

  // Fonte
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
    <p>Pesquise um scroll para ver o ícone, notas, combinação e detalhes.</p>
  </div>
  
  <div class="hover-tooltip-container">
    <span class="hover-tooltip">?</span>
    <div class="hover-tooltip-box">
      <p>Dica: Comece a digitar o nome do scroll para ver sugestões automáticas.</p>
      <p>Clique em uma sugestão para ver detalhes completos.</p>
      <p>Itens necessários possuem link direto para a AQW Wiki.</p>
    </div>
  </div>
</div>
`;

scrollSearch = document.getElementById("scroll-input");
scrollRes = document.getElementById("scroll-result");
scrollList = document.getElementById("scroll-list");
