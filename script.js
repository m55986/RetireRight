// script.js - Full game with progress bar, deterministic market choice (Option A),
// persistence via localStorage, Earn -> Invest flows (Rule110 / Bucket / DCA).

// -------------------- DOM ELEMENTS --------------------
const welcomeScreen = document.getElementById("welcome");
const earnScreen = document.getElementById("earn");
const investScreen = document.getElementById("invest");
const marketResultsScreen = document.getElementById("market-results");

const earnBtn = document.getElementById("earnBtn");
const investBtn = document.getElementById("investBtn");
const earnNext = document.getElementById("earn-next");
const moneyDisplay = document.getElementById("moneyEarned");
const restartBtn = document.getElementById("restartBtn");

const resultsUp = document.getElementById("results-up");
const resultsDown = document.getElementById("results-down");
const resultsStable = document.getElementById("results-stable");

// progress bar
const progressBarEl = document.getElementById("progress-bar");

// -------------------- GAME STATE & PERSISTENCE --------------------
let totalMoney = Number(localStorage.getItem("rsi_totalMoney") || 0);
let earnCurrent = 0;
let answered = false;
let lastInvestDetails = null; // store last investment inputs for result calculation

// initialize displayed money on page load
moneyDisplay.textContent = totalMoney.toString();

// -------------------- QUESTION BANK --------------------
// Use the question array you provided earlier. (I've included the set you gave.)
const earnQuestions = [
  {
    question: "What is the primary goal of investing?",
    choices: [
      "Maximizing debt",
      "Protecting capital while generating returns",
      "Avoiding all financial risk",
      "Increasing taxes"
    ],
    correct: 1
  },
  {
    question: "Why is investing important for financial goals?",
    choices: [
      "It guarantees high profits",
      "It eliminates financial risk",
      "It helps money grow over time",
      "It is required by law"
    ],
    correct: 2
  },
  {
    question: "Which investment type typically has the lowest risk and return?",
    choices: [
      "Stocks",
      "Bonds",
      "Real estate",
      "Savings accounts"
    ],
    correct: 3
  },
  {
    question: "Stocks generally offer:",
    choices: [
      "No risk and low return",
      "High risk and potentially higher return",
      "Guaranteed income",
      "No volatility"
    ],
    correct: 1
  },
  {
    question: "A key first step in starting an investment program is:",
    choices: [
      "Borrowing money to invest",
      "Organizing your budget",
      "Buying as many stocks as possible",
      "Selling your emergency fund"
    ],
    correct: 1
  },
  {
    question: "An emergency fund should exist to:",
    choices: [
      "Replace retirement savings",
      "Pay for regular expenses",
      "Cover unexpected costs",
      "Invest in speculative assets"
    ],
    correct: 2
  },
  {
    question: "ROI (Return on Investment) is calculated using:",
    choices: [
      "(Cost ÷ Profit) × 100",
      "(Return ÷ Value at start of period) × 100",
      "(Value at end ÷ Initial investment)",
      "(Risk ÷ Reward) × 100"
    ],
    correct: 1
  },
  {
    question: "Expected return is based on:",
    choices: [
      "Guesswork alone",
      "Historical prices only",
      "A probability distribution of potential returns",
      "Interest rates alone"
    ],
    correct: 2
  },
  {
    question: "Speculative investments like cryptocurrencies usually rely on:",
    choices: [
      "Dividends",
      "Guaranteed interest",
      "Capital gains only",
      "Government protection"
    ],
    correct: 2
  },
  {
    question: "Market interest rates mainly affect:",
    choices: [
      "Only stock prices",
      "Only real estate values",
      "Returns on bonds and fixed-income securities",
      "Insurance premiums"
    ],
    correct: 2
  },
  {
    question: "What primarily determines market interest rates?",
    choices: [
      "Employee wages",
      "Supply and demand for loanable funds",
      "Government elections",
      "Corporate advertising"
    ],
    correct: 1
  },
  {
    question: "The Official Cash Rate (OCR) is used to:",
    choices: [
      "Increase government spending",
      "Influence market interest rates and inflation",
      "Set tax rates",
      "Determine stock prices"
    ],
    correct: 1
  },
  {
    question: "When interest rates rise, bond prices typically:",
    choices: [
      "Rise",
      "Fall",
      "Stay the same",
      "Become unpredictable"
    ],
    correct: 1
  },
  {
    question: "Risk in investments refers to:",
    choices: [
      "The guarantee of loss",
      "The potential for returns to differ from expectations",
      "The ability to eliminate market volatility",
      "A government-protected outcome"
    ],
    correct: 1
  },
  {
    question: "Standard deviation measures:",
    choices: [
      "Investor confidence",
      "Average return",
      "Volatility of returns",
      "Expected dividends"
    ],
    correct: 2
  },
  {
    question: "Inflation risk refers to:",
    choices: [
      "The chance inflation will lower purchasing power",
      "Rising house prices",
      "High stock market returns",
      "Market interest rates decreasing"
    ],
    correct: 0
  },
  {
    question: "Unsystematic risk can be reduced through:",
    choices: [
      "Diversification",
      "Raising interest rates",
      "Investing only in one company",
      "Increasing leverage"
    ],
    correct: 0
  },
  {
    question: "Systematic risk is:",
    choices: [
      "Eliminated through diversification",
      "Unique to individual firms",
      "Market-wide risk that cannot be diversified away",
      "Caused by poor management"
    ],
    correct: 2
  },
  {
    question: "A well-diversified portfolio usually contains:",
    choices: [
      "1–3 stocks",
      "12–30 stocks",
      "100–300 stocks",
      "No more than 5 stocks"
    ],
    correct: 1
  },
  {
    question: "The two-fund theorem states that any risk-return combination can be created using:",
    choices: [
      "Cash and real estate",
      "Stocks and bonds only",
      "A risk-free asset and a market portfolio",
      "Cryptocurrencies and commodities"
    ],
    correct: 2
  },
  {
    question: "The Security Market Line (SML) plots:",
    choices: [
      "Return vs. inflation",
      "Diversification vs. risk",
      "Expected return vs. risk (beta)",
      "Capital gains vs. dividends"
    ],
    correct: 2
  },
  {
    question: "A security above the SML is considered:",
    choices: [
      "Overpriced",
      "Underpriced",
      "Fairly priced",
      "Risk-free"
    ],
    correct: 1
  },
  {
    question: "According to the Efficient Market Hypothesis (EMH), stock prices:",
    choices: [
      "Can be easily predicted",
      "Reflect all available information",
      "Are always undervalued",
      "Ignore new information"
    ],
    correct: 1
  },
  {
    question: "Weak-form EMH states that:",
    choices: [
      "Insider information is reflected in prices",
      "Past prices cannot help predict future prices",
      "All information is already priced in",
      "Markets are always irrational"
    ],
    correct: 1
  },
  {
    question: "Which strategy involves investing a fixed amount at regular intervals?",
    choices: [
      "Short selling",
      "Market timing",
      "Dollar-cost averaging",
      "Leveraged investing"
    ],
    correct: 2
  },
  {
    question: "Buy-and-hold investing encourages:",
    choices: [
      "Frequent trading",
      "Long-term ownership of assets",
      "Avoiding market fluctuations at all cost",
      "Predicting short-term movements"
    ],
    correct: 1
  },
  {
    question: "Conservative investors typically focus on:",
    choices: [
      "Maximum capital growth",
      "High volatility",
      "Capital preservation and income",
      "High-risk opportunities"
    ],
    correct: 2
  },
  {
    question: "Passive investors usually:",
    choices: [
      "Actively trade daily",
      "Rely on professional management and hold long-term",
      "Take large speculative positions",
      "Avoid diversification"
    ],
    correct: 1
  },
  {
    question: "Business risk relates to:",
    choices: [
      "Government taxes",
      "Company operations and performance",
      "Interest rate changes only",
      "Inflation rates"
    ],
    correct: 1
  },
  {
    question: "Higher expected returns generally come with:",
    choices: [
      "Lower risk",
      "Higher risk",
      "No risk",
      "Guaranteed returns"
    ],
    correct: 1
  }
];

