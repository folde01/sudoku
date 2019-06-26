const Game = require('./game');
const Board = require('./board');

const log = console.log;
const board = new Board();
let game;

window.addEventListener('click', function(event) {
    if (!event.target.classList.contains('newGame')) {
        return;
    }

    game = new Game(board);
    game.play();
});


let boardStyle = getComputedStyle(board.domCache.board);
let oldBoardWidth = boardStyle.width;
let cellStyle = getComputedStyle(board.domCache.cells[0]);
let oldCellStyleHeight = cellStyle.height;
// let oldCellStyleWidth = cellStyle.width;

// todo: understand window vs screen size here: 
// https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
function handleRotatedScreen() {
    // // document.querySelector('#screenDimensions').innerHTML = 'width: ' + screen.width + ' height: ' + screen.height;

    // const dimensions = {
    //     innerWidth: window.innerWidth,
    //     clientWidth: document.documentElement.clientWidth,
    //     clientWidth2: (document.getElementsByTagName('body')[0]).clientWidth,
    //     innerHeight: window.innerHeight,
    //     clientHeight: document.documentElement.clientHeight,
    //     clientHeigth2: (document.getElementsByTagName('body')[0]).clientHeight
    
    // }

    // // document.querySelector('#screenDimensions').innerHTML = 'width: ' + screen.width + ' height: ' + screen.height;
    // console.log('dimensions:', dimensions);

    // if (boardHeight > screenHeight) {
    //     this.setBoardHeight(boardHeight);
    //     this.moveKeypadToTheRight();
    // } else if (boardWidth > screenWidth) {
    //     this.setBoardWidth(boardWidth);
    //     this.moveKeypadToTheBottom();
    // }
    log('oldCellStyleHeight:', oldCellStyleHeight);
    board.domCache.cells.forEach(function(cell){
        cell.style.height = oldCellStyleHeight;
    });

    board.domCache.board.style.width = oldBoardWidth;
}

window.addEventListener('resize', handleRotatedScreen);

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