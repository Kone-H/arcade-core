# @kone_h/arcade-core

Pure 2048 game logic. No DOM, no Svelte, no browser APIs: it runs in plain Node.

## Install

```bash
npm install @kone_h/arcade-core
```

## Usage

```js
import { move, canMove, spawn, hasMoves } from '@kone_h/arcade-core';

let board = [
  [2, 2, 2, 2],
  [0, 0, 0, 0],
  [0, 4, 0, 4],
  [0, 0, 0, 0],
];

if (canMove(board, 'left')) {
  board = move(board, 'left'); // [[4, 4, 0, 0], [0, 0, 0, 0], [8, 0, 0, 0], [0, 0, 0, 0]]
  board = spawn(board);        // adds a 2 or a 4 in a random empty cell
}

console.log(hasMoves(board)); // true
```

## API

A `Board` is a 4x4 `number[][]` (`board[row][col]`), with `0` for an empty cell.
A `Direction` is `'up' | 'down' | 'left' | 'right'`. No function changes its input.

| Function | Returns |
| :--- | :--- |
| `move(board, direction)` | A new board with every tile slid toward `direction`. Equal neighbours merge once each (`2 2 2 2` becomes `4 4`). |
| `spawn(board, rng = Math.random)` | A new board with a `2` (50%) or a `4` (50%) in a random empty cell. `rng` must return a number in `[0, 1)`. A full board comes back unchanged. |
| `canMove(board, direction)` | `true` if `move(board, direction)` would change the board. |
| `hasMoves(board)` | `true` if any direction would change the board, `false` when the game is over. |
| `scoreMove(board, direction)` | The points that move earns: the sum of every tile a merge creates. |
| `hasWon(board)` | `true` if any tile is 2048 or higher. |

## License

MIT