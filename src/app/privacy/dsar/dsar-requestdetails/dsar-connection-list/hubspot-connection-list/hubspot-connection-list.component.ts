import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-hubspot-connection-list',
  templateUrl: './hubspot-connection-list.component.html',
  styleUrls: ['./hubspot-connection-list.component.scss']
})
export class HubspotConnectionListComponent implements OnInit {
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
