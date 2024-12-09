import { input } from "./input.ts";
import { sample } from "./sample.ts";

const run = (input: string, part: string) => {
  const [rules, updates] = machine(input);
  let score = 0;
  updates.forEach((update) => {
    const middle = evaluate(update, rules);
    if (part === "one") {
      score += middle;
    } else {
      if (middle === 0) {
        score += sort(update, rules);
      }
    }
  });
  console.log(score);
};

const machine = (input: string) => {
  const parts = input.split("\n\n");
  const rules = parts[0].split("\n");
  const updates = parts[1].split("\n");
  return [rules, updates];
};

const evaluate = (update: string, rules: string[]) => {
  const pages = update.split(",");
  for (let i = 0; i < pages.length - 1; i++) {
    if (rules.indexOf(pages[i + 1] + "|" + pages[i]) > -1) {
      return 0;
    }
  }
  return parseInt(pages[Math.floor(pages.length / 2)]);
};

const sort = (update: string, rules: string[]) => {
  const pages = update.split(",");
  pages.sort((a, b) => {
    if (rules.indexOf(a + "|" + b) > -1) {
      return 1;
    }
    return -1;
  });
  return parseInt(pages[Math.floor(pages.length / 2)]);
};

if (import.meta.main) {
  console.time();
  //   run(sample);
  run(input, "one");
  run(input, "two");
  console.timeEnd();
}
