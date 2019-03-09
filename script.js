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
                    if (!moveIsValid(cellIndex, moveValue)){
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


function moveIsValid(cellIndex, moveValue){
    return rowIsValid(cellIndex, moveValue) &&
        columnIsValid(cellIndex, moveValue) && squareIsValid(cellIndex, moveValue);
}

function rowIsValid(cellIndex, moveValue){
    const cellValues = Array.from(cells).map((cell) => { return cell.innerText; });
    const firstCellToCheck = 0;
    const lastCellToCheck = 9; 
    const cellValuesToCheck = cellValues.slice(firstCellToCheck, lastCellToCheck).filter((cellValue) => {
        return cellValue !== '';
    });

    return !cellValuesToCheck.includes(moveValue);
}

function columnIsValid(cellIndex){
    return true;
}
function squareIsValid(cellIndex){
    return true;
}
