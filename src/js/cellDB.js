class CellDB {
    constructor() {
        this.boardSize = 9;
        this.cellDB = this.initialize();
        this.regionInfo = {
            'nw': { startCellX: 0, endCellX: 2, startCellY: 0, endCellY: 2, counterpart: 'se' },
            'n': { startCellX: 3, endCellX: 5, startCellY: 0, endCellY: 2, counterpart: 's' },
            'ne': { startCellX: 6, endCellX: 8, startCellY: 0, endCellY: 2, counterpart: 'sw' },
            'w': { startCellX: 0, endCellX: 2, startCellY: 3, endCellY: 5, counterpart: 'e' },
            'c': { startCellX: 3, endCellX: 5, startCellY: 3, endCellY: 5, counterpart: 'c' },
            'e': { startCellX: 6, endCellX: 8, startCellY: 3, endCellY: 5, counterpart: 'w' },
            'sw': { startCellX: 0, endCellX: 2, startCellY: 6, endCellY: 8, counterpart: 'ne' },
            's': { startCellX: 3, endCellX: 5, startCellY: 6, endCellY: 8, counterpart: 'n' },
            'se': { startCellX: 6, endCellX: 8, startCellY: 6, endCellY: 8, counterpart: 'nw' }
        };
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
                    solutionValue: null
                };
            }

        }
        return cellDB;
    }

    getFilledCellCount() {
        return this.filledCellCount;
    }

    //
    setCellValue(cellX, cellY, cellValue) {

        const oldCellValue = this.getCellValue(cellX, cellY);
        this.cellDB[cellY][cellX].cellValue = cellValue;

        if (oldCellValue === 0 && cellValue > 0) {
            this.filledCellCount++;
        } else if (oldCellValue > 0 && cellValue === 0) {
            this.filledCellCount--;
        }
    }

    //
    getCellValue(cellX, cellY) {
        return this.cellDB[cellY][cellX].cellValue;
    }

    //
    getRowValues(cellY) {
        return this.cellDB[cellY].map((cell) => cell.cellValue);
    }

    //
    getColumnValues(cellX) {
        let cellValues = [];

        for (let cellY = 0; cellY < this.boardSize; cellY++) {
            cellValues.push(this.cellDB[cellY][cellX].cellValue);
        }

        return cellValues;
    }

    //
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

    //
    setCellClueStatus(cellX, cellY, isClue) {
        this.cellDB[cellY][cellX].isClue = isClue;
    }

    //
    getCellClueStatus(cellX, cellY) {
        return this.cellDB[cellY][cellX].isClue;
    }

    //?
    getCellSolutionValue(cellX, cellY) {
        return this.cellDB[cellY][cellX].solutionValue;
    }

    //?
    setCellSolutionValue(cellX, cellY, solutionValue) {
        this.cellDB[cellY][cellX].solutionValue = solutionValue;
    }

    //?
    removeCellSolutionValue(cellX, cellY) {
        this.cellDB[cellY][cellX].solutionValue = null;
    }

    //
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

    //
    setConflictStatus(cellX, cellY, status) {
        this.cellDB[cellY][cellX].conflicting = status;
    }

    //
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


}

module.exports = CellDB;