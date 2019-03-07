'use strict';

// Easy Puzzle 8,835,213,384 from websudoku.com
var cellValues = [
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

var cells = document.querySelectorAll('.cell');


var inputCells = document.querySelectorAll('.inputCell');

inputCells.forEach(function (cell, index) {
    if (index < inputCells.length - 1) {
        cell.innerHTML = index + 1;
    }
});

cells.forEach(function (cell, cellIndex) {
    if (cellValues[cellIndex] === 0) {
        cell.innerHTML = '';
        cell.addEventListener('click', function() {
            // console.log('cell ' + cellIndex + ' clicked');
            cell.style.backgroundColor = 'white';
            inputCells.forEach(function(inputCell, inputCellIndex){
                inputCell.style.backgroundColor = 'white';
                // Use onClick instead of addEventListener here as we need to replace a handler, not add one:
                inputCell.onclick = function(event){
                    // console.log('inputCell ' + inputCell.innerHTML + ' clicked');
                    cell.innerHTML = inputCell.innerHTML;
                    // console.log('cell ' + cellIndex + ' parent: ' + cell.parentNode)
                };
                // console.log('inputCell ' + inputCellIndex + ' listening');
            });
        });
        // console.log('cell listening: ' + cellIndex);
    } else {
        cell.innerHTML = cellValues[cellIndex];
        cell.style.color = 'grey';
    }
});