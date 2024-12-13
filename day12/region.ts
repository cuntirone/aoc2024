import { side } from "./side.ts";

export class region {
  plant: string;
  plants: any[] = [];

  constructor(r: number, c: number, plant: string, onPerimeterCount: number) {
    this.plant = plant;
    this.plants.push({ r, c, p: onPerimeterCount });
  }

  add(r: number, c: number, plant: string, onPerimeterCount: number): boolean {
    if (this.plant !== plant) {
      return false;
    } else {
      for (let i = 0; i < this.plants.length; i++) {
        const neighbor = this.plants[i];
        if (
          (neighbor.r === r && (neighbor.c === c + 1 || neighbor.c === c - 1)) ||
          (neighbor.c === c && (neighbor.r === r + 1 || neighbor.r === r - 1))
        ) {
          this.plants.push({ r, c, p: onPerimeterCount });
          return true;
        }
      }
      return false;
    }
  }

  merge(other: region): boolean {
    if (this.plant !== other.plant) {
      return false;
    }
    other.plants.forEach((otherPlant) => {
      if (!this.plants.some((mine) => mine.r === otherPlant.r && mine.c === otherPlant.c)) {
        this.plants.push(otherPlant);
      }
    });
    return true;
  }

  score(part2?: boolean): number {
    const perimeterLength = this.plants.reduce((sum, plant, _index, all) => {
      let left = plant.p & side.Left ? 1 : 0;
      if (part2 && left && all.some((other) => other.r === plant.r - 1 && other.c === plant.c && other.p & side.Left)) {
        // there is no plant above with a perimeter also on the left side
        left = 0;
      }
      let right = plant.p & side.Right ? 1 : 0;
      if (part2 && right && all.some((other) => other.r === plant.r - 1 && other.c === plant.c && other.p & side.Right)) {
        // there is no plant above with a perimeter also on the right side
        right = 0;
      }
      let up = plant.p & side.Up ? 1 : 0;
      if (part2 && up && all.some((other) => other.r === plant.r && other.c === plant.c - 1 && other.p & side.Up)) {
        // there is no plant to the left with a perimeter also on the top side
        up = 0;
      }
      let down = plant.p & side.Down ? 1 : 0;
      if (part2 && down && all.some((other) => other.r === plant.r && other.c === plant.c - 1 && other.p & side.Down)) {
        // there is no plant to the left with a perimeter also on the bottom side
        down = 0;
      }
      sum += left + right + up + down;
      return sum;
    }, 0);

    return perimeterLength * this.plants.length;
  }
}
