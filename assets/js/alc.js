let calc = document.getElementById("alchemy-calculator");
let choiceBox = null;
let potSearch = null;
let selBox = null;
let inRes = null;
let poRes = null;
let tab = null;

let rune = null;
let ings = [null, null];
let ci = 0;
let cuTab = 0;

const tabSwap = (tab) => {
  if (cuTab == tab) return;
  cuTab = tab;
  calc
    .querySelectorAll(".choose-type > h3")
    .forEach((e) => e.classList.toggle("selected"));
  [...sellers.children].forEach((e) => e.classList.toggle("hidden"));
};

const sortByRates = (pots) =>
  Object.keys(pots)
    .map((p) => [p, pots[p]])
    .sort((i, j) => j[1] - i[1]);

const brew = () => {
  if (rune == null || ings[0] == null || ings[1] == null) {
    inRes.innerHTML = "<ul><li>Choose your ingredients</li></ul>";
    return null;
  } else if (ings[0] == ings[1]) {
    inRes.innerHTML = "<ul><li>Your ingredients must be different</li></ul>";
    return null;
  }

  const iA = INGS[ings[0]];
  const iB = INGS[ings[1]];

  const choices = [...iA.brew[rune], ...iB.brew[rune]];
  const qn = choices.length;
  let potRates = {};
  choices
    .map((typ) => BREWS[rune][typ])
    .forEach((pot_list) => {
      const pn = pot_list.length;
      pot_list.forEach((pot) => {
        const pot_q = `${pot.p} x${pot.q}`;
        const r = potRates[pot_q] || 0;
        potRates[pot_q] = r + 1 / pn / qn;
      });
    });
  let result =
    "<ul>" +
    sortByRates(potRates)
      .map((pot) => `<li>${pot[0]} <span class="rec" onclick="viewRec('${pot[0]}')">+</span></li>`)
      .join("\n") +
    "</ul>";
  inRes.innerHTML = result;

  return sortByRates(potRates);
};

const selectRune = (el) => {
  tab = el;
  ingBox
    .querySelectorAll(".selected")
    .forEach((e) => e.classList.toggle("selected"));
  el.classList.toggle("selected");

  choiceBox.innerHTML = RUNES.map(
    (r) =>
      `<div class="choice button ${
        r == rune ? "selected" : ""
      }" onclick="chooseRune('${r}', this)">${r}</div>`
  ).join("\n");
};

const chooseRune = (r, el) => {
  choiceBox
    .querySelectorAll(".selected")
    .forEach((e) => e.classList.toggle("selected"));
  rune = r;
  tab.innerHTML = r + " Rune";
  el.classList.toggle("selected");
  brew();
};

const selectIng = (n, el) => {
  tab = el;
  ingBox
    .querySelectorAll(".selected")
    .forEach((e) => e.classList.toggle("selected"));
  el.classList.toggle("selected");

  ci = n;
  choiceBox.innerHTML = Object.keys(INGS)
    .map(
      (ing) =>
        `<div class="choice button ${
          ing == ings[ci] ? "selected" : ""
        }" onclick="chooseIng('${ing}', this)">${ing}</div>`
    )
    .join("\n");
};

const chooseIng = (ing, el) => {
  choices
    .querySelectorAll(".selected")
    .forEach((e) => e.classList.toggle("selected"));
  ings[ci] = ing;
  tab.innerHTML = ing;
  el.classList.toggle("selected");
  brew();
};

const filterPots = (kill) => {
  let q = potSearch.value;
  const list = document.getElementById("pot-list");
  if (q.length < 3 || kill) {
    list.innerHTML = "";
    return;
  }
  const filt = Object.keys(POTS)
    .filter((p) => p.toUpperCase().includes(q.toUpperCase()))
    .sort();
  list.innerHTML = filt
    .map((p) => `<div onclick="recipie('${p}')">${p}</div>`)
    .join("");
  if (filt.length == 1) recipie(filt[0]);
};

const viewRec = (pot) => {
  tabSwap(1);
  recipie(pot.substring(0, pot.length - 3));
};

const recipie = (pot) => {
  potSearch.value = pot;
  filterPots(true);
  let result = "<ul>";
  let rec = POTS[pot];

  let combs = [];
  Object.keys(INGS).forEach((i) => {
    let ing = INGS[i];
    Object.keys(ing.brew).forEach((ru) => {
      if (
        ing.brew[ru].includes(rec.t) &&
        BREWS[ru][rec.t].map((p) => p.p).includes(pot)
      )
        combs.push(`${ru} Rune: ${i} + Any`);
    });
  });

  result += `<li class="rec-colour">${rec.r} Rune: ${rec.a} + ${rec.b}`;
  result += combs.map((c) => `<li>${c}</li>`).join("\n") + "</ul>";
  poRes.innerHTML = result;
};

calc.innerHTML = `
<div class="choose-type">
  <h3 class="type selected" onclick="tabSwap(0)">Ingredients</h3>
  <h3 class="type" onclick="tabSwap(1)">Potion</h3>
</div>
<div id="sellers">
  <div id="ing-sel">
    <div class="choice-box">
      <div id="ingredients" class="ingredients button-box">
        <div class="ingredient button" onclick="selectRune(this)">Rune</div>
        <div class="ingredient button" onclick="selectIng(0, this)">Ingredient 1</div>
        <div class="ingredient button" onclick="selectIng(1, this)">Ingredient 2</div>
      </div>
      <div id="choices" class="choices button-box"></div>
    </div>
    <hr class="divider"/>
    <div class="result-head">
      <h2 class="header">Brew Result</h2> 
      <div class="hover-tooltip-area">
        <span class="hover-tooltip center">?</span>
        <div class="hover-tooltip-box">
          <p>
            You will brew one of the following items.
            The list of results is sorted in estimated* order from most likely to
            least likely of brewing them.
          </p>
          <p style="font-size:75%">* Estimated rates are a result of guesswork and may not be accurate.</p>
        </div>
      </div>
    </div>
    <div class="result-box" id="in-result">
      <ul><li>Choose your ingredients</li></ul>
    </div>
  </div>
  <div id="pot-sel" class="hidden">
    <div class="center">
      <div id="pot-dropdown" class="dropdown-content">
        <input id="pot-input" type="text" placeholder="Search Potion Name" onkeyup="filterPots()">
        <div id="pot-list" class="pot-list"></div>
      </div>
    </div>
    <hr class="divider"/>
    <div class="result-head">
      <h2 class="header">Combinations</h2> 
      <div class="hover-tooltip-area">
        <span class="hover-tooltip center">?</span>
        <div class="hover-tooltip-box">
          <p>
            The recommended ingredients are highlighted in <span class="rec-colour">green</span>.
            These are chosen based on the estimated* brew rates and do not
            take into account ease of success. Note that the recommended
            ingredients may still have a low brew rate. Order of ingredients
            do not matter.
          </p>
          <p style="font-size:75%">* Estimated rates are a result of guesswork and may not be accurate.</p>
        </div>
      </div>
    </div>
    <div class="result-box" id="po-result">
      <ul><li>Choose your potion</li></ul>
    </div>
  </div>
</div>
`;
choiceBox = document.getElementById("choices");
selBox = document.getElementById("sellers");
ingBox = document.getElementById("ingredients");
inRes = document.getElementById("in-result");
poRes = document.getElementById("po-result");
potSearch = document.getElementById("pot-input");

selectRune(ingBox.children[0]);
