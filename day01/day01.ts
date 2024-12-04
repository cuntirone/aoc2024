import { inputOne } from "./inputOne.ts";
import { sample } from "./sample.ts";

export const partOne = (input: string) => {
  const lines = input.trim().split("\n");
  const left: number[] = [];
  const right: number[] = [];
  lines.forEach((line) => {
    const tokens = line.replace(/\s+/g, ",").split(",");
    left.push(parseInt(tokens[0], 10));
    right.push(parseInt(tokens[1], 10));
  });
  left.sort(), right.sort();
  let sum = 0;
  for (let index = 0; index < left.length; index++) {
    sum += Math.abs(left[index] - right[index]);
  }
  console.log(sum);
};

export const partTwo = (input: string) => {
  const lines = input.trim().split("\n");
  const left: number[] = [];
  const right: number[] = [];
  lines.forEach((line) => {
    const tokens = line.replace(/\s+/g, ",").split(",");
    left.push(parseInt(tokens[0], 10));
    right.push(parseInt(tokens[1], 10));
  });
  right.sort();
  let sum = 0;
  left.forEach((elem) => {
    let from = right.indexOf(elem, 0);
    while (from > -1) {
      sum += elem;
      from = right.indexOf(elem, from + 1);
    }
  });
  console.log(sum);
};

if (import.meta.main) {
  console.time();
  // partOne(sample);
  // partOne(inputOne);
  // partTwo(sample);
  partTwo(inputOne);
  console.timeEnd();
}
