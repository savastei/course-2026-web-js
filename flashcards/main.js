(function () {
  const loaded = loadFromStorage();
  appData.decks = loaded.decks;
  appData.activeDeckId = loaded.activeDeckId;

  if (Object.keys(appData.decks).length === 0) {
    const defaultId = generateId();
    appData.decks[defaultId] = { name: "Main deck", cards: [] };
    appData.activeDeckId = defaultId;
  }
  if (!appData.activeDeckId || !appData.decks[appData.activeDeckId]) {
    appData.activeDeckId = Object.keys(appData.decks)[0];
  }

  refreshUI();

  document.querySelector("#deckSelect").addEventListener("change", (e) => {
    switchDeck(e.target.value);
  });

  document
    .querySelector("#newDeckBtn")
    .addEventListener("click", createNewDeck);
  document
    .querySelector("#deleteDeckBtn")
    .addEventListener("click", deleteCurrentDeck);
  document
    .querySelector("#addCardBtn")
    .addEventListener("click", addOrUpdateCard);
  document
    .querySelector("#cancelEditBtn")
    .addEventListener("click", cancelEdit);
  document
    .querySelector("#shuffleDeckBtn")
    .addEventListener("click", shuffleDeck);

  document
    .querySelector("#prevCardBtn")
    .addEventListener("click", goToPrevCard);
  document
    .querySelector("#nextCardBtn")
    .addEventListener("click", goToNextCard);
  document.querySelector("#flipCardBtn").addEventListener("click", flipCard);
  document
    .querySelector("#flashcardDisplay")
    .addEventListener("click", handleFlashcardClick);

  document
    .querySelector("#studyFilterSelect")
    .addEventListener("change", () => {
      rebuildStudyList(studyFilterSelect.value);
      studyIndex = 0;
      showFront = true;
      renderStudyArea();
    });

  window.addEventListener("keydown", (e) => {
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.tagName === "SELECT"
    )
      return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToPrevCard();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goToNextCard();
    } else if (e.key === " " || e.key === "Space") {
      e.preventDefault();
      flipCard();
    }
  });

  setInterval(() => {
    saveToStorage(appData);
  }, 5000);
})();
