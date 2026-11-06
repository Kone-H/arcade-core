// @ts-check

/**
 * @typedef {number[][]} Board 4 rows x 4 columns, board[row][col], 0 = empty
 * @typedef {'up' | 'down' | 'left' | 'right'} Direction
 */

/**
 * Maps position `index` of line `lineIndex` to a board cell.
 * Index 0 of every line is the edge the tiles move toward.
 * @param {number} lineIndex
 * @param {number} index
 * @param {number} size
 * @param {Direction} direction
 * @returns {[number, number]} [row, col]
 */
function cellAt(lineIndex, index, size, direction) {
  switch (direction) {
    case 'left':
      return [lineIndex, index];
    case 'right':
      return [lineIndex, size - 1 - index];
    case 'up':
      return [index, lineIndex];
    case 'down':
      return [size - 1 - index, lineIndex];
    default:
      throw new Error(`Unknown direction: ${direction}`);
  }
}

/**
 * @param {Board} board
 * @returns {Board}
 */
export function cloneBoard(board) {
  return structuredClone(board);
}

/**
 * Reads every row or column so that index 0 is the leading edge.
 * @param {Board} board
 * @param {Direction} direction
 * @returns {number[][]}
 */
export function readLines(board, direction) {
  const size = board.length;
  const lines = [];
  for (let lineIndex = 0; lineIndex < size; lineIndex++) {
    const line = [];
    for (let index = 0; index < size; index++) {
      const [row, col] = cellAt(lineIndex, index, size, direction);
      line.push(board[row][col]);
    }
    lines.push(line);
  }
  return lines;
}

/**
 * The inverse of readLines: builds a new board from lines.
 * @param {number[][]} lines
 * @param {Direction} direction
 * @returns {Board}
 */
export function writeLines(lines, direction) {
  const size = lines.length;
  const board = Array.from({ length: size }, () => Array(size).fill(0));
  // write back to a new board
  lines.forEach((line, lineIndex) => {
    line.forEach((value, index) => {
      const [row, col] = cellAt(lineIndex, index, size, direction);
      board[row][col] = value;
    });
  });
  return board;
}

/**
 * @param {Board} a
 * @param {Board} b
 * @returns {boolean}
 */
export function boardsEqual(a, b) {
  return a.every((row, r) => row.every((value, c) => value === b[r][c]));
}