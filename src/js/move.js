const Utilities = require('./utilities');

/**
 * @classdesc A Move holds the information related to a single filling in of a cell, including the cell value and the previous move (which is used for backtracking).
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

    _getRandomInt(min, max) {
        return Utilities.getRandomInt(min, max);
    }
}

module.exports = Move;