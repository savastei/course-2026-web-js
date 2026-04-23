function addOrUpdateCard() {
  const front = frontInput.value.trim();
  const back = backInput.value.trim();
  if (!front || !back) {
    alert("Please fill in both front and back text.");
    return;
  }

  const deck = getActiveDeck();
  if (!deck) return;

  if (editingCardId) {
    const existingCard = deck.cards.find((c) => c.id === editingCardId);
    const learnedStatus = existingCard ? existingCard.learned : false;
    deck.cards = deck.cards.filter((c) => c.id !== editingCardId);
    const updatedCard = {
      id: editingCardId,
      front: front,
      back: back,
      learned: learnedStatus,
    };
    deck.cards.push(updatedCard);
    editingCardId = null;
  } else {
    const newCard = {
      id: generateId(),
      front: front,
      back: back,
      learned: false,
    };
    deck.cards.push(newCard);
  }

  frontInput.value = "";
  backInput.value = "";
  editingCardId = null;

  saveToStorage(appData);
  refreshUI();
}

function startEditCard(card) {
  frontInput.value = card.front;
  backInput.value = card.back;
  editingCardId = card.id;
  updateEditModeUI();
  frontInput.focus();
}

function cancelEdit() {
  frontInput.value = "";
  backInput.value = "";
  editingCardId = null;
  updateEditModeUI();
}

function deleteCard(cardId) {
  const deck = getActiveDeck();
  if (!deck) return;
  deck.cards = deck.cards.filter((c) => c.id !== cardId);
  if (editingCardId === cardId) {
    cancelEdit();
  }
  saveToStorage(appData);
  refreshUI();
}

function toggleCardLearned(cardId) {
  const deck = getActiveDeck();
  if (!deck) return;
  const card = deck.cards.find((c) => c.id === cardId);
  if (card) {
    card.learned = !card.learned;
    saveToStorage(appData);
    refreshUI();
  }
}

function shuffleDeck() {
  const deck = getActiveDeck();
  if (!deck || deck.cards.length === 0) return;
  const arr = deck.cards;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  saveToStorage(appData);
  refreshUI();
}

function switchDeck(deckId) {
  if (!deckId || !appData.decks[deckId]) return;
  appData.activeDeckId = deckId;
  editingCardId = null;
  frontInput.value = "";
  backInput.value = "";
  saveToStorage(appData);
  refreshUI();
}

function createNewDeck() {
  const name = prompt(
    "Enter new deck name:",
    "Deck " + (Object.keys(appData.decks).length + 1),
  );
  if (!name || name.trim() === "") return;
  const id = generateId();
  appData.decks[id] = { name: name.trim(), cards: [] };
  appData.activeDeckId = id;
  saveToStorage(appData);
  refreshUI();
}

function deleteCurrentDeck() {
  const deckIds = Object.keys(appData.decks);
  if (deckIds.length <= 1) {
    alert("Cannot delete the last deck. At least one deck must exist.");
    return;
  }
  const deck = getActiveDeck();
  if (!deck) return;
  const confirmDelete = confirm(
    `Delete deck "${deck.name}" and all its cards?`,
  );
  if (!confirmDelete) return;

  delete appData.decks[appData.activeDeckId];
  appData.activeDeckId = Object.keys(appData.decks)[0];
  editingCardId = null;
  frontInput.value = "";
  backInput.value = "";
  saveToStorage(appData);
  refreshUI();
}

function goToPrevCard() {
  if (studyCardList.length === 0) return;
  if (studyIndex > 0) {
    studyIndex--;
    showFront = true;
    renderStudyArea();
  }
}

function goToNextCard() {
  if (studyCardList.length === 0) return;
  if (studyIndex < studyCardList.length - 1) {
    studyIndex++;
    showFront = true;
    renderStudyArea();
  }
}

function flipCard() {
  if (studyCardList.length === 0) return;
  showFront = !showFront;
  renderStudyArea();
}

function handleFlashcardClick() {
  flipCard();
}
