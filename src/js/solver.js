const Move = require('./move');
const CONSTANTS = require('./constants');
const log = console.log;


class Solver {
    constructor(cellDB) {
        this.cellDB = cellDB;
        this.moves = [];
        this.boardSize = CONSTANTS.boardSize;

        Array.prototype.diff = function (arr) {
            // From https://stackoverflow.com/a/4026828
            return this.filter(function (i) {
                return arr.indexOf(i) < 0;
            });
        };
    }

    solve() {
        this.solveByPickingRandomPossibleNextMove();
    }

    solveByPickingRandomPossibleNextMove() {

        let lastMove = this.getLastMove();
        let cellValue = null;

        // check whether this is the first move we're trying to make
        if (lastMove) {
            cellValue = lastMove.cellValue;
        } else {
            // as we look for somewhere to move, we start with cell value '1', i.e.
            // placing as many 1s on the board as we can, and working our way up to 9
            cellValue = 1;
        }

        while (this.cellDB.getCellValueCount(cellValue) < this.boardSize && (!this.puzzleIsComplete())) {
            lastMove = this.getLastMove();

            if (!lastMove) {
                // no moves yet
                lastMove = new Move(-1, -1, cellValue);
            }

            let possibleNextMoves = this.getPossibleNextMoves(lastMove);
            let moveMade = false;

            // loop until we've successfully moved
            while (!moveMade) {

                // backtrack if there's nowhere to move, then look again for candidate moves
                if (possibleNextMoves.length === 0) {
                    this.undoLastMove();
                    lastMove = this.getLastMove();
                    possibleNextMoves = this.getPossibleNextMoves(lastMove);
                }

                // if backtracking helped us find candidate moves, pick one at random
                const moveCandidate = this.pickRandomElementFromArray(possibleNextMoves);
                moveMade = this.tryMove(moveCandidate);

                // we use a linked list to keep track of move order (so as to facilitate backtracking),
                // so if we ever make a move, link it to its predecessor
                if (moveMade) {
                    moveCandidate.setPreviousMove(lastMove);
                    if (cellValue < this.boardSize) {
                        cellValue++;
                    }
                } else {
                    // tick off the unsuccessful candidate so we don't pick it again
                    possibleNextMoves.splice(possibleNextMoves.indexOf(moveCandidate), 1);
                }
            }
        }
    }

    getLastMove() {
        if (this.moves.length === 0) {
            return null;
        }
        return this.moves[this.moves.length - 1];
    }

    puzzleIsComplete() {
        return this.cellDB.getCompleteCellValueCount() === this.boardSize;
    }

    getPossibleNextMoves(move) {
        let possibleCellYs = [];

        for (let i = 0; i < this.boardSize; i++) {
            if (i != move.cellY) {
                possibleCellYs.push(i);
            }
        }

        let cellValue = move.cellValue;
        let cellValueCount = this.cellDB.getCellValueCount(cellValue);

        if (cellValueCount === this.boardSize) {
            ++cellValue;

            if (this.cellDB.getCellValueCount(cellValue) === this.boardSize) {
                throw "Unexpected cell value count. Terminating.";
            }
        }

        const deadEndCellYs = move.deadEndNextMoves.map(mv => mv.cellY);
        let cellX = (move.cellX + 1) % this.boardSize;
        const possibleNextMoves = possibleCellYs.diff(deadEndCellYs).map(cellY => new Move(cellX, cellY, cellValue));

        return possibleNextMoves;
    }

    tryMove(move) {
        this.moveAttempts++;
        if (this.cellDB.cellIsEmpty(move.cellX, move.cellY) && this.moveIsValid(move)) {
            this.cellDB.setCellValue(move.cellX, move.cellY, move.cellValue);
            // this.cellDB.setCellSolutionValue(move.cellX, move.cellY, move.cellValue);
            this.validMoveCount++;
            this.moves.push(move);
            this.cellDB.incrementCellValueCount(move.cellValue);
            return true;
        } else {
            return false;
        }
    }

    undoLastMove() {
        if (this.moves.length > 0) {
            const lastMove = this.moves.pop();
            lastMove.deadEnd = true;
            this.cellDB.setCellValue(lastMove.cellX, lastMove.cellY, 0);
            this.cellDB.removeCellSolutionValue(lastMove.cellX, lastMove.cellY);
            this.cellDB.decrementCellValueCount(lastMove.cellValue);
            lastMove.getPreviousMove().deadEndNextMoves.push(lastMove);
            return lastMove;
        } else {
            return;
        }
    }

    pickRandomElementFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    moveIsValid(move) {
        return this.rowIsValid(move) && this.columnIsValid(move) && this.regionIsValid(move);
    }

    rowIsValid(move) {
        // todo: return if false
        let result = true;

        for (let cellX = 0; cellX < this.boardSize; cellX++) {
            if (this.cellDB.getCellValue(cellX, move.cellY) !== 0 && this.cellDB.getCellValue(cellX, move.cellY) === move.cellValue) {
                result = false;
            }
        }
        return result;
    }

    regionIsValid(move) {
        // todo: return if false
        let result = true;

        const startRow = Math.floor(move.cellY / 3) * 3;
        const endRow = startRow + 2;
        const startColumn = Math.floor(move.cellX / 3) * 3;
        const endColumn = startColumn + 2;

        for (let j = startRow; j <= endRow; j++) {
            for (let i = startColumn; i <= endColumn; i++) {
                if (this.cellDB.getCellValue(i, j) !== 0 && this.cellDB.getCellValue(i, j) === move.cellValue) {
                    result = false;
                }
            }
        }

        return result;
    }

    columnIsValid(move) {
        // todo: return if false
        let result = true;

        for (let j = 0; j < this.boardSize; j++) {
            if (this.cellDB.getCellValue(move.cellX, j) !== 0 && this.cellDB.getCellValue(move.cellX, j) === move.cellValue) {
                result = false;
            }
        }

        return result;
    }

}

module.exports = Solver;