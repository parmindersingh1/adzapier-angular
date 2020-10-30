import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from 'src/app/_services';
import { DsarRequestService } from 'src/app/_services/dsar-request.service';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { CcpadataService } from 'src/app/_services/ccpadata.service';
import { CCPAFormConfigurationService } from 'src/app/_services/ccpaform-configuration.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { BsDatepickerConfig, BsDaterangepickerDirective, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TablePaginationConfig } from 'src/app/_models/tablepaginationconfig';
import { moduleName } from '../../../_constant/module-name.constant';
import { formatDate } from '@angular/common';
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
  @ViewChild('filePreview', { static: true }) filePreview: ElementRef;
  @ViewChild('panel', { static: true }) public panel: ElementRef<any>;
  @ViewChild('dp', { static: false }) datepicker: BsDaterangepickerDirective;
  bsConfig: Partial<BsDatepickerConfig>;
  @ViewChild('confirmDeleteTemplate', { static: false }) confirmDeleteModal: TemplateRef<any>;
  confirmationForm: FormGroup;
  modalRef: BsModalRef;
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
  isEmailPostsubmitted: boolean;
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
  paginationConfig: TablePaginationConfig;
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
  base64FileCode: any;
  filePreviewURL: any;
  isEmailVerified = false;
  isAttachmentExist: boolean;
  activitytype: any;
  bsValue: Date;
  subtaskDeadlineDate: Date;
  isconfirmationsubmitted: boolean;
  controlname: string;
  isemailverificationRequired: boolean;
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
              private bsmodalService: BsModalService,
              private loading: NgxUiLoaderService
  ) {
    this.renderer2.listen('window', 'click', (e: Event) => {
      if (e.target !== this.toggleDayleftdiv.nativeElement &&
        e.target !== this.btnDaysLeft.nativeElement && e.target !== this.customDaysInput.nativeElement) {
        this.isListVisible = false;
      }
    });
    this.paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount, id: 'userPagination' };
    this.activitytype = 0; // 0 = private (internal), 1 = public
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.requestID = params.get('id');
    });

    this.quillEditorText = new FormGroup({
      editor: new FormControl('', Validators.required)
    });
    this.quillEditorEmailText = this.formBuilder.group({
      dropdownEmailTemplate: [''],
      editorEmailMessage: ['', [Validators.required]],
      emailAttachment: ['']
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
      deadline: [new Date(), [Validators.required]],
      reminder: [null]
    });

    this.subTaskResponseForm = this.formBuilder.group({
      taskresponse: ['', [Validators.required]],
      markcompleted: ['', [Validators.requiredTrue]],
      uploaddocument: ['']
    });

    this.confirmationForm = this.formBuilder.group({
      userInput: ['', [Validators.required]]
    });

    this.getSelectedOrgIDPropertyID();


    this.loadDataRequestDetails();
    this.getApprover();

    this.loadCountryList();
    this.loadStateList();
    this.loadDSARRequestDetailsByID(this.currentManagedOrgID, this.currrentManagedPropID, this.requestID);
    this.preFillData();
    // this.onChanges();
  }
  get addActivity() { return this.quillEditorText.controls; }
  get addEmailPost() { return this.quillEditorEmailText.controls; }
  get editRequest() { return this.editRequestDetailForm.controls; }
  get addsubTask() { return this.subTaskForm.controls; }
  get subTaskResponse() { return this.subTaskResponseForm.controls; }
  get confirmDelete() { return this.confirmationForm.controls; }
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
    this.dsarRequestService.getDSARRequestDetails(this.currentManagedOrgID, this.currrentManagedPropID, this.requestID,
      this.constructor.name, moduleName.dsarRequestModule)
      .subscribe((data) => {
        console.log(data.response,'resp...');
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
        this.currentWorkflowStage = data.response.workflow_stage || '';
        this.currentWorkflowStageID = data.response.workflow_stage_id || '';
        this.isEmailVerified = data.response.email_verified;
        this.isemailverificationRequired = data.response.required_email_verification;
        this.isAttachmentExist = this.isFileExist(data.response.upload_exist);
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
      approverList = data.response;
      let filterdList = approverList.filter((t) => t.user_name !== ' ');
      this.ApproverList = filterdList;
    }, (error) => {
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
    });
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
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
    this.subtaskDeadlineDate = dt;
    return this.subtaskDeadlineDate;
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
      // tslint:disable-next-line: forin
      for (const k in data) {
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
    this.workflowService.getWorkflowById(this.constructor.name, moduleName.workFlowModule, id).subscribe((data) => {
      if (data.length > 0) {
        const respData = data[0].workflow_stages;
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
      if (!this.isPreviousStageExist(item)) {
        //  this.previousStage = this.selectedStages[this.selectedStages.length - 1].order;
        //  if(item.order > this.previousStage + 1)
        // (this.isStageCompleted(item)) ? true : false;
        const increaseByOne = item.order - this.nextStage;
        if (increaseByOne === 1) {
          const idx = this.selectedStages.findIndex((t) => t.order === item.order);
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
          //  console.log(reqObj, 'stage selection..');
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

  openModal(template: TemplateRef<any>, diff?, item?) {
    this.modalRef = this.bsmodalService.show(template, { class: 'modal-sm' });
    this.stageDiff = diff;
    this.revertedStage = item;
  }

  deleteModal(template: TemplateRef<any>) {
    this.modalRef = this.bsmodalService.show(template, { class: '' });
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
            const stageLength = (this.selectedStages.length - this.stageDiff);

            this.selectedStages.splice(this.selectedStages.length - 1, 1);
            this.previousStageId = this.selectedStages[this.selectedStages.length - 1].id;
            //  this.previousStage = this.selectedStages[this.nextStage - 1].order;
            //  this.previousStageId = this.selectedStages[this.nextStage-1].id;
            const reqObj = {
              current_status: this.previousStageId,
              previous_status: this.currentStageId
            };
            this.stageAPI(this.requestID, reqObj);
            this.getSubTaskList();
          } else {
            this.previousStageId = this.selectedStages[this.selectedStages.length - 1].id;
            for (let i = this.stageDiff; i > 0; i--) {
              this.selectedStages.splice(this.selectedStages.length - i, 1);
            }
            const reqObj = {
              current_status: this.revertedStage.id,
              previous_status: this.previousStageId,
            };
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
      if (this.selectedStages.length === 0) {
        this.alertMsg = 'Stage not selected!';
        this.isOpen = true;
        this.alertType = 'info';
        return false;
      } else {
        const reqObj = {
          current_status: this.selectedStages[this.selectedStages.length - 1].id,
          previous_status: this.previousStageId,
          activity_feedback: this.quillEditorText.get('editor').value // this.editorActivityPost
        };
        Object.keys(reqObj).forEach(key => {
          if (reqObj[key] === undefined) {
            delete reqObj[key];
          }
        });
        this.stageAPI(this.requestID, reqObj);
      }
    }

  }

  onSubmitEmailPost() {
    this.isEmailPostsubmitted = true;
    if (this.quillEditorEmailText.invalid) {
      return false;
    } else {
      const requestObj = {
        current_status: this.currentWorkflowStageID || this.workflowStages[0].id, // this.currentStageId || this.workflowStages[0].id,
        email_body: this.quillEditorEmailText.get('editorEmailMessage').value,
        upload: this.quillEditorEmailText.get('emailAttachment').value
      };

      const fd = new FormData();
      fd.append('current_status', this.currentWorkflowStageID || this.workflowStages[0].id);
      fd.append('email_body', this.quillEditorEmailText.get('editorEmailMessage').value);
      fd.append('upload', this.quillEditorEmailText.get('emailAttachment').value);

      this.ccpaDataService.addCCPADataEmailActivity(this.constructor.name, moduleName.dsarRequestModule,
        this.requestID, fd).subscribe((data) => {
          if (data) {
            // alert(data.response);
            this.alertMsg = data.response;
            this.isOpen = true;
            this.alertType = 'success';
            this.loadEmailLog(this.requestID);
            this.quillEditorEmailText.get('editorEmailMessage').reset();
            this.isEmailPostsubmitted = false;
          }
        }, (error) => {
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
        });
    }
    //this.stageAPI(this.requestID, reqObj);
  }

  stageAPI(requestID, requestObj) {
    // return false;
    this.ccpaDataService.addCCPADataActivity(this.constructor.name, moduleName.dsarRequestModule, this.activitytype,
      requestID, requestObj).subscribe((data) => {
        if (data) {
          this.loadDataRequestDetails();
          this.alertMsg = data.response;
          this.isOpen = true;
          this.alertType = 'success';
          this.loadActivityLog(requestID);
          this.quillEditorText.get('editor').setValue('');
          this.isActivitysubmitted = false;
        }
      }, (error) => {
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      });
  }

  loadActivityLog(requestID) {
    this.paginationConfig.currentPage = 1;
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.ccpaDataService.getCCPADataActivityLog(this.constructor.name, moduleName.dsarRequestModule, this.activitytype,
      requestID, pagelimit).subscribe((data) => {
        this.activityLog = data.response;
      });
  }

  loadEmailLog(requestID) {
    this.ccpaDataService.getCCPADataEmailLog(this.constructor.name, moduleName.dsarRequestModule, requestID).subscribe((data) => {
      this.emailLog = data.response;
    });
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
      this.isAddSubTaskSubmit = false;
      this.subTaskForm.reset();
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        // this.subTaskForm.controls['assignee'].setValue(data.assignee);

      }, (reason) => {

      });
    }

  }

  openResponseModalPopup(content, data?) {

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

  openFilePreviewModalPopup(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

    }, (reason) => {
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
      };
      this.dsarRequestService.updateDSARRequestDetailsByID(this.currentManagedOrgID, this.currrentManagedPropID, this.requestID, obj,
        this.constructor.name, moduleName.dsarRequestModule)
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
        });
    }


  }

  loadDSARRequestDetailsByID(currentManagedOrgID, currrentManagedPropID, requestID) {
    let approver;
    this.dsarRequestService.getDSARRequestDetailsByID(currentManagedOrgID, currrentManagedPropID, requestID,
      this.constructor.name, moduleName.dsarRequestModule)
      .subscribe((data) => {
        if (data) {
          this.requestDetailsbyId = data.response;
          this.riskFactorList = data.response.risk_factor;
          approver = data.response.approver;
          this.selectedApprover = approver[0].approver_id;
          this.editRequestDetailForm.controls['approver'].setValue(this.selectedApprover);
        } else {
          this.alertMsg = data.response;
          this.isOpen = true;
          this.alertType = 'info';
        }
      }, (error) => {
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      });

  }

  toggleBtn() {
    this.isListVisible = !this.isListVisible;
  }

  onClickEndDays(item) {
    this.isListVisible = false;
    const obj = {
      extend_days: Number(this.respDaysLeft),
      days_left: Number(item)
    };
    this.dsarRequestService.updateDSARRequestDetailsByID(this.currentManagedOrgID, this.currrentManagedPropID, this.requestID, obj,
      this.constructor.name, moduleName.dsarRequestModule)
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
    if ((this.customdays <= 0)) {
      this.alertMsg = 'Negative numbers are not allowed!';
      this.isOpen = true;
      this.alertType = 'danger';
      return false;
    }
    this.isListVisible = false;
    const obj = {
      extend_days: Number(this.respDaysLeft),
      days_left: Number(this.customdays)
    };
    this.dsarRequestService.updateDSARRequestDetailsByID(this.currentManagedOrgID, this.currrentManagedPropID,
      this.requestID, obj, this.constructor.name, moduleName.dsarRequestModule)
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
      });
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
    this.ccpaDataService.getCCPADataActivityLog(this.constructor.name, moduleName.dsarRequestModule, this.activitytype,
      this.requestID, pagelimit).subscribe((data) => {
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
        required: this.subTaskForm.controls['issubtaskrequired'].value == null ? false : true,
        deadline: new Date(this.subTaskForm.controls['deadline'].value).toJSON(),
        reminder: (this.subTaskForm.controls['reminder'].value !== null) ?
          new Date(this.subTaskForm.controls['reminder'].value).toJSON() : null
      };
      
      const currentStageID = this.currentStageId ? this.currentStageId : this.currentWorkflowStageID;
      if (!this.isEditSubTask) {
        this.dsarRequestService.addSubTask(this.requestID, currentStageID, obj, this.constructor.name, moduleName.dsarRequestModule)
          .subscribe((data) => {
            this.alertMsg = data.response;
            this.isOpen = true;
            this.alertType = 'success';
            this.onResetSubTask();
            this.getSubTaskList();
          }, (error) => {
            this.onResetSubTask();
            this.alertMsg = error;
            this.isOpen = true;
            this.alertType = 'danger';
          });
      } else { // update sub task
        this.dsarRequestService.updateSubTask(this.selectedTaskID, obj, this.constructor.name, moduleName.dsarRequestModule)
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
      }
    }
  }

  onResetSubTask() {
    this.isAddSubTaskSubmit = false;
    this.subTaskForm.reset();
    this.modalService.dismissAll('Canceled');
  }

  isInvalidDate(event) {
    const test = event.target.value;
    if (test === 'Invalid date') {
      event.target.value = formatDate(new Date(), 'MM/dd/yyyy', 'en'); // Change it here
    }
  }


  uploadFile(event, tag) {
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
        if (tag !== 'email') {
          this.uploadFilename = file.name;
          this.subTaskResponseForm.get('uploaddocument').setValue(file);
        } else {
          this.uploadFilename = file.name;
          this.quillEditorEmailText.get('emailAttachment').setValue(file);
        }

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
      this.dsarRequestService.addSubTaskResponse(this.selectedTaskID, fd, this.constructor.name, moduleName.dsarRequestModule)
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
      const workfloworder = this.workflowStages.filter((t) => t.id === id);
      // console.log(workfloworder[0].order,'workfloworder..');
      const x = this.workflowStages.slice(0, workfloworder[0].order);
      this.selectedStages = x;
    }
  }



  getSubTaskList() {
    let currentStageID;
    if (this.selectedStages.length >= 1) {
      currentStageID = this.getWorkflowStageID(this.selectedStages);
    } else {
      currentStageID = this.currentStageId ? this.currentStageId : this.currentWorkflowStageID;
    }
    //  return false;
    if (currentStageID) {
      let resp;
      this.dsarRequestService.getSubTaskByWorkflowID(this.requestID, currentStageID, this.constructor.name, moduleName.dsarRequestModule)
        .subscribe((data) => {
          return this.subTaskListResponse = data;
        }, (error) => {
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
        });

    } else {
      this.alertMsg = 'Stage not selected!';
      this.isOpen = true;
      this.alertType = 'info';
    }
  }

  getWorkflowStageID(array) {
    const workflowID = [];
    array.forEach(element => {
      workflowID.push(element.id);
    });
    // for (const key of array) {
    //   if (key === 'id') {
    //     workflowID.push(array[key]);
    //   }
    // }
    return workflowID;
  }

  getStagename(stageid): string {
    const stage = this.workflowStages.filter((e) => e.id === stageid);
    return stage[0].stage_title;
  }


  onValueChange(value: Date): void {
      this.minDate = new Date();
      this.maxDate = new Date(value);
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

  onCancelFilePreview() {
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

  viewFile() {
    this.loading.start();
    let ext;
    let documentType;
    this.dsarRequestService.viewUserUploadedFile(this.requestID, this.constructor.name, moduleName.dsarRequestModule).subscribe((data) => {
      this.loading.stop();
      if (data) {
        this.base64FileCode = data.upload;
        ext = data.upload_ext;
        documentType = this.changeFileType(ext);
        const blob = new Blob([this._base64ToArrayBuffer(this.base64FileCode)], {
          type: documentType // type: 'application/pdf',
        });
        const url = URL.createObjectURL(blob);
        return window.open(url, 'iframeFilepreview');
      }
    }, (error) => {
      this.loading.stop();
    });

  }

  changeFileType(ext) {
    let fileType;
    switch (ext) {
      case 'txt':
        return fileType = 'text/plain';
      case 'pdf':
        return fileType = 'application/pdf';
      case 'doc':
        return fileType = 'application/msword';
      case 'docx':
        return fileType = 'application/msword';
      case 'csv':
        return fileType = 'text/csv';
      case 'png':
        return fileType = 'image/png';
      case 'jpg':
        return fileType = 'image/jpg';
      case 'jpeg':
        return fileType = 'image/jpeg';
    }
  }


  _base64ToArrayBuffer(testbase64) {
    const binarystring = window.atob(testbase64);
    const len = binarystring.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binarystring.charCodeAt(i);
    }
    return bytes.buffer;
  }

  isCustomFieldEmail(key, isEmailVerified): boolean {
    return key === 'Email' && !isEmailVerified;
  }

  isEmailIDVerified(key, isEmailVerified): boolean {
    return key === 'Email' && isEmailVerified;
  }

  isFileExist(uploadexist): boolean {
    return uploadexist !== '';
  }

  verifyUserEmailID() {
    this.dsarRequestService.verifyClientEmailID(this.requestID, this.constructor.name, moduleName.dsarRequestModule).subscribe((data) => {
      this.alertMsg = data.response;
      this.isOpen = true;
      this.alertType = 'success';
    }, (err) => {
      this.alertMsg = 'error';
      this.isOpen = true;
      this.alertType = 'danger';
    });
  }

  public onPreviousSearchPosition(): void {
    this.panel.nativeElement.scrollLeft -= 150;
  }

  public onNextSearchPosition(): void {
    this.panel.nativeElement.scrollLeft += 150;
  }

  removeDSARRequest(control: string) {
    this.controlname = control;
    this.deleteModal(this.confirmDeleteModal);
  }

  deleteDSARRequest() {
    this.ccpaDataService.deleteDSARRequestByID(this.constructor.name, moduleName.dsarRequestModule, this.currentManagedOrgID,
      this.currrentManagedPropID, this.requestID).subscribe((data) => {
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
      }, (err) => {
        this.alertMsg = 'error';
        this.isOpen = true;
        this.alertType = 'danger';
      });
  }

  onCheckboxChange($event) {
    console.log($event);
  }

  cancelModal() {
    this.modalRef.hide();
    this.confirmationForm.reset();
    this.isconfirmationsubmitted = false;
    return false;
  }


  showControlContent(): string {
    if (this.controlname === 'DSAR Request detail') {
      return  this.requestID;
    }
  }

  confirmDeleteDSARRequest() {
    this.modalRef.hide();
    this.deleteDSARRequest();
  }

  onSubmitConfirmation(selectedaction) {
    this.isconfirmationsubmitted = true;
    if (this.confirmationForm.invalid) {
      return false;
    } else {
      const userInput = this.confirmationForm.value.userInput;
      if (userInput === 'Delete') {
         if (selectedaction === 'DSAR Request detail') {
          this.confirmDeleteDSARRequest();
        }
      } else {
        // this.confirmationForm.reset();
        // this.isconfirmationsubmitted = false;
        return false;
      }
    }
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
