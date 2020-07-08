import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from 'src/app/_services';
import { DsarRequestService } from 'src/app/_services/dsar-request.service';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
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
  ApproverList: any = [];
  approverName: any;
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
  requestType: any;
  subjectType: any;
  workflowName: any;
  nextTab: any;
  formName: any;
  customFields: any;
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
  //  this.getApprover();
    this.quillEditorText = new FormGroup({
      editor: new FormControl(null)
    });
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
        this.customFields = data.response.custom_data;
        this.respApprover = data.response.approver_firstname + ' ' + data.response.approver_lastname;
        this.respState = data.response.custom_data.state;
        this.respCity = data.response.custom_data.city;
        this.respCountry = data.response.custom_data.country;
        this.respCreatedAt = data.response.created_at;
        this.respUpdatedAt = data.response.updated_at;
        this.respDaysLeft = data.response.days_left;
        this.respFirstName = data.response.custom_data.first_name;
        this.respLastName = data.response.custom_data.last_name;
        this.respEmailID = data.response.custom_data.email;
        this.respCDID = data.response.id;
        this.formName = data.response.form_name;
        this.requestType = data.response.request_type;
        this.subjectType = data.response.subject_type;
        this.workflowName = data.response.workflow_name;
        this.getCustomFields(this.customFields);
      });
      
  }

  getApprover() {
    this.orgService.getOrgTeamMembers(this.currentManagedOrgID).subscribe((data) => {
      const key = 'response';
      this.ApproverList = data[key];
      const filterResponse = this.ApproverList.filter((t)=> t.approver_id === this.respApprover);
      this.approverName = filterResponse[0].user_name;
      return this.approverName;
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


  tabSelection(tab) {
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

  getDeadLine(createdDate, daysLeft) {
    const dt = new Date(createdDate);
    dt.setDate(dt.getDate() + this.getDueIn(createdDate, daysLeft));
    return dt;
  }

  getDueIn(createdDate, daysLeft) {
    const creationDate: any = new Date(createdDate);
    const todaysDate: any = new Date(Date.now());
    const diffTime = Math.abs(todaysDate - creationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return daysLeft - diffDays;
  }

  getCustomFields(data:any){
    // this.trimLabel = formControls.value.lblText.split(' ').join('_').toLowerCase();
   // this.customFields
   let updatedObj = [];
   if(data !== undefined){
    for (let k in data){

        let value = data[k];
        let key   = k.replace('_', ' ');
        let updatedKey = this.capitalizeFirstLetter(key);
        updatedObj[updatedKey] = value;
    }

   }
   return updatedObj;
  }



  capitalizeFirstLetter(key:any) {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

}

    


