const Move = require('../src/js/move.js');
const Board = require('../src/js/board.js');
const assert = require('assert');

describe('Board', function () {
    describe('solve', function () {
        it('should result in a board with 9 of each number', function () {
            const boardSize = 9;
            const board = new Board();
            board.solve();
            for (let i = 1; i <= boardSize; i++) {
                assert.equal(boardSize, board.getCellValueCount(i));
            }
        });
    });
    describe('moveIsValid', function () {
        it('should return true if move does not violate row, column or region rules', function () {
            const board = new Board();
            const move1valid = board.tryMove(new Move(0, 0, 4));
            const lastMoveValid = board.tryMove(new Move(0, 1, 5));
            assert.equal(true, move1valid);
            assert.equal(true, lastMoveValid);
        });

        it('should return true if move does not violate row, column or region rules (different region)', function () {
            const board = new Board();
            const move1valid = board.tryMove(new Move(0, 0, 4));
            const lastMoveValid = board.tryMove(new Move(1, 8, 4));
            assert.equal(true, move1valid);
            assert.equal(true, lastMoveValid);
        });

        it('should return false if move duplicates a row value', function () {
            const board = new Board();
            const move1valid = board.tryMove(new Move(0, 0, 4));
            const lastMoveValid = board.tryMove(new Move(1, 0, 4));
            assert.equal(true, move1valid);
            assert.equal(false, lastMoveValid);
        });
        it('should return false if move duplicates a row value (different region)', function () {
            const board = new Board();
            const move1valid = board.tryMove(new Move(0, 0, 4));
            const lastMoveValid = board.tryMove(new Move(8, 0, 4));
            assert.equal(true, move1valid);
            assert.equal(false, lastMoveValid);
        });
        it('should return false if move duplicates a column value', function () {
            const board = new Board();
            const move1valid = board.tryMove(new Move(0, 0, 4));
            const lastMoveValid = board.tryMove(new Move(0, 1, 4));
            assert.equal(true, move1valid);
            assert.equal(false, lastMoveValid);
        });
        it('should return false if move duplicates a column value (different region)', function () {
            const board = new Board();
            const move1valid = board.tryMove(new Move(0, 0, 4));
            const lastMoveValid = board.tryMove(new Move(0, 8, 4));
            assert.equal(true, move1valid);
            assert.equal(false, lastMoveValid);
        });
        it('should return false if move duplicates a region value', function () {
            const board = new Board();
            const move1valid = board.tryMove(new Move(0, 0, 4));
            const lastMoveValid = board.tryMove(new Move(1, 1, 4));
            assert.equal(true, move1valid);
            assert.equal(false, lastMoveValid);
        });
    });
});

