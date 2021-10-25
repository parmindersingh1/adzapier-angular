import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-sendgrid-connection-list',
  templateUrl: './sendgrid-connection-list.component.html',
  styleUrls: ['./sendgrid-connection-list.component.scss']
})
export class SendgridConnectionListComponent implements OnInit {
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
