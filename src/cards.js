import { shuffle } from "./utils.js";

export const POWER_UPS = {
  forceField: {
    id: "forceField",
    name: "Force Field",
    cost: 10,
    protects: "Meteor Shower",
  },
  laserCannon: {
    id: "laserCannon",
    name: "Laser Cannon",
    cost: 5,
    protects: "Space Pirates",
  },
  sensors: {
    id: "sensors",
    name: "Long Range Sensors",
    cost: 5,
    protects: "Alien Attack",
  },
  thrusters: {
    id: "thrusters",
    name: "Emergency Thrusters",
    cost: 5,
    protects: "Emergency Landing",
  },
};

export function createDangerDeck() {
  const baseCards = [
    { id: "emergencyLanding", name: "Emergency Landing", type: "Emergency Landing" },
    { id: "meteorShower", name: "Meteor Shower", type: "Meteor Shower" },
    { id: "alienAttack", name: "Alien Attack", type: "Alien Attack" },
    { id: "spacePirates", name: "Space Pirates", type: "Space Pirates" },
  ];

  // 16 cards total: 4 of each
  const deck = [];
  baseCards.forEach((card) => {
    for (let i = 0; i < 4; i++) {
      deck.push({ ...card });
    }
  });

  return shuffle(deck);
}

export function drawDangerCard(game) {
  if (game.dangerDeck.length === 0) {
    game.dangerDeck = createDangerDeck();
  }
  return game.dangerDeck.pop();
}

export function applyDangerCard(card, player, game, logFn) {
  const hasProtection = player.powerUps.find(
    (p) => p.protects === card.type
  );

  if (hasProtection) {
    logFn(`${player.name}'s ${hasProtection.name} protected them from ${card.type}.`);
    return;
  }

  switch (card.type) {
    case "Emergency Landing":
      if (player.powerUps.length > 0) {
        const removed = player.powerUps.pop();
        logFn(`${player.name} lost a power-up (${removed.name}) due to Emergency Landing.`);
      } else {
        logFn(`${player.name} had no power-ups to lose from Emergency Landing.`);
      }
      break;

    case "Meteor Shower":
      if (player.level > 1) {
        player.level -= 1;
        logFn(`${player.name} was hit by a Meteor Shower and dropped to level ${player.level}.`);
      } else {
        logFn(`${player.name} was hit by a Meteor Shower but is already at level 1.`);
      }
      break;

    case "Alien Attack":
      player.skipNextTurn = true;
      logFn(`${player.name} was hit by an Alien Attack and will skip their next turn.`);
      break;

    case "Space Pirates": {
      const lossRoll = game.rollMiningDie();
      const totalLoss = lossRoll + 2;
      const actualLoss = Math.min(player.diamonds, totalLoss);
      player.diamonds -= actualLoss;
      logFn(
        `${player.name} was raided by Space Pirates and lost ${actualLoss} diamonds (rolled ${lossRoll} + 2).`
      );
      break;
    }

    default:
      logFn(`Unknown danger card: ${card.type}`);
  }
}
