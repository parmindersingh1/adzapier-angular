import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-customcards',
  templateUrl: './customcards.component.html',
  styleUrls: ['./customcards.component.scss']
})
export class CustomcardsComponent implements OnInit {
  @Input() dataList : any;
  @Output() onClickViewForm : EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleteWebForm : EventEmitter<any> = new EventEmitter<any>();
  @Input() currentOrganization: any;
  @Input() currentPropertyName: any;
  orgDetails: any;
  currentOrgID: any;
  constructor() { }

  ngOnInit() {
  }
  
  showForm(data) {
    this.onClickViewForm.emit(data);
  }

  deleteForm(data){    
    this.onDeleteWebForm.emit(data);
  }
}
