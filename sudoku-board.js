const Move = require('./sudoku-move.js');

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
            this.regionInfo = {
                'nw': { startCellX: 0, endCellX: 2, startCellY: 0, endCellY: 2, counterpart: 'se' },
                'n': { startCellX: 3, endCellX: 5, startCellY: 0, endCellY: 2, counterpart: 's' },
                'ne': { startCellX: 6, endCellX: 8, startCellY: 0, endCellY: 2, counterpart: 'sw' },
                'w': { startCellX: 0, endCellX: 2, startCellY: 3, endCellY: 5, counterpart: 'e' },
                'c': { startCellX: 3, endCellX: 5, startCellY: 3, endCellY: 5, counterpart: 'c' },
                'e': { startCellX: 6, endCellX: 8, startCellY: 3, endCellY: 5, counterpart: 'w' },
                'sw': { startCellX: 0, endCellX: 2, startCellY: 6, endCellY: 8, counterpart: 'ne' },
                's': { startCellX: 3, endCellX: 5, startCellY: 6, endCellY: 8, counterpart: 'n' },
                'se': { startCellX: 6, endCellX: 8, startCellY: 6, endCellY: 8, counterpart: 'nw' },
            };
        }

        // From https://stackoverflow.com/a/4026828:
        Array.prototype.diff = function (arr) {
            return this.filter(function (i) {
                return arr.indexOf(i) < 0;
            });
        };
    }


    pickRandomElementFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
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
        this.cellValueCounts[cellValue]++;

        if (this.cellValueCounts[cellValue] === this.boardSize) {
            this.countCompleteCellValues++;
        }
    }

    decrementCellValueCount(cellValue) {
        if (this.cellValueCounts[cellValue] === this.boardSize) {
            this.countCompleteCellValues--;
        }

        this.cellValueCounts[cellValue]--;
    }

    boardIsComplete() {
        return this.countCompleteCellValues === this.boardSize;
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
            return true;
        } else {
            console.log('NOT Played: ' + JSON.stringify(move));
            return false;
        }
    }

    tryMove2(move) {
        console.log('tryMove2: ' + JSON.stringify(move));
        this.moveAttempts++;
        this.setCellValue(move.cellX, move.cellY, move.cellValue);
        this.validMoveCount++;
        this.moves.push(move);
        this.incrementCellValueCount(move.cellValue);
        return this.moveIsValid(move);
    }

    undoLastMove() {
        if (this.moves.length > 0) {
            const lastMove = this.moves.pop();
            lastMove.deadEnd = true;
            this.setCellValue(lastMove.cellX, lastMove.cellY, 0);
            this.decrementCellValueCount(lastMove.cellValue);
            lastMove.getPreviousMove().deadEndNextMoves.push(lastMove);
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
        if (this.getCellValue(cellX, cellY) === 0) {
            return true;
        }
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
        const merged = [].concat.apply([], this.cellValues2D);
        return merged;
    }



    solve() {
        this.solveByPickingRandomPossibleNextMove();
    }

    getPossibleNextMoves(move) {
        let possibleCellYs = [];

        for (let i = 0; i < this.boardSize; i++) {
            if (i != move.cellY) {
                possibleCellYs.push(i);
            }
        }

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
            let moveMade = false;

            while (!moveMade) {

                if (possibleNextMoves.length === 0) {
                    console.log('   BLOCKED');
                    this.undoLastMove();
                    lastMove = this.getLastMove();
                    possibleNextMoves = this.getPossibleNextMoves(lastMove);
                }

                console.log('possibleNextMoves: length=' + possibleNextMoves.length + ' ' + JSON.stringify(possibleNextMoves));
                const moveCandidate = this.pickRandomElementFromArray(possibleNextMoves);
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

        if (this.getCellValue(cellX, cellY) === 0) {
            return false;
        }

        this.setCellValue(cellX, cellY, 0);
        return true;
    }

    removeValuesFromSolvedBoard() {
        /* 

        We need to remove some values from the solved board so it can be played. Removing values must leave the board with rotational symmetry.

        The set of valid removals for center region, to achieve this symmetry: 
        1) remove the value of the centre cell
        2) remove values from any pair of cells where the cells aren't on same side and there is a cell in between them
        3) any combination of 1 and 2

        The valid removals are then: centre, ne-sw, nw-se, e-w, and n-s, plus all combination of these.

        To be able to select any combination of these, randomly select DO or SKIP for each one.

        In case all are skipped, in order to avoid having a fully populated region, pick one of the valid removals at random and do it.

        An easy board at websudoku.com seems to have 33-36 filled cells ('clues'), depending on the number of filled cells in the center region (nCenter). 
        
        If nCenter is even: nClues = 34 or 36, X = nClues - nCenter. A set of four adjacent regions is chosen and shares X/2 clues. Remove a value at random from each. Then, until the total number of clues in these regions is X/2, randomly choose one of the regions and randomly remove a value. Do the same to the rotationally symmetric cells in the other four regions. 
        
        If nCenter is odd: nClues = 33 or 35, X = nClues - (nCenter + 1). Repeat as above.
        */

        let clueCount = this.boardSize * this.boardSize; // 81
        const numCluesRemovedFromCenterRegion = this.removeValuesFromCenterRegion();
        const centerRegionClueCount = this.boardSize - numCluesRemovedFromCenterRegion; // eg. 2 or 3
        clueCount -= numCluesRemovedFromCenterRegion; // e.g. 79 or 78
        const clueCountTarget = (clueCount % 2 == 0) ? 35 : 34;
        const clueCountTargetForOneSide = Math.floor((clueCountTarget - centerRegionClueCount) / 2);
        console.log('clueCountTargetForOneSide: ' + clueCountTargetForOneSide);
        const regionsOfOneSide = ['nw', 'w', 'sw', 's'];
        let removalCountByRegion = { 'nw': 0, 'w': 0, 'sw': 0, 's': 0 };

        const board = this;

        // remove a value from each region and its counterpart
        regionsOfOneSide.forEach(function (region) {
            board.removeRandomClueFromRegionAndItsCounterpart(region);
            removalCountByRegion[region]++;
        });

        clueCount -= 2 * regionsOfOneSide.length;

        while (clueCount > clueCountTarget) {
            const region = regionsOfOneSide[Math.floor(Math.random() * regionsOfOneSide.length)];

            // Removes unless 8 have already been removed from region
            if (removalCountByRegion[region] < this.boardSize - 1) {
                this.removeRandomClueFromRegionAndItsCounterpart(region);
                removalCountByRegion[region]++;
                clueCount -= 2;
            }
        }
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

        // console.log('rotated: ' + coordinate + result);
        return result;
    }

    removeRandomClueFromRegionAndItsCounterpart(region) {
        // 00 10 20     
        // 01 11 21
        // 02 12 22
        //          66 76 86
        //          67 77 87
        //          68 78 88


        let triedCells = new Set();
        let firstValueWasRemoved = false;

        // Loops until we actually remove values

        while (!firstValueWasRemoved && triedCells.size < this.boardSize) {

            // Tries to remove the value of a cell in region:

            const regionInfo = this.regionInfo[region];
            const startCellX = regionInfo.startCellX;
            const endCellX = regionInfo.endCellX;
            const startCellY = regionInfo.startCellY;
            const endCellY = regionInfo.endCellY;
            const counterpartRegion = regionInfo.counterpart;

            const cellX = this.randomInt(startCellX, endCellX);
            const cellY = this.randomInt(startCellY, endCellY);

            // Keeps track of cells seen so far, so we don't loop forever.

            triedCells.add(cellX.toString() + cellY.toString());

            firstValueWasRemoved = board.removeValueFromCell(cellX, cellY);
            console.log('removed: ' + firstValueWasRemoved);

            // Tries to remove the value of the corresponding cell in the counterpart region:

            const regionInfo2 = this.regionInfo[counterpartRegion];
            const startCellX2 = regionInfo2.startCellX;
            const endCellX2 = regionInfo2.endCellX;
            const startCellY2 = regionInfo2.startCellY;
            const endCellY2 = regionInfo2.endCellY;

            const cellX2 = this.rotate(cellX % 3) + startCellX2;
            const cellY2 = this.rotate(cellY % 3) + startCellY2;

            board.removeValueFromCell(cellX2, cellY2);
        }

        return firstValueWasRemoved;
    }

    removeValuesFromCenterRegion() {
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

            let lastCellValue = null;

            const lastMove = this.moves.slice(-1)[0];

            let cellValueCount = null;

            for (let cellValue = lastMove.cellValue; cellValue <= this.boardSize; cellValue++) {
                if (lastCellValue) {
                    cellValue = lastCellValue;
                    lastCellValue = null;
                }

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


                const newCellValueCount = this.getCellValueCount(cellValue);

                if (newCellValueCount <= cellValueCount) {
                    console.log('- - B L O C K E D - -');
                    const lastMove = this.undoLastMove();
                    lastCellValue = cellValue;
                }

            }
            console.log('^^^^^ MOVE ATTEMPTS ^^^^^ ' + this.moveAttempts);
        }
    }


    solveByIteratingDownEachColumn() {

        let i = 0;

        while (!this.boardIsComplete()) {

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
        let result = false;

        if (this.boardSize === 9) {
            result = this.rowIsValid(move) && this.columnIsValid(move) && this.regionIsValid(move);
        } else if (boardSize < 9) {
            result = this.rowIsValid(move) && this.columnIsValid(move);
        }

        console.log('moveIsValid: ' + result);
        return result;
    }

    rowIsValid(move) {
        // console.log('rowIsValid?');

        let result = true;

        for (let cellX = 0; cellX < this.boardSize; cellX++) {
            // console.log([cellValues2D[i][cellY], cellValue].join());
            // console.log([typeof(cellValues2D[i][cellY]), typeof(cellValue)].join());
            // console.log('xyvtMt: ' + cellX + move.cellY + this.getCellValue(cellX, move.cellY) + typeof(this.getCellValue(cellX, move.cellY)) + typeof(move.cellValue));
            console.log('rowIsValid - xy: ' + cellX + move.cellY);
            if (this.getCellValue(cellX, move.cellY) !== 0 && this.getCellValue(cellX, move.cellY) === move.cellValue) {
                result = false;
            }
        }
        // console.log(result);
        console.log('rowIsValid: ' + result);
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
        console.log('columnIsValid: ' + result);
        return result;
    }

    regionIsValid(move) {
        // console.log('regionIsValid?');

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
        console.log('regionIsValid: ' + result);
        return result;
    }

    play() {
        const boardSize = this.boardSize;

        // this.renderEmptyBoard(boardSize);

        // var initialCellValues = this.loadDummyPuzzle();

        // Cache board cells from DOM
        const cells = document.querySelectorAll('.cell');

        // let cellValues2D = initializeCellValues2D(boardSize);

        // Populate cells and cellValues2D (for checking move validity) arrays with values from initialCellValues.         
        // cells.forEach(function (cell, cellIndex) {
        //     const cellX = cellIndex % boardSize;
        //     const cellY = Math.floor(cellIndex / boardSize);
        //     let cellValue = null;

        //     if (initialCellValues[cellIndex] === 0) {
        //         // It's an empty cell.
        //         cellValue = '';
        //     } else {
        //         // It's a clue cell.
        //         cellValue = initialCellValues[cellIndex].toString();
        //         cell.classList.add('clueCell');
        //     }
        //     cell.innerText = cellValue;
        //     cellValues2D[cellX][cellY] = cellValue;
        // });


        // Set up keypad
        const inputCells = document.querySelectorAll('.inputCell');

        inputCells.forEach(function (cell, index) {
            if (index < inputCells.length - 1) {
                cell.innerText = (index + 1).toString();
            }
        });
        const inputTable = document.querySelector('.inputTable');


        // Helps ensure only one cell is active (selected) at a time
        let activeCellIndex = null;

        // Adds event listeners to all cells except clue cells.
        const board = this;

        cells.forEach(function (cell, cellIndex) {
            // Non-clue cells
            // if (initialCellValues[cellIndex] === 0) {
            const cellX = cellIndex % boardSize;
            const cellY = Math.floor(cellIndex / boardSize);

            // if (initialCellValues[cellIndex] === 0) {
            if (board.getCellValue(cellX, cellY) === 0) {

                cell.addEventListener('click', function () {

                    // Deactivates active cell if there is one, then activates selected cell. 
                    if (activeCellIndex !== null) {
                        cells[activeCellIndex].classList.remove('activeCell');
                    }
                    activeCellIndex = cellIndex;
                    cells[activeCellIndex].classList.add('activeCell');

                    // Activates keypad.
                    inputTable.classList.add('inputTableActive');
                    inputCells.forEach(function (inputCell, inputCellIndex) {

                        const renderedCellValue = inputCell.innerText;
                        const numericCellValue = Number(renderedCellValue);

                        // Uses onClick instead of addEventListener (as we need to replace a handler, not add one)
                        inputCell.onclick = function () {

                            // if (numericCellValue === 0) {
                            //     this.undoLastMove();
                            // }

                            const move = new Move(cellX, cellY, numericCellValue);
                            const validMove = board.tryMove2(move);

                            if (!validMove) {
                                console.log('INVALID MOVE');
                                // Show that the move breaks the sudoku rules.
                                cell.classList.add('invalidMove');
                            } else {
                                // Todo: only remove the class if the element has it.
                                cell.classList.remove('invalidMove');
                            }

                            // Sets cell value in DOM.
                            cell.innerText = renderedCellValue;

                            // Sets cell value in 2D array used to check move validity
                            // const cellX = cellIndex % boardSize;
                            // const cellY = Math.floor(cellIndex / boardSize);
                            // cellValues2D[cellX][cellY] = cellValue;

                            // Deactivates cell 
                            cell.classList.remove('activeCell');

                            // Deactivates input keypad
                            inputTable.classList.remove('inputTableActive');
                            inputCells.forEach(function (inputCell, inputCellIndex) {
                                inputCell.onclick = function () { return false; };
                            });
                        };
                    });
                });
                // } else {
                //     // Clue cell
                //     cell.innerText = initialCellValues[cellIndex];
                //     cell.classList.add('clueCell');
            }
        });

    }

    renderEmptyBoard() {

        const boardSize = this.boardSize;
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
    }

    populateBoard() {

        // Cache board cells from DOM
        const cells = document.querySelectorAll('.cell');
        const rows = document.querySelectorAll('.row');
        const board = this;

        // Populate cells and cellValues2D (for checking move validity) arrays with values from cellValues. 
        cells.forEach(function (cell, cellIndex) {
            const cellX = cellIndex % boardSize;
            const cellY = Math.floor(cellIndex / boardSize);
            const cellValue = board.getCellValue(cellX, cellY);
            let cellValueToRender = null;

            // if (cellValues[cellIndex] === 0) {

            if (cellValue === 0) {
                // It's an empty cell.
                cellValueToRender = '';
            } else {
                // It's a clue cell.
                // cellValue = cellValues[cellIndex].toString();
                cellValueToRender = cellValue.toString();
                cell.classList.add('clueCell');
            }
            cell.innerText = cellValueToRender;
            // cellValues2D[cellX][cellY] = cellValue;
        });
    }
}

module.exports = Board;
