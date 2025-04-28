let calc = document.getElementById("alchemy-calculator");
let potSearch = null;
let poRes = null;

const filterPots = (kill) => {
  let q = potSearch.value;
  const list = document.getElementById("pot-list");
  if (q.length < 1 || kill) {
    list.innerHTML = "";
    return;
  }
  const filt = Object.keys(POTS)
    .filter((p) => p.toUpperCase().includes(q.toUpperCase()))
    .sort();
  list.innerHTML = filt
    .map((p) => `<div class="pot-item" onclick="recipie('${p}')">${p}</div>`)
    .join("");
};

const recipie = (pot) => {
  potSearch.value = pot;
  filterPots(true);
  let result = `<h3>Combinações para <a href="http://aqwwiki.wikidot.com/${encodeURIComponent(pot.replace(/\s/g, '-'))}" target="_blank" class="result-link">${pot}</a></h3><ul>`;
  let rec = POTS[pot];

  let combs = [];
  Object.keys(INGS).forEach((i) => {
    let ing = INGS[i];
    Object.keys(ing.brew).forEach((ru) => {
      if (
        ing.brew[ru].includes(rec.t) &&
        BREWS[ru][rec.t].some((potion) => potion.p === pot)
      ) {
        combs.push(`<li>${ru} Rune: <a href="http://aqwwiki.wikidot.com/${encodeURIComponent(i.replace(/\s/g, '-'))}" target="_blank" class="result-link">${i}</a> + Qualquer outro ingrediente</li>`);
      }
    });
  });

  result += `<li class="rec-colour">Recomendado: ${rec.r} Rune + 
    <a href="http://aqwwiki.wikidot.com/${encodeURIComponent(rec.a.replace(/\s/g, '-'))}" target="_blank" class="result-link">${rec.a}</a> + 
    <a href="http://aqwwiki.wikidot.com/${encodeURIComponent(rec.b.replace(/\s/g, '-'))}" target="_blank" class="result-link">${rec.b}</a></li>`;
  result += combs.join("") + "</ul>";
  poRes.innerHTML = result;
};

calc.innerHTML = `
<div class="pot-search-container">
  <div class="center">
    <div id="pot-dropdown" class="dropdown-content">
      <input id="pot-input" type="text" placeholder="Digite o nome da poção..." onkeyup="filterPots()" autocomplete="off">
      <div id="pot-list" class="pot-list"></div>
    </div>
  </div>
  <div class="result-box" id="po-result">
    <p>Pesquise uma poção para ver as combinações</p>
  </div>
  <div class="hover-tooltip-container">
    <span class="hover-tooltip">?</span>
    <div class="hover-tooltip-box">
      <p>Dica: Comece a digitar o nome da poção para ver sugestões automáticas.</p>
      <p>Resultados recomendados estão marcados em <span class="rec-colour">verde</span>.</p>
    </div>
  </div>
</div>
`;

potSearch = document.getElementById("pot-input");
poRes = document.getElementById("po-result");
