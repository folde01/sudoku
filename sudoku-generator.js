sudokuCommon = window.sudokuCommon;
const boardSize = 9;
const solutionArray = sudokuCommon.generateSolutionArray(boardSize);
console.log('solution: ' + solutionArray);
sudokuCommon.renderEmptyBoard(boardSize);
sudokuCommon.populateBoard(solutionArray);