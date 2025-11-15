// --------------------
// DOM ELEMENTS
// --------------------
const welcomeScreen = document.getElementById("welcome");
const level1Screen = document.getElementById("level1");
const level2Screen = document.getElementById("level2");
const level3Screen = document.getElementById("level3");
const resultsScreen = document.getElementById("results");

const startBtn = document.getElementById("startBtn");
const l1Next = document.getElementById("l1-next");
const l2Next = document.getElementById("l2-next");
const finishBtn = document.getElementById("finishBtn");
const restartBtn = document.getElementById("restartBtn");

// --------------------
// SCORES
// --------------------
let level1Score = 0;
let level2Score = 0;
let portfolio = { stocks: 0, bonds: 0, cash: 0 };

// --------------------
// LEVEL 1 QUESTIONS
// --------------------
const level1Questions = [
  {
    question: "Which investment generally has the highest long-term return?",
    choices: ["Savings Account", "Stocks", "Bonds", "Cash under mattress"],
    correct: 1
  },
  {
    question: "What does diversification mean?",
    choices: [
      "Putting all money in one stock",
      "Investing in multiple asset types",
      "Spending money quickly",
      "Avoiding investments completely"
    ],
    correct: 1
  }
];

let l1Current = 0;

function renderLevel1() {
  const q = level1Questions[l1Current];
  document.getElementById("l1-question").textContent = q.question;

  const choicesDiv = document.getElementById("l1-choices");
  choicesDiv.innerHTML = "";

  q.choices.forEach((choice, index) => {
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.textContent = choice;

    btn.addEventListener("click", () => {
      // remove previous selection
      const allChoices = document.querySelectorAll("#l1-choices .choice");
      allChoices.forEach(c => c.classList.remove("selected"));

      // highlight clicked choice
      btn.classList.add("selected");

      // update score
      level1Score = (index === q.correct) ? 1 : 0;
    });

    choicesDiv.appendChild(btn);
  });
}

// --------------------
// LEVEL 2 QUESTIONS
// --------------------
const level2Questions = [
  {
    question: "What happens to stock prices during a market downturn?",
    choices: ["They rise rapidly", "They fall", "They stay the same", "They disappear"],
    correct: 1
  },
  {
    question: "Behavioral finance studies:",
    choices: ["How markets move mechanically", "Investor emotions and biases", "Company profits", "Government policies"],
    correct: 1
  }
];

let l2Current = 0;

function renderLevel2() {
  const q = level2Questions[l2Current];
  document.getElementById("l2-question").textContent = q.question;

  const choicesDiv = document.getElementById("l2-choices");
  choicesDiv.innerHTML = "";

  q.choices.forEach((choice, index) => {
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.textContent = choice;

    btn.addEventListener("click", () => {
      const allChoices = document.querySelectorAll("#l2-choices .choice");
      allChoices.forEach(c => c.classList.remove("selected"));

      btn.classList.add("selected");

      level2Score = (index === q.correct) ? 1 : 0;
    });

    choicesDiv.appendChild(btn);
  });
}

// --------------------
// LEVEL 3 — Portfolio Management
// --------------------
function renderLevel3() {
  document.getElementById("l3-question").textContent = "Allocate 100 points among Stocks, Bonds, and Cash.";
  const choicesDiv = document.getElementById("l3-choices");
  choicesDiv.innerHTML = `
    Stocks: <input type="number" id="input-stocks" min="0" max="100" value="50"> <br><br>
    Bonds: <input type="number" id="input-bonds" min="0" max="100" value="30"> <br><br>
    Cash: <input type="number" id="input-cash" min="0" max="100" value="20">
  `;
}

// --------------------
// SHOW RESULTS
// --------------------
function showResults() {
  const totalScore = level1Score + level2Score;
  document.getElementById("scoreDisplay").textContent = totalScore;

  let type = "";
  if (portfolio.stocks >= 60) type = "Aggressive Investor";
  else if (portfolio.stocks >= 30) type = "Balanced Investor";
  else type = "Conservative Investor";

  document.getElementById("investorType").textContent = type;

  const tipsList = document.getElementById("tipsList");
  tipsList.innerHTML = "";
  const tips = [
    "Review your diversification regularly.",
    "Consider long-term goals over short-term trends.",
    "Always maintain an emergency cash reserve."
  ];
  tips.forEach(tip => {
    const li = document.createElement("li");
    li.textContent = tip;
    tipsList.appendChild(li);
  });
}

// --------------------
// BUTTON EVENT LISTENERS
// --------------------

// Start Game
startBtn.addEventListener("click", () => {
  welcomeScreen.style.display = "none";
  level1Screen.style.display = "block";
  renderLevel1();
});

// Level 1 Next
l1Next.addEventListener("click", () => {
  level1Screen.style.display = "none";
  level2Screen.style.display = "block";
  renderLevel2();
});

// Level 2 Next
l2Next.addEventListener("click", () => {
  level2Screen.style.display = "none";
  level3Screen.style.display = "block";
  renderLevel3();
});

// Finish — Update Portfolio & Show Results
finishBtn.addEventListener("click", () => {
  const stocksVal = parseInt(document.getElementById("input-stocks").value) || 0;
  const bondsVal = parseInt(document.getElementById("input-bonds").value) || 0;
  const cashVal = parseInt(document.getElementById("input-cash").value) || 0;

  const total = stocksVal + bondsVal + cashVal || 1; // avoid divide by zero

  portfolio.stocks = Math.round((stocksVal / total) * 100);
  portfolio.bonds = Math.round((bondsVal / total) * 100);
  portfolio.cash = Math.round((cashVal / total) * 100);

  // Update bars visually
  document.getElementById("bar-stock").style.width = portfolio.stocks + "%";
  document.getElementById("bar-bonds").style.width = portfolio.bonds + "%";
  document.getElementById("bar-cash").style.width = portfolio.cash + "%";

  level3Screen.style.display = "none";
  resultsScreen.style.display = "block";

  showResults();
});

// Restart
restartBtn.addEventListener("click", () => {
  resultsScreen.style.display = "none";
  welcomeScreen.style.display = "block";
});
