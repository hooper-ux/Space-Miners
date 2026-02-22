import { generateBoard, getBoardLength, getZoneForPosition, isEarth } from "./board.js";
import { rollMovementDie, rollMiningDie } from "./dice.js";
import { createDangerDeck, drawDangerCard, applyDangerCard, POWER_UPS } from "./cards.js";
import { initUI, renderGame, logMessage } from "./ui.js";

const WIN_DIAMONDS = 50;

const game = {
  players: [],
  currentPlayerIndex: 0,
  board: generateBoard(),
  dangerDeck: [],
  phase: {
    canRollMovement: false,
    canRollMining: false,
    canEndTurn: false,
    canUseEarthActions: false,
  },
  rollMiningDie, // used by cards
};

function createPlayer(name) {
  return {
    name,
    position: 0,
    diamonds: 0,
    debt: 0,
    level: 1,
    powerUps: [],
    skipNextTurn: false,
  };
}

function resetGameState(playerCount) {
  game.players = [];
  for (let i = 0; i < playerCount; i++) {
    game.players.push(createPlayer(`Player ${i + 1}`));
  }
  game.currentPlayerIndex = 0;
  game.board = generateBoard();
  game.dangerDeck = createDangerDeck();
  game.phase = {
    canRollMovement: true,
    canRollMining: false,
    canEndTurn: false,
    canUseEarthActions: false,
  };
}

function startGame() {
  const input = document.getElementById("player-count");
  const count = parseInt(input.value, 10);
  if (isNaN(count) || count < 2 || count > 5) {
    alert("Please choose between 2 and 5 players.");
    return;
  }

  resetGameState(count);
  logMessage(`New game started with ${count} players.`);
  renderGame(game);
}

function handleRollMovement() {
  const player = game.players[game.currentPlayerIndex];
  if (!game.phase.canRollMovement) return;

  if (player.skipNextTurn) {
    logMessage(`${player.name} skips this turn due to Alien Attack.`);
    player.skipNextTurn = false;
    endTurn();
    return;
  }

  const roll = rollMovementDie();
  logMessage(`${player.name} rolled ${roll} on the movement die.`);

  const newPos = Math.min(player.position + roll, getBoardLength() - 1);
  player.position = newPos;

  if (isEarth(player.position)) {
    logMessage(`${player.name} landed on Earth.`);
    // Earth pay: 3 diamonds
    player.diamonds += 3;
    logMessage(`${player.name} collected 3 diamonds on Earth.`);
    game.phase.canUseEarthActions = true;
  } else {
    game.phase.canUseEarthActions = false;
  }

  game.phase.canRollMovement = false;
  game.phase.canRollMining = true;
  game.phase.canEndTurn = false;

  renderGame(game);
}

function handleRollMining() {
  const player = game.players[game.currentPlayerIndex];
  if (!game.phase.canRollMining) return;

  const roll = rollMiningDie();
  logMessage(`${player.name} rolled ${roll} on the mining die.`);

  if (roll === 6) {
    const card = drawDangerCard(game);
    logMessage(`${player.name} drew a Danger Card: ${card.name}.`);
    applyDangerCard(card, player, game, logMessage);
  } else if (roll === 1) {
    // Always get 1 diamond
    player.diamonds += 1;
    logMessage(`${player.name} mined 1 diamond.`);
  } else {
    // 2–5: only if in a mineable zone
    if (!isEarth(player.position)) {
      const zone = getZoneForPosition(player.position);
      const canMine = canPlayerMineInZone(player, zone);
      if (canMine) {
        player.diamonds += roll;
        logMessage(`${player.name} mined ${roll} diamonds in Zone ${zone}.`);
      } else {
        logMessage(
          `${player.name} cannot mine in Zone ${zone} with a level ${player.level} ship.`
        );
      }
    } else {
      logMessage(`${player.name} is on Earth and cannot mine multiple diamonds here.`);
    }
  }

  checkWinCondition(player);

  game.phase.canRollMovement = false;
  game.phase.canRollMining = false;
  game.phase.canEndTurn = true;

  renderGame(game);
}

function canPlayerMineInZone(player, zone) {
  if (zone === 1 && player.level >= 1) return true;
  if (zone === 2 && player.level >= 2) return true;
  if (zone === 3 && player.level >= 3) return true;
  return false;
}

function handleEndTurn() {
  if (!game.phase.canEndTurn) return;
  endTurn();
}

function endTurn() {
  game.phase.canRollMovement = true;
  game.phase.canRollMining = false;
  game.phase.canEndTurn = false;
  game.phase.canUseEarthActions = false;

  game.currentPlayerIndex =
    (game.currentPlayerIndex + 1) % game.players.length;

  const nextPlayer = game.players[game.currentPlayerIndex];
  logMessage(`It is now ${nextPlayer.name}'s turn.`);
  renderGame(game);
}

function handleUpgradeShip() {
  const player = game.players[game.currentPlayerIndex];
  if (!game.phase.canUseEarthActions) return;
  if (!isEarth(player.position)) return;

  let cost;
  if (player.level === 1) cost = 10;
  else if (player.level === 2) cost = 20;
  else {
    logMessage(`${player.name} is already at max ship level (3).`);
    return;
  }

  if (player.diamonds < cost) {
    logMessage(
      `${player.name} does not have enough diamonds to upgrade (needs ${cost}).`
    );
    return;
  }

  player.diamonds -= cost;
  player.level += 1;
  logMessage(`${player.name} upgraded their ship to level ${player.level}.`);
  renderGame(game);
}

function handleBuyPowerUp(id) {
  const player = game.players[game.currentPlayerIndex];
  if (!game.phase.canUseEarthActions) return;
  if (!isEarth(player.position)) return;

  const powerUp = POWER_UPS[id];
  if (!powerUp) return;

  if (player.diamonds < powerUp.cost) {
    logMessage(
      `${player.name} does not have enough diamonds to buy ${powerUp.name} (cost ${powerUp.cost}).`
    );
    return;
  }

  player.diamonds -= powerUp.cost;
  player.powerUps.push(powerUp);
  logMessage(`${player.name} bought ${powerUp.name}.`);
  renderGame(game);
}

function checkWinCondition(player) {
  if (player.diamonds >= WIN_DIAMONDS && isEarth(player.position)) {
    logMessage(`${player.name} has reached 50 diamonds and returned to Earth. They win!`);
    // Lock the game
    game.phase.canRollMovement = false;
    game.phase.canRollMining = false;
    game.phase.canEndTurn = false;
    game.phase.canUseEarthActions = false;
  }
}

export function initGame() {
  initUI(game, {
    onStartGame: startGame,
    onRollMovement: handleRollMovement,
    onRollMining: handleRollMining,
    onEndTurn: handleEndTurn,
    onUpgradeShip: handleUpgradeShip,
    onBuyPowerUp: handleBuyPowerUp,
  });
}

document.addEventListener("DOMContentLoaded", initGame);
