// @ts-check

import { slideLine } from './line.js';
import { boardsEqual, cloneBoard, readLines, writeLines } from './board.js';

/**
 * @typedef {import('./board.js').Board} Board
 * @typedef {import('./board.js').Direction} Direction
 */

/** @type {Direction[]} */
const DIRECTIONS = ['up', 'down', 'left', 'right'];

/**
 * Slides every tile toward `direction` and merges equal neighbours once each.
 * The input board is never changed.
 * @param {Board} board
 * @param {Direction} direction
 * @returns {Board}
 */
export function move(board, direction) {
  const lines = readLines(cloneBoard(board), direction).map((line) => slideLine(line).line);
  return writeLines(lines, direction);
}




/**
 * Returns the sum of every tile a merge would create in this move.
 * @param {Board} board
 * @param {Direction} direction
 * @returns {number}
 */
export function scoreMove(board, direction) {
  return readLines(board, direction).reduce((total, line) => total + slideLine(line).points, 0);
}





/**
 * Returns true if moving in `direction` would change at least one cell.
 * @param {Board} board
 * @param {Direction} direction
 * @returns {boolean}
 */
export function canMove(board, direction) {
  return !boardsEqual(board, move(board, direction));
}





/**
 * Returns true if any direction would still change the board, false when the game is over.
 * @param {Board} board
 * @returns {boolean}
 */
export function hasMoves(board) {
  return DIRECTIONS.some((direction) => canMove(board, direction));
}

/**
 * alternative solution for decoupling
 * 
 /**
 * Returns true if any direction would still change the board, false when the game is over.
 * @param {Board} board
 * @returns {boolean}
export function hasMoves(board) {
  let hasTile = false;
  let hasEmpty = false;

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const value = board[r][c];
      if (value === 0) {
        hasEmpty = true;
        continue;
      }
      hasTile = true;
      // an equal neighbour to the right or below means a merge is possible
      if (value === board[r][c + 1] || value === board[r + 1]?.[c]) return true;
    }
  }

  // with no merge, a tile can still slide if there is an empty cell
  return hasTile && hasEmpty;
}
*/



/**
 * Puts a 2  or a 4 in a random empty cell and returns a new board.
 * Calls rng() once for the cell and once for the value.
 * With no empty cell, returns an unchanged copy.
 * @param {Board} board
 * @param {() => number} [rng] returns a number in [0, 1)
 * @returns {Board}
 */
export function spawn(board, rng = Math.random) {
  const next = cloneBoard(board);
  /** @type {[number, number][]} */
  const empty = [];
  next.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value === 0) empty.push([r, c]);
    });
  });
  if (empty.length === 0) return next;

  // clamp so an rng that returns exactly 1 still picks the last empty cell
  const pick = Math.min(Math.floor(rng() * empty.length), empty.length - 1);
  const [row, col] = empty[pick];
  next[row][col] = rng() < 0.5 ? 2 : 4;
  return next;
}




/**
 * Returns true if any cell has reached 2048.
 * @param {Board} board
 * @returns {boolean}
 */
export function hasWon(board) {
  return board.some((row) => row.some((value) => value >= 2048));
}