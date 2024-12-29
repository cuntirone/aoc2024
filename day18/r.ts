import { ascend, RedBlackTree } from "@std/data-structures";
import { input } from "./input.ts";
import { sample } from "./sample.ts";

const r = (input: string, take: number, bounds: number) => {
  const bytes: Set<number> = new Set();
  input.split("\n").map((line) => line.split(",").map((num) => parseInt(num))).forEach((line, index) => {
    if (index < take) {
      bytes.add(10000 + line[0] * 100 + line[1]);
    }
  });

  // add dead zones
  /*
  for (let x = 42; x < bounds; x++) {
    for (let y = 0; y < 12; y++) {
      bytes.add(10000 + x * 100 + y);
    }
  }

  for (let x = 0; x < 39; x++) {
    for (let y = 39; y < bounds; y++) {
      bytes.add(10000 + x * 100 + y);
    }
  }

  for (let x = 39; x < 46; x++) {
    for (let y = 51; y < bounds; y++) {
      bytes.add(10000 + x * 100 + y);
    }
  }
  */
  //   const shortest = walk(start, bytes, bounds, path);
  printMemory(bounds, bounds, bytes, new Set(), new Set());
  const goodPaths = minPath(bounds, bytes);
  Object.values(goodPaths).forEach((goodPath) => {
    console.log(goodPath.size - 1);
    printMemory(bounds, bounds, bytes, goodPath, new Set());
  });
};
let count = 0;
const walk = (current: number, bytes: Set<number>, bounds: number, path: Set<number>): Set<number> => {
  printMemory(bounds, bounds, bytes, path, new Set());
  if (count++ > 1000) {
    return new Set();
  }
  const thisPath = new Set(path);
  thisPath.add(current);
  const [x, y] = toXY(current);
  if (x === bounds - 1 && y === bounds - 1) {
    return path;
  }
  const [left, right, up, down] = getAround(current, bounds, thisPath, bytes);
  const leftPath = left !== -1 ? walk(left, bytes, bounds, thisPath) : undefined;
  const rightPath = right !== -1 ? walk(right, bytes, bounds, thisPath) : undefined;
  const upPath = up !== -1 ? walk(up, bytes, bounds, thisPath) : undefined;
  const downPath = down !== -1 ? walk(down, bytes, bounds, thisPath) : undefined;
  const bestPath = [leftPath, rightPath, upPath, downPath]
    .filter((path) => path !== undefined && path.size > 0)
    .sort((a, b) => Math.sign(a.size - b.size));
  if (bestPath.length === 0) {
    return new Set();
  }
  return new Set(bestPath[0]);
};
type path = {
  id: number;
  priority: number;
  score: number;
};
const minPath = (bounds: number, bytes: Set<number>) => {
  const queue = new RedBlackTree<path>((a, b) => {
    const aOrder = a.priority * 10000000 + a.score * 100000 + a.id;
    const bOrder = b.priority * 10000000 + b.score * 100000 + b.id;
    return ascend(aOrder, bOrder);
  });

  // waste lands

  const maxWorkers = 5000;
  let minScore = 999999999;
  let pathId = 0;
  const paths: { [id: number]: Set<number> } = {};
  let current = toAdr(0, 0);
  const end = toAdr(bounds - 1, bounds - 1);

  let currentPath: Set<number> = new Set();
  currentPath.add(current);
  paths[pathId] = currentPath;
  queue.insert({ id: pathId, priority: 50, score: 99999 });
  while (!queue.isEmpty()) {
    // console.log(queue.size, Object.keys(paths).length, minScore);
    const nextPathIdentifier = queue.min();
    if (nextPathIdentifier !== null) {
      // quick exit for paths that are taking too long
      if (nextPathIdentifier.score > minScore) {
        // no need to keep going
        queue.remove(nextPathIdentifier);
        delete paths[nextPathIdentifier.id];
        continue;
      }

      const nextPath = paths[nextPathIdentifier.id];
      const nextPathSteps = nextPath.values().toArray();
      current = nextPathSteps[nextPathSteps.length - 1];
      if (current === end) {
        // reached the end
        queue.remove(nextPathIdentifier);
        if (nextPathIdentifier.score < minScore) {
          minScore = nextPathIdentifier.score;
        }
        continue;
      }

      if (pathId % 10000 === 0) {
        // printMemory(bounds, bounds, bytes, nextPath, new Set());
        console.log(pathId + " paths!");
      }

      let options = getAround(current, bounds, nextPath, bytes);
      let viable = options.filter((option) => option !== -1);
      // advance as much as we can on current path
      while (viable.length === 1) {
        // only one way to go, add it to current path
        nextPath.add(viable[0]);
        options = getAround(viable[0], bounds, nextPath, bytes);
        viable = options.filter((option) => option !== -1);
      }
      if (viable.length === 0) {
        // dead end path
        queue.remove(nextPathIdentifier);
        delete paths[nextPathIdentifier.id];
      } else {
        // spawn a new path to search alternate routes

        for (let i = 1; i < viable.length; i++) {
          pathId++;
          const newPath = new Set(nextPath);
          const newPathIdentifier = { id: pathId, priority: nextPathIdentifier.priority + 5, score: newPath.size };
          newPath.add(viable[i]);
          paths[pathId] = newPath;
          queue.insert(newPathIdentifier);
        }

        // viable is in preference order, stick current path to higher preference viable
        nextPath.add(viable[0]);
        queue.remove(nextPathIdentifier);
        nextPathIdentifier.score = nextPath.size;
        queue.insert(nextPathIdentifier);
      }
    }
  }
  // all done
  return paths;
};

