const sample = "125 17";
const sample2 = "0";
const input = "773 79858 0 71 213357 2937 1 3998391";


let debug = "";
let counter = 0;
let cacheCounter = 0;
const cache: any = {};

const r = (input: string, blinks: string) => {
  const numbers = input.split(" ").map((num) => parseInt(num));
  let score = 0;
  numbers.forEach((num) => score += blink(num, parseInt(blinks)));
  console.log("too many times", counter);
  console.log(score);
};

const blink = (num: number, blinks: number): number => {
  counter++;
  const numstring = num.toString();
  if (blinks === 0) {
    return 1;
  }
  let score = 0;
  if (cache[numstring + "," + blinks] !== undefined) {
    return cache[numstring + "," + blinks];
  }
  if (num === 0) {
    score = blink(1, blinks - 1);
  } else if (numstring.length % 2 === 0) {
    score = blink(parseInt(numstring.substring(0, numstring.length / 2)), blinks - 1) +
      blink(parseInt(numstring.substring(numstring.length / 2)), blinks - 1);
  } else {
    score = blink(num * 2024, blinks - 1);
  }

  // playing around with cache settings
  // blinks: 10, size: 4000 = 6262ms
  // blinks: 5, size: 4000 = 2627ms
  // blinks: 3, size: 8000 = 1675ms
  if (blinks > 3 && cacheCounter < 8000) {
    cache[numstring + "," + blinks] = score;
    cacheCounter++;
  }
  return score;
};

if (import.meta.main) {
  console.time();
  r(input, Deno.args[0]);
  console.timeEnd();
}
