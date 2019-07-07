const Game = require('./game');
const Board = require('./board');

const log = console.log;
const board = new Board();
let game;

window.addEventListener('click', function(event) {
    if (!event.target.classList.contains('newGame')) {
        return;c
    }
    
    game = new Game(board);
    game.play();
});


function getDimensions() {
    return {
        innerWidth: window.innerWidth,
        clientWidth: document.documentElement.clientWidth,
        clientWidth2: (document.getElementsByTagName('body')[0]).clientWidth,
        innerHeight: window.innerHeight,
        clientHeight: document.documentElement.clientHeight,
        clientHeigth2: (document.getElementsByTagName('body')[0]).clientHeight
    }
}


let boardStyle = getComputedStyle(board.domCache.board);
let oldBoardWidth = boardStyle.width;
let cellStyle = getComputedStyle(board.domCache.cells[0]);
// log('cellStyle:', cellStyle);
let oldCellHeight = cellStyle.height;
let oldCellFontSize = cellStyle["font-size"];
// log('dimensions1:', getDimensions());

// let oldCellStyleWidth = cellStyle.width;

function screenIsInLandscapeMode() {
    return window.innerWidth > window.innerHeight;
}

function arrangeForLandscapeMode() {
    log('arrangeForLandscapeMode');
    const screenHeight = window.innerHeight;
    const cellHeight = screenHeight / 150;
    const fontSize = screenHeight / 16;
    
    board.domCache.board.style.width = (screenHeight * 0.9) + "px";
    
    board.domCache.cells.forEach(function(cell){
        cell.style.height = cellHeight + "rem";
        cell.style["font-size"] = fontSize + "px";
    });
    
}


function handleRotatedScreen() {
    log('handleRotatedScreen');
    
    if (screenIsInLandscapeMode()) {
        arrangeForLandscapeMode();
    } else {
        reloadStylesheets();
    }
    
    
}




// window.addEventListener('resize', handleRotatedScreen);

// log('screenIsInLandscapeMode:', screenIsInLandscapeMode());
game = new Game(board);
game.play();

/*
const Game = require('./game');
const Board = require('./board');

const board = new Board();
const game = new Game(board);

window.addEventListener('click', function(event) {
    if (!event.target.classList.contains('newGame')) {
        return;
    }
    
    game.play();
});

game.play();
*/