// -------------------- Helpers --------------------
function showScreen(showEl) {
  [welcomeScreen, earnScreen, investScreen, marketResultsScreen].forEach(el => el.style.display = "none");
  showEl.style.display = "block";
}

function updateProgressBar() {
  if (!progressBarEl) return;
  const percent = ((earnCurrent + 1) / earnQuestions.length) * 100;
  progressBarEl.style.width = Math.min(100, percent) + "%";
}

function saveMoney() {
  localStorage.setItem("rsi_totalMoney", String(totalMoney));
}

// -------------------- RENDER EARN QUESTION --------------------
function renderEarnQuestion() {
  if (earnCurrent < 0) earnCurrent = 0;
  const choicesDiv = document.getElementById("earn-choices");
  choicesDiv.innerHTML = "";

  if (earnCurrent >= earnQuestions.length) {
    // finished all questions
    document.getElementById("earn-question").textContent = "You've completed all questions.";
    appendMessage(choicesDiv, "You've completed all questions. You can Exit to the menu or go Invest from the menu.", "info");
    answered = true;
    updateProgressBar();
    return;
  }

  const q = earnQuestions[earnCurrent];
  document.getElementById("earn-question").textContent = `Q${earnCurrent + 1}. ${q.question}`;

  answered = false; // must answer before moving on
  q.choices.forEach((choiceText, index) => {
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.tabIndex = 0;
    btn.textContent = choiceText;

    btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;

      // mark selection
      choicesDiv.querySelectorAll(".choice").forEach(c => c.classList.remove("selected"));
      btn.classList.add("selected");

      const feedback = document.createElement("p");
      feedback.className = "feedback";

      if (index === q.correct) {
        totalMoney += 1000;
        feedback.textContent = "Correct! +$1000";
        feedback.style.color = "green";
      } else {
        feedback.textContent = `Incorrect. Correct: "${q.choices[q.correct]}"`;
        feedback.style.color = "red";
      }

      moneyDisplay.textContent = totalMoney.toString();
      saveMoney();
      choicesDiv.appendChild(feedback);
      updateProgressBar();
    });

    choicesDiv.appendChild(btn);
  });

  updateProgressBar();
}

