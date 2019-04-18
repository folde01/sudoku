class Move {
    constructor(cellX, cellY, cellValue, previousMove) {
        this.previousMove = null;
        this.isDeadEnd = false;
        this.deadEndNextMoves = [];

        if (arguments.length < 3) {
            this.cellX = this._getRandomInt(0, boardSize - 1);
            this.cellY = this._getRandomInt(0, boardSize - 1);
            this.cellValue = this._getRandomInt(1, boardSize);
        } else if (arguments.length >= 3) {
            this.cellX = cellX;
            this.cellY = cellY;
            this.cellValue = cellValue;
        }
        if (arguments.length === 4) {
            this.previousMove = previousMove;
        }

        console.log('MOVE CREATED: ' + this.cellX + ', ' + this.cellY + ', ' + this.cellValue);
    }

    setPreviousMove(move) {
        this.previousMove = move;
    }

    getPreviousMove() {
        return this.previousMove;
    }

    _getRandomInt(min, max) {
        // https://stackoverflow.com/a/1527820
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}

class Box {
    constructor(board, region) {
        this.board = board;
        this.region = region;
    }


    getBoxStartColumn() {

        // return startColumns[this.region];
    }

    getBoxEndColumn() {
        const boxEndColumns = {

        };

        return endColumns[this.region];
    }
    getBoxStartRow() {
        const boxStartRows = {
            'nw': 2, 'n': 5, 'ne': 8,
            'w': 2, 'c': 5, 'e': 8,
            'sw': 2, 's': 5, 'se': 8
        };

        return endColumns[this.region];
    }
    getEndRow() {

    }
    getCounterpartBox() {

    }
    removeValue(boxX, boxY) {

    }
    removeRandomValue() {
        // return [boxX, boxY];
    }
    rotate(boxX, boxY) {
        // return [boxX2, boxY2];
    }
}

Box.startColumns = {
    'nw': 0, 'n': 3, 'ne': 6,
    'w': 0, 'c': 3, 'e': 6,
    'sw': 0, 's': 3, 'se': 6
}

Box.endColumns = {
    'nw': 2, 'n': 5, 'ne': 8,
    'w': 2, 'c': 5, 'e': 8,
    'sw': 2, 's': 5, 'se': 8
}



function pickRandomElementFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// From https://stackoverflow.com/a/4026828:
Array.prototype.diff = function (arr) {
    return this.filter(function (i) {
        return arr.indexOf(i) < 0;
    });
};

class Board {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.cellValues2D = this.initializeCellValues2D(boardSize);
        this.validMoveCount = 0;
        this.moveAttempts = 0;
        this.numCells = boardSize * boardSize;
        this.moves = [];
        this.cellValueCounts = new Array(boardSize + 1).fill(0);
        this.countCompleteCellValues = 0;
        this.completeCellValueCounts = new Array(boardSize).fill(boardSize);

        if (boardSize === 9) {
            this.boxInfoByRegion = {
                'nw': { startCellX: 0, endCellX: 2, startCellY: 0, endCellY: 2, counterpart: 'se' },
                'n': { startCellX: 3, endCellX: 5, startCellY: 0, endCellY: 2, counterpart: 's' },
                'ne': { startCellX: 6, endCellX: 8, startCellY: 0, endCellY: 2, counterpart: 'sw' },
                'w': { startCellX: 0, endCellX: 2, startCellY: 3, endCellY: 5, counterpart: 'e' },
                'c': { startCellX: 3, endCellX: 5, startCellY: 3, endCellY: 5, counterpart: 'c' },
                'e': { startCellX: 6, endCellX: 8, startCellY: 3, endCellY: 5, counterpart: 'w' },
                'sw': { startCellX: 0, endCellX: 2, startCellY: 6, endCellY: 8, counterpart: 'ne' },
                's': { startCellX: 3, endCellX: 5, startCellY: 6, endCellY: 8, counterpart: 'n' },
                'se': { startCellX: 6, endCellX: 8, startCellY: 6, endCellY: 8, counterpart: 'nw' },
            }
        }
    }

    randomInt(min, max) {
        const ceilMin = Math.ceil(min);
        const floorMax = Math.floor(max);
        return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
    }

    initializeCellValues2D(boardSize) {
        // Build 2D array used to check move validity
        let cellValues2D = new Array(boardSize);

        for (let i = 0; i < boardSize; i++) {
            cellValues2D[i] = new Array(boardSize);

            for (let j = 0; j < boardSize; j++) {
                cellValues2D[i][j] = 0;
            }

        }

        return cellValues2D;
    }

    getMoves() {
        return this.moves;
    }

    setCellValue(cellX, cellY, cellValue) {
        this.cellValues2D[cellY][cellX] = cellValue;
    }

    getCellValue(cellX, cellY) {
        return this.cellValues2D[cellY][cellX];
    }

    getCellValueCount(cellValue) {
        return this.cellValueCounts[cellValue];
    }

    incrementCellValueCount(cellValue) {
        // console.log(this.cellValueCounts);

        // console.log('-INCR-');
        this.cellValueCounts[cellValue]++;

        if (this.cellValueCounts[cellValue] === boardSize) {
            this.countCompleteCellValues++;
        }
        // console.log('cellValueCounts: ' + this.cellValueCounts);



    }

    decrementCellValueCount(cellValue) {
        // console.log(this.cellValueCounts);
        // console.log('-DECR-');


        if (this.cellValueCounts[cellValue] === boardSize) {
            this.countCompleteCellValues--;
        }

        this.cellValueCounts[cellValue]--;

        // console.log('decrAfter: ' + cellValue + ': ' + this.getCellValueCount(cellValue));
        // console.log(this.cellValueCounts);
        // console.log('cellValueCounts: ' + this.cellValueCounts);



    }

    boardIsComplete() {
        return this.countCompleteCellValues === boardSize;
    }

    getLastMove() {
        if (this.moves.length === 0) {
            return null;
        }
        return this.moves[this.moves.length - 1];
    }

    tryMove(move) {
        console.log('trying: ' + JSON.stringify(move));
        this.moveAttempts++;
        if (this.cellIsEmpty(move.cellX, move.cellY) && this.moveIsValid(move)) {
            this.setCellValue(move.cellX, move.cellY, move.cellValue);
            this.validMoveCount++;
            this.moves.push(move);
            this.incrementCellValueCount(move.cellValue);
            console.log('   PLAYED  ' + JSON.stringify(move));
            // console.log('2D: ' + JSON.stringify(this.cellValues2D));
            return true;
        } else {
            console.log('NOT Played: ' + JSON.stringify(move));
            return false;
        }

    }

    undoLastMove() {
        if (this.moves.length > 0) {
            const lastMove = this.moves.pop();
            lastMove.deadEnd = true;
            this.setCellValue(lastMove.cellX, lastMove.cellY, 0);
            this.decrementCellValueCount(lastMove.cellValue);

            lastMove.getPreviousMove().deadEndNextMoves.push(lastMove);

            // console.log('###### move undone: ' + JSON.stringify(lastMove));
            console.log('###### move undone: ' + lastMove.cellX + lastMove.cellY + lastMove.cellValue);
            return lastMove;
        } else {
            console.log('no moves left to undo');
        }
    }


    makeMoves(moves) {
        const self = this;
        moves.forEach(function (move, index) {
            self.tryMove(move);
        });
    }


    cellIsEmpty(cellX, cellY) {
        // if (this.cellValues2D[cellX][cellY] === 0) {
        if (this.getCellValue(cellX, cellY) === 0) {
            // console.log('EMPTY');
            return true;
        }
        // console.log('FULL');
        return false;
    }

    getEmptyCellsInColumn(cellX) {
        let emptyCells = [];

        for (let cellY = 0; cellY < this.boardSize; cellY++) {
            if (this.cellIsEmpty(cellX, cellY)) {
                emptyCells.push(cellY);
            }
        }

        console.log('========= EMPTY ======== ' + emptyCells);
        return emptyCells;
    }

    columnContainsCellValue(cellX, cellValue) {
        for (let cellY = 0; cellY < this.boardSize; cellY++) {
            if (cellValue === this.getCellValue(cellX, cellY)) {
                return true;
            }
        }
        return false;
    }

    getCurrentBoardValues() {
        // console.log('2D!!!!: ' + this.cellValues2D);
        const merged = [].concat.apply([], this.cellValues2D);
        return merged;
    }



    solve() {
        this.solveByPickingRandomPossibleNextMove();
        // this.solveByIteratingDownEachColumn();
        // this.solveByPickingRandomEmptyCellFromColumn();
    }

    getPossibleNextMoves(move) {
        let possibleCellYs = [];

        for (let i = 0; i < this.boardSize; i++) {
            if (i != move.cellY) {
                possibleCellYs.push(i);
            }
        }

        // console.log('move: ' + JSON.stringify(move));
        let cellValue = move.cellValue;
        let cellValueCount = this.getCellValueCount(cellValue);

        if (cellValueCount === this.boardSize) {
            ++cellValue;

            // Todo: Rather than throw an exception here, we should handle any board, 
            // not just boards made with the board generation algorithm used here.
            if (this.getCellValueCount(cellValue) === this.boardSize) {
                throw "Unexpected cell value count. Terminating.";
            }
        }

        const deadEndCellYs = move.deadEndNextMoves.map(mv => mv.cellY);
        let cellX = (move.cellX + 1) % this.boardSize;
        const possibleNextMoves = possibleCellYs.diff(deadEndCellYs).map(cellY => new Move(cellX, cellY, cellValue));

        return possibleNextMoves;
    }

    solveByPickingRandomPossibleNextMove() {
        console.log('****************SOLVING***************');

        let lastMove = this.getLastMove();
        let cellValue = null;

        if (lastMove) {
            cellValue = lastMove.cellValue;
        } else {
            cellValue = 1;
        }

        while (this.getCellValueCount(cellValue) < this.boardSize && (!this.boardIsComplete())) {
            lastMove = this.getLastMove();

            if (!lastMove) {
                // no moves yet
                lastMove = new Move(-1, -1, cellValue);
            }

            let possibleNextMoves = this.getPossibleNextMoves(lastMove);

            // if (possibleNextMoves.length > 0) {
            let moveMade = false;
            // while ((!moveMade) && (possibleNextMoves.length > 0)) {

            while (!moveMade) {

                if (possibleNextMoves.length === 0) {
                    console.log('   BLOCKED');
                    this.undoLastMove();
                    lastMove = this.getLastMove();
                    possibleNextMoves = this.getPossibleNextMoves(lastMove);
                }

                console.log('possibleNextMoves: length=' + possibleNextMoves.length + ' ' + JSON.stringify(possibleNextMoves));
                const moveCandidate = pickRandomElementFromArray(possibleNextMoves);
                // console.log('moveCandidate: ' + JSON.stringify(moveCandidate));
                moveMade = this.tryMove(moveCandidate);
                if (moveMade) {
                    moveCandidate.setPreviousMove(lastMove);
                    if (cellValue < this.boardSize) {
                        cellValue++;
                    }
                } else {
                    possibleNextMoves.splice(possibleNextMoves.indexOf(moveCandidate), 1);
                }
            }
        }
    }


    removeValueFromCell(cellX, cellY) {
        this.setCellValue(cellX, cellY, 0);
    }

    removeValuesFromSolvedBoard() {
        /* 

        We need to remove some values from the solved board so it can be played. Removing values must leave the board with rotational symmetry.

        The set of valid removals for center box, to achieve this symmetry: 
        1) remove the value of the centre cell
        2) remove values from any pair of cells where the cells aren't on same side and there is a cell in between them
        3) any combination of 1 and 2

        The valid removals are then: centre, ne-sw, nw-se, e-w, and n-s, plus all combination of these.

        To be able to select any combination of these, randomly select DO or SKIP for each one.

        In case all are skipped, in order to avoid having a fully populated box, pick one of the valid removals at random and do it.

        An easy board at websudoku.com seems to have 33-36 filled cells ('clues'), depending on the number of filled cells in the center box (nCenter). 
        
        If nCenter is even: nClues = 34 or 36, X = nClues - nCenter. A set of four adjacent boxes is chosen and shares X/2 clues. Remove a value at random from each. Then, until the total number of clues in these boxes is X/2, randomly choose one of the boxes and randomly remove a value. Do the same to the rotationally symmetric cells in the other four boxes. 
        
        If nCenter is odd: nClues = 33 or 35, X = nClues - (nCenter + 1). Repeat as above.
        */

        let clueCount = this.boardSize * this.boardSize; // 81
        const centerBoxClueCount = this.boardSize - this.removeValuesFromCenterBox(); // eg. 2 or 3

        clueCount -= centerBoxClueCount; // e.g. 79 or 78
        const clueCountTarget = (clueCount % 2 == 0) ? 35 : 34;
        const clueCountTargetForOneSide = (clueCountTarget - centerBoxClueCount) / 2;
        console.log('clueCountTargetForOneSide: ' + clueCountTargetForOneSide);

        // this.removeRandomClueFromBoxAndItsCounterpart('nw');
        // this.removeRandomClueFromBoxAndItsCounterpart('w');

        const regionsOfOneSide = ['nw', 'w', 'sw', 's'];

        const board = this;

        regionsOfOneSide.forEach(function(region){
            board.removeRandomClueFromBoxAndItsCounterpart(region);
        });

        clue
    }

    rotate(coordinate) {
        let result = -1;

        switch (coordinate) {
            case 0:
                result = 2;
                break;
            case 1:
                result = 1;
                break;
            case 2:
                result = 0;
                break;
        }

        console.log('rotated: ' + coordinate + result);
        return result;
    }

    removeRandomClueFromBoxAndItsCounterpart(region) {
        // 00 10 20     
        // 01 11 21
        // 02 12 22
        //          66 76 86
        //          67 77 87
        //          68 78 88


        const boxInfo = this.boxInfoByRegion[region];
        const startCellX = boxInfo.startCellX;
        const endCellX = boxInfo.endCellX;
        const startCellY = boxInfo.startCellY;
        const endCellY = boxInfo.endCellY;
        const counterpartRegion = boxInfo.counterpart;
        const cellX = this.randomInt(startCellX, endCellX);
        const cellY = this.randomInt(startCellY, endCellY);

        board.removeValueFromCell(cellX, cellY);

        const boxInfo2 = this.boxInfoByRegion[counterpartRegion]
        const startCellX2 = boxInfo2.startCellX;
        const endCellX2 = boxInfo2.endCellX;
        const startCellY2 = boxInfo2.startCellY;
        const endCellY2 = boxInfo2.endCellY;
        
        const cellX2 = this.rotate(cellX % 3) + startCellX2;
        const cellY2 = this.rotate(cellY % 3) + startCellY2;
        console.log('startCellY2: ' + startCellY2);

        board.removeValueFromCell(cellX2, cellY2);
    }

    removeValuesFromCenterBox() {
        // 33 43 53   nw n ne 
        // 34 44 54 = w  c  e
        // 35 45 55   sw s se

        let removals = {
            'nw-se': [{ cellX: 3, cellY: 3 }, { cellX: 5, cellY: 5 }],
            'sw-ne': [{ cellX: 3, cellY: 5 }, { cellX: 5, cellY: 3 }],
            'e-w': [{ cellX: 3, cellY: 4 }, { cellX: 5, cellY: 4 }],
            'n-s': [{ cellX: 4, cellY: 3 }, { cellX: 4, cellY: 5 }],
            'c': [{ cellX: 4, cellY: 4 }]
        };

        const removalKeys = Object.keys(removals);

        let booleans = [];
        let allRemoved = true;
        let noneRemoved = true;

        for (let i = 0; i < removalKeys.length; i++) {
            const bool = Math.random() >= 0.5;
            booleans[i] = bool;

            if (bool) {
                noneRemoved = false;
            } else {
                allRemoved = false;
            }
        }

        if (noneRemoved || allRemoved) {
            console.log('CENTER BOX MISTAKE');
            console.log('BEFORE: ' + booleans);

            const randIndex = this.randomInt(0, removalKeys.length - 1);
            console.log('randIndex: ' + randIndex);
            booleans[randIndex] = !booleans[randIndex];
            console.log('FIXED: ' + booleans);

        }

        // for (const [removalName, cellList] of removalKeys) {

        const board = this;

        let removedValueCount = 0;

        for (let k = 0; k < removalKeys.length; k++) {
            const bool = booleans[k];
            const key = removalKeys[k];
            console.log(bool + ' ' + key);

            if (bool) {
                removals[key].forEach(function (cell, index) {
                    board.removeValueFromCell(cell.cellX, cell.cellY);
                    ++removedValueCount;
                });
            }
        }

        return removedValueCount;
    }

    solveByPickingRandomEmptyCellFromColumn() {

        while (!this.boardIsComplete()) {
            // debugger;

            console.log('****************SOLVING***************     ');

            // console.log('complete? ' + this.boardIsComplete());

            let lastCellValue = null;

            const lastMove = this.moves.slice(-1)[0];

            let cellValueCount = null;

            for (let cellValue = lastMove.cellValue; cellValue <= this.boardSize; cellValue++) {
                if (lastCellValue) {
                    cellValue = lastCellValue;
                    lastCellValue = null;
                }

                // when to set????????????????? only once????
                if (!cellValueCount) {
                    cellValueCount = this.getCellValueCount(cellValue);
                }

                if (cellValueCount === this.boardSize) {
                    console.log('DONE with cellValue: ' + cellValue);
                    continue;
                }
                console.log('working on cellValue: ' + cellValue);


                for (let cellX = 0; cellX < this.boardSize; cellX++) {

                    if (this.columnContainsCellValue(cellX, cellValue)) {
                        continue;
                    }

                    const arrOfCellY = board.getEmptyCellsInColumn(cellX);
                    let moveNotMadeInColumnYet = true;

                    while (moveNotMadeInColumnYet && arrOfCellY.length > 0) {
                        const cellY = arrOfCellY[Math.floor(Math.random() * arrOfCellY.length)];
                        const cellYIndex = arrOfCellY.indexOf(cellY);
                        // arrOfCellY.splice(cellYIndex, 1);
                        arrOfCellY.splice(arrOfCellY.indexOf(cellYIndex), 1);
                        const move = new Move(cellX, cellY, cellValue);

                        if (this.tryMove(move)) {
                            moveNotMadeInColumnYet = false;
                        }
                    }
                }

                // move 313 is being undone in a loop... could testing cellValueCount at a different time prevent this?

                // is 4 high or 3 low????????????
                const newCellValueCount = this.getCellValueCount(cellValue);

                if (newCellValueCount <= cellValueCount) {
                    console.log('- - B L O C K E D - -');
                    const lastMove = this.undoLastMove();
                    lastCellValue = cellValue;
                }

            }
            // console.log('complete NOW? ' + this.boardIsComplete());
            console.log('^^^^^ MOVE ATTEMPTS ^^^^^ ' + this.moveAttempts);
        }
    }


    solveByIteratingDownEachColumn() {

        let i = 0;

        while (!this.boardIsComplete()) {

            // while (i < 5) {
            console.log('****************SOLVING***************     ' + i);

            console.log('complete? ' + this.boardIsComplete());
            ++i;

            let lastCellValue = null;

            for (let cellValue = 1; cellValue <= boardSize; cellValue++) {

                if (lastCellValue) {
                    cellValue = lastCellValue;
                    lastCellValue = null;
                }

                if (this.getCellValueCount(cellValue) === boardSize) {
                    console.log('DONE with cellValue: ' + cellValue);
                    continue;
                }
                console.log('working on cellValue: ' + cellValue);

                const cellValueCount = this.getCellValueCount(cellValue);

                for (let cellX = 0; cellX < boardSize; cellX++) {
                    for (let cellY = 0; cellY < boardSize; cellY++) {

                        // for (let column = 0; column < boardSize; column++) {
                        //     const row = randomInt(0, boardSize - 1);

                        const move = new Move(cellX, cellY, cellValue);
                        this.tryMove(move);
                    }
                }

                if (this.getCellValueCount(cellValue) === cellValueCount) {
                    console.log('- - B L O C K E D - -');
                    const lastMove = this.undoLastMove();
                    lastCellValue = cellValue;
                }

            }
            console.log('complete NOW? ' + this.boardIsComplete());
        }
    }

    getSolutionArray() {
        this.getSolutionArrayRandom();
    }

    getSolutionArrayRandom() {
        // while (this.validMoveCount < this.numCells) {
        // while (this.moveAttempts < this.numCells) {
        while (this.moveAttempts < 2000) {
            const move = new Move();
            this.tryMove(move);
        }
        console.log('DONE: ' + this.cellValues2D);
        console.log('ATTEMPTS: ' + this.moveAttempts);
        console.log('FILLED: ' + this.validMoveCount);
        return this.cellValues2D;
    }



    moveIsValid(move) {
        if (boardSize === 9) {
            return this.rowIsValid(move) && this.columnIsValid(move) && this.boxIsValid(move);
        } else if (boardSize < 9) {
            return this.rowIsValid(move) && this.columnIsValid(move);
        }
        else return false;
    }

    rowIsValid(move) {
        // console.log('rowIsValid?');

        let result = true;

        for (let i = 0; i < this.boardSize; i++) {
            // console.log([cellValues2D[i][cellY], cellValue].join());
            // console.log([typeof(cellValues2D[i][cellY]), typeof(cellValue)].join());
            if (this.getCellValue(i, move.cellY) !== 0 && this.getCellValue(i, move.cellY) === move.cellValue) {
                result = false;
            }
        }
        // console.log(result);
        return result;
    }

    columnIsValid(move) {
        // console.log('columnIsValid?');

        let result = true;

        for (let j = 0; j < this.boardSize; j++) {
            if (this.getCellValue(move.cellX, j) !== 0 && this.getCellValue(move.cellX, j) === move.cellValue) {
                result = false;
            }
        }

        // console.log(result);
        return result;
    }

    boxIsValid(move) {
        // console.log('boxIsValid?');

        let result = true;

        const startRow = Math.floor(move.cellY / 3) * 3;
        const endRow = startRow + 2;
        const startColumn = Math.floor(move.cellX / 3) * 3;
        const endColumn = startColumn + 2;

        for (let j = startRow; j <= endRow; j++) {
            for (let i = startColumn; i <= endColumn; i++) {
                if (this.getCellValue(i, j) !== 0 && this.getCellValue(i, j) === move.cellValue) {
                    result = false;
                }
            }
        }
        // console.log(result);
        return result;
    }

}


