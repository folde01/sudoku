// how to make this a singleton?
class Board {
    constructor(){
        this.boardSize = 9;
        this.cellsXY = this.draw();
        this.fillDomCache();
    }


    draw() {
        const boardSize = this.boardSize;
        const cellsXY = {};
        const oldBoard = document.querySelector('#board');
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
        return cellsXY;
    }

    fillDomCache() {
        this.domCache = {
            cellsXY: this.cellsXY,
            inputTable: document.querySelector('.inputTable'),
            inputCells: document.querySelectorAll('.inputCell'),
            newGameButton: document.querySelector('.newGame'),
            board: document.querySelector('#board'),
            cells: document.querySelectorAll('.cell'),
            rows: document.querySelectorAll('.row'),
            gameOver: document.querySelector('.gameOver')
        };
    }

    getDomCache() {
        return this.domCache;
    }
}

module.exports = Board;