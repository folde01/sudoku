const CONSTANTS = require('./constants');

class CellDB {
    constructor() {
        this.boardSize = 9;
        this.cellDB = this.initialize();
        this.regionInfo = CONSTANTS.regionInfo;
        this.cellValueCounts = new Array(this.boardSize + 1).fill(0);
        this.countCompleteCellValues = 0;
        this.filledCellCount = 0;
    }

    initialize() {

        const boardSize = this.boardSize;
        let cellDB = new Array(boardSize);

        for (let i = 0; i < boardSize; i++) {
            cellDB[i] = new Array(boardSize);

            for (let j = 0; j < boardSize; j++) {
                cellDB[i][j] = {
                    cellValue: 0,
                    conflicting: false,
                    isClue: true,
                    solutionValue: null,
                    eventListener: { event: null, fn: null }
                };
            }

        }
        return cellDB;
    }

    getFilledCellCount() {
        return this.filledCellCount;
    }

    setCellValue(cellX, cellY, cellValue) {

        const oldCellValue = this.getCellValue(cellX, cellY);
        this.cellDB[cellY][cellX].cellValue = cellValue;

        if (oldCellValue === 0 && cellValue > 0) {
            this.filledCellCount++;
        } else if (oldCellValue > 0 && cellValue === 0) {
            this.filledCellCount--;
        }
    }

    getCellValue(cellX, cellY) {
        return this.cellDB[cellY][cellX].cellValue;
    }

    getRowValues(cellY) {
        return this.cellDB[cellY].map((cell) => cell.cellValue);
    }

    getColumnValues(cellX) {
        let cellValues = [];

        for (let cellY = 0; cellY < this.boardSize; cellY++) {
            cellValues.push(this.cellDB[cellY][cellX].cellValue);
        }

        return cellValues;
    }

    getRegionValues(region) {
        let cellValues = [];

        const regionInfo = this.regionInfo[region];

        for (let cellX = regionInfo.startCellX; cellX <= regionInfo.endCellX; cellX++) {
            for (let cellY = regionInfo.startCellY; cellY <= regionInfo.endCellY; cellY++) {
                cellValues.push(this.getCellValue(cellX, cellY));
            }
        }

        return cellValues;
    }

    setCellEventListener(cellX, cellY, event, fn) {
        this.cellDB[cellY][cellX].eventListener.event = event;
        this.cellDB[cellY][cellX].eventListener.fn = fn;
    }

    getCellEventListener(cellX, cellY) {
        return this.cellDB[cellY][cellX].eventListener;
    }

    setCellClueStatus(cellX, cellY, isClue) {
        this.cellDB[cellY][cellX].isClue = isClue;
    }

    getCellClueStatus(cellX, cellY) {
        return this.cellDB[cellY][cellX].isClue;
    }

    getCellSolutionValue(cellX, cellY) {
        return this.cellDB[cellY][cellX].solutionValue;
    }

    setCellSolutionValue(cellX, cellY, solutionValue) {
        this.cellDB[cellY][cellX].solutionValue = solutionValue;
    }

    removeCellSolutionValue(cellX, cellY) {
        this.cellDB[cellY][cellX].solutionValue = null;
    }

    cellIsEmpty(cellX, cellY) {
        if (this.getCellValue(cellX, cellY) === 0) {
            return true;
        }
        return false;
    }

    getCurrentBoardValues() {
        const merged = [].concat.apply([], this.cellDB.map((elem) => elem.cellValue));
        return merged;
    }

    getConflictStatus(cellX, cellY) {
        return this.cellDB[cellY][cellX].conflicting;
    }

    setConflictStatus(cellX, cellY, status) {
        this.cellDB[cellY][cellX].conflicting = status;
    }

    columnContainsCellValue(cellX, cellValue) {
        for (let cellY = 0; cellY < this.boardSize; cellY++) {
            if (cellValue === this.getCellValue(cellX, cellY)) {
                return true;
            }
        }
        return false;
    }

    getEmptyCellsInColumn(cellX) {
        let emptyCells = [];

        for (let cellY = 0; cellY < this.boardSize; cellY++) {
            if (this.cellIsEmpty(cellX, cellY)) {
                emptyCells.push(cellY);
            }
        }

        return emptyCells;
    }

    getRegionInfo() {
        return this.regionInfo;
    }

    getCellValueCount(cellValue) {
        return this.cellValueCounts[cellValue];
    }

    incrementCellValueCount(cellValue) {
        this.cellValueCounts[cellValue]++;

        if (this.cellValueCounts[cellValue] === this.boardSize) {
            this.countCompleteCellValues++;
        }
    }

    decrementCellValueCount(cellValue) {
        if (this.cellValueCounts[cellValue] === this.boardSize) {
            this.countCompleteCellValues--;
        }

        this.cellValueCounts[cellValue]--;
    }

    getCompleteCellValueCount() {
        return this.countCompleteCellValues;
    }

    rowIsValid(move) {
        // todo: return if false
        let result = true;

        for (let cellX = 0; cellX < this.boardSize; cellX++) {
            if (this.getCellValue(cellX, move.cellY) !== 0 && this.getCellValue(cellX, move.cellY) === move.cellValue) {
                result = false;
            }
        }
        return result;
    }

    // rowIsValid(move) {
    //     for (let cellX = 0; cellX < this.boardSize; cellX++) {
    //         if (cellX !== move.cellX && this.getCellValue(cellX, move.cellY) !== 0 && this.getCellValue(cellX, move.cellY) === move.cellValue) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }

    regionIsValid(move) {
        // todo: return if false
        let result = true;

        const startRow = Math.floor(move.cellY / 3) * 3;
        const endRow = startRow + 2;
        const startColumn = Math.floor(move.cellX / 3) * 3;
        const endColumn = startColumn + 2;

        for (let j = startRow; j <= endRow; j++) {
            for (let i = startColumn; i <= endColumn; i++) {
                if (this.getCellValue(i, j) !== 0 && this.getCellValue(i, j) === move.cellValue) {
                    result = false;
                }
            }
        }

        return result;
    }

    columnIsValid(move) {
        // todo: return if false
        let result = true;

        for (let j = 0; j < this.boardSize; j++) {
            if (this.getCellValue(move.cellX, j) !== 0 && this.getCellValue(move.cellX, j) === move.cellValue) {
                result = false;
            }
        }

        return result;
    }

}

module.exports = CellDB;