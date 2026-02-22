import { isEarth } from "./board.js";

const COLORS = ["#ff4b4b", "#ffb84b", "#4bff7a", "#4bb8ff", "#c44bff"];

export function initUI(game, handlers) {
  const startBtn = document.getElementById("start-game-btn");
  const rollMoveBtn = document.getElementById("roll-move-btn");
  const rollMineBtn = document.getElementById("roll-mine-btn");
  const endTurnBtn = document.getElementById("end-turn-btn");
  const upgradeShipBtn = document.getElementById("upgrade-ship-btn");
  const powerupButtons = document.querySelectorAll(".powerup-buttons button");

  startBtn.addEventListener("click", handlers.onStartGame);
  rollMoveBtn.addEventListener("click", handlers.onRollMovement);
  rollMineBtn.addEventListener("click", handlers.onRollMining);
  endTurnBtn.addEventListener("click", handlers.onEndTurn);
  upgradeShipBtn.addEventListener("click", handlers.onUpgradeShip);

  powerupButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-powerup");
      handlers.onBuyPowerUp(id);
    });
  });

  renderBoard(game);
  renderGame(game);
}

export function renderBoard(game) {
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";

  game.board.forEach((tile) => {
    const tileEl = document.createElement("div");
    tileEl.classList.add("board-tile");
    if (tile.type === "earth") tileEl.classList.add("earth");
    if (tile.zone) tileEl.classList.add(`zone-${tile.zone}`);

    const indexEl = document.createElement("div");
    indexEl.classList.add("tile-index");
    indexEl.textContent = tile.index;
    tileEl.appendChild(indexEl);

    const labelEl = document.createElement("div");
    labelEl.textContent = tile.type === "earth" ? "Earth" : `Asteroid (Z${tile.zone})`;
    tileEl.appendChild(labelEl);

    const playersEl = document.createElement("div");
    playersEl.classList.add("tile-players");
    playersEl.setAttribute("data-tile-index", tile.index);
    tileEl.appendChild(playersEl);

    boardEl.appendChild(tileEl);
  });
}

export function renderGame(game) {
  renderPlayersOnBoard(game);
  renderCurrentPlayerPanel(game);
  renderPlayersList(game);
  updateControls(game);
}

function renderPlayersOnBoard(game) {
  const playerContainers = document.querySelectorAll(".tile-players");
  playerContainers.forEach((el) => (el.innerHTML = ""));

  game.players.forEach((player, idx) => {
    const container = document.querySelector(
      `.tile-players[data-tile-index="${player.position}"]`
    );
    if (!container) return;
    const token = document.createElement("div");
    token.classList.add("player-token");
    token.style.backgroundColor = COLORS[idx % COLORS.length];
    token.title = player.name;
    container.appendChild(token);
  });
}

function renderCurrentPlayerPanel(game) {
  const player = game.players[game.currentPlayerIndex];
  if (!player) return;

  document.getElementById("current-player-name").textContent = player.name;
  document.getElementById("current-player-position").textContent = player.position;
  document.getElementById("current-player-diamonds").textContent = player.diamonds;
  document.getElementById("current-player-debt").textContent = player.debt;
  document.getElementById("current-player-level").textContent = player.level;
  document.getElementById("current-player-powerups").textContent =
    player.powerUps.length > 0
      ? player.powerUps.map((p) => p.name).join(", ")
      : "None";
}

function renderPlayersList(game) {
  const listEl = document.getElementById("players-list");
  listEl.innerHTML = "";

  game.players.forEach((player, idx) => {
    const row = document.createElement("div");
    row.classList.add("player-summary");
    row.innerHTML = `
      <span style="width:10px;height:10px;border-radius:50%;display:inline-block;background:${COLORS[idx % COLORS.length]};margin-right:4px;"></span>
      <span><strong>${player.name}</strong></span>
      <span>💎 ${player.diamonds}</span>
      <span>Debt: ${player.debt}</span>
      <span>Lvl: ${player.level}</span>
    `;
    listEl.appendChild(row);
  });
}

export function logMessage(message) {
  const logEl = document.getElementById("log");
  const entry = document.createElement("div");
  entry.classList.add("log-entry");
  entry.textContent = message;
  logEl.prepend(entry);
}

function updateControls(game) {
  const rollMoveBtn = document.getElementById("roll-move-btn");
  const rollMineBtn = document.getElementById("roll-mine-btn");
  const endTurnBtn = document.getElementById("end-turn-btn");
  const upgradeShipBtn = document.getElementById("upgrade-ship-btn");
  const powerupButtons = document.querySelectorAll(".powerup-buttons button");

  rollMoveBtn.disabled = !game.phase.canRollMovement;
  rollMineBtn.disabled = !game.phase.canRollMining;
  endTurnBtn.disabled = !game.phase.canEndTurn;

  const currentPlayer = game.players[game.currentPlayerIndex];
  const onEarth = currentPlayer && isEarth(currentPlayer.position);

  upgradeShipBtn.disabled = !onEarth || !game.phase.canUseEarthActions;

  powerupButtons.forEach((btn) => {
    btn.disabled = !onEarth || !game.phase.canUseEarthActions;
  });
}
