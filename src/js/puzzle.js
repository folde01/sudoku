const CellDB = require('./cellDB');
const Move = require('./move');
const Solver = require('./solver');
const Utilities = require('./utilities');
const CONSTANTS = require('./constants');

const log = console.log;

class Puzzle {
    constructor(solver = new Solver()) {
        this.solver = solver;
        this.boardSize = CONSTANTS.boardSize;
        this.cellDB = new CellDB();
        this.solver.setCellDB(this.cellDB);
        this.boxInfo = CONSTANTS.boxInfo;
    }


    // Public methods


    getCellDB() {
        return this.cellDB;
    }

    puzzleIsComplete() {
        return this.solver.puzzleIsComplete();
    }

    tryMove(move) {
        return this.solver.tryMove(move);
    }

    solve() {
        this.solver.solve();
        this._removeCluesFromSolvedBoard();
    }


    // Private methods


    _removeClue(cellX, cellY) {
        if (this.cellDB.getCellValue(cellX, cellY) === 0) {
            return false;
        }

        this.cellDB.setCellValue(cellX, cellY, 0);
        this.cellDB.setCellClueStatus(cellX, cellY, false);

        return true;
    }

    _randomInt(min, max) {
        return Utilities.getRandomInt(min, max);
    }

    _removeCluesFromSolvedBoard(difficulty) {
        let removalFunc;

        if (difficulty === 'dev') {
            removalFunc = this._removeOneClueFromSolvedBoard;
        } else {
            removalFunc = this._removeCluesFromSolvedBoardMediumDifficulty;
        }

        removalFunc.call(this);
    }

    _removeOneClueFromSolvedBoard() {
        // For development purposes
        this._removeClue(0, 0);
    }

    _removeCluesFromSolvedBoardMediumDifficulty() {
        /* 
        
        We need to remove some values from the solved board so it can be played. Removing values must leave the board with rotational symmetry.
        
        To achieve this symmetry, do valid removals until we get to our target number of clues. 
        
        A valid removal means: 
        1) remove the value of the centre cell, and/or
        2) remove values from any pair of cells where the cells aren't on same side and there is a cell in between them
        
        The valid removals are then: centre, ne-sw, nw-se, e-w, and n-s, plus all combinations of these.
        
        To be able to select any combination of these, randomly select DO or SKIP for each one.
        
        In case all are skipped, and in order to avoid having a fully populated box, pick one of the valid removals at random and do it.
        
        An easy board at websudoku.com seems to have 33-36 filled cells ('clues'), depending on the number of filled cells in the center box (nCenter). 
        
        If nCenter is even: nClues = 34 or 36, X = nClues - nCenter. A set of four adjacent boxes is chosen and shares X/2 clues. Remove a value at random from each. Then, until the total number of clues in these boxes is X/2, randomly choose one of the boxes and randomly remove a value. Do the same to the rotationally symmetric cells in the other four boxes. 
        
        If nCenter is odd: nClues = 33 or 35, X = nClues - (nCenter + 1). Repeat as above.

        Skip the removal if it would leave a row, column or box empty.
        */

        let clueCount = this.boardSize * this.boardSize; // 81
        const numCluesRemovedFromCenterBox = this._removeValuesFromCenterBox();
        const centerBoxClueCount = this.boardSize - numCluesRemovedFromCenterBox; // eg. 2 or 3
        clueCount -= numCluesRemovedFromCenterBox; // e.g. 79 or 78
        const clueCountTarget = (clueCount % 2 == 0) ? 35 : 34;
        const clueCountTargetForOneSide = Math.floor((clueCountTarget - centerBoxClueCount) / 2);
        const boxesOfOneSide = ['nw', 'w', 'sw', 's'];
        let removalCountByBox = { 'nw': 0, 'w': 0, 'sw': 0, 's': 0 };

        const board = this;

        // Removes a value from each box and its counterpart
        boxesOfOneSide.forEach(function (box) {
            board._removeRandomClueFromBoxAndItsCounterpart(box);
            removalCountByBox[box]++;
        });

        clueCount -= 2 * boxesOfOneSide.length;

        while (clueCount > clueCountTarget) {
            const box = boxesOfOneSide[Math.floor(Math.random() * boxesOfOneSide.length)];

            // Removes unless 8 have already been removed from box
            if (removalCountByBox[box] < this.boardSize - 1) {

                this._removeRandomClueFromBoxAndItsCounterpart(box);
                removalCountByBox[box]++;
                clueCount -= 2;
            }
        }


    }

