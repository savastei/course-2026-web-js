(function () {
  "use strict";

  let playerCount = 2;
  let players = [];
  let activePlayer = 0;
  let gameWinner = -1;

  let dice = [1, 1];

  const playersEl = document.getElementById("playersContainer");
  const choiceEl = document.getElementById("choice");
  const die1El = document.getElementById("die1");
  const die2El = document.getElementById("die2");
  const avatarEl = document.getElementById("currentPlayerAvatar");
  const turnTextEl = document.getElementById("turnText");
  const winnerMsgEl = document.getElementById("winnerMessage");
  const countDisplay = document.getElementById("playerCountDisplay");

  const decBtn = document.getElementById("decreasePlayers");
  const incBtn = document.getElementById("increasePlayers");
  const resetBtn = document.getElementById("resetGame");

  function rollD6() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function initGame(n) {
    playerCount = Math.min(6, Math.max(2, n));
    players = [];
    for (let i = 0; i < playerCount; i++) {
      players.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    }
    activePlayer = 0;
    gameWinner = -1;
    dice = [rollD6(), rollD6()];

    countDisplay.textContent = playerCount;
    renderAll();
  }

  function updateWinner() {
    for (let i = 0; i < players.length; i++) {
      if (players[i].length === 0) {
        gameWinner = i;
        return i;
      }
    }
    gameWinner = -1;
    return -1;
  }

  function advanceTurn() {
    if (gameWinner !== -1) return;

    let next = (activePlayer + 1) % players.length;
    // пропускаем тех, у кого пусто (на всякий случай)
    let start = next;
    while (players[next].length === 0) {
      next = (next + 1) % players.length;
      if (next === start) break; // все пустые (редко)
    }
    activePlayer = next;
    dice = [rollD6(), rollD6()];
    renderAll();
  }

  function removeCards(valuesToRemove) {
    if (gameWinner !== -1) {
      return;
    }

    const currentCards = players[activePlayer];

    const allPresent = valuesToRemove.every((v) => currentCards.includes(v));
    if (!allPresent) {
      alert("Эти числа недоступны для удаления.");
      return;
    }

    players[activePlayer] = currentCards.filter(
      (c) => !valuesToRemove.includes(c),
    );

    const winnerIdx = updateWinner();
    if (winnerIdx !== -1) {
      renderAll();
      return;
    }

    advanceTurn();
  }

  function renderPlayers() {
    playersEl.innerHTML = "";

    for (let p = 0; p < players.length; p++) {
      const cards = players[p];
      const cardDiv = document.createElement("div");
      cardDiv.className = "player-card";
      if (p === activePlayer && gameWinner === -1) {
        cardDiv.classList.add("active");
      }

      const header = document.createElement("div");
      header.className = "player-header";
      header.innerHTML = `<span>Игрок ${p + 1}</span><span>🎯 ${cards.length}/12</span>`;
      cardDiv.appendChild(header);

      const grid = document.createElement("div");
      grid.className = "cards-grid";

      for (let num = 1; num <= 12; num++) {
        const tile = document.createElement("div");
        tile.className = "number-tile";
        if (!cards.includes(num)) {
          tile.classList.add("removed");
        }
        tile.textContent = num;
        grid.appendChild(tile);
      }
      cardDiv.appendChild(grid);
      playersEl.appendChild(cardDiv);
    }

    if (gameWinner !== -1) {
      avatarEl.textContent = "🏆";
      turnTextEl.textContent = `Победил Игрок ${gameWinner + 1}`;
      winnerMsgEl.textContent = `🏆 Игрок ${gameWinner + 1} выиграл!`;
    } else {
      avatarEl.textContent = activePlayer + 1;
      turnTextEl.textContent = `Ход Игрока ${activePlayer + 1}`;
      winnerMsgEl.textContent = "";
    }
  }

  function renderDiceAndChoices() {
    const d1 = dice[0];
    const d2 = dice[1];
    die1El.textContent = d1;
    die2El.textContent = d2;

    choiceEl.innerHTML = "";

    if (gameWinner !== -1) {
      const msg = document.createElement("div");
      msg.style.padding = "8px";
      msg.style.color = "#5e6b5a";
      msg.textContent = "Игра завершена. Начните новую.";
      choiceEl.appendChild(msg);
      return;
    }

    const currentCards = players[activePlayer];
    if (currentCards.length === 0) {
      advanceTurn();
      return;
    }

    const hasBoth = currentCards.includes(d1) && currentCards.includes(d2);
    const sum = d1 + d2;
    const hasSum = currentCards.includes(sum);

    const btnBoth = document.createElement("button");
    btnBoth.className = "btn";
    btnBoth.textContent = `${d1} и ${d2}`;
    if (!hasBoth) btnBoth.disabled = true;
    btnBoth.addEventListener("click", () => removeCards([d1, d2]));

    const btnSum = document.createElement("button");
    btnSum.className = "btn";
    btnSum.textContent = `Сумма ${sum}`;
    if (!hasSum) btnSum.disabled = true;
    btnSum.addEventListener("click", () => removeCards([sum]));

    choiceEl.appendChild(btnBoth);
    choiceEl.appendChild(btnSum);

    if (!hasBoth && !hasSum) {
      const skipBtn = document.createElement("button");
      skipBtn.className = "btn skip-btn";
      skipBtn.textContent = "⏭ Пропустить ход";
      skipBtn.addEventListener("click", () => advanceTurn());
      choiceEl.appendChild(skipBtn);

      const hint = document.createElement("div");
      hint.style.width = "100%";
      hint.style.textAlign = "center";
      hint.style.marginTop = "6px";
      hint.style.color = "#8b857b";
      hint.textContent = "Нет подходящих чисел";
      choiceEl.appendChild(hint);
    }
  }

  function renderAll() {
    renderPlayers();
    renderDiceAndChoices();
  }

  function adjustCount(delta) {
    let newCount = playerCount + delta;
    if (newCount < 2) newCount = 2;
    if (newCount > 6) newCount = 6;
    if (newCount === playerCount) return;
    initGame(newCount);
  }

  decBtn.addEventListener("click", () => adjustCount(-1));
  incBtn.addEventListener("click", () => adjustCount(1));
  resetBtn.addEventListener("click", () => initGame(playerCount));

  initGame(2);
})();
