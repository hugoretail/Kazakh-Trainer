const alphabetLetters = [
  { prompt: "А", answers: ["a"] },
  { prompt: "Ә", answers: ["ae", "a"] },
  { prompt: "Б", answers: ["b"] },
  { prompt: "В", answers: ["v"] },
  { prompt: "Г", answers: ["g"] },
  { prompt: "Ғ", answers: ["gh"] },
  { prompt: "Д", answers: ["d"] },
  { prompt: "Е", answers: ["e", "ye"] },
  { prompt: "Ж", answers: ["zh", "j"] },
  { prompt: "З", answers: ["z"] },
  { prompt: "И", answers: ["i"] },
  { prompt: "Й", answers: ["y"] },
  { prompt: "К", answers: ["k"] },
  { prompt: "Қ", answers: ["q"] },
  { prompt: "Л", answers: ["l"] },
  { prompt: "М", answers: ["m"] },
  { prompt: "Н", answers: ["n"] },
  { prompt: "Ң", answers: ["ng"] },
  { prompt: "О", answers: ["o"] },
  { prompt: "Ө", answers: ["oe", "o"] },
  { prompt: "П", answers: ["p"] },
  { prompt: "Р", answers: ["r"] },
  { prompt: "С", answers: ["s"] },
  { prompt: "Т", answers: ["t"] },
  { prompt: "У", answers: ["u"] },
  { prompt: "Ұ", answers: ["u"] },
  { prompt: "Ү", answers: ["ue"] },
  { prompt: "Ф", answers: ["f"] },
  { prompt: "Х", answers: ["kh", "h"] },
  { prompt: "Һ", answers: ["h"] },
  { prompt: "Ц", answers: ["ts"] },
  { prompt: "Ч", answers: ["ch"] },
  { prompt: "Ш", answers: ["sh"] },
  { prompt: "Ы", answers: ["y"] },
  { prompt: "І", answers: ["i"] },
  { prompt: "Э", answers: ["e"] },
  { prompt: "Ю", answers: ["yu"] },
  { prompt: "Я", answers: ["ya"] },
];

const data = {
  alphabet: alphabetLetters.flatMap((letter) => [
    letter,
    {
      prompt: letter.prompt.toLowerCase(),
      answers: letter.answers,
    },
  ]),
  words: [
    { prompt: "ана", answers: ["ana"] },
    { prompt: "әке", answers: ["ake", "ae ke"] },
    { prompt: "от", answers: ["ot"] },
    { prompt: "су", answers: ["su"] },
    { prompt: "жол", answers: ["jol", "zhol"] },
    { prompt: "күн", answers: ["kun"] },
    { prompt: "қала", answers: ["qala"] },
    { prompt: "құс", answers: ["qus"] },
    { prompt: "нан", answers: ["nan"] },
    { prompt: "дос", answers: ["dos"] },
    { prompt: "кітап", answers: ["kitap"] },
    { prompt: "таң", answers: ["tang"] },
    { prompt: "бала", answers: ["bala"] },
    { prompt: "өрік", answers: ["orik", "oerik"] },
    { prompt: "үй", answers: ["ui"] },
    { prompt: "жаз", answers: ["jaz", "zhaz"] },
    { prompt: "қыс", answers: ["qys"] },
    { prompt: "мектеп", answers: ["mektep"] },
    { prompt: "жаңа", answers: ["zhanga", "janga"] },
    { prompt: "әлем", answers: ["alem", "aelem"] },
  ],
};

const stage = document.querySelector(".stage");
const promptMeta = document.getElementById("promptMeta");
const promptEl = document.getElementById("prompt");
const answerForm = document.getElementById("answerForm");
const answerInput = document.getElementById("answerInput");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const sizeRange = document.getElementById("sizeRange");
const sizeDown = document.getElementById("sizeDown");
const sizeUp = document.getElementById("sizeUp");
const modeButtons = Array.from(document.querySelectorAll("[data-mode]"));

let currentMode = "alphabet";
let currentItem = null;
let streak = 0;
let lock = false;

function normalize(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "")
    .replace(/\s+/g, " ");
}

function pickItem(mode) {
  const pool = data[mode];
  return pool[Math.floor(Math.random() * pool.length)];
}

function nextPrompt() {
  currentItem = pickItem(currentMode);
  promptMeta.textContent = currentMode === "alphabet" ? "alphabet" : "mots";
  promptEl.textContent = currentItem.prompt;
  answerInput.value = "";
  answerInput.focus();
}

function setFeedback(text, kind) {
  feedbackEl.textContent = text;
  feedbackEl.classList.remove("is-ok", "is-bad");
  stage.classList.remove("is-correct", "is-wrong");

  if (kind) {
    feedbackEl.classList.add(kind === "ok" ? "is-ok" : "is-bad");
    stage.classList.add(kind === "ok" ? "is-correct" : "is-wrong");
  }
}

function updateScore() {
  scoreEl.textContent = `streak ${streak}`;
}

function setScale(nextScale) {
  const clamped = Math.min(1.35, Math.max(0.5, nextScale));
  stage.style.setProperty("--prompt-scale", String(clamped));
  sizeRange.value = String(clamped);
}

function checkAnswer(value) {
  const normalized = normalize(value);
  const valid = currentItem.answers.some((answer) => normalize(answer) === normalized);

  if (valid) {
    streak += 1;
    setFeedback("ok", "ok");
  } else {
    streak = 0;
    setFeedback(`non · ${currentItem.answers[0]}`, "bad");
  }

  updateScore();
  lock = true;

  window.setTimeout(() => {
    lock = false;
    setFeedback(" ");
    nextPrompt();
  }, 650);
}

sizeRange.addEventListener("input", () => {
  setScale(Number(sizeRange.value));
});

sizeDown.addEventListener("click", () => {
  setScale(Number(sizeRange.value) - 0.05);
});

sizeUp.addEventListener("click", () => {
  setScale(Number(sizeRange.value) + 0.05);
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.mode;
    if (mode === currentMode) {
      return;
    }

    currentMode = mode;
    modeButtons.forEach((item) => {
      const active = item.dataset.mode === mode;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });

    setFeedback(" ");
    nextPrompt();
  });
});

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (lock) {
    return;
  }

  const value = answerInput.value;
  if (!value.trim()) {
    answerInput.focus();
    return;
  }

  checkAnswer(value);
});

nextPrompt();
setScale(1);
updateScore();
