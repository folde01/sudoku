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

function foo(){
    console.log('foo');
    // this.removeEventListener(foo);
}

// function changeCellValue(cell, inputCell) {
//     cell.innerHTML = inputCell.innerHTML;
//     cell.style.backgroundColor = 'yellow';
// }

// function changeCellValue(cell, inputCell) {
//     cell.innerHTML = inputCell.innerHTML;
//     cell.style.backgroundColor = 'yellow';
// }

// cells.forEach(function (cell, index) {
//     if (cellValues[index] === 0) {
//         cell.innerHTML = '';
//         cell.addEventListener('click', function() {
//             cell.style.backgroundColor = 'white';
//             inputCells.forEach(function(inputCell, index){
//                 inputCell.style.backgroundColor = 'white';
//                 // inputCell.addEventListener('click', foo.bind(inputCell));
//                 inputCell.addEventListener('click', changeCellValue(cell, inputCell));
//                 // inputCell.addEventListener('click', foo);
//                 console.log('inputCell listening: ' + index);
//             });
//         });
//         console.log('cell listening: ' + index);
//     } else {
//         cell.innerHTML = cellValues[index];
//         cell.style.color = 'grey';
//     }
// });


cells.forEach(function (cell, index) {
    if (cellValues[index] === 0) {
        cell.innerHTML = '';
        cell.addEventListener('click', function() {
            cell.style.backgroundColor = 'white';
            inputCells.forEach(function(inputCell, index){
                inputCell.style.backgroundColor = 'white';
                inputCell.addEventListener('click', function(event){
                    // event.stopPropagation();
                    // event.stopImmediatePropagation();
                    // inputCell.style.backgroundColor = 'blue';
                    cell.innerHTML = inputCell.innerHTML;
                });
                console.log('inputCell listening: ' + index);
            });
            // inputCells.forEach(function(inputCell, index){
            //     inputCell.addEventListener('click', changeCellValue(cell, inputCell));
            // });
        });
        console.log('cell listening: ' + index);
    } else {
        cell.innerHTML = cellValues[index];
        cell.style.color = 'grey';
    }
});