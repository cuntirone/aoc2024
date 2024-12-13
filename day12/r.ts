import { input } from "./input.ts";
import { region } from "./region.ts";
import { sample } from "./sample.ts";
import { side } from "./side.ts";

const r = (input: string, part2: boolean) => {
  const field = input.split("\n").map((line) => line.split(""));
  const regions = scout(field);
  let score = 0;
  regions.forEach((region) => {
    score += region.score(part2);
  });
  console.log(regions.length);
  console.log(score);
};

const scout = (field: string[][]): region[] => {
  const bounds = field.length - 1;
  const regions: region[] = [];
  field.forEach((row, r) => {
    row.forEach((cell: string, c: number) => {
      let perimeterScore = side.None;

      if (r === 0 || field[r - 1][c] !== cell) {
        perimeterScore |= side.Up;
      }
      if (r === bounds || field[r + 1][c] !== cell) {
        perimeterScore |= side.Down;
      }
      if (c === 0 || field[r][c - 1] !== cell) {
        perimeterScore |= side.Left;
      }
      if (c === bounds || field[r][c + 1] !== cell) {
        perimeterScore |= side.Right;
      }

      let belongs = [];
      for (let i = 0; i < regions.length; i++) {
        if (regions[i].add(r, c, cell, perimeterScore)) {
          belongs.push(i);
        }
      }
      // if it belongs to multiple regions
      if (belongs.length > 1) {
        // current plant is a joining parcel for two regions that should now merge
        for (let i = belongs.length - 1; i >= 1; i--) {
          if (regions[belongs[0]].merge(regions[belongs[i]])) {
            regions.splice(belongs[i], 1);
          }
        }
      } else if (belongs.length === 0) {
        regions.push(new region(r, c, cell, perimeterScore));
      }
    });
  });
  return regions;
};

if (import.meta.main) {
  console.time();
  r(input, !!parseInt(Deno.args[0]));
  console.timeEnd();
}
