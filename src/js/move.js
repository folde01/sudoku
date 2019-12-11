const Utilities = require('./utilities');

/**
 * @classdesc A Move holds 
 */
class Move {
    constructor(cellX, cellY, cellValue, previousMove) {
        this._previousMove = null;
        this._isDeadEnd = false;
        this._deadEndNextMoves = [];

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
            this._previousMove = previousMove;
        }
    }


    // Public methods


    setPreviousMove(move) {
        this._previousMove = move;
    }

    getPreviousMove() {
        return this._previousMove;
    }

    getDeadEndNextMoves() {
        return this._deadEndNextMoves;
    }

    addDeadEndNextMove(move) {
        this._deadEndNextMoves.push(move);
    }

    getCellValue() {
        return this.cellValue;
    }

    getCellX() {
        return this.cellX;
    }

    getCellY() {
        return this.cellY;
    }

    // Private methods

    
    _getRandomInt(min, max) {
        return Utilities.getRandomInt(min, max);
    }
}

module.exports = Move;