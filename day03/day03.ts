import { sample, sample2 } from "./sample.ts";

export const solve = (input: string) => {
  const ops = extractOps(input);
  let enabled = true;
  let score = 0;
  ops?.forEach((op) => {
    if (op === "do()") {
      enabled = true;
    } else if (op === "don't()") {
      enabled = false;
    }
    if (enabled) {
      score += calculate(op);
    }
  });
  console.log(score);
};

export const extractOps = (input: string) => {
  const regex = new RegExp(/mul\(\d{1,3}\,\d{1,3}\)|do\(\)|don't\(\)/g);
  return input.match(regex);
};

export const calculate = (phrase: string) => {
  const op = phrase.substring(0, phrase.indexOf("("));
  const factor1 = phrase.substring(op.length + 1, phrase.indexOf(","));
  const factor2 = phrase.substring(
    op.length + factor1.length + 2,
    phrase.indexOf(")"),
  );
  switch (op) {
    case "mul":
      return parseInt(factor1) * parseInt(factor2);

    default:
      return 0;
  }
};

if (import.meta.main) {
  console.time();
  //   solve(sample2);
  const inputResponse = await fetch(
    "https://adventofcode.com/2024/day/3/input",
    {
      headers: {
        "Cookie":
          "session=53616c7465645f5f80e0217519d1e7235f8886f0199db18698d4d506d539a0a9033489c1f2f04cf58825164f89a9a91cf2bcb26273486e05f2a3142ccea2e261",
      },
    },
  );
  const input = await inputResponse.text();
  solve(input);
  console.timeEnd();
}
