import {
  Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation,
  ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, AfterContentChecked, TemplateRef
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
@Component({
  selector: 'app-dsarform',
  templateUrl: './dsarform.component.html',
  styleUrls: ['./dsarform.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default

})
export class DsarformComponent implements OnInit, AfterContentChecked, OnDestroy, DirtyComponents {
  @ViewChild('editor', { static: true }) editor;
  @ViewChild('azEmbedCode', { static: false }) public azEmbedCode: ElementRef<any>;
  @ViewChild('shareLinkCode', { static: false }) public shareLinkCode: ElementRef<any>;
  @ViewChild('nav', { static: false }) navTab: ElementRef<any>;
  @ViewChild(NgbNav, { static: false }) navDirective = null;
  @ViewChild('confirmEdit', { static: false }) confirmModal: TemplateRef<any>;
  @ViewChild('registerForm', { static: false }) registerForm: any;
  @ViewChild('customFields', { static: false }) customFormFields: NgForm;
  @ViewChild('confirmSaveAlert', { static: false }) confirmSaveAlert: TemplateRef<any>;
  @ViewChild('basicForm', { static: false }) basicDetailForm: NgForm;
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
  webFormControlList: any;
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
  formwizardStatus = {
    isFormOnefinish: true,
    isFormTwofinish: false,
    isFormThreefinish: false,
    isFormFourfinish: false
  }
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
    private dataService: DataService
  ) {

    this.count = 0;

    this.activatedRoute.paramMap.subscribe(params => {
      // console.log(params, 'params..');
      this.crid = params.get('id');
      // this.selectedwebFormControlList = this.
    });

  }

  ngOnInit() {
    this.getCCPAdefaultConfigById();
    // this.loadWebControl();
    this.organizationService.currentProperty.subscribe((response) => {
      //  this.loadingbar.stop();
      if (response !== '') {
        this.selectedProperty = response.property_name;
        this.currentOrganization = response.organization_name;
        this.orgId = response.organization_id;
        this.propId = response.property_id;
      } else {
        const orgDetails = this.organizationService.getCurrentOrgWithProperty();
        this.currentOrganization = orgDetails.organization_name;
        this.selectedProperty = orgDetails.property_name;
        this.orgId = orgDetails.organization_id;
        this.propId = orgDetails.property_id;
        this.loading = false;
      }
    });

    this.basicForm = this.fb.group({
      formname: ['', [Validators.required]],
      currentOrganization: [{ value: '', disabled: true }],
      selectedProperty: [{ value: '', disabled: true }]
    });
    this.basicForm.valueChanges.subscribe(e => {
      if (e.formname !== this.basicForm.controls['formname'].value) {
        this.isDirty = true;
      } else {
        this.isDirty = false;
      }
    })
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
  }
  get stepFormOne() { return this.basicForm.controls; }
  get formLogo() { return this.headerLogoForm.controls; }
  get faviconLogo() { return this.faviconForm.controls; }
  basicFormdata(saveMethod) {
    let isFormnameChanged;
    this.basicFormSubmitted = true;
    if (this.basicForm.invalid) {
      return false;
    } else {
      this.formName = this.basicForm.value.formname;
      let formObjstatus = {
        form_name: this.formName,
        form_status: this.showFormStatus().toLowerCase()
      }
      if(this.pageLoadFormObj !== undefined){
        isFormnameChanged = JSON.stringify(this.pageLoadFormObj) !== JSON.stringify(formObjstatus);
        console.log(this.canDeactivate(), 'this.canDeactivate()..');
        if(saveMethod === 'nav' && isFormnameChanged){
         // if (this.canDeactivate()) {
            this.openModal(this.confirmSaveAlert);
        //  }
          
        } else if(saveMethod === 'save' && isFormnameChanged){
          this.addUpdateDSARForm();  
        } else{
            // if(this.crid){
            //  this.getDSARFormByCRID(this.crid);
            // } 
          this.navDirective.select(2);
        }
      }else{
        this.isDirty = true;
        this.navDirective.select(2); // for first time form creation
      }
      
     this.formwizardStatus.isFormOnefinish = false;
     this.formwizardStatus.isFormTwofinish = true;
     
      // else{
      //   this.addUpdateDSARForm();
      // }     
    
    }

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
          this.formName = data.form_name || data.web_form_name;
          this.daysleft = data.days_left || 45;
          if (data.form_status === 'draft') {
            this.isDraftWebForm = true;
            this.isEditingPublishedForm = true;
          }
          //  this.selectedApproverID = data.approver;
          // this.selectedWorkflowID = data.workflow;
          const isUUID = uuidRegx.test(data.approver);
          if (isUUID) {
            this.selectedApproverID = data.approver;
            this.workflow = data.workflow;
          } else {
            this.selectedApproverID = data.approver_id;
            this.workflow = data.workflow_id;
            //  this.getWorkflowWithApproverID();
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
            } else if (t.controlId === 'captchacontrol') {
              this.isCaptchaVerificationRequired = (t.requiredfield === '') ? false : true;
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
          this.isFileuploadRequiredField = (t.ismandatory === '') ? false : true;
        } else if (t.controlId === 'captchacontrol') {
          this.isCaptchaVerificationRequired = (t.requiredfield === '') ? false : true;
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
      this.reqURLObj = { crid: formcrid, orgid: this.organizationID, propid: this.propId };
      this.organizationService.getOrganization.subscribe((response) => this.currentOrgID = response);
    }
  }

  getCCPAdefaultConfigById() {
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
      this.getDSARFormByCRID(this.crid);
      this.getWorkflowWithApproverID();
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
      // console.log(this.sideMenuRequestTypeOptions);
      return this.sideMenuRequestTypeOptions;
    } else {
      // console.log(this.sideMenuSubjectTypeOptions);
      return this.sideMenuSubjectTypeOptions;
    }


  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }



  register(formData: NgForm) {
    console.log(formData.value, 'register..');
    this.setHeaderStyle();
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.webFormControlList, event.previousIndex, event.currentIndex);
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

  onFormSubmit(data: NgForm) {
    console.log(data, 'onFormSubmit..');
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
        this.sideMenuRequestTypeOptions = this.selectedControlObj.selectOptions
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

  editSelectedRow(data) {
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
      this.ccpaFormConfigService.deleteControl(item);
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
    } else {
      this.dsarFormService.deleteControl(item);
      this.webFormControlList = this.dsarFormService.getFormControlList();
    }
  }

  isSelected(i): boolean {
    return this.selectedRow === i;
  }

  saveCurrentItem(i) {
    console.log(!this.isSelected(i), 'isSelected..');
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
  }

  addCustomReqestSubjectType() {
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
    this.selectOptions.splice(index, 1);
  }

  deleteSubjectOption(index) {
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
    this.sideMenuRequestTypeOptions.splice(index, 1);
  }


  cancelForm() {
    this.showFormOption = true;
  }

  addCustomFields(formControls: NgForm) {
   // this.isDirty = true;
    this.trimLabel = formControls.value.lblText.split(' ').join('_').toLowerCase();
    this.formControlLabel = formControls.value.lblText;
    //  const isLabelExist = this.webFormControlList.filter((t) => t.controllabel === this.trimLabel).length > 0;
    this.changeControlTypes();
    this.cancelAddingFormControl('submit');
    
  }

  changeControlTypes() {
    //  const controlLabel =  this.formControlLabel !== undefined ? this.formControlLabel : this.lblText;
    this.trimLabel = this.lblText.split(' ').join('_').toLowerCase();
    const isLabelExist = this.webFormControlList.findIndex((t) => t.controllabel === this.formControlLabel || this.lblText);
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
          controllabel: this.formControlLabel || this.lblText, // formControls.value.lblText,
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

        this.selectOptions.forEach(element => {
          element.keylabel = this.trimLabel;
        });
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
            controllabel: this.formControlLabel || this.lblText, // formControls.value.lblText,
            indexCount: this.trimLabel,
            control: updatedControlType || this.existingControl.control,
            controlId: this.existingControl.controlId,
            selectOptions: this.existingControl.selectOptions,
            requiredfield: this.isRequiredField
          };
          const optionLength = this.selectOptions.length;
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
  //  this.changeControlTypes();
  }

  addingFormControl() {
  //  console.log(this.selectedFormOption,'selectedFormOption..');
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
      this.webFormControlList = this.dsarFormService.getFormControlList();
    } else if (actionType === 'cancel' && this.crid !== null) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
    } else if (actionType === 'submit' && this.crid !== null) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      this.isDirty = true;
    } 
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
      this.isDraftWebForm = true;
      this.active = 3;
      if(this.crid){
        if(this.isDirty && saveType === 'nav'){
          this.openModal(this.confirmSaveAlert); 
        }else{
          this.addUpdateDSARForm();
        }
      }
      this.formwizardStatus.isFormTwofinish = false;
      this.formwizardStatus.isFormThreefinish = true;
    }
  }

  createDraft(saveType) {
    if (this.isWebFormPublished) {
      this.navDirective.select(4);
    } else {
      this.isResetlinkEnable = false;
      this.isdraftsubmitted = true;
      if (this.defaultapprover === undefined) {
        return false;
      } else {

        const updatedWebForm = this.crid ? this.ccpaFormConfigService.getFormControlList() : this.dsarFormService.getFormControlList();
        this.formObject = {
          form_name: this.formName,
          form_status: 'draft',
          settings: {
            approver: this.defaultapprover,
            workflow: this.workflow,
            days_left: Number(this.daysleft),
            email_verified: this.isEmailVerificationRequired || false,
            captcha: this.isCaptchaVerificationRequired || false,
          },
          request_form: updatedWebForm
        };
        let formObjstatus = {
          form_name: this.formName,
          form_status: 'draft',
        }
        let formRequestForm = {
          request_form: updatedWebForm
        }
        if (this.crid) {
          this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
        } else {
          this.webFormControlList = this.dsarFormService.getFormControlList();
        }
        
        let isFormnameChanged = JSON.stringify(this.pageLoadFormObj) === JSON.stringify(formObjstatus);
        let isFormSettingsChanged;
        if (this.pageLoadFormSettingsObj !== undefined) {
          isFormSettingsChanged = JSON.stringify(this.pageLoadFormSettingsObj.settings) === JSON.stringify(this.formObject.settings);
        }

        let finalStatus = isFormnameChanged && isFormSettingsChanged && this.isDirty;
         
        if (finalStatus && saveType !== 'save') {
          this.openModal(this.confirmSaveAlert);
        } else {
          this.addUpdateDSARForm();
          this.navDirective.select(4);
          this.isDirty = false;
        }
      }
      this.formwizardStatus.isFormTwofinish = false;
      this.formwizardStatus.isFormThreefinish = false;
      
    }
  }

  addUpdateDSARForm() {
    this.isDirty = false;
    let updatedWebForm;
    if(this.crid){
      updatedWebForm = this.ccpaFormConfigService.getFormControlList();
    }else{
      updatedWebForm = this.dsarFormService.getFormControlList();
    }
    this.formObject = {
      form_name: this.formName,
      form_status: 'draft',
      settings: {
        approver: this.defaultapprover,
        workflow: this.workflow,
        days_left: Number(this.daysleft),
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
            this.decline();
        }, (error) => {
          this.loadingbar.stop();
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
          this.decline();
        });
         this.isDirty = false;
    } else {

      this.loadingbar.start();
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
        }, (error) => {
          this.loadingbar.stop();
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
        });
      this.isDirty = false;
    }
  }

  onChangeNavID($event){
    if($event === 1){
      this.formwizardStatus.isFormOnefinish = true;
      this.formwizardStatus.isFormThreefinish = false;
      this.formwizardStatus.isFormTwofinish = false;
    }else if($event === 2){
      this.formwizardStatus.isFormTwofinish = true;
      this.formwizardStatus.isFormOnefinish = false;
      this.formwizardStatus.isFormThreefinish = false;
    } else if($event === 3){
      this.formwizardStatus.isFormThreefinish = true;
      this.formwizardStatus.isFormOnefinish = false;
      this.formwizardStatus.isFormTwofinish = false;
    } else if($event === 4){
      this.formwizardStatus.isFormOnefinish = false;
      this.formwizardStatus.isFormTwofinish = false;
      this.formwizardStatus.isFormThreefinish = false;
    }
  }
  // this.basicForm.value.formname === '' || this.basicForm.value.formname === undefined || !this.basicFormSubmitted
  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 2) {
      if(changeEvent.nextId === 2 && changeEvent.activeId > 2){
        if(this.crid){
          this.getDSARFormByCRID(this.crid);
       } 
     }else{
      this.formName = this.basicForm.controls['formname'].value;
      this.basicForm.valueChanges.subscribe(e => {
        if (e.formname !== this.formName) {
          this.isDirty = true;
        }
      });
      this.basicFormSubmitted = true;
      if (this.formName) {
        this.basicFormdata('nav');
      } else {
        changeEvent.preventDefault();
        this.alertMsg = `Please complete step 1 Basic and press next`;
        this.isOpen = true;
        this.alertType = 'danger';
      }
    }
    } else if (changeEvent.nextId === 3) {
      console.log(this.basicDetailForm, 'basicDetailForm..');
      this.isdraftsubmitted = true;
      this.basicFormSubmitted = true;
      if(this.isDirty){
        this.saveAsDraftCCPAFormConfiguration('nav');
      }
    } else if (changeEvent.nextId === 4) {
      this.isdraftsubmitted = true;
      this.basicFormSubmitted = true;
      this.isResetlinkEnable = false;
      if (this.formName && this.defaultapprover && this.workflow) {
        this.daysleft !== '' ? this.daysleft = this.daysleft : this.daysleft = 45;
        let isFormSettingsChanged;
        const updatedWebForm = this.crid ? this.ccpaFormConfigService.getFormControlList() : this.dsarFormService.getFormControlList();
        this.formObject = {
          form_name: this.formName,
          form_status: 'draft',
          settings: {
            approver: this.defaultapprover,
            workflow: this.workflow,
            days_left: Number(this.daysleft),
            email_verified: this.isEmailVerificationRequired || false,
            captcha: this.isCaptchaVerificationRequired || false,
          },
          request_form: updatedWebForm
        };
        let formRequestForm = {
          request_form: updatedWebForm
        }
        if (this.crid) {
          this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
        } else {
          this.webFormControlList = this.dsarFormService.getFormControlList();
        }
        let isFormFieldsChanged = JSON.stringify(this.webFormControlList) === JSON.stringify(formRequestForm.request_form);
        if (this.pageLoadFormSettingsObj !== undefined) {
          isFormSettingsChanged = JSON.stringify(this.pageLoadFormSettingsObj.settings) === JSON.stringify(this.formObject.settings);
          if (!isFormSettingsChanged && this.showFormStatus() !== 'Publish') {
            this.openModal(this.confirmSaveAlert);
          }
          this.isDirty = false;
          this.navDirective.select(4);
        } else {
          if(this.isDirty){
            this.addUpdateDSARForm();
          }
          this.navDirective.select(4);
        }
      } else {
        changeEvent.preventDefault();
        const stepnumber: number | string = '1 Basic, 2 Form & 3 Settings';
        this.alertMsg = `Please complete step ${stepnumber} and press next`;
        this.isOpen = true;
        this.alertType = 'danger';
      }
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
          this.getDSARFormByCRID(this.crid);
          this.navDirective.select(4);
          this.getWebFormScriptLink();
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
    // console.log(arrayData, 'arrayData..');
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
      this.cancelAddingFormControl('submit');
    }
  }

  rearrangeFormSequence(dataArray) {
    dataArray.sort((a, b) => {
      return a.preferControlOrder - b.preferControlOrder;
    });
    return dataArray;
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
    console.log(this.editorData, 'editorData..');
  }

  editQuillEditorDataPopup(content, field) {
    if (field === 'welcomeText') {
      this.isWelcomeEditor = true;
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
      this.quillEditorText.reset();
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.quillEditorText.reset();
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
      this.organizationService.getOrgTeamMembers(this.orgId).subscribe((data) => {
        this.ApproverList = data.response;
        const filterValue = this.ApproverList.filter((t) => t.approver_id === this.selectedApproverID);
        if (filterValue.length > 0) {
          this.defaultapprover = filterValue[0].approver_id;
        }
      });
    }
  }

  loadWorkFlowList() {
    this.workFlowService.getWorkflow(this.constructor.name, moduleName.workFlowModule).subscribe((data) => {
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
      if (window.location.hostname === 'localhost') {
        window.open('http://localhost:4500/dsar/form/' + this.orgId + '/' + this.propId + '/' + this.crid + '/' + formStatus);
      }
      if (window.location.hostname === 'develop-cmp.adzpier-staging.com') {
        window.open('https://develop-privacyportal.adzpier-staging.com/dsar/form/' + this.orgId + '/' + this.propId + '/' + this.crid + '/' + formStatus);
      } else if (window.location.hostname === 'cmp.adzpier-staging.com') {
        window.open('https://privacyportal.adzpier-staging.com/dsar/form/' + this.orgId + '/' + this.propId + '/' + this.crid + '/' + formStatus);
      } else if (window.location.hostname === 'portal.adzapier.com') {
        window.open('https://privacyportal.primeconsent.com/dsar/form/' + this.orgId + '/' + this.propId + '/' + this.crid + '/' + formStatus);
      }
    } else {
      this.alertMsg = 'Organization or Property not found!';
      this.isOpen = true;
      this.alertType = 'danger';
    }
  }

  getWebFormScriptLink() {
    if (this.orgId && this.propId) {
      if (window.location.hostname === 'localhost') {
        this.scriptcode = 'http://localhost:4500/dsar/form/' + this.orgId + '/' + this.propId + '/' + this.crid;
      }
      if (window.location.hostname === 'develop-cmp.adzpier-staging.com') {
        this.scriptcode = 'https://develop-privacyportal.adzpier-staging.com/dsar/form/' + this.orgId + '/' + this.propId + '/' + this.crid;
      } else if (window.location.hostname === 'cmp.adzpier-staging.com') {
        this.scriptcode = 'https://privacyportal.adzpier-staging.com/dsar/form/' + this.orgId + '/' + this.propId + '/' + this.crid;
      } else if (window.location.hostname === 'portal.adzapier.com') {
        this.scriptcode = 'https://privacyportal.primeconsent.com/dsar/form/' + this.orgId + '/' + this.propId + '/' + this.crid;
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
    this.selectedApproverID = retrivedData.approver;
    this.workflow = retrivedData.workflow;
   // this.formName = this.formName || retrivedData.form_name;
    this.isEmailVerificationRequired = retrivedData.email_verified;
    this.daysleft = retrivedData.days_left;
    retrivedData.request_form.filter((t) => {
      if (t.controlId === 'fileupload') {
        this.isFileUploadRequired = t.requiredfield;
        this.isFileuploadRequiredField = (t.ismandatory === '') ? false : true;
      } else if (t.controlId === 'captchacontrol') {
        this.isCaptchaVerificationRequired = t.requiredfield;
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
      form_name: this.formName,
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
    this.isEmailVerificationRequired = event.target.checked;
  }

  allowCaptchaVerification(event) {
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
    }

    this.ccpaFormConfigService.getCaptcha(this.constructor.name, moduleName.dsarWebFormModule).subscribe((data) => {
      this.captchaid = data.id;
      this.imageToShow = 'data:image/png;base64' + ',' + data.captcha;
    });

  }

  onCheckboxChange($event) {
    this.isRequiredField = $event.target.checked;
    // console.log(this.selectedControlObj,'selectedControlObj..');
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

  ngOnDestroy() {
    this.webFormControlList = [];
    this.selectedwebFormControlList = [];
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
            // this.previewImagePath = imgBase64Path;
          }
        };
      };
      this.setHeaderStyle();
      // this.getWorkflowWithApproverID();
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  faviconChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
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
          }
        };
      };
      this.setHeaderStyle();
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
    this.headerLogoForm.reset();
  }

  deleteSelectedFavicon() {
    this.headerfaviconBase64 = '';
    this.faviconFilesize = '';
    this.logoWidth = 0;
    this.logoHeight = 0;
    this.faviconFilename = '';
    this.faviconForm.reset();
  }

  getDSARFormByCRID(responsID) {
    //  this.loadingbar.start();
    if (this.orgId && this.propId) {
      this.ccpaFormConfigService.getCCPAFormConfigByID(this.orgId, this.propId, responsID,
        this.constructor.name, moduleName.dsarWebFormModule).subscribe((data) => {
          // tslint:disable-next-line: max-line-length
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

          const key = 'request_form';
          this.webFormControlList = data.response[key];
          data.response[key].filter((t) => {
            if (t.controlId === 'fileupload') {
              this.isFileUploadRequired = t.requiredfield;
              this.isFileuploadRequiredField = (t.ismandatory === '') ? false : true;
            } else if (t.controlId === 'captchacontrol') {
              this.isCaptchaVerificationRequired = t.requiredfield;
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
        }, (error) => {
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
        }
        );
    }
  }

  editFormAfterPublish() {
    this.isEditingPublishedForm = !this.isEditingPublishedForm;
    this.isWebFormPublished = true;
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
    this.modalRef = this.bsmodalService.show(template, { class: '' });
  }

  confirmForEditing() {
    this.editFormAfterPublish();
    this.navDirective.select(1);
    this.modalRef.hide();
  }

  decline() {
    this.isDirty = false;
    this.modalRef.hide();
  }

  resetWebform() {
    this.isEditingPublishedForm = !this.isEditingPublishedForm;
    this.getDSARFormByCRID(this.crid);
    this.loadDefaultApprover();
    this.CreateUpdateDSARForm(this.crid);
    this.getWorkflowWithApproverID();
    this.isDirty = false;
    this.modalRef.hide();
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

  ngAfterContentChecked() {
    this.cd.detectChanges();
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

  isLicenseLimitAvailable(): boolean {
    return this.dataService.isLicenseLimitAvailableForOrganization('form', this.dataService.getAvailableLicenseForFormAndRequestPerOrg());
  }

  navigateToWebForm() {
    this.router.navigate(['/privacy/dsar/webforms']);
  }

  canDeactivate() {
    return this.isDirty;
  }
}

interface CustomControls {
  [key: string]: any;
}


