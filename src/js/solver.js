const Move = require('./move');
const CONSTANTS = require('./constants');
const log = console.log;


class Solver {
    constructor() {
        this._moves = [];
        this._boardSize = CONSTANTS.boardSize;
        this._moveAttempts = 0;
        this._validMoveCount = 0;

        Array.prototype.diff = function (arr) {
            // From https://stackoverflow.com/a/4026828
            return this.filter(function (i) {
                return arr.indexOf(i) < 0;
            });
        };
    }

    
    // Public methods


    setCellDB(cellDB) {
        this._cellDB = cellDB;
    }

    solve() {
        this._solveByPickingRandomPossibleNextMove();
    }

    moveIsValid(move) {
        return this.rowIsValid(move) && this.columnIsValid(move) && this.boxIsValid(move);
    }

    rowIsValid(move) {
        return this._cellDB.rowIsValid(move);
    }

    boxIsValid(move) {
        return this._cellDB.boxIsValid(move);
    }

    columnIsValid(move) {
        return this._cellDB.columnIsValid(move);
    }

    puzzleIsComplete() {
        return this._cellDB.getCompleteCellValueCount() === this._boardSize;
    }

    tryMove(move) {
        this._moveAttempts++;
        if (this._cellDB.cellIsEmpty(move.getCellX(), move.getCellY()) && this.moveIsValid(move)) {
            this._cellDB.setCellValue(move.getCellX(), move.getCellY(), move.getCellValue());
            this._validMoveCount++;
            this._moves.push(move);
            this._cellDB.incrementCellValueCount(move.getCellValue());
            // log(this.cellDB);
            return true;
        } else {
            // log(this.cellDB);
            return false;
        }
    }

    // Private methods

    _solveByPickingRandomPossibleNextMove() {

        let lastMove = this._getLastMove();
        let cellValue = null;

        // check whether this is the first move we're trying to make
        if (lastMove) {
            cellValue = lastMove.getCellValue();
        } else {
            // as we look for somewhere to move, we start with cell value '1', i.e.
            // placing as many 1s on the board as we can, and working our way up to 9
            cellValue = 1;
        }

        while (this._cellDB.getCellValueCount(cellValue) < this._boardSize && (!this.puzzleIsComplete())) {
            lastMove = this._getLastMove();

            if (!lastMove) {
                // no moves yet
                lastMove = new Move(-1, -1, cellValue);
            }

            let possibleNextMoves = this._getPossibleNextMoves(lastMove);
            let moveMade = false;

            // loop until we've successfully moved
            while (!moveMade) {

                // backtrack if there's nowhere to move, then look again for candidate moves
                if (possibleNextMoves.length === 0) {
                    this._undoLastMove();
                    lastMove = this._getLastMove();
                    possibleNextMoves = this._getPossibleNextMoves(lastMove);
                }

                // if backtracking helped us find candidate moves, pick one at random
                const moveCandidate = this._pickRandomElementFromArray(possibleNextMoves);
                moveMade = this.tryMove(moveCandidate);

                // we use a linked list to keep track of move order (so as to facilitate backtracking),
                // so if we ever make a move, link it to its predecessor
                if (moveMade) {
                    moveCandidate.setPreviousMove(lastMove);
                    if (cellValue < this._boardSize) {
                        cellValue++;
                    }
                } else {
                    // tick off the unsuccessful candidate so we don't pick it again
                    possibleNextMoves.splice(possibleNextMoves.indexOf(moveCandidate), 1);
                }
            }
        }
    }

    _getLastMove() {
        if (this._moves.length === 0) {
            return null;
        }
        return this._moves[this._moves.length - 1];
    }

    _getPossibleNextMoves(move) {
        let possibleCellYs = [];

        for (let i = 0; i < this._boardSize; i++) {
            if (i != move.getCellY()) {
                possibleCellYs.push(i);
            }
        }

        let cellValue = move.getCellValue();
        let cellValueCount = this._cellDB.getCellValueCount(cellValue);

        // start working on the next value when we have 9 of the current one
        if (cellValueCount === this._boardSize) {
            ++cellValue;

            if (this._cellDB.getCellValueCount(cellValue) === this._boardSize) {
                throw "Unexpected cell value count. Terminating.";
            }
        }

        const deadEndCellYs = move.getDeadEndNextMoves().map(mv => mv.cellY);
        let cellX = (move.getCellX() + 1) % this._boardSize;
        const possibleNextMoves = possibleCellYs.diff(deadEndCellYs).map(cellY => new Move(cellX, cellY, cellValue));

        return possibleNextMoves;
    }

    _undoLastMove() {
        if (this._moves.length > 0) {
            const lastMove = this._moves.pop();
            lastMove.deadEnd = true;
            this._cellDB.setCellValue(lastMove.getCellX(), lastMove.getCellY(), 0);
            this._cellDB.decrementCellValueCount(lastMove.getCellValue());
            lastMove.getPreviousMove().addDeadEndNextMove(lastMove);
            return lastMove;
        } else {
            return;
        }
    }

    _pickRandomElementFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

}

module.exports = Solver;