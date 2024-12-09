export class Machine {
  left: number;
  right!: number[];

  constructor(raw: string) {
    const sides = raw.split(":");
    this.left = parseInt(sides[0]);
    this.right = sides[1].substring(1).split(" ").map((s) => parseInt(s));
  }

  solve(options: string[]): boolean {
    const ops = this.getOps(this.right.length - 1, options);

    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];

      const rightValue = this.right.reduce((result, arg, index, list) => {
        const thisOp = op.charAt(index - 1);
        if (index === 0) {
          result = arg;
        } else if (thisOp === "*") {
          result = result * arg;
        } else if (thisOp === "|") {
          // result = result * Math.pow(10, arg.toString().length) + arg;
          result = parseInt(result.toString() + arg.toString());
        } else {
          result = result + arg;
        }
        return result;
      }, 0);
      if (rightValue === this.left) {
        return true;
      }
    }

    return false;
  }

  getOps(width: number, options: string[]): string[] {
    const base = options.length;
    const howMany = Math.pow(base, width);
    const allOps: string[] = [];
    for (let i = 0; i < howMany; i++) {
      const ops = [];
      let j = i;
      while (j > 0) {
        const r = j % base;
        const next = options[r];
        ops.unshift(next);
        j = Math.floor(j / base);
      }
      allOps.push(("+".repeat(width) + ops.join("")).substring(ops.length));
    }
    return allOps;
  }

  printEval(op: string) {
    let evalS = "eval(";
    evalS += this.right.reduce((result, arg, index, list) => {
      const thisOp = op.charAt(index - 1);
      if (index === 0) {
        result = arg.toString();
      } else if (thisOp !== "|") {
        result = "(" + result + ")" + thisOp + arg;
      } else {
        result = "(" + result + ")*" + Math.pow(10, arg.toString().length) + "+" + arg;
      }
      return result;
    }, "");
    return evalS + ")";
  }
}
