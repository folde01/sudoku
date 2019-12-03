const log = console.log;
const CONSTANTS = require('./constants');


// how to make this a singleton?
class Board {
    constructor() {
        this.boardSize = CONSTANTS.boardSize;
        this.domCache = {
            logo: document.querySelector('#logo'),
            board: document.querySelector('#board'),
            inputTable: document.querySelector('.inputTable'),
            inputCells: document.querySelectorAll('.inputCell'),
            newGameButton: document.querySelector('.newGame'),
            rows: document.querySelectorAll('.row'),
            gameOver: document.querySelector('.gameOver'),
            overlay: document.querySelector('.overlay')
        };
        this.domCache.cellsXY = this.draw();
        this.domCache.cells = document.querySelectorAll('.cell');
        this.conflictingCellIndex = { 'index': null };
        this.regionInfo = CONSTANTS.regionInfo;
        this.activeCellIndex = null;
    }

    getConflictingCellIndex() {
        const index = this.conflictingCellIndex['index'];
        return index;
    }

    setConflictingCellIndex(index) {
        this.conflictingCellIndex['index'] = index;
    }

    draw() {
        const domCache = this.domCache;
        const boardSize = this.boardSize;
        const cellsXY = {};

        // logo
        const logo = document.createElement('ul');
        logo.setAttribute('id', 'logo');
        const logoChars = ('  SUDOKU ').split('');

        for (let i = 0; i < 9; i++) {
            const li = document.createElement('li');
            li.innerText = logoChars[i];
            logo.appendChild(li);
        }

        // new game button
        const li = document.createElement('li');
        li.innerText = 'New game';
        li.setAttribute('class', 'newGame');
        logo.appendChild(li);
        const oldLogo = domCache.logo;
        oldLogo.parentNode.replaceChild(logo, oldLogo);


        // board
        const oldBoard = domCache.board;
        const board = document.createElement('table');
        board.setAttribute('id', 'board');

        for (let i = 0; i < boardSize; i++) {
            const rowNode = document.createElement('tr');
            rowNode.setAttribute('class', 'row');
            board.appendChild(rowNode);

            for (let j = 0; j < boardSize; j++) {
                const cellNode = document.createElement('td');
                cellNode.setAttribute('class', 'cell');
                const cellID = 'cell' + j + i;
                cellNode.setAttribute('id', cellID);
                cellsXY['#' + cellID] = cellNode;
                rowNode.appendChild(cellNode);
            }
        }

        oldBoard.parentNode.replaceChild(board, oldBoard);


        // keypad
        const inputTable = document.createElement('ul');
        inputTable.setAttribute('class', 'inputTable');

        for (let i = 0; i < boardSize; i++) {
            const li = document.createElement('li');
            li.innerText = (i + 1).toString();
            li.setAttribute('class', 'inputCell');
            inputTable.appendChild(li);
        }

        const eraseBtn = document.createElement('li');
        eraseBtn.setAttribute('id', 'eraseBtn');
        eraseBtn.setAttribute('class', 'inputCell');
        // eraseBtn.innerText = 'Clear';
        eraseBtn.innerText = 'Erase';
        inputTable.appendChild(eraseBtn);

        const oldInputTable = domCache.inputTable;
        oldInputTable.parentNode.replaceChild(inputTable, oldInputTable);
        domCache.inputCells = document.querySelectorAll('.inputCell');
        domCache.inputTable = inputTable;

        return cellsXY;
    }

    getDomCache() {
        return this.domCache;
    }

    clearBoard() {
        this.hideGameOver();
        this.deactivateKeypads();
        this.clearCells();
        this.addCheckerBoard();
    }

    hideGameOver() {
        // const gameOver = this.domCache.gameOver;
        const overlay = this.domCache.overlay;
        // gameOver.innerText = '';
        overlay.style.display = 'none';

    }

    deactivateKeypads() {
        this.domCache.inputTable.classList.remove('inputTableActive');
        this.domCache.inputCells.forEach(function (inputCell, inputCellIndex) {
            inputCell.onclick = null;
            // inputCell.onclick = function () { return false; };
        });
    }

    clearCells() {
        this.domCache.cells.forEach(function (cell) {
            cell.classList.remove('clueCell');
            cell.classList.remove('activeCell');
            cell.classList.remove('invalidMove');
            cell.onclick = null;
        });
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

    getDomCell(cellX, cellY) {

        // Todo: cache these
        const boardSize = this.boardSize;
        const selector = '#cell' + cellX + cellY;
        if (isNaN(cellX) || isNaN(cellY) || cellX > boardSize - 1 || cellX < 0 || cellY > boardSize - 1 || cellY < 0) {
            throw "getDomCell: unexpected cell coordinate. (cellX, cellY): " + cellX + ', ' + cellY;
        }

        return this.domCache.cellsXY[selector];
    }

    addConflictHighlighting(cellX, cellY) {

        // if (this.cellDB.getCellClueStatus(cellX, cellY) === true) {
        //     return;
        // }

        try {
            const domCell = this.getDomCell(cellX, cellY);
            domCell.classList.add('invalidMove');
            const index = this.getCellIndexFromCoords(cellX, cellY);
            this.setConflictingCellIndex(index);
        } catch (e) {
            throw "addConflictHighlighting caught exception: " + e;
        }
    }

    removeConflictHighlighting(cellX, cellY) {

        // if (this.cellDB.getCellClueStatus(cellX, cellY) === true) {
        //     return;
        // }

        try {
            const domCell = this.getDomCell(cellX, cellY);
            domCell.classList.remove('invalidMove');
            this.setConflictingCellIndex(null);
        } catch (e) {
            throw "removeConflictHighlighting caught exception: " + e;
        }
    }

    getCellIndexFromCoords(cellX, cellY) {
        const index = (this.boardSize * cellY) + cellX;
        return index;
    }

    populate(cellDB) {

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

            const cellValue = cellDB.getCellValue(cellX, cellY);
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

    getCellX(cellIndex) {
        return cellIndex % this.boardSize;
    }

    getCellY(cellIndex) {
        return Math.floor(cellIndex / this.boardSize);
    }

    doGameOver() {
        const overlay = this.domCache.overlay;
        overlay.style.display = 'block';
    }

    play(game) {

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

            if (game.cellDB.getCellValue(cellX, cellY) === 0) {

                cell.onclick = function () {

                    // Removes any conflict highlighting from last move
                    game.removeAllConflicts();

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

                            game.playInCell(cellX, cellY, numericCellValue);

                            game.highlightIfConflicting(cellX, cellY, numericCellValue);

                            // Sets cell value in DOM.
                            cell.innerText = renderedCellValue;

                            // Deactivates cell 
                            cell.classList.remove('activeCell');

                            this.deactivateKeypads();

                            if (game.userHasSolvedPuzzle()) {
                                this.doGameOver();
                            }
                        }.bind(board);
                    });
                };
            }
        });
    }
}

module.exports = Board;