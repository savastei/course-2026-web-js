const STORAGE_KEY = "flashcards_decks_app";

function saveToStorage(appData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

function loadFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object") {
        return {
          decks: parsed.decks || {},
          activeDeckId: parsed.activeDeckId || null,
        };
      }
    } catch (e) {
      console.warn("Failed to parse storage, resetting");
    }
  }
  return { decks: {}, activeDeckId: null };
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}
