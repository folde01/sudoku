const Move = require('./move');

class Board {
    constructor() {
        
        this.boardSize = 9;
        this.numCells = this.boardSize * this.boardSize;
        this.cellValueCounts = new Array(this.boardSize + 1).fill(0);
        this.domCache = {};
        this.reset();
        
        if (this.boardSize === 9) {
            this.regionInfo = {
                'nw': { startCellX: 0, endCellX: 2, startCellY: 0, endCellY: 2, counterpart: 'se' },
                'n':  { startCellX: 3, endCellX: 5, startCellY: 0, endCellY: 2, counterpart: 's'  },
                'ne': { startCellX: 6, endCellX: 8, startCellY: 0, endCellY: 2, counterpart: 'sw' },
                'w':  { startCellX: 0, endCellX: 2, startCellY: 3, endCellY: 5, counterpart: 'e'  },
                'c':  { startCellX: 3, endCellX: 5, startCellY: 3, endCellY: 5, counterpart: 'c'  },
                'e':  { startCellX: 6, endCellX: 8, startCellY: 3, endCellY: 5, counterpart: 'w'  },
                'sw': { startCellX: 0, endCellX: 2, startCellY: 6, endCellY: 8, counterpart: 'ne' },
                's':  { startCellX: 3, endCellX: 5, startCellY: 6, endCellY: 8, counterpart: 'n'  },
                'se': { startCellX: 6, endCellX: 8, startCellY: 6, endCellY: 8, counterpart: 'nw' }
            };
        }
        
        // From https://stackoverflow.com/a/4026828:
        Array.prototype.diff = function (arr) {
            return this.filter(function (i) {
                return arr.indexOf(i) < 0;
            });
        };
    }
    
    reset() {
        this.filledCellCount = 0;
        this.cellDB = this.initializeCellDB();
        this.validMoveCount = 0;
        this.moveAttempts = 0;
        this.moves = [];
        this.cellValueCounts = new Array(this.boardSize + 1).fill(0);
        this.countCompleteCellValues = 0;
        this.completeCellValueCounts = new Array(this.boardSize).fill(this.boardSize);
        this.fillDomCache();
    }
    
    fillDomCache() {
        this.domCache.inputTable = document.querySelector('.inputTable');
        this.domCache.inputCells = document.querySelectorAll('.inputCell');
        this.domCache.newGameButton = document.querySelector('.newGame');
    }
    
    pickRandomElementFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    
    randomInt(min, max) {
        const ceilMin = Math.ceil(min);
        const floorMax = Math.floor(max);
        return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
    }
    
    initializeCellDB() {
        
        const boardSize = this.boardSize;
        
        let cellDB = new Array(boardSize);
        
        for (let i = 0; i < boardSize; i++) {
            cellDB[i] = new Array(boardSize);
            
            for (let j = 0; j < boardSize; j++) {
                cellDB[i][j] = {
                    cellValue: 0,
                    conflicting: false,
                    isClue: true,
                    solutionValue: null
                };
            }
            
        }
        
        return cellDB;
    }
    
    getMoves() {
        return this.moves;
    }
    
    setCellValue(cellX, cellY, cellValue) {
        
        const oldCellValue = this.getCellValue(cellX, cellY);
        this.cellDB[cellY][cellX].cellValue = cellValue;
        
        if (oldCellValue === 0 && cellValue > 0) {
            this.filledCellCount++;
        } else if (oldCellValue > 0 && cellValue === 0) {
            this.filledCellCount--;
        }
    }
    
    getCellValue(cellX, cellY) {
        return this.cellDB[cellY][cellX].cellValue;
    }
    
    getRowValues(cellY){
        return this.cellDB[cellY].map((cell) => cell.cellValue);
    }
    
    getColumnValues(cellX){
        let cellValues = [];
        
        for (let cellY = 0; cellY < this.boardSize; cellY++) {
            cellValues.push(this.cellDB[cellY][cellX].cellValue);
        }
        
        return cellValues;  
    }
    
    getRegionValues(region){
        let cellValues = [];
        
        const regionInfo = this.regionInfo[region];
        
        for (let cellX = regionInfo.startCellX; cellX <= regionInfo.endCellX; cellX++) {
            for (let cellY = regionInfo.startCellY; cellY <= regionInfo.endCellY; cellY++) {
                cellValues.push(this.getCellValue(cellX, cellY));
            }
        }
        
        return cellValues;
    }
    
