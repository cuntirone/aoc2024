import { sample, sample2 } from "./sample.ts";
import { input } from "./input.ts";

const nextPositions: { [direction: string]: number[] } = { "v": [1, 0], "^": [-1, 0], "<": [0, -1], ">": [0, 1] };

const r = (input: string, part2: boolean) => {
  const [map, moves] = parseInput(input, part2);
  const bounds = map.length;
  const robotAt = input.indexOf("@");
  let row = Math.floor(robotAt / (bounds + 1));
  let col = robotAt % (bounds + 1);
  // every character is duplicated in part 2
  if (part2) {
    col = col * 2;
  }
  while (moves.length > 0) {
    // next move in the queue
    const next = moves.shift();
    [row, col] = move(map, row, col, next);
  }
  //   printMap(map);
  console.log(score(map, part2));
};

const score = (map: string[][], part2: boolean) => {
  let score = 0;
  let count = 0;
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
      if ((map[r][c] === "O" && !part2) || (map[r][c] === "[" && part2)) {
        score = score + r * 100 + c;
        count++;
      }
    }
  }
  console.log(count, "crates");
  return score;
};

const move = (map: string[][], row: number, col: number, nextMove: string) => {
  if (nextMove === undefined) {
    return;
  }
  const canMove = prepareNext(map, row, col, nextMove, []);
  if (canMove) {
    const [dxR, dxC] = nextPositions[nextMove];
    map[row + dxR][col + dxC] = map[row][col];
    map[row][col] = ".";
    return [row + dxR, col + dxC];
  }
  return [row, col];
};

// move everything out of the way to make room for robot at position [r,c] to move in that direction
const prepareNext = (map: string[][], r: number, c: number, direction: string, undo: any[]): boolean => {
  const [dxR, dxC] = nextPositions[direction];
  const [nr, nc] = [r + dxR, c + dxC];
  if (map[nr][nc] === ".") {
    // next spot is empty, all ready for robot to move
    return true;
  }
  if (map[nr][nc] === "#") {
    // hit a wall, nobody can move
    return false;
  }
  if (map[nr][nc] === "O" && prepareNext(map, nr, nc, direction, undo)) {
    // hit a box, but it could be moved
    map[nr + dxR][nc + dxC] = "O";
    map[nr][nc] = ".";
    return true;
  }
  if (map[nr][nc] === "[" && prepareNext(map, nr, nc, direction, undo)) {
    // hit a wide box, left side, but it could be moved
    // can I move the other half?
    if ((direction === "v" || direction === "^")) {
      if (!prepareNext(map, nr, nc + 1, direction, undo)) {
        // could not move the other half, undo the moves caused by left side if any; go the opposite direction
        const undoMove = direction === "v" ? "^" : "v";
        const [dxr, dxc] = nextPositions[undoMove];
        undo.reverse().forEach(([ur, uc]) => {
          map[ur + dxr][uc + dxc] = map[ur][uc];
          map[ur][uc] = ".";
        });
        undo.splice(0);
        return false;
      }
      // both sides can move
      map[nr + dxR][nc + dxC] = "[";
      map[nr + dxR][nc + dxC + 1] = "]";
      map[nr][nc] = ".";
      map[nr][nc + 1] = ".";
      undo.push([nr + dxR, nc + dxC], [nr + dxR, nc + dxC + 1]);
      return true;
    }
    map[nr + dxR][nc + dxC] = "[";
    map[nr][nc] = ".";
    return true;
  }

  if (map[nr][nc] === "]" && prepareNext(map, nr, nc, direction, undo)) {
    // hit a wide box, right side, but it could be moved
    // can I move the other half?
    if ((direction === "v" || direction === "^")) {
      if (!prepareNext(map, nr, nc - 1, direction, undo)) {
        // could not move the other half, undo the moves caused by right side if any; go the opposite direction
        const undoMove = direction === "v" ? "^" : "v";
        const [dxr, dxc] = nextPositions[undoMove];
        undo.reverse().forEach(([ur, uc]) => {
          map[ur + dxr][uc + dxc] = map[ur][uc];
          map[ur][uc] = ".";
        });
        undo.splice(0);
        return false;
      }
      map[nr + dxR][nc + dxC] = "]";
      map[nr + dxR][nc + dxC - 1] = "[";
      map[nr][nc] = ".";
      map[nr][nc - 1] = ".";
      undo.push([nr + dxR, nc + dxC], [nr + dxR, nc + dxC - 1]);
      return true;
    }
    map[nr + dxR][nc + dxC] = "]";
    map[nr][nc] = ".";
    return true;
  }
  return false;
};

const parseInput = (input: string, part2: boolean) => {
  const parts = input.split("\n\n");
  const map = parts[0].split("\n").map((line) =>
    line.split("").flatMap((cell) => {
      if (!part2) {
        return [cell];
      }
      if (cell === "#") {
        return ["#", "#"];
      } else if (cell === "O") {
        return ["[", "]"];
      } else if (cell === "@") {
        return ["@", "."];
      } else {
        return [".", "."];
      }
    })
  );
  const moves = parts[1].replaceAll("\n", "").split("");
  return [map, moves];
};

const printMap = (map: string[][]) => {
  let plot = "";
  const rBound = map.length;
  const cBound = map[0].length;
  for (let r = 0; r < rBound; r++) {
    for (let c = 0; c < cBound; c++) {
      plot += map[r][c];
    }
    plot += "\n";
  }
  console.log(plot);
};
if (import.meta.main) {
  console.time();
  r(input, true);
  // r(sample, true);
  //   r(sample2, true);
  console.timeEnd();
}
