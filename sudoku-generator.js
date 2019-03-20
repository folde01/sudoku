sudokuCommon = window.sudokuCommon;
const boardSize = 9;
const solutionArray = sudokuCommon.generateSolutionArray(boardSize);
sudokuCommon.renderEmptyBoard(boardSize);
sudokuCommon.populateBoard(solutionArray);