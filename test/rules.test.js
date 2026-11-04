import { describe, it, expect } from 'vitest';
import { move, spawn, canMove, hasMoves, scoreMove, hasWon } from '../src/index.js';

/** Puts one row on an otherwise empty board. */
const withRow = (row) => [row, [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
/** Puts one column on an otherwise empty board. */
const withColumn = (col) => col.map((value) => [value, 0, 0, 0]);
const column = (board) => board.map((row) => row[0]);

describe('move', () => {
  it.each([
    [[2, 2, 2, 2], [4, 4, 0, 0]],
    [[4, 4, 8, 0], [8, 8, 0, 0]],
    [[2, 0, 2, 4], [4, 4, 0, 0]],
    [[2, 2, 4, 0], [4, 4, 0, 0]],
    [[0, 0, 0, 2], [2, 0, 0, 0]],
  ])('left: %j -> %j', (input, expected) => {
    expect(move(withRow(input), 'left')[0]).toEqual(expected);
  });

  it('right merges from the right edge', () => {
    expect(move(withRow([2, 2, 2, 2]), 'right')[0]).toEqual([0, 0, 4, 4]);
    expect(move(withRow([0, 8, 4, 4]), 'right')[0]).toEqual([0, 0, 8, 8]);
  });

  it('up merges from the top edge', () => {
    expect(column(move(withColumn([2, 2, 2, 2]), 'up'))).toEqual([4, 4, 0, 0]);
    expect(column(move(withColumn([2, 0, 2, 4]), 'up'))).toEqual([4, 4, 0, 0]);
  });

  it('down merges from the bottom edge', () => {
    expect(column(move(withColumn([2, 2, 2, 2]), 'down'))).toEqual([0, 0, 4, 4]);
    expect(column(move(withColumn([2, 0, 0, 0]), 'down'))).toEqual([0, 0, 0, 2]);
  });

  it('never changes its input', () => {
    const board = withRow([2, 2, 4, 0]);
    const before = structuredClone(board);
    move(board, 'left');
    expect(board).toEqual(before);
  });
});

describe('canMove', () => {
  it('is false when nothing would change', () => {
    expect(canMove(withRow([2, 4, 8, 16]), 'left')).toBe(false);
    expect(canMove(withRow([2, 4, 8, 16]), 'up')).toBe(false);
  });

  it('is true when a tile can slide or merge', () => {
    expect(canMove(withRow([0, 0, 0, 2]), 'left')).toBe(true);
    expect(canMove(withRow([2, 4, 8, 16]), 'down')).toBe(true);
  });
});

describe('hasMoves', () => {
  it('is false for a full board with no equal neighbours', () => {
    const board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(hasMoves(board)).toBe(false);
  });

  it('is true for a full board with one mergeable pair', () => {
    const board = [
      [2, 2, 8, 4],
      [4, 8, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(hasMoves(board)).toBe(true);
  });
});

describe('spawn', () => {
  const empty = () => withRow([0, 0, 0, 0]);

  it('puts a 2 in the first empty cell when rng returns 0', () => {
    const next = spawn(empty(), () => 0);
    expect(next[0][0]).toBe(2);
    expect(next.flat().filter((value) => value !== 0)).toHaveLength(1);
  });

  it('puts a 4 in the last empty cell when rng returns 0.95', () => {
    const next = spawn(empty(), () => 0.95);
    expect(next[3][3]).toBe(4);
  });

  it('only uses empty cells', () => {
    const board = withRow([2, 4, 8, 0]);
    const next = spawn(board, () => 0);
    expect(next[0]).toEqual([2, 4, 8, 2]);
  });

  it('returns an unchanged copy of a full board', () => {
    const full = Array.from({ length: 4 }, () => [2, 4, 2, 4]);
    const next = spawn(full, () => 0);
    expect(next).toEqual(full);
    expect(next).not.toBe(full);
  });

  it('never changes its input', () => {
    const board = empty();
    spawn(board, () => 0);
    expect(board.flat().every((value) => value === 0)).toBe(true);
  });
});

describe('scoreMove', () => {
  it('sums every merged tile', () => {
    expect(scoreMove(withRow([2, 2, 2, 2]), 'left')).toBe(8);
    expect(scoreMove(withRow([4, 4, 8, 0]), 'left')).toBe(8);
  });

  it('is 0 for a move without merges', () => {
    expect(scoreMove(withRow([2, 4, 8, 16]), 'left')).toBe(0);
  });
});

describe('hasWon', () => {
  it('is true once a tile reaches 2048', () => {
    expect(hasWon(withRow([2048, 0, 0, 0]))).toBe(true);
    expect(hasWon(withRow([1024, 1024, 0, 0]))).toBe(false);
  });
});