var sudokuCommon = {

    renderEmptyBoard: function (boardSize) {

        const board = document.querySelector('.board');

        for (let i = 0; i < boardSize; i++) {
            const rowNode = document.createElement('tr');
            rowNode.setAttribute('class', 'row');
            board.appendChild(rowNode);

            for (let j = 0; j < boardSize; j++) {
                const cellNode = document.createElement('td');
                cellNode.setAttribute('class', 'cell');
                rowNode.appendChild(cellNode);
            }
        }

        if (boardSize === 9) {
            const cellsInRows3and6 = document.querySelectorAll(".row:nth-child(3) .cell, .row:nth-child(6) .cell");
            cellsInRows3and6.forEach(function (cell, index) {
                cell.classList.add('specialBottomBorder');
            });

            const cellsInColumns3and6 = document.querySelectorAll(".cell:nth-child(3), .cell:nth-child(6)");
            cellsInColumns3and6.forEach(function (cell, index) {
                cell.classList.add('specialRightBorder');
            });

        }
    },

    loadDummyPuzzle: function () {
        const xhttp = new XMLHttpRequest();
        let initialCellValues = null;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const response = JSON.parse(xhttp.responseText);
                initialCellValues = response.initialCellValues;
            }
        };
        xhttp.open('GET', 'example-puzzle.json', false);
        xhttp.send();
        return initialCellValues;
    },

    play: function () {

        const boardSize = 9;
        this.renderEmptyBoard(boardSize);

        var initialCellValues = this.loadDummyPuzzle();

        // Cache board cells from DOM
        const cells = document.querySelectorAll('.cell');

        let cellValues2D = initializeCellValues2D(boardSize);

        // Populate cells and cellValues2D (for checking move validity) arrays with values from initialCellValues. 
        cells.forEach(function (cell, cellIndex) {
            const cellX = cellIndex % boardSize;
            const cellY = Math.floor(cellIndex / boardSize);
            let cellValue = null;

            if (initialCellValues[cellIndex] === 0) {
                // It's an empty cell.
                cellValue = '';
            } else {
                // It's a clue cell.
                cellValue = initialCellValues[cellIndex].toString();
                cell.classList.add('clueCell');
            }
            cell.innerText = cellValue;
            cellValues2D[cellX][cellY] = cellValue;
        });

        // Set up keypad
        const inputCells = document.querySelectorAll('.inputCell');

        inputCells.forEach(function (cell, index) {
            if (index < inputCells.length - 1) {
                cell.innerText = (index + 1).toString();
            }
        });
        const inputTable = document.querySelector('.inputTable');


        // Used to ensure one cell is active (selected) at a time
        let activeCellIndex = null;

        // Add event listeners to all cells except clue cells.
        cells.forEach(function (cell, cellIndex) {
            // Non-clue cells
            if (initialCellValues[cellIndex] === 0) {

                cell.addEventListener('click', function () {

                    // Activate cell. Only one cell should be active at a time.
                    if (activeCellIndex !== null) {
                        cells[activeCellIndex].classList.remove('activeCell');
                    }
                    activeCellIndex = cellIndex;
                    cells[activeCellIndex].classList.add('activeCell');

                    // Activate keypad.
                    inputTable.classList.add('inputTableActive');
                    inputCells.forEach(function (inputCell, inputCellIndex) {
                        const cellValue = inputCell.innerText;

                        // Use onClick instead of addEventListener as we need to replace a handler, not add one.
                        inputCell.onclick = function () {
                            if (!moveIsValid(cellIndex, cellValue)) {
                                console.log('INVALID MOVE');

                                // Show that the move breaks the sudoku rules.
                                cell.classList.add('invalidMove');
                            } else {
                                cell.classList.remove('invalidMove');
                            }

                            // Set cell value in DOM
                            cell.innerText = cellValue;

                            // Set cell value in 2D array used to check move validity
                            const cellX = cellIndex % boardSize;
                            const cellY = Math.floor(cellIndex / boardSize);
                            cellValues2D[cellX][cellY] = cellValue;

                            // Deactivate cell 
                            cell.classList.remove('activeCell');

                            // Deactivate input keypad
                            inputTable.classList.remove('inputTableActive');
                            inputCells.forEach(function (inputCell, inputCellIndex) {
                                inputCell.onclick = function () { return false; };
                            });
                        };
                    });
                });
            } else {
                // Clue cell
                cell.innerText = initialCellValues[cellIndex];
                cell.classList.add('clueCell');
            }
        });


        var hintsEnabled = false;
        const hintsButton = document.querySelector('.hintsButton');

        // what if you enable hints part-way through. Do you see past invalid moves?
        hintsButton.addEventListener('click', function () {
            hintsEnabled = !hintsEnabled;

            if (hintsEnabled) {
                hintsButton.innerText = 'Disable hints';
            } else {
                hintsButton.innerText = 'Enable hints';
            }

        });


        function moveIsValid(cellIndex, cellValue) {

            const cellX = cellIndex % boardSize;
            const cellY = Math.floor(cellIndex / boardSize);

            function rowIsValid() {
                console.log('rowIsValid?');

                let result = true;

                for (let i = 0; i < boardSize; i++) {
                    // console.log([cellValues2D[i][cellY], cellValue].join());
                    // console.log([typeof(cellValues2D[i][cellY]), typeof(cellValue)].join());
                    if (cellValues2D[i][cellY] !== '' && cellValues2D[i][cellY] === cellValue) {
                        result = false;
                    }
                }
                console.log(result);
                return result;
            }

            function columnIsValid() {
                console.log('columnIsValid?');

                let result = true;

                for (let j = 0; j < boardSize; j++) {
                    if (cellValues2D[cellX][j] !== '' && cellValues2D[cellX][j] === cellValue) {
                        result = false;
                    }
                }

                console.log(result);
                return result;
            }

            function boxIsValid() {
                console.log('boxIsValid?');

                let result = true;

                const startRow = Math.floor(cellY / 3) * 3;
                const endRow = startRow + 2;
                const startColumn = Math.floor(cellX / 3) * 3;
                const endColumn = startColumn + 2;

                for (j = startRow; j <= endRow; j++) {
                    for (i = startColumn; i <= endColumn; i++) {
                        if (cellValues2D[i][j] !== '' && cellValues2D[i][j] === cellValue) {
                            result = false;
                        }
                    }
                }
                console.log(result);
                return result;
            }

            return rowIsValid() && columnIsValid() && boxIsValid();

            // console.log('cellValues2D: ' + cellValues2D);
        }



        function initializeCellValues2D(boardSize) {
            // Build 2D array used to check move validity
            let cellValues2D = new Array(boardSize);
            for (let i = 0; i < cellValues2D.length; i++) {
                cellValues2D[i] = new Array(boardSize);
            }

            console.log(this);

            for (let i = 0; i < cells.length; i++) {
                const x = i % boardSize;
                const y = Math.floor(i / boardSize);
                cellValues2D[x][y] = cells[i].innerText;
            }
            return cellValues2D;
        }

    },

    generateSolutionArray: function (boardSize) {
        const arrays = new Board(boardSize).getSolutionArray();
        const merged = [].concat.apply([], arrays);
        return merged;
    },

    // have this take a board so we can start from a given state and see if we can finish it
    generateSolutionArrayFromBoard: function (board) {

    },

    populateBoard: function (cellValues) {

        // Cache board cells from DOM
        const cells = document.querySelectorAll('.cell');
        const rows = document.querySelectorAll('.row');

        // Populate cells and cellValues2D (for checking move validity) arrays with values from cellValues. 
        cells.forEach(function (cell, cellIndex) {
            const cellX = cellIndex % boardSize;
            const cellY = Math.floor(cellIndex / boardSize);
            let cellValue = null;

            if (cellValues[cellIndex] === 0) {
                // It's an empty cell.
                cellValue = '';
            } else {
                // It's a clue cell.
                cellValue = cellValues[cellIndex].toString();
                cell.classList.add('clueCell');
            }
            cell.innerText = cellValue;
            // cellValues2D[cellX][cellY] = cellValue;
        });
    },

};
