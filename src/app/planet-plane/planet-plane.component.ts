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
  cols = Math.floor(window.screen.width / 32) + 10;
  rows = Math.floor(window.screen.height / 32) - 6;


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

  inbuiltPattern = "None";
  blinkerPattern: Set<String> = new Set<String>();
  gliderPattern: Set<String> = new Set<String>();
  pulsarPattern: Set<String> = new Set<String>();
  pentaPattern: Set<String> = new Set<String>();

  startSimulationClickedByUser = false;

  constructor(godService: GodService, _snackBar: MatSnackBar) {
    this._snackBar = _snackBar;
    this.godService = godService;

    this.initAllInbuiltPatterns();




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
  initAllInbuiltPatterns(){
    this.blinkerPattern.add("3,3");
    this.blinkerPattern.add("4,3");
    this.blinkerPattern.add("5,3");

    this.gliderPattern.add("3,3");
    this.gliderPattern.add("4,4");
    this.gliderPattern.add("5,4");
    this.gliderPattern.add("5,3");
    this.gliderPattern.add("5,2");

    let pulsarstr: String[]= [
    "1,5",
      "1,6",
      "1,7",
      "3,8",
      "4,8",
      "5,8",
      "6,7",
      "6,6",
      "6,5",
      "5,3",
      "4,3",
      "3,3",
      "3,10",
      "4,10",
      "5,10",
      "6,11",
      "6,12",
      "6,13",
      "5,15",
      "4,15",
      "3,15",
      "1,11",
      "1,12",
      "1,13",
      "8,6",
         "8,5",
         "8,7",
         "9,8",
         "10,8",
         "11,8",
         "13,7",
         "13,6",
         "13,5",
         "9,3",
         "10,3",
         "11,3",
         "9,10",
         "10,10",
         "11,10",
         "8,11",
         "8,12",,
         "8,13",
         "9,15",
         "10,15",
         "11,15",
    ,"13,13","13,12","13,11"] as String[];

    for(let str in pulsarstr){
      this.pulsarPattern.add(pulsarstr[str]);
    }

    let pentaStr: String[] = ["3,4", "4,4", "5,3", "5,5", "6,4", "7,4", "8,4", "9,4", "11,4", "12,4", "10,3", "10,5"];

    for(let str in pentaStr){
      this.pentaPattern.add(pentaStr[str]);
    }
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

  isSimulationInProgress(): boolean{
    if(this.startOrStopSimulation === "Start Simulation") return false;
    return true;
  }

  startSimulation(){
    if(this.population == 0 && this.startOrStopSimulation === "Start Simulation")
      this._snackBar.open("Population is zero, evolution is futile", "Got it");
    else if(this.startOrStopSimulation === "Start Simulation"){
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
      this.inbuiltPattern = "None";
      return;
    }
  }
  async computeNextGen(): Promise<void>{
    this.population = this.godService.cellsAlive.size;
    if(this.population == 0 && this.startOrStopSimulation
      !== "Start Simulation"){
      this._snackBar.open("Judgment Day has come, extinction attained.", "Ok");
      this.noOfGenerations = 0;
      this.startSimulation();
      this.stopSimulationFlag = false;
      return;
    }
    else if(!this.stopSimulationFlag){
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

  initPopulationState(){
    if(this.inbuiltPattern == "Blinker"){
      this.godService.cellsAlive.clear();
      this.godService.setCellsStatus(this.blinkerPattern);
      this.population = this.blinkerPattern.size;
    }

    else if(this.inbuiltPattern == "Glider"){
      this.godService.cellsAlive.clear();
      this.godService.setCellsStatus(this.gliderPattern);
      this.population = this.gliderPattern.size;

    }

    else if(this.inbuiltPattern == "Pulsar"){
      this.godService.cellsAlive.clear();
      this.godService.setCellsStatus(this.pulsarPattern);
      this.population = this.pulsarPattern.size;

    }

    else if(this.inbuiltPattern == "Penta"){
      this.godService.cellsAlive.clear();
      this.godService.setCellsStatus(this.pentaPattern);
      this.population = this.pentaPattern.size;

    }
  }

}
