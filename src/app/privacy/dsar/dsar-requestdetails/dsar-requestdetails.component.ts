import {
  Component, OnInit, ViewChild, ElementRef, Renderer2, TemplateRef, AfterViewInit, AfterViewChecked, AfterContentChecked,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, OrganizationService, UserService } from 'src/app/_services';
import { DsarRequestService } from 'src/app/_services/dsar-request.service';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { CcpadataService } from 'src/app/_services/ccpadata.service';
import { CCPAFormConfigurationService } from 'src/app/_services/ccpaform-configuration.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TablePaginationConfig } from 'src/app/_models/tablepaginationconfig';
import { moduleName } from '../../../_constant/module-name.constant';
import { formatDate } from '@angular/common';
import {SystemIntegrationService} from '../../../_services/system_integration.service';
@Component({
  selector: 'app-dsar-requestdetails',
  templateUrl: './dsar-requestdetails.component.html',
  styleUrls: ['./dsar-requestdetails.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default

})
export class DsarRequestdetailsComponent implements  AfterViewInit, AfterViewChecked, AfterContentChecked, OnInit {
  @ViewChild('toggleDayleftdiv', { static: true }) toggleDayleftdiv: ElementRef;
  // @ViewChild('btnDaysLeft', { static: true }) btnDaysLeft: ElementRef;
  @ViewChild('customDaysInput') customDaysInput: ElementRef;
  @ViewChild('confirmTemplate') confirmModal: TemplateRef<any>;
  @ViewChild('filePreview', { static: true }) filePreview: ElementRef;
  @ViewChild('panel', { static: true }) public panel: ElementRef<any>;
  @ViewChild('workflowStageScroller', { read: ElementRef }) public workflowStageScroller: ElementRef<any>;
  @ViewChild('confirmDeleteTemplate') confirmDeleteModal: TemplateRef<any>;
  @ViewChild('extendDays', { static: true }) extendDaysModal: TemplateRef<any>;
  @ViewChild('rejectRequest', { static: true }) rejectRequestModal: TemplateRef<any>;
  // @ViewChild('subTaskForm', null) subTaskTempForm: NgForm;
  @ViewChild('userAuthenticationAlert') userAuthenticationModal: TemplateRef<any>;
  @ViewChild('duplicateRequestModal') duplicateRequestModal: TemplateRef<any>;

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
  quillEditorExtendDays: FormGroup;
  quillEditorRejectRequest: FormGroup;
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
  // subTaskForm: FormGroup;
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
  reminderMaxDate: Date;
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
  attachedfileName: string;
  activitytype: any;
  bsValue: Date = null;
  subtaskDeadlineDate: Date;
  isconfirmationsubmitted: boolean;
  controlname: string;
  isemailverificationRequired: boolean;
  selectedStageContent: string;
  bsErrordate: any;
  skeletonLoading = true;
  skeletonCustomLoading = true;
  skeletonStageLoading = true;
  subTaskFields: IsubtaskType;
  translateX: number = 0;
  leftbtnVisibility = false;
  rightbtnVisibility = true;
  scrollLimit: number = 0;
  showStageTitle: string;
  showStageGuidanceText: string;
  dueInDays: number;
  multipleFile: any = [];
  subtaskAttachments: any = [];
  subtaskFileID: any;
  queryCompanyID: any;
  queryOrgID: any;
  queryPropID: any;
  currentManagedcID: any;
  resuserCID: any;
  userData: any;
  emailVerificationStatus = false;
  isExtenddasysubmitted = false;
  isRejectrequestsubmitted = false;
  isUserNotMatched: boolean = false;
  reasonList: any = [];
  rightArrowStatus = false;
  isRequestCompleted = false;
  customFieldObj = [];
  firstName:string;
  currentSelectedOrgname: string;
  request_typeid;
  subject_typeid;
  duplicateReqType;
  duplicateSubType;
  duplicateRequest = [];
  duplicateReqWorkflow;
  displayCurrentRequestData;
  currentworkflowID;
  currentWorkflowname;
  duplicateRequestID;
  progressStaus;
  duplicateRequestStatus;
  isSubmitBtnClickedOnce;
  //isduplicatedIdSelected = false;
  isExtendDaysExceeded = false;
  queryOID;
  queryPID;
  formID;
  requestForm;
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
              private loading: NgxUiLoaderService,
              private cdRef: ChangeDetectorRef,
              private userService: UserService,
              private authService: AuthenticationService,
              private systemIntegrationService: SystemIntegrationService
  ) {
    // this.renderer2.listen('window', 'click', (e: Event) => {
    //   if (e.target !== this.toggleDayleftdiv.nativeElement &&
    //     e.target !== this.btnDaysLeft.nativeElement && e.target !== this.customDaysInput.nativeElement) {
    //     this.isListVisible = false;
    //   }
    // });
    this.paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount, id: 'userPagination' };
    this.activitytype = 0; // 0 = private (internal), 1 = public
    // this.getCurrentLoggedInUser();
  }

  ngOnInit() {
    this.subTaskFields = {
      assignee: '',
      name: '',
      description: '',
      required: false,
      deadline: new Date(null),
      reminder: new Date(null)
    };
  //  this.bsValue = new Date();
    this.activatedRoute.paramMap.subscribe(params => {
      this.requestID = params.get('reqid');
      this.formID = params.get('formID');
      this.queryCompanyID = params.get('companyid');
      this.queryOrgID = params.get('orgid');
      this.queryPropID = params.get('propid');
    });

    this.activatedRoute.queryParamMap
    .subscribe(params => {
   this.queryOID = params.get('oid');
   this.queryPID = params.get('pid');
      });

    this.quillEditorText = new FormGroup({
      editor: new FormControl('', Validators.required),
      publicprivatetype: new FormControl('0')
    });
    this.quillEditorEmailText = this.formBuilder.group({
      dropdownEmailTemplate: [''],
      editorEmailMessage: ['', [Validators.required]],
      emailAttachment: ['']
    });
    this.quillEditorExtendDays = new FormGroup({
      customdays: new FormControl('20', Validators.required),
      editorReason: new FormControl('', Validators.required)
    });
    this.quillEditorRejectRequest = new FormGroup({
      reason: new FormControl('', Validators.required),
      editorComments: new FormControl('', Validators.required)
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

    this.subTaskResponseForm = this.formBuilder.group({
      taskresponse: ['', [Validators.required]],
      markcompleted: ['', [Validators.requiredTrue]],
      uploaddocument: ['']
    });

    this.confirmationForm = this.formBuilder.group({
      userInput: ['', [Validators.required]]
    });
    this.getCurrentLoggedInUser();
    this.getSelectedOrgIDPropertyID();


    this.loadDataRequestDetails();
    this.getApprover();

    this.loadCountryList();
    this.loadStateList();
    this.loadDSARRequestDetailsByID(this.currentManagedOrgID, this.currrentManagedPropID, this.requestID);
    this.preFillData();
    // this.onChanges();
    this.minDate = new Date();
    this.loadReasonList();
  }

  get addActivity() { return this.quillEditorText.controls; }
  get addEmailPost() { return this.quillEditorEmailText.controls; }
  get editRequest() { return this.editRequestDetailForm.controls; }
  get subTaskResponse() { return this.subTaskResponseForm.controls; }
  get confirmDelete() { return this.confirmationForm.controls; }
  get dayExtend() { return this.quillEditorExtendDays.controls; }
  get requestReject() { return this.quillEditorRejectRequest.controls }
  getSelectedOrgIDPropertyID() {
    this.orgService.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id || response.response.oid;
        this.currrentManagedPropID = response.property_id || response.response.id;
        this.currentPropertyName = response.property_name;
        this.currentSelectedOrgname = response.organization_name;
      } else {
        //const orgDetails = this.orgService.getCurrentOrgWithProperty();
        this.currentManagedOrgID = this.queryOID; //orgDetails.organization_id || orgDetails.response.oid;
        this.currrentManagedPropID = this.queryPID;// orgDetails.property_id;
        // this.currentPropertyName = orgDetails.property_name;
        // this.currentSelectedOrgname = orgDetails.organization_name;
      }
    }, (error) => {
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
    });
  }

  backToDSARRequest() {
    this.router.navigate(['privacy/dsar/requests'],{ queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling:'merge', skipLocationChange:false});
  }

  onRefresh(){
    this.loadDataRequestDetails();
    this.loadEmailLog(this.requestID);
    this.loadActivityLog(this.requestID);
  }


  getCurrentLoggedInUser() {
    this.userService.getLoggedInUserDetails(this.constructor.name, moduleName.headerModule).subscribe((data) => {
      this.userData = data;
      this.resuserCID = this.userData.response.cID;
      if (this.resuserCID !== undefined) {
        if (this.queryCompanyID !== this.resuserCID) {
          this.openModal(this.userAuthenticationModal);
        }
      }
    });
  }


  loadDataRequestDetails() {

    this.dsarRequestService.getDSARRequestDetails(this.currentManagedOrgID, this.currrentManagedPropID, this.requestID,
      this.constructor.name, moduleName.dsarRequestModule)
      .subscribe((data) => {
      if (data.response !== "No data found.") {
        this.requestDetails.push(data.response);
        this.customFields = data.response.custom_data;
        this.requestForm = data.response.request_form;
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
        this.requestType =  this.getCustomRequestType("requesttype",data.response.custom_data.request_type);
        this.subjectType =  this.getCustomSubjectType("subjecttype",data.response.custom_data.subject_type);
        this.request_typeid = data.response.request_type_id;
        this.subject_typeid = data.response.subject_type_id;
        this.workflowName = data.response.workflow_name;
        this.workflowId = data.response.workflow_id;
        this.reqAcceptingagent = data.response.req_accepting_agent;
        this.riskFactorText = data.response.risk_factor;
        this.currentWorkflowStage = data.response.workflow_stage || 'New';
        this.currentWorkflowStageID = data.response.workflow_stage_id || '';
        this.isEmailVerified = data.response.email_verified;
        this.isemailverificationRequired = data.response.required_email_verification;
        this.isAttachmentExist = this.isFileExist(data.response.upload_exist);
        this.attachedfileName = data.response.upload_exist;
        this.skeletonCustomLoading = false;
        this.getCustomFields(this.customFields);
        this.getWorkflowStages(this.workflowId);
        this.showCustomFieldValues();
        if(data.response.duplicate_request !== null){
          this.duplicateRequest = data.response.duplicate_request;
          this.showReqData(this.duplicateRequest[0]);
        } else{
          this.duplicateRequest.length = 0;
        }
        //        this.selectStageOnPageLoad(this.currentWorkflowStageID);

        this.editRequestDetailForm.controls['country'].setValue(this.respCountry);
        this.editRequestDetailForm.controls['state'].setValue(this.respState);
        this.editRequestDetailForm.controls['city'].setValue(this.respCity);
        // if (this.reqAcceptingagent !== 'No records') {
        this.editRequestDetailForm.controls['requestacceptingagent'].setValue(this.reqAcceptingagent);
        // }
        this.editRequestDetailForm.controls['riskfactor'].setValue(this.riskFactorText);
        this.skeletonLoading = false;
      }
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
      let filterdList = approverList.filter((t) => t.user_name !== ' ' && t.role_name.indexOf('View') == -1 && t.email_verified);
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

  isNumber(value): boolean {
    return Number.isNaN(value);
  }

  getCustomFields(data: any) {

    if (data !== undefined) {
      // tslint:disable-next-line: forin
      for (const k in data) {
        if (k !== "request_type" && k !== "subject_type") {
          let value = data[k];
          let key = k.replace('_', ' ');
          let updatedKey = this.capitalizeFirstLetter(key);
          this.customFieldObj[updatedKey] = value;
        }
      }

    }
    return this.customFieldObj;
  }



  capitalizeFirstLetter(key: any) {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  getWorkflowStages(id) {
    console.log(this.currentManagedOrgID,'currentManagedOrgID..');
    ///workflowId
    this.workflowService.getWorkflowById(this.constructor.name, moduleName.workFlowModule, this.currentManagedOrgID, id).subscribe((data) => {
      if (data.length > 0) {
        const respData = data[0].workflow_stages;
        this.currentworkflowID = data[0].id;
        this.currentWorkflowname = data[0].workflow_name;
        this.workflowStages = this.rearrangeArrayResponse(respData);
        this.skeletonStageLoading = false;
        // this.selectedStages.push(this.workflowStages[0]);
        this.selectStageOnPageLoad(this.currentWorkflowStageID);
        this.getSubTaskList();
      } else {
        this.skeletonStageLoading = false;
        this.alertMsg = 'No records found!';
        this.isOpen = true;
        this.alertType = 'info';
      }
    }, (error) => {
      this.skeletonStageLoading = false;
      this.alertMsg = JSON.stringify(error);
      this.isOpen = true;
      this.alertType = 'danger';
    });
  }
  stageSelection(item) {
    let isEmailGetVerified: boolean;
    let formData;
    if (this.isemailverificationRequired) {
      if (this.isEmailIDVerified('Email', this.isEmailVerified)) {
        isEmailGetVerified = true;
      } else {
        this.alertMsg = 'Can not select stages without email verification!';
        this.isOpen = true;
        this.alertType = 'danger';
        return false;
      }
    }
    this.currentStage = item.order;
    if (this.isSubTaskExist(item)) {
      if (this.selectedStages.length === 0) {
        this.nextStage = 0;
      } else {
        this.nextStage = this.selectedStages[this.selectedStages.length - 1].order;
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
            formData = new FormData();
            formData.append('current_status', reqObj.current_status);
            formData.append('previous_status', reqObj.previous_status);
          } else {
            reqObj = {
              current_status: this.currentStageId
            };
            formData = new FormData();
            formData.append('current_status', reqObj.current_status);
          }
          // const reqObj = {
          //   current_status: this.currentStageId,
          //   previous_status: this.previousStageId ? this.previousStageId : this.previousStageId = ''
          // }
          this.stageAPI(this.requestID, formData);
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
    this.modalRef = this.bsmodalService.show(template, { class: '', keyboard: false });
    this.stageDiff = diff;
    this.revertedStage = item;
  }

  openCommonModal(template: TemplateRef<any>) {
    this.modalRef = this.bsmodalService.show(template, { class: '', keyboard: false });
  }

  openCommonLargeModal(template: TemplateRef<any>) {
    this.modalRef = this.bsmodalService.show(template, { class: 'modal-lg', keyboard: false });
  }

  openExtendModal() {
    this.openModal(this.extendDaysModal);
  }

  openReqestRejectModal() {
    this.openModal(this.rejectRequestModal);
  }

  confirm() {
    let formData;
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
            formData = new FormData();
            formData.append('current_status', reqObj.current_status);
            formData.append('previous_status', reqObj.previous_status);
            this.stageAPI(this.requestID, formData);
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
            formData = new FormData();
            formData.append('current_status', reqObj.current_status);
            formData.append('previous_status', reqObj.previous_status);
            this.stageAPI(this.requestID, formData);
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
    this.quillEditorExtendDays.reset();
  }


  isStageCompleted(item): boolean {
    if (this.currentWorkflowStage !== 'Rejected') {
      if (item !== undefined) {
        return this.selectedStages.some((t) => t.order == item.order);
      }
    } else {
      return false;
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
    this.isActivitysubmitted = true;
    if (this.quillEditorText.invalid) {
      return false;
    } else {
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
      //  this.activitytype = this.quillEditorText.value.publicprivatetype;
        const fd = new FormData();
        fd.append('current_status', reqObj.current_status);
        fd.append('previous_status', reqObj.previous_status);
        fd.append('activity_feedback', reqObj.activity_feedback);
        this.stageAPI(this.requestID, fd);
      }
    }

  }

  onSubmitEmailPost() {
    this.isEmailPostsubmitted = true;
    if (this.quillEditorEmailText.invalid) {
      return false;
    } else {
      if (this.selectedStages.length === 0) {
        this.alertMsg = 'Stage is not selected!';
        this.isOpen = true;
        this.alertType = 'info';
        return false;
      } else {
        const requestObj = {
          current_status: this.currentWorkflowStageID || this.selectedStages[this.selectedStages.length - 1].id,
          email_body: this.quillEditorEmailText.get('editorEmailMessage').value,
          upload: this.quillEditorEmailText.get('emailAttachment').value
        };

        const fd = new FormData();
        fd.append('current_status', this.currentWorkflowStageID || this.selectedStages[this.selectedStages.length - 1].id);
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
              this.quillEditorEmailText.get('emailAttachment').reset();
              this.uploadFilename = '';
              this.isEmailPostsubmitted = false;
            }
          }, (error) => {
            this.alertMsg = error;
            this.isOpen = true;
            this.alertType = 'danger';
          });
      }
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
          this.quillEditorExtendDays.reset();
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
    });
  }

  loadReasonList() {
    this.dsarRequestService.getRejectionReason().subscribe((data) => {
      this.reasonList.push(data);
    });
    return this.reasonList;
  }

  onChangeRequestType(event) {
    let convertedString = this.checkHtmlText(event.target.value); //this.checkForCompanyOrConsumeName(str);
    let removedBrackets = convertedString.replace(/\[/g, '').replace(/]/g, '');
    this.quillEditorEmailText.controls['editorEmailMessage'].setValue(removedBrackets);
  }

  checkHtmlText(str){
    const mapObj = {
      "Data Subject Name":this.firstName,
      "Consumer Name":this.firstName,
      "Company name":this.currentSelectedOrgname,
      "Company name privacy team":this.currentSelectedOrgname,
      "Company Name":this.currentSelectedOrgname
   };
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
    str = str.replace(re, function(matched){
      return mapObj[matched];
    });
    return str;
  }

  onChangeReason(event) {
    this.quillEditorRejectRequest.controls['reason'].setValue(event.target.value);
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
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }


  openModalPopup(content, data) {
    if (data !== '') {
      this.isResponseToSubTask = false;
      this.isEditSubTask = true;
      this.selectedTaskID = data.id;
      this.selectedAssignee = data.assignee;
      this.subTaskFields.assignee = data.assignee;
      this.subTaskFields.name = data.name;
      this.subTaskFields.description = data.description;
      this.subTaskFields.required = data.required;
      this.subTaskFields.deadline = new Date(data.deadline);
      this.subTaskFields.reminder = data.reminder === null ?  null : new Date(data.reminder);

      const obj = {
        assignee: data.assignee,
        name: data.name,
        description: data.description,
        required: data.required === '' ? false : true,
        deadline: data.deadline,
        reminder: data.reminder
      };
      // this.subTaskFields = obj;
      // this.subTaskTempForm.setValue(obj);
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

      }, (reason) => {
      });
    } else {
      this.subTaskFields.deadline = null;
      this.subTaskFields.reminder = null;
      this.subTaskFields.assignee = null;
      this.subTaskFields.description = null;
      this.subTaskFields.name = null;
      this.subTaskFields.required = null;
      this.isEditSubTask = false;
      this.selectedAssignee = '';
      this.onResetSubTask();
      this.isAddSubTaskSubmit = false;
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
    this.subtaskAttachments = data.upload;
    this.displayTaskDescription = data.description;
    this.displayTaskname = data.name; //data.deadline
    this.displayTaskDeadline = data.deadline;
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
          this.modalService.dismissAll('Canceled');
        });
    }


  }

  loadDSARRequestDetailsByID(currentManagedOrgID, currrentManagedPropID, requestID) {
    let approver;
    this.dsarRequestService.getDSARRequestDetailsByID(currentManagedOrgID, currrentManagedPropID, requestID,
      this.constructor.name, moduleName.dsarRequestModule)
      .subscribe((data) => {
        if (data.response !== 'No data found.') {
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
      });
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
    // if (this.reqAcceptingagent !== 'No records') {
    this.editRequestDetailForm.controls['requestacceptingagent'].setValue(this.reqAcceptingagent);
    // }
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

  onSubmitAddSubTask(subtaskForm: NgForm) {
    this.isAddSubTaskSubmit = true;
    if (subtaskForm.invalid) {
      return false;
    }
    this.isSubmitBtnClickedOnce = true;
    let currentStageID;
    this.isConfirmed ? currentStageID = this.currentWorkflowStageID : currentStageID = this.currentStageId;
   // const currentStageID = this.currentStageId ? this.currentStageId : this.currentWorkflowStageID;
    if (this.isConfirmed == undefined || !this.isConfirmed) {
      currentStageID = this.currentWorkflowStageID;
    }
    if (currentStageID !== undefined) {
      const obj = {
        assignee: subtaskForm.value.assignee,
        name: subtaskForm.value.name,
        description: subtaskForm.value.description,
        required: subtaskForm.value.required || false,
        deadline: subtaskForm.value.deadline,
        reminder: subtaskForm.value.reminder
      };
      if (!this.isEditSubTask) {
        this.dsarRequestService.addSubTask(this.queryCompanyID,this.requestID, currentStageID, obj,
          this.constructor.name, moduleName.dsarRequestModule)
          .subscribe((data) => {
            this.alertMsg = data.response;
            this.isOpen = true;
            this.alertType = 'success';
            subtaskForm.resetForm();
            this.getSubTaskList();
            this.authService.notificationUpdated.next(true);
            this.isSubmitBtnClickedOnce = false;
            this.modalService.dismissAll('Canceled');
          }, (error) => {
            this.onResetSubTask();
            this.isSubmitBtnClickedOnce = false;
            this.alertMsg = error;
            this.isOpen = true;
            this.alertType = 'danger';
          });
      } else {
        this.dsarRequestService.updateSubTask(this.queryCompanyID, this.selectedTaskID, obj, this.constructor.name, moduleName.dsarRequestModule)
        .subscribe((data) => {
          this.alertMsg = data.response;
          this.isOpen = true;
          this.alertType = 'success';
          this.getSubTaskList();
          subtaskForm.resetForm();
          this.onResetSubTask();
          this.authService.notificationUpdated.next(true);
          this.isSubmitBtnClickedOnce = false;
        }, (error) => {
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
          this.isSubmitBtnClickedOnce = false;
          this.onResetSubTask();
        });
      }

    } else {
      this.onResetSubTask();
      this.alertMsg = 'Workflow stages are not available!';
      this.isOpen = true;
      this.alertType = 'info';
      this.isSubmitBtnClickedOnce = false;
    }
  }

  onSubmitExtendDays() {
    this.isExtenddasysubmitted = true;
    this.isExtendDaysExceeded = this.quillEditorExtendDays.controls["customdays"].value < 1 || this.quillEditorExtendDays.controls["customdays"].value > 45;
    if (this.quillEditorExtendDays.invalid) {
      return false;
    } else {
      if(this.isExtendDaysExceeded){
        return false;
      }
      this.onClickEndDays(this.quillEditorExtendDays.get('customdays').value);
      if (this.selectedStages.length !== 0) {
        const reqObj = {
          current_status: this.selectedStages[this.selectedStages.length - 1].id,
          previous_status: this.previousStageId,
          activity_feedback: 'Days Extended: ' + this.quillEditorExtendDays.get('customdays').value + '<br/>' + this.quillEditorExtendDays.get('editorReason').value // this.editorActivityPost
        };
        Object.keys(reqObj).forEach(key => {
          if (reqObj[key] === undefined) {
            delete reqObj[key];
          }
        });
        const fd = new FormData();
        fd.append('current_status', reqObj.current_status);
        fd.append('previous_status', reqObj.previous_status);
        fd.append('activity_feedback', reqObj.activity_feedback);
        this.stageAPI(this.requestID, fd);
        this.decline();
        this.isExtenddasysubmitted = false;
      } else {
        this.alertMsg = 'Select stage!';
        this.isOpen = true;
        this.alertType = 'danger';
      }
    }
  }

  onSubmitRejectRequest(rejectreason?) {
    this.isRejectrequestsubmitted = true;
    if (this.quillEditorRejectRequest.invalid) {
      return false;
    } else {
      const reqObj = {
        comment: 'Reason for rejection: ' + this.quillEditorRejectRequest.get('reason').value + '<br/> comments: ' + this.quillEditorRejectRequest.get('editorComments').value // this.editorActivityPost
      };
      this.alertMsg = 'Request has been rejected!';
      this.isOpen = true;
      this.alertType = 'success';
      Object.keys(reqObj).forEach(key => {
        if (reqObj[key] === undefined) {
          delete reqObj[key];
        }
      });
      const fd = new FormData();
      fd.append('comment', reqObj.comment);
      const requestID = rejectreason == 'duplicate' ? this.duplicateRequestID : this.requestID;
      this.dsarRequestService.rejectDSARRequest(requestID, reqObj, this.constructor.name, moduleName.dsarRequestModule).subscribe((data) => {
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.loadDataRequestDetails();
        this.loadActivityLog(requestID);
        //this.router.navigate(['privacy/dsar/requests']);
      }, (err) => {
        this.alertMsg = 'error';
        this.isOpen = true;
        this.alertType = 'danger';
      });
      this.decline();
    }
  }

  resetSubtaskForm(subtaskForm: NgForm) {
    subtaskForm.resetForm();
  }

  onResetSubTask() {
    this.isAddSubTaskSubmit = false;
    this.modalService.dismissAll('Canceled');
  }

  isInvalidDate(event) {
    const test = event.target.value;
    if (test === 'Invalid date') {
      event.target.value = formatDate(new Date(), 'MM/dd/yyyy', 'en'); // Change it here
    }
  }


  uploadFile(event, tag?) {
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
          this.multipleFile.push(event.target.files[0]);
          this.subTaskResponseForm.get('uploaddocument').setValue(this.multipleFile);
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

  removeFile(item) {
    const index = this.multipleFile.indexOf(item);
    this.multipleFile.splice(index, 1);
  }

  onSubmitSubTaskResponse() {
    this.isResponseSubmitted = true;
    if (this.subTaskResponseForm.invalid) {
      return false;
    } else {
      const fd = new FormData();
      fd.append('task_response', this.subTaskResponseForm.get('taskresponse').value);
      fd.append('mark_completed', this.subTaskResponseForm.get('markcompleted').value);
      //  fd.append('upload', this.subTaskResponseForm.get('uploaddocument').value);
      if(this.multipleFile.length !== 0){
        for (var i = 0; i < this.multipleFile.length; i++) {
          fd.append('upload[]', this.multipleFile[i]);
        }
      }
      //  return false;
      this.dsarRequestService.addSubTaskResponse(this.selectedTaskID, this.queryCompanyID, this.currentManagedOrgID, this.currrentManagedPropID,
        fd, this.constructor.name, moduleName.dsarRequestModule)
        .subscribe((data) => {
          this.getSubTaskList();
          this.alertMsg = 'subtask response submitted successfully';
          this.isOpen = true;
          this.alertType = 'success';
          this.multipleFile = [];
          this.onCancelSubTaskResponse();
          this.authService.notificationUpdated.next(true);
        }, (error) => {
          this.onCancelSubTaskResponse();
          this.alertMsg = JSON.stringify(error);
          this.isOpen = true;
          this.alertType = 'danger';
        });
    }
  }


  selectStageOnPageLoad(id) {
    if (id) {
      const workfloworder = this.workflowStages.filter((t) => t.id === id);
      const x = this.workflowStages.slice(0, workfloworder[0].order);
      this.selectedStages = x;
    } else if (this.isEmailVerified && this.isemailverificationRequired){
      this.selectedStages.push(this.workflowStages[0]);
      this.selectedStages.push(this.workflowStages[1]);
      this.currentWorkflowStageID = this.workflowStages[1].id;
    } else if (!this.isEmailVerified && !this.isemailverificationRequired){
      this.selectedStages.push(this.workflowStages[0]);
      this.selectedStages.push(this.workflowStages[1]);
      this.currentWorkflowStageID = this.workflowStages[1].id;
    } else{
      this.selectedStages.push(this.workflowStages[0]);
      this.currentWorkflowStageID = this.workflowStages[0].id;
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
    if (currentStageID !== undefined && currentStageID.length !== 0) {
      let resp;
      this.dsarRequestService.getSubTaskByWorkflowID(this.requestID, currentStageID, this.constructor.name, moduleName.dsarRequestModule)
        .subscribe((data) => {
           this.subTaskListResponse = data;
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
    if (stage.length !== 0) {
      return stage[0].stage_title;
    }
  }


  onValueChange(value: Date): void {
    this.minDate = new Date();
    if (value === null) {
      this.maxDate = new Date(this.subTaskFields.deadline);
    } else {
      this.maxDate = new Date(value);
    }
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate());
  }

  displayApproverName(id): string {
    let i = this.ApproverList.findIndex((t) => t.approver_id == id && t.email_verified);
    return this.displayAssignee = this.ApproverList[i].user_name;
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

  viewClientRequestFileAttachment() {
    this.skeletonLoading = true;
    let ext;
    let documentType;
    this.dsarRequestService.viewUserUploadedFile(this.requestID, this.constructor.name, moduleName.dsarRequestModule).subscribe((data) => {
      this.skeletonLoading = false;
      if (data) {
        this.base64FileCode = data.upload;
        ext = data.upload_ext;
        let fileExtn = ext.split('.');
        documentType = this.changeFileType(fileExtn[1]);
        const blob = new Blob([this._base64ToArrayBuffer(this.base64FileCode)], {
          type: documentType // type: 'application/pdf',
        });
        const url = URL.createObjectURL(blob);
        return window.open(url, 'iframeFilepreview');
      }
    }, (error) => {
      this.skeletonLoading = false;
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
    this.emailVerificationStatus = (key === 'Email' && isEmailVerified);
    return this.emailVerificationStatus;
  }

  isContainCaptchacodeLabel(key): boolean {
    return key === 'Captcha code'
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
    this.translateX += 150;
  }

  public onNextSearchPosition(): void {
    this.translateX -= 150;
  }

  removeDSARRequest(control: string) {
    this.controlname = control;
    this.openModal(this.confirmDeleteModal);
  }

  deleteDSARRequest() {
    this.ccpaDataService.deleteDSARRequestByID(this.constructor.name, moduleName.dsarRequestModule, this.currentManagedOrgID,
      this.currrentManagedPropID, this.requestID).subscribe((data) => {
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.router.navigate(['privacy/dsar/requests'],{ queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling:'merge', skipLocationChange:false});
      }, (err) => {
        this.alertMsg = 'error';
        this.isOpen = true;
        this.alertType = 'danger';
      });
  }

  cancelModal() {
    this.modalRef.hide();
    this.confirmationForm.reset();
    this.isconfirmationsubmitted = false;
    return false;
  }


  showControlContent(): string {
    if (this.controlname === 'DSAR Request detail') {
      return this.requestID;
    }
  }

  confirmDeleteDSARRequest() {
    this.modalRef.hide();
    this.deleteDSARRequest();
  }

  onCloseDuplicatereqModal() {
    this.isRejectrequestsubmitted = false;
    this.modalRef.hide();
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

  stageContentStyle(): object {
    if (this.showStageGuidanceText !== undefined) {
      if (this.showStageGuidanceText.length <= 150) {
        return { 'min-height': '80px' };
      } else if (this.showStageGuidanceText.length <= 300) {
        return { 'min-height': '90px' };
      } else if (this.showStageGuidanceText.length <= 450) {
        return { 'min-height': '100px' };
      } else if (this.showStageGuidanceText.length <= 650) {
        return { 'min-height': '120px' };
      } else if (this.showStageGuidanceText.length <= 1050) {
        return { 'min-height': '210px' };
      }
    } else {
      return { 'min-height': '20px' };
    }

  }

  leftClickStatus(): boolean {
    if (this.translateX >= 0) {
      return true;
    }
  }

  rightClickStatus(): boolean {
    return this.translateX <= this.scrollLimit;
  }

  showStageTitleAndContent(selectedStage) {
    if (selectedStage.id === this.currentWorkflowStageID) {
      this.showStageTitle = selectedStage.stage_title;
      this.showStageGuidanceText = selectedStage.guidance_text;
      this.cdRef.markForCheck();
    }
  }

  viewClientAttachedFile(id) {
    this.skeletonLoading = true;
    let ext;
    let documentType;
    this.dsarRequestService.viewClientsFileAttachments(id, this.constructor.name, moduleName.dsarRequestModule).subscribe((data) => {
      this.skeletonLoading = false;
      if (data) {
        this.base64FileCode = data.response.upload;
        ext = data.response.filename;
        let fileExtn = ext.split('.');
        documentType = this.changeFileType(fileExtn[1]);
        const blob = new Blob([this._base64ToArrayBuffer(this.base64FileCode)], {
          type: documentType // type: 'application/pdf',
        });
        const url = URL.createObjectURL(blob);
        return window.open(url, 'iframeFilepreview');
      }
    }, (error) => {
      this.skeletonLoading = false;
    });

  }

  viewClientsEmailAttachment(id) {
    this.skeletonLoading = true;
    let ext;
    let documentType;
    this.dsarRequestService.getClientsEmailAttachments(id, this.constructor.name, moduleName.dsarRequestModule).subscribe((data) => {
      this.skeletonLoading = false;
      if (data) {
        this.base64FileCode = data.response.upload;
        ext = data.response.filename;
        let fileExtn = ext.split('.');
        documentType = this.changeFileType(fileExtn[1]);
        const blob = new Blob([this._base64ToArrayBuffer(this.base64FileCode)], {
          type: documentType // type: 'application/pdf',
        });
        const url = URL.createObjectURL(blob);
        return window.open(url, 'iframeFilepreview');
      }
    }, (error) => {
      this.skeletonLoading = false;
    });

  }

  viewSubtaskResponseAttachedFile(data) {
    let documentType;
    let fileExtn = data.filename.split('.');
    documentType = this.changeFileType(fileExtn[1]);
    this.dsarRequestService.getSubtaskFileAttachements(data.id, this.constructor.name, moduleName.dsarRequestModule)
      .subscribe((data) => {
        const blob = new Blob([this._base64ToArrayBuffer(data.response[0].content)], {
          type: documentType // type: 'application/pdf',
        });
        const url = URL.createObjectURL(blob);
        return window.open(url, 'iframeFilepreview');
      }, (error) => {
        console.log(error, 'error..');
      })
  }

  isWorkflowStageCompleted(): boolean {
    return this.selectedStages.length === this.workflowStages.length;
  }

  showCustomFieldValues(){
    let fname;
    let lname;
    if(this.customFieldObj !== undefined){
      for(const key in this.customFieldObj){
        if(key == 'First name'){
          fname = this.customFieldObj[key];
        } else if(key == 'Last name'){
          lname = this.customFieldObj[key]
          this.firstName = fname + ' ' + lname;
        }
      }
    }
  }

  ngAfterViewChecked() {
      let rightArrowStatus = this.rightClickStatus();
      let requestCompleted = this.isWorkflowStageCompleted();
      if (rightArrowStatus !== this.rightArrowStatus) {
        this.rightArrowStatus = rightArrowStatus;
        this.cdRef.detectChanges();
      }
      if(requestCompleted !== this.isRequestCompleted){
        this.isRequestCompleted = requestCompleted;
        this.cdRef.detectChanges();
      }

    if (this.workflowStageScroller !== undefined) {
      const liElement = this.workflowStageScroller.nativeElement.querySelector('li').offsetWidth;
    if (liElement !== null) {
        const parentElementSize = this.workflowStageScroller.nativeElement.parentElement.offsetWidth;
        const itemSize = this.workflowStageScroller.nativeElement.querySelector('li').offsetWidth;
        const itemLength = this.workflowStageScroller.nativeElement.childElementCount;
        const menuSize = itemSize * itemLength;
        const visibleSize = menuSize - parentElementSize;
        this.scrollLimit = -visibleSize;
     }
    }
  }

  onCloseUserAuthModal() {
    this.bsmodalService.hide(1);
    this.backToDSARRequest();
  }

  ngAfterViewInit() {
    this.loadEmailLog(this.requestID);
    this.loadActivityLog(this.requestID);
    this.cdRef.detectChanges();
  }

  ngAfterContentChecked(){
    this.cdRef.detectChanges();
  }

  openDuplicateRequest(){
    this.openCommonLargeModal(this.duplicateRequestModal);
  }

  isSamerequestType(){
      if(this.duplicateRequest[0].request_data){
         if(this.subject_typeid == JSON.parse(this.duplicateRequest[0].request_data).subject_type[0]){
           this.duplicateReqType = this.subjectType;
         }
         if(this.request_typeid == JSON.parse(this.duplicateRequest[0].request_data).request_type[0]){
          this.duplicateSubType = this.requestType;
         }
      }
  }

  showReqData(selectedData){
    this.duplicateRequestID = selectedData.id;
    this.progressStaus = selectedData.request_status == 1 ? 'New' : selectedData.request_status == 2 ? 'In progress' : selectedData.request_status == -1 ? 'Rejected' : 'Completed';
    if(this.subject_typeid === JSON.parse(selectedData.request_data).subject_type[0]){
      this.duplicateSubType = this.subjectType;
    }
    if(this.request_typeid === JSON.parse(selectedData.request_data).request_type[0]){
      this.duplicateReqType = this.requestType;
    }

    if(this.currentworkflowID === JSON.parse(selectedData.request_data).workflow){
      this.duplicateReqWorkflow = this.workflowName;
    }

    this.duplicateRequestStatus = this.getStatusStyle(selectedData.request_status);
    let data = JSON.parse(selectedData.request_data);

    let result = Object.keys(data).map((key) => [key, data[key]]);
    this.capitalizatFirstLetterForDuplicate(Object.keys(JSON.parse(selectedData.request_data)));
    return this.displayCurrentRequestData = result;
  }

  capitalizatFirstLetterForDuplicate(data){
    if(typeof data == "object"){
      for(const key of data){
        let extractedKey = key.replace('_', ' ');
        return extractedKey.charAt(0).toUpperCase() + extractedKey.slice(1); //data.toUpperCase();
      }
    }else{
      let key = data.replace('_', ' ');
      return key.charAt(0).toUpperCase() + key.slice(1);
    }

  }

  getStatusStyle(status){
    let colorStyle = {
      'color': status == 1 ? '#007bff' : status == 2 ? '#ffc107' : status == -1 ? '#bd2130' : '#28a745'
    };
    return colorStyle;
  }

  changeActivityType($event){
    this.activitytype = parseInt($event.currentTarget.value);
  }

  reOpenrequest(){

    this.dsarRequestService.reopenDeletedDSARRequest( this.currentManagedOrgID,this.currrentManagedPropID, this.requestID,this.constructor.name, moduleName.dsarRequestModule).subscribe((data)=>{
     if(data.status == 200){
      if (this.selectedStages.length !== 0) {
        const reqObj = {
          current_status: this.selectedStages[this.selectedStages.length - 1].id,
          previous_status: this.previousStageId,
          activity_feedback: 'Request reopen'
        };
        Object.keys(reqObj).forEach(key => {
          if (reqObj[key] === undefined) {
            delete reqObj[key];
          }
        });
        const fd = new FormData();
        fd.append('current_status', reqObj.current_status);
        fd.append('previous_status', reqObj.previous_status);
        fd.append('activity_feedback', reqObj.activity_feedback);
        this.stageAPI(this.requestID, fd);
        this.isExtenddasysubmitted = false;
      } else {
        this.alertMsg = 'Select stage!';
        this.isOpen = true;
        this.alertType = 'danger';
      }
    }
    },(error)=>{
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
    })

  }

  onKeyChanges($event) {
    if ($event.target.value >= 1 && $event.target.value <= 45) {
      this.isExtendDaysExceeded = false;
    } else {
      this.isExtendDaysExceeded = true;
    }
  }

  getCustomSubjectType(currenttype, requestorsubjectids) {
    const requestForm = JSON.parse(this.requestForm);
    const requesttypeindex = requestForm.findIndex((t) => t.controlId == currenttype);
    let filltypes = [];
    for (let i = 0; i < Object.values(requestorsubjectids).length; i++) {
      
      requestForm[requesttypeindex].selectOptions.filter((t) => {
        if (t.subject_type_id == Object.values(requestorsubjectids)[i]) {
          const idx = filltypes.includes(t.name);
          if (!idx) {
            filltypes.push(t.name);
          }
        } 
      });
    }
    return filltypes;
  }

  getCustomRequestType(currenttype, requestorsubjectids) {
    const requestForm = JSON.parse(this.requestForm);
    const requesttypeindex = requestForm.findIndex((t) => t.controlId == currenttype);
    let filltypes = [];
    for (let i = 0; i < Object.values(requestorsubjectids).length; i++) {
      requestForm[requesttypeindex].selectOptions.filter((t) => {
         if (t.request_type_id == Object.values(requestorsubjectids)[i]) {
         const idx = filltypes.includes(t.name);
          if (!idx) {
            filltypes.push(t.name);
          }
        }
      });
    }
    return filltypes;
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

interface IsubtaskType {
  assignee: any;
  name: string;
  description: string;
  required: boolean;
  deadline: Date;
  reminder: Date;
}
