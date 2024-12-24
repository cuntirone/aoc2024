import { input } from "./input.ts";
import { input2 } from "./input2.ts";
import { sample } from "./sample.ts";

const r = (input: string, cheatLength: number, limit: number) => {
  const [track, start, end] = parseInput(input);
  const path = findPath(track, start, end);
  const cheats = findCheats(path, limit).values().toArray();
  console.log("part1", cheats.filter((cheat) => cheat % 100000000 >= limit).length);
  const cheats2 = findCheats2(path, cheatLength, limit).values().toArray();
  console.log("part2", cheats2.length);
  // printTrack(track, path, start, new Set(cheats.map((cheat) => Math.floor(cheat / 100000000))));
};
const toAddress = (row: number, col: number) => row * 1000 + col;

const findPath = (track: string[][], start: { row: number; col: number }, end: { row: number; col: number }): Set<number> => {
  const path: Set<number> = new Set();

  let current = toAddress(start.row, start.col);
  path.add(current);
  while (current !== toAddress(end.row, end.col)) {
    const down = getSpot(current + 1000, track);
    const up = getSpot(current - 1000, track);
    const right = getSpot(current + 1, track);
    const left = getSpot(current - 1, track);
    if (down === "E" || up === "E" || right === "E" || left === "E") {
      break;
    }
    if (down === "." && !path.has(current + 1000)) {
      current = current + 1000;
      path.add(current);
    } else if (up === "." && !path.has(current - 1000)) {
      current = current - 1000;
      path.add(current);
    } else if (right === "." && !path.has(current + 1)) {
      current = current + 1;
      path.add(current);
    } else if (left === "." && !path.has(current - 1)) {
      current = current - 1;
      path.add(current);
    }
  }
  path.add(toAddress(end.row, end.col));
  return path;
};

const findCheats = (path: Set<number>, limit) => {
  const cheats: Set<number> = new Set();
  path.values().toArray().forEach((spot, index, all) => {
    // for any step in the path find another step 2 clicks away
    if (path.has(spot + 2) && !path.has(spot + 1)) {
      const savings = Math.abs(all.indexOf(spot + 2) - index) - 2;
      if (savings >= limit) {
        cheats.add((spot + 1) * 100000000 + savings);
      }
    }
    if (path.has(spot - 2) && !path.has(spot - 1)) {
      const savings = Math.abs(all.indexOf(spot - 2) - index) - 2;
      if (savings >= limit) {
        cheats.add((spot - 1) * 100000000 + savings);
      }
    }
    if (path.has(spot + 2000) && !path.has(spot + 1000)) {
      const savings = Math.abs(all.indexOf(spot + 2000) - index) - 2;
      if (savings >= limit) {
        cheats.add((spot + 1000) * 100000000 + savings);
      }
    }
    if (path.has(spot - 2000) && !path.has(spot - 1000)) {
      const savings = Math.abs(all.indexOf(spot - 2000) - index) - 2;
      if (savings >= limit) {
        cheats.add((spot - 1000) * 100000000 + savings);
      }
    }
  });
  return cheats;
};

const findCheats2 = (path: Set<number>, cheatLength: number, limit: number) => {
  const cheats: Set<number> = new Set();
  path.values().toArray().forEach((step, index, all) => {
    // look for steps in the path that are at least "limit" steps away
    for (let i = index + limit + 2; i < all.length; i++) {
      const other = all[i];
      // find taxi-cab distance
      const distance = Math.abs(step % 1000 - other % 1000) + Math.abs(Math.floor(step / 1000) - Math.floor(other / 1000));
      const savings = i - index - distance;
      if (distance >= 2 && distance <= cheatLength && savings >= limit) {
        cheats.add(step * 100000000 + other);
      }
    }
  });
  return cheats;
};

const parseInput = (input: string) => {
  const track = input.split("\n").map((line) => line.split(""));
  const startIndex = input.indexOf("S");
  const endIndex = input.indexOf("E");
  const colBounds = track[0].length - 1;
  const start = { row: Math.floor(startIndex / (colBounds + 2)), col: startIndex % (colBounds + 2) };
  const end = { row: Math.floor(endIndex / (colBounds + 2)), col: endIndex % (colBounds + 2) };
  return [track, start, end];
};

const getSpot = (address: number, track: string[][]) => {
  const row = Math.floor(address / 1000);
  if (row >= track.length || row < 0) {
    return "x";
  }
  const col = address % 1000;
  if (col >= track[row].length || col < 0) {
    return "x";
  }
  return track[row][col];
};

const printTrack = (track: string[][], path: Set<number>, start: { row: number; col: number }, cheats: Set<number>) => {
  let map = "";
  track.forEach((line, row) => {
    line.forEach((cell, col) => {
      if (start.row === row && start.col === col) {
        map += "S";
      } else if (path.has(toAddress(row, col))) {
        map += "·";
      } else if (cheats.has(toAddress(row, col))) {
        map += "*";
      } else {
        map += " "; //cell;
      }
    });
    map += "\n";
  });
  console.log(map);
};

if (import.meta.main) {
  console.time();
  // r(sample, 20, 50);
  r(input, 20, parseInt(Deno.args[0]) || 100);
  console.timeEnd();
}
