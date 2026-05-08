const STORAGE_KEY = "flashcards-deck";

let decks = [];
let activeDeckId = null;
let currentIndex = 0;
let studyMode = "all";

const cardInner = document.querySelector("#card-inner");
const frontText = document.querySelector("#front-text");
const backText = document.querySelector("#back-text");
const progress = document.querySelector("#progress");
const nav = document.querySelector("#nav");
const navi = document.querySelector("#navi");

init();

function init() {
  load();

  document.querySelector("#GoBack").addEventListener("click", () => {
    save();
    window.location.href = "index.html";
  });

  cardInner.addEventListener("click", () => {
    cardInner.classList.toggle("flipped");
  });

  renderDeckTabs();

  if (decks.length) {
    setActiveDeck(decks[0].id);
  }
}

function getActiveDeck() {
  return decks.find((deck) => deck.id === activeDeckId);
}

function setActiveDeck(deckId) {
  activeDeckId = deckId;
  currentIndex = 0;

  renderDeckTabs();
  renderCard();
}

function renderDeckTabs() {
  nav.innerHTML = "";

  decks.forEach((deck) => {
    const button = document.createElement("button");

    button.className = `deck-tab ${deck.id === activeDeckId ? "active" : ""}`;

    button.textContent = deck.name;

    button.addEventListener("click", () => {
      setActiveDeck(deck.id);
    });

    nav.appendChild(button);
  });
}

function getStudyCards() {
  const deck = getActiveDeck();

  if (!deck) return [];

  if (studyMode === "new") {
    return deck.cards.filter((card) => !card.learned);
  }

  return deck.cards;
}

function renderCard() {
  cardInner.classList.remove("flipped");

  const cards = getStudyCards();

  if (!cards.length) {
    frontText.textContent = "No cards";
    backText.textContent = "";
    progress.textContent = "";
    navi.innerHTML = "";
    return;
  }

  if (currentIndex >= cards.length) {
    currentIndex = 0;
  }

  const card = cards[currentIndex];

  frontText.textContent = card.frontSide;
  backText.textContent = card.backSide;

  progress.textContent = `${currentIndex + 1} / ${cards.length}`;

  renderControls(card, cards);
}

function renderControls(card, cards) {
  navi.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.className = "nav-btn";
  prevBtn.textContent = "←";

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;

    renderCard();
  });

  const nextBtn = document.createElement("button");
  nextBtn.className = "nav-btn";
  nextBtn.textContent = "→";

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % cards.length;

    renderCard();
  });

  const learnedBtn = document.createElement("button");
  learnedBtn.className = "nav-btn";
  learnedBtn.textContent = card.learned ? "✓" : "○";

  learnedBtn.addEventListener("click", () => {
    card.learned = !card.learned;

    save();
    renderCard();
  });

  const modeBtn = document.createElement("button");
  modeBtn.className = "nav-btn";
  modeBtn.textContent = studyMode === "all" ? "All" : "New";

  modeBtn.addEventListener("click", () => {
    studyMode = studyMode === "all" ? "new" : "all";
    currentIndex = 0;
    renderCard();
  });

  navi.append(prevBtn, learnedBtn, modeBtn, nextBtn);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

function load() {
  decks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}
