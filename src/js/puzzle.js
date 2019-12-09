const CellDB = require('./cellDB');
const Move = require('./move');
const Solver = require('./solver');
const CONSTANTS = require('./constants');

const log = console.log;

class Puzzle {
    constructor() {
        this.boardSize = CONSTANTS.boardSize;
        this.cellDB = new CellDB();
        this.regionInfo = CONSTANTS.regionInfo;
        this.validMoveCount = 0;
        this.moveAttempts = 0;
    }

    makeMoves(moves) {
        const self = this;
        moves.forEach(function (move, index) {
            self.tryMove(move);
        });
    }

    getMoves() {
        return this.moves;
    }

    getCellDB() {
        return this.cellDB;
    }

    randomInt(min, max) {
        const ceilMin = Math.ceil(min);
        const floorMax = Math.floor(max);
        return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
    }

    solve() {
        let solver = new Solver(this.cellDB);
        solver.solve();
        this.removeCluesFromSolvedBoard();
    }

    removeClue(cellX, cellY) {
        if (this.cellDB.getCellValue(cellX, cellY) === 0) {
            return false;
        }

        this.cellDB.setCellValue(cellX, cellY, 0);
        this.cellDB.setCellClueStatus(cellX, cellY, false);

        return true;
    }

    removeCluesFromSolvedBoard(difficulty) {
        let removalFunc;

        if (difficulty === 'dev') {
            removalFunc = this.removeOneClueFromSolvedBoard;
        } else {
            removalFunc = this.removeCluesFromSolvedBoardMediumDifficulty;
        }

        removalFunc.call(this);
    }

    removeAllCluesInColumn(column) {
        // for testing only
        for (let row = 0; row < this.boardSize; row++) {
            this.removeClue(column, row);
        }
    }

    removeOneClueFromSolvedBoard() {
        // For development purposes
        this.removeClue(0, 0);
    }

    removeCluesFromSolvedBoardMediumDifficulty() {
        /* 
        
        We need to remove some values from the solved board so it can be played. Removing values must leave the board with rotational symmetry.
        
        The set of valid removals for center region, to achieve this symmetry: 
        1) remove the value of the centre cell
        2) remove values from any pair of cells where the cells aren't on same side and there is a cell in between them
        3) any combination of 1 and 2
        
        The valid removals are then: centre, ne-sw, nw-se, e-w, and n-s, plus all combination of these.
        
        To be able to select any combination of these, randomly select DO or SKIP for each one.
        
        In case all are skipped, in order to avoid having a fully populated region, pick one of the valid removals at random and do it.
        
        An easy board at websudoku.com seems to have 33-36 filled cells ('clues'), depending on the number of filled cells in the center region (nCenter). 
        
        If nCenter is even: nClues = 34 or 36, X = nClues - nCenter. A set of four adjacent regions is chosen and shares X/2 clues. Remove a value at random from each. Then, until the total number of clues in these regions is X/2, randomly choose one of the regions and randomly remove a value. Do the same to the rotationally symmetric cells in the other four regions. 
        
        If nCenter is odd: nClues = 33 or 35, X = nClues - (nCenter + 1). Repeat as above.

        Skip the removal if it would leave a row, column or region empty.
        */

        let clueCount = this.boardSize * this.boardSize; // 81
        const numCluesRemovedFromCenterRegion = this.removeValuesFromCenterRegion();
        const centerRegionClueCount = this.boardSize - numCluesRemovedFromCenterRegion; // eg. 2 or 3
        clueCount -= numCluesRemovedFromCenterRegion; // e.g. 79 or 78
        const clueCountTarget = (clueCount % 2 == 0) ? 35 : 34;
        // const clueCountTarget = (clueCount % 2 == 0) ? 65 : 64;
        // const clueCountTarget = (clueCount % 2 == 0) ? 75 : 74;
        const clueCountTargetForOneSide = Math.floor((clueCountTarget - centerRegionClueCount) / 2);
        const regionsOfOneSide = ['nw', 'w', 'sw', 's'];
        let removalCountByRegion = { 'nw': 0, 'w': 0, 'sw': 0, 's': 0 };

        const board = this;

        // Removes a value from each region and its counterpart
        regionsOfOneSide.forEach(function (region) {
            board.removeRandomClueFromRegionAndItsCounterpart(region);
            removalCountByRegion[region]++;
        });

        clueCount -= 2 * regionsOfOneSide.length;

        while (clueCount > clueCountTarget) {
            const region = regionsOfOneSide[Math.floor(Math.random() * regionsOfOneSide.length)];

            // Removes unless 8 have already been removed from region
            if (removalCountByRegion[region] < this.boardSize - 1) {

                this.removeRandomClueFromRegionAndItsCounterpart(region);
                removalCountByRegion[region]++;
                clueCount -= 2;
            }
        }


    }

    rotate(coordinate) {
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

    removeRandomClueFromRegionAndItsCounterpart(region) {
        const board = this;

        let triedCells = new Set();
        let firstValueWasRemoved = false;

        // Loops until we actually remove values
        while (!firstValueWasRemoved && triedCells.size < this.boardSize) {

            // Tries to remove the value of a cell in region:

            const regionInfo = this.regionInfo[region];
            const startCellX = regionInfo.startCellX;
            const endCellX = regionInfo.endCellX;
            const startCellY = regionInfo.startCellY;
            const endCellY = regionInfo.endCellY;
            const counterpartRegion = regionInfo.counterpart;

            const cellX = this.randomInt(startCellX, endCellX);
            const cellY = this.randomInt(startCellY, endCellY);

            // Keeps track of cells seen so far, so we don't loop forever.

            triedCells.add(cellX.toString() + cellY.toString());

            firstValueWasRemoved = board.removeClue(cellX, cellY);

            // Tries to remove the value of the corresponding cell in the counterpart region:

            const regionInfo2 = this.regionInfo[counterpartRegion];
            const startCellX2 = regionInfo2.startCellX;
            const endCellX2 = regionInfo2.endCellX;
            const startCellY2 = regionInfo2.startCellY;
            const endCellY2 = regionInfo2.endCellY;

            const cellX2 = this.rotate(cellX % 3) + startCellX2;
            const cellY2 = this.rotate(cellY % 3) + startCellY2;

            board.removeClue(cellX2, cellY2);
        }

        return firstValueWasRemoved;
    }

    removeValuesFromCenterRegion() {
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
            const randIndex = this.randomInt(0, removalKeys.length - 1);
            booleans[randIndex] = !booleans[randIndex];
        }


        const board = this;
        let removedValueCount = 0;

        for (let k = 0; k < removalKeys.length; k++) {
            const bool = booleans[k];
            const key = removalKeys[k];

            if (bool) {
                removals[key].forEach(function (cell, index) {
                    board.removeClue(cell.cellX, cell.cellY);
                    ++removedValueCount;
                });
            }
        }

        return removedValueCount;
    }
}

module.exports = Puzzle;