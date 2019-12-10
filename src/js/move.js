const Utilities = require('./utilities');

class Move {
    constructor(cellX, cellY, cellValue, previousMove) {
        this.previousMove = null;
        this.isDeadEnd = false;
        this.deadEndNextMoves = [];

        if (arguments.length < 3) {
            this.cellX = this._getRandomInt(0, boardSize - 1);
            this.cellY = this._getRandomInt(0, boardSize - 1);
            this.cellValue = this._getRandomInt(1, boardSize);
        } else if (arguments.length >= 3) {
            this.cellX = cellX;
            this.cellY = cellY;
            this.cellValue = cellValue;
        }
        if (arguments.length === 4) {
            this.previousMove = previousMove;
        }
    }


    // Public methods


    setPreviousMove(move) {
        this.previousMove = move;
    }

    getPreviousMove() {
        return this.previousMove;
    }


    // Private methods

    
    _getRandomInt(min, max) {
        return Utilities.getRandomInt(min, max);
    }
}

module.exports = Move;