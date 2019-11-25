# Sudoku 

My Sudoku game can be played [here](https://folde01.github.io/sudoku/) and the code for it is [here](https://github.com/folde01/sudoku).

## Design goals:

* Host it completely on GitHub, so no back-end. This means the puzzle generation algorithm has to be fast enough to run in browser.

* No JavaScript or CSS frameworks, in order to focus first on learning JavaScript and CSS.

* Mobile first, with special attention to mobile screen rotation.

## Implementation choices:

* Use of ES6 classes and Webpack bundling to keep code organised.

* Use of Mocha tests to ensure that puzzles generated adhere to the basic Sudoku rule of avoiding duplicate numbers in rows, columns or boxes. 

* The puzzle generation algorithm works by repeatedly traversing from left to right across the board, trying valid random moves as it goes, all the while keeping track of how many of each number (1-9) is on the board, and backtracking when it reaches a dead end (i.e. when no valid move can be made). When it gets to the right side, it starts back over again on the left, and finally breaks out of this left-to-right loop when the board is full of numbers. Once it's filled the board, it randomly removes numbers in such a way that the remaining numbers exhibit a form of rotational symmetry I'd seen when playing websudoku.com and which many players reportedly prefer. 

## Issues: 

The main issue so far is that the puzzle generation algorithm can produce puzzles which have more than one solution, whereas a valid Sudoku puzzle must have exactly one solution.
