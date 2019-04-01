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
                        const moveValue = inputCell.innerText;

                        // Use onClick instead of addEventListener as we need to replace a handler, not add one.
                        inputCell.onclick = function () {
                            if (!moveIsValid(cellIndex, moveValue)) {
                                console.log('INVALID MOVE');

                                // Show that the move breaks the sudoku rules.
                                cell.classList.add('invalidMove');
                            } else {
                                cell.classList.remove('invalidMove');
                            }

                            // Set cell value in DOM
                            cell.innerText = moveValue;

                            // Set cell value in 2D array used to check move validity
                            const cellX = cellIndex % boardSize;
                            const cellY = Math.floor(cellIndex / boardSize);
                            cellValues2D[cellX][cellY] = moveValue;

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


        function moveIsValid(cellIndex, moveValue) {

            const cellX = cellIndex % boardSize;
            const cellY = Math.floor(cellIndex / boardSize);

            function rowIsValid() {
                console.log('rowIsValid?');

                let result = true;

                for (let i = 0; i < boardSize; i++) {
                    // console.log([cellValues2D[i][cellY], moveValue].join());
                    // console.log([typeof(cellValues2D[i][cellY]), typeof(moveValue)].join());
                    if (cellValues2D[i][cellY] !== '' && cellValues2D[i][cellY] === moveValue) {
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
                    if (cellValues2D[cellX][j] !== '' && cellValues2D[cellX][j] === moveValue) {
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
                        if (cellValues2D[i][j] !== '' && cellValues2D[i][j] === moveValue) {
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

        // organize as one instance of class Board with many Moves?

        class Move {
            constructor(cellX, cellY, moveValue) {
                this.cellX = cellX || new RandomInt(0, boardSize - 1).newInt();
                // this.cellX = cellX;
                this.cellY = cellY || new RandomInt(0, boardSize - 1).newInt();
                // this.cellY = cellY || new RandomInt(0, boardSize - 1).newInt();
                this.moveValue = moveValue || new RandomInt(1, 9).newInt;
            }
        }

        class RandomInt {
            constructor(min, max) {
                this.min = min;
                this.max = max;
            }
            newInt() {
                // https://stackoverflow.com/a/1527820
                const min = Math.ceil(this.min);
                const max = Math.floor(this.max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        }

        class Board {
            constructor(boardSize) {
                this.boardSize = boardSize;
                this.cellValues2D = this.initializeCellValues2D(boardSize);
                this.validMoveCount = 0;
                this.moveAttempts = 0;
                this.numCells = boardSize * boardSize;
                this.moves = [];
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



            tryMove(move) {
                this.moveAttempts++;

                if (this.cellIsEmpty(move.cellX, move.cellY) && this.moveIsValid(move)) {
                    this.cellValues2D[move.cellX][move.cellY] = move.moveValue;
                    this.moves.push(move);
                    this.validMoveCount++;
                    console.log('-------- Played ----------- ' + JSON.stringify(move));
                    console.log('2D: ' + JSON.stringify(this.cellValues2D));
                    return true;
                } else {
                    console.log('NOT Played: ' + JSON.stringify(move));
                    return false;
                }
            }

            undoLastMove() {
                if (!this.moves.length) {
                    return false;
                }
                const move = this.moves.pop();
                this.cellValues2D[move.cellX][move.cellY] = 0;
            }

            cellIsEmpty(cellX, cellY) {
                if (this.cellValues2D[cellX][cellY] === 0) {
                    console.log('EMPTY');
                    return true;
                }
                console.log('FULL');
                return false;
            }

            getSolutionArrayRandom() {
                // while (this.validMoveCount < this.numCells) {
                // while (this.moveAttempts < this.numCells) {

                while (this.moveAttempts < 2000) {
                    const move = new Move();
                    const moveMade = this.tryMove(move);
                }

                console.log('DONE: ' + this.cellValues2D);
                console.log('ATTEMPTS: ' + this.moveAttempts);
                console.log('FILLED: ' + this.validMoveCount);
                return this.cellValues2D;
            }

            getSolutionArray() {
                this.getSolutionArrayRandom();
            }

            getSolutionArrayFoo() {
                let cellX = 0;
                let cellY = null;
                let cellValue = 1;
                let cellValuesCount = new Array(this.boardSize + 1).fill(0);

                while (this.moveAttempts < 6000) {

                    if (cellValuesCount[cellValue] === this.boardSize) {
                        ++cellValue;
                        cellX = 0;
                    }

                    cellY = new RandomInt(0, this.boardSize).newInt();

                    const move = new Move(cellX, cellY, cellValue);
                    const moveMade = this.tryMove(move);

                    if (moveMade) {
                        ++cellValuesCount[cellValue];
                    } else {
                        let newCellY = cellY;

                        while (newCellY !== cellY) {
                            ++newCellY;
                            if (newCellY === this.boardSize) {
                                newCellY = 0;
                            }
                            const newMove = new Move(cellX, newCellY, cellValue);
                            const newMoveMade = this.tryMove(newMove);

                            if (moveMade) {
                                ++cellValuesCount[cellValue];
                            } else {
                                this.undoLastMove();
                                // todo: move logic into tryMove and undoLastMove. Make new method decideMove.
                                // have numToUndo
                            }
                        }
                    }
                }
            }

            getSolutionArrayBroken() {
                let cellX = 0;
                let cellY = null;
                let cellValue = 1;
                let cellValuesCount = new Array(this.boardSize + 1).fill(0);
                let numToUndo = 1;

                while (this.moveAttempts < 100) {

                    if (cellValuesCount[cellValue] === this.boardSize) {
                        ++cellValue;
                        cellX = 0;
                    }


                    cellY = new RandomInt(0, this.boardSize).newInt();

                    const move = new Move(cellX, cellY, cellValue);
                    const moveMade = this.tryMove(move);

                    if (moveMade) {
                        ++cellValuesCount[cellValue];
                        ++cellX;

                        if (cellX === this.boardSize) {
                            cellX = 0;
                        }

                    } else {
                        let newCellY = cellY;

                        while (newCellY !== cellY) {
                            ++newCellY;
                            if (newCellY === this.boardSize) {
                                newCellY = 0;
                            }
                            const newMove = new Move(cellX, newCellY, cellValue);
                            const newMoveMade = this.tryMove(newMove);

                            if (moveMade) {
                                ++cellValuesCount[cellValue];
                                ++cellX;

                                if (cellX === this.boardSize) {
                                    cellX = 0;
                                }
                            } else {
                                for (i = 0; i < numToUndo; i++) {
                                    this.undoLastMove();
                                }
                                ++numToUndo;
                                // todo: move logic into tryMove and undoLastMove. Make new method decideMove.
                                // have numToUndo
                            }
                        }
                    }
                }
            }

            moveIsValid(move) {
                return this.rowIsValid(move) && this.columnIsValid(move) && this.boxIsValid(move);
            }

            rowIsValid(move) {
                // console.log('rowIsValid?');

                let result = true;

                for (let i = 0; i < this.boardSize; i++) {
                    // console.log([cellValues2D[i][cellY], moveValue].join());
                    // console.log([typeof(cellValues2D[i][cellY]), typeof(moveValue)].join());
                    if (this.cellValues2D[i][move.cellY] !== 0 && this.cellValues2D[i][move.cellY] === move.moveValue) {
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
                    if (this.cellValues2D[move.cellX][j] !== 0 && this.cellValues2D[move.cellX][j] === move.moveValue) {
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
                        if (this.cellValues2D[i][j] !== 0 && this.cellValues2D[i][j] === move.moveValue) {
                            result = false;
                        }
                    }
                }
                // console.log(result);
                return result;
            }

        }

        const arrays = new Board(boardSize).getSolutionArray();
        const merged = [].concat.apply([], arrays);
        return merged;
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

    }
};
