import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, SecurityContext } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OrganizationService } from 'src/app/_services';
import { CcparequestService } from 'src/app/_services/ccparequest.service';
import { DsarformService } from 'src/app/_services/dsarform.service';
import { CCPAFormConfigurationService } from 'src/app/_services/ccpaform-configuration.service';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { flatMap, switchMap, map } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { CaptchaComponent } from 'angular-captcha';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-dsarform',
  templateUrl: './dsarform.component.html',
  styleUrls: ['./dsarform.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DsarformComponent implements OnInit, OnDestroy {
  @ViewChild(CaptchaComponent, { static: true }) captchaComponent: CaptchaComponent;
  @ViewChild('editor', { static: true }) editor;
  public requestObject: any = {};
  public selectedFormOption: any;
  public selectedControlType: any;
  public selectOptions: any;
  public selectOptionText: any;
  public count: number;
  public selectOptionControl: any;
  selectedControlId: any;
  changeControlType: any;
  newAttribute: any = {};
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
  formsArr = [];
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
  headerlogoURL: any;
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
  captchaImage: SafeHtml;
  controlOption = [
    {
      id: 1,
      control: 'textbox'
    },
    {
      id: 2,
      control: 'select'
    },
    {
      id: 3,
      control: 'radio'
    },
    {
      id: 4,
      control: 'textarea'
    },
    {
      id: 5,
      control: 'checkbox'
    },
    {
      id: 6,
      control: 'datepicker'
    }
  ];

  editableControlOption = [
    {
      id: 1,
      control: 'select'
    },
    {
      id: 2,
      control: 'radio'
    },
    {
      id: 3,
      control: 'checkbox'
    }
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
  daysleft: any = 45;
  public reqURLObj = {};
  isControlDisabled: boolean;
  alertMsg: any;
  alertType: any;
  dismissible = true;
  isOpen = false;
  showFilesizeerror: boolean = false;
  showFileExtnerror: boolean = false;
  isFileUploadRequired: boolean = false;
  imgUrl: string; // = 'https://develop-cmp-api.adzpier-staging.com/api/v1/captcha/image';

  imageToShow: any;
  isImageLoading: boolean;
  captchacode: any;
  captchaid: any;
  constructor(private fb: FormBuilder, private ccpaRequestService: CcparequestService,
              private organizationService: OrganizationService,
              private dsarFormService: DsarformService,
              private ccpaFormConfigService: CCPAFormConfigurationService,
              private workFlowService: WorkflowService,
              private router: Router,
              private location: Location,
              private activatedRoute: ActivatedRoute,
              private loadingbar: NgxUiLoaderService,
              private modalService: NgbModal,
              private cd: ChangeDetectorRef,
              private sanitizer: DomSanitizer) {

    this.count = 0;
    // this.loading = true;
    //  this.loadWebControl();
    // this.getCCPAdefaultConfigById();
    this.activatedRoute.paramMap.subscribe(params => {
      // console.log(params, 'params..');
      this.crid = params.get('id');
      // console.log(this.crid, 'crid..');
      // this.selectedwebFormControlList = this.
    });
    this.loadingbar.start();
    this.organizationService.getSelectedOrgProperty.subscribe((response) => {
      this.loadingbar.stop();
      console.log(response, 'response...SP..');
      this.selectedProperty = response;
    });
    // this.activatedRoute.queryParams.subscribe((params) => this.activatedRouteQuery = params);
    // this.organizationService.getSelectedOrgProperty.subscribe((response) => this.selectedProperty = response);

  }

  ngOnInit() {
    this.loadingbar.start();
    //  this.webFormControlList = this.dsarFormService.getFormControlList();
    this.getCCPAdefaultConfigById();
    // this.loadWebControl();
    this.organizationService.currentProperty.subscribe((response) => {
      this.loadingbar.stop();
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



    // this.loading = true;
    if (this.crid !== null) {
      // this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      // this.getCCPAdefaultConfigById();
      const uuidRegx = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      this.loadingbar.start();
      this.webFormSelectedData = this.ccpaFormConfigService.currentFormData.subscribe((data) => {
        this.loadingbar.stop();
        if (data) {
          (this.propId !== '') ? this.propId = this.propId : this.propId = data.PID;
          (this.orgId !== '') ? this.orgId = this.orgId : this.orgId = data.OID;
          // this.orgId = data.OID;
          this.crid = data.crid;
          // this.propertyname = data.form_name;
          this.formName = data.form_name || data.web_form_name;
          //  this.selectedApproverID = data.approver;
          // this.selectedWorkflowID = data.workflow;
          const isUUID = uuidRegx.test(data.approver);
          if (isUUID) {
            this.selectedApproverID = data.approver;
            this.selectedWorkflowID = data.workflow;
          } else {
            this.selectedApproverID = data.approver_id;
            this.selectedWorkflowID = data.workflow_id;
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

          console.log(this.webFormControlList, 'crid..webFormControlList..');
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
              this.headerlogoURL = t.logoURL;
              this.headerColor = t.headerColor;
            }
          });
          // this.ccpaFormConfigService.removeControls();
          this.ccpaFormConfigService.setFormControlList(this.webFormControlList);
          // this.webFormControlList;

          //  console.log(this.defaultapprover, 'defaultapprover..');
        } else {
          // const retrivedData = this.ccpaFormConfigService.getCurrentSelectedFormData();
          // this.selectedApproverID = retrivedData.approver;
          // this.selectedWorkflowID = retrivedData.workflow;
          // this.formName = retrivedData.form_name;
          this.getWorkflowWithApproverID();
        }
      });
    } else {
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
          this.headerlogoURL = t.logoURL;
          this.headerColor = t.headerColor;
        }
      });
      this.dsarFormService.setFormControlList(this.webFormControlList);
      this.webFormControlList = this.dsarFormService.getFormControlList();
      //  this.selectOptionControl = this.controlOption[0].control;
      this.selectOptions = [{
        id: this.count++,
        name: ' '
      }];

      // this.getCCPAdefaultConfigById();
      this.reqURLObj = { crid: this.crid, orgid: this.organizationID, propid: this.propId };
      this.organizationService.getOrganization.subscribe((response) => this.currentOrgID = response);
    }

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
  }

  getCCPAdefaultConfigById() {
    this.loadingbar.start();
    this.ccpaRequestService.getCCPAdefaultRequestSubjectType().subscribe((data) => {
      this.loadingbar.stop();
      if (data !== undefined) {
        const rdata = data['response'].request_type;
        const sdata = data['response'].subject_type;
        this.requestType = rdata;
        this.subjectType = sdata;
        this.loadWebControl();
        this.loading = false;
      }
    }, (error) => {
      this.loadingbar.stop();
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
    });
    this.loadWebControl();
  }

  loadWebControl() {
    if (this.crid) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      console.log(this.webFormControlList, 'loadwebcontrol..11');

      this.ccpaFormConfigService.setFormControlList(this.webFormControlList);
    } else {
      this.webFormControlList = this.dsarFormService.getFormControlList();
      console.log(this.webFormControlList, 'loadwebcontrol..');
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
          this.sideMenuSubjectTypeOptions = this.subjectType;
          // t.selectOptions = this.sideMenuSubjectTypeOptions;
        } else {
          t.selectOptions = this.requestType;
          this.sideMenuRequestTypeOptions = this.requestType;
          // t.selectOptions = this.sideMenuRequestTypeOptions;
        }

      }
    });
    // this.selectOptions = this.sideMenuSubjectTypeOptions;
    if (this.sideMenuRequestTypeOptions.length !== 0 && this.isRequestType) {
      console.log(this.sideMenuRequestTypeOptions);
      return this.sideMenuRequestTypeOptions;
    } else {
      console.log(this.sideMenuSubjectTypeOptions);
      return this.sideMenuSubjectTypeOptions;
    }


  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }



  register(formData: NgForm) {
    console.log(formData.value, 'register..');
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.webFormControlList, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    // moveItemInArray(this.webFormControlList, event.previousIndex, event.currentIndex);
    // transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
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
        this.loadSubjectRequestTypeForSideNav('subjecttype');
      } else if (this.existingControl.controlId === 'requesttype') {
        this.isRequestType = true;
        this.isSubjectType = false;
        this.loadSubjectRequestTypeForSideNav('requesttype');
      } else {
        this.selectedControlType = true;
      }
    } else if (this.selectedFormOption === 'select' || this.selectedFormOption === 'radio' || this.selectedFormOption === 'checkbox') {
      this.selectedControlType = !this.selectedControlType; // true;
      if (this.selectedControlType) {
        this.selectOptions = [];
        this.addOptions();
      }
      else {
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
    this.lblText = data.controllabel;
    this.isEditingList = true;
    this.isAddingFormControl = true;
    this.showFormOption = false;
    this.selectedControlId = data.controlId;
    this.existingControl = data;

    (data.control === 'textbox' || data.control === 'textarea') ? this.inputOrSelectOption = true : this.inputOrSelectOption = false;
    if (data.control === 'select' && data.controlId !== 'state' && data.controlId !== 'country' || data.control === 'radio'
      || data.control === 'checkbox') {
      this.editSelectionType = true;
      this.changeControlType = data.control;
      this.selectOptions = data.selectOptions;
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
    // this.selectOptions = [];
    let count = 0;
    let customObj: Anything = {};
    const keylabel = this.lblText.split(' ').join('_').toLowerCase();
    const id = count++;
    //  customObj.key = this.trimLabel + 'id';
    customObj = {
      id: this.selectOptions.length + 1,
      keylabel
    };


    // customObj[key]
    //  console.log(customObj, 'coo..');
    // this.selectOptions.push(customObj[key] = this.count++);
    this.selectOptions.push(customObj);
    console.log(this.selectOptions, 'selectOptions..');

    // this.cancelAddingFormControl();
  }

  addCustomReqestSubjectType() {
    // isSubjectType,isRequestType
    let subjectObj: Anything = {};
    let requestObj: Anything = {};
    const keylabel = this.lblText.split(' ').join('_');
    if (this.isSubjectType) {
      subjectObj = {
        subject_type_id: this.generateUUID(),
        active: true,
        created_at: new Date().toJSON(),
        updated_at: new Date().toJSON(),
      };

      this.sideMenuSubjectTypeOptions.push(subjectObj);
      //   console.log(this.selectOptions, 'selectOptions types..');
    } else {
      requestObj = {
        request_type_id: this.generateUUID(),
        active: true,
        created_at: new Date().toJSON(),
        updated_at: new Date().toJSON(),
      };

      this.sideMenuRequestTypeOptions.push(requestObj);
      //  console.log(this.selectOptions, 'selectOptions types..');
    }

  }
  // {
  //   "subject_type_id": "e85fb633-0f5d-4aa5-b09c-9e499f5e0fb2",
  //   "name": "Student",
  //   "active": true,
  //   "created_at": "2020-05-28T15:09:44.406193Z",
  //   "updated_at": "2020-05-28T15:09:44.406193Z"
  // }
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
    this.trimLabel = formControls.value.lblText.split(' ').join('_').toLowerCase();
    if (this.isEditingList) {
      const req = 'requesttype';
      const sub = 'subjecttype';
      if (this.selectedControlId === req || this.selectedControlId === sub) {

        let updatedObj;
        const oldControlIndex = this.webFormControlList.findIndex((t) =>
          t.controlId === this.existingControl.controlId);
        // if (oldControlIndex) {
        // const subReqObj = {
        //     control: this.selectedFormOption,
        //     controllabel: formControls.value.lblText,
        //     controlId: this.selectedControlId,
        //     selectOptions: this.existingControl.selectOptions
        //   };
        // console.log(subReqObj, 'subReqObj..');
        // this.dsarFormService.addControl(newWebControl);
        // this.webFormControlList = this.dsarFormService.getFormControlList();
        // this.lblText = '';
        // this.cancelAddingFormControl();
        updatedObj = {
          controllabel: formControls.value.lblText,
          indexCount: this.existingControl.indexCount,
          control: this.changeControlType,
          controlId: this.selectedControlId,
          selectOptions: this.existingControl.selectOptions
        };
        if (this.crid) {
          //   this.ccpaFormConfigService.setFormControlList(this.webFormControlList);
          this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
          const customControlIndex = this.webFormControlList.findIndex((t) => t.indexCount === this.existingControl.indexCount);
          this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, updatedObj);
          this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
        } else {
          this.dsarFormService.updateControl(this.webFormControlList[oldControlIndex], oldControlIndex, updatedObj);
          this.webFormControlList = this.dsarFormService.getFormControlList();
        }

      } else if (this.existingControl.control === 'textbox' || this.existingControl.control === 'textarea' ||
        this.existingControl.controlId === 'state' || this.existingControl.controlId === 'country') {
        let updatedTextobj;
        const oldControlIndex = this.webFormControlList.findIndex((t) =>
          t.indexCount === this.existingControl.indexCount);
        //  if (oldControlIndex) {
        updatedTextobj = {
          controllabel: formControls.value.lblText,
          controlId: this.existingControl.controlId,
          indexCount: this.existingControl.indexCount,
          control: this.existingControl.control,
          selectOptions: this.existingControl.selectOptions
        };
        if (this.crid) {
          this.ccpaFormConfigService.setFormControlList(this.webFormControlList);
          this.ccpaFormConfigService.updateControl(this.webFormControlList[oldControlIndex], oldControlIndex, updatedTextobj);
          this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
        } else {
          this.dsarFormService.updateControl(this.webFormControlList[oldControlIndex], oldControlIndex, updatedTextobj);
          this.webFormControlList = this.dsarFormService.getFormControlList();
        }

      } else if (this.existingControl) {
        this.webFormControlList = this.dsarFormService.getFormControlList();
        let updateCustomObj;
        const customControlIndex = this.webFormControlList.findIndex((t) =>
          t.indexCount === this.existingControl.indexCount);
        //  const customControlIndex = this.webFormControlList.indexOf(this.existingControl.controllabel);
        // const emptyIndex = this.selectOptions.findIndex((t) => t.keylabel === '');
        // this.selectOptions[emptyIndex].keylabel = this.trimLabel;
        const emptyIndex = this.selectOptions.findIndex((t) => t.keylabel !== '');
       // if (emptyIndex === -1) {
        this.selectOptions[emptyIndex].keylabel = this.trimLabel;
       // }

        if (customControlIndex !== -1) {
          updateCustomObj = {
            controllabel: formControls.value.lblText,
            indexCount: this.trimLabel,
            control: this.changeControlType,
            controlId: this.existingControl.controlId,
            selectOptions: this.existingControl.selectOptions
          };
          if (this.crid) {
            this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, updateCustomObj);
            this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
          } else {
            this.dsarFormService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, updateCustomObj);
            this.webFormControlList = this.dsarFormService.getFormControlList();
          }

        }

      }
    } else {
      if (this.crid) {
        const count = this.webFormControlList.length + 1;
        const emptyIndex = this.selectOptions.findIndex((t) => t.keylabel === '');
        this.selectOptions[emptyIndex].keylabel = this.trimLabel;
        const newWebControl = {
          control: this.selectedFormOption,
          controllabel: formControls.value.lblText,
          controlId: 'CustomInput' + count,
          indexCount: this.trimLabel + '_Index',
          selectOptions: this.selectOptions
        };
        this.ccpaFormConfigService.addControl(newWebControl);
        this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
        this.lblText = '';
        this.cancelAddingFormControl();
      } else {
        const emptyIndex = this.selectOptions.findIndex((t) => t.keylabel === '');
        if (emptyIndex !== -1) {
          this.selectOptions[emptyIndex].keylabel = this.trimLabel;
        }

        const count = this.webFormControlList.length + 1;
        const newWebControl = {
          control: this.selectedFormOption,
          controllabel: formControls.value.lblText,
          controlId: 'CustomInput' + count,
          indexCount: this.trimLabel + '_Index',
          selectOptions: this.selectOptions
        };

        this.dsarFormService.addControl(newWebControl);
        this.webFormControlList = this.dsarFormService.getFormControlList();
        this.lblText = '';
        this.cancelAddingFormControl();
        //  this.selectedControlType = false;
      }
    }

  }

  addHeaderLogo() {
    const newWebControl = {
      control: 'img',
      controllabel: 'Header Logo',
      controlId: 'headerlogo',
      logoURL: this.headerlogoURL,
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
    console.log(event, 'event...');
    this.selectedFormOption = event.currentTarget.value;
    if (this.selectedFormOption === 'checkbox' || this.selectedFormOption === 'radio' || this.selectedFormOption === 'select') {
      this.showFormOption = true;
      this.selectedControlType = true;
      if (this.selectOptions.length === 0) {
        this.addOptions();
      }

    } else {
      this.showFormOption = false;
    }
    // this.showFormOption = !this.showFormOption;

    // this.selectOptions = [];
  }

  updateControlType(event) {

    this.changeControlType = event.currentTarget.value;
    if (this.selectedControlId === 'requesttype') {
      this.updatedControl = this.changeControlType;
      if (this.changeControlType === 'select') {
        this.isRequestTypeSelected = true;
        this.checkboxBtnType = false;
        this.radioBtnType = false;
      } else if (this.changeControlType === 'radio') {
        this.isRequestTypeSelected = false;
        this.radioBtnType = true;
        this.checkboxBtnType = false;
      } else if (this.changeControlType === 'checkbox') {
        this.isRequestTypeSelected = false;
        this.radioBtnType = false;
        this.checkboxBtnType = true;
      }

    } else if (this.selectedControlId === 'subjecttype') {
      this.updatedControl = this.changeControlType;
      if (this.changeControlType === 'select') {
        this.isSubjectTypeSelected = true;
        this.subjectTypecheckboxBtnType = false;
        this.subjectTyperadioBtn = false;
      } else if (this.changeControlType === 'radio') {
        this.isSubjectTypeSelected = false;
        this.subjectTyperadioBtn = true;
        this.subjectTypecheckboxBtnType = false;
      } else if (this.changeControlType === 'checkbox') {
        this.isSubjectTypeSelected = false;
        this.subjectTyperadioBtn = false;
        this.subjectTypecheckboxBtnType = true;
      }

    }
    // else if (this.selectedControlId === 'requesttype' || this.selectedControlId === 'subjecttype') {
    //   this.updatedControl = this.changeControlType;

    //   if (this.changeControlType === 'checkbox') {
    //     this.checkboxBtnType = true;
    //     this.isRequestTypeSelected = false;
    //   }

    // }


  }

  addingFormControl() {
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

  isContainWelcomeText(item): boolean {
    return item.controlId === 'welcometext' ? true : false;
  }

  isContainFooterText(item): boolean {
    return item.controlId === 'footertext' ? true : false;
  }

  cancelAddingFormControl() {
    this.isAddingFormControl = false;
    this.isEditingList = false;
    this.inputOrSelectOption = false;
    this.showFormOption = false; // true
    this.editSelectionType = false;
    this.isSubjectType = false;
    this.isRequestType = false;
    this.selectedControlType = false;
    // if (this.crid) {
    //   this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
    // } else {
    //   this.webFormControlList = this.dsarFormService.getFormControlList();
    // }
    this.changeControlType = null;
  }

  publishCCPAFormConfiguration(registerForm) {
    this.setHeaderStyle();
    console.log(this.propId, 'propid', this.orgId, 'ORG', this.crid, 'crid');
    console.log(registerForm.value, 'registerForm..');
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
      this.updateWebcontrolIndex(registerForm.value, this.webFormControlList);
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
      this.updateWebcontrolIndex(registerForm.value, this.webFormControlList);
    }




    this.active = 3;
    this.cd.detectChanges();

    // selectedOrgProperty
  }

  createDraft() {
    if (this.defaultapprover === undefined) {
      return false;
    } else {
      this.formObject = {
        form_name: this.formName,
        form_status: 'Draft',
        settings: {
          approver: this.defaultapprover,
          workflow: this.workflow,
          days_left: Number(this.daysleft)
        },
        request_form: this.webFormControlList
      };
    }

    console.log(this.formObject, 'fo..');
    // return false;
    if (this.orgId !== undefined && this.propId !== undefined && this.crid !== null) {
      this.loadingbar.start();
      this.ccpaFormConfigService.updateCCPAForm(this.orgId, this.propId, this.crid, this.formObject)
        .subscribe((data) => {
          this.loadingbar.stop();
          this.active = 4;
          if (data) {
            // this.alertMsg = data.response;
            // this.isOpen = true;
            // this.alertType = 'success';
            // this.active = 4;
            // this.dsarFormService.removeControls();
          }
        }, (error) => {
          this.loadingbar.stop();
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
        });
      this.alertMsg = 'Web form has been updated successfully!';
      this.isOpen = true;
      this.alertType = 'success';
      this.active = 4;
    } else {
      this.loadingbar.start();
      this.ccpaFormConfigService.createCCPAForm(this.orgId, this.propId, this.formObject)
        .subscribe((data) => {
          this.loadingbar.stop();
          this.active = 4;
          if (data) {
            this.crid = data.response.crid;
            // this.alertMsg = data.response;
            // this.isOpen = true;
            // this.alertType = 'success';

            // this.dsarFormService.removeControls();
          }
        }, (error) => {
          this.loadingbar.stop();
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
        });
      this.alertMsg = 'Web form has been added successfully!';
      this.isOpen = true;
      this.alertType = 'success';
      this.active = 4;
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
    console.log(arrayData, 'arrayData..');
    return arrayData;
  }
  createNewForm() {
    this.dsarFormService.removeControls();
    this.webFormControlList = this.dsarFormService.loadWebControls();
  }

  rearrangeFormSequence(dataArray) {
    dataArray.sort((a, b) => {
      return a.preferControlOrder - b.preferControlOrder;
    });
    return dataArray;
  }

  priviewPublishedForm() {
    this.router.navigate(['/editwebforms', { crid: this.crid }]);
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
      logoURL: this.headerlogoURL,
    };
    if (this.crid) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'headerlogo');
      this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, headerObj);
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
    } else {
      this.webFormControlList = this.dsarFormService.getFormControlList();
      const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'headerlogo');
      this.dsarFormService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, headerObj);
      this.webFormControlList = this.dsarFormService.getFormControlList();
    }
  }


  loadDefaultApprover() {
    if (this.orgId) {
      this.organizationService.getOrgTeamMembers(this.orgId).subscribe((data) => {
        const key = 'response';
        this.ApproverList = data[key];
        const filterValue = this.ApproverList.filter((t) => t.approver_id === this.selectedApproverID);
        if (filterValue.length > 0) {
          this.defaultapprover = filterValue[0].approver_id;
        }
      });
    }
  }

  loadWorkFlowList() {
    this.workFlowService.getWorkflow().subscribe((data) => {
      const key = 'response';
      this.workFlowList = data[key];
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
      if (window.location.hostname === 'localhost') {
        window.open('http://localhost:4500/ccpa/form/' + this.orgId + '/' + this.propId + '/' + this.crid);
      }
      if (window.location.hostname === 'develop-cmp.adzpier-staging.com') {
        window.open('https://develop-privacyportal.adzpier-staging.com/ccpa/form/' + this.orgId + '/' + this.propId + '/' + this.crid);
      } else if (window.location.hostname === 'cmp.adzpier-staging.com') {
        window.open('https://privacyportal.adzpier-staging.com/ccpa/form/' + this.orgId + '/' + this.propId + '/' + this.crid);
      }
    } else {
      this.alertMsg = 'Organization or Property not found!';
      this.isOpen = true;
      this.alertType = 'danger';
    }
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  getWorkflowWithApproverID() {
    const retrivedData = this.ccpaFormConfigService.getCurrentSelectedFormData();
    this.selectedApproverID = retrivedData.approver;
    this.selectedWorkflowID = retrivedData.workflow;
    this.formName = retrivedData.form_name;
  }

  uploadFile(event) {
    console.log(event, 'event..');
    const fileExtArray = ['pdf', 'txt', 'jpeg', 'jpg', 'png', 'doc', 'docx', 'csv', 'xls'];
    // if (event.target.files.length > 0) {
    if (event.target.files[0].size > (2 * 1024 * 1024)) {
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
    const oldControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'fileupload');
    this.webFormControlList = this.dsarFormService.getFormControlList();
    const obj = this.webFormControlList[oldControlIndex];
    obj.requiredfield = event.target.checked;
    this.dsarFormService.updateControl(this.webFormControlList[oldControlIndex], oldControlIndex, obj);

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

    this.ccpaFormConfigService.getCaptcha().subscribe((data) => {
      this.captchaid = data.captchaid;
      this.getImageFromService(this.imgUrl + '/' + this.captchaid + '.png');
    });

  }


  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getImageFromService(url) {
    this.isImageLoading = true;
    this.ccpaFormConfigService.getImage(url).subscribe(data => {
      this.createImageFromBlob(data);
      this.isImageLoading = false;
    }, error => {
      this.isImageLoading = false;
      console.log(error);
    });
  }

  postCaptcha() {
    const obj = {
      captcha_id: this.captchaid,
      captcha_solution: this.captchacode
    };
    this.ccpaFormConfigService.verifyCaptcha(obj).subscribe((data) => console.log(data));
  }

  transform(imgData) {
    this.captchaImage = this.sanitizer.bypassSecurityTrustResourceUrl(imgData);
  }

  ngOnDestroy() {
    // if (this.webFormSelectedData !== undefined) {
    //   this.webFormSelectedData.unsubscribe();
    // }
    this.webFormControlList = [];
    this.selectedwebFormControlList = [];
  }

}

interface Anything {
  [key: string]: any;
}
