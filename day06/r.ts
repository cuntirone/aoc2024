import { input } from "./input.ts";
import { sample } from "./sample.ts";

const r = (input: string) => {
  const field = input.split("\n").map((line) => line.split(""));
  const position = input.replaceAll("\n", "").indexOf("^");
  const col = position % field.length;
  const row = Math.floor(position / field.length);
  let [newRow, newCol] = walk(field, { row, col }, field[row][col]);
  while (newCol > 0 && newCol < field.length - 1 && newRow > 0 && newRow < field.length - 1) {
    const rightDir = turnRight(field[newRow][newCol]);
    // field[newRow][newCol] = field[newRow][newCol] === "." ? newDir : field[newRow][newCol] + newDir;
    // field[newRow][newCol] = newDir;
    [newRow, newCol] = walk(field, { row: newRow, col: newCol }, rightDir);
  }
  const regex = new RegExp(/\^|>|<|v/g);
  console.table(field);
  let score1 = 0;
  let score2 = 0;
  for (let row = 0; row < field.length; row++) {
    for (let col = 0; col < field.length; col++) {
      if (field[row][col] !== "." && field[row][col] !== "#") {
        score1++;

        const next = peekNext(field, { row, col });
        if (next !== "#") {
          const lookFar = peekRight(field, { row, col });
          if (lookFar !== "") {
            console.log(row, col, lookFar);
            score2++;
          }
        }
      }
      // if (
      //   (field[row][col] === "<" && field[row - 1][col] === "^") ||
      //   (field[row][col] === "^" && field[row][col + 1] === ">") ||
      //   (field[row][col] === ">" && field[row + 1][col] === "v") ||
      //   (field[row][col] === "v" && field[row][col - 1] === "<")
      // ) {
      //   console.log(row, col);
      //   score2++;
      // }
    }
  }
  console.log(score1, score2);
};

const r2 = (input: string) => {
  const field = input.split("\n").map((line) => line.split(""));
  const position = input.replaceAll("\n", "").indexOf("^");
  const startCol = position % field.length;
  const startRow = Math.floor(position / field.length);
  const route = [`${startRow},${startCol},^`];
  escape(field, route, false);
  const visitMap: any = toMap(route);
  // console.table(field);
  console.log(Object.keys(visitMap).length);
  let score2 = {};
  route.forEach((cell, index) => {
    // console.time(index);
    const [row, col] = cell.split(",").map((s) => parseInt(s));
    if (!score2[`${row},${col}`]) {
      field[row][col] = "O";
      const loop = [`${startRow},${startCol},^`];
      escape(field, loop, true);
      if (loop[loop.length - 1] === "loop") {
        score2[`${row},${col}`] = true;
      }
      field[row][col] = ".";
      // console.timeEnd(index);
    }
  });
  console.log(Object.keys(score2).length);
};

const turnRight = (dir: string) => {
  return dir === "^" ? ">" : dir === ">" ? "v" : dir === "v" ? "<" : "^";
};

const escape = (field: string[][], route: string[], checkLoopOnly: boolean) => {
  const current = route[route.length - 1];
  let [r, c, dir] = current.split(",");
  let row = parseInt(r), col = parseInt(c);
  while (true) {
    // break if running out of bounds
    const bounds = field.length - 1;
    if (row === 0 && dir === "^") {
      break;
    }
    if (row === bounds && dir === "v") {
      break;
    }
    if (col === 0 && dir === "<") {
      break;
    }
    if (col === bounds && dir === ">") {
      break;
    }
    const [next, nextRow, nextCol] = peekNext(field, { row, col }, dir);
    if (next === "#" || next === "O") {
      dir = turnRight(dir);
    } else {
      row = nextRow;
      col = nextCol;
    }
    const nextStep = `${row},${col},${dir}`;
    if (checkLoopOnly && route.indexOf(nextStep) > -1) {
      // we are looping
      route.push("loop");
      return;
    }
    route.push(nextStep);
  }
  // return route + ":" + score1 + "*" + score2;
};

const toMap = (route: string[]) => {
  route.shift();
  return route.reduce((distinct, item) => {
    const [row, col, dir] = item.split(",");
    distinct[`${row},${col}`] = distinct[`${row},${col}`] || "" + dir;
    return distinct;
  }, {});
};

const walk = (field: string[][], pos: { row: number; col: number }, dir: string) => {
  let { row, col } = pos;
  // let dir = field[row][col].substring(field[row][col].length - 1);
  let next = peekNext(field, pos, dir);
  // if (next === "#") {
  //   // hit a obstacle, turn right
  //   dir = turnRight(dir);
  // }
  while (next !== "#" && next !== "e") {
    switch (dir) {
      case "^":
        row = row - 1;
        break;
      case "v":
        row = row + 1;
        break;
      case "<":
        col = col - 1;
        break;
      case ">":
        col = col + 1;
        break;
      default:
        break;
    }
    field[row][col] = field[row][col] === "." ? dir : field[row][col] + dir;
    next = peekNext(field, { row, col }, dir);
  }
  return [row, col];
};

const peekNext = (field: string[][], pos: { row: number; col: number }, dir: string): [string, number, number] => {
  let { row, col } = pos;
  switch (dir) {
    case "^":
      row = row - 1;
      break;
    case "v":
      row = row + 1;
      break;
    case "<":
      col = col - 1;
      break;
    case ">":
      col = col + 1;
      break;
    default:
      break;
  }
  if (row >= 0 && row < field.length && col >= 0 && col < field.length) {
    return [field[row][col], row, col];
  }
  return ["e", row, col];
};

const peekRight = (field: string[][], pos: { row: number; col: number }) => {
  let { row, col } = pos;
  const dir = field[row][col];
  if (peekNext(field, { row, col }, dir) === "#") {
    return "";
  }
  const lookRight = turnRight(dir);
  let toNextObstruction = "";
  switch (lookRight) {
    case "^":
      for (let r = row - 1; r > 0; r--) {
        const next = field[r][col];
        toNextObstruction += next;
        if (next === "#") {
          break;
        }
      }
      break;
    case ">":
      for (let c = col + 1; c < field.length; c++) {
        const next = field[row][c];
        toNextObstruction += next;
        if (next === "#") {
          break;
        }
      }
      break;
    case "v":
      for (let r = row + 1; r < field.length; r++) {
        const next = field[r][col];
        toNextObstruction += next;
        if (next === "#") {
          break;
        }
      }
      break;
    case "<":
      for (let c = col - 1; c > 0; c--) {
        const next = field[row][c];
        toNextObstruction += next;
        if (next === "#") {
          break;
        }
      }
      break;
  }
  if (toNextObstruction.charAt(toNextObstruction.length - 1) === "#" && toNextObstruction.charAt(toNextObstruction.length - 2) !== lookRight) {
    // possible loop
    return toNextObstruction;
  }
  return "";
};

const printField = (field: string[][]) => {
  console.log(field.map((row) => row.join("")).join("\n"), "\n\n");
};

if (import.meta.main) {
  console.time();

  // r2(sample);
  r2(input);
  console.timeEnd();
}
