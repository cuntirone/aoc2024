import { sample, sample2 } from "../day08/sample.ts";
import { input } from "./input.ts";

const r = (input: string, partTwo: boolean, showOnly?: string) => {
  const field = input.split("\n").map((line) => line.split(""));
  const bounds = field.length;
  const frequencies: { [antena: string]: any[] } = {};

  for (let row = 0; row < bounds; row++) {
    for (let col = 0; col < bounds; col++) {
      const antena = field[row][col];
      if (antena !== ".") {
        frequencies[antena] = (frequencies[antena] || []).concat([`${row},${col}`]);
      }
    }
  }
  const antinodes: { row: number; col: number }[] = [];
  Object.keys(frequencies).forEach((freq) => {
    if (showOnly !== undefined && showOnly.indexOf(freq) === -1) {
      return;
    }
    const antenas = frequencies[freq];
    antenas.forEach((refAntena, _index, all) => {
      all.filter((antena) => antena !== refAntena).forEach((forwardAntena) => {
        // for any antena of a frequency (reference antena)
        let [refRow, refCol] = refAntena.split(",").map((coo: string) => parseInt(coo));
        // find another matching antena of the same frequency (forward antena)
        const [forRow, forCol] = forwardAntena.split(",").map((coo: string) => parseInt(coo));
        // and create an antinode on the opposite side of the forward antena in reference to ref antena
        let [antiRow, antiCol] = opposite(refRow, refCol, forRow, forCol);
        while (antiRow >= 0 && antiRow < bounds && antiCol >= 0 && antiCol < bounds) {
          if (field[antiRow][antiCol] !== "#") {
            if (field[antiRow][antiCol] === ".") {
              field[antiRow][antiCol] = "#";
            }
            antinodes.push({ row: antiRow, col: antiCol });
          }
          if (!partTwo) {
            break;
          }
          // for part 2 we keep going, hopping the same distance until we run out of bounds
          const [saveAntiRow, saveAntiCol] = [antiRow, antiCol];
          [antiRow, antiCol] = opposite(antiRow, antiCol, refRow, refCol);
          [refRow, refCol] = [saveAntiRow, saveAntiCol];
        }
        // in part two antena itself counts as an antinode
        if (partTwo) {
          antinodes.push({ row: forRow, col: forCol });
        }
      });
    });
  });

  console.log(
    Object.keys(antinodes.reduce((map, node, index) => {
      map[`${node.row},${node.col}`] = true;
      return map;
    }, {})).length,
  );

  //   printField(field, showOnly);
};

const opposite = (refRow: number, refCol: number, forwardRow: number, forwardCol: number) => {
  return [refRow + refRow - forwardRow, refCol + refCol - forwardCol];
};

const printField = (field: string[][], showOnly?: string) => {
  let printOut = field.map((row) => row.join("")).join("\n");
  if (showOnly) {
    const regex = new RegExp(`[^${showOnly.split("").join("|")}|#|\n.]`, "g");
    console.log(regex);
    printOut = printOut.replaceAll(regex, "_");
  }
  console.log(printOut, "\n\n");
};

if (import.meta.main) {
  console.time();
  r(input, false);
  r(input, true);
  console.timeEnd();
}
