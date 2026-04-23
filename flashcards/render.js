const deckSelect = document.querySelector("#deckSelect");
const tableBody = document.querySelector("#tableBody");
const tableEmptyMessage = document.querySelector("#tableEmptyMessage");
const flashcardDisplay = document.querySelector("#flashcardDisplay");
const studyPositionSpan = document.querySelector("#studyPosition");
const sideHint = document.querySelector("#sideHint");
const prevCardBtn = document.querySelector("#prevCardBtn");
const nextCardBtn = document.querySelector("#nextCardBtn");
const flipCardBtn = document.querySelector("#flipCardBtn");
const addCardBtn = document.querySelector("#addCardBtn");
const cancelEditBtn = document.querySelector("#cancelEditBtn");
const frontInput = document.querySelector("#frontInput");
const backInput = document.querySelector("#backInput");
const studyFilterSelect = document.querySelector("#studyFilterSelect");

function renderDeckSelector() {
  deckSelect.innerHTML = "";
  const deckIds = Object.keys(appData.decks);
  if (deckIds.length === 0) {
    const newId = generateId();
    appData.decks[newId] = { name: "Main deck", cards: [] };
    appData.activeDeckId = newId;
    saveToStorage(appData);
    renderDeckSelector();
    return;
  }
  deckIds.forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = appData.decks[id].name || "Unnamed deck";
    if (id === appData.activeDeckId) option.selected = true;
    deckSelect.appendChild(option);
  });
}

function renderTable() {
  const cards = getActiveCards();
  tableBody.innerHTML = "";

  if (cards.length === 0) {
    tableEmptyMessage.style.display = "block";
  } else {
    tableEmptyMessage.style.display = "none";
    cards.forEach((card) => {
      const row = document.createElement("tr");

      const frontCell = document.createElement("td");
      frontCell.className = "card-text";
      frontCell.textContent = card.front;
      row.appendChild(frontCell);

      const backCell = document.createElement("td");
      backCell.className = "card-text";
      backCell.textContent = card.back;
      row.appendChild(backCell);

      const statusCell = document.createElement("td");
      const learnedDiv = document.createElement("div");
      learnedDiv.className = "learned-badge";
      const toggleBtn = document.createElement("button");
      toggleBtn.className = `toggle-learned ${card.learned ? "learned" : ""}`;
      toggleBtn.textContent = card.learned ? "✓ Learned" : "Mark learned";
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleCardLearned(card.id);
      });
      learnedDiv.appendChild(toggleBtn);
      statusCell.appendChild(learnedDiv);
      row.appendChild(statusCell);

      const actionsCell = document.createElement("td");
      const editBtn = document.createElement("button");
      editBtn.className = "btn";
      editBtn.textContent = "✏️ Edit";
      editBtn.style.marginRight = "0.4rem";
      editBtn.addEventListener("click", () => startEditCard(card));

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-danger";
      deleteBtn.textContent = "🗑";
      deleteBtn.addEventListener("click", () => deleteCard(card.id));

      actionsCell.appendChild(editBtn);
      actionsCell.appendChild(deleteBtn);
      row.appendChild(actionsCell);

      tableBody.appendChild(row);
    });
  }
}

function renderStudyArea() {
  rebuildStudyList(studyFilterSelect.value);
  const card = getCurrentStudyCard();

  if (!card) {
    flashcardDisplay.textContent = "📭 No cards to study";
    flashcardDisplay.style.cursor = "default";
    studyPositionSpan.textContent = "0 / 0";
    sideHint.textContent = "Showing: —";
    prevCardBtn.disabled = true;
    nextCardBtn.disabled = true;
    flipCardBtn.disabled = true;
    return;
  }

  flashcardDisplay.style.cursor = "pointer";
  flipCardBtn.disabled = false;

  const displayText = showFront ? card.front : card.back;
  flashcardDisplay.textContent = displayText;
  sideHint.textContent = showFront
    ? "Showing: front (question)"
    : "Showing: back (answer)";

  const total = studyCardList.length;
  studyPositionSpan.textContent = `${studyIndex + 1} / ${total}`;

  prevCardBtn.disabled = studyIndex <= 0;
  nextCardBtn.disabled = studyIndex >= total - 1;
}

function updateEditModeUI() {
  if (editingCardId) {
    addCardBtn.textContent = "✏️ Update card";
    cancelEditBtn.style.display = "inline-flex";
  } else {
    addCardBtn.textContent = "➕ Add card";
    cancelEditBtn.style.display = "none";
  }
}

function refreshUI() {
  renderDeckSelector();
  renderTable();
  renderStudyArea();
  updateEditModeUI();
}
