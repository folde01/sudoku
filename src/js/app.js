const Board = require('./board');
const board = new Board();
board.solve();
board.removeValuesFromSolvedBoard();
board.renderEmptyBoard();
board.populateBoard();
board.play();



