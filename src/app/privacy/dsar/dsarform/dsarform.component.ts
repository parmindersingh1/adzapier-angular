import {
  Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation, AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, AfterContentChecked, AfterViewChecked, TemplateRef
} from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbNavChangeEvent, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OrganizationService } from 'src/app/_services';
import { CcparequestService } from 'src/app/_services/ccparequest.service';
import { DsarformService } from 'src/app/_services/dsarform.service';
import { CCPAFormConfigurationService } from 'src/app/_services/ccpaform-configuration.service';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { Observable, Subscription } from 'rxjs';
import { moduleName } from '../../../_constant/module-name.constant';
import { WebControlProperties } from 'src/app/_models/webcontrolproperties';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from 'src/app/_services/data.service';
import { DirtyComponents } from 'src/app/_models/dirtycomponents';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dsarform',
  templateUrl: './dsarform.component.html',
  styleUrls: ['./dsarform.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default

})
export class DsarformComponent implements OnInit, AfterContentChecked, AfterViewInit,  AfterViewChecked, OnDestroy, DirtyComponents {
  @ViewChild('editor', { static: true }) editor;
  @ViewChild('azEmbedCode') public azEmbedCode: ElementRef<any>;
  @ViewChild('shareLinkCode') public shareLinkCode: ElementRef<any>;
  @ViewChild('nav') navTab: ElementRef<any>;
  @ViewChild(NgbNav) navDirective = null;
  @ViewChild('confirmEdit') confirmModal: TemplateRef<any>;
  @ViewChild('registerForm') registerForm: any;
  @ViewChild('customFields') customFormFields: NgForm;
  @ViewChild('confirmSaveAlert') confirmSaveAlert: TemplateRef<any>;
  @ViewChild('basicForm') basicDetailForm: NgForm;
  @ViewChild('settingsForm',{static:false}) settingsForm: NgForm;

  public requestObject: any = {};
  public selectedFormOption: any;
  public selectedControlType: any;
  public selectOptions: any;
  public selectOptionText: any;
  public count: number;
  public selectOptionControl: any;
  selectedControlId: any;
  changeControlType: any;
  lblText: any;
  inputOrSelectOption: boolean;
  firstField = true;
  firstFieldName = 'First Item name';
  isEditItems: boolean;
  showFormOption: boolean;
  selectedRow: any;
  isEditingList: boolean;
  isOptionSelected: boolean; // check if change from radio to select dropdown;
  isRequestTypeSelected: boolean;
  isSubjectTypeSelected: boolean;
  editSelectionType: boolean;
  updatedControl: any;
  organizationID: any;
  formControlList: any;
  isAddingFormControl: boolean;
  webFormControlList: any = [];
  questionGroups: any;
  dataSubjectAccessRightsForm: any;
  questionControlArray: any;
  public requestType: any = [];
  public subjectType: any = [];
  existingControl: any;
  checkboxBtnType: boolean;
  radioBtnType: boolean;
  subjectTyperadioBtn: boolean;
  subjectTypecheckboxBtnType: boolean;
  selectedProperty: any;
  currentOrgID: any;
  formName: any;
  public propId: any;
  public orgId: any;
  public crid: any;
  propertyname: any;
  private webFormSelectedData;
  selectedwebFormControlList;
  activatedRouteQuery: any;
  loading = false;
  previewPublishedForm: any;
  headerlogoBase64: string;
  headerfaviconBase64: string;
  blured = false;
  focused = false;
  trimLabel: any;
  currentOrganization: any;
  headerColor: any;
  welcomeTextColor: any;
  welcomeFontSize: any;
  footerTextColor: any;
  footerFontSize: any;
  formObject: any;
  sideMenuRequestTypeOptions: any = [];
  sideMenuSubjectTypeOptions: any = [];
  isRequestType: boolean;
  isSubjectType: boolean;
  countryStateList: any;
  stateList: any;
  contactList: any;
  filteredStateList: any;
  workFlowList: any;
  currentManagedPropID: any;
  currentManagedOrgID: any;
  uploadFilename: any;
  capthchaID: Observable<any>; // SafeHtml;
  controlOption = [
    {
      id: 1,
      control: 'textbox',
      display: 'Textbox'
    },
    {
      id: 2,
      control: 'select',
      display: 'Select'
    },
    {
      id: 3,
      control: 'button',
      display: 'Button'
    },
    {
      id: 4,
      control: 'textarea',
      display: 'Textarea'
    },
    // {
    //   id: 5,
    //   control: 'checkbox',
    //   display: 'checkbox'
    // },
    {
      id: 6,
      control: 'datepicker',
      display: 'Datepicker'
    }
  ];

