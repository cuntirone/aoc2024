import { input } from "./input.ts";
import { sample } from "./sample.ts";

export const r = (input: string, xBound: number, yBound: number, duration: number) => {
  const robots = parse(input);
  const afterNseconds = robots.map(([px, py, vx, vy]) => move(px, py, vx, vy, xBound, yBound, duration));
  const { 1: q1, 2: q2, 3: q3, 4: q4 } = score1(afterNseconds, xBound, yBound);
  console.log("part1: ", q1, q2, q3, q4, q1 * q2 * q3 * q4);

  // tried submitting a couple of bogus part2 answers to gauge what's too high and too low; then ran it for 20000 seconds
  for (let i = 0; i <= duration; i++) {
    const afteriSeconds = robots.map(([px, py, vx, vy]) => move(px, py, vx, vy, xBound, yBound, i));
    if (score2(afteriSeconds)) {
      console.log("part2: ", i);
      printMap(afteriSeconds, xBound, yBound);
      break;
    }
  }
};

const score1 = (robots: number[][], bx: number, by: number): { [quadrant: number]: number } => {
  const middleX = bx % 2 === 1 ? 1 : 0;
  const middleY = by % 2 === 1 ? 1 : 0;
  const halfX = Math.floor(bx / 2);
  const halfY = Math.floor(by / 2);
  /*
     - -
    |1 2|
    |3 4|
     - -
  */

  const q: { [quadrant: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0 };
  robots.forEach(([px, py]) => {
    let quadrant = 0;
    if (px <= halfX - 1) {
      if (py <= halfY - 1) {
        quadrant = 1;
      } else if (py >= halfY + middleY) {
        quadrant = 3;
      }
    } else if (px >= halfX + middleX) {
      if (py <= halfY - 1) {
        quadrant = 2;
      } else if (py >= halfY + middleY) {
        quadrant = 4;
      }
    }
    q[quadrant] = q[quadrant] + 1;
  });
  return q;
};

const score2 = (robots: number[][]): boolean => {
  // check if robots are bunched up together, otherwise how can they display something
  let proximity = robots.reduce((count, [px, py], index, all) => {
    if (all.some(([ox, oy], otherIndex) => index !== otherIndex && Math.abs(px - ox) <= 1 && Math.abs(py - oy) <= 1)) {
      // this will count each couple of robots in proximity twice, but who cares
      count = count + 1;
    }
    return count;
  }, 0);
  // trial and error for proximity threshold
  return proximity > 350;
};

const move = (px: number, py: number, vx: number, vy: number, bx: number, by: number, seconds: number) => {
  // p - position, v - velocity, b - bounds
  return [(bx * seconds + px + vx * seconds) % bx, (by * seconds + py + vy * seconds) % by];
};

const printMap = (robots: number[][], bx: number, by: number) => {
  let map = "";
  for (let y = 0; y < by; y++) {
    for (let x = 0; x < bx; x++) {
      const howMany = robots.filter(([px, py]) => px === x && py === y).length;
      map += howMany === 0 ? "." : howMany;
    }
    map += "\n";
  }
  console.log(map);
};

const parse = (input: string) => {
  return input
    .split("\n")
    .map((line) =>
      line.split(" ")
        .flatMap((token) => token.substring(2).split(","))
        .map((n) => parseInt(n))
    );
};

if (import.meta.main) {
  console.time();
  // r(sample, 11, 7, 100);
  r(input, 101, 103, parseInt(Deno.args[0] || "100"));
  console.timeEnd();
}
