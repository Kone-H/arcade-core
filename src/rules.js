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
 * Puts a 2 (90%) or a 4 (10%) in a random empty cell and returns a new board.
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

  const [row, col] = empty[Math.floor(rng() * empty.length)];
  next[row][col] = rng() < 0.9 ? 2 : 4;
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