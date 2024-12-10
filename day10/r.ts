import { input } from "./input.ts";
import { sample } from "./sample.ts";

type position = { row: number; col: number };
type trail = { end: position; step: position; path: string };

const r = (input: string, debug: boolean = false) => {
  const field = input.split("\n").map((line) => line.split("").map((cell) => parseInt(cell)));
  const trailEnds = find(field, 9).map((end) => {
    return { end: { row: end.row, col: end.col }, step: { row: end.row, col: end.col }, path: "" };
  });

  // part 2 - distinct paths
  const trails = walkBack(field, trailEnds);

  if (debug) {
    console.table(trails.sort((a, b) => {
      if (a.step.row === b.step.row) {
        if (a.step.col === b.step.col) {
          return a.path > b.path ? 1 : a.path < b.path ? -1 : 0;
        }
        return a.step.col > b.step.col ? 1 : a.step.col < b.step.col ? -1 : 0;
      }
      return a.step.row > b.step.row ? 1 : a.step.row < b.step.row ? -1 : 0;
    }));
  }
  // part 1 - distinct trail ends
  const scores = Object.values(trails.reduce((tally, trail) => {
    const key = trail.step.row + "," + trail.step.col + "," + trail.end.row + "," + trail.end.col;
    tally[key] = 1;
    return tally;
  }, {})).length;
  console.log(trails.length, scores);
};

const find = (field: number[][], char: number): position[] => {
  const bounds = field.length;
  const result: position[] = [];
  for (let row = 0; row < bounds; row++) {
    for (let col = 0; col < bounds; col++) {
      if (field[row][col] === char) {
        result.push({ row, col });
      }
    }
  }
  return result;
};

const walkBack = (field: number[][], trails: trail[]) => {
  if (trails.length === 0 || trails[0].path.length === 9) {
    return trails;
  }
  const bounds = field.length - 1;
  const result: trail[] = [];
  const current = 9 - trails[0].path.length;
  const next = current - 1;
  trails.forEach(({ end, step: { row, col }, path }) => {
    if (row > 0 && field[row - 1][col] === next) {
      result.push({ end, step: { row: row - 1, col }, path: "d" + path });
    }
    if (row < bounds && field[row + 1][col] === next) {
      result.push({ end, step: { row: row + 1, col }, path: "u" + path });
    }
    if (col > 0 && field[row][col - 1] === next) {
      result.push({ end, step: { row, col: col - 1 }, path: "r" + path });
    }
    if (col < bounds && field[row][col + 1] === next) {
      result.push({ end, step: { row, col: col + 1 }, path: "l" + path });
    }
  });
  return walkBack(field, result);
};

if (import.meta.main) {
  console.time();
  r(input);
  console.timeEnd();
}
