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

const inputCells = document.querySelectorAll('.inputCell');

inputCells.forEach(function (cell, index) {
    if (index < inputCells.length - 1) {
        cell.innerHTML = index + 1;
    }
});

var activeCellIndex = null;
const inputTable = document.querySelector('.inputTable');




cells.forEach(function (cell, cellIndex) {

    if (cellValues[cellIndex] === 0) {
        cell.classList.add('inactiveCell');
        cell.innerHTML = '';
        cell.addEventListener('click', function () {

            if (activeCellIndex) {
                cells[activeCellIndex].classList.remove('activeCell');
            }

            activeCellIndex = cellIndex;
            cells[activeCellIndex].classList.add('activeCell');
            inputTable.classList.add('inputTableActive');
            inputCells.forEach(function (inputCell, inputCellIndex) {
                // Use onClick instead of addEventListener here as we need to replace a handler, not add one:
                const moveValue = inputCell.innerText;
                inputCell.onclick = function () {
                    if (!moveIsValid(cellIndex, moveValue)) {
                        console.log('INVALID');
                        cell.classList.add('invalidMove');
                    } else {
                        cell.classList.remove('invalidMove');
                    }
                    cell.innerHTML = moveValue;
                    cell.classList.remove('activeCell');


                    inputTable.classList.remove('inputTableActive');
                    inputCells.forEach(function (inputCell, inputCellIndex) {
                        inputCell.onclick = function () { return false; };
                    });
                };
            });
        });
    } else {
        cell.innerHTML = cellValues[cellIndex];
        cell.classList.add('clueCell');
    }

});


var hintsEnabled = false;
const hintsButton = document.querySelector('.hintsButton');

// what if you enable hints part-way through. Do you see past invalid moves?
hintsButton.addEventListener('click', function () {
    hintsEnabled = !hintsEnabled;

    if (hintsEnabled) {
        hintsButton.innerHTML = 'Disable hints';
    } else {
        hintsButton.innerHTML = 'Enable hints';
    }

});


function moveIsValid(cellIndex, moveValue) {

    const cellX = cellIndex % 9;
    const cellY = Math.floor(cellIndex / 9);

    const cellValues2D = new Array(9);

    for (let i = 0; i < cellValues2D.length; i++) {
        cellValues2D[i] = new Array(9);
    }

    for (let i = 0; i < cells.length; i++) {
        const x = i % 9;
        const y = Math.floor(i / 9);
        cellValues2D[x][y] = cells[i].innerText;
    }

    function rowIsValid() {
        console.log('rowIsValid?');

        let result = true;

        for (let i = 0; i < 9; i++) {
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
        console.log('squareIsValid?');

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

