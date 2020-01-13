const CellDB = require('./cellDB');
const Puzzle = require('./puzzle');
const CONSTANTS = require('./constants');
const log = console.log;

/**
 * @classdesc Game orchestrates the other classes in order to generate a puzzle, draw and populate the board and run the main game loop.
 */
class Game {
    constructor(board) {
        this._boardSize = CONSTANTS.boardSize;
        this._numCells = this._boardSize * this._boardSize;
        this._reset();
        this._board = board;
        this._boxInfo = CONSTANTS.boxInfo;
    }

    play() {
        const puzzle = new Puzzle();
        puzzle.solve(); // todo: put solve in constructor
        const cellDB = puzzle.getCellDB();
        this._setCellDB(cellDB);
        this.populateBoard();
        const boardSize = this._boardSize;
        this._board.play(this);
    }

    getCellDB() {
        return this.cellDB;
    }

    populateBoard() {
        this._board.populate(this.cellDB);
    }
    
    userHasSolvedPuzzle() {
        const boardSize = this._boardSize;

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
        for (let box in this._boxInfo) {
            if (this._boxInfo.hasOwnProperty(box)) {
                const boxValues = new Set(this.cellDB.getBoxValues(box));

                if (boxValues.size !== boardSize) {
                    return false;
                }
            }
        }

        return true;
    }

    getConflictingCellIndex() {
        return this._board.getConflictingCellIndex();
    }

    setConflictingCellIndex(index) {
        this._board.setConflictingCellIndex(index);
    }

    playInCell(cellX, cellY, cellValue) {
        this.cellDB.setCellValue(cellX, cellY, 0);
        this.cellDB.setCellValue(cellX, cellY, cellValue);
        this.cellDB.incrementCellValueCount(cellValue);
    }

    highlightIfConflicting(cellX, cellY, cellValue) {

        // Searches for conflicts, breaking out of loop if it finds one, in which case highlighting is done. 

        let conflictFound = false;
        const boardSize = this._boardSize;

        // Searches row for conflict:
        for (let x = 0; x < boardSize; x++) {

            // don't compare with self
            if (x === cellX) {
                continue;
            }

            if (this.cellDB.getCellValue(x, cellY) === cellValue) {
                log('cellDB:', this.cellDB);
                conflictFound = true;
                break;
            }
        }

        if (conflictFound) {
            log('row conflict');
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
            log('column conflict');
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
            log('box conflict');
            this._setBoardConflict(cellX, cellY, true);
            return;
        }

    }

    removeAllConflicts() {
        for (let cellY = 0; cellY < this._boardSize; cellY++) {
            for (let cellX = 0; cellX < this._boardSize; cellX++) {
                this._setBoardConflict(cellX, cellY, false);
            }
        }
    }

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
        cellDB.startGame();
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

        this._board.removeConflictHighlighting(cellX, cellY);

    }

    _reset() {
        this.cellDB = new CellDB();
    }

    _addConflictHighlighting(cellX, cellY) {

        if (this.cellDB.getCellClueStatus(cellX, cellY) === true) {
            return;
        }

        this._board.addConflictHighlighting(cellX, cellY);

    }
}

module.exports = Game;
