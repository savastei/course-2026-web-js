(function () {
  const SOUNDS = {
    C: "sounds/A1.mp3",
    D: "sounds/B1.mp3",
    E: "sounds/C1.mp3",
    F: "sounds/D1.mp3",
    G: "sounds/E1.mp3",
    A: "sounds/F1.mp3",
    B: "sounds/G1.mp3",
    "C#": "sounds/Ab1.mp3",
    "D#": "sounds/Bb1.mp3",
    "F#": "sounds/Db1.mp3",
    "G#": "sounds/Eb1.mp3",
    "A#": "sounds/Gb1.mp3",
  };

  const WHITE = ["C", "D", "E", "F", "G", "A", "B"];
  const BLACK = ["C#", "D#", "F#", "G#", "A#"];
  const ALL = [...WHITE, ...BLACK];

  const levelDisplay = document.querySelector("#levelDisplay");
  const bestDisplay = document.querySelector("#bestDisplay");
  const messageBox = document.querySelector("#messageBox");
  const startBtn = document.querySelector("#startBtn");
  const whiteContainer = document.querySelector("#whiteKeysContainer");
  const blackContainer = document.querySelector("#blackKeysContainer");

  const keyElements = new Map();
  const audioCache = new Map();
  let sequence = [];
  let userStep = 0;
  let level = 1;
  let best = 0;
  let active = false;
  let userTurn = false;

  function preloadAudio() {
    for (const [note, file] of Object.entries(SOUNDS)) {
      const audio = new Audio(file);
      audio.preload = "auto";
      audio.volume = 0.7;
      audioCache.set(note, audio);
    }
  }

  function buildKeys() {
    WHITE.forEach((note) => {
      const el = document.createElement("div");
      el.className = "white-key";
      el.dataset.note = note;
      el.textContent = note;
      el.addEventListener("click", () => onUserPress(note));
      whiteContainer.appendChild(el);
      keyElements.set(note, el);
    });

    BLACK.forEach((note) => {
      const el = document.createElement("div");
      el.className = "black-key";
      el.dataset.note = note;
      el.textContent = note;
      el.addEventListener("click", () => onUserPress(note));
      blackContainer.appendChild(el);
      keyElements.set(note, el);
    });
  }

  function loadBest() {
    try {
      const saved = localStorage.getItem("simonBest");
      best = saved ? parseInt(saved) : 0;
    } catch {
      best = 0;
    }
    bestDisplay.textContent = best;
  }

  function saveBest(s) {
    if (s > best) {
      best = s;
      bestDisplay.textContent = best;
      localStorage.setItem("simonBest", best);
    }
  }

  function setMessage(msg) {
    messageBox.textContent = msg;
  }

  function disableKeys(dis) {
    document.querySelectorAll(".white-key, .black-key").forEach((k) => {
      k.classList.toggle("disabled", dis);
    });
  }

  function clearHighlights() {
    keyElements.forEach((el) => el.classList.remove("active"));
  }

  function playSound(note) {
    const audio = audioCache.get(note);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  function lightUp(note, ms = 350) {
    const el = keyElements.get(note);
    if (!el) return;
    el.classList.add("active");
    playSound(note);
    setTimeout(() => el.classList.remove("active"), ms);
  }

  function randomNote() {
    return ALL[Math.floor(Math.random() * ALL.length)];
  }

  function generateSeq(len) {
    return Array.from(
      {
        length: len,
      },
      () => randomNote(),
    );
  }

  async function playSequence() {
    userTurn = false;
    disableKeys(true);
    clearHighlights();

    for (const note of sequence) {
      await new Promise((r) => setTimeout(r, 250));
      lightUp(note, 380);
      await new Promise((r) => setTimeout(r, 420));
    }

    await new Promise((r) => setTimeout(r, 300));
    clearHighlights();

    if (active) {
      userTurn = true;
      disableKeys(false);
      setMessage(`Your turn (${sequence.length} notes)`);
    }
  }

  async function countdown() {
    if (!active) return;
    disableKeys(true);
    userTurn = false;

    for (const step of ["Ready?", "Set...", "Go!"]) {
      if (!active) return;
      setMessage(step);
      await new Promise((r) => setTimeout(r, 700));
    }

    if (!active) return;
    sequence = generateSeq(level);
    userStep = 0;
    levelDisplay.textContent = level;
    setMessage("Listen...");
    await playSequence();
  }

  function onUserPress(note) {
    if (!active || !userTurn) return;

    const el = keyElements.get(note);
    if (el) {
      el.classList.add("active");
      playSound(note);
      setTimeout(() => el.classList.remove("active"), 200);
    }

    if (note !== sequence[userStep]) {
      endGame();
      return;
    }

    userStep++;
    if (userStep === sequence.length) {
      roundWon();
    }
  }

  function roundWon() {
    saveBest(level);
    setMessage(`Correct! Level ${level} complete.`);
    level++;
    levelDisplay.textContent = level;
    userTurn = false;
    disableKeys(true);
    setTimeout(() => {
      if (active) countdown();
    }, 1000);
  }

  function endGame() {
    active = false;
    userTurn = false;
    disableKeys(true);
    clearHighlights();
    saveBest(level);
    setMessage(`Wrong! Game over. Level ${level}`);
    startBtn.disabled = false;
  }

  function newGame() {
    active = false;
    userTurn = false;
    disableKeys(true);
    clearHighlights();

    level = 1;
    sequence = [];
    userStep = 0;
    levelDisplay.textContent = level;

    active = true;
    startBtn.disabled = true;
    setMessage("Starting...");
    countdown();
  }

  startBtn.addEventListener("click", newGame);

  preloadAudio();
  buildKeys();
  loadBest();
  disableKeys(true);
  setMessage("Press New Game");
  startBtn.disabled = false;
})();
