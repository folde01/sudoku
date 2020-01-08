const CONSTANTS = require('./constants');

/**
 * @classdesc The CellDB stores the game state, including the value placed in each cell (either as a clue or by the user) and whether cell's value puts it in conflict with another cell.
 */
class CellDB {
    constructor() {
        this._boardSize = 9;
        this._cellDB = this._initialize();
        this._boxInfo = CONSTANTS.boxInfo;
        this._cellValueCounts = new Array(this._boardSize + 1).fill(0);
        this._countCompleteCellValues = 0;
        this._filledCellCount = 0;
        this._playOrder = [];
        this._gameHasStarted = false;
    }

    // Public methods

    getFilledCellCount() {
        return this._filledCellCount;
    }

    // _setLastCellPlayed(cellX, cellY) {
    //     this._playOrder.push([cellX, cellY]);
    // }

    // _getLastCellPlayed() {
    //     // return this._lastCellPlayed;
    // }

    startGame() {
        this._gameHasStarted = true;
    }

    _gameIsInProgress() {
        return this._gameHasStarted;
    }

    _addPlay(cellX, cellY) {
        if (!this._gameIsInProgress()) return;
        // this._playOrder.push([cellX, cellY]);
        this._playOrder.push(cellX.toString() + '-' + cellY.toString());
        console.log(this.getPlayOrder());
    }

    // for back button
    removeLastPlay() {
        if (!this._gameIsInProgress()) return;

        // console.log(this.getPlayOrder());
        return this._playOrder.pop();
    }

    _removePlay(cellX, cellY) {
        if (!this._gameIsInProgress()) return;

        const playOrder = this._playOrder;
        const index = playOrder.indexOf(cellX.toString() + '-' + cellY.toString());
        // const index = playOrder.indexOf([cellX, cellY]);

        if (index > -1) {
            playOrder.splice(index, 1);
        }
        console.log(this.getPlayOrder());
    }

    getPlayOrder() {
        return this._playOrder;
    }

    setCellValue(cellX, cellY, cellValue) {
        const oldCellValue = this.getCellValue(cellX, cellY);
        this._cellDB[cellY][cellX].cellValue = cellValue;

        if (oldCellValue === 0 && cellValue > 0) {
            this._filledCellCount++;
            this._addPlay(cellX, cellY);
        } else if (oldCellValue > 0 && cellValue === 0) {
            this._filledCellCount--;
            this._removePlay(cellX, cellY);
        }
    }

    getCellValue(cellX, cellY) {
        return this._cellDB[cellY][cellX].cellValue;
    }

    getRowValues(cellY) {
        return this._cellDB[cellY].map((cell) => cell.cellValue);
    }

    getColumnValues(cellX) {
        let cellValues = [];

        for (let cellY = 0; cellY < this._boardSize; cellY++) {
            cellValues.push(this._cellDB[cellY][cellX].cellValue);
        }

        return cellValues;
    }

    getBoxValues(box) {
        let cellValues = [];

        const boxInfo = this._boxInfo[box];

        for (let cellX = boxInfo.startCellX; cellX <= boxInfo.endCellX; cellX++) {
            for (let cellY = boxInfo.startCellY; cellY <= boxInfo.endCellY; cellY++) {
                cellValues.push(this.getCellValue(cellX, cellY));
            }
        }

        return cellValues;
    }

    setCellClueStatus(cellX, cellY, isClue) {
        this._cellDB[cellY][cellX].isClue = isClue;
    }

    getCellClueStatus(cellX, cellY) {
        return this._cellDB[cellY][cellX].isClue;
    }

    cellIsEmpty(cellX, cellY) {
        if (this.getCellValue(cellX, cellY) === 0) {
            return true;
        }
        return false;
    }

    getConflictStatus(cellX, cellY) {
        return this._cellDB[cellY][cellX].conflicting;
    }

    setConflictStatus(cellX, cellY, status) {
        this._cellDB[cellY][cellX].conflicting = status;
    }

    getBoxInfo() {
        return this._boxInfo;
    }

    getCellValueCount(cellValue) {
        return this._cellValueCounts[cellValue];
    }

    incrementCellValueCount(cellValue) {
        this._cellValueCounts[cellValue]++;

        if (this._cellValueCounts[cellValue] === this._boardSize) {
            this._countCompleteCellValues++;
        }
    }

    decrementCellValueCount(cellValue) {
        if (this._cellValueCounts[cellValue] === this._boardSize) {
            this._countCompleteCellValues--;
        }

        this._cellValueCounts[cellValue]--;
    }

    getCompleteCellValueCount() {
        return this._countCompleteCellValues;
    }


    rowIsValid(move) {
        for (let cellX = 0; cellX < this._boardSize; cellX++) {
            if (cellX !== move.getCellX() && (!this.cellIsEmpty(cellX, move.getCellY())) && this.getCellValue(cellX, move.getCellY()) === move.getCellValue()) {
                return false;
            }
        }
        return true;
    }

    boxIsValid(move) {
        let result = true;

        // todo: these start/end values should be calculated once at the beginning at then just accessed.
        const startRow = Math.floor(move.getCellY() / 3) * 3;
        const endRow = startRow + 2;
        const startColumn = Math.floor(move.getCellX() / 3) * 3;
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

        for (let j = 0; j < this._boardSize; j++) {
            if (this.getCellValue(move.getCellX(), j) !== 0 && this.getCellValue(move.getCellX(), j) === move.getCellValue()) {
                result = false;
            }
        }

        return result;
    }


    // Private methods


    _initialize() {
        const boardSize = this._boardSize;
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