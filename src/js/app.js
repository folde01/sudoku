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

game = new Game(board);
game.play();