import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GodService {
  cellsAlive: Set<String> = new Set<String>();
  cellsAliveInNextGen: Set<String> = new Set<String>();

  rows = Math.floor(window.screen.height / 32) - 4;
  cols = 50;
  directions: number[][] = [];

  setCellsStatus(cellsSetALive: Set<String>): void{
    this.cellsAlive = new Set<String>(cellsSetALive);
  }

  computeNextGen(): void{
    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        let neighboursAlive = this.getNoOfNeighboursAlive(i + "," + j);
        if(this.cellsAlive.has(i + "," + j)){
          if(neighboursAlive >= 2 && neighboursAlive <= 3)
            this.cellsAliveInNextGen.add(i + "," + j);
        }
        else{
          if(neighboursAlive == 3)
            this.cellsAliveInNextGen.add(i + "," + j);
        }
      }
    }
    this.cellsAlive = new Set<String>(this.cellsAliveInNextGen);
    this.cellsAliveInNextGen.clear();
  }

  getNoOfNeighboursAlive(index: String): number{
    let currRow = parseInt(index.split(",")[0]);
    let currCol = parseInt(index.split(",")[1]);
    let aliveNeighbourCount = 0;
    for(let i = 0; i < this.directions.length; i++){
        let row = this.directions[i][0] + currRow;
        let col = this.directions[i][1] + currCol;
        //below 4 conditions wraps the plane
        if(row >= this.rows) row = 0;
        if(col >= this.cols) col = 0;
        if(row < 0) row = this.rows - 1;
        if(col < 0) col = this.cols - 1;

        let neighbourAsString = row + "," + col;
        if(this.cellsAlive.has(neighbourAsString)) aliveNeighbourCount++;
    }
    return aliveNeighbourCount;
  }

  constructor() {
    this.directions.push([-1, 0]);
    this.directions.push([1, 0]);
    this.directions.push([0, -1]);
    this.directions.push([0, 1]);
    this.directions.push([-1, -1]);
    this.directions.push([-1, 1]);
    this.directions.push([1, -1]);
    this.directions.push([1, 1]);
   }
}