    setCellClueStatus(cellX, cellY, isClue) {
        this.cellDB[cellY][cellX].isClue = isClue;
    }
    
    getCellClueStatus(cellX, cellY) {
        return this.cellDB[cellY][cellX].isClue;
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
    
    getCellSolutionValue(cellX, cellY) {
        return this.cellDB[cellY][cellX].solutionValue;
    }
    
    setCellSolutionValue(cellX, cellY, solutionValue) {
        this.cellDB[cellY][cellX].solutionValue = solutionValue;
    }
    
    removeCellSolutionValue(cellX, cellY) {
        this.cellDB[cellY][cellX].solutionValue = null;
    }
    
    tryMove(move) {
        this.moveAttempts++;
        if (this.cellIsEmpty(move.cellX, move.cellY) && this.moveIsValid(move)) {
            this.setCellValue(move.cellX, move.cellY, move.cellValue);
            this.setCellSolutionValue(move.cellX, move.cellY, move.cellValue);
            this.validMoveCount++;
            this.moves.push(move);
            this.incrementCellValueCount(move.cellValue);
            return true;
        } else {
            return false;
        }
    }
    
    
    undoLastMove() {
        if (this.moves.length > 0) {
            const lastMove = this.moves.pop();
            lastMove.deadEnd = true;
            this.setCellValue(lastMove.cellX, lastMove.cellY, 0);
            this.removeCellSolutionValue(lastMove.cellX, lastMove.cellY);
            this.decrementCellValueCount(lastMove.cellValue);
            lastMove.getPreviousMove().deadEndNextMoves.push(lastMove);
            return lastMove;
        } else {
            return;
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
        const merged = [].concat.apply([], this.cellDB.map((elem) => elem.cellValue));
        return merged;
    }
    
    
    
    solve() {
        this.reset();
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
                    this.undoLastMove();
                    lastMove = this.getLastMove();
                    possibleNextMoves = this.getPossibleNextMoves(lastMove);
                }
                
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
    
    
    
    removeClue(cellX, cellY) {
        
        if (this.getCellValue(cellX, cellY) === 0) {
            return false;
        }
        
        this.setCellValue(cellX, cellY, 0);
        this.setCellClueStatus(cellX, cellY, false);
        
        return true;
    }
    
    removeCluesFromSolvedBoard(difficulty) {
        
        let removalFunc;
        
        if (difficulty === 'dev') {
            removalFunc = this.removeOneClueFromSolvedBoard;
        } else {
            removalFunc = this.removeCluesFromSolvedBoardMediumDifficulty;
        }
        
        removalFunc.call(this);
    }
    
    
    removeOneClueFromSolvedBoard() {
        // For development purposes
        this.removeClue(0, 0);
    }
    
    removeCluesFromSolvedBoardMediumDifficulty() {
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
        // const clueCountTarget = (clueCount % 2 == 0) ? 75 : 74;
        const clueCountTargetForOneSide = Math.floor((clueCountTarget - centerRegionClueCount) / 2);
        const regionsOfOneSide = ['nw', 'w', 'sw', 's'];
        let removalCountByRegion = { 'nw': 0, 'w': 0, 'sw': 0, 's': 0 };
        
        const board = this;
        
        // Removes a value from each region and its counterpart
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
        
        return result;
    }
    
    removeRandomClueFromRegionAndItsCounterpart(region) {
        const board = this;
        
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
            
            firstValueWasRemoved = board.removeClue(cellX, cellY);
            
            // Tries to remove the value of the corresponding cell in the counterpart region:
            
            const regionInfo2 = this.regionInfo[counterpartRegion];
            const startCellX2 = regionInfo2.startCellX;
            const endCellX2 = regionInfo2.endCellX;
            const startCellY2 = regionInfo2.startCellY;
            const endCellY2 = regionInfo2.endCellY;
            
            const cellX2 = this.rotate(cellX % 3) + startCellX2;
            const cellY2 = this.rotate(cellY % 3) + startCellY2;
            
            board.removeClue(cellX2, cellY2);
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
            const randIndex = this.randomInt(0, removalKeys.length - 1);
            booleans[randIndex] = !booleans[randIndex];
        }
        
        
        const board = this;
        let removedValueCount = 0;
        
        for (let k = 0; k < removalKeys.length; k++) {
            const bool = booleans[k];
            const key = removalKeys[k];
            
            if (bool) {
                removals[key].forEach(function (cell, index) {
                    board.removeClue(cell.cellX, cell.cellY);
                    ++removedValueCount;
                });
            }
        }
        
        return removedValueCount;
    }
    
    solveByPickingRandomEmptyCellFromColumn() {
        
        while (!this.boardIsComplete()) {
            // debugger;
            
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
                    continue;
                }
                
                
                for (let cellX = 0; cellX < this.boardSize; cellX++) {
                    
                    if (this.columnContainsCellValue(cellX, cellValue)) {
                        continue;
                    }
                    
                    const arrOfCellY = board.getEmptyCellsInColumn(cellX);
                    let moveNotMadeInColumnYet = true;
                    
                    while (moveNotMadeInColumnYet && arrOfCellY.length > 0) {
                        const cellY = arrOfCellY[Math.floor(Math.random() * arrOfCellY.length)];
                        const cellYIndex = arrOfCellY.indexOf(cellY);
                        arrOfCellY.splice(arrOfCellY.indexOf(cellYIndex), 1);
                        const move = new Move(cellX, cellY, cellValue);
                        
                        if (this.tryMove(move)) {
                            moveNotMadeInColumnYet = false;
                        }
                    }
                }
                
                
                const newCellValueCount = this.getCellValueCount(cellValue);
                
                if (newCellValueCount <= cellValueCount) {
                    const lastMove = this.undoLastMove();
                    lastCellValue = cellValue;
                }
                
            }
        }
    }
    
    moveIsValid(move) {
        let result = false;
        
        if (this.boardSize === 9) {
            result = this.rowIsValid(move) && this.columnIsValid(move) && this.regionIsValid(move);
        } else if (boardSize < 9) {
            result = this.rowIsValid(move) && this.columnIsValid(move);
        }
        
        return result;
    }
    
    playMove(move) {
        this.setCellValue(move.cellX, move.cellY, 0);
        const moveIsValid = this.moveIsValid(move);
        this.setCellValue(move.cellX, move.cellY, move.cellValue);
        this.incrementCellValueCount(move.cellValue);
        // this.updateConflicts(move);
        return moveIsValid;
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
    
    
    
    rowIsValid(move) {
        // todo: return if false
        let result = true;
        
        for (let cellX = 0; cellX < this.boardSize; cellX++) {
            if (this.getCellValue(cellX, move.cellY) !== 0 && this.getCellValue(cellX, move.cellY) === move.cellValue) {
                result = false;
            }
        }
        return result;
    }
    
    columnIsValid(move) {
        // todo: return if false
        let result = true;
        
        for (let j = 0; j < this.boardSize; j++) {
            if (this.getCellValue(move.cellX, j) !== 0 && this.getCellValue(move.cellX, j) === move.cellValue) {
                result = false;
            }
        }
        
        return result;
    }
    
    regionIsValid(move) {
        // todo: return if false
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
        
        return result;
    }
    
    getDomCell(cellX, cellY) {
        
        // Todo: cache these
        const boardSize = this.boardSize;
        const selector = '#cell' + cellX + cellY;
        if (isNaN(cellX) || isNaN(cellY) || cellX > boardSize - 1 || cellX < 0 || cellY > boardSize - 1 || cellY < 0) {
            throw "getDomCell: unexpected cell coordinate. (cellX, cellY): " + cellX + ', ' + cellY;
        }
        return document.querySelector(selector);
    }
    
    removeConflictHighlighting(cellX, cellY) {
        
        if (this.getCellClueStatus(cellX, cellY) === true) {
            return;
        }
        
        try {
            const domCell = this.getDomCell(cellX, cellY);
            domCell.classList.remove('invalidMove');
        } catch (e) {
            throw "removeConflictHighlighting caught exception: " + e;
        }
    }
    
    addConflictHighlighting(cellX, cellY) {
        
        if (this.getCellClueStatus(cellX, cellY) === true) {
            return;
        }
        
        try {
            const domCell = this.getDomCell(cellX, cellY);
            domCell.classList.add('invalidMove');
        } catch (e) {
            throw "addConflictHighlighting caught exception: " + e;
        }
    }
    
    userHasSolvedPuzzle() {
        const boardSize = this.boardSize;
        
        // Returns if board isn't filled yet.
        if (this.filledCellCount !== boardSize * boardSize) {
            return false;
        }
        
        // Checks row and columns for conflicts and correct number counts
        for (let i = 0; i < boardSize; i++) {
            const rowValues = new Set(this.getRowValues(i));
            const columnValues = new Set(this.getColumnValues(i));
            
            if (rowValues.size !== boardSize || columnValues.size !== boardSize) {
                return false;
            }
        }
        
        // Checks for region conflicts
        for (let region in this.regionInfo) {
            if (this.regionInfo.hasOwnProperty(region)){
                const regionValues = new Set(this.getRegionValues(region));
                
                if (regionValues.size !== boardSize) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    doGameOver() {
        const gameOverNode = document.querySelector('.gameOver');
        gameOverNode.innerText = 'WOOHOO YOU WON!';
        // Todo: make game look and feel over
    }
    
    hideGameOver() {
        const gameOverNode = document.querySelector('.gameOver');
        gameOverNode.innerText = '';
    }
    
    play() {
        
        this.solve();
        // this.removeCluesFromSolvedBoard('dev');
        this.removeCluesFromSolvedBoard();
        this.renderEmptyBoard();
        this.populateBoard();
        
        const boardSize = this.boardSize;
        
        // Cache board cells from DOM
        const cells = document.querySelectorAll('.cell');
        
        // Set up keypad
        // const inputCells = document.querySelectorAll('.inputCell');
        const inputCells = this.domCache.inputCells;
        
        inputCells.forEach(function (cell, index) {
            if (index < inputCells.length - 1) {
                cell.innerText = (index + 1).toString();
            }
        });
        
        // const inputTable = document.querySelector('.inputTable');
        const inputTable = this.domCache.inputTable;
        
        // Helps ensure only one cell is ever active (selected) at a time
        let activeCellIndex = null;
        
        const board = this;
        
        // New Game button
        const newGameButton = this.domCache.newGameButton;
        newGameButton.onclick = function () {
            board.play();
        };
        
        // Adds event listeners to all cells except clue cells.
        cells.forEach(function (cell, cellIndex) {
            // Non-clue cells
            const cellX = cellIndex % boardSize;
            const cellY = Math.floor(cellIndex / boardSize);
            
            if (board.getCellValue(cellX, cellY) === 0) {
                
                cell.addEventListener('click', function () {
                    
                    // Removes any conflict highlighting from last move
                    board.removeAllConflicts();
                    
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
                            
                            const move = new Move(cellX, cellY, numericCellValue);
                            const validMove = board.playMove(move);
                            
                            board.highlightIfConflicting(move);
                            
                            // Sets cell value in DOM.
                            cell.innerText = renderedCellValue;
                            
                            // Deactivates cell 
                            cell.classList.remove('activeCell');
                            
                            this.deactivateKeypads();
                            
                            if (board.userHasSolvedPuzzle()) {
                                console.log('solved!!!!!');
                                board.doGameOver();
                            }
                        }.bind(board);
                    });
                });
            }
        });
    }
    
    deactivateKeypads() {
        this.domCache.inputTable.classList.remove('inputTableActive');
        this.domCache.inputCells.forEach(function (inputCell, inputCellIndex) {
            inputCell.onclick = function () { return false; };
        });
    }
    
    highlightIfConflicting(move) {
        
        // Searches for conflicts, breaking out of loop if it finds one, in which case highlighting is done. 
        
        let conflictFound = false;
        const boardSize = this.boardSize;
        
        // Searches row for conflict:
        for (let cellX = 0; cellX < boardSize; cellX++) {
            
            if (cellX === move.cellX) {
                continue;
            }
            
            if (this.getCellValue(cellX, move.cellY) === move.cellValue) {
                conflictFound = true;
                break;
            }
        }
        
        if (conflictFound) {
            this.setConflictStatus(move.cellX, move.cellY, true);
            return;
        }
        
        // Searches column for conflict:
        for (let cellY = 0; cellY < boardSize; cellY++) {
            
            if (cellY === move.cellY) {
                continue;
            }
            
            if (this.getCellValue(move.cellX, cellY) === move.cellValue) {
                conflictFound = true;
                break;
            }
        }
        
        if (conflictFound) {
            this.setConflictStatus(move.cellX, move.cellY, true);
            return;
        }
        
        // Searches region for conflict:
        const corners = this.getRegionCorners(move.cellX, move.cellY);
        
        for (let cellX = corners.startColumn; cellX <= corners.endColumn; cellX++) {
            
            if (conflictFound) break;
            
            for (let cellY = corners.startRow; cellY < corners.endRow; cellY++) {
                
                if (cellX === move.cellX && cellY === move.cellY) {
                    continue;
                }
                
                if (this.getCellValue(cellX, cellY) === move.cellValue) {
                    conflictFound = true;
                    break;
                }
            }
        }
        
        if (conflictFound) {
            this.setConflictStatus(move.cellX, move.cellY, true);
            return;
        }
        
    }
    
    
    removeAllConflicts() {
        for (let cellY = 0; cellY < this.boardSize; cellY++) {
            for (let cellX = 0; cellX < this.boardSize; cellX++) {
                this.setConflictStatus(cellX, cellY, false);
            }
        }
    }
    
    getConflictStatus(cellX, cellY) {
        return this.cellDB[cellY][cellX].conflicting;
    }
    
    setConflictStatus(cellX, cellY, newStatus) {
        
        const status = this.getConflictStatus(cellX, cellY);
        
        if (status === newStatus) {
            return;
        }
        
        this.cellDB[cellY][cellX].conflicting = newStatus;
        
        const domCell = this.getDomCell(cellX, cellY)
        
        if (newStatus === true) {
            try {
                this.addConflictHighlighting(cellX, cellY);
            } catch (e) {
                throw "setConflictStatus caught exception: " + e;
            }
        } else {
            this.removeConflictHighlighting(cellX, cellY);
        }
    }
    
    renderEmptyBoard() {
        
        this.hideGameOver();
        this.deactivateKeypads();
        
        const boardSize = this.boardSize;
        const oldBoard = document.querySelector('.board');
        const newBoard = document.createElement('table');
        newBoard.setAttribute('class', 'board');
        
        for (let i = 0; i < boardSize; i++) {
            const rowNode = document.createElement('tr');
            rowNode.setAttribute('class', 'row');
            newBoard.appendChild(rowNode);
            
            for (let j = 0; j < boardSize; j++) {
                const cellNode = document.createElement('td');
                cellNode.setAttribute('class', 'cell');
                cellNode.setAttribute('id', 'cell' + j + i);
                rowNode.appendChild(cellNode);
            }
        }
        
        oldBoard.parentNode.replaceChild(newBoard, oldBoard);
        
        const cellsInRows3and6 = document.querySelectorAll(".row:nth-child(3) .cell, .row:nth-child(6) .cell");
        cellsInRows3and6.forEach(function (cell, index) {
            cell.classList.add('specialBottomBorder');
        });
        
        const cellsInColumns3and6 = document.querySelectorAll(".cell:nth-child(3), .cell:nth-child(6)");
        cellsInColumns3and6.forEach(function (cell, index) {
            cell.classList.add('specialRightBorder');
        });
        
        
        const checkerboardRegions = [ 'n', 's', 'e', 'w' ]; 
        
        checkerboardRegions.forEach(function(region, index){
            const regionInfo = this.regionInfo[region];
            
            for (let cellX = regionInfo.startCellX; cellX <= regionInfo.endCellX; cellX++) {
                for (let cellY = regionInfo.startCellY; cellY <= regionInfo.endCellY; cellY++) {
                    this.getDomCell(cellX, cellY).classList.add('checkerboardRegionCell');
                }
            }
        }.bind(this));
        
    }
    
    populateBoard() {
        
        // Cache board cells from DOM
        const cells = document.querySelectorAll('.cell');
        const rows = document.querySelectorAll('.row');
        const board = this;
        const boardSize = this.boardSize;
        
        // Populate cells and cell DB (for checking move validity) arrays with values from cellValues. 
        cells.forEach(function (cell, cellIndex) {
            const cellX = cellIndex % boardSize;
            const cellY = Math.floor(cellIndex / boardSize);
            const cellValue = board.getCellValue(cellX, cellY);
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
        });
    }
}

module.exports = Board;
