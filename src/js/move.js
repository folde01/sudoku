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

        console.log('MOVE CREATED: ' + this.cellX + ', ' + this.cellY + ', ' + this.cellValue);
    }

    setPreviousMove(move) {
        this.previousMove = move;
    }

    getPreviousMove() {
        return this.previousMove;
    }

    _getRandomInt(min, max) {
        // https://stackoverflow.com/a/1527820
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = Move;