// small helper to append text messages
function appendMessage(container, text, cls = "") {
  const p = document.createElement("p");
  p.textContent = text;
  if (cls) p.className = cls;
  container.appendChild(p);
  return p;
}

// -------------------- Ensure Earn Exit Button --------------------
let earnExitBtn = document.getElementById("earn-exit");
if (!earnExitBtn) {
  earnExitBtn = document.createElement("button");
  earnExitBtn.id = "earn-exit";
  earnExitBtn.textContent = "Exit to Menu";
  // append to earn screen (after Next)
  earnScreen.appendChild(document.createElement("br"));
  earnScreen.appendChild(earnExitBtn);
}

// -------------------- BUTTON LISTENERS (Earn) --------------------
earnNext.addEventListener("click", () => {
  if (!answered) {
    alert("Please answer the question before moving on.");
    return;
  }
  earnCurrent++;
  renderEarnQuestion();
});

earnExitBtn.addEventListener("click", () => {
  showScreen(welcomeScreen);
});

// -------------------- Welcome / Invest entry --------------------
earnBtn.addEventListener("click", () => {
  showScreen(earnScreen);
  renderEarnQuestion();
});

investBtn.addEventListener("click", () => {
  renderInvestMenu();
  showScreen(investScreen);
});

// -------------------- INVEST MENU (dynamically rendered) --------------------
function renderInvestMenu() {
  investScreen.innerHTML = `
    <h2>Choose Your Investment Strategy</h2>
    <div style="display:flex;gap:10px;flex-direction:column;align-items:center;">
      <button class="strategy" data-strategy="rule110">Rule 110</button>
      <button class="strategy" data-strategy="bucket">Bucket Strategy</button>
      <button class="strategy" data-strategy="dca">Dollar-Cost Averaging</button>
    </div>
    <div style="margin-top:16px;">
      <button id="invest-back">Back to Menu</button>
    </div>
  `;

  investScreen.querySelectorAll(".strategy").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const strat = btn.dataset.strategy;
      if (strat === "rule110") rule110Investment();
      else if (strat === "bucket") bucketInvestment();
      else if (strat === "dca") dcaInvestment();
    });
  });

  const investBack = document.getElementById("invest-back");
  investBack.addEventListener("click", () => showScreen(welcomeScreen));
}

