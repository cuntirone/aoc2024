import { input } from "./input.ts";
import { Machine } from "./machine.ts";
import { sample } from "./sample.ts";

const r = (input: string, options: string[], knownTrue: number[]) => {
  const equations = input.split("\n").map((raw) => new Machine(raw));
  let score = 0;
  const solved: number[] = [];
  equations.forEach((equation, index) => {
    if (knownTrue.indexOf(index) > -1) {
      score += equation.left;
    } else if (equation.solve(options)) {
      score += equation.left;
      solved.push(index);
    }
  });
  console.log(score);
  return solved;
};

if (import.meta.main) {
  console.time();
  const solved = r(input, ["+", "*"], []);
  r(input, ["+", "*", "|"], solved);
  console.timeEnd();
}
