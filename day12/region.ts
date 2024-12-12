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
  
    score(): number {
      return this.plants.reduce((sum, plant) => {
        sum += plant.p;
        return sum;
      }, 0) * this.plants.length;
    }
  }
  