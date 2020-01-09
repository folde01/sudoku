const Game = require('./game');
const Board = require('./board');

const log = console.log;
const board = new Board();
let game;

window.addEventListener('click', function(event) {
    if (!event.target.classList.contains('newGame') && !event.target.classList.contains('gameOver')) {
        return;
    }
    
    game = new Game(board);
    game.play();
});

game = new Game(board);
game.play();

// test change