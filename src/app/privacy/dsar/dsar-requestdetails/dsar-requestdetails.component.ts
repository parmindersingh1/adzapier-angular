import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from 'src/app/_services';
import { DsarRequestService } from 'src/app/_services/dsar-request.service';
import {NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dsar-requestdetails',
  templateUrl: './dsar-requestdetails.component.html',
  styleUrls: ['./dsar-requestdetails.component.scss']
})
export class DsarRequestdetailsComponent implements OnInit {
  requestID: any;
  currentManagedOrgID: any;
  currrentManagedPropID: any;
  currentPropertyName: any;
  requestDetails: any = [];
  active;
  disabled = true;

  respCDID: any;
  respCRID: any;
  respOID: any;
  respApprover: any;
  respCity: any;
  respState: any;
  respCountry: any;
  respDaysLeft: any;
  respEmailID: any;
  respFirstName: any;
  respLastName: any;
  respCreatedAt: any;
  respUpdatedAt: any;
  previousTabOne: any;
  previousTabTwo: any;
  previousTabThree: any;
  previousTabFour: any;
  previousTabFive: any;
  nextTab: any;
  quillEditorText: FormGroup;
  private fb: FormBuilder;
  editorDataFooter: any;
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: 1 }, { header: 2 }],
        ['link'],
        [{ align: [] }],
        [{ size: ['small', false, 'large', 'huge'] }]
      ]
    }
  };
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private orgService: OrganizationService,
              private dsarRequestService: DsarRequestService
     ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.requestID = params.get('id');
      console.log(JSON.stringify(params), 'params..');
    });
    this.getSelectedOrgIDPropertyID();
    this.loadDataRequestDetails();
    // this.quillEditorText = this.fb.group({
    //   editor: new FormControl(null)
    // });
  }
  
  getSelectedOrgIDPropertyID() {
    this.orgService.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id;
        this.currrentManagedPropID = response.property_id;
        this.currentPropertyName = response.property_name;
      } else {
        const orgDetails = this.orgService.getCurrentOrgWithProperty();
        this.currentManagedOrgID = orgDetails.organization_id;
        this.currrentManagedPropID = orgDetails.property_id;
        this.currentPropertyName = orgDetails.property_name;
      }
    });
  }
  
  backToDSARRequest() {
    this.router.navigate(['privacy/dsar/dsar-requests']);
  }

  loadDataRequestDetails() {
    this.dsarRequestService.getDSARRequestDetails(this.currentManagedOrgID, this.currrentManagedPropID, this.requestID)
    .subscribe((data) => {
      this.requestDetails.push(data.response);
      this.respApprover = data.response.approver;
      this.respState = data.response.state;
      this.respCity = data.response.city;
      this.respCountry = data.response.country;
      this.respCreatedAt = data.response.created_at;
      this.respUpdatedAt = data.response.updated_at;
      this.respDaysLeft = data.response.days_left;
      this.respFirstName = data.response.first_name;
      this.respLastName = data.response.last_name;
      this.respEmailID = data.response.request_data.email;
      this.respCDID = data.response.cdid;
    });
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    // console.log(changeEvent,'changeEvent..');
    // this.previousTab = false;
    this.tabSelection(changeEvent.activeId);
    if (changeEvent.activeId === 5 && changeEvent.nextId === 4) {
      this.previousTabFive = false;
      alert('do you want to change from ' + changeEvent.activeId + ' to ' + changeEvent.nextId);
    } else if (changeEvent.activeId === 4 && changeEvent.nextId === 3) {
      this.previousTabFour = false;
      alert('do you want to change from ' + changeEvent.activeId + ' to ' + changeEvent.nextId);
    } else if (changeEvent.activeId === 3 && changeEvent.nextId === 2) {
      this.previousTabThree = false;
      alert('do you want to change from ' + changeEvent.activeId + ' to ' + changeEvent.nextId);
    } else if (changeEvent.activeId === 2 && changeEvent.nextId === 1) {
      this.previousTabTwo = false;
      alert('do you want to change from ' + changeEvent.activeId + ' to ' + changeEvent.nextId);
    }
    //  else if (changeEvent.activeId < changeEvent.nextId) {
    //     this.previousTab = true;
    // } else if (changeEvent.activeId > changeEvent.nextId)   {
    //     this.previousTab = false;
    // }
  }
  

  tabSelection(tab){
    switch (tab) {
      case 1:
          this.previousTabOne = true;
          break;
      case 2:
          this.previousTabTwo = true;
          break;
      case 3:
          this.previousTabThree = true;
          break;
      case 4:
          this.previousTabFour = true;
          break;
      case 5:
        this.previousTabFive = true;
        break;
  }
  
  }

}