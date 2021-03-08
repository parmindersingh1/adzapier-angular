import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationService } from 'src/app/_services';
import { CCPAFormConfigurationService } from 'src/app/_services/ccpaform-configuration.service';

@Component({
  selector: 'app-customcards',
  templateUrl: './customcards.component.html',
  styleUrls: ['./customcards.component.scss']
})
export class CustomcardsComponent implements OnInit {
  @Input() dataList : any;
  @Output() onClickViewForm : EventEmitter<any> = new EventEmitter<any>();
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

}
