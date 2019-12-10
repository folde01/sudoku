const CONSTANTS = {
  boardSize: 9,
  boxInfo: {
    'nw': { startCellX: 0, endCellX: 2, startCellY: 0, endCellY: 2, counterpart: 'se' },
    'n': { startCellX: 3, endCellX: 5, startCellY: 0, endCellY: 2, counterpart: 's' },
    'ne': { startCellX: 6, endCellX: 8, startCellY: 0, endCellY: 2, counterpart: 'sw' },
    'w': { startCellX: 0, endCellX: 2, startCellY: 3, endCellY: 5, counterpart: 'e' },
    'c': { startCellX: 3, endCellX: 5, startCellY: 3, endCellY: 5, counterpart: 'c' },
    'e': { startCellX: 6, endCellX: 8, startCellY: 3, endCellY: 5, counterpart: 'w' },
    'sw': { startCellX: 0, endCellX: 2, startCellY: 6, endCellY: 8, counterpart: 'ne' },
    's': { startCellX: 3, endCellX: 5, startCellY: 6, endCellY: 8, counterpart: 'n' },
    'se': { startCellX: 6, endCellX: 8, startCellY: 6, endCellY: 8, counterpart: 'nw' }
  }
};

module.exports = CONSTANTS;