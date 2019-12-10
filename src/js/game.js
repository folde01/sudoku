const CellDB = require('./cellDB');
const Puzzle = require('./puzzle');
const CONSTANTS = require('./constants');
const log = console.log;

class Game {
    constructor(board) {
        this.boardSize = CONSTANTS.boardSize;
        this.numCells = this.boardSize * this.boardSize;
        this._reset();
        this.board = board;
        this.boxInfo = CONSTANTS.boxInfo;
    }


    // Public methods


    getConflictingCellIndex() {
        return this.board.getConflictingCellIndex();
    }

    setConflictingCellIndex(index) {
        this.board.setConflictingCellIndex(index);
    }

    playInCell(cellX, cellY, cellValue) {
        this.cellDB.setCellValue(cellX, cellY, 0);
        this.cellDB.setCellValue(cellX, cellY, cellValue);
        this.cellDB.incrementCellValueCount(cellValue);
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

        // Checks for box conflicts
        for (let box in this.boxInfo) {
            if (this.boxInfo.hasOwnProperty(box)) {
                const boxValues = new Set(this.cellDB.getBoxValues(box));

                if (boxValues.size !== boardSize) {
                    return false;
                }
            }
        }

        return true;
    }

    play() {
        const puzzle = new Puzzle();
        puzzle.solve();
        const cellDB = puzzle.getCellDB();
        this._setCellDB(cellDB);
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
            this._setBoardConflict(cellX, cellY, true);
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
            this._setBoardConflict(cellX, cellY, true);
            return;
        }

        // Searches box for conflict:
        const corners = this._getBoxCorners(cellX, cellY);

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
            this._setBoardConflict(cellX, cellY, true);
            return;
        }

    }


    removeAllConflicts() {
        for (let cellY = 0; cellY < this.boardSize; cellY++) {
            for (let cellX = 0; cellX < this.boardSize; cellX++) {
                this._setBoardConflict(cellX, cellY, false);
            }
        }
    }


    populateBoard() {
        this.board.populate(this.cellDB);
    }


    // Private methods

    _setBoardConflict(cellX, cellY, newStatus) {

        const status = this.cellDB.getConflictStatus(cellX, cellY);

        if (status === newStatus) {
            return;
        }

        this.cellDB.setConflictStatus(cellX, cellY, newStatus);

        if (newStatus === true) {
            try {
                this._addConflictHighlighting(cellX, cellY);
            } catch (e) {
                throw "setConflictStatus caught exception: " + e;
            }
        } else {
            this._removeConflictHighlighting(cellX, cellY);
        }
    }

    _setCellDB(cellDB) {
        this.cellDB = cellDB;
    }

    _getBoxCorners(cellX, cellY) {
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

    _removeConflictHighlighting(cellX, cellY) {

        if (this.cellDB.getCellClueStatus(cellX, cellY) === true) {
            return;
        }

        this.board.removeConflictHighlighting(cellX, cellY);

    }

    _reset() {
        this.cellDB = new CellDB();
    }

    _addConflictHighlighting(cellX, cellY) {

        if (this.cellDB.getCellClueStatus(cellX, cellY) === true) {
            return;
        }

        this.board.addConflictHighlighting(cellX, cellY);

    }
}

module.exports = Game;