const toAdr = (x: number, y: number) => 10000 + x * 100 + y;
const toXY = (address: number) => [Math.floor((address % 10000) / 100), address % 100];
const getAround = (current: number, bounds: number, path: Set<number>, bytes: Set<number>) => {
  const [x, y] = toXY(current);
  let left = x > 0 ? current - 100 : -1;
  let right = x < (bounds - 1) ? current + 100 : -1;
  let up = y > 0 ? current - 1 : -1;
  let down = y < (bounds - 1) ? current + 1 : -1;
  if (path.has(left) || bytes.has(left)) {
    left = -1;
  }
  if (path.has(right) || bytes.has(right)) {
    right = -1;
  }
  if (path.has(up) || bytes.has(up)) {
    up = -1;
  }
  if (path.has(down) || bytes.has(down)) {
    down = -1;
  }
  // return directions in preference order
  return [right, down, left, up];
};

const optimizeMemory = (bounds: number, bytes: Set<number>): Set<number> => {
  const addressSpace: Set<number> = new Set();
  const closed: Set<number> = new Set();
  for (let y = 0; y < bounds; y++) {
    for (let x = 0; x < bounds; x++) {
      addressSpace.add(toAdr(x, y));
    }
  }
  const freeSpace = addressSpace.difference(bytes);
  for (const free of freeSpace.values()) {
    const [x, y] = toXY(free);
    let left = x > 0 ? free - 100 : -1;
    let right = x < (bounds - 1) ? free + 100 : -1;
    let up = y > 0 ? free - 1 : -1;
    let down = y < (bounds - 1) ? free + 1 : -1;

    let closedSide = closeDeadEnd(left, right, up, down, bytes, freeSpace, closed);
    while (closedSide !== undefined) {
      const [x, y] = toXY(closedSide);
      left = x > 0 ? free - 100 : -1;
      right = x < (bounds - 1) ? free + 100 : -1;
      up = y > 0 ? free - 1 : -1;
      down = y < (bounds - 1) ? free + 1 : -1;
      closedSide = closeDeadEnd(left, right, up, down, bytes, freeSpace, closed);
    }
  }
  return closed;
};

const closeDeadEnd = (
  left: number,
  right: number,
  up: number,
  down: number,
  bytes: Set<number>,
  free: Set<number>,
  closed: Set<number>,
): number | undefined => {
  const closedLeft = left === -1 || bytes.has(left) ? 1 : 0;
  const closedRight = right === -1 || bytes.has(right) ? 1 : 0;
  const closedUp = up === -1 || bytes.has(up) ? 1 : 0;
  const closedDown = down === -1 || bytes.has(down) ? 1 : 0;
  const deadEnd = (closedLeft + closedRight + closedUp + closedDown) === 3;
  if (deadEnd) {
    if (!closedLeft) {
      return left;
    } else if (!closedRight) {
      return right;
    } else if (!closedUp) {
      return up;
    } else {
      return down;
    }
  }
  return undefined;
};

const printMemory = (xMax: number, yMax: number, bytes: Set<number>, path: Set<number>, closed: Set<number>) => {
  let output = "";
  for (let y = 0; y < yMax; y++) {
    for (let x = 0; x < xMax; x++) {
      if (path.has(10000 + x * 100 + y)) {
        output += "o ";
      } else if (closed.has(10000 + x * 100 + y)) {
        output += "x ";
      } else if (bytes.has(10000 + x * 100 + y)) {
        output += "# ";
      } else {
        output += ". ";
      }
    }
    output += "\n";
  }
  console.log(output);
};
if (import.meta.main) {
  console.time();
  // r(sample, 12, 7);
  r(input, 3000, 71);
  console.timeEnd();
}
