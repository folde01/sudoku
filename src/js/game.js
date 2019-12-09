const CellDB = require('./cellDB');
const Puzzle = require('./puzzle');
const CONSTANTS = require('./constants');
const log = console.log;

class Game {
    constructor(board) {
        this.boardSize = CONSTANTS.boardSize;
        this.numCells = this.boardSize * this.boardSize;
        this.reset();
        this.board = board;
    }

    getConflictingCellIndex() {
        return this.board.getConflictingCellIndex();
    }

    setConflictingCellIndex(index) {
        this.board.setConflictingCellIndex(index);
    }

    reset() {
        this.cellDB = new CellDB();
        this.regionInfo = CONSTANTS.regionInfo;
    }


    playInCell(cellX, cellY, cellValue) {
        this.cellDB.setCellValue(cellX, cellY, 0);
        this.cellDB.setCellValue(cellX, cellY, cellValue);
        this.cellDB.incrementCellValueCount(cellValue);
    }

    getRegionCorners(cellX, cellY) {
        const startRow = Math.floor(cellY / 3) * 3;
        const endRow = startRow + 2;
        const startColumn = Math.floor(cellX / 3) * 3;
        const endColumn = startColumn + 2;

        const corners = {
            startRow: startRow,
            endRow: endRow,
            startColumn: startColumn,
            endColumn: endColumn
        }

        return corners;
    }

    removeConflictHighlighting(cellX, cellY) {

        if (this.cellDB.getCellClueStatus(cellX, cellY) === true) {
            return;
        }

        this.board.removeConflictHighlighting(cellX, cellY);

    }

    addConflictHighlighting(cellX, cellY) {

        if (this.cellDB.getCellClueStatus(cellX, cellY) === true) {
            return;
        }

        this.board.addConflictHighlighting(cellX, cellY);

    }

    userHasSolvedPuzzle() {
        const boardSize = this.boardSize;

        // Returns if board isn't filled yet.
        if (this.cellDB.getFilledCellCount() !== boardSize * boardSize) {
            return false;
        }

        // Checks row and columns for conflicts and correct number counts
        for (let i = 0; i < boardSize; i++) {
            const rowValues = new Set(this.cellDB.getRowValues(i));
            const columnValues = new Set(this.cellDB.getColumnValues(i));

            if (rowValues.size !== boardSize || columnValues.size !== boardSize) {
                return false;
            }
        }

        // Checks for region conflicts
        for (let region in this.regionInfo) {
            if (this.regionInfo.hasOwnProperty(region)) {
                const regionValues = new Set(this.cellDB.getRegionValues(region));

                if (regionValues.size !== boardSize) {
                    return false;
                }
            }
        }

        return true;
    }

    setCellDB(cellDB) {
        this.cellDB = cellDB;
    }

    getCellX(cellIndex) {
        return cellIndex % this.boardSize;
    }

    getCellY(cellIndex) {
        return Math.floor(cellIndex / this.boardSize);
    }

    play() {
        const puzzle = new Puzzle();
        puzzle.solve();
        const cellDB = puzzle.getCellDB();
        this.setCellDB(cellDB);
        this.populateBoard();
        const boardSize = this.boardSize;
        this.board.play(this);
    }

 
    highlightIfConflicting(cellX, cellY, cellValue) {

        // Searches for conflicts, breaking out of loop if it finds one, in which case highlighting is done. 

        let conflictFound = false;
        const boardSize = this.boardSize;

        // Searches row for conflict:
        for (let x = 0; x < boardSize; x++) {

            // don't compare with self
            if (x === cellX) {
                continue;
            }

            if (this.cellDB.getCellValue(x, cellY) === cellValue) {
                conflictFound = true;
                break;
            }
        }

        if (conflictFound) {
            this.setBoardConflict(cellX, cellY, true);
            return;
        }

        // Searches column for conflict:
        for (let y = 0; y < boardSize; y++) {

            if (y === cellY) {
                continue;
            }

            if (this.cellDB.getCellValue(cellX, y) === cellValue) {
                conflictFound = true;
                break;
            }
        }

        if (conflictFound) {
            this.setBoardConflict(cellX, cellY, true);
            return;
        }

        // Searches region for conflict:
        const corners = this.getRegionCorners(cellX, cellY);

        for (let x = corners.startColumn; x <= corners.endColumn; x++) {

            if (conflictFound) break;

            for (let y = corners.startRow; y < corners.endRow; y++) {

                if (x === cellX && y === cellY) {
                    continue;
                }

                if (this.cellDB.getCellValue(x, y) === cellValue) {
                    conflictFound = true;
                    break;
                }
            }
        }

        if (conflictFound) {
            this.setBoardConflict(cellX, cellY, true);
            return;
        }

    }


    removeAllConflicts() {
        for (let cellY = 0; cellY < this.boardSize; cellY++) {
            for (let cellX = 0; cellX < this.boardSize; cellX++) {
                this.setBoardConflict(cellX, cellY, false);
            }
        }
    }

    setBoardConflict(cellX, cellY, newStatus) {

        const status = this.cellDB.getConflictStatus(cellX, cellY);

        if (status === newStatus) {
            return;
        }

        this.cellDB.setConflictStatus(cellX, cellY, newStatus);

        if (newStatus === true) {
            try {
                this.addConflictHighlighting(cellX, cellY);
                // this.conflictingCellIndex = this.getCellIndexFromCoords(cellX, cellY);
            } catch (e) {
                throw "setConflictStatus caught exception: " + e;
            }
        } else {
            this.removeConflictHighlighting(cellX, cellY);
            // this.conflictingCellIndex = null;
        }
    }

    getCellIndexFromCoords(cellX, cellY) {
        const index = (this.boardSize * cellY) + cellX;
        return index;
    }

    populateBoard() {
        this.board.populate(this.cellDB);
    }

}

module.exports = Game;
