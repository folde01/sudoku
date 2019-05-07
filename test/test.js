const Move = require('../sudoku-move.js');
const Board = require('../sudoku-board.js');

// const boardSize = 9;
// const moves =  [];
const board = new Board();
// board.makeMoves(moves);
board.solve();

console.log(board.getMoves());

