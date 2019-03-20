var sudokuCommon = {

    renderEmptyBoard: function(boardSize) {
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

    loadDummyPuzzle: function() {
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

    init: function() {

        const boardSize = 9;
        this.renderEmptyBoard(boardSize);

        var initialCellValues = this.loadDummyPuzzle();

        // Cache board cells from DOM
        const cells = document.querySelectorAll('.cell');

        let cellValues2D = initializeCellValues2D();

        // Populate cells and cellValues2D (for checking move validity) arrays with values from initialCellValues. 
        cells.forEach(function (cell, cellIndex) {
            const cellX = cellIndex % 9;
            const cellY = Math.floor(cellIndex / 9);
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

        inputCells.forEach(function(cell, index) {
            if (index < inputCells.length - 1) {
                cell.innerText = (index + 1).toString();
            }
        });
        const inputTable = document.querySelector('.inputTable');


        // Used to ensure one cell is active (selected) at a time
        let activeCellIndex = null;

        // Add event listeners to all cells except clue cells.
        cells.forEach(function(cell, cellIndex) {
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
                        inputCell.onclick = function() {
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
                            const cellX = cellIndex % 9;
                            const cellY = Math.floor(cellIndex / 9);
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
        hintsButton.addEventListener('click', function() {
            hintsEnabled = !hintsEnabled;

            if (hintsEnabled) {
                hintsButton.innerText = 'Disable hints';
            } else {
                hintsButton.innerText = 'Enable hints';
            }

        });


        function moveIsValid(cellIndex, moveValue) {

            const cellX = cellIndex % 9;
            const cellY = Math.floor(cellIndex / 9);

            function rowIsValid() {
                console.log('rowIsValid?');
    
                let result = true;
    
                for (let i = 0; i < 9; i++) {
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
    
                for (let j = 0; j < 9; j++) {
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



        function initializeCellValues2D() {
            // Build 2D array used to check move validity
            let cellValues2D = new Array(9);
            for (let i = 0; i < cellValues2D.length; i++) {
                cellValues2D[i] = new Array(9);
            }
    
            console.log(this);
    
            for (let i = 0; i < cells.length; i++) {
                const x = i % 9;
                const y = Math.floor(i / 9);
                cellValues2D[x][y] = cells[i].innerText;
            }
            return cellValues2D;
        }

    }
};
