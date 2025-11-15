// --------------------
// DOM ELEMENTS
// --------------------
const welcomeScreen = document.getElementById("welcome");
const earnScreen = document.getElementById("earn");
const investScreen = document.getElementById("invest");
const marketResultsScreen = document.getElementById("market-results");

const earnBtn = document.getElementById("earnBtn");
const investBtn = document.getElementById("investBtn");
const earnNext = document.getElementById("earn-next");
const moneyDisplay = document.getElementById("moneyEarned");
const restartBtn = document.getElementById("restartBtn");

// Market result divs
const resultsUp = document.getElementById("results-up");
const resultsDown = document.getElementById("results-down");
const resultsStable = document.getElementById("results-stable");

// Strategy buttons
const strategyButtons = document.querySelectorAll(".strategy");

// --------------------
// GAME VARIABLES
// --------------------
let totalMoney = 0;
let earnCurrent = 0;

// Replace this with your real 50 questions
const earnQuestions = [
  { question: "Question 1?", choices: ["A", "B", "C", "D"], correct: 0 },
  { question: "Question 2?", choices: ["A", "B", "C", "D"], correct: 1 },
  // ... up to 50
];

function renderEarnQuestion() {
  const q = earnQuestions[earnCurrent];
  document.getElementById("earn-question").textContent = q.question;

  const choicesDiv = document.getElementById("earn-choices");
  choicesDiv.innerHTML = "";

  q.choices.forEach((choice, index) => {
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.textContent = choice;

    btn.addEventListener("click", () => {
      // remove previous selection
      document.querySelectorAll("#earn-choices .choice").forEach(c => c.classList.remove("selected"));
      btn.classList.add("selected");

      // check correct
      if (index === q.correct) {
        totalMoney += 1000;
      }

      moneyDisplay.textContent = totalMoney;
    });

    choicesDiv.appendChild(btn);
  });
}

// --------------------
// BUTTON LISTENERS
// --------------------

// Welcome screen buttons
earnBtn.addEventListener("click", () => {
  welcomeScreen.style.display = "none";
  earnScreen.style.display = "block";
  renderEarnQuestion();
});

investBtn.addEventListener("click", () => {
  welcomeScreen.style.display = "none";
  investScreen.style.display = "block";
});

// Earn Money Next button
earnNext.addEventListener("click", () => {
  earnCurrent++;
  if (earnCurrent < earnQuestions.length) {
    renderEarnQuestion();
  } else {
    // finished earning → go to Invest
    earnScreen.style.display = "none";
    investScreen.style.display = "block";
  }
});

// Investment strategy selection
strategyButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const strategy = btn.dataset.strategy;
    investScreen.style.display = "none";
    marketResultsScreen.style.display = "block";

    // simulate market outcome
    const market = ["up", "down", "stable"][Math.floor(Math.random() * 3)];
    showMarketResult(market, strategy);
  });
});

// --------------------
// SHOW MARKET RESULT
// --------------------
function showMarketResult(market, strategy) {
  // hide all
  resultsUp.style.display = "none";
  resultsDown.style.display = "none";
  resultsStable.style.display = "none";

  if (market === "up") resultsUp.style.display = "block";
  else if (market === "down") resultsDown.style.display = "block";
  else resultsStable.style.display = "block";

  // You can calculate final money here based on strategy & market
  // Example: simple multiplier
  let multiplier = 1;
  if (market === "up") multiplier = 1.2;
  else if (market === "down") multiplier = 0.8;

  const finalMoney = Math.round(totalMoney * multiplier);
  const p = document.createElement("p");
  p.textContent = `You now have $${finalMoney}`;
  marketResultsScreen.appendChild(p);
