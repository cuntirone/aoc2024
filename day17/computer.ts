import { ROM } from "./sample.ts";
import { modulo } from "https://deno.land/x/modulo/mod.ts";

export class computer {
  A: number;
  B: number;
  C: number;
  output: number[] = [];
  debug: boolean = false;

  instructions: { [opcode: number]: (operand: number) => number } = {
    0: (operand: number) => {
      if (this.debug) {
        const opStr = operand === 4 ? "A" : operand === 5 ? "B" : operand === 6 ? "C" : operand;
        console.log("0: setting A (" + this.A + ") to A / 2^" + opStr);
      }
      this.A = Math.floor(this.A / Math.pow(2, this.opValue(operand)));
      return 2;
    },
    1: (operand: number) => {
      if (this.debug) {
        console.log("1: setting B (" + this.B + ") to B ^ " + operand);
      }
      this.B = this.B ^ operand;
      return 2;
    },
    2: (operand: number) => {
      if (this.debug) {
        const opStr = operand === 4 ? "A (" + this.A + ")" : operand === 5 ? "B (" + this.B + ")" : operand === 6 ? "C (" + this.C + ")" : operand;
        console.log("2: setting B (" + this.B + ") to " + opStr + " % 8");
      }
      this.B = modulo(this.opValue(operand), 8);
      return 2;
    },
    3: (operand: number) => {
      if (this.A !== 0) {
        if (this.debug) {
          console.log("3: jumping to " + operand);
        }
        return operand;
      }
      return 2;
    },
    4: (_operand: number) => {
      if (this.debug) {
        console.log("4: setting B (" + this.B + ") to B ^ C (" + this.C + ")");
      }
      this.B = this.B ^ this.C;
      return 2;
    },
    5: (operand: number) => {
      if (this.debug) {
        const opStr = operand === 4 ? "A (" + this.A + ")" : operand === 5 ? "B (" + this.B + ")" : operand === 6 ? "C (" + this.C + ")" : operand;
        console.log("5: outputting " + opStr + " % 8");
      }
      this.output.push(modulo(this.opValue(operand), 8));
      return 2;
    },
    6: (operand: number) => {
      if (this.debug) {
        const opStr = operand === 4 ? "A (" + this.A + ")" : operand === 5 ? "B (" + this.B + ")" : operand === 6 ? "C (" + this.C + ")" : operand;
        console.log("6: setting B to A / 2^" + opStr);
      }
      this.B = Math.floor(this.A / Math.pow(2, this.opValue(operand)));
      return 2;
    },
    7: (operand: number) => {
      if (this.debug) {
        const opStr = operand === 4 ? "A (" + this.A + ")" : operand === 5 ? "B (" + this.B + ")" : operand === 6 ? "C (" + this.C + ")" : operand;
        console.log("7: setting C to A / 2^" + opStr);
      }
      this.C = Math.floor(this.A / Math.pow(2, this.opValue(operand)));
      return 2;
    },
  };

  constructor(rom: ROM) {
    this.A = rom.A;
    this.B = rom.B;
    this.C = rom.C;
  }

  private opValue(operand: number) {
    if (operand <= 3) {
      return operand;
    }
    switch (operand) {
      case 4:
        return this.A;
      case 5:
        return this.B;
      case 6:
        return this.C;
      default:
        return 100000;
    }
  }

  run(program: number[], debug: boolean = false) {
    this.debug = debug;
    let pointer = 0;
    this.output = [];
    while (pointer < program.length - 1) {
      const opCode = program[pointer];
      const operand = program[pointer + 1];
      const jump = this.instructions[opCode](operand);
      if (jump !== 2) {
        if (debug) {
          this.state();
          console.log("\n\n");
        }

        pointer = jump;
      } else {
        pointer += jump;
      }
    }
    if (debug) {
      this.state();
      console.log("Done!!!!\n\n");
    }
  }

  state() {
    console.log({ A: this.A, B: this.B, C: this.C, O: this.output.join(",") });
  }
}
