import { input } from "./input.ts";
import { input2 } from "./input2.ts";
import { input3 } from "./input3.ts";
import { sample, sample2 } from "./sample.ts";

const r = (input: string, only: number = 0) => {
  const [towels, onsens] = parseInput(input);
  let count = 0;
  onsens.forEach((onsen) => {
    if (isMatch(towels, onsen)) {
      console.log(onsen);
      count++;
    }
  });
  console.log("part1: ", count);

  count = 0;
  onsens.forEach((onsen) => {
    count += matches3(towels, onsen);
  });
  console.log("part2: ", count);
};

const isMatch = (towels: string[], onsen: string) => {
  const regex = new RegExp(`(${towels.join("|")})`, "g");
  const whatsLeft = onsen.replaceAll(regex, "");
  if (whatsLeft === "") {
    return true;
  } else {
    // try harder
    const allMatches: { token: string; from: number; to: number }[] = [];
    towels.forEach((towel) => {
      const regex = new RegExp(`(${towel})`, "g");
      const matches = [...onsen.matchAll(regex)];
      if (matches.length > 0) {
        matches.forEach((match) => {
          allMatches.push({ token: towel, from: match.index, to: match.index + towel.length });
        });
      }
    });
    let matchingWindow: Set<number> = new Set(allMatches.filter((match) => match.from === 0).map((match) => match.to));
    while (matchingWindow.size > 0) {
      if (matchingWindow.has(onsen.length)) {
        return true;
      }
      matchingWindow = new Set(allMatches.filter((next) => matchingWindow.has(next.from)).map((next) => next.to));
    }
    return false;
  }
};

const matches3 = (towels: string[], onsen: string): number => {
  if (!isMatch(towels, onsen)) {
    return 0;
  }
  const fromNode: { [from: number]: number[] } = {};

  towels.forEach((towel) => {
    // regex does not work with overlapping matches
    let index = onsen.indexOf(towel);
    while (index !== -1) {
      fromNode[index] = fromNode[index] || [];
      fromNode[index].push(index + towel.length);
      // console.log(towel, index);
      index = onsen.indexOf(towel, index + 1);
    }
  });
  console.log(fromNode);
  const known = {};
  const part2 = howManyWays(0, fromNode, onsen.length, known);
  console.log(onsen);
  // console.log(fromNode);
  console.log(known);
  return part2;
};

const howManyWays = (from: number, nodes: { [from: number]: number[] }, target: number, known: { [from: number]: number }): number => {
  if (known[from] !== undefined) {
    // console.log(from, known[from]);
    return known[from];
  }
  const children = nodes[from];
  if (children === undefined) {
    return 0;
  }
  const childrenSum = children.reduce((acc, child) => {
    let childCount = 0;
    if (child === target) {
      childCount = 1;
    } else {
      childCount = howManyWays(child, nodes, target, known);
    }

    known[child] = childCount;
    return acc + childCount;
  }, 0);
  // console.log(from, childrenSum);
  return childrenSum;
};

const parseInput = (input: string) => {
  const parts = input.split("\n\n");
  const towels = parts[0].split(", ");
  const onsens = parts[1].split("\n");
  return [towels, onsens];
};

if (import.meta.main) {
  console.time();
  // r(sample);
  r(input);
  console.timeEnd();
}

/*
522064467457081 = too low

752241520131191 = not right
752241520130790 = not right
752241520131190 = not right
752241520131190
*/
