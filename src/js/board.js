const log = console.log;
const CONSTANTS = require('./constants');


// how to make this a singleton?
class Board {
    constructor() {
        this.boardSize = 9;
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
    
}

module.exports = Board;