  editableControlOption = [
    {
      id: 1,
      control: 'select',
      display: 'Select'
    },
    {
      id: 2,
      control: 'button',
      display: 'Button'
    }
    // {
    //   id: 3,
    //   control: 'button',
    //   display: 'button'
    // }
  ];
  isWelcomeEditor: boolean;
  quillEditorText: FormGroup;
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
  editorData: string;
  editorDataWelcome: string;
  editorDataFooter: string;
  active = 1;
  footerText: any;
  welcomeText: any;
  headerLogoPath: any;
  ApproverList: any = [];
  selectedApproverID: any;
  selectedWorkflowID: any;
  defaultapprover: any;
  workflow: any;
  daysleft: number | string;
  public reqURLObj = {};
  isControlDisabled: boolean;
  alertMsg: any;
  alertType: any;
  dismissible = true;
  isOpen = false;
  showFilesizeerror: boolean = false;
  showFileExtnerror: boolean = false;
  isFileUploadRequired: boolean = false;
  isEmailVerificationRequired: boolean = false;
  isCaptchaVerificationRequired: boolean = false;
  imgUrl: string;
  isDraftWebForm = false;
  imageToShow: any;
  isImageLoading: boolean;
  captchacode: any;
  captchaid: any;
  isRequiredField = false;
  isFileuploadRequiredField = false;
  isFileuploadRequiredFieldVisible = false;
  selectedControlObj: WebControlProperties;
  scriptcode: string;
  activeId: number;
  nextId: number;
  isWebFormPublished: boolean;
  basicForm: FormGroup;
  basicFormSubmitted: boolean;
  headerLogoForm: FormGroup;
  faviconForm: FormGroup;
  uploadedLogoFile: any;
  isLogoLoaded = false;
  imageError: string;
  isImageSaved: boolean;
  logoFilename: string;
  logoFilesize: number | string;
  logoHeight: number;
  logoWidth: number;
  isCodeCopied = false;
  isdraftsubmitted = false;
  isResetlinkEnable = false;
  isEditingPublishedForm = false;
  modalRef: BsModalRef;
  faviconFilename: string;
  faviconFilesize: number | string;
  formControlLabel: string;
  multiselect = false;
  ismultiselectrequired = false;
  isAccordionOpen: boolean;
  accordionStatus = {
    isFirstopen: false,
    isSecondopen: false,
    isThirdopen: false,
  }
  pageLoadFormObj: any;
  pageLoadFormSettingsObj: any;
  pageLoadFormControls: any;
  modalSubscription: Subscription;
  isModalOpen: boolean;
  isDirty: boolean;
  isStepCovered: boolean;
  formSaveMethod: string;
  customFormchangeSubscription: any;
  settingsFormchangeSubscription: any;
  basicFormSubscription: any;
  errorMsgdaysleft: string;
  queryOID;
  queryPID;
  orgDetails;
  orgPropertyMenu;
  constructor(private fb: FormBuilder, private ccpaRequestService: CcparequestService,
              private organizationService: OrganizationService,
              private dsarFormService: DsarformService,
              private ccpaFormConfigService: CCPAFormConfigurationService,
              private workFlowService: WorkflowService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private loadingbar: NgxUiLoaderService,
              private modalService: NgbModal,
              private cd: ChangeDetectorRef,
              private sanitizer: DomSanitizer,
              private bsmodalService: BsModalService,
              private dataService: DataService,
              private cdRef: ChangeDetectorRef
  ) {

    this.count = 0;
    this.activatedRoute.queryParamMap
      .subscribe(params => {
        this.queryOID = params.get('oid');
        this.queryPID = params.get('pid');
      });

  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.crid = params.get('id');
    });
    this.loadCurrentProperty();



    this.basicForm = this.fb.group({
      formname: ['', [Validators.required]],
      currentOrganization: [{ value: '', disabled: true }],
      selectedProperty: [{ value: '', disabled: true }]
    });
    // this.loading = true;
    this.CreateUpdateDSARForm(this.crid);

    this.quillEditorText = this.fb.group({
      editor: new FormControl(null)
    });


    this.isWelcomeEditor = false;
    this.loadDefaultApprover();
    this.getCCPAdefaultConfigById();
    this.loadCountryList();
    this.loadStateList();
    this.loadWorkFlowList();
    this.loadCaptcha();
    this.getWebFormScriptLink();
    this.basicForm.controls['formname'].setValue(this.formName);
    this.basicForm.controls['currentOrganization'].setValue(this.currentOrganization);
    this.basicForm.controls['selectedProperty'].setValue(this.selectedProperty);

    this.headerLogoForm = this.fb.group({
      headerlogo: ['']
    });

    this.faviconForm = this.fb.group({
      titlefavicon: ['']
    });
    this.loadOrgProperty();
  }
  get stepFormOne() { return this.basicForm.controls; }
  get formLogo() { return this.headerLogoForm.controls; }
  get faviconLogo() { return this.faviconForm.controls; }

  loadCurrentProperty(){
    this.organizationService.currentProperty.subscribe((response) => {
      //  this.loadingbar.stop();
      if (response !== '') {
        this.selectedProperty = response.property_name || response.response.name;
        this.currentOrganization = response.organization_name;
        this.orgId = response.organization_id || response.response.oid;
        this.propId = response.property_id || response.response.id;
        this.currentManagedOrgID = response.organization_id || response.response.oid;
      } else {
        this.currentOrgID =  this.queryOID;
        this.orgId =  this.queryOID;
        this.propId = this.queryPID;
        this.currentManagedOrgID = this.queryOID;
        this.loading = false;
      }
    });
  }

  CreateUpdateDSARForm(formcrid) {
    if (formcrid !== null) {
      // this.isResetlinkEnable = true;
      this.editFormBeforePublish();
      // this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      // this.getCCPAdefaultConfigById();
      const uuidRegx = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      //  this.loadingbar.start();
      this.webFormSelectedData = this.ccpaFormConfigService.currentFormData.subscribe((data) => {
        //   this.loadingbar.stop();
        if (data) {
          (this.propId !== '') ? this.propId = this.propId : this.propId = data.PID;
          (this.orgId !== '') ? this.orgId = this.orgId : this.orgId = data.OID;
          // this.orgId = data.OID;
          //  this.crid = data.crid;
          // this.propertyname = data.form_name;
          this.formName = data.response !== undefined && data.response.form_name || data.form_name || data.web_form_name;
          this.daysleft = data.response !== undefined && data.response.settings.days_left || data.days_left || 45;
          if (data.form_status === 'draft') {
            this.isDraftWebForm = true;
            this.isEditingPublishedForm = true;
          }
          // this.selectedWorkflowID = data.workflow;
          const isUUID = uuidRegx.test(data.approver);
          if (isUUID) {
            this.selectedApproverID = data.approver || data.response.approver;
            this.workflow = data.workflow;
          } else {
            this.selectedApproverID = data.approver_id || data.response.approver;
            this.workflow = data.workflow_id !== undefined ? data.workflow_id : data.response.workflow;
          }
          // this.requestFormControls = data.request_form;
          if (data.request_form) {
            this.selectedwebFormControlList = this.rearrangeFormSequence(data.request_form);
            this.webFormControlList = this.selectedwebFormControlList;
          } else {
            this.selectedwebFormControlList = this.rearrangeFormSequence(this.ccpaFormConfigService.getFormControlList());
            this.webFormControlList = this.selectedwebFormControlList;
          }

          this.webFormControlList.filter((t) => {
            if (t.controlId === 'footertext') {
              this.footerText = t.footerText;
              this.footerTextColor = t.footerTextColor;
              this.footerFontSize = t.footerFontSize;
            } else if (t.controlId === 'welcometext') {
              this.welcomeText = t.welcomeText;
              this.welcomeTextColor = t.welcomeTextColor;
              this.welcomeFontSize = t.welcomeFontSize;
            } else if (t.controlId === 'headerlogo') {
              this.headerlogoBase64 = t.logoURL;
              this.headerColor = t.headerColor;
            } else if (t.controlId === 'fileupload') {
              this.isFileUploadRequired = t.requiredfield;
              this.isFileuploadRequiredField = t.ismandatory;
            } else if (t.controlId === 'favicon') {
              this.headerfaviconBase64 = t.faviconURL;
            }
          });
          // this.ccpaFormConfigService.removeControls();
          this.ccpaFormConfigService.setFormControlList(this.webFormControlList);

        }
      });
      // this.getDSARFormByCRID(this.crid);
    } else {
      // this.isResetlinkEnable = false;
      this.radioBtnType = true;
      this.subjectTyperadioBtn = true;
      // this.loadWebControl();
      this.createNewForm();
      this.webFormControlList = this.dsarFormService.getFormControlList();
      this.webFormControlList.filter((t) => {
        if (t.controlId === 'footertext') {
          this.footerText = t.footerText;
          this.footerTextColor = t.footerTextColor;
          this.footerFontSize = t.footerFontSize;
        } else if (t.controlId === 'welcometext') {
          this.welcomeText = t.welcomeText;
          this.welcomeTextColor = t.welcomeTextColor;
          this.welcomeFontSize = t.welcomeFontSize;
        } else if (t.controlId === 'headerlogo') {
          this.headerlogoBase64 = t.logoURL;
          this.headerColor = t.headerColor;
        } else if (t.controlId === 'fileupload') {
          this.isFileUploadRequired = t.requiredfield;
          this.isFileuploadRequiredField = t.ismandatory;
        } else if (t.controlId === 'favicon') {
          this.headerfaviconBase64 = t.faviconURL;
        }
      });
      this.dsarFormService.setFormControlList(this.webFormControlList);
      this.webFormControlList = this.dsarFormService.getFormControlList();
      //  this.selectOptionControl = this.controlOption[0].control;
      this.selectOptions = [{
        id: new Date().valueOf(), // this.count++,
        value: ' '
      }];
      this.daysleft = 45;
      // this.getCCPAdefaultConfigById();
      // this.reqURLObj = { crid: this.crid, orgid: this.organizationID, propid: this.propId };
      this.organizationService.getOrganization.subscribe((response) => this.currentOrgID = response);
    }
  }

  getCCPAdefaultConfigById() {
    this.ccpaRequestService.clearCacheRequestSubjectType();
    this.ccpaRequestService.getCCPAdefaultRequestSubjectType().subscribe((data) => {
      if (data !== undefined) {
        const rdata = data.request_type;
        const sdata = data.subject_type;
        this.requestType = rdata;
        this.subjectType = sdata;
        this.loadWebControl();
        this.loading = false;
      }
    }, (error) => {
      // this.loadingbar.stop();
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
    });
    this.loadWebControl();
  }

  loadWebControl() {
    if (this.crid) {
      this.getDSARFormByCRID(this.crid,'dataview');
      this.loadWorkFlowList();
    } else {
      this.isEditingPublishedForm = false;
      this.webFormControlList = this.dsarFormService.getFormControlList();
      this.webFormControlList.filter((t) => {
        if (t.controlId === 'requesttype') {
          //  this.sideMenuRequestTypeOptions = this.requestType;
          t.selectOptions = this.requestType;
        } else if (t.controlId === 'subjecttype') {
          // this.sideMenuSubjectTypeOptions = this.subjectType;
          t.selectOptions = this.subjectType;
        }
      });
      this.dsarFormService.setFormControlList(this.webFormControlList);
    }

  }

  loadSubjectRequestTypeForSideNav(selectedType) {

    this.webFormControlList.filter((t) => {
      if (t.controlId === selectedType) {
        if (selectedType === 'subjecttype') {
          t.selectOptions = this.subjectType;
          this.sideMenuSubjectTypeOptions = this.selectedControlObj.selectOptions;// || this.subjectType;
        } else {
          t.selectOptions = this.requestType;
          this.sideMenuRequestTypeOptions = this.selectedControlObj.selectOptions;// || this.requestType;
        }

      }
    });
    if (this.sideMenuRequestTypeOptions.length !== 0 && this.isRequestType) {
      return this.sideMenuRequestTypeOptions;
    } else {
      return this.sideMenuSubjectTypeOptions;
    }


  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }



  register(formData: NgForm) {
    this.setHeaderStyle();
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.webFormControlList, event.previousIndex, event.currentIndex);
      if (this.crid) {
        this.ccpaFormConfigService.setFormControlList(this.webFormControlList);
        this.isDirty = true;
      } else {
        this.dsarFormService.setFormControlList(this.webFormControlList);
        this.isDirty = true;
      }


    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  dragDropOptionRequestType(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.sideMenuRequestTypeOptions, event.previousIndex, event.currentIndex);
      if (this.crid) {
        this.ccpaFormConfigService.setFormControlList(this.webFormControlList);
      } else {
        this.dsarFormService.setFormControlList(this.webFormControlList);
      }
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  dragDropOptionSubjectType(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.sideMenuSubjectTypeOptions, event.previousIndex, event.currentIndex);
      if (this.crid) {
        this.ccpaFormConfigService.setFormControlList(this.webFormControlList);
      } else {
        this.dsarFormService.setFormControlList(this.webFormControlList);
      }
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  dragDropCustomOption(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.selectOptions, event.previousIndex, event.currentIndex);
      if (this.crid) {
        this.ccpaFormConfigService.setFormControlList(this.webFormControlList);
      } else {
        this.dsarFormService.setFormControlList(this.webFormControlList);
      }
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }


  onEditCloseItems() {
    this.isEditItems = !this.isEditItems;
  }
  // this.existingControl.control === 'textbox' || this.existingControl.control === 'textarea'
  addFormField() {
    this.showFormOption = !this.showFormOption;
    if (this.isEditingList) {
      if (this.existingControl.controlId === 'country' || this.existingControl.controlId === 'state' ||
        this.existingControl.control === 'textbox' || this.existingControl.control === 'textarea') {
        this.selectedControlType = false;
        this.isSubjectType = false;
        this.isRequestType = false;
      } else if (this.existingControl.controlId === 'subjecttype') {
        this.isSubjectType = true;
        this.isRequestType = false;
        this.sideMenuSubjectTypeOptions = this.selectedControlObj.selectOptions;
        // this.loadSubjectRequestTypeForSideNav('subjecttype');
      } else if (this.existingControl.controlId === 'requesttype') {
        this.isRequestType = true;
        this.isSubjectType = false;
        this.sideMenuRequestTypeOptions = this.selectedControlObj.selectOptions;
        // this.loadSubjectRequestTypeForSideNav('requesttype');
      } else {
        this.selectedControlType = true;
      }
    } else if (this.selectedFormOption === 'select' || this.selectedFormOption === 'button') {
      this.selectedControlType = !this.selectedControlType; // true;
      if (this.selectedControlType) {
        this.selectOptions = [];
        this.addOptions();
      } else {
        this.selectOptions = [];
      }
      // this.addOptions();
    } else {
      this.selectedControlType = false;
      this.isSubjectType = false;
      this.isRequestType = false;
    }
  }

  isCustomOptionEmpty():boolean{
    if(this.selectOptions !== undefined){
      return  this.selectOptions.filter((t) => t.name === undefined || t.name === '').length > 0;
    }
  }

  isSideMenuRequestTypeOptionEmpty():boolean{
    if(this.sideMenuRequestTypeOptions !== undefined){
      return  this.sideMenuRequestTypeOptions.filter((t) => t.name === undefined || t.name === '').length > 0;
    }
  }

  isSideMenuSubjectTypeOptionEmpty():boolean{
    if(this.sideMenuSubjectTypeOptions !== undefined){
      return  this.sideMenuSubjectTypeOptions.filter((t) => t.name === undefined || t.name === '').length > 0;
    }
  }

  editSelectedRow(data) {
    this.ccpaFormConfigService.storeDataBeforeEdit(data);
    this.selectedControlObj = data;
    this.lblText = data.controllabel;
    this.isEditingList = true;
    this.isAddingFormControl = true;
    this.showFormOption = false;
    this.selectedControlId = data.controlId;
    this.existingControl = data;
    this.isRequiredField = data.requiredfield === '' ? false : data.requiredfield;
    this.changeControlType = data.control;
    (data.control === 'textbox' || data.control === 'textarea') ? this.inputOrSelectOption = true : this.inputOrSelectOption = false;
    if (data.control === 'select' && data.controlId !== 'state' && data.controlId !== 'country' || data.control === 'checkbox'
      || data.control === 'radio') {
      this.editSelectionType = true;
      this.ismultiselectrequired = true;
      if (data.control === 'checkbox') {
        this.selectOptionControl = this.editableControlOption[1].control;
        this.changeControlType = this.editableControlOption[1].control;
        this.multiselect = true;
        // this.customFormFields.form.get("changeControlType").patchValue('Button');
      } else if (data.control === 'radio') {
        this.selectOptionControl = this.editableControlOption[1].control;
        this.changeControlType = this.editableControlOption[1].control;
        this.multiselect = false;
        // this.changeControlType = 'Select'
        // this.customFormFields.form.get("changeControlType").patchValue('Select');
      }
      // this.changeControlType = data.control;
      this.selectOptions = data.selectOptions;
      // const updatedControlType = this.changeControlType === 'button' && !this.multiselect ? 'radio' : 'checkbox';
    } else {
      this.editSelectionType = false;
    }
    this.selectedFormOption = data.control;
    this.selectOptionControl = data.control;

    this.addFormField();
  }

  deleteSelectedItem(item) {
    if (this.crid) {
      this.ccpaFormConfigService.storeDataBeforeEdit(item);
      this.ccpaFormConfigService.deleteControl(item);
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      this.isDirty = true;
    } else {
      this.dsarFormService.storeDataBeforeEdit(item);
      this.dsarFormService.deleteControl(item);
      this.webFormControlList = this.dsarFormService.getFormControlList();
      this.isDirty = true;
    }
  }

  isSelected(i): boolean {
    return this.selectedRow === i;
  }

  saveCurrentItem(i) {
    return !this.isSelected(i);
  }


  addOptions() {
    let count = 0;
    let customObj: CustomControls = {};
    const keylabel = this.lblText.split(' ').join('_').toLowerCase();
    const id = count++;
    customObj = {
      id: new Date().valueOf(), // this.selectOptions.length + 1,
      keylabel
    };
    this.selectOptions.push(customObj);
    this.isDirty = true;
  }

  addCustomReqestSubjectType() {
    this.isDirty = true;
    // isSubjectType,isRequestType
    let subjectObj: CustomControls = {};
    let requestObj: CustomControls = {};
    const keylabel = this.lblText.split(' ').join('_');
    if (this.isSubjectType) {
      subjectObj = {
        subject_type_id: this.generateUUID(),
        active: true,
        created_at: new Date().toJSON(),
        updated_at: new Date().toJSON(),
      };

      this.sideMenuSubjectTypeOptions.push(subjectObj);
    } else {
      requestObj = {
        request_type_id: this.generateUUID(),
        active: true,
        created_at: new Date().toJSON(),
        updated_at: new Date().toJSON(),
      };

      this.sideMenuRequestTypeOptions.push(requestObj);
    }

  }
  generateUUID() {
    let dt = new Date().getTime();
    const custUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return custUuid;
  }

  deleteSelectOption(index) {
    this.isDirty = true;
    this.selectOptions.splice(index, 1);
  }

  deleteSubjectOption(index) {
    this.isDirty = true;
    this.sideMenuSubjectTypeOptions.splice(index, 1);
    if (this.crid) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      this.webFormControlList.filter((t) => {
        if (t.controlId === 'subjecttype') {
          t.selectOptions = this.sideMenuSubjectTypeOptions;
        }
      });
      this.ccpaFormConfigService.setFormControlList(this.webFormControlList);
    } else {
      this.webFormControlList = this.dsarFormService.getFormControlList();
      this.webFormControlList.filter((t) => {
        if (t.controlId === 'subjecttype') {
          t.selectOptions = this.sideMenuSubjectTypeOptions;
        }
      });
      this.dsarFormService.setFormControlList(this.webFormControlList);
    }
  }

  deleteRequestOption(index) {
    this.isDirty = true;
    this.sideMenuRequestTypeOptions.splice(index, 1);
  }


  cancelForm() {
    this.showFormOption = true;
  }

  addCustomFields(formControls: NgForm) {
    if(this.isCustomOptionEmpty() || this.isSideMenuRequestTypeOptionEmpty() || this.isSideMenuSubjectTypeOptionEmpty()){
      return false;
    }
    // this.isDirty = true;
    this.trimLabel = formControls.value.lblText.split(' ').join('_').toLowerCase();
    this.formControlLabel = formControls.value.lblText;
    //  const isLabelExist = this.webFormControlList.filter((t) => t.controllabel === this.trimLabel).length > 0;
    this.changeControlTypes();
    this.cancelAddingFormControl('submit');

  }

  changeControlTypes() {
    //  const controlLabel =  this.formControlLabel !== undefined ? this.formControlLabel : this.lblText;
    if(this.crid){
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
    }else{
      this.webFormControlList = this.dsarFormService.getFormControlList();
    }
    this.trimLabel = this.lblText.split(' ').join('_').toLowerCase();
    const isLabelExist = this.webFormControlList.findIndex((t) => t.controllabel === this.lblText ); //this.formControlLabel || this.lblText
    if (isLabelExist !== -1 && this.changeControlType === null && this.isEditingList) {
      this.alertMsg = 'Label already exist!'
      this.isOpen = true;
      this.alertType = 'danger';
      return false;
    }
    if (this.isEditingList) {
      const req = 'requesttype';
      const sub = 'subjecttype';
      if (this.selectedControlId === req || this.selectedControlId === sub) {

        let updatedObj;
        const oldControlIndex = this.webFormControlList.findIndex((t) =>
          t.controlId === this.existingControl.controlId);
        let updatedControlType;
        if (this.changeControlType === 'button' && !this.multiselect) {
          updatedControlType = 'radio';
        } else if (this.changeControlType === 'button' && this.multiselect) {
          updatedControlType = 'checkbox';
        }
        //  const updatedControlType = this.changeControlType === 'button' && this.changeControlType !== 'select' && !this.multiselect ? 'radio' : 'checkbox';
        updatedObj = {
          controllabel: this.lblText, // formControls.value.lblText,
          indexCount: this.existingControl.indexCount,
          control: updatedControlType || this.changeControlType,
          controlId: this.selectedControlId,
          selectOptions: this.existingControl.selectOptions,
          requiredfield: this.isRequiredField
        };
        this.addUpdateFormControls(oldControlIndex, updatedObj);
        this.isDirty = true;
      } else if (this.existingControl.control === 'textbox' || this.existingControl.control === 'textarea' ||
        this.existingControl.controlId === 'state' || this.existingControl.controlId === 'country') {
        let updatedTextobj;
        const oldControlIndex = this.webFormControlList.findIndex((t) =>
          t.controlId === this.existingControl.controlId);
        let updatedControlType;
        if (this.changeControlType === 'button' && !this.multiselect) {
          updatedControlType = 'radio';
        } else if (this.changeControlType === 'button' && this.multiselect) {
          updatedControlType = 'checkbox';
        }
        // const updatedControlType = this.changeControlType === 'button' && this.changeControlType !== 'select' && !this.multiselect ? 'radio' : 'checkbox';
        //  if (oldControlIndex) {
        updatedTextobj = {
          controllabel: this.formControlLabel || this.lblText, // formControls.value.lblText,
          controlId: this.existingControl.controlId,
          indexCount: this.existingControl.indexCount,
          control: updatedControlType || this.existingControl.control,
          selectOptions: this.existingControl.selectOptions,
          requiredfield: this.isRequiredField
        };
        this.addUpdateFormControls(oldControlIndex, updatedTextobj);
      } else if (this.existingControl) {
        if (this.crid) {
          this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
        } else {
          this.webFormControlList = this.dsarFormService.getFormControlList();
        }
        let updateCustomObj;
        const customControlIndex = this.webFormControlList.findIndex((t) =>
          t.controlId === this.existingControl.controlId);
        if(this.selectOptions !== undefined){
          this.selectOptions.forEach(element => {
            element.keylabel = this.trimLabel;
          });
        }
        // }
        let updatedControlType;
        if (this.changeControlType === 'button' && !this.multiselect) {
          updatedControlType = 'radio';
        } else if (this.changeControlType === 'button' && this.multiselect) {
          updatedControlType = 'checkbox';
        } else {
          updatedControlType = this.changeControlType;
        }
        //  const updatedControlType = this.changeControlType === 'button' && this.changeControlType !== 'select' && !this.multiselect ? 'radio' : 'checkbox';
        if (customControlIndex !== -1) {
          updateCustomObj = {
            controllabel: this.lblText,
            indexCount: this.trimLabel,
            control: updatedControlType || this.existingControl.control,
            controlId: this.existingControl.controlId,
            selectOptions: this.existingControl.selectOptions,
            requiredfield: this.isRequiredField
          };
          let optionLength;
          if(this.selectOptions !== undefined){
            optionLength = this.selectOptions.length;
          }
          if (optionLength > 0) {
            if (this.selectOptions[optionLength - 1].name !== undefined) {
              // this.lblText = '';
              // this.cancelAddingFormControl();
            } else {
              return false;
            }
          } else {
            this.cancelAddingFormControl('submit');
          }
          if (this.crid) {
            this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, updateCustomObj);
            this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
            // this.cancelAddingFormControl();
          } else {
            this.dsarFormService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, updateCustomObj);
            this.webFormControlList = this.dsarFormService.getFormControlList();
          }

        }

      }

    } else {
      if (this.crid) {
        const count = this.webFormControlList.length + 1;
        //  const emptyIndex = this.selectOptions.findIndex((t) => t.keylabel === '');
        //  if (emptyIndex !== -1) {
        this.selectOptions.forEach(element => {
          element.keylabel = this.trimLabel;
        });
        // }
        let updatedControlType;
        if (this.selectOptionControl === 'button' && !this.multiselect) {
          updatedControlType = 'radio';
        } else if (this.selectOptionControl === 'button' && this.multiselect) {
          updatedControlType = 'checkbox';
        }
        // const updatedControlType = this.selectedFormOption === 'button' && this.selectedFormOption !== 'select' && !this.multiselect ? 'radio' : 'checkbox';
        const newWebControl = {
          control: updatedControlType || this.selectedFormOption,
          controllabel: this.formControlLabel || this.lblText, // formControls.value.lblText,
          controlId: 'CustomInput' + count,
          indexCount: this.trimLabel + '_Index',
          selectOptions: this.selectOptions,
          requiredfield: this.isRequiredField
        };
        const optionLength = this.selectOptions.length;
        if (optionLength > 0) {
          if (this.selectOptions[optionLength - 1].name !== undefined) {
            this.lblText = '';
            this.cancelAddingFormControl('submit');
          } else {
            return false;
          }
        } else {
          this.cancelAddingFormControl('submit');
        }
        this.ccpaFormConfigService.addControl(newWebControl);
        this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
        this.updateCaptchaPosition();
      } else {
        this.selectOptions.forEach(element => {
          element.keylabel = this.trimLabel;
        });

        const count = this.webFormControlList.length + 1;
        let updatedControlType;
        if (this.selectedFormOption === 'button' && !this.multiselect) {
          updatedControlType = 'radio';
        } else if (this.selectedFormOption === 'button' && this.multiselect) {
          updatedControlType = 'checkbox';
        }
        // const updatedControlType = this.selectedFormOption === 'button' && this.selectedFormOption !== 'select' && !this.multiselect ? 'radio' : 'checkbox';
        const newWebControl = {
          control: updatedControlType || this.selectedFormOption,
          controllabel: this.formControlLabel || this.lblText, // formControls.value.lblText,
          controlId: 'CustomInput' + count,
          indexCount: this.trimLabel + '_Index',
          selectOptions: this.selectOptions,
          requiredfield: this.isRequiredField
        };

        const optionLength = this.selectOptions.length;
        if (optionLength > 0) {
          if (this.selectOptions[optionLength - 1].name !== undefined) {
            this.lblText = '';
            this.cancelAddingFormControl('submit');
          } else {
            return false;
          }
        } else {
          this.cancelAddingFormControl('submit');
        }

        this.dsarFormService.addControl(newWebControl);
        this.webFormControlList = this.dsarFormService.getFormControlList();
        this.lblText = '';
        //  this.cancelAddingFormControl();
        this.updateCaptchaPosition();
        //  this.selectedControlType = false;
      }
    }
  }
  //  // JSON.stringify(this.uploadedLogoFile), // this.getBase64Image(this.uploadedLogoFile), // this.headerlogoURL,
  onSubmitHeaderLogo() { //addHeaderLogo
    const newWebControl = {
      control: 'img',
      controllabel: 'Header Logo',
      controlId: 'headerlogo',
      logoURL: this.headerlogoBase64,
      headerColor: this.headerColor
    };
    if (this.crid) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'headerlogo');
      this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, newWebControl);
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
    } else {
      this.webFormControlList = this.dsarFormService.getFormControlList();
      const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'headerlogo');
      this.dsarFormService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, newWebControl);
      this.webFormControlList = this.dsarFormService.getFormControlList();
    }
    this.setHeaderStyle();
  }

  onSubmitQuillEditorData() {
    if (this.isWelcomeEditor) {
      this.getEditorFontSize();
      const newWebControl = {
        control: 'text',
        controllabel: 'Welcome Text',
        controlId: 'welcometext',
        indexCount: 'welcome_text_Index',
        welcomeText: this.editorDataWelcome,
        welcomeFontSize: this.welcomeFontSize || '13px',
        welcomeTextColor: this.welcomeTextColor || '#000',
        preferControlOrder: ''
      };
      if (this.crid) {
        this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
        const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'welcometext');
        this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, newWebControl);
        this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      } else {
        this.webFormControlList = this.dsarFormService.getFormControlList();
        const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'welcometext');
        this.dsarFormService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, newWebControl);
        this.webFormControlList = this.dsarFormService.getFormControlList();
      }
      this.modalService.dismissAll('Data Saved!');
    } else {
      this.getEditorFontSize();
      const footerTextControl = {
        control: 'text',
        controllabel: 'Footer Text',
        controlId: 'footertext',
        indexCount: 'footer_text_Index',
        footerText: this.editorDataFooter,
        footerTextColor: this.footerTextColor || '#000',
        footerFontSize: this.footerFontSize || '13px',
        preferControlOrder: ''
      };

      if (this.crid) {
        this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
        const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'footertext');
        this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, footerTextControl);
        this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      } else {
        this.webFormControlList = this.dsarFormService.getFormControlList();
        const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'footertext');
        this.dsarFormService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, footerTextControl);
        this.webFormControlList = this.dsarFormService.getFormControlList();
      }
      this.modalService.dismissAll('Data Saved!');
    }


  }

  onChangeEvent(event) {
    this.selectOptions = [];
    this.selectedFormOption = event.currentTarget.value;
    if (this.selectedFormOption === 'button') { // || this.selectedFormOption === 'radio' || this.selectedFormOption === 'select'
      this.showFormOption = true;
      this.selectedControlType = true;
      this.ismultiselectrequired = true;
      if (this.selectOptions.length === 0) {
        this.addOptions();
      }

    } else {
      this.showFormOption = false;
      this.ismultiselectrequired = false;
    }
  }

  updateControlType(event) {

    this.changeControlType = event.currentTarget.value;
    if (this.selectedControlId === 'requesttype') {
      this.updatedControl = this.changeControlType;
      if (this.changeControlType === 'select') {
        this.isRequestTypeSelected = true;
        this.checkboxBtnType = false;
        this.radioBtnType = false;
        this.ismultiselectrequired = false;
      } else if (this.changeControlType === 'button' && !this.multiselect) {
        this.isRequestTypeSelected = false;
        this.radioBtnType = true;
        this.checkboxBtnType = false;
        this.ismultiselectrequired = true;
      } else if (this.changeControlType === 'button' && this.multiselect) {
        this.isRequestTypeSelected = false;
        this.radioBtnType = false;
        this.checkboxBtnType = true;
        this.ismultiselectrequired = true;
      }
      //  this.changeControlTypes();
    } else if (this.selectedControlId === 'subjecttype') {
      this.updatedControl = this.changeControlType;
      if (this.changeControlType === 'select') {
        this.isSubjectTypeSelected = true;
        this.subjectTypecheckboxBtnType = false;
        this.subjectTyperadioBtn = false;
        this.ismultiselectrequired = false;
      } else if (this.changeControlType === 'button' && !this.multiselect) { // radio, button with multiselect false
        this.isSubjectTypeSelected = false;
        this.subjectTyperadioBtn = true;
        this.subjectTypecheckboxBtnType = false;
        this.ismultiselectrequired = true;
      } else if (this.changeControlType === 'button' && this.multiselect) { // checkbox, button with multiselect true
        this.isSubjectTypeSelected = false;
        this.subjectTyperadioBtn = false;
        this.subjectTypecheckboxBtnType = true;
        this.ismultiselectrequired = true;
      }
      this.changeControlTypes();
    } else if(this.selectedControlId !== 'subjecttype' || this.selectedControlId !== 'requesttype') {
      this.updatedControl = this.changeControlType;
      if (this.changeControlType === 'button' && !this.multiselect) {
        this.isRequestTypeSelected = false;
        this.radioBtnType = true;
        this.checkboxBtnType = false;
        this.ismultiselectrequired = true;
      } else if (this.changeControlType === 'button' && this.multiselect) {
        this.isRequestTypeSelected = false;
        this.radioBtnType = false;
        this.checkboxBtnType = true;
        this.ismultiselectrequired = true;
      }
    }
    this.changeControlTypes();
  }

  addingFormControl() {
    if(this.crid){
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
    }else{
      this.webFormControlList = this.dsarFormService.getFormControlList();
    }
    this.multiselect = false;
    this.selectedFormOption = null;
    this.selectOptionControl = '';
    this.changeControlType = null;
    this.isAddingFormControl = !this.isAddingFormControl;
    this.selectOptions = [];
    this.lblText = '';
  }

  isCustomControlWithRadioBtn(item): boolean {
    return item.controlId.startsWith('Custom') ? true : false;
  }

  isContainHeaderLogo(item): boolean {
    return item.control.startsWith('img') ? true : false;
  }

  isContainFavicon(item): boolean {
    return item.control.startsWith('favicon') ? true : false;
  }

  isContainWelcomeText(item): boolean {
    return item.controlId === 'welcometext' ? true : false;
  }

  isContainFooterText(item): boolean {
    return item.controlId === 'footertext' ? true : false;
  }

  isContainFileUpload(item): boolean {
    return item.controlId === 'fileupload' ? true : false;
  }

  isContainCaptchaControl(item): boolean {
    return item.controlId === 'captchacontrol' ? true : false;
  }

  isCaptchaControlRequired(): boolean {
    if (this.crid) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      return this.webFormControlList.findIndex((t) => t.controlId === 'captchacontrol');
    } else {
      this.webFormControlList = this.dsarFormService.getFormControlList();
      return this.webFormControlList.some((t) => t.controlId === 'captchacontrol');
    }
  }

  cancelAddingFormControl(actionType) {
    if (actionType === 'cancel' && this.crid === null) {
      let obj = this.ccpaFormConfigService.getStoreDataBeforeEdit();
      if (obj !== null && obj !== undefined) {
        const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === obj.controlId);
        this.dsarFormService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, obj);
        this.webFormControlList = this.dsarFormService.getFormControlList();
      }
    } else if (actionType === 'cancel' && this.crid !== null) {
      this.isDirty = true;
      const previousobj = this.ccpaFormConfigService.getStoreDataBeforeEdit();
      if(previousobj !== undefined && previousobj !== null){
        const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === previousobj.controlId);
        this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, previousobj);
        this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      }
    } else if (actionType === 'submit' && this.crid !== null) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      this.isDirty = true;
    } else if (actionType === 'submit' && this.crid == null) {
      this.webFormControlList = this.dsarFormService.getFormControlList();
      this.isDirty = true;
    }
    this.lblText = '';
    this.isAddingFormControl = false;
    this.isEditingList = false;
    this.inputOrSelectOption = false;
    this.showFormOption = false; // true
    this.editSelectionType = false;
    this.isSubjectType = false;
    this.isRequestType = false;
    this.selectedControlType = false;
    this.changeControlType = null;
    this.isRequiredField = false;
    this.ismultiselectrequired = false;
    this.multiselect = false;
  }

  saveAsDraftCCPAFormConfiguration(saveType) {
    this.formSaveMethod = saveType;
    if(this.customFormFields !== undefined){
      this.addCustomFields(this.customFormFields);
    }

    if (this.isWebFormPublished && !this.isEditingPublishedForm) {
      this.navDirective.select(3);
    } else {
      //  this.isResetlinkEnable = !this.isResetlinkEnable;
      this.isdraftsubmitted = false;
      this.setHeaderStyle();
      if (this.crid) {
        this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
        this.webFormControlList.filter((t) => {
          if (t.controlId === 'footertext') {
            t.footerTextColor = this.footerTextColor;
            t.footerFontSize = this.footerFontSize;
          } else if (t.controlId === 'welcometext') {
            t.welcomeTextColor = this.welcomeTextColor;
            t.welcomeFontSize = this.welcomeFontSize;
          }
        });
        this.ccpaFormConfigService.setFormControlList(this.webFormControlList);
        if(this.registerForm !== undefined){
          this.updateWebcontrolIndex(this.registerForm.value, this.webFormControlList);
        }
      } else {
        this.webFormControlList = this.dsarFormService.getFormControlList();
        this.webFormControlList.filter((t) => {
          if (t.controlId === 'footertext') {
            t.footerTextColor = this.footerTextColor;
            t.footerFontSize = this.footerFontSize;
          } else if (t.controlId === 'welcometext') {
            t.welcomeTextColor = this.welcomeTextColor;
            t.welcomeFontSize = this.welcomeFontSize;
          }
        });
        this.dsarFormService.setFormControlList(this.webFormControlList);
        this.updateWebcontrolIndex(this.registerForm.value, this.webFormControlList);
      }
      this.isWebFormPublished = false;
      if(this.active === 2 && saveType !== 'nav'){
        this.isDraftWebForm = false;
        this.active = 3;
      }else if(this.active === 2 && saveType !== 'save'){
        this.isDraftWebForm = false;
        this.active = 3;
        if(this.isDirty){
          this.openModal(this.confirmSaveAlert);
        }
      } else{
        if(this.isDirty){
          this.openModal(this.confirmSaveAlert);
        }
      }
    }
  }

  addUpdateDSARForm(saveType) {
    this.formSaveMethod = saveType;
    // this.isDirty = false;
    if(this.basicForm.controls['formname'].value === undefined){
      this.basicFormSubmitted = true;
      this.alertMsg = `Please complete step 1 Basic`;
      this.isOpen = true;
      this.alertType = 'danger';
      this.navDirective.select(1);
      this.isDirty = false;
      this.closeModal();
      return false;
    } else if(this.active === 1 && saveType !== 'nav' && this.basicForm.controls['formname'].value === undefined){
      this.basicFormSubmitted = true;
      this.isDirty = false;
      this.alertMsg = `Please complete step 1 Basic and save`;
      this.isOpen = true;
      this.alertType = 'danger';
      this.closeModal();
      this.navDirective.select(1);
      return false;
    }  else if(this.active === 2 && saveType !== 'nav' && this.isDirty){
      this.saveAsDraftCCPAFormConfiguration(saveType);
    }
    else if(this.active === 3 && saveType !== 'nav' && this.settingsForm.controls['workflow'].value === undefined && this.settingsForm.controls['selectedApproverID'].value === undefined){
      this.isdraftsubmitted = true;
      this.isDirty = false;
      const stepnumber: number | string = this.formName === undefined ? '1 Basic, 2 Form & 3 Settings': '2 Form & 3 Settings';
      this.alertMsg = `Please complete step ${stepnumber} and save`;
      this.isOpen = true;
      this.alertType = 'danger';
      this.closeModal();
      if(this.basicForm.controls['formname'].value === undefined ){
        this.navDirective.select(1);
      }else{
        this.navDirective.select(3);
      }
      return false;
    } else if(this.nextId === 4 && this.settingsForm.controls['workflow'].value === undefined && this.settingsForm.controls['selectedApproverID'].value === undefined ){ //&& this.activeId === 2
      this.isdraftsubmitted = true;
      this.isDirty = false;
      const stepnumber: number | string = this.formName === undefined ? '1 Basic, 2 Form & 3 Settings': '2 Form & 3 Settings';
      this.alertMsg = `Please complete step ${stepnumber} and save`;
      this.isOpen = true;
      this.alertType = 'danger';
      this.closeModal();
      if( this.formName === undefined ){
        this.navDirective.select(1);
      }else{
        this.navDirective.select(3);
      }
      //return false;
    }
    this.formName = this.basicForm.controls['formname'].value;
    let updatedWebForm;
    if(this.crid){
      updatedWebForm = this.ccpaFormConfigService.getFormControlList();
    }else{
      updatedWebForm = this.dsarFormService.getFormControlList();
    }
    if(this.daysleft >= 46){
      this.errorMsgdaysleft = 'Default days should not be greater than 45';
      return false;
    }
    this.formObject = {
      form_name: this.basicForm.controls['formname'].value,
      form_status: 'draft',
      settings: {
        approver: this.defaultapprover || this.selectedApproverID,
        workflow: this.workflow,
        days_left: Number(this.daysleft) === 0 ? '45' : Number(this.daysleft),
        email_verified: this.isEmailVerificationRequired || false,
        captcha: this.isCaptchaVerificationRequired || false,
      },
      request_form: updatedWebForm
    };
    if (this.orgId !== undefined && this.propId !== undefined && this.crid !== null) {
      this.loadingbar.start();
      this.ccpaFormConfigService.updateCCPAForm(this.orgId, this.propId, this.crid, this.formObject,
        this.constructor.name, moduleName.dsarWebFormModule)
        .subscribe((data) => {
          // this.navDirective.select(4);
          this.isDraftWebForm = true;
          this.isWebFormPublished = false;
          this.showFormStatus();
          this.alertMsg = data.response;
          this.isOpen = true;
          this.alertType = 'success';
          this.loadingbar.stop();
          this.isDirty = false;
          this.getDSARFormByCRID(this.crid,'dataupdated');
          this.licenseAvailabilityForFormAndRequestPerOrg(this.orgId)
        }, (error) => {
          this.loadingbar.stop();
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
        });
      if(this.formSaveMethod !== 'save'){
        this.modalRef.hide();
        this.isDirty = false;
      }
      this.isDirty = false;
      if(this.settingsFormchangeSubscription !== undefined){
        this.settingsFormchangeSubscription.unsubscribe();
      }else if(this.customFormchangeSubscription !== undefined) {
        this.customFormchangeSubscription.unsubscribe();
      } else if(this.basicFormSubscription !== undefined){
        this.basicFormSubscription.unsubscribe();
      }
    } else {
      if(this.formSaveMethod !== 'save' && this.isDirty && this.nextId !== 4){
        if(this.modalRef !== undefined){
          this.modalRef.hide();
        }
        this.isStepCovered = false;
        // this.isDirty = false;
        return true;
      } else if(this.formSaveMethod !== 'save' && !this.isDirty){ // just to check form
        this.modalRef.hide();
        // this.isDirty = false;
        return true;
      }
      const isWorkflowApproverIDAvailable = this.settingsForm.controls['workflow'].value !== undefined && this.settingsForm.controls['selectedApproverID'].value !== undefined;
      if(this.activeId === 3 && this.nextId === 4 || this.active === 3 && isWorkflowApproverIDAvailable){
        this.loadingbar.start();
        // return false;
        this.ccpaFormConfigService.createCCPAForm(this.orgId, this.propId, this.formObject,
          this.constructor.name, moduleName.dsarWebFormModule)
          .subscribe((data) => {
            this.navDirective.select(4);
            this.loadingbar.stop();
            this.crid = data.id;
            this.alertMsg = data.response;
            this.isOpen = true;
            this.alertType = 'success';
            this.isDirty = false;
            if(this.formSaveMethod !== 'save'){
              this.modalRef.hide();
              this.isDirty = false;
            }else{
              this.isDirty = false;
            }
          }, (error) => {
            this.loadingbar.stop();
            this.alertMsg = error;
            this.isOpen = true;
            this.alertType = 'danger';
          });
        this.isDirty = false;
        this.settingsFormchangeSubscription.unsubscribe();
      } else{
        if(this.formSaveMethod !== 'save'){
          this.modalRef.hide();
          this.isDirty = false;
        }else{
          this.isDirty = false;
          if(this.active === 1){
            this.navDirective.select(2);
          } else if(this.active === 2){
            this.navDirective.select(3);
          } else if(this.active === 3){
            this.navDirective.select(3);
          }
        }

      }
    }

  }
  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 2) {
      this.activeId = changeEvent.activeId;
      this.nextId = changeEvent.nextId;
      this.formSaveMethod = 'nav';
      this.basicFormSubmitted = true;
      this.formName = this.basicForm.controls['formname'].value;
      if (this.formName === undefined || this.formName === '') {
        changeEvent.preventDefault();
        this.alertMsg = `Please complete step 1 Basic and press next`;
        this.isOpen = true;
        this.alertType = 'danger';
        this.navDirective.select(1);
        this.isDirty = false;
      } else if (this.isDirty) {
        this.openModal(this.confirmSaveAlert);
      }
      else{
        this.navDirective.select(2);
      }
    } else if (changeEvent.nextId === 3) {
      this.activeId = changeEvent.activeId;
      this.nextId = changeEvent.nextId;
      this.formSaveMethod = 'nav';
      this.basicFormSubmitted = true;
      if(this.basicForm.controls['formname'].value !== undefined && this.isDirty){
        this.saveAsDraftCCPAFormConfiguration('nav');
      }else{
        if(this.basicForm.controls['formname'].value !== undefined && (this.workflow !== undefined || this.selectedApproverID !== undefined || this.daysleft !== null)){
          if(this.isdraftsubmitted && this.basicFormSubmitted){
            this.navDirective.select(3);
          }
          // this.basicFormSubmitted = false;
          //  this.getDSARFormByCRID(this.crid,'dataupdated');

        }else{
          this.isdraftsubmitted = true;
          this.basicFormSubmitted = true;
          this.isDirty = false;
          changeEvent.preventDefault();
          const stepnumber: number | string = this.formName === undefined ? '1 Basic, 2 Form & 3 Settings': '2 Form & 3 Settings';
          this.alertMsg = `Please complete step ${stepnumber} and press next`;
          this.isOpen = true;
          this.alertType = 'danger';
          if(this.basicForm.controls['formname'].value === undefined){
            this.navDirective.select(1);
          }else{
            this.navDirective.select(3);
          }

        }
      }
    } else if (changeEvent.nextId === 4) {
      this.formSaveMethod = 'nav';
      this.saveAsDraftCCPAFormConfiguration('nav');
      this.activeId = changeEvent.activeId;
      this.nextId = changeEvent.nextId;
      this.isdraftsubmitted = true;
      this.basicFormSubmitted = true;
      this.isResetlinkEnable = false;
      if (this.isDirty && this.workflow !== undefined && this.selectedApproverID !== undefined) {
        // this.openModal(this.confirmSaveAlert);
      }
      else if (this.workflow == undefined || this.selectedApproverID == undefined) {
        this.isdraftsubmitted = true;
        this.isDirty = false;
        changeEvent.preventDefault();
        const stepnumber: number | string = this.formName === undefined ? '1 Basic, 2 Form & 3 Settings' : '2 Form & 3 Settings';
        this.alertMsg = `Please complete step ${stepnumber} and press next`;
        this.isOpen = true;
        this.alertType = 'danger';
        this.navDirective.select(3);
      }
      else {
        this.isStepCovered = true;
        this.navDirective.select(3);
      }
    } else {
      this.navDirective.select(this.activeId);
    }
  }

  onChangeDaysLeft($event,daysleft){
    if ($event.target.value <= 45) {
      this.errorMsgdaysleft = '';
      this.isDirty = true;
      if(this.settingsForm !== undefined){
        this.settingsForm.control.get("daysleft").setValue($event.target.value);
      }
    }else{
      this.isDirty = false;
      this.errorMsgdaysleft = 'Should not greater than 45';
    }
  }

  finalPublishDSARForm() {
    if (this.crid !== undefined) {
      this.loadingbar.start();
      this.ccpaFormConfigService.publishDSARForm(this.orgId, this.propId, this.crid,
        this.constructor.name, moduleName.dsarWebFormModule).subscribe((resp) => {
        this.isWebFormPublished = true;
        this.isDraftWebForm = false;
        this.showFormStatus();
        this.alertMsg = resp.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.getDSARFormByCRID(this.crid,'dataupdated');
        this.navDirective.select(4);
        this.getWebFormScriptLink();
        this.licenseAvailabilityForFormAndRequestPerOrg(this.orgId);
        this.loadingbar.stop();
        if(this.isDirty){
          this.isDirty = false;
        }
      }, (error) => {
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      });
    }

  }

  updateWebcontrolIndex(indexData, arrayData) {
    //  this.webFormControlList = this.dsarFormService.getFormControlList();
    const controlArr: any = [];
    Object.keys(indexData).filter((t) => {
      if (t.includes('Index')) {
        controlArr.push(t);
      }
    });

    // for (const i in this.webFormControlList) {

    //   if (this.webFormControlList[i].indexCount == controlArr[i]) {
    //     this.webFormControlList[i].preferControlOrder = registerForm.value[controlArr[i]];
    //   }
    // }
    arrayData.forEach(e1 => controlArr.forEach((e2) => {
      if (e1.indexCount === e2) {
        e1.preferControlOrder = indexData[e2];
      }
    }));
    return arrayData;
  }
  createNewForm() {
    this.dsarFormService.removeControls();
    this.webFormControlList = this.dsarFormService.loadWebControls();
  }

  addUpdateFormControls(oldControlIndex, controlObj) {
    if (this.crid) {
      const webFormControlList = this.ccpaFormConfigService.getFormControlList();
      const customControlIndex = webFormControlList.findIndex((t) => t.indexCount === this.existingControl.indexCount);
      this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, controlObj);
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      this.isDirty = true;
    } else {
      this.dsarFormService.updateControl(this.webFormControlList[oldControlIndex], oldControlIndex, controlObj);
      this.webFormControlList = this.dsarFormService.getFormControlList();
      // this.cancelAddingFormControl('submit');
    }
  }

  rearrangeFormSequence(dataArray) {
    if(dataArray !== null){
      dataArray.sort((a, b) => {
        return a.preferControlOrder - b.preferControlOrder;
      });
      return dataArray;
    }
  }

  priviewPublishedForm() {
    if (!this.canDeactivate()) {
      this.openModal(this.confirmSaveAlert);
    } else {
      this.router.navigate(['/editwebforms', { crid: this.crid }]);
    }
  }

  onSubmitQuillEditorDataX() {
    // this.editorData =  this.quillEditorText.get('editor').value;
  }

  editQuillEditorDataPopup(content, field) {
    if (field === 'welcomeText') {
      this.isWelcomeEditor = true;
      this.isDirty = true;
      if (this.crid) {
        this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
        if (this.webFormControlList !== null) {
          const editText = this.webFormControlList.filter((t) => t.indexCount === 'welcome_text_Index');
          this.editorDataWelcome = editText[0].welcomeText;
        }
      } else {
        this.webFormControlList = this.dsarFormService.getFormControlList();
        const editText = this.webFormControlList.filter((t) => t.indexCount === 'welcome_text_Index');
        this.editorDataWelcome = editText[0].welcomeText;
      }

    } else {
      this.isWelcomeEditor = false;
      this.isDirty = true;
      if (this.crid) {
        this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
        if (this.webFormControlList !== null) {
          const editText = this.webFormControlList.filter((t) => t.indexCount === 'footer_text_Index');
          this.editorDataFooter = editText[0].footerText;
        }
      } else {
        this.webFormControlList = this.dsarFormService.getFormControlList();
        const editText = this.webFormControlList.filter((t) => t.indexCount === 'footer_text_Index');
        this.editorDataFooter = editText[0].footerText;
      }
    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      // this.quillEditorText.reset();
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.quillEditorText.reset();
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onCloseWelcomeTextEditor(){
    this.modalService.dismissAll();
    if (this.crid) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      if (this.webFormControlList !== null) {
        const editText = this.webFormControlList.filter((t) => t.indexCount === 'welcome_text_Index');
        this.editorDataWelcome = editText[0].welcomeText;
      }
    } else {
      this.webFormControlList = this.dsarFormService.getFormControlList();
      const editText = this.webFormControlList.filter((t) => t.indexCount === 'welcome_text_Index');
      this.editorDataWelcome = editText[0].welcomeText;
    }
  }

  onCloseFooterTextEditor(){
    this.modalService.dismissAll();
    if (this.crid) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      if (this.webFormControlList !== null) {
        const editText = this.webFormControlList.filter((t) => t.indexCount === 'footer_text_Index');
        this.editorDataFooter = editText[0].footerText;
      }
    } else {
      this.webFormControlList = this.dsarFormService.getFormControlList();
      const editText = this.webFormControlList.filter((t) => t.indexCount === 'footer_text_Index');
      this.editorDataFooter = editText[0].footerText;
    }
  }

  welcomeStyle(): object {

    return {
      'color': this.welcomeTextColor,
      'font-size': this.welcomeFontSize + 'px'
    };


  }

  footerStyle(): object {

    return {
      'color': this.footerTextColor,
      'font-size': this.footerFontSize + 'px'
    };
  }

  setHeaderStyle() {
    const headerObj = {
      control: 'img',
      controllabel: 'Header Logo',
      controlId: 'headerlogo',
      indexCount: 'header_logo_Index',
      headerColor: this.headerColor,
      logoURL: this.headerlogoBase64 // || this.cardImageBase64
    };
    const faviconObj = {
      control: 'favicon',
      controllabel: 'favicon',
      controlId: 'favicon',
      indexCount: 'favicon_Index',
      faviconURL: this.headerfaviconBase64
    };
    if (this.crid) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'headerlogo');
      this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, headerObj);
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();

      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      const faviconIndex = this.webFormControlList.findIndex((t) => t.controlId === 'favicon');
      this.ccpaFormConfigService.updateControl(this.webFormControlList[faviconIndex], faviconIndex, faviconObj);
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();

    } else {
      this.webFormControlList = this.dsarFormService.getFormControlList();
      const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'headerlogo');
      this.dsarFormService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, headerObj);
      this.webFormControlList = this.dsarFormService.getFormControlList();

      this.webFormControlList = this.dsarFormService.getFormControlList();
      const faviconIndex = this.webFormControlList.findIndex((t) => t.controlId === 'favicon');
      this.dsarFormService.updateControl(this.webFormControlList[faviconIndex], faviconIndex, faviconObj);
      this.webFormControlList = this.dsarFormService.getFormControlList();

    }
  }


  loadDefaultApprover() {
    if (this.orgId) {
      setTimeout(()=>{
        this.organizationService.getOrgTeamMembers(this.orgId).subscribe((data) => {
          this.ApproverList = data.response.filter((t) => t.role_name.indexOf('View') == -1 && t.email_verified);//&& t.role_name.indexOf('View') == -1 && t.email_verified
          const filterValue = this.ApproverList.filter((t) => t.approver_id === this.selectedApproverID);
          if (filterValue.length > 0) {
            this.defaultapprover = filterValue[0].approver_id;
          }
        });
      });
    }
  }

  loadWorkFlowList() {
    this.workFlowService.getWorkflow(this.constructor.name, moduleName.workFlowModule, this.currentManagedOrgID).subscribe((data) => {
      this.workFlowList = data.response;
      const filterValue = this.workFlowList.filter((t) => t.id === this.selectedWorkflowID);
      if (filterValue.length > 0) {
        this.workflow = filterValue[0].id;
      }
    }, (error) => {
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
    });
  }

  loadCountryList() {
    this.ccpaFormConfigService.getCountryList().subscribe((data) => this.contactList = data);
  }

  loadStateList() {
    this.ccpaFormConfigService.getStateList().subscribe((data) => this.stateList = data);
  }

  onSelectCountry(countryid) {
    this.filteredStateList = this.stateList.filter((item) => item.country_id === countryid);
  }

  previewCCPAForm() {
    if (this.orgId && this.propId) {
      const formStatus = this.isWebFormPublished && !this.isEditingPublishedForm && !this.isResetlinkEnable ? 'publish' : 'draft';
      if (window.location.hostname === 'localhost') { //for internal purpose
        window.open('http://localhost:4500/dsar/form/' + this.orgId + '/' + this.propId + '/' + this.crid + '/' + formStatus);
      } else{
        window.open(environment.privacyportalUrl + this.orgId + '/' + this.propId + '/' + this.crid + '/' + formStatus);
      }
    } else {
      this.alertMsg = 'Organization or Property not found!';
      this.isOpen = true;
      this.alertType = 'danger';
    }
  }

  getWebFormScriptLink() {
    if (this.orgId && this.propId) {
      const formStatus = 'publish';
      if (window.location.hostname === 'localhost') { //for internal purpose
        this.scriptcode = 'http://localhost:4500/dsar/form/' + this.orgId + '/' + this.propId + '/' + this.crid + '/' + formStatus;
      } else {
        this.scriptcode = environment.privacyportalUrl + this.orgId + '/' + this.propId + '/' + this.crid + '/' + formStatus;
      }
    }
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  onPrevious(tabid) {
    if (tabid === 2) {
      if (this.crid) {
        this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      } else {
        this.webFormControlList = this.dsarFormService.getFormControlList();
      }
      // this.getDSARFormByCRID(this.crid);
    }
    this.navDirective.select(tabid);
  }

  getWorkflowWithApproverID() {
    const retrivedData = this.ccpaFormConfigService.getCurrentSelectedFormData();
    if(retrivedData !== null){
      if(retrivedData.approver){
        this.defaultapprover = retrivedData.approver;
        this.selectedApproverID = retrivedData.approver;
        this.workflow = retrivedData.workflow;
        this.isEmailVerificationRequired = retrivedData.email_verified;
        this.daysleft = retrivedData.days_left;
      }else if(retrivedData.approver_id !== undefined){
        this.defaultapprover = retrivedData.approver_id;
        this.selectedApproverID = retrivedData.approver_id;
        this.workflow = retrivedData.workflow_id;
        this.daysleft = retrivedData.days_left;
      }
      if(retrivedData.request_form !== undefined && retrivedData.request_form !== null){
        retrivedData.request_form.filter((t) => {
          if (t.controlId === 'fileupload') {
            this.isFileUploadRequired = t.requiredfield;
            this.isFileuploadRequiredField = t.ismandatory;
          } else if (t.controlId === 'footertext') {
            this.footerText = t.footerText;
            this.footerTextColor = t.footerTextColor;
            this.footerFontSize = t.footerFontSize;
          } else if (t.controlId === 'welcometext') {
            this.welcomeText = t.welcomeText;
            this.welcomeTextColor = t.welcomeTextColor;
            this.welcomeFontSize = t.welcomeFontSize;
          } else if (t.controlId === 'headerlogo') {
            this.headerlogoBase64 = t.logoURL;
            this.headerColor = t.headerColor;
          } else if (t.controlId === 'favicon') {
            this.headerfaviconBase64 = t.faviconURL;
          }
        });

        if (retrivedData.form_status === 'draft') {
          this.isDraftWebForm = true;
          this.isWebFormPublished = false;
          this.isEditingPublishedForm = true;
        }

        this.pageLoadFormObj = {
          form_name: retrivedData.form_name,
          form_status: retrivedData.form_status, // 'draft',
        };

        this.pageLoadFormSettingsObj = {
          settings: {
            approver: this.selectedApproverID, // this.defaultapprover,
            workflow: this.workflow,
            days_left: Number(this.daysleft),
            email_verified: this.isEmailVerificationRequired || false,
            captcha: this.isCaptchaVerificationRequired || false
          }
        }

        this.pageLoadFormControls = {
          request_form: retrivedData.request_form
        }
      }
    } else{
      return false;
    }
  }

  uploadFile(event) {
    const fileExtArray = ['pdf', 'txt', 'jpeg', 'jpg', 'png', 'doc', 'docx', 'csv', 'xls'];
    let totalSizeMB = event.target.files[0].size / Math.pow(1024,2)
    if (totalSizeMB > 10.5) {
      this.showFilesizeerror = true;
      return false;
    } else {
      const fileExtn = event.target.files[0].name.split('.').pop();
      if (fileExtArray.some((t) => t == fileExtn)) {
        this.showFilesizeerror = false;
        this.showFileExtnerror = false;
        const file = event.target.files[0];
        this.uploadFilename = file.name;
        // this.subTaskResponseForm.get('uploaddocument').setValue(file);
      } else {
        this.showFileExtnerror = true;
      }

    }

    // }
  }

  allowFileupload(event) {
    this.isDirty = true;
    this.isFileUploadRequired = event.target.checked;
    (this.isFileUploadRequired) ? this.isFileuploadRequiredFieldVisible = true : this.isFileuploadRequiredFieldVisible = false;
    if (this.crid) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'fileupload');
      const updateobj = this.webFormControlList[customControlIndex];
      updateobj.requiredfield = event.target.checked;
      // const isMandatoryField = this.isFileuploadRequiredField ? true : false;
      // updateobj.ismandatory = isMandatoryField;
      updateobj.ismandatory = false;
      updateobj.preferControlOrder = this.webFormControlList.length - 1;
      this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, updateobj);
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      this.rearrangeFormSequence(this.webFormControlList);
    } else {
      this.webFormControlList = this.dsarFormService.getFormControlList();
      const oldControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'fileupload');
      const obj = this.webFormControlList[oldControlIndex];
      obj.requiredfield = event.target.checked;
      // const isMandatoryField = this.isFileuploadRequiredField ? true : false;
      obj.ismandatory = false;
      obj.preferControlOrder = this.webFormControlList.length - 1;
      this.dsarFormService.updateControl(this.webFormControlList[oldControlIndex], oldControlIndex, obj);
      this.webFormControlList = this.dsarFormService.getFormControlList();
      this.rearrangeFormSequence(this.webFormControlList);
    }
  }

  allowEmailVerification(event) {
    this.isDirty = true;
    this.isEmailVerificationRequired = event.target.checked;
  }

  allowCaptchaVerification(event) {
    this.isDirty = true;
    this.isCaptchaVerificationRequired = event.target.checked;
    if (this.crid) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'captchacontrol');
      const updateobj = this.webFormControlList[customControlIndex];
      updateobj.requiredfield = event.target.checked;
      updateobj.preferControlOrder = this.webFormControlList.length - 1;
      this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, updateobj);
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      this.rearrangeFormSequence(this.webFormControlList);
    } else {
      this.webFormControlList = this.dsarFormService.getFormControlList();
      const oldControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'captchacontrol');
      const obj = this.webFormControlList[oldControlIndex];
      obj.requiredfield = event.target.checked;
      obj.preferControlOrder = this.webFormControlList.length - 1;
      this.dsarFormService.updateControl(this.webFormControlList[oldControlIndex], oldControlIndex, obj);
      this.webFormControlList = this.dsarFormService.getFormControlList();
      this.rearrangeFormSequence(this.webFormControlList);
    }
  }

  loadCaptcha() {
    if (window.location.hostname === 'localhost') {
      this.imgUrl = 'https://develop-cmp-api.adzpier-staging.com/api/v1/captcha/image';
    }
    if (window.location.hostname === 'develop-cmp.adzpier-staging.com') {
      this.imgUrl = 'https://develop-cmp-api.adzpier-staging.com/api/v1/captcha/image';
    } else if (window.location.hostname === 'cmp.adzpier-staging.com') {
      this.imgUrl = 'https://privacyportal.adzpier-staging.com/api/v1/captcha/image';
    } else if (window.location.hostname === 'qa-cmp.adzpier-staging.com') {
      this.imgUrl = 'https://qa-privacyportal.adzpier-staging.com/api/v1/captcha/image';
    }  else if (window.location.hostname === 'portal.adzapier.com') {
      this.imgUrl = 'https://privacyportal.primeconsent.com/api/v1/captcha/image';
    }

    this.ccpaFormConfigService.getCaptcha(this.constructor.name, moduleName.dsarWebFormModule).subscribe((data) => {
      this.captchaid = data.id;
      this.imageToShow = 'data:image/png;base64' + ',' + data.captcha;
    });

  }

  onCheckboxChange($event) {
    this.isRequiredField = $event.target.checked;
    if (this.selectedControlObj !== undefined) {
      this.selectedControlObj.requiredfield = $event.target.checked;
      if (this.crid) {
        const customControlIndex = this.ccpaFormConfigService.getFormControlList()
          .findIndex((t) => t.indexCount === this.selectedControlObj.indexCount);
        this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, this.selectedControlObj);
        this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      } else {
        const customControlIndex = this.dsarFormService.getFormControlList()
          .findIndex((t) => t.indexCount === this.selectedControlObj.indexCount);
        this.dsarFormService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, this.selectedControlObj);
        this.webFormControlList = this.dsarFormService.getFormControlList();
      }
    }
  }

  onCheckboxChangeUpload($event) {
    this.isFileuploadRequiredField = $event.target.checked;
    if (this.crid) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'fileupload');
      const updateobj = this.webFormControlList[customControlIndex];
      updateobj.ismandatory = this.isFileuploadRequiredField ? true : false;
      updateobj.preferControlOrder = this.webFormControlList.length - 1;
      this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, updateobj);
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      this.rearrangeFormSequence(this.webFormControlList);
    } else {
      this.webFormControlList = this.dsarFormService.getFormControlList();
      const oldControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'fileupload');
      const obj = this.webFormControlList[oldControlIndex];
      obj.ismandatory = this.isFileuploadRequiredField ? true : false;
      obj.preferControlOrder = this.webFormControlList.length - 1;
      this.dsarFormService.updateControl(this.webFormControlList[oldControlIndex], oldControlIndex, obj);
      this.webFormControlList = this.dsarFormService.getFormControlList();
      this.rearrangeFormSequence(this.webFormControlList);
    }
  }


  copyToClipBoard(contentType) {
    let textarea = null;
    textarea = document.createElement('textarea');
    textarea.style.height = '0px';
    textarea.style.left = '-100px';
    textarea.style.opacity = '0';
    textarea.style.position = 'fixed';
    textarea.style.top = '-100px';
    textarea.style.width = '0px';
    document.body.appendChild(textarea);
    // Set and select the value (creating an active Selection range).
    if (contentType === 'embedcode') {
      textarea.value = this.azEmbedCode.nativeElement.innerText.trim();
      textarea.select();
      document.execCommand('copy');
      this.isCodeCopied = !this.isCodeCopied;
    } else {
      textarea.value = this.shareLinkCode.nativeElement.innerText.trim();
      textarea.select();
      document.execCommand('copy');
      this.isCodeCopied = !this.isCodeCopied;
    }

    if (textarea && textarea.parentNode) {
      textarea.parentNode.removeChild(textarea);
    }
  }

  updateCaptchaPosition() {
    if (this.crid) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();

      const fileUploadControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'fileupload');
      const updateFileuploadposition = this.webFormControlList.splice(fileUploadControlIndex, 1);
      this.webFormControlList = this.webFormControlList.concat(updateFileuploadposition);

      const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'captchacontrol');
      const updateobj = this.webFormControlList[customControlIndex];
      const elementToReplace = this.webFormControlList.splice(customControlIndex, 1);
      this.webFormControlList = this.webFormControlList.concat(elementToReplace);

      this.ccpaFormConfigService.setFormControlList(this.webFormControlList);

      // updateobj.preferControlOrder = this.webFormControlList.length - 1;
      // this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, updateobj);
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      this.rearrangeFormSequence(this.webFormControlList);
      // "fileupload"
    } else {
      this.webFormControlList = this.dsarFormService.getFormControlList();

      const fileUploadControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'fileupload');
      const updateFileuploadposition = this.webFormControlList.splice(fileUploadControlIndex, 1);
      this.webFormControlList = this.webFormControlList.concat(updateFileuploadposition);

      const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'captchacontrol');
      const updateobj = this.webFormControlList[customControlIndex];
      const elementToReplace = this.webFormControlList.splice(customControlIndex, 1);
      this.webFormControlList = this.webFormControlList.concat(elementToReplace);

      this.dsarFormService.setFormControlList(this.webFormControlList);
      // updateobj.preferControlOrder = this.webFormControlList.length + 1;
      // this.dsarFormService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, updateobj);
      this.webFormControlList = this.dsarFormService.getFormControlList();
      this.rearrangeFormSequence(this.webFormControlList);
    }
  }

  showFormStatus(): string {
    if (this.isWebFormPublished && !this.isDraftWebForm) {
      return 'Publish';
    } else {
      return 'Draft';
    }

  }

  transform(imgData) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(imgData);
  }

  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.isDirty = true;
      // Size Filter Bytes
      const max_size = 1000000;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;
      this.logoFilename = fileInput.target.files[0].name;
      const fileExtn = fileInput.target.files[0].name.split('.').pop();
      this.logoFilesize = this.formatBytes(fileInput.target.files[0].size);
      if (fileInput.target.files[0].size > max_size) {
        this.alertMsg = 'Maxium 1 MB size is allowed!';
        this.isOpen = true;
        this.alertType = 'danger';
        return false;
      }
      if (allowed_types.some((t) => t === fileExtn)) {
        // if (fileInput.target.files[0].some((t) => t === allowed_types)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          this.logoHeight = img_height / 2;
          this.logoWidth = img_width / 2;

          if (img_height > max_height && img_width > max_width) {
            this.imageError =
              'Maximum dimentions allowed ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.headerlogoBase64 = imgBase64Path;
            this.isImageSaved = true;
            this.setHeaderStyle();
            // this.previewImagePath = imgBase64Path;
          }
        };
        this.cdRef.markForCheck();
      };
      // this.setHeaderStyle();
      // this.getWorkflowWithApproverID();
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  faviconChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.isDirty = true;
      // Size Filter Bytes
      const max_size = 1000000;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 32;
      const max_width = 32;
      this.faviconFilename = fileInput.target.files[0].name;
      const fileExtn = fileInput.target.files[0].name.split('.').pop();
      this.faviconFilesize = this.formatBytes(fileInput.target.files[0].size);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          this.logoHeight = img_height;
          this.logoWidth = img_width;

          if (img_height > max_height && img_width > max_width) {
            this.imageError = 'Maximum dimentions allowed ' + max_height + '*' + max_width + ' px' + ' for favicon';
            this.alertMsg = this.imageError;
            this.isOpen = true;
            this.alertType = 'danger';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.headerfaviconBase64 = imgBase64Path;
            this.isImageSaved = true;
            this.setHeaderStyle();
          }
        };
        this.cdRef.markForCheck();
      };
      // this.setHeaderStyle();
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  deleteSelectedLogo() {
    this.headerlogoBase64 = '';
    this.logoFilesize = '';
    this.logoWidth = 0;
    this.logoHeight = 0;
    this.logoFilename = '';
    this.isDirty = true;
    this.setHeaderStyle();
    this.headerLogoForm.reset();
  }

  deleteSelectedFavicon() {
    this.headerfaviconBase64 = '';
    this.faviconFilesize = '';
    this.logoWidth = 0;
    this.logoHeight = 0;
    this.faviconFilename = '';
    this.isDirty = true;
    this.setHeaderStyle();
    this.faviconForm.reset();
  }

  getDSARFormByCRID(responsID,actionperformed) {
    //  this.loadingbar.start();
    if (this.orgId && this.propId) {
      return this.ccpaFormConfigService.getCCPAFormConfigByID(this.orgId, this.propId, responsID, actionperformed,
        this.constructor.name, moduleName.dsarWebFormModule).subscribe((data) => {
          // this.ccpaFormConfigService.captureCurrentSelectedFormData(data);
          // tslint:disable-next-line: max-line-length
          if(data){
            this.formObject = data.response;
            this.ccpaFormConfigService.removeCurrentSelectedFormData();
            this.ccpaFormConfigService.captureCurrentSelectedFormData(data);
            this.isCaptchaVerificationRequired = data.response.captcha;
            if (this.isResetlinkEnable && this.isWebFormPublished && this.isEditingPublishedForm) {
              if (this.basicForm.controls['formname'].value !== '') {
                this.basicForm.controls['formname'].setValue(this.basicForm.controls['formname'].value);
              }
            } else {
              this.formName = data.response.form_name;
              this.basicForm.controls['formname'].setValue(data.response.form_name);
            }
            this.pageLoadFormObj = {
              form_name: data.response.form_name,
              form_status: data.response.form_status
            }
            this.selectedApproverID = data.response.settings.approver;// || retrivedData.approver_id;
            this.workflow = data.response.settings.workflow;// || retrivedData.workflow_id;
            // this.formName = this.formName || retrivedData.form_name;
            this.isEmailVerificationRequired = data.response.email_verified || data.response.settings.email_verified || false;
            this.daysleft = data.response.settings.days_left;

            const key = 'request_form';
            if(data.response[key] !== null) {
              this.webFormControlList = data.response[key];
              data.response[key].filter((t) => {
                if (t.controlId === 'fileupload') {
                  this.isFileUploadRequired = t.requiredfield;
                  this.isFileuploadRequiredField = t.ismandatory;
                } else if (t.controlId === 'footertext') {
                  this.footerText = t.footerText;
                  this.footerTextColor = t.footerTextColor;
                  this.footerFontSize = t.footerFontSize;
                  this.editorDataFooter = this.footerText;
                } else if (t.controlId === 'welcometext') {
                  this.welcomeText = t.welcomeText;
                  this.welcomeTextColor = t.welcomeTextColor;
                  this.welcomeFontSize = t.welcomeFontSize;
                  this.editorDataWelcome = this.welcomeText;
                } else if (t.controlId === 'headerlogo') {
                  this.headerlogoBase64 = t.logoURL;
                  this.headerColor = t.headerColor;
                } else if (t.controlId === 'subjecttype') {
                  this.sideMenuSubjectTypeOptions = t.selectOptions;
                  this.lblText = t.controllabel;
                } else if (t.controlId === 'requesttype') {
                  this.sideMenuRequestTypeOptions = t.selectOptions;
                  this.lblText = t.controllabel;
                } else if (t.controlId === 'favicon') {
                  this.headerfaviconBase64 = t.faviconURL;
                }
              });
            }
            this.ccpaFormConfigService.setFormControlList(this.webFormControlList);
            if (data.response['form_status'] === 'publish') {
              if (!this.isResetlinkEnable) {
                this.isWebFormPublished = true;
                this.isDraftWebForm = false;
                this.isEditingPublishedForm = false;
              }
            } else {
              this.isWebFormPublished = false;
              this.isDraftWebForm = true;
              this.isEditingPublishedForm = true;
            }
            this.showFormStatus();
            this.pageLoadFormSettingsObj = {
              settings: {
                approver: data.response.settings.approver, //this.selectedApproverID, // this.defaultapprover,
                workflow: data.response.settings.workflow,
                days_left: data.response.settings.days_left,// Number(this.daysleft),
                email_verified: this.isEmailVerificationRequired || false,
                captcha: this.isCaptchaVerificationRequired || false
              }
            }
            // this.loadingbar.stop();
          }
        }, (error) => {
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
        }
      );
    }
    this.isDirty = false;
  }

  editFormAfterPublish() {
    this.isEditingPublishedForm = !this.isEditingPublishedForm;
    this.isWebFormPublished = false;
    this.isDraftWebForm = true;
    this.pageLoadFormObj = {
      form_name: this.formName,
      form_status: this.showFormStatus().toLowerCase()
    }
  }

  editFormBeforePublish() {
    this.isEditingPublishedForm = false
    this.isWebFormPublished = false;
    this.isDraftWebForm = true;
  }

  togglePublish() {
    if (this.isWebFormPublished) {
      this.openModal(this.confirmModal);
    } else {
      return this.finalPublishDSARForm();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalSubscription = this.bsmodalService.onHide.subscribe((status: string | any) => {
      this.isModalOpen = status ? true : false;
      this.modalSubscription.unsubscribe();
    });
    this.modalRef = this.bsmodalService.show(template, { class: '', keyboard: false, backdrop: true, ignoreBackdropClick: true });
  }

  confirmForEditing() {
    this.editFormAfterPublish();
    this.navDirective.select(1);
    this.modalRef.hide();
  }

  decline() {
    this.modalRef.hide();
  }

  closeModal() {
    if(this.formSaveMethod === 'nav'){
      // this.isDirty = false;
      if(this.modalRef !== undefined){
        this.modalRef.hide();
      }
    } else{ // for edit button
      if(this.modalRef !== undefined){
        this.modalRef.hide();
      }
    }
  }

  resetWebform() {
    this.isEditingPublishedForm = !this.isEditingPublishedForm;
    this.isdraftsubmitted = false;
    this.basicFormSubmitted = false;
    if(this.crid !== null && this.settingsForm.form.dirty){
      this.isDirty = false;
      this.settingsForm.form.markAsPristine();
      this.getDSARFormByCRID(this.crid,'dataupdated');
    } else if (this.crid == null && this.settingsForm.form.dirty){
      this.isDirty = true;
      this.settingsForm.form.markAsPristine();
      this.navDirective.select(this.activeId);
    }
    this.isDirty = true;
    this.modalRef.hide();
    this.navDirective.select(this.activeId);
  }

  disableEditPublishBtn(): boolean {
    if (!this.isWebFormPublished && this.isEditingPublishedForm && !this.isResetlinkEnable) {
      //  this.isResetlinkEnable = false;
      return false;
    } else if (this.isWebFormPublished && this.isEditingPublishedForm && this.isResetlinkEnable) {
      //  this.isResetlinkEnable = true;
      return true;
    }
  }

  isEditorDisabled(): object {
    if (this.isWebFormPublished && !this.isEditingPublishedForm) {
      return {
        'height': '200px',
        'background-color': '#f5f6fa',
        'cursor': 'not-allowed'
      };
    } else {
      return {
        'height': '200px',
        'background-color': '#ffffff'
      };
    }
  }

  onColorSelection(updatedColor: string, modelName){
    if(modelName === 'headerColor'){
      this.headerColor = updatedColor;
      this.isDirty = true;
    } else if(modelName === 'welcomeTextColor'){
      this.welcomeTextColor = updatedColor;
      this.isDirty = true;
    } else if(modelName === 'footerTextColor'){
      this.footerTextColor = updatedColor;
      this.isDirty = true;
    }
  }

  onColorHexChange(updatedHex:string){
    this.headerColor = updatedHex;
    this.isDirty = true;
  }

  getEditorFontSize(){
    const tagObj = [{"ql-size-huge":'40'},{"ql-size-large":'24'},{"ql-size-small":'12'},{"ql-align-center":'13'},{"ql-align-right":'13'},{"<p>":'13'},{"<p>":'14'},{"<h1>":'40'},{"<h1>":'28'},{"<h2>":'24'}]
      for (const key in tagObj){
        if(this.quillEditorText.get('editor').value.indexOf(Object.keys(tagObj[key])) !== -1){
          if(this.isWelcomeEditor){
            return  this.welcomeFontSize = Object.values(tagObj[key])[0];
          } else{
            return this.footerFontSize = Object.values(tagObj[key])[0];
          }
        }
      }
    }

  onLabelChange($event) {
    //  this.cd.detectChanges();
    if(this.webFormControlList !== undefined){
      const isLabelExist = this.webFormControlList.findIndex((t) => {
        t.controllabel === $event.target.value;
      });
      if(isLabelExist !== -1 && this.changeControlType === null){
        this.alertMsg = 'Label already exist!'
        this.isOpen = true;
        this.alertType = 'danger';
        return false;
      }
    }
  }

  accordionChangeStatus(event: boolean, tag) {
    if (tag === 'first') {
      this.isDirty = false;
      return this.accordionStatus.isFirstopen = event;
    } else if (tag === 'second') {
      this.isDirty = false;
      return this.accordionStatus.isSecondopen = event;
    } else if (tag === 'third') {
      this.isDirty = false;
      return this.accordionStatus.isThirdopen = event;
    }
  }

  licenseAvailabilityForFormAndRequestPerOrg(org){
    this.dataService.checkLicenseAvailabilityPerOrganization(org).pipe(take(1)).subscribe(results => {
      let finalObj = {
        ...results[0].response,
        ...results[1].response,
        ...results[2].response
      }
      this.dataService.setAvailableLicenseForFormAndRequestPerOrg(finalObj);
    },(error)=>{
      console.log(error)
    });
  }

  navigateToWebForm() {
    this.router.navigate(['/privacy/dsar/webforms']);
  }

  canDeactivate() {
    return this.isDirty;
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

  ngAfterViewChecked(){
    // this.cdRef.detectChanges();
    if(this.customFormFields !== undefined){
      this.customFormchangeSubscription = this.customFormFields.valueChanges.subscribe((data)=> {
        if(this.customFormFields !== undefined){
          if(this.customFormFields.form.dirty){
            this.isDirty = true;
          }
        }
      });
    }
    if(this.settingsForm !== undefined){
      this.settingsFormchangeSubscription = this.settingsForm.valueChanges.subscribe(e => {
        if(this.settingsForm.form.dirty){
          this.isDirty = true;
        }
      });
    }
    if(this.basicForm !== undefined){
      this.basicFormSubscription = this.basicForm.valueChanges.subscribe(e => {
        if (e.formname !== this.formName) {
          this.isDirty = true;
        }else{
          this.isDirty = false;
        }
      });
    }

  }

  ngAfterViewInit(){
    //   this.headerNav.loadOrganizationWithProperty();
    //   this.cdRef.detectChanges();
    //   if(this.headerNav !== undefined){
    //   this.selectedProperty = this.headerNav.currentProperty;
    //  this.currentOrganization = this.headerNav.currentOrganization;// orgDetails.organization_name;
    //  console.log(this.selectedProperty,'selectedProperty..2642..');
    //  this.basicForm.controls['selectedProperty'].setValue(this.selectedProperty);
    //  this.basicForm.controls['currentOrganization'].setValue(this.currentOrganization);
    //   }
  }

  getUpdatedFormList():any {
    return this.dsarFormService.getFormControlList();
  }

  ngOnDestroy() {
    this.webFormControlList = [];
    this.selectedwebFormControlList = [];
    if(this.customFormchangeSubscription !== undefined){
      this.customFormchangeSubscription.unsubscribe();
    }
    if(this.settingsFormchangeSubscription !== undefined){
      this.settingsFormchangeSubscription.unsubscribe();
    }
    if(this.basicFormSubscription !== undefined){
      this.basicFormSubscription.unsubscribe();
    }

  }

  loadOrgProperty(){
    this.organizationService.getOrganizationWithProperty().subscribe((data) => {

      this.orgPropertyMenu = data.response;
      const findOidIndex = this.orgPropertyMenu.findIndex((t) => t.id == this.queryOID) //finding oid
      if(findOidIndex !== -1){
        const activePro = this.orgPropertyMenu[findOidIndex]; //based on oid finding propid
        const propobj = activePro !== undefined && activePro.property.filter((el)=>el.property_id === this.queryPID);
        if(propobj){
          const obj = {
            organization_id: activePro.id,
            organization_name: activePro.orgname,
            property_id: propobj[0].property_id,
            property_name: propobj[0].property_name
          };
          this.selectedProperty = obj.property_name;
          this.basicForm.controls['selectedProperty'].setValue(this.selectedProperty);
          this.basicForm.controls['currentOrganization'].setValue(this.currentOrganization);
        }

      }
    });
  }



}

interface CustomControls {
  [key: string]: any;
}


