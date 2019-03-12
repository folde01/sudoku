// Easy Puzzle 8,835,213,384 from websudoku.com
const cellValues = [
    0, 5, 0, 0, 0, 1, 0, 0, 6,
    0, 0, 0, 0, 5, 7, 0, 0, 0,
    2, 4, 0, 3, 0, 9, 1, 7, 5,
    0, 0, 0, 8, 6, 0, 0, 0, 7,
    3, 2, 0, 1, 0, 5, 0, 6, 4,
    9, 0, 0, 0, 4, 2, 0, 0, 0,
    8, 7, 4, 9, 0, 6, 0, 5, 2,
    0, 0, 0, 2, 7, 0, 0, 0, 0,
    6, 0, 0, 5, 0, 0, 0, 1, 0
];

const cells = document.querySelectorAll('.cell');

// Build 2D array used to check move validity
let cellValues2D = new Array(9);

for (let i = 0; i < cellValues2D.length; i++) {
    cellValues2D[i] = new Array(9);
}

for (let i = 0; i < cells.length; i++) {
    // console.log('cell: ' + cells[i].innerText);
    const x = i % 9;
    const y = Math.floor(i / 9);
    cellValues2D[x][y] = cells[i].innerText;
}

// Populate cells (DOM cell nodes) and cellValues2D (for checking move validity) arrays with values from cellValues. 
cells.forEach(function (cell, cellIndex) {
    const cellX = cellIndex % 9;
    const cellY = Math.floor(cellIndex / 9);
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
    cellValues2D[cellX][cellY] = cellValue;
});

// console.log('INIT cellValues2D: ' + cellValues2D);

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
    if (cellValues[cellIndex] === 0) {

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
        cell.innerText = cellValues[cellIndex];
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

    const cellX = cellIndex % 9;
    const cellY = Math.floor(cellIndex / 9);

    // console.log('cellValues2D: ' + cellValues2D);

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
}

