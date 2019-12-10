const CONSTANTS = require('./constants');

class CellDB {
    constructor() {
        this.boardSize = 9;
        this.cellDB = this._initialize();
        this.boxInfo = CONSTANTS.boxInfo;
        this.cellValueCounts = new Array(this.boardSize + 1).fill(0);
        this.countCompleteCellValues = 0;
        this.filledCellCount = 0;
    }

    
    // Public methods


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

    getBoxValues(box) {
        let cellValues = [];

        const boxInfo = this.boxInfo[box];

        for (let cellX = boxInfo.startCellX; cellX <= boxInfo.endCellX; cellX++) {
            for (let cellY = boxInfo.startCellY; cellY <= boxInfo.endCellY; cellY++) {
                cellValues.push(this.getCellValue(cellX, cellY));
            }
        }

        return cellValues;
    }

    setCellClueStatus(cellX, cellY, isClue) {
        this.cellDB[cellY][cellX].isClue = isClue;
    }

    getCellClueStatus(cellX, cellY) {
        return this.cellDB[cellY][cellX].isClue;
    }

    cellIsEmpty(cellX, cellY) {
        if (this.getCellValue(cellX, cellY) === 0) {
            return true;
        }
        return false;
    }

    getConflictStatus(cellX, cellY) {
        return this.cellDB[cellY][cellX].conflicting;
    }

    setConflictStatus(cellX, cellY, status) {
        this.cellDB[cellY][cellX].conflicting = status;
    }

    getBoxInfo() {
        return this.boxInfo;
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
        for (let cellX = 0; cellX < this.boardSize; cellX++) {
            if (cellX !== move.cellX && (!this.cellIsEmpty(cellX, move.cellY)) && this.getCellValue(cellX, move.cellY) === move.cellValue) {
                return false;
            }
        }
        return true;
    }

    boxIsValid(move) {
        let result = true;

        // todo: these start/end values should be calculated once at the beginning at then just accessed.
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

    // Private methods

    _initialize() {
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
}

module.exports = CellDB;