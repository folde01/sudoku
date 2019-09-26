const log = console.log;



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
            gameOver: document.querySelector('.gameOver')
        };
        this.domCache.cellsXY = this.draw();
        this.domCache.cells = document.querySelectorAll('.cell');
        this.conflictingCellIndex = { 'index': null };
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
        // const logoChars = ('WHOODOKU!').split('');

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
        eraseBtn.innerText = 'Clear';
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
    
}

module.exports = Board;