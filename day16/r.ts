import { assertFp } from "jsr:@std/internal@^1.0.5/diff";
import { sample } from "./sample.ts";
import { sample2 } from "./sample2.ts";

const dirs: { [dir: string]: { r: number; c: number } } = { "^": { r: -1, c: 0 }, "v": { r: 1, c: 0 }, "<": { r: 0, c: -1 }, ">": { r: 0, c: 1 } };
const r = (input: string) => {
  const maze = input.split("\n").map((line) => line.split(""));
  // const path = new Set<string>();
  // path.add(`${maze.length - 2}-1`);
  // walk(maze, maze.length - 2, 1, ">", path);
  // printMaze(maze);
  console.table(discover(maze));
};

const discover = (maze: string[][]) => {
  const nodes: { [node: number]: any } = {};
  const endR = 1;
  const endC = maze[0].length - 2;
  nodes[endR * 1000 + endC] = { cost: 0, next: "", previous: "" };
  for (let distance = 1; distance < maze[0].length - 3; distance++) {
    for (let row = endR; row <= endR + distance; row++) {
      const currentAddress = row * 1000 + endC - distance;
      const current = maze[row][endC - distance];
      findNeighbors(current, nodes, currentAddress);
    }
    for (let row = endR + distance; row >= endR; row--) {
      const currentAddress = row * 1000 + endC - distance;
      const current = maze[row][endC - distance];
      findNeighbors(current, nodes, currentAddress);
    }
    for (let col = endC - distance; col <= endC; col++) {
      const currentAddress = (endR + distance) * 1000 + col;
      const current = maze[endR + distance][col];
      findNeighbors(current, nodes, currentAddress);
    }
    for (let col = endC; col >= endC - distance; col--) {
      const currentAddress = (endR + distance) * 1000 + col;
      const current = maze[endR + distance][col];
      findNeighbors(current, nodes, currentAddress);
    }
  }
  return nodes;
};

const walk = (maze: string[][], r: number, c: number, dir: string, path: Set<string>): string[] => {
  const paths: string[] = [];
  while (true) {
    const from = path.substring(path.length - 1);
    const whereTo = peekAround(maze, r, c, from);
    let done = false;
    for (const [dir, next] of Object.entries(whereTo)) {
      if (next === "#") {
        // hit a wall or found the of the path
        // paths.push(path + next);
      } else if (next === "E") {
        // reached the goal, no need to look for more
        paths.push(path + next);
        done = true;
        break;
      } else {
        const { r: dR, c: dC } = dirs[dir];
        const [nextR, nextC] = [r + dR, c + dC];
        if (seen.has(`${nextR}-${nextC}`)) {
          // path found itself, end the loop
          //   paths.push(path + "s");
        } else {
          // we can walk
          seen.add(`${nextR}-${nextC}`);
          const newPaths = walk(maze, nextR, nextC, path + dir, seen);
          paths.push(...newPaths);
        }
      }
    }
    if (paths.length === 0) {
      break;
    }
    if (done) {
      break;
    }
  }
  return paths;
};

// looks around besides where we came from
const peekAround = (maze: string[][], r: number, c: number, from: string) => {
  const oppositeDir = from === "^" ? "v" : from === "v" ? "^" : from === "<" ? ">" : "<";
  return Object.keys(dirs).filter((dir) => dir !== oppositeDir).reduce((all, dir) => {
    all[dir] = maze[r + dirs[dir].r][c + dirs[dir].c];
    return all;
  }, {});
};

const printMaze = (maze: string[][]) => {
  let output = "";
  for (let r = 0; r < maze.length; r++) {
    for (let c = 0; c < maze[0].length; c++) {
      output += maze[r][c];
    }
    output += "\n";
  }
  console.log(output);
};

const findNeighbors = (current: string, nodes: { [node: number]: any }, currentAddress: number) => {
  if (current === "." || current === "S") {
    // got a possible node, look around for another node with a possible cost (connectivity to E)
    const up = nodes[currentAddress - 1000];
    const down = nodes[currentAddress + 1000];
    const left = nodes[currentAddress - 1];
    const right = nodes[currentAddress + 1];
    const currentNode = nodes[currentAddress] || { cost: 999999, next: "", previous: "" };
    if (up !== undefined && up.cost < currentNode.cost) {
      currentNode.cost = up.cost + 1;
      currentNode.next = "^";
    }
    if (down !== undefined && down.cost < currentNode.cost) {
      currentNode.cost = down.cost + 1;
      currentNode.next = "v";
    }
    if (left !== undefined && left.cost < currentNode.cost) {
      currentNode.cost = left.cost + 1;
      currentNode.next = "<";
    }
    if (right !== undefined && right.cost < currentNode.cost) {
      currentNode.cost = right.cost + 1;
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

if (import.meta.main) {
  console.time();
  r(sample2);
  console.timeEnd();
}