// -------------------- RULE 110 --------------------
function rule110Investment() {
  investScreen.innerHTML = `
    <h2>Rule 110</h2>
    <p>Your current money: $${totalMoney}</p>
    <label>Age: <input id="r110-age" type="number" min="1" max="120"></label>
    <div id="r110-step" style="display:none;margin-top:12px;">
      <p>Stocks % = 110 - age. Bonds% = 100 - Stocks%</p>
      <label>Stocks $: <input id="r110-stocks" type="number" min="0"></label>
      <label>Bonds $: <input id="r110-bonds" type="number" min="0"></label>
      <div style="margin-top:12px;">
        <button id="r110-submit">Submit Allocation</button>
        <button id="r110-exit">Back to Invest Menu</button>
      </div>
      <div id="r110-feedback" style="margin-top:10px;"></div>
    </div>
  `;

  const ageInput = document.getElementById("r110-age");
  const stepDiv = document.getElementById("r110-step");
  const feedbackDiv = document.getElementById("r110-feedback");

  ageInput.addEventListener("change", () => {
    const age = parseInt(ageInput.value);
    if (isNaN(age) || age <= 0) {
      alert("Enter a valid age.");
      return;
    }
    stepDiv.style.display = "block";
    const stockPct = 110 - age;
    const bondPct = 100 - stockPct;
    feedbackDiv.innerHTML = `<p>Computed: Stocks ${stockPct}% | Bonds ${bondPct}%</p>`;
  });

  document.getElementById("r110-submit").addEventListener("click", () => {
    const age = parseInt(ageInput.value);
    if (isNaN(age) || age <= 0) return alert("Enter a valid age first.");

    const stockPct = 110 - age;
    const correctStocks = Math.round(totalMoney * (stockPct / 100));
    const correctBonds = Math.round(totalMoney - correctStocks);

    const userStocks = Math.round(Number(document.getElementById("r110-stocks").value || 0));
    const userBonds = Math.round(Number(document.getElementById("r110-bonds").value || 0));

    const stocksOk = Math.abs(userStocks - correctStocks) <= 1;
    const bondsOk = Math.abs(userBonds - correctBonds) <= 1;

    if (stocksOk && bondsOk) {
      feedbackDiv.innerHTML = `<p style="color:green">Correct allocation!</p>`;
    } else {
      feedbackDiv.innerHTML = `<p style="color:red">Incorrect. Correct: Stocks $${correctStocks}, Bonds $${correctBonds}</p>`;
    }

    lastInvestDetails = { method: "Rule 110", stocks: userStocks, bonds: userBonds };

    // Ask whether to show returns (Option A flow)
    const showBtn = document.createElement("button");
    showBtn.textContent = "See Market Return";
    const backBtn = document.createElement("button");
    backBtn.textContent = "Back to Invest Menu";
    backBtn.style.marginLeft = "8px";
    feedbackDiv.appendChild(showBtn);
    feedbackDiv.appendChild(backBtn);

    showBtn.addEventListener("click", () => renderMarketChoiceScreen());
    backBtn.addEventListener("click", () => { renderInvestMenu(); showScreen(investScreen); });
  });

  document.getElementById("r110-exit").addEventListener("click", () => { renderInvestMenu(); showScreen(investScreen); });
}

