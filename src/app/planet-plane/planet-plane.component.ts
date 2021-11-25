import { Component, Input, OnInit } from '@angular/core';
import { GodService } from '../services/god.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-planet-plane',
  templateUrl: './planet-plane.component.html',
  styleUrls: ['./planet-plane.component.css']
})
export class PlanetPlaneComponent implements OnInit {
  //rows = 18;
  cols = 50;
  rows = Math.floor(window.screen.height / 32) - 4;


  godService: GodService;
  toggleCellStatusEnabled = true;
  noOfGenerations: number = 0;
  startOrStopSimulation = "Start Simulation";
  stopSimulationFlag = false;
  population: number = 0;

  liveCellColor = "red";
  deadCellColor = "green";
  borderDisabled = false;
  _snackBar: MatSnackBar;
  @Input() maturitySpeed: number = 300;

  constructor(godService: GodService, _snackBar: MatSnackBar) {
    this._snackBar = _snackBar;
    this.godService = godService;

    /*this.cellsAlive.add(0 + "," + 0);
    this.cellsAlive.add(0 + "," + 1);
    this.cellsAlive.add(1 + "," + 0);
    this.cellsAlive.add(1 + "," + 1);
    this.cellsAlive.add(2 + "," + 2);
    this.cellsAlive.add(2 + "," + 3);
    this.cellsAlive.add(3 + "," + 2);
    this.cellsAlive.add(3 + "," + 3);
    */


    //this.cellsAlive.add(2 + "," + 3);

    //godService.setCellsStatus(this.cellsAlive);
  }

  ngOnInit(): void {
  }

  isAlive(row: number, col: number): boolean{
    return this.godService.cellsAlive.has(row + "," + col);
  }

  //returns empty array of given length - utility for *ngFor
  counter(len: number){
    return new Array(len);
  }


  startSimulation(){
    if(this.startOrStopSimulation === "Start Simulation"){
      this.startOrStopSimulation = "Stop Simulation";
      this.computeNextGen();
    }
    else{
      this.stopSimulationFlag = true;
      this.startOrStopSimulation = "Start Simulation";
      this.toggleCellStatusEnabled = true;
      this.liveCellColor = "red";
      this.deadCellColor = "green";
      this.borderDisabled = false;

      this.godService.cellsAlive.clear();
      return;
    }
  }
  async computeNextGen(): Promise<void>{
    this.population = this.godService.cellsAlive.size;
    if(!this.stopSimulationFlag){
      this.toggleCellStatusEnabled = false;
      this.godService.computeNextGen();
      await this.delay(this.maturitySpeed);
      this.noOfGenerations++;
      this.computeNextGen();
    }
    else{
      this.stopSimulationFlag = false;
      this.noOfGenerations = 0;
      return;
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  toggleCellStatus(row: number, col: number): void{
    if(this.toggleCellStatusEnabled){
      if(this.godService.cellsAlive.has(row + "," + col))
        this.godService.cellsAlive.delete(row + "," + col);
      else
        this.godService.cellsAlive.add(row + "," + col);
      this.population = this.godService.cellsAlive.size;
    }
  }

  enableDisableBorder(){
    //can toggle only if simulation has started
    //PS: when smulation has started,startOrStopSimulation button value would be "Stop Simulation"
    if(this.startOrStopSimulation === "Stop Simulation"){
      this.borderDisabled = !this.borderDisabled;
      if(this.borderDisabled){
        this.deadCellColor = "white";
        this.liveCellColor = "black";
      }
      else{
        this.liveCellColor = "red";
        this.deadCellColor = "green";
      }
    }
    else
      this._snackBar.open("Border can be toogled only after the simulation has started", "OK");
  }

}
