import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from 'src/app/_services';
import { DsarRequestService } from 'src/app/_services/dsar-request.service';
import { NgbNavChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { CcpadataService } from 'src/app/_services/ccpadata.service';
import { CCPAFormConfigurationService } from 'src/app/_services/ccpaform-configuration.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';

@Component({
  selector: 'app-dsar-requestdetails',
  templateUrl: './dsar-requestdetails.component.html',
  styleUrls: ['./dsar-requestdetails.component.scss']
})
export class DsarRequestdetailsComponent implements OnInit {
  @ViewChild('toggleDayleftdiv',{static:true}) toggleDayleftdiv: ElementRef;
  @ViewChild('btnDaysLeft',{static:true}) btnDaysLeft: ElementRef; 
  @ViewChild('customDaysInput',{static:false}) customDaysInput: ElementRef;
  requestID: any;
  currentManagedOrgID: any;
  currrentManagedPropID: any;
  currentPropertyName: any;
  requestDetails: any = [];
  active;
  disabled = true;
  ApproverList: any = [];
  selectedApprover: any;
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
  workflowId: any;
  workflowStages: any = [];
  selectedStages: any = [];
  currentStage: any = 1;
  previousStage: any;
  nextStage: any;
  nextTab: any;
  currentStageId: any;
  previousStageId: any;
  formName: any;
  customFields: any;
  quillEditorText: FormGroup;
  quillEditorEmailText: FormGroup;
  emailTemplates: any = [];
  selectedTemplate: any;
  private fb: FormBuilder;
  editorActivityPost: any;
  editorEmailPost: any;
  activityLog: any = [];
  emailLog: any = [];
  isControlDisabled: boolean;
  alertMsg: any;
  alertType: any;
  dismissible = true;
  isOpen = false;
  isActivityLogOpen: boolean;
  isEmailLogOpen: boolean;
  editRequestDetailForm: FormGroup;
  submitted: boolean;
  isRequestDetailFormsubmit: boolean;
  requestDetailsbyId : any;
  subjectTypeById: any = [];
  requestTypeById: any = [];
  customdayslist = [5,10,20,30,40];
  isListVisible: boolean = false;
  customdays: any;
  riskFactorList: any = [];
  countryList: any = [];
  stateList: any = [];
  filteredStateList: any = [];
  country: any;
  reqAcceptingagent: any;
  riskFactorText: any;
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
    private dsarRequestService: DsarRequestService,
    private workflowService: WorkflowService,
    private ccpaDataService: CcpadataService,
    private ccpaFormConfigService: CCPAFormConfigurationService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private renderer2: Renderer2
  ) {
    this.renderer2.listen('window', 'click',(e:Event)=>{
      if(e.target !== this.toggleDayleftdiv.nativeElement && e.target !== this.btnDaysLeft.nativeElement && e.target !== this.customDaysInput.nativeElement){
        this.isListVisible=false;
    }

    });
   }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.requestID = params.get('id');
      console.log(JSON.stringify(params), 'params..');
    });
   
    this.quillEditorText = new FormGroup({
      editor: new FormControl(null)
    });
    this.quillEditorEmailText = new FormGroup({
      dropdownEmailTemplate: new FormControl(null),
      editorEmailMessage: new FormControl(null),
    });
    this.loadActivityLog(this.requestID);
    this.loadEmailLog(this.requestID);
    this.loadEmailTemplate();
    this.isActivityLogOpen = true;
    const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9 ]+$';
    this.editRequestDetailForm = this.formBuilder.group({
      //requestacceptingagent: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      requestacceptingagent: ['', [Validators.required]],
      riskfactor: ['', [Validators.required]],
      approver:   ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]]
    });
    this.getSelectedOrgIDPropertyID();
    
    
    this.loadDataRequestDetails();
    this.getApprover();
    
    this.loadCountryList();
    this.loadStateList();
    this.loadDSARRequestDetailsByID();
    this.preFillData();

  }

  get editRequest() { return this.editRequestDetailForm.controls; }

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
    },(error) => {
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
  });
  }

  backToDSARRequest() {
    this.router.navigate(['privacy/dsar/dsar-requests']);
  }

  loadDataRequestDetails() {
    
    //alert(this.ApproverList['151b7dce-5028-4ad9-bb32-0be1dc423499'].user_name);
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
        this.workflowId = data.response.workflow_id;
        this.reqAcceptingagent = data.response.req_accepting_agent;
        this.riskFactorText = data.response.risk_factor;
        this.getCustomFields(this.customFields);
        this.getWorkflowStages(this.workflowId);
        this.editRequestDetailForm.controls['country'].setValue(this.respCountry);
        this.editRequestDetailForm.controls['state'].setValue(this.respState);
        this.editRequestDetailForm.controls['city'].setValue(this.respCity);
        this.editRequestDetailForm.controls['requestacceptingagent'].setValue(this.reqAcceptingagent);
        this.editRequestDetailForm.controls['riskfactor'].setValue(this.riskFactorText);
      },(error)=>{
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      });
  }

  getApprover() {
    let approverList;
    this.orgService.getOrgTeamMembers(this.currentManagedOrgID).subscribe((data) => {
      const key = 'response';
      approverList = data[key];
      let filterdList = approverList.filter((t)=>t.user_name !== ' ');    
      this.ApproverList = filterdList;
    },(error)=>{
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
    });
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
     console.log(changeEvent,'changeEvent..');
     if(changeEvent.activeId === 1 && changeEvent.nextId === 2) {
       this.isActivityLogOpen = false;
       this.isEmailLogOpen = true;
     } else if(changeEvent.activeId === 2 && changeEvent.nextId === 1) {
     this.isActivityLogOpen = true;
     this.isEmailLogOpen = false;
     } else if(changeEvent.activeId === 3 && changeEvent.nextId === 1) {
      this.isEmailLogOpen = false;
      this.isActivityLogOpen = true;
     } else if(changeEvent.activeId === 3 && changeEvent.nextId === 2){
      this.isEmailLogOpen = true;
      this.isActivityLogOpen = false;
     } else if(changeEvent.activeId === 1 && changeEvent.nextId === 3) {
      this.isActivityLogOpen = false;
      this.isEmailLogOpen = false;
    }  else if(changeEvent.activeId === 2 && changeEvent.nextId === 3) {
      this.isActivityLogOpen = false;
      this.isEmailLogOpen = false;
    }
    
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

  getCustomFields(data: any) {
    
    let updatedObj = [];
    if (data !== undefined) {
      for (let k in data) {

        let value = data[k];
        let key = k.replace('_', ' ');
        let updatedKey = this.capitalizeFirstLetter(key);
        updatedObj[updatedKey] = value;
      }

    }
    return updatedObj;
  }



  capitalizeFirstLetter(key: any) {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  getWorkflowStages(id) {
    ///workflowId
    this.workflowService.getWorkflowById(id).subscribe((data) => {
      if (data.response.length > 0) {
        let respData = data.response[0].workflow_stages;
        this.workflowStages = this.rearrangeArrayResponse(respData);
        this.selectedStages.push(this.workflowStages[0]);
      } else {
        this.alertMsg = 'No records found!';
        this.isOpen = true;
        this.alertType = 'info';
      }
    }, (error) => {
      alert(JSON.stringify(error));
    })
  }

  stageSelection(item) {
    this.currentStage = item.order;

    if (!this.isPreviousStageExist(item)) {
      let idx = this.selectedStages.findIndex((t) => t.order === item.order);
      if (idx === -1) {
        this.selectedStages.push(item);
      }
      this.nextStage = this.selectedStages[this.selectedStages.length - 1].order;
      this.currentStageId = item.id;
      this.previousStageId = this.selectedStages.filter((t) => t.order == item.order - 1)[0].id;
      const diff = this.nextStage - item.order;
      let result;
      diff >= 1 ? result = confirm('do you want to revert steps?') : false;
      if (result) {

        if (diff !== 0) {
          if (this.isPreviousStageSelected(item)) {
            // this.inputData.splice(start, deleteCount, customStageObj);
            if (diff === 1) {
              this.selectedStages.splice(this.selectedStages.length - 1, 1);
              //  this.previousStage = this.selectedStages[this.nextStage - 1].order;
              //  this.previousStageId = this.selectedStages[this.nextStage-1].id;
            } else {
              for (let i = diff; i > 0; i--) {
                this.selectedStages.splice(this.selectedStages.length - i, 1);
              }

            }

          }

        } else {
          return false;
        }

      } else {
        
        const reqObj = {
          current_status: this.currentStageId,
          previous_status: this.previousStageId,
          activity_feedback: this.editorActivityPost
        }
        this.stageAPI(this.requestID, reqObj);
      }

    } else {
        this.alertMsg = 'Can not skip stages!';
        this.isOpen = true;
        this.alertType = 'danger';
        return false;
    }

 
  }

  isStageCompleted(item): boolean {
    if (item !== undefined) {
      return this.selectedStages.some((t) => t.order == item.order);
    }
  }

  isPreviousStageSelected(item): boolean {
    return item.order < this.nextStage;
  }

  isCurrentPreviousStageEqual(item): boolean {
    return this.nextStage == item.order;
  }

  isPreviousStageExist(item): boolean {
    if (item.order !== 1) {
      return this.selectedStages.findIndex((t) => t.order == item.order - 1) === -1;
    }
  }

  rearrangeArrayResponse(dataArray) {
    dataArray.sort((a, b) => {
      return a.order - b.order;
    });
    return dataArray;
  }

  onSubmitActivityPost() {
    const reqObj = {
      current_status: this.currentStageId,
      previous_status: this.previousStageId,
      activity_feedback: this.editorActivityPost
    }
    console.log(reqObj, 'state req..onSubmitActivityPost');
    this.stageAPI(this.requestID, reqObj);
  }

  onSubmitEmailPost(){
    console.log(this.workflowStages[0],'ns..');
    const requestObj = {
      current_status: this.currentStageId || this.workflowStages[0].id,
      email_body: this.quillEditorEmailText.get('editorEmailMessage').value
    }
    console.log(requestObj, 'state req..onSubmitActivityPost');
    this.ccpaDataService.addCCPADataEmailActivity(this.requestID, requestObj).subscribe((data) => {
      if (data) {
        // alert(data.response);
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.loadEmailLog(this.requestID);
      }
    }, (error) => {
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
    })
    
    //this.stageAPI(this.requestID, reqObj);
  }

  stageAPI(requestID, requestObj) {
    this.ccpaDataService.addCCPADataActivity(requestID, requestObj).subscribe((data) => {
      if (data) {
        // alert(data.response);
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.loadActivityLog(requestID);
      }
    }, (error) => {
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
    })
  }

  loadActivityLog(requestID) {
    this.ccpaDataService.getCCPADataActivityLog(requestID).subscribe((data) => {
      this.activityLog = data.response;
    })
  }

  loadEmailLog(requestID){
    this.ccpaDataService.getCCPADataEmailLog(requestID).subscribe((data) => {
      this.emailLog = data.response;
    })
  }

  loadEmailTemplate(){
    this.dsarRequestService.getEmailTemplate().subscribe((data)=>{
      this.emailTemplates = data.response;
    })
  }

  onChangeRequestType(event) {
  //  const dropdownEmailTemplate = event.target.value;
   // this.selectedTemplate = event.target.value;
    this.quillEditorEmailText.controls['editorEmailMessage'].setValue(event.target.value);
  }

  nameInitials(firststr, secondstr) {
    if (firststr !== undefined && secondstr !== undefined) {
      const firstChar = firststr.charAt(0);
      // const spacePos = str.indexOf(' ');
      const secondChar = secondstr.charAt(0);
      return firstChar + secondChar;
    }
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg !== dismissedAlert;
    this.isOpen = false;
  }

  
  editRequestDetailModalPopup(content, data) {
    if (data !== '') {

      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

      }, (reason) => {

      });
    } else {

      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

      }, (reason) => {

      });
    }

  }

  // onRiskfactorChange($event){
  //   this.editRequest.controls['risk_factor'].value = $event.currentTarget.value;
  // }

  updateRequestDetails(){
    this.isRequestDetailFormsubmit = true;
    if(this.editRequestDetailForm.invalid){
      return false;
    } else {
      const obj = {
        req_accepting_agent: this.editRequestDetailForm.controls['requestacceptingagent'].value,
        approver: this.editRequestDetailForm.controls['approver'].value,
        risk_factor:  this.editRequestDetailForm.controls['riskfactor'].value,
        country: this.editRequestDetailForm.controls['country'].value,
        state:  this.editRequestDetailForm.controls['state'].value,
        city:  this.editRequestDetailForm.controls['city'].value      
      }
      console.log(obj,'obj..');
      this.dsarRequestService.updateDSARRequestDetailsByID(this.currentManagedOrgID,this.currrentManagedPropID,this.requestID,obj)
      .subscribe((data)=>{
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.loadDataRequestDetails();
        this.modalService.dismissAll('Canceled');
      },(error)=>{
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      })
    }
    
    
  }

  loadDSARRequestDetailsByID(){
    let approver;
    let currentriskFactor;
    this.dsarRequestService.getDSARRequestDetailsByID(this.currentManagedOrgID,this.currrentManagedPropID,this.requestID)
    .subscribe((data) => {
      this.requestDetailsbyId = data.response;
      this.riskFactorList = data.response.risk_factor;
      approver = data.response.approver;
      this.selectedApprover = approver[0].approver_id;
      this.editRequestDetailForm.controls['approver'].setValue(this.selectedApprover);
    });
    
  }

  toggleBtn(){
    this.isListVisible = !this.isListVisible;
  }

  onClickEndDays(item) {
    console.log(item,'days selected');
    this.isListVisible = false;
    const obj = {
      extend_days: Number(this.respDaysLeft),
      days_left: Number(item)
    }
    this.dsarRequestService.updateDSARRequestDetailsByID(this.currentManagedOrgID,this.currrentManagedPropID,this.requestID,obj)
      .subscribe((data)=>{
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.loadDataRequestDetails();
      },(error)=>{
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      })
  }

  onSubmitEndDays(form:NgForm){
    console.log(this.customdays,'customdays..');
    this.isListVisible = false;
    const obj = {
      extend_days: Number(this.respDaysLeft),
      days_left: Number(this.customdays)
    }
    this.dsarRequestService.updateDSARRequestDetailsByID(this.currentManagedOrgID,this.currrentManagedPropID,this.requestID,obj)
      .subscribe((data)=>{
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.customdays = '';
        this.loadDataRequestDetails();
      },(error)=>{
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      })
  }

  loadCountryList() {
    this.ccpaFormConfigService.getCountryList().subscribe((data) => this.countryList = data);
  }

  loadStateList() {
    this.ccpaFormConfigService.getStateList().subscribe((data) => this.stateList = data);
  }

  onSelectCountry(event: TypeaheadMatch) {   
    this.filteredStateList = [];
    this.filteredStateList = this.stateList.filter((item) => item.country_id == event.item.id);
  }

  onCancelClick(){
    this.isRequestDetailFormsubmit = false;
    this.editRequestDetailForm.reset();
    this.modalService.dismissAll('Canceled');   
  }  
 
  preFillData(){
    this.editRequestDetailForm.controls['country'].setValue(this.respCountry);
    this.editRequestDetailForm.controls['state'].setValue(this.respState);
    this.editRequestDetailForm.controls['city'].setValue(this.respCity);
    this.editRequestDetailForm.controls['requestacceptingagent'].setValue(this.reqAcceptingagent);
  }
}


