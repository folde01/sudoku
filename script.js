'use strict';

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


function moveIsInvalid(){
    return false;
}


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
                inputCell.onclick = function () {
                    cell.innerHTML = inputCell.innerHTML;
                    cell.classList.remove('activeCell');
                    inputTable.classList.remove('inputTableActive');
                    inputCells.forEach(function(inputCell, inputCellIndex) {
                        inputCell.onclick = function () { return false };
                    });
                };
            });
        });
    } else {
        cell.innerHTML = cellValues[cellIndex];
        cell.classList.add('clueCell');
    }
});