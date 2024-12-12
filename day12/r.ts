import { input } from "./input.ts";
import { region } from "./region.ts";
import { sample } from "./sample.ts";

const r = (input: string, arg1: string) => {
  const field = input.split("\n").map((line) => line.split(""));
  const regions = scout(field);
  let score = 0;
  regions.forEach((region) => {
    if (arg1 === region.plant) {
      console.log(region, region.plants.length, region.score());
    }

    score += region.score();
  });
  console.log(regions.length);
  console.log(score);
};

const scout = (field: string[][]): region[] => {
  const bounds = field.length - 1;
  const regions: region[] = [];
  field.forEach((row, r) => {
    row.forEach((cell: string, c: number) => {
      let perimeterScore = 0;

      if (r === 0 || field[r - 1][c] !== cell) {
        perimeterScore++;
      }
      if (r === bounds || field[r + 1][c] !== cell) {
        perimeterScore++;
      }
      if (c === 0 || field[r][c - 1] !== cell) {
        perimeterScore++;
      }
      if (c === bounds || field[r][c + 1] !== cell) {
        perimeterScore++;
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

const printField = (field: string[][], highlight?: region) => {
  console.log(field.map((row) => row.join("")).join("\n"), "\n\n");
};

if (import.meta.main) {
  console.time();
  r(input, Deno.args[0]);
  console.timeEnd();
}
