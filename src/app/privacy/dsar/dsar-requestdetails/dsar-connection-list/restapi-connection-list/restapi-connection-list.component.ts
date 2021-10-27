import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-restapi-connection-list',
  templateUrl: './restapi-connection-list.component.html',
  styleUrls: ['./restapi-connection-list.component.scss']
})
export class RestapiConnectionListComponent implements OnInit {
  @Input('connectionDetails') connectionDetails;
  @Input('connectionDetailsKeys') connectionDetailsKeys = [];
  @Output('currentStep') currentStep = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    console.log('connectionDetails', this.connectionDetails);
  }
  goBack(){
    this.currentStep.emit(true);
  }
  getColumnsParse(columns){
    return JSON.parse(columns);
  }
}
