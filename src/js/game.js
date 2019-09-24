const CellDB = require('./cellDB');
const Puzzle = require('./puzzle');
const log = console.log;

class Game {
    constructor(board) {
        this.boardSize = 9;
        this.numCells = this.boardSize * this.boardSize;
        this.reset();
        this.domCache = board.getDomCache();
        this.activeCellIndex = null;
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
        this.regionInfo = this.cellDB.getRegionInfo();
    }


    playInCell(cellX, cellY, cellValue) {
        this.cellDB.setCellValue(cellX, cellY, 0);
        this.cellDB.setCellValue(cellX, cellY, cellValue);
        // TODO: remove incrementCellValueCount from cellDB API
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

    getDomCell(cellX, cellY) {

        // Todo: cache these
        const boardSize = this.boardSize;
        const selector = '#cell' + cellX + cellY;
        if (isNaN(cellX) || isNaN(cellY) || cellX > boardSize - 1 || cellX < 0 || cellY > boardSize - 1 || cellY < 0) {
            throw "getDomCell: unexpected cell coordinate. (cellX, cellY): " + cellX + ', ' + cellY;
        }

        return this.domCache.cellsXY[selector];
    }

    removeConflictHighlighting(cellX, cellY) {

        if (this.cellDB.getCellClueStatus(cellX, cellY) === true) {
            return;
        }

        try {
            const domCell = this.getDomCell(cellX, cellY);
            domCell.classList.remove('invalidMove');
            this.setConflictingCellIndex(null);
        } catch (e) {
            throw "removeConflictHighlighting caught exception: " + e;
        }
    }

    addConflictHighlighting(cellX, cellY) {

        if (this.cellDB.getCellClueStatus(cellX, cellY) === true) {
            return;
        }

        try {
            const domCell = this.getDomCell(cellX, cellY);
            domCell.classList.add('invalidMove');
            const index = this.getCellIndexFromCoords(cellX, cellY);
            this.setConflictingCellIndex(index);
        } catch (e) {
            throw "addConflictHighlighting caught exception: " + e;
        }
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

    doGameOver() {
        const gameOver = this.domCache.gameOver;
        gameOver.innerText = 'WOOHOO YOU WON!';
        // Todo: make game look and feel over
    }

    hideGameOver() {
        const gameOver = this.domCache.gameOver;
        gameOver.innerText = '';
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

    getDomCellByIndex(cellIndex) {
        const cellX = this.getCellX(cellIndex);
        const cellY = this.getCellY(cellIndex);
        return this.getDomCell(cellX, cellY);
    }

    play() {

        const puzzle = new Puzzle();
        puzzle.solve();
        const cellDB = puzzle.getCellDB();
        this.setCellDB(cellDB);
        this.populateBoard();

        const boardSize = this.boardSize;

        const cells = this.domCache.cells;
        const inputCells = this.domCache.inputCells;
        const inputTable = this.domCache.inputTable;

        // Helps ensure only one cell is ever active (selected) at a time
        // let activeCellIndex = null;
        let activeCellIndex = this.activeCellIndex;

        const board = this;

        // Adds event listeners to all cells except clue cells.
        cells.forEach(function (cell, cellIndex) {
            // Non-clue cells
            const cellX = board.getCellX(cellIndex);
            const cellY = board.getCellY(cellIndex);
            // const cellX = cellIndex % boardSize;
            // const cellY = Math.floor(cellIndex / boardSize);

            if (board.cellDB.getCellValue(cellX, cellY) === 0) {

                cell.onclick = function () {

                    // Removes any conflict highlighting from last move
                    board.removeAllConflicts();

                    // Deactivates active cell if there is one, then activates selected cell. 
                    if (activeCellIndex !== null) {
                        cells[activeCellIndex].classList.remove('activeCell');
                    }

                    // Activates cell
                    activeCellIndex = cellIndex;
                    cells[activeCellIndex].classList.add('activeCell');

                    // todo: Activates keyboard

                    // Activates keypad.
                    inputTable.classList.add('inputTableActive');
                    inputCells.forEach(function (inputCell, inputCellIndex) {

                        let renderedCellValue = inputCell.innerText;
                        let numericCellValue;

                        if (isNaN(renderedCellValue)) {
                            // 0 is the code for an erased number
                            numericCellValue = 0;
                            renderedCellValue = '';
                        } else {
                            numericCellValue = Number(renderedCellValue);
                        }
                        
                        // Uses onClick instead of addEventListener (as we need to replace a handler, not add one)
                        inputCell.onclick = function () {

                            board.playInCell(cellX, cellY, numericCellValue);

                            board.highlightIfConflicting(cellX, cellY, numericCellValue);

                            // Sets cell value in DOM.
                            cell.innerText = renderedCellValue;

                            // Deactivates cell 
                            cell.classList.remove('activeCell');

                            this.deactivateKeypads();

                            if (board.userHasSolvedPuzzle()) {
                                board.doGameOver();
                            }
                        }.bind(board);
                    });
                };
            }
        });

    }


    addAndStoreReferenceToEventListener(element, cellX, cellY, event, fn) {
        this.cellDB.setCellEventListener(cellX, cellY, event, fn);
        element.addEventListener(event, fn);
    }

    removeEventListenerAndStoredReference(cellX, cellY) {
        ({ event, fn } = this.cellDB.getCellEventListener(cellX, cellY));
        element.removeEventListener(event, fn);
        this.cellDB.setCellEventListener(cellX, cellY, null);
    }

    deactivateKeypads() {
        this.domCache.inputTable.classList.remove('inputTableActive');
        this.domCache.inputCells.forEach(function (inputCell, inputCellIndex) {
            inputCell.onclick = null;
            // inputCell.onclick = function () { return false; };
        });
    }

    highlightIfConflicting(cellX, cellY, cellValue) {

        // Searches for conflicts, breaking out of loop if it finds one, in which case highlighting is done. 

        let conflictFound = false;
        const boardSize = this.boardSize;

        // Searches row for conflict:
        for (let x = 0; x < boardSize; x++) {

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

        const domCell = this.getDomCell(cellX, cellY)

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

    addCheckerBoard() {
        const checkerboardRegions = ['n', 's', 'e', 'w'];

        checkerboardRegions.forEach(function (region, index) {
            const regionInfo = this.regionInfo[region];

            for (let cellX = regionInfo.startCellX; cellX <= regionInfo.endCellX; cellX++) {
                for (let cellY = regionInfo.startCellY; cellY <= regionInfo.endCellY; cellY++) {
                    this.getDomCell(cellX, cellY).classList.add('checkerboardRegionCell');
                }
            }
        }.bind(this));
    }

    clearBoard() {
        this.hideGameOver();
        this.deactivateKeypads();
        this.clearCells();
        this.addCheckerBoard();
    }


    clearCells() {
        this.domCache.cells.forEach(function (cell) {
            cell.classList.remove('clueCell');
            cell.classList.remove('activeCell');
            cell.classList.remove('invalidMove');
            cell.onclick = null;
        });
    }

    populateBoard() {

        this.clearBoard();

        // Cache board cells from DOM
        const cells = this.domCache.cells;
        const rows = this.domCache.rows;
        const board = this;
        const boardSize = this.boardSize;

        // Populate cells and cell DB (for checking move validity) arrays with values from cellValues. 
        cells.forEach(function (cell, cellIndex) {
            const cellX = this.getCellX(cellIndex);
            const cellY = this.getCellY(cellIndex);

            const cellValue = board.cellDB.getCellValue(cellX, cellY);
            let cellValueToRender = null;

            if (cellValue === 0) {
                // It's an empty cell.
                cellValueToRender = '';
            } else {
                // It's a clue cell.
                cellValueToRender = cellValue.toString();
                cell.classList.add('clueCell');
            }
            cell.innerText = cellValueToRender;
        }.bind(this));
    }

}

module.exports = Game;
