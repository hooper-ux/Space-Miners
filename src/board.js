// Simple linear board: index 0 = Earth, last index = Earth (return)
// Asteroids in between, divided into 3 zones.

const BOARD_LENGTH = 18; // 0..17
const EARTH_POSITIONS = [0, BOARD_LENGTH - 1];

export function generateBoard() {
  const tiles = [];
  for (let i = 0; i < BOARD_LENGTH; i++) {
    const isEarth = EARTH_POSITIONS.includes(i);
    const type = isEarth ? "earth" : "asteroid";
    const zone = isEarth ? null : getZoneForPosition(i);
    tiles.push({ index: i, type, zone });
  }
  return tiles;
}

export function getZoneForPosition(position) {
  // Ignore Earth positions
  if (EARTH_POSITIONS.includes(position)) return null;

  const third = (BOARD_LENGTH - 2) / 3; // exclude both Earth tiles
  const offset = position - 1;

  if (offset < third) return 1;
  if (offset < 2 * third) return 2;
  return 3;
}

export function isEarth(position) {
  return EARTH_POSITIONS.includes(position);
}

export function getBoardLength() {
  return BOARD_LENGTH;
}
