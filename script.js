'use strict';

var cells = document.querySelectorAll('.cell');

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

cells.forEach(function(cell, index){
    if (cellValues[index] === 0){
        cell.innerHTML = '';
    } else {
        cell.innerHTML = cellValues[index];
    }
    cell.addEventListener('click', function(){
        this.innerHTML = '';
    });
});


