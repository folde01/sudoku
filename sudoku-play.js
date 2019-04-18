// OLD:
// window.sudokuCommon.play();

// NEW:

const boardSize = 9;
const moves =  [];


const board = new Board(boardSize);
board.makeMoves(moves);
board.solve();
board.removeValuesFromSolvedBoard();
