const Move = require('../src/js/move.js');
const Puzzle = require('../src/js/puzzle.js');
const assert = require('assert');

describe('Puzzle', function () {

    describe('solve()', function (){
        it('should result in a valid board (i.e. with 9 of each number)', function () {
            const puzzle = new Puzzle();
            puzzle.solve();
            assert.equal(true, puzzle.puzzleIsComplete());
        });
    });

    describe('solve() (not run)', function (){
        it('should not result in a valid board', function () {
            const puzzle = new Puzzle();
            assert.equal(false, puzzle.puzzleIsComplete());
        });
    });

    describe('moveIsValid()', function () {
        it('should return true if move does not violate row, column or region rules', function () {
            const puzzle = new Puzzle();
            const move1valid = puzzle.tryMove(new Move(0, 0, 4));
            const lastMoveValid = puzzle.tryMove(new Move(0, 1, 5));
            assert.equal(true, move1valid);
            assert.equal(true, lastMoveValid);
        });

        it('should return true if move does not violate row, column or region rules (different region)', function () {
            const puzzle = new Puzzle();
            const move1valid = puzzle.tryMove(new Move(0, 0, 4));
            const lastMoveValid = puzzle.tryMove(new Move(1, 8, 4));
            assert.equal(true, move1valid);
            assert.equal(true, lastMoveValid);
        });

        it('should return false if move duplicates a row value', function () {
            const puzzle = new Puzzle();
            const move1valid = puzzle.tryMove(new Move(0, 0, 4));
            const lastMoveValid = puzzle.tryMove(new Move(1, 0, 4));
            assert.equal(true, move1valid);
            assert.equal(false, lastMoveValid);
        });
        it('should return false if move duplicates a row value (different region)', function () {
            const puzzle = new Puzzle();
            const move1valid = puzzle.tryMove(new Move(0, 0, 4));
            const lastMoveValid = puzzle.tryMove(new Move(8, 0, 4));
            assert.equal(true, move1valid);
            assert.equal(false, lastMoveValid);
        });
        it('should return false if move duplicates a column value', function () {
            const puzzle = new Puzzle();
            const move1valid = puzzle.tryMove(new Move(0, 0, 4));
            const lastMoveValid = puzzle.tryMove(new Move(0, 1, 4));
            assert.equal(true, move1valid);
            assert.equal(false, lastMoveValid);
        });
        it('should return false if move duplicates a column value (different region)', function () {
            const puzzle = new Puzzle();
            const move1valid = puzzle.tryMove(new Move(0, 0, 4));
            const lastMoveValid = puzzle.tryMove(new Move(0, 8, 4));
            assert.equal(true, move1valid);
            assert.equal(false, lastMoveValid);
        });
        it('should return false if move duplicates a region value', function () {
            const puzzle = new Puzzle();
            const move1valid = puzzle.tryMove(new Move(0, 0, 4));
            const lastMoveValid = puzzle.tryMove(new Move(1, 1, 4));
            assert.equal(true, move1valid);
            assert.equal(false, lastMoveValid);
        });
    });

});