    _rotate(coordinate) {
        let result = -1;

        switch (coordinate) {
            case 0:
                result = 2;
                break;
            case 1:
                result = 1;
                break;
            case 2:
                result = 0;
                break;
        }

        return result;
    }

    _removeRandomClueFromBoxAndItsCounterpart(box) {
        const board = this;

        let triedCells = new Set();
        let firstValueWasRemoved = false;

        // Loops until we actually remove values
        while (!firstValueWasRemoved && triedCells.size < this.boardSize) {

            // Tries to remove the value of a cell in box:

            const boxInfo = this.boxInfo[box];
            const startCellX = boxInfo.startCellX;
            const endCellX = boxInfo.endCellX;
            const startCellY = boxInfo.startCellY;
            const endCellY = boxInfo.endCellY;
            const counterpartBox = boxInfo.counterpart;

            const cellX = this._randomInt(startCellX, endCellX);
            const cellY = this._randomInt(startCellY, endCellY);

            // Keeps track of cells seen so far, so we don't loop forever.

            triedCells.add(cellX.toString() + cellY.toString());

            firstValueWasRemoved = board._removeClue(cellX, cellY);

            // Tries to remove the value of the corresponding cell in the counterpart box:

            const boxInfo2 = this.boxInfo[counterpartBox];
            const startCellX2 = boxInfo2.startCellX;
            const endCellX2 = boxInfo2.endCellX;
            const startCellY2 = boxInfo2.startCellY;
            const endCellY2 = boxInfo2.endCellY;

            const cellX2 = this._rotate(cellX % 3) + startCellX2;
            const cellY2 = this._rotate(cellY % 3) + startCellY2;

            board._removeClue(cellX2, cellY2);
        }

        return firstValueWasRemoved;
    }

    _removeValuesFromCenterBox() {
        // 33 43 53   nw n ne 
        // 34 44 54 = w  c  e
        // 35 45 55   sw s se

        let removals = {
            'nw-se': [{ cellX: 3, cellY: 3 }, { cellX: 5, cellY: 5 }],
            'sw-ne': [{ cellX: 3, cellY: 5 }, { cellX: 5, cellY: 3 }],
            'e-w': [{ cellX: 3, cellY: 4 }, { cellX: 5, cellY: 4 }],
            'n-s': [{ cellX: 4, cellY: 3 }, { cellX: 4, cellY: 5 }],
            'c': [{ cellX: 4, cellY: 4 }]
        };

        const removalKeys = Object.keys(removals);

        let booleans = [];
        let allRemoved = true;
        let noneRemoved = true;

        for (let i = 0; i < removalKeys.length; i++) {
            const bool = Math.random() >= 0.5;
            booleans[i] = bool;

            if (bool) {
                noneRemoved = false;
            } else {
                allRemoved = false;
            }
        }

        if (noneRemoved || allRemoved) {
            const randIndex = this._randomInt(0, removalKeys.length - 1);
            booleans[randIndex] = !booleans[randIndex];
        }


        const board = this;
        let removedValueCount = 0;

        for (let k = 0; k < removalKeys.length; k++) {
            const bool = booleans[k];
            const key = removalKeys[k];

            if (bool) {
                removals[key].forEach(function (cell, index) {
                    board._removeClue(cell.cellX, cell.cellY);
                    ++removedValueCount;
                });
            }
        }

        return removedValueCount;
    }

}

module.exports = Puzzle;