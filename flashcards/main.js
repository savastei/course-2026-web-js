const STORAGE_KEY = "flashcards-deck";

let decks = [];
let activeDeckId = null;
let editingCardId = null;

const tbody = document.querySelector("tbody");
const leftWindow = document.querySelector("#leftWindow");
const rightWindow = document.querySelector("#rightWindow");
const createCardBut = document.querySelector("#createCardBut");
const nav = document.querySelector("#nav");

init();

function init() {
  load();

  createCardBut.addEventListener("click", saveCard);

  document.querySelector("#addButton").addEventListener("click", createDeck);

  document.querySelector("#remember").addEventListener("click", () => {
    save();
    window.location.href = "remember.html";
  });

  if (!decks.length) {
    createDeck();
  } else {
    renderDeckTabs();
    setActiveDeck(activeDeckId || decks[0].id);
  }
}

function generateId() {
  return crypto.randomUUID();
}

function createDeck(name = "New Deck") {
  const deck = {
    id: generateId(),
    name,
    cards: [],
  };

  decks.push(deck);

  renderDeckTabs();
  setActiveDeck(deck.id);
  save();
}

function deleteDeck(deckId) {
  const confirmed = confirm("Delete this deck and all cards?");

  if (!confirmed) return;

  decks = decks.filter((deck) => deck.id !== deckId);

  if (!decks.length) {
    createDeck();
    return;
  }

  setActiveDeck(decks[0].id);
  renderDeckTabs();
  save();
}

function renameDeck(deckId, value) {
  const deck = decks.find((d) => d.id === deckId);

  if (!deck) return;

  deck.name = value.trim() || "Untitled Deck";
  save();
}

function setActiveDeck(deckId) {
  activeDeckId = deckId;

  document.querySelectorAll(".deck-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.id === deckId);
  });

  renderCards();
}

function getActiveDeck() {
  return decks.find((deck) => deck.id === activeDeckId);
}

function saveCard() {
  const front = leftWindow.value.trim();
  const back = rightWindow.value.trim();

  if (!front || !back) {
    return;
  }

  const deck = getActiveDeck();

  if (!deck) {
    return;
  }

  if (editingCardId) {
    const card = deck.cards.find((c) => c.id === editingCardId);

    if (card) {
      card.frontSide = front;
      card.backSide = back;
    }

    editingCardId = null;
    createCardBut.textContent = "＋ Add Card";
  } else {
    deck.cards.unshift({
      id: generateId(),
      frontSide: front,
      backSide: back,
      learned: false,
    });
  }

  leftWindow.value = "";
  rightWindow.value = "";

  renderCards();
  save();
}

function renderDeckTabs() {
  document.querySelectorAll(".deck-tab").forEach((tab) => tab.remove());

  decks.forEach((deck) => {
    const tab = document.createElement("div");
    tab.className = "deck-tab";
    tab.dataset.id = deck.id;

    const input = document.createElement("input");
    input.value = deck.name;

    input.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    input.addEventListener("input", (e) => {
      renameDeck(deck.id, e.target.value);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "del-deck";
    deleteBtn.textContent = "✕";

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteDeck(deck.id);
    });

    tab.addEventListener("click", () => {
      setActiveDeck(deck.id);
    });

    tab.append(input, deleteBtn);
    nav.insertBefore(tab, document.querySelector("#addButton"));
  });

  setActiveDeck(activeDeckId || decks[0]?.id);
}

function renderCards() {
  tbody.innerHTML = "";

  const deck = getActiveDeck();

  if (!deck || !deck.cards.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">
          No cards yet
        </td>
      </tr>
    `;

    return;
  }

  deck.cards.forEach((card) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${escapeHtml(card.frontSide)}</td>
      <td>${escapeHtml(card.backSide)}</td>
      <td class="learned-cell"></td>
      <td></td>
    `;

    const learnedCell = tr.children[2];

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = card.learned;

    checkbox.addEventListener("change", () => {
      card.learned = checkbox.checked;
      save();
    });

    learnedCell.appendChild(checkbox);

    const actionCell = tr.children[3];

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-edit";
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", () => {
      editCard(card.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-del";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      deleteCard(card.id);
    });

    actionCell.append(editBtn, deleteBtn);

    tbody.appendChild(tr);
  });
}

function editCard(cardId) {
  const deck = getActiveDeck();
  const card = deck.cards.find((c) => c.id === cardId);

  if (!card) return;

  leftWindow.value = card.frontSide;
  rightWindow.value = card.backSide;

  editingCardId = card.id;
  createCardBut.textContent = "✔ Save Card";
}

function deleteCard(cardId) {
  const deck = getActiveDeck();

  deck.cards = deck.cards.filter((card) => card.id !== cardId);

  renderCards();
  save();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

function load() {
  decks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  if (decks.length) {
    activeDeckId = decks[0].id;
  }
}
