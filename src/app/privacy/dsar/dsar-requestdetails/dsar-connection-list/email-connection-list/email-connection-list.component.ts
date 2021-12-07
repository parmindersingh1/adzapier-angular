import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-email-connection-list-active-campaign',
  templateUrl: './email-connection-list.component.html',
  styleUrls: ['./email-connection-list.component.scss']
})
export class EmailConnectionListComponent implements OnInit {
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
