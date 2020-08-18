import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from 'src/app/_services';
import { DsarRequestService } from 'src/app/_services/dsar-request.service';
import { NgbNavChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { CcpadataService } from 'src/app/_services/ccpadata.service';
import { CCPAFormConfigurationService } from 'src/app/_services/ccpaform-configuration.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dsar-requestdetails',
  templateUrl: './dsar-requestdetails.component.html',
  styleUrls: ['./dsar-requestdetails.component.scss']
})
export class DsarRequestdetailsComponent implements OnInit {
  @ViewChild('toggleDayleftdiv', { static: true }) toggleDayleftdiv: ElementRef;
  @ViewChild('btnDaysLeft', { static: true }) btnDaysLeft: ElementRef;
  @ViewChild('customDaysInput', { static: false }) customDaysInput: ElementRef;
  @ViewChild('confirmTemplate', { static: false }) confirmModal: TemplateRef<any>;
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
  currentWorkflowStage: any;
  currentWorkflowStageID: any;
  currentStage: any;
  previousStage: any;
  nextStage: any;
  nextTab: any;
  currentStageId: any;
  previousStageId: any;
  iscurrentStageSelected: any;
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
  subTaskForm: FormGroup;
  subTaskResponseForm: FormGroup;
  submitted: boolean;
  isActivitysubmitted: boolean;
  isRequestDetailFormsubmit: boolean;
  isResponseSubmitted: boolean;
  requestDetailsbyId: any;
  subjectTypeById: any = [];
  requestTypeById: any = [];
  customdayslist = [5, 10, 20, 30, 40];
  isListVisible: boolean = false;
  customdays: any;
  riskFactorList: any = [];
  countryList: any = [];
  stateList: any = [];
  filteredStateList: any = [];
  country: any;
  reqAcceptingagent: any;
  riskFactorText: any;
  p: number = 1;
  pageSize: any = 5;
  totalCount: any;
  minDate: Date;
  maxDate: Date;
  uploadFilename: any;
  selectedAssignee: any;
  isEditSubTask: boolean = false;
  isResponseToSubTask: boolean = false;
  selectedTaskID: any;
  isDisable: boolean = true;
  paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount, id: 'userPagination' };
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
  isConfirmed: boolean;
  stageDiff: number;
  revertedStage: any;
  status: number = 0;
  modalRef: BsModalRef;
  subTaskList$: Observable<any[]>;
  subTaskListResponse: any = [];
  isTaskTabOpen: boolean = false;
  isAddSubTaskSubmit: boolean = false;
  today: Date;
  displayAssignee: any;
  displayTaskDescription: any;
  displayTaskname: any;
  displayTaskDeadline: string;
  showFilesizeerror: boolean = false;
  showFileExtnerror: boolean = false;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private orgService: OrganizationService,
    private dsarRequestService: DsarRequestService,
    private workflowService: WorkflowService,
    private ccpaDataService: CcpadataService,
    private ccpaFormConfigService: CCPAFormConfigurationService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private renderer2: Renderer2,
    private bsmodalService: BsModalService
  ) {
    this.renderer2.listen('window', 'click', (e: Event) => {
      if (e.target !== this.toggleDayleftdiv.nativeElement && e.target !== this.btnDaysLeft.nativeElement && e.target !== this.customDaysInput.nativeElement) {
        this.isListVisible = false;
      }
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.requestID = params.get('id');
      console.log(JSON.stringify(params), 'params..');
    });

    this.quillEditorText = new FormGroup({
      editor: new FormControl('', Validators.required)
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
      approver: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]]
    });

    this.subTaskForm = this.formBuilder.group({
      assignee: ['', [Validators.required]],
      subtaskname: ['', [Validators.required]],
      subtaskdescription: ['', [Validators.required]],
      issubtaskrequired: [''],
      deadline: ['', [Validators.required]],
      reminder: ['']
    });

    this.subTaskResponseForm = this.formBuilder.group({
      taskresponse: ['', [Validators.required]],
      markcompleted: [''],
      uploaddocument: ['']
    });

    this.getSelectedOrgIDPropertyID();


    this.loadDataRequestDetails();
    this.getApprover();

    this.loadCountryList();
    this.loadStateList();
    this.loadDSARRequestDetailsByID();
    this.preFillData();
    // this.onChanges();
  }
  get addActivity() { return this.quillEditorText.controls; }
  get editRequest() { return this.editRequestDetailForm.controls; }
  get addsubTask() { return this.subTaskForm.controls; }
  get subTaskResponse() { return this.subTaskResponseForm.controls; }

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
    }, (error) => {
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
        //   console.log(data.response,'resp...');
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
        this.currentWorkflowStage = data.response.workflow_stage;
        this.currentWorkflowStageID = data.response.workflow_stage_id;
        this.getCustomFields(this.customFields);
        this.getWorkflowStages(this.workflowId);
        //        this.selectStageOnPageLoad(this.currentWorkflowStageID);

        this.editRequestDetailForm.controls['country'].setValue(this.respCountry);
        this.editRequestDetailForm.controls['state'].setValue(this.respState);
        this.editRequestDetailForm.controls['city'].setValue(this.respCity);
        this.editRequestDetailForm.controls['requestacceptingagent'].setValue(this.reqAcceptingagent);
        this.editRequestDetailForm.controls['riskfactor'].setValue(this.riskFactorText);
      }, (error) => {
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
      let filterdList = approverList.filter((t) => t.user_name !== ' ');
      this.ApproverList = filterdList;
    }, (error) => {
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
    });
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    console.log(changeEvent, 'changeEvent..');
    if (changeEvent.activeId === 1 && changeEvent.nextId === 2) {
      this.isActivityLogOpen = false;
      this.isEmailLogOpen = true;
      this.isTaskTabOpen = false;
    } else if (changeEvent.activeId === 2 && changeEvent.nextId === 1) {
      this.isActivityLogOpen = true;
      this.isEmailLogOpen = false;
      this.isTaskTabOpen = false;
    } else if (changeEvent.activeId === 3 && changeEvent.nextId === 1) {
      this.isEmailLogOpen = false;
      this.isActivityLogOpen = true;
      this.isTaskTabOpen = false;
    } else if (changeEvent.activeId === 3 && changeEvent.nextId === 2) {
      this.isEmailLogOpen = true;
      this.isActivityLogOpen = false;
      this.isTaskTabOpen = false;
    } else if (changeEvent.activeId === 1 && changeEvent.nextId === 3) {
      this.isActivityLogOpen = false;
      this.isEmailLogOpen = false;
      this.isTaskTabOpen = true;
      this.getSubTaskList();
    } else if (changeEvent.activeId === 2 && changeEvent.nextId === 3) {
      this.isActivityLogOpen = false;
      this.isEmailLogOpen = false;
      this.isTaskTabOpen = true;
      this.getSubTaskList();
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
        // this.selectedStages.push(this.workflowStages[0]);
        this.selectStageOnPageLoad(this.currentWorkflowStageID);
        this.getSubTaskList();
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
    // this.getSubTaskList();
    this.currentStage = item.order;
    if (this.isSubTaskExist(item)) {
      if (this.selectedStages.length == 0) {
        this.nextStage = 0;
      } else {
        this.nextStage = this.selectedStages[this.selectedStages.length - 1].order
      }
      console.log(this.isPreviousStageExist(item), 'this.isPreviousStageExist(item)..');
      if (!this.isPreviousStageExist(item)) {
        //  this.previousStage = this.selectedStages[this.selectedStages.length - 1].order;
        //  if(item.order > this.previousStage + 1)
        // (this.isStageCompleted(item)) ? true : false;
        const increaseByOne = item.order - this.nextStage;
        if (increaseByOne == 1) {
          let idx = this.selectedStages.findIndex((t) => t.order === item.order);
          if (idx === -1) {
            this.selectedStages.push(item);
          }
          // this.iscurrentStageSelected = this.isStageCompleted(item);
          this.nextStage = this.selectedStages[this.selectedStages.length - 1].order;
          this.currentStageId = item.id;
          if (item.order !== 1) {
            this.previousStageId = this.selectedStages.filter((t) => t.order == item.order - 1)[0].id;
          }
          let reqObj;
          if (this.previousStageId) {
            reqObj = {
              current_status: this.currentStageId,
              previous_status: this.previousStageId
            };
          } else {
            reqObj = {
              current_status: this.currentStageId
            };
          }
          // const reqObj = {
          //   current_status: this.currentStageId,
          //   previous_status: this.previousStageId ? this.previousStageId : this.previousStageId = ''
          // }
          console.log(reqObj, 'stage selection..');
          this.stageAPI(this.requestID, reqObj);
          // this.getSubTaskList();
        } else {
          this.alertMsg = 'Can not skip stages!';
          this.isOpen = true;
          this.alertType = 'danger';
          return false;
        }


      } else if (this.isPreviousStageSelected(item)) {
        const diff = this.nextStage - item.order;
        this.openModal(this.confirmModal, diff, item);
      }
    } else {
      this.alertMsg = 'Without completing subtask can not switch to other stage';
      this.isOpen = true;
      this.alertType = 'danger';
      return false;
    }


  }

  openModal(template: TemplateRef<any>, diff, item) {
    this.modalRef = this.bsmodalService.show(template, { class: 'modal-sm' });
    this.stageDiff = diff;
    this.revertedStage = item;
  }

  confirm() {
    this.modalRef.hide();
    this.isConfirmed = true;
    if (this.isConfirmed) {
      // alert(result);
      if (this.stageDiff !== 0) {
        if (this.isPreviousStageSelected(this.revertedStage)) {
          // this.inputData.splice(start, deleteCount, customStageObj);
          if (this.stageDiff === 1) {
            this.previousStageId = this.selectedStages[this.selectedStages.length - 1].id
            this.selectedStages.splice(this.selectedStages.length - 1, 1);
            //  this.previousStage = this.selectedStages[this.nextStage - 1].order;
            //  this.previousStageId = this.selectedStages[this.nextStage-1].id;
            const reqObj = {
              current_status: this.currentStageId,
              previous_status: this.previousStageId,
            }
            console.log(reqObj, 'conf..');
            this.stageAPI(this.requestID, reqObj);
            this.getSubTaskList();
          } else {
            this.previousStageId = this.selectedStages[this.selectedStages.length - 1].id
            for (let i = this.stageDiff; i > 0; i--) {
              this.selectedStages.splice(this.selectedStages.length - i, 1);
            }
            const reqObj = {
              current_status: this.revertedStage.id,
              previous_status: this.previousStageId,
            }
            console.log(reqObj, 'else conf..');
            this.stageAPI(this.requestID, reqObj);
            this.getSubTaskList();
          }

        }

      } else {
        return false;
      }

    } else {

      const reqObj = {
        current_status: this.currentStageId,
        previous_status: this.previousStageId,
        activity_feedback: this.quillEditorText.get('editor').value //this.editorActivityPost
      }
      this.stageAPI(this.requestID, reqObj);
    }
  }

  decline(): void {
    this.isConfirmed = false;
    this.modalRef.hide();
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
    return this.nextStage === item.order;
  }

  isPreviousStageExist(item): boolean {
    //  if (item.order !== 1) {
    return this.selectedStages.some((t) => t.order == item.order);
    // }
  }

  isNextStageExist(item): boolean {
    //  item.order  > this.selectedStages.filter((t) => t.order === item.order);
    return this.selectedStages.findIndex((t) => t.order == item.order) === -1;
  }

  isSubTaskExist(stage): boolean {


    if (this.subTaskListResponse[0] !== undefined && this.subTaskListResponse.length !== 0) {
      const lastStage = this.selectedStages[this.selectedStages.length - 1];
      //  const matchStage = this.selectedStages.some((t) => t.id === stage.id);
      const isSubTaskCompleted = this.subTaskListResponse.some((t) => t.workflow_stage === lastStage.id &&
        t.mark_completed === false && t.required === true);
      // const isSubTaskCompleted = this.subTaskListResponse.some((t) => t.mark_completed === true && t.required === true
      //   && t.workflow_stage === stage.id);
      // const isSubTaskRequired = this.subTaskListResponse.some((t) => t.required === true);
      //  if (matchStage) {
      if (isSubTaskCompleted) {
        return false;
      } else {
        return true; // if selected stage subtask is already completed
      }
      //  } 
      // else {
      //   return true;
      // }
    } else if (this.subTaskListResponse.length === 0) {
      return true;
    }
  }

  rearrangeArrayResponse(dataArray) {
    dataArray.sort((a, b) => {
      return a.order - b.order;
    });
    return dataArray;
  }

  onSubmitActivityPost() {
    //this.selectedStages[this.selectedStages.length - 1].id
    this.isActivitysubmitted = true;
    if (this.quillEditorText.invalid) {
      return false;
    } else {
      //  console.log(this.selectedStages[this.selectedStages.length - 1].id);
      const reqObj = {
        current_status: this.currentStageId !== undefined ? this.currentStageId : this.workflowStages[this.workflowStages.length - 1].id,
        previous_status: this.previousStageId,
        activity_feedback: this.quillEditorText.get('editor').value //this.editorActivityPost
      };
      Object.keys(reqObj).forEach(key => {
        if (reqObj[key] === undefined) {
          delete reqObj[key];
        }
      });
      console.log(reqObj, 'state req..onSubmitActivityPost');
      //  return false;
      this.stageAPI(this.requestID, reqObj);
    }

  }

  onSubmitEmailPost() {
    console.log(this.workflowStages[0], 'ns..');
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
    // return false;
    this.ccpaDataService.addCCPADataActivity(requestID, requestObj).subscribe((data) => {
      if (data) {
        this.loadDataRequestDetails();
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
    this.paginationConfig.currentPage = 1;
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.ccpaDataService.getCCPADataActivityLog(requestID, pagelimit).subscribe((data) => {
      this.activityLog = data.response;
    })
  }

  loadEmailLog(requestID) {
    this.ccpaDataService.getCCPADataEmailLog(requestID).subscribe((data) => {
      this.emailLog = data.response;
    })
  }

  loadEmailTemplate() {
    this.dsarRequestService.getEmailTemplate().subscribe((data) => {
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


  openModalPopup(content, data) {
    if (data !== '') {
      this.isResponseToSubTask = false;
      this.isEditSubTask = true;
      this.selectedTaskID = data.id;
      this.selectedAssignee = data.assignee;
      this.subTaskForm.controls['subtaskname'].setValue(data.name);
      this.subTaskForm.controls['subtaskdescription'].setValue(data.description);
      this.subTaskForm.controls['issubtaskrequired'].setValue(data.required);
      this.subTaskForm.controls['deadline'].setValue(new Date(data.deadline));
      data.reminder !== null ? this.subTaskForm.controls['reminder'].setValue(new Date(data.reminder)) :
      this.subTaskForm.controls['reminder'].setValue('');
      this.subTaskForm.controls['assignee'].setValue(this.selectedAssignee);

      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

      }, (reason) => {
        this.subTaskForm.reset();
      });
    } else {
      this.isEditSubTask = false;
      this.selectedAssignee = '';
      this.onResetSubTask();
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        // this.subTaskForm.controls['assignee'].setValue(data.assignee);

      }, (reason) => {

      });
    }

  }

  openResponseModalPopup(content, data) {

    this.isResponseToSubTask = false;
    // this.isEditSubTask = true;
    this.selectedTaskID = data.id;

    this.displayTaskDescription = data.description;
    this.displayTaskname = data.name; //data.deadline
    this.displayTaskDeadline = data.deadline;
    // displayTaskname
    // this.selectedAssignee = data.assignee;
    // this.subTaskForm.controls['subtaskname'].setValue(data.name);
    // this.subTaskForm.controls['subtaskdescription'].setValue(data.description);
    // this.subTaskForm.controls['issubtaskrequired'].setValue(data.required);
    // this.subTaskForm.controls['deadline'].setValue(new Date(data.deadline));
    // this.subTaskForm.controls['reminder'].setValue(new Date(data.reminder));
    // this.subTaskForm.controls['assignee'].setValue(this.selectedAssignee);

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

    }, (reason) => {
      this.subTaskResponseForm.reset();
    });
  }


  // onRiskfactorChange($event){
  //   this.editRequest.controls['risk_factor'].value = $event.currentTarget.value;
  // }

  updateRequestDetails() {
    this.isRequestDetailFormsubmit = true;
    if (this.editRequestDetailForm.invalid) {
      return false;
    } else {
      const obj = {
        req_accepting_agent: this.editRequestDetailForm.controls['requestacceptingagent'].value,
        approver: this.editRequestDetailForm.controls['approver'].value,
        risk_factor: this.editRequestDetailForm.controls['riskfactor'].value,
        country: this.editRequestDetailForm.controls['country'].value,
        state: this.editRequestDetailForm.controls['state'].value,
        city: this.editRequestDetailForm.controls['city'].value
      }
      console.log(obj, 'obj..');
      this.dsarRequestService.updateDSARRequestDetailsByID(this.currentManagedOrgID, this.currrentManagedPropID, this.requestID, obj)
        .subscribe((data) => {
          this.alertMsg = data.response;
          this.isOpen = true;
          this.alertType = 'success';
          this.loadDataRequestDetails();
          this.modalService.dismissAll('Canceled');
        }, (error) => {
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
        })
    }


  }

  loadDSARRequestDetailsByID() {
    let approver;
    let currentriskFactor;
    this.dsarRequestService.getDSARRequestDetailsByID(this.currentManagedOrgID, this.currrentManagedPropID, this.requestID)
      .subscribe((data) => {
        this.requestDetailsbyId = data.response;
        this.riskFactorList = data.response.risk_factor;
        approver = data.response.approver;
        this.selectedApprover = approver[0].approver_id;
        this.editRequestDetailForm.controls['approver'].setValue(this.selectedApprover);
      });

  }

  toggleBtn() {
    this.isListVisible = !this.isListVisible;
  }

  onClickEndDays(item) {
    console.log(item, 'days selected');
    this.isListVisible = false;
    const obj = {
      extend_days: Number(this.respDaysLeft),
      days_left: Number(item)
    }
    this.dsarRequestService.updateDSARRequestDetailsByID(this.currentManagedOrgID, this.currrentManagedPropID, this.requestID, obj)
      .subscribe((data) => {
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.loadDataRequestDetails();
      }, (error) => {
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      })
  }

  onSubmitEndDays(form: NgForm) {
    console.log(this.customdays, 'customdays..');
    this.isListVisible = false;
    const obj = {
      extend_days: Number(this.respDaysLeft),
      days_left: Number(this.customdays)
    }
    this.dsarRequestService.updateDSARRequestDetailsByID(this.currentManagedOrgID, this.currrentManagedPropID, this.requestID, obj)
      .subscribe((data) => {
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.customdays = '';
        this.loadDataRequestDetails();
      }, (error) => {
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

  onCancelClick() {
    this.isRequestDetailFormsubmit = false;
    this.modalService.dismissAll('Canceled');
  }

  preFillData() {
    this.editRequestDetailForm.controls['country'].setValue(this.respCountry);
    this.editRequestDetailForm.controls['state'].setValue(this.respState);
    this.editRequestDetailForm.controls['city'].setValue(this.respCity);
    this.editRequestDetailForm.controls['requestacceptingagent'].setValue(this.reqAcceptingagent);
  }

  pageChangeEvent(event) {
    this.paginationConfig.currentPage = event;
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.ccpaDataService.getCCPADataActivityLog(this.requestID, pagelimit).subscribe((data) => {
      this.activityLog = data.response;
      if (data.response.length !== 0) {
        this.activityLog = data.response;
      } else {
        this.alertMsg = 'No record found';
        this.isOpen = true;
        this.alertType = 'info';
      }
    }, (err) => {
      this.alertMsg = err;
      this.isOpen = true;
      this.alertType = 'danger';
    });
  }

  onSubmitAddSubTask() {
    this.isAddSubTaskSubmit = true;
    if (this.subTaskForm.invalid) {
      return false;
    } else {
      const obj = {
        assignee: this.subTaskForm.controls['assignee'].value,
        name: this.subTaskForm.controls['subtaskname'].value,
        description: this.subTaskForm.controls['subtaskdescription'].value,
        required: this.subTaskForm.controls['issubtaskrequired'].value || false,
        deadline: new Date(this.subTaskForm.controls['deadline'].value).toJSON(),
        reminder: (this.subTaskForm.controls['reminder'].value !== null) ?
                  new Date(this.subTaskForm.controls['reminder'].value).toJSON() : null
      };

      console.log(obj, 'obj..', this.currentStageId, 'currentStageId..');
      const currentStageID = this.currentStageId ? this.currentStageId : this.currentWorkflowStageID;
      if (!this.isEditSubTask) {
        this.dsarRequestService.addSubTask(this.requestID, currentStageID, obj)
          .subscribe((data) => {
            this.alertMsg = data.response;
            this.isOpen = true;
            this.alertType = 'success';
            this.getSubTaskList();
            this.onResetSubTask();
          }, (error) => {
            this.alertMsg = error;
            this.isOpen = true;
            this.alertType = 'danger';
            this.onResetSubTask();
           });
      } else { // update sub task
        this.dsarRequestService.updateSubTask(this.selectedTaskID, obj)
          .subscribe((data) => {
            this.alertMsg = data.response;
            this.isOpen = true;
            this.alertType = 'success';
            this.getSubTaskList();
            this.onResetSubTask();
          }, (error) => {
            this.alertMsg = error;
            this.isOpen = true;
            this.alertType = 'danger';
            this.onResetSubTask();
          })
      }
    }
  }

  onResetSubTask() {
    this.isAddSubTaskSubmit = false;
    this.subTaskForm.reset();
    this.modalService.dismissAll('Canceled');
  }

  uploadFile(event) {
    console.log(event, 'event..');
    const fileExtArray = ['pdf', 'txt', 'jpeg', 'jpg', 'png', 'doc', 'docx', 'csv', 'xls'];
    // if (event.target.files.length > 0) {
    if (event.target.files[0].size > (2 * 1024 * 1024)) {
      this.showFilesizeerror = true;
      return false;
    } else {
      let fileExtn = event.target.files[0].name.split('.').pop();
      if (fileExtArray.some((t) => t == fileExtn)) {
        this.showFilesizeerror = false;
        this.showFileExtnerror = false;
        const file = event.target.files[0];
        this.uploadFilename = file.name;
        this.subTaskResponseForm.get('uploaddocument').setValue(file);
      } else {
        this.showFileExtnerror = true;
      }

    }

    // }
  }

  onSubmitSubTaskResponse() {
    this.isResponseSubmitted = true;
    if (this.subTaskResponseForm.invalid) {
      return false;
    } else {
      const fd = new FormData();
      fd.append('task_response', this.subTaskResponseForm.get('taskresponse').value);
      fd.append('mark_completed', this.subTaskResponseForm.get('markcompleted').value);
      fd.append('upload', this.subTaskResponseForm.get('uploaddocument').value);

    //  return false;
      this.dsarRequestService.addSubTaskResponse(this.selectedTaskID, fd)
        .subscribe((data) => {
          this.alertMsg = data.response;
          this.isOpen = true;
          this.alertType = 'success';
          this.getSubTaskList();
          this.onCancelSubTaskResponse();
        }, (error) => {
          this.alertMsg = JSON.stringify(error);
          this.isOpen = true;
          this.alertType = 'danger';
          this.onCancelSubTaskResponse();
        });
    }
  }


  selectStageOnPageLoad(id) {
    if (id) {
      let workfloworder = this.workflowStages.filter((t) => t.id === id);
      // console.log(workfloworder[0].order,'workfloworder..');
      const x = this.workflowStages.slice(0, workfloworder[0].order);
      console.log(x, 'x..order..');
      this.selectedStages = x;
    }
  }



  getSubTaskList() {
    const currentStageID = this.currentStageId ? this.currentStageId : this.currentWorkflowStageID;
    if (currentStageID) {
      let resp;
      this.dsarRequestService.getSubTask(this.requestID, currentStageID).subscribe((data) => {
        return this.subTaskListResponse = data.response;
      });
      
    } else {
      this.alertMsg = 'Stage not selected!';
      this.isOpen = true;
      this.alertType = 'info';
    }
  }

  getStagename(stageid): string {
    const stage = this.workflowStages.filter((e) => e.id === stageid);
    return stage[0].stage_title;
  }


  onValueChange(value: Date): void {
    this.minDate = new Date();
    this.maxDate = new Date(value);
    console.log(this.minDate.getDate());
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate());
  }

  displayApproverName(id): string {
    let approverName = this.ApproverList.filter((t) => t.approver_id = id);
    return this.displayAssignee = approverName[0].user_name;
  }

  onCancelSubTaskResponse() {
    this.isResponseSubmitted = false;
    this.uploadFilename = '';
    this.subTaskResponseForm.reset();
    this.modalService.dismissAll('Canceled');
  }

  onChanges() {
    this.subTaskResponseForm.get('taskresponse').valueChanges.subscribe((data) => {
      if (data !== '') {
        this.subTaskResponseForm.get('markcompleted').enable();
      } else {
        this.subTaskResponseForm.get('markcompleted').disable();
      }
    });
  }

}


interface SubTaskList {

  active: boolean;
  assignee: any;
  cdid: any;
  cid: any;
  created_at: string;
  deadline: string;
  description: string;
  email_send: string;
  id: any;
  mark_completed: boolean;
  name: string;
  reminder: string;
  required: boolean;
  send_email: boolean;
  task_response: string;
  uid: any;
  updated_at: string;
  upload: string;
  workflow: string;
  workflow_stage: string;

}