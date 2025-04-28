// alc.js atualizado
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
    .map((p) => `<div onclick="recipie('${p}')">${p}</div>`)
    .join("");
};

const recipie = (pot) => {
  potSearch.value = pot;
  filterPots(true);
  let result = "<h3>Combinações para " + pot + "</h3><ul>";
  let rec = POTS[pot];

  let combs = [];
  Object.keys(INGS).forEach((i) => {
    let ing = INGS[i];
    Object.keys(ing.brew).forEach((ru) => {
      if (
        ing.brew[ru].includes(rec.t) &&
        BREWS[ru][rec.t].map((p) => p.p).includes(pot)
      )
        combs.push(`<li>${ru} Rune: ${i} + Qualquer outro ingrediente</li>`);
    });
  });

  result += `<li class="rec-colour">Recomendado: ${rec.r} Rune + ${rec.a} + ${rec.b}</li>`;
  result += combs.join("") + "</ul>";
  poRes.innerHTML = result;
};

calc.innerHTML = `
<div class="pot-search-container">
  <div class="center">
    <div id="pot-dropdown" class="dropdown-content">
      <input id="pot-input" type="text" placeholder="Digite o nome da poção..." 
             onkeyup="filterPots()" autocomplete="off">
      <div id="pot-list" class="pot-list"></div>
    </div>
  </div>
  <div class="result-box" id="po-result">
    <p>Pesquise uma poção para ver as combinações</p>
  </div>
  <div class="hover-tooltip-area">
    <span class="hover-tooltip center">?</span>
    <div class="hover-tooltip-box">
      <p>Dica: Comece a digitar o nome da poção para ver sugestões automáticas.</p>
      <p>Resultados recomendados estão marcados em <span class="rec-colour">verde</span>.</p>
    </div>
  </div>
</div>
`;

potSearch = document.getElementById("pot-input");
poRes = document.getElementById("po-result");
