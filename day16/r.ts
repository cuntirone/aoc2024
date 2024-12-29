import { assertFp } from "jsr:@std/internal@^1.0.5/diff";
import { sample } from "./sample.ts";
import { sample2 } from "./sample2.ts";

const dirs: { [dir: string]: { r: number; c: number } } = { "^": { r: -1, c: 0 }, "v": { r: 1, c: 0 }, "<": { r: 0, c: -1 }, ">": { r: 0, c: 1 } };
const r = (input: string) => {
  const maze = input.split("\n").map((line) => line.split(""));
  const endR = 1;
  const endC = maze[0].length - 2;
  const startR = maze.length - 2;
  const startC = 1;
  const path = findPath(discover(maze), startR * 1000 + startC, endR * 1000 + endC);

  // const path = new Set<string>();
  // path.add(`${maze.length - 2}-1`);
  // walk(maze, maze.length - 2, 1, ">", path);
  printMaze(maze, path);
  // console.table(discover(maze));
};

const discover = (maze: string[][]) => {
  const nodes: { [node: number]: any } = {};
  const endR = 1;
  const endC = maze[0].length - 2;
  nodes[endR * 1000 + endC] = { cost: 0, next: "", previous: "" };
  const queue = [];
  // queue.push({ r: endR, c: endC - 1, dir: "<" });
  queue.push({ r: endR + 1, c: endC, dir: "v" });

  while (queue.length > 0) {
    const { r, c, dir } = queue.shift();
    const visited = nodes[r * 1000 + c] !== undefined;
    // const around = [[-1, 0], [0, 1], [1,0], [0 , -1]].map
    findNeighbors(maze[r][c], nodes, r * 1000 + c);
    // if node has already been visited do not add neighbors to the queue again
    if (!visited) {
      if (dir !== "v" && (maze[r - 1][c] === "." || maze[r - 1][c] === "S")) {
        queue.push({ r: r - 1, c, dir: "^" });
      }
      if (dir !== "^" && (maze[r + 1][c] === "." || maze[r + 1][c] === "S")) {
        queue.push({ r: r + 1, c, dir: "v" });
      }
      if (dir !== ">" && (maze[r][c - 1] === "." || maze[r][c - 1] === "S")) {
        queue.push({ r, c: c - 1, dir: "<" });
      }
      if (dir !== "<" && (maze[r][c + 1] === "." || maze[r][c + 1] === "S")) {
        queue.push({ r, c: c + 1, dir: ">" });
      }
    }
  }

  // for (let distance = 1; distance < maze[0].length - 2; distance++) {
  //   for (let row = endR; row <= endR + distance; row++) {
  //     const currentAddress = row * 1000 + endC - distance;
  //     const current = maze[row][endC - distance];
  //     findNeighbors(current, nodes, currentAddress);
  //   }
  //   for (let row = endR + distance; row >= endR; row--) {
  //     const currentAddress = row * 1000 + endC - distance;
  //     const current = maze[row][endC - distance];
  //     findNeighbors(current, nodes, currentAddress);
  //   }
  //   for (let col = endC - distance; col <= endC; col++) {
  //     const currentAddress = (endR + distance) * 1000 + col;
  //     const current = maze[endR + distance][col];
  //     findNeighbors(current, nodes, currentAddress);
  //   }
  //   for (let col = endC; col >= endC - distance; col--) {
  //     const currentAddress = (endR + distance) * 1000 + col;
  //     const current = maze[endR + distance][col];
  //     findNeighbors(current, nodes, currentAddress);
  //   }
  // }
  return nodes;
};

const findPath = (nodes: { [node: number]: any }, start: number, end: number) => {
  const path = [];
  let current = start;
  while (current !== undefined && current !== end) {
    const currentNode = nodes[current];
    path.push({ r: Math.floor(current / 1000), c: current % 1000, dir: currentNode.next });
    if (currentNode.next === "^") {
      current = current - 1000;
    } else if (currentNode.next === "v") {
      current = current + 1000;
    } else if (currentNode.next === "<") {
      current = current - 1;
    } else {
      current = current + 1;
    }
  }
  return path;
};

// looks around besides where we came from
const peekAround = (maze: string[][], r: number, c: number, from: string) => {
  const oppositeDir = from === "^" ? "v" : from === "v" ? "^" : from === "<" ? ">" : "<";
  return Object.keys(dirs).filter((dir) => dir !== oppositeDir).reduce((all, dir) => {
    all[dir] = maze[r + dirs[dir].r][c + dirs[dir].c];
    return all;
  }, {});
};

const findNeighbors = (current: string, nodes: { [node: number]: any }, currentAddress: number) => {
  if (current === "." || current === "S") {
    // got a possible node, look around for another node with a possible cost (connectivity to E)
    const up = nodes[currentAddress - 1000];
    const down = nodes[currentAddress + 1000];
    const left = nodes[currentAddress - 1];
    const right = nodes[currentAddress + 1];
    const currentNode = nodes[currentAddress] || { cost: 99999999, next: "", previous: "" };
    if (up !== undefined && up.cost < currentNode.cost) {
      currentNode.cost = up.next === "^" || up.next === "" ? up.cost + 1 : up.cost + 1000;
      currentNode.next = "^";
    }
    if (down !== undefined && down.cost < currentNode.cost) {
      currentNode.cost = down.next === "v" || down.next === "" ? down.cost + 1 : down.cost + 1000;
      currentNode.next = "v";
    }
    if (left !== undefined && left.cost < currentNode.cost) {
      currentNode.cost = left.next === "<" || left.next === "" ? left.cost + 1 : left.cost + 1000;
      currentNode.next = "<";
    }
    if (right !== undefined && right.cost < currentNode.cost) {
      currentNode.cost = right.next === ">" || right.next === "" ? right.cost + 1 : right.cost + 1000;
      currentNode.next = ">";
    }
    if (currentNode.next !== "") {
      nodes[currentAddress] = currentNode;
    }

    if (currentNode.next === "^") {
      up.previous = "v";
    }
    if (currentNode.next === "v") {
      down.previous = "^";
    }
    if (currentNode.next === "<") {
      left.previous = ">";
    }
    if (currentNode.next === ">") {
      right.previous = "<";
    }
  }
};
const score2 = (path: any[]) => {
  let s = 1;
  for (let i = 1; i < path.length - 1; i++) {
    if (path[i].dir !== path[i - 1].dir) {
      s = s + 1000;
    } else {
      s++;
    }
  }
  return s;
};

const printMaze = (maze: string[][], path: any[]) => {
  let out = "";
  if (path.length === 0) {
    return;
  }
  const [headr, headc] = [path[path.length - 1].r, path[path.length - 1].c];
  for (let r = 0; r < maze.length; r++) {
    for (let c = 0; c < maze[0].length; c++) {
      if (headr === r && headc === c) {
        out += " 8";
      } else {
        const step = path.find((step) => step.r === r && step.c === c);
        if (step !== undefined) {
          out += " " + step.dir;
        } else {
          out += " " + maze[r][c];
        }
      }
    }
    out = out + "\n";
  }
  console.log(out);
  console.log(score2(path));
};

if (import.meta.main) {
  console.time();
  r(sample2);
  console.timeEnd();
}
