const Game = require('./game');
const Board = require('./board');

const board = new Board();

window.addEventListener('click', function(event) {
    if (!event.target.classList.contains('newGame')) {
        return;
    }

    new Game(board).play();
});

const game = new Game(board);
game.play();

