import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-mailchimp-connection-list',
  templateUrl: './mailchimp-connection-list.component.html',
  styleUrls: ['./mailchimp-connection-list.component.scss']
})
export class MailchimpConnectionListComponent implements OnInit {
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
