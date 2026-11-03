// @ts-check

/**
 * Slides one line toward index 0 and merges equal neighbours once each.
 * Example: [2, 2, 2, 2] -> { line: [4, 4, 0, 0], points: 8 }
 * @param {number[]} line
 * @returns {{ line: number[], points: number }}
 */
export function slideLine(line) {
  const values = line.filter((value) => value !== 0);
  const result = [];
  let points = 0;

  for (let i = 0; i < values.length; i++) {
    if (values[i] === values[i + 1]) {
      const merged = values[i] * 2;
      result.push(merged);
      points += merged;
      // skip the partner so a tile merges at most once per move
      i++;
    } else {
      result.push(values[i]);
    }
  }

  while (result.length < line.length) {
    result.push(0);
  }
  return { line: result, points };
}