/* 
sudokuCommon = window.sudokuCommon;
// const boardSize = 9;
// const boardSize = 5;
const boardSize = 3;
const solutionArray = sudokuCommon.generateSolutionArray(boardSize);
sudokuCommon.renderEmptyBoard(boardSize);
sudokuCommon.populateBoard(solutionArray);
*/


const testCases = {
    "case-1-1": {
        boardSize: 1,
        moves: [],
    },
    "case-2-1": {
        boardSize: 2,
        moves: [new Move(0, 0, 1), new Move(1, 1, 2)],
    },
    "case-2-2": {
        boardSize: 2,
        moves: [],
    },
    "case-2-3": {
        boardSize: 2,
        moves: [new Move(0, 0, 1)],
    },
    "case-2-4": {
        boardSize: 2,
        moves: [new Move(0, 0, 2)],
    },
    "case-2-5": {
        boardSize: 2,
        moves: [new Move(1, 1, 2)],
        outcome: []
    },
    "case-2-6": {
        boardSize: 2,
        moves: [ new Move(0, 0, 2), new Move(1, 1, 1)],
    },
    "case-2-7": {
        boardSize: 2,
        moves: [ new Move(1, 1, 2) ],
    },
    "case-3-1": {
        boardSize: 3,
        moves: [ new Move(0, 2, 1), new Move(1, 1, 1), new Move(2, 0, 2) ],
    },
    "case-3-2": {
        boardSize: 3,
        moves: [ new Move(0, 0, 1) ],
    },
    "case-5-1": {
        boardSize: 5,
        moves: [ new Move(0, 4, 1), new Move(1, 1, 1), new Move(2, 0, 1), new Move(3, 3, 1), new Move(4, 2, 1), new Move(0, 0, 2), new Move(1, 4, 2), new Move(2, 1, 2), new Move(3, 2, 2), new Move(4, 3, 2), new Move(0, 2, 3), new Move(1, 0, 3), new Move(2, 4, 3), new Move(3, 1, 3) ],
    },
    "case-5-2": {
        boardSize: 5,
        moves: [ new Move(0, 4, 1) ],
    },
    "case-6-1": {
        boardSize: 6,
        moves: [ new Move(0, 4, 1) ],
    },
    "case-7-1": {
        boardSize: 7,
        moves: [ new Move(0, 4, 1) ],
    },
    "case-8-1": {
        boardSize: 8,
        moves: [ new Move(0, 4, 1) ],
    },
    "case-8-2": {
        boardSize: 8,
        moves: [],
    },
    "case-9-1": {
        boardSize: 9,
        moves: [ new Move(0, 4, 1) ],
    },
    "case-9-2": {
        boardSize: 9,
        moves: [],
    },
};

// const testCaseID = "case-2-3";
// const testCaseID = "case-3-2";
// const testCaseID = "case-2-5";
const testCaseID = "case-9-2";

const boardSize = testCases[testCaseID].boardSize;
const moves =  testCases[testCaseID].moves;


const board = new Board(boardSize);
board.makeMoves(moves);
board.solve();

const boardValues = board.getCurrentBoardValues();
console.log('BOARD VALUES: ' + boardValues);
sudokuCommon = window.sudokuCommon;
sudokuCommon.renderEmptyBoard(boardSize);
sudokuCommon.populateBoard(boardValues);

const allMoves = board.getMoves();
// console.log('MOVES: ' + JSON.stringify(board.getMoves()));

// testCases.forEach(function(testCase, index) {
//     console.assert(JSON.stringify(allMoves) === JSON.stringify(testCase.outcome), 
//     {allMoves: allMoves, errorMsg: testCase.name + " - did not get the expected list of moves"}); 
// });

