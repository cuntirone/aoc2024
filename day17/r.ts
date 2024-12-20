import { computer } from "./computer.ts";
import { input } from "./input.ts";
import { ROM, sample, sample2, sample3, sample4 } from "./sample.ts";

const r = (input: ROM, A: number, debug: boolean = false) => {
  const cpu = new computer(input);
  if (A !== 0) {
    cpu.A = A;
  }
  cpu.run(input.P, debug);
  return cpu.output.join(",");
};

if (import.meta.main) {
  console.time();

  const part1 = r(input, 0);
  console.log("part1: ", part1);

  const part2Expected = "2,4,1,1,7,5,1,5,4,2,5,5,0,3,3,0";

  // r(input,4) = 0;
  const part2digits = part2Expected.split(",").map((number) => parseInt(number.trim()));
  let A = 4;
  let current = r(input, A);
  for (let i = part2digits.length - 1; i >= 0; i--) {
    const expected = part2digits.slice(i).join(",");
    while (current !== expected) {
      if (current.length > expected.length) {
        break;
      }
      A++;
      current = r(input, A);
    }
    if (current === expected) {
      console.log("A: " + A + " --> " + current);
      // last op is multiplying A by 8 and starting all over again
      A = A * 8;
      continue;
    } else {
      break;
    }
  }
  console.timeEnd();
}
