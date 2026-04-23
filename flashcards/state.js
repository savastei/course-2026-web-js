let appData = {
  decks: {},
  activeDeckId: null,
};

let editingCardId = null;
let studyIndex = 0;
let showFront = true;
let studyCardList = [];

function getActiveDeck() {
  return appData.decks[appData.activeDeckId] || null;
}

function getActiveCards() {
  const deck = getActiveDeck();
  return deck ? deck.cards : [];
}

function rebuildStudyList(filterValue) {
  const cards = getActiveCards();
  if (filterValue === "unlearned") {
    studyCardList = cards.filter((c) => !c.learned).map((c) => c.id);
  } else {
    studyCardList = cards.map((c) => c.id);
  }
  if (studyCardList.length === 0) {
    studyIndex = 0;
  } else {
    studyIndex = Math.min(Math.max(0, studyIndex), studyCardList.length - 1);
  }
}

function getCurrentStudyCard() {
  if (studyCardList.length === 0) return null;
  const cardId = studyCardList[studyIndex];
  const cards = getActiveCards();
  return cards.find((c) => c.id === cardId) || null;
}
