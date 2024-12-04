import { input } from "./input.ts";
import { sample } from "./sample.ts";

const readH = (
  input: string[][],
  row: number,
  col: number,
  bound: number,
): boolean => {
  if (col > (bound - 1 - 3)) {
    return false;
  }

  return (input[row][col] === "X" && input[row][col + 1] === "M" && input[row][col + 2] === "A" && input[row][col + 3] === "S") ||
    (input[row][col] === "S" && input[row][col + 1] === "A" && input[row][col + 2] === "M" && input[row][col + 3] === "X");
};

const readV = (
  input: string[][],
  row: number,
  col: number,
  bound: number,
): boolean => {
  if (row > (bound - 1 - 3)) {
    return false;
  }
  return (input[row][col] === "X" && input[row + 1][col] === "M" && input[row + 2][col] === "A" && input[row + 3][col] === "S") ||
    (input[row][col] === "S" && input[row + 1][col] === "A" && input[row + 2][col] === "M" && input[row + 3][col] === "X");
};

const readFD = (
  input: string[][],
  row: number,
  col: number,
  bound: number,
): boolean => {
  if (col > (bound - 1 - 3)) {
    return false;
  }
  if (row > (bound - 1 - 3)) {
    return false;
  }
  return (input[row][col] === "X" && input[row + 1][col + 1] === "M" && input[row + 2][col + 2] === "A" && input[row + 3][col + 3] === "S") ||
    (input[row][col] === "S" && input[row + 1][col + 1] === "A" && input[row + 2][col + 2] === "M" && input[row + 3][col + 3] === "X");
};

const readRD = (
  input: string[][],
  row: number,
  col: number,
  bound: number,
): boolean => {
  if (col < 3) {
    return false;
  }
  if (row > (bound - 1 - 3)) {
    return false;
  }
  return (input[row][col] === "X" && input[row + 1][col - 1] === "M" && input[row + 2][col - 2] === "A" && input[row + 3][col - 3] === "S") ||
    (input[row][col] === "S" && input[row + 1][col - 1] === "A" && input[row + 2][col - 2] === "M" && input[row + 3][col - 3] === "X");
};

const readA = (
  input: string[][],
  row: number,
  col: number,
  bound: number,
): boolean => {
  if (row === 0 || col === 0 || row === bound - 1 || col === bound - 1) {
    return false;
  }
  if (input[row][col] !== "A") {
    return false;
  }
  const tl = input[row - 1][col - 1];
  const tr = input[row - 1][col + 1];
  const bl = input[row + 1][col - 1];
  const br = input[row + 1][col + 1];
  if (tl === "A" || tr === "A" || bl === "A" || br === "A" || tl === "X" || tr === "X" || bl === "X" || br === "X") {
    return false;
  }
  if (tl !== br && tr !== bl) {
    // console.log(row, col);
    // console.log(`${tl} ${tr}\n A \n${bl} ${br}`);
    // console.log("\n\n");
    return true;
  }
  return false;
};

const r = (input: string) => {
  const matrix = input.split("\n").map((row) => row.split(""));
  const bound = matrix.length;

  let count = 0;
  for (let row = 0; row < bound; row++) {
    for (let col = 0; col < bound; col++) {
      if (readH(matrix, row, col, bound)) {
        count++;
      }
      if (readV(matrix, row, col, bound)) {
        count++;
      }
      if (readFD(matrix, row, col, bound)) {
        count++;
      }
      if (readRD(matrix, row, col, bound)) {
        count++;
      }
    }
  }
  console.log(count);
};

const r2 = (input: string) => {
  const matrix = input.split("\n").map((row) => row.split(""));
  const bound = matrix.length;

  let count = 0;
  for (let row = 0; row < bound; row++) {
    for (let col = 0; col < bound; col++) {
      if (readA(matrix, row, col, bound)) {
        count++;
      }
    }
  }
  console.log(count);
};

if (import.meta.main) {
  console.time();
  //   r2(sample);
  //   r(input);
  r2(input);
  console.timeEnd();
}