// -------------------- BUCKET --------------------
function bucketInvestment() {
  investScreen.innerHTML = `
    <h2>Bucket Strategy</h2>
    <p>Your current money: $${totalMoney}</p>
    <p>Bucket1 (short-term) recommended: 20% - 30%</p>
    <p>Bucket2 (growth) recommended: 70% - 80%</p>
    <label>Bucket1 $: <input id="b1" type="number" min="0"></label>
    <label>Bucket2 $: <input id="b2" type="number" min="0"></label>
    <div style="margin-top:12px;">
      <button id="bucket-submit">Submit</button>
      <button id="bucket-exit">Back to Invest Menu</button>
    </div>
    <div id="bucket-feedback" style="margin-top:10px;"></div>
  `;

  const b1Input = document.getElementById("b1");
  const b2Input = document.getElementById("b2");
  const fb = document.getElementById("bucket-feedback");

  document.getElementById("bucket-submit").addEventListener("click", () => {
    const b1 = Number(b1Input.value || 0);
    const b2 = Number(b2Input.value || 0);

    if (b1 + b2 > totalMoney + 0.001) {
      fb.innerHTML = `<p style="color:red">You cannot allocate more than your total money ($${totalMoney}).</p>`;
      return;
    }

    const b1Pct = (b1 / totalMoney) * 100;
    const b2Pct = (b2 / totalMoney) * 100;

    const b1Ok = b1Pct >= 20 && b1Pct <= 30;
    const b2Ok = b2Pct >= 70 && b2Pct <= 80;

    if (b1Ok && b2Ok) {
      fb.innerHTML = `<p style="color:green">Good allocation!</p>`;
    } else {
      fb.innerHTML = `<p style="color:orange">Allocation outside recommended range. Recommended ranges shown.</p>`;
      fb.innerHTML += `<p>Bucket1: ${Math.round(totalMoney*0.2)} - ${Math.round(totalMoney*0.3)}, Bucket2: ${Math.round(totalMoney*0.7)} - ${Math.round(totalMoney*0.8)}</p>`;
    }

    lastInvestDetails = { method: "Bucket", bucket1: b1, bucket2: b2 };

    const showBtn = document.createElement("button");
    showBtn.textContent = "See Market Return";
    showBtn.style.marginTop = "8px";
    fb.appendChild(showBtn);

    showBtn.addEventListener("click", () => renderMarketChoiceScreen());
  });

  document.getElementById("bucket-exit").addEventListener("click", () => { renderInvestMenu(); showScreen(investScreen); });
}

// -------------------- DCA --------------------
function dcaInvestment() {
  investScreen.innerHTML = `
    <h2>Dollar-Cost Averaging (DCA)</h2>
    <p>Your current money: $${totalMoney}</p>
    <label>Amount per interval: <input id="dca-amt" type="number" min="1"></label>
    <label>Intervals per period: <input id="dca-intervals" type="number" min="1"></label>
    <label>Number of periods: <input id="dca-periods" type="number" min="1"></label>
    <div style="margin-top:12px;">
      <button id="dca-submit">Submit</button>
      <button id="dca-exit">Back to Invest Menu</button>
    </div>
    <div id="dca-feedback" style="margin-top:10px;"></div>
  `;

  const amtInput = document.getElementById("dca-amt");
  const intervalsInput = document.getElementById("dca-intervals");
  const periodsInput = document.getElementById("dca-periods");
  const fb = document.getElementById("dca-feedback");

  document.getElementById("dca-submit").addEventListener("click", () => {
    const amt = Number(amtInput.value || 0);
    const intervals = Number(intervalsInput.value || 0);
    const periods = Number(periodsInput.value || 0);

    if (amt <= 0 || intervals <= 0 || periods <= 0) {
      fb.innerHTML = `<p style="color:red">Please enter valid positive numbers.</p>`;
      return;
    }

    const totalInvestment = Math.round(amt * intervals * periods);
    if (totalInvestment > totalMoney) {
      fb.innerHTML = `<p style="color:red">Total investment ($${totalInvestment}) exceeds available money ($${totalMoney}).</p>`;
      return;
    }

    fb.innerHTML = `<p style="color:green">OK — total investment $${totalInvestment}.</p>`;

    lastInvestDetails = { method: "DCA", totalInvestment, amt, intervals, periods };

    const showBtn = document.createElement("button");
    showBtn.textContent = "See Market Return";
    showBtn.style.marginTop = "8px";
    fb.appendChild(showBtn);

    showBtn.addEventListener("click", () => renderMarketChoiceScreen());
  });

  document.getElementById("dca-exit").addEventListener("click", () => { renderInvestMenu(); showScreen(investScreen); });
}

