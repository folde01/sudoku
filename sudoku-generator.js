/* 
sudokuCommon = window.sudokuCommon;
// const boardSize = 9;
// const boardSize = 5;
const boardSize = 3;
const solutionArray = sudokuCommon.generateSolutionArray(boardSize);
sudokuCommon.renderEmptyBoard(boardSize);
sudokuCommon.populateBoard(solutionArray);
*/


// OK:

// const boardSize = 2;
// const moves = [
//     new Move(0, 0, 1),
//     new Move(1, 1, 2)];

// const boardSize = 2;
// const moves = [
//     new Move(0, 0, 2),
//     new Move(1, 1, 1)];

// const boardSize = 2;
// const moves = [];

// TODO:

const boardSize = 2;
const moves = [
    new Move(1, 1, 2)
];

// const boardSize = 3;
// const moves = [
//     new Move(0, 2, 1), 
//     new Move(1, 1, 1),
//     new Move(2, 0, 2)
// ];

// const boardSize = 5;
// const moves = [ 
//     new Move(0, 4, 1), 
//     new Move(1, 1, 1), 
//     new Move(2, 0, 1), 
//     new Move(3, 3, 1), 
//     new Move(4, 2, 1), 
//     new Move(0, 0, 2), 
//     new Move(1, 4, 2), 
//     new Move(2, 1, 2), 
//     new Move(3, 2, 2), 
//     new Move(4, 3, 2), 
//     new Move(0, 2, 3), 
//     new Move(1, 0, 3), 
//     new Move(2, 4, 3), 
//     new Move(3, 1, 3) ];


const board = new Board(boardSize);
board.makeMoves(moves);

board.solve();

const boardValues = board.getCurrentBoardValues();
console.log('BOARD VALUES: ' + boardValues);
sudokuCommon = window.sudokuCommon;
sudokuCommon.renderEmptyBoard(boardSize);
sudokuCommon.populateBoard(boardValues);
