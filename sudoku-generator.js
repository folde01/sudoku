sudokuCommon = window.sudokuCommon;
// const boardSize = 9;
// const boardSize = 5;
const boardSize = 5;
const solutionArray = sudokuCommon.generateSolutionArray(boardSize);
sudokuCommon.renderEmptyBoard(boardSize);
sudokuCommon.populateBoard(solutionArray);