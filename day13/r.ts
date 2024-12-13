import { input } from "./input.ts";
import { sample } from "./sample.ts";

const r = (input: string, part2: boolean) => {
  const plays = parse(input);
  let score = 0;
  plays.forEach((play) => {
    let [Ax, Ay, Bx, By, Px, Py] = play;
    /* two equations:
      m*Ax + n*Bx = Px
      m*Ay + n*By = Py
      solve for m and n
    */
    if (part2) {
      Px = 10000000000000 + Px;
      Py = 10000000000000 + Py;
    }
    const n = (Py * Ax - Px * Ay) / (Ax * By - Bx * Ay);
    const m = (Px - n * Bx) / Ax;
    score += tokens(m, n, part2);
  });
  console.log(score);
};

const tokens = (m: number, n: number, part2: boolean) => {
  if (!part2 && (m > 100 || n > 100 || m < 0 || n < 0)) {
    return 0;
  }
  if (m > Math.floor(m) || n > Math.floor(n)) {
    // invalid play
    return 0;
  }
  return m * 3 + n;
};

const parse = (input: string) => {
  return input.split("\n\n")
    .map((play) => {
      const lines = play.split("\n");
      const [Ax, Ay] = lines[0]
        .replace("Button A: ", "")
        .split(", ")
        .map((unit) => parseInt(unit.substring(2)));
      const [Bx, By] = lines[1]
        .replace("Button B: ", "")
        .split(", ")
        .map((unit) => parseInt(unit.substring(2)));
      const [Px, Py] = lines[2]
        .replace("Prize: ", "")
        .split(", ")
        .map((unit) => parseInt(unit.substring(2)));

      return [Ax, Ay, Bx, By, Px, Py];
    });
};
if (import.meta.main) {
  console.time();
  r(input, false);
  r(input, true);
  console.timeEnd();
}
