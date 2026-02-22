import { randomInt } from "./utils.js";

export function rollMovementDie() {
  // Movement die: only 1s and 2s
  return randomInt(1, 2);
}

export function rollMiningDie() {
  // Standard 6-sided die
  return randomInt(1, 6);
}
