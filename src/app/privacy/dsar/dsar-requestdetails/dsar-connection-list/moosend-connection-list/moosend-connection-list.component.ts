import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-moosend-connection-list',
  templateUrl: './moosend-connection-list.component.html',
  styleUrls: ['./moosend-connection-list.component.scss']
})
export class MoosendConnectionListComponent implements OnInit {
  @Input('connectionDetails') connectionDetails;
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