// -------------------- MARKET CHOICE SCREEN (Option A) --------------------
function renderMarketChoiceScreen() {
  // show a simple choice UI asking the user to pick the market outcome
  investScreen.style.display = "none";
  marketResultsScreen.style.display = "block";

  // clear previous final-money paragraph if any
  const old = marketResultsScreen.querySelector("p.final-money");
  if (old) old.remove();

  // hide result paragraphs until user chooses
  resultsUp.style.display = "none";
  resultsDown.style.display = "none";
  resultsStable.style.display = "none";

  // create a small UI inside marketResultsScreen for picking market (if not already present)
  let chooser = document.getElementById("market-chooser");
  if (!chooser) {
    chooser = document.createElement("div");
    chooser.id = "market-chooser";
    chooser.style.marginTop = "12px";
    chooser.innerHTML = `
      <p>Choose the market outcome:</p>
      <div style="display:flex;gap:8px;justify-content:center">
        <button id="market-up">Market Up</button>
        <button id="market-down">Market Down</button>
        <button id="market-stable">Market Consistent</button>
      </div>
      <div style="margin-top:10px;"><button id="market-back">Back to Invest Menu</button></div>
    `;
    marketResultsScreen.appendChild(chooser);

    document.getElementById("market-up").addEventListener("click", () => { showMarketResult("up"); });
    document.getElementById("market-down").addEventListener("click", () => { showMarketResult("down"); });
    document.getElementById("market-stable").addEventListener("click", () => { showMarketResult("stable"); });
    document.getElementById("market-back").addEventListener("click", () => { chooser.remove(); renderInvestMenu(); showScreen(investScreen); });
  } else {
    // chooser already present — just ensure visible
    chooser.style.display = "block";
  }
}

// -------------------- SHOW MARKET RESULT & UPDATE totalMoney --------------------
function showMarketResult(market) {
  // hide chooser if present
  const chooser = document.getElementById("market-chooser");
  if (chooser) chooser.style.display = "none";

  // show the right result message
  resultsUp.style.display = "none";
  resultsDown.style.display = "none";
  resultsStable.style.display = "none";

  if (market === "up") resultsUp.style.display = "block";
  else if (market === "down") resultsDown.style.display = "block";
  else resultsStable.style.display = "block";

  // If no invest action taken, just show totalMoney as unchanged
  if (!lastInvestDetails) {
    appendFinalMoney(totalMoney, market);
    saveMoney();
    return;
  }

  // compute finalMoney based on lastInvestDetails
  let finalMoney = totalMoney; // default fallback
  const method = lastInvestDetails.method;

  if (method === "Rule 110") {
    const stocks = Number(lastInvestDetails.stocks) || 0;
    const bonds = Number(lastInvestDetails.bonds) || 0;
    const stockMult = market === "up" ? 1.2 : market === "down" ? 0.8 : 1.0;
    const bondMult = market === "up" ? 1.05 : market === "down" ? 0.95 : 1.0;
    const stockResult = Math.round(stocks * stockMult);
    const bondResult = Math.round(bonds * bondMult);
    const invested = stocks + bonds;
    const remaining = totalMoney - invested;
    finalMoney = stockResult + bondResult + Math.round(remaining);
  } else if (method === "Bucket") {
    const b1 = Number(lastInvestDetails.bucket1) || 0;
    const b2 = Number(lastInvestDetails.bucket2) || 0;
    const b1Mult = market === "up" ? 1.05 : market === "down" ? 0.95 : 1.0;
    const b2Mult = market === "up" ? 1.2 : market === "down" ? 0.8 : 1.0;
    finalMoney = Math.round(b1 * b1Mult + b2 * b2Mult + (totalMoney - (b1 + b2)));
  } else if (method === "DCA") {
    const invested = Number(lastInvestDetails.totalInvestment) || 0;
    const invMult = market === "up" ? 1.2 : market === "down" ? 0.8 : 1.0;
    finalMoney = Math.round(invested * invMult + (totalMoney - invested));
  } else {
    const mult = market === "up" ? 1.2 : market === "down" ? 0.8 : 1.0;
    finalMoney = Math.round(totalMoney * mult);
  }

  // update totalMoney & persist
  totalMoney = finalMoney;
  moneyDisplay.textContent = totalMoney.toString();
  saveMoney();

  appendFinalMoney(finalMoney, market);
}

// helper to append final-money paragraph
function appendFinalMoney(amount, market) {
  const old = marketResultsScreen.querySelector("p.final-money");
  if (old) old.remove();
  const p = document.createElement("p");
  p.className = "final-money";
  p.textContent = `After the market (${market.toUpperCase()}), you now have $${amount}`;
  marketResultsScreen.appendChild(p);
}

// -------------------- RESTART (full reset) --------------------
restartBtn.addEventListener("click", () => {
  totalMoney = 0;
  earnCurrent = 0;
  answered = false;
  lastInvestDetails = null;
  moneyDisplay.textContent = totalMoney.toString();
  saveMoney();
  renderInvestMenu();
  showScreen(welcomeScreen);
});

// -------------------- Initialize (show welcome) --------------------
showScreen(welcomeScreen);
