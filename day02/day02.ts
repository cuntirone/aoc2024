import { inputOne } from "./inputOne.ts";
import { sample } from "./sample.ts";

export const partOne = (input: string, retries: number) => {
  const reports = input.split("\n");
  const trendy: any[] = [];
  let safeCount = 0;
  reports.forEach((report) => {
    const levels = toTrend(report);
    const safe = isSafe(levels, retries);
    trendy.push(
      [report, safe.toString()].concat(levels.map((level) => level.toString())),
    );
    if (safe) {
      safeCount++;
    }
  });
  console.log(safeCount);
  // console.table(trendy.filter((report) => report[1] !== "true"));
};

const toTrend = (input: string) => {
  const levels = input.split(" ").map((level) => parseInt(level, 10));
  return levels.map((_element, index, array) => {
    if (index === 0) {
      return 0;
    }
    return array[index] - array[index - 1];
  });
};

const isSafe = (trends: number[], retries: number) => {
  const sign = Math.sign(trends[1]);
  for (let i = 1; i <= trends.length - 1; i++) {
    if (
      trends[i] === 0 ||
      Math.sign(trends[i]) !== sign ||
      Math.abs(trends[i]) > 3
    ) {
      if (retries > 0) {
        if (i == 2) {
          if (isSafe(trends.slice(1), --retries)) {
            return true;
          }
        }
        if (i < trends.length - 1) {
          let damp = trends.slice(0, i).concat(trends.slice(i + 1));
          damp[i] = damp[i] + trends[i];
          if (isSafe(damp, retries - 1)) {
            return true;
          } else {
            damp = trends.slice(0, i - 1).concat(trends.slice(i));
            damp[i - 1] = damp[i - 1] + trends[i - 1];
            return isSafe(damp, retries - 1);
          }
        }
        if (retries === 1) {
          return true;
        }
      }
      return false;
    }
  }
  return true;
};

if (import.meta.main) {
  console.time();
  // partOne(sample, 1);
  partOne(inputOne, 1);
  // partTwo(sample);
  // partTwo(inputOne,);
  console.timeEnd();
}
