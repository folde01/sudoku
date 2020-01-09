const log = console.log;
const CONSTANTS = require('./constants');

/**
 * @classdesc Board takes care of all DOM interaction, including drawing the empty board, populating it with values before play, and controlling the user interface during play.
 */
class Board {
    constructor() {
        this._boardSize = CONSTANTS.boardSize;
        this._domCache = {
            logo: document.querySelector('#logo'),
            board: document.querySelector('#board'),
            inputTable: document.querySelector('.inputTable'),
            inputCells: document.querySelectorAll('.inputCell'),
            newGameButton: document.querySelector('.newGame'),
            rows: document.querySelectorAll('.row'),
            gameOver: document.querySelector('.gameOver'),
            overlay: document.querySelector('.overlay')
        };
        this._domCache.cellsXY = this._draw();
        this._domCache.cells = document.querySelectorAll('.cell');
        this._conflictingCellIndex = { 'index': null };
        this._boxInfo = CONSTANTS.boxInfo;
        this._activeCellIndex = null;
    }

    getConflictingCellIndex() {
        const index = this._conflictingCellIndex['index'];
        return index;
    }

    setConflictingCellIndex(index) {
        this._conflictingCellIndex['index'] = index;
    }


    addConflictHighlighting(cellX, cellY) {
        try {
            const domCell = this._getDomCell(cellX, cellY);
            domCell.classList.add('invalidMove');
            const index = this.getCellIndexFromCoords(cellX, cellY);
            this.setConflictingCellIndex(index);
        } catch (e) {
            throw "addConflictHighlighting caught exception: " + e;
        }
    }

    removeConflictHighlighting(cellX, cellY) {
        try {
            const domCell = this._getDomCell(cellX, cellY);
            domCell.classList.remove('invalidMove');
            this.setConflictingCellIndex(null);
        } catch (e) {
            throw "removeConflictHighlighting caught exception: " + e;
        }
    }

    getCellIndexFromCoords(cellX, cellY) {
        const index = (this._boardSize * cellY) + cellX;
        return index;
    }

    populate(cellDB) {
        this._clearBoard();

        // Cache board cells from DOM
        const cells = this._domCache.cells;
        const rows = this._domCache.rows;
        const board = this;
        const boardSize = this._boardSize;

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
        return cellIndex % this._boardSize;
    }

    getCellY(cellIndex) {
        return Math.floor(cellIndex / this._boardSize);
    }

    _drawInCell(cellX, cellY, n) {
        const cellID = this._getCellID(cellX, cellY);
        
        if (n === 0) {
            n = '';
        }

        console.log('cellID:', cellID);
        document.querySelector('#' + cellID).innerText = n;
    }

    play(game) {

        this._game = game;
        const cells = this._domCache.cells;
        const inputCells = this._domCache.inputCells;
        const inputTable = this._domCache.inputTable;
        
        // Helps ensure only one cell is ever active (selected) at a time
        // let activeCellIndex = null;
        let activeCellIndex = this._activeCellIndex;

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
                        
                            // cell.innerText = renderedCellValue;
                            board._drawInCell(cellX, cellY, numericCellValue);

                            // Deactivates cell 
                            cell.classList.remove('activeCell');

                            this._setBackButton();

                            this._deactivateKeypads();

                            if (game.userHasSolvedPuzzle()) {
                                this._doGameOver();
                            }
                        }.bind(board);
                    });
                };
            }
        });
    }

    _setBackButton() {

        const backButton = this._domCache.backButton;
        const board = this;

        const buttonShouldBeActive = this._game && 
            this._game.getCellDB().getPlayOrder().length > 0;

        if (buttonShouldBeActive) {
            // highlight
            backButton.classList.add('backButtonHighlighted');
            
            // set listener
            backButton.onclick = function() {
                const cellDB = board._game.getCellDB();
                const lastPlayID = cellDB.removeLastPlay();

                if (!lastPlayID) {
                    return;
                }

                const cellXY = lastPlayID.split('-').map(x => Number(x));
                this._drawInCell(cellXY[0], cellXY[1], 0);

                log('count:', board._game.getCellDB().getPlayOrder().length);
                if (board._game.getCellDB().getPlayOrder().length == 0) {
                    log('yoda');
                    board._deactivateBackButton();
                }
            }.bind(this);

        } else {
            this._deactivateBackButton();
        }
    }

    _clearBoard() {
        this._hideGameOver();
        this._deactivateKeypads();
        this._deactivateBackButton();
        this._clearCells();
        this._addCheckerBoard(); // todo: this should only be done once
    }

    _hideGameOver() {
        const overlay = this._domCache.overlay;
        overlay.style.display = 'none';
    }

    _deactivateKeypads() {
        this._domCache.inputTable.classList.remove('inputTableActive');
        this._domCache.inputCells.forEach(function (inputCell, inputCellIndex) {
            inputCell.onclick = null;
            // inputCell.onclick = function () { return false; };
        });
    }

    _deactivateBackButton() {
        const backButton = this._domCache.backButton;
        backButton.classList.remove('backButtonHighlighted');
        backButton.onclick = null;
    }

    _clearCells() {
        this._domCache.cells.forEach(function (cell) {
            cell.classList.remove('clueCell');
            cell.classList.remove('activeCell');
            cell.classList.remove('invalidMove');
            cell.onclick = null;
        });
    }



    _getDomCell(cellX, cellY) {
        // Todo: cache these
        const boardSize = this._boardSize;
        const selector = '#cell' + cellX + cellY;
        if (isNaN(cellX) || isNaN(cellY) || cellX > boardSize - 1 || cellX < 0 || cellY > boardSize - 1 || cellY < 0) {
            throw "getDomCell: unexpected cell coordinate. (cellX, cellY): " + cellX + ', ' + cellY;
        }

        return this._domCache.cellsXY[selector];
    }

    _addCheckerBoard() {
        const checkerboardBoxes = ['n', 's', 'e', 'w'];

        checkerboardBoxes.forEach(function (box, index) {
            const boxInfo = this._boxInfo[box];

            for (let cellX = boxInfo.startCellX; cellX <= boxInfo.endCellX; cellX++) {
                for (let cellY = boxInfo.startCellY; cellY <= boxInfo.endCellY; cellY++) {
                    this._getDomCell(cellX, cellY).classList.add('checkerboardBoxCell');
                }
            }
        }.bind(this));
    }

    _doGameOver() {
        const overlay = this._domCache.overlay;
        overlay.style.display = 'block';
    }

    _getCellID(cellX, cellY) {
        return 'cell' + cellX + cellY;
    }

    _draw() {
        const domCache = this._domCache;
        const boardSize = this._boardSize;
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

        // back button
        const backButton = document.createElement('li');
        // backButton.innerText = 'Undo';
        // backButton.innerText = '←';
        backButton.innerText = 'Back';
        backButton.setAttribute('class', 'backBtn');
        const liToReplace = document.querySelector('#logo li');
        liToReplace.parentNode.replaceChild(backButton, liToReplace);
        domCache.backButton = backButton;

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
                // const cellID = 'cell' + j + i;
                const cellID = this._getCellID(j, i);
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
}

module.exports = Board;