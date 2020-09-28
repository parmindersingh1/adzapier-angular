import {
  Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation,
  ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit
} from '@angular/core';
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
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-dsarform',
  templateUrl: './dsarform.component.html',
  styleUrls: ['./dsarform.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DsarformComponent implements OnInit, OnDestroy, AfterViewInit {
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
  daysleft: number = 45;
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
  imgUrl: string;

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
              private cd: ChangeDetectorRef
  ) {

    this.count = 0;

    this.activatedRoute.paramMap.subscribe(params => {
      // console.log(params, 'params..');
      this.crid = params.get('id');
      // this.selectedwebFormControlList = this.
    });
    this.loadingbar.start();

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
  }

  CreateUpdateDSARForm(formcrid) {
    if (formcrid !== null) {
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
          //  this.crid = data.crid;
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
            } else if (t.controlId === 'fileupload') {
              this.isFileUploadRequired = t.requiredfield;
            }
          });
          // this.ccpaFormConfigService.removeControls();
          this.ccpaFormConfigService.setFormControlList(this.webFormControlList);

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
        } else if (t.controlId === 'fileupload') {
          this.isFileUploadRequired = t.requiredfield;
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
      this.reqURLObj = { crid: formcrid, orgid: this.organizationID, propid: this.propId };
      this.organizationService.getOrganization.subscribe((response) => this.currentOrgID = response);
    }
  }

  getCCPAdefaultConfigById() {
    this.loadingbar.start();
    this.ccpaRequestService.getCCPAdefaultRequestSubjectType().subscribe((data) => {
      this.loadingbar.stop();
      if (data !== undefined) {
        const rdata = data.request_type;
        const sdata = data.subject_type;
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
      this.ccpaFormConfigService.setFormControlList(this.webFormControlList);
    } else {
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
          this.sideMenuSubjectTypeOptions = this.subjectType;
        } else {
          t.selectOptions = this.requestType;
          this.sideMenuRequestTypeOptions = this.requestType;
        }

      }
    });
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
    let count = 0;
    let customObj: CustomControls = {};
    const keylabel = this.lblText.split(' ').join('_').toLowerCase();
    const id = count++;
    customObj = {
      id: this.selectOptions.length + 1,
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
    this.trimLabel = formControls.value.lblText.split(' ').join('_').toLowerCase();
    if (this.isEditingList) {
      const req = 'requesttype';
      const sub = 'subjecttype';
      if (this.selectedControlId === req || this.selectedControlId === sub) {

        let updatedObj;
        const oldControlIndex = this.webFormControlList.findIndex((t) =>
          t.controlId === this.existingControl.controlId);

        updatedObj = {
          controllabel: formControls.value.lblText,
          indexCount: this.existingControl.indexCount,
          control: this.changeControlType,
          controlId: this.selectedControlId,
          selectOptions: this.existingControl.selectOptions
        };
        this.addUpdateFormControls(oldControlIndex, updatedObj);
      } else if (this.existingControl.control === 'textbox' || this.existingControl.control === 'textarea' ||
        this.existingControl.controlId === 'state' || this.existingControl.controlId === 'country') {
        let updatedTextobj;
        const oldControlIndex = this.webFormControlList.findIndex((t) =>
          t.controlId === this.existingControl.controlId);
        //  if (oldControlIndex) {
        updatedTextobj = {
          controllabel: formControls.value.lblText,
          controlId: this.existingControl.controlId,
          indexCount: this.existingControl.indexCount,
          control: this.existingControl.control,
          selectOptions: this.existingControl.selectOptions
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

        if (customControlIndex !== -1) {
          updateCustomObj = {
            controllabel: formControls.value.lblText,
            indexCount: this.trimLabel,
            control: this.changeControlType,
            controlId: this.existingControl.controlId,
            selectOptions: this.existingControl.selectOptions
          };
          const optionLength = this.selectOptions.length;
          if (optionLength > 0) {
            if (this.selectOptions[optionLength - 1].name !== undefined) {
              this.lblText = '';
              this.cancelAddingFormControl();
            } else {
              return false;
            }
          } else {
            this.cancelAddingFormControl();
          }
          if (this.crid) {
            this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, updateCustomObj);
            this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
            this.cancelAddingFormControl();
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
        const newWebControl = {
          control: this.selectedFormOption,
          controllabel: formControls.value.lblText,
          controlId: 'CustomInput' + count,
          indexCount: this.trimLabel + '_Index',
          selectOptions: this.selectOptions
        };
        const optionLength = this.selectOptions.length;
        if (optionLength > 0) {
          if (this.selectOptions[optionLength - 1].name !== undefined) {
            this.lblText = '';
            this.cancelAddingFormControl();
          } else {
            return false;
          }
        } else {
          this.cancelAddingFormControl();
        }
        this.ccpaFormConfigService.addControl(newWebControl);
        this.webFormControlList = this.ccpaFormConfigService.getFormControlList();

      } else {
        this.selectOptions.forEach(element => {
          element.keylabel = this.trimLabel;
        });

        const count = this.webFormControlList.length + 1;
        const newWebControl = {
          control: this.selectedFormOption,
          controllabel: formControls.value.lblText,
          controlId: 'CustomInput' + count,
          indexCount: this.trimLabel + '_Index',
          selectOptions: this.selectOptions
        };

        const optionLength = this.selectOptions.length;
        if (optionLength > 0) {
          if (this.selectOptions[optionLength - 1].name !== undefined) {
            this.lblText = '';
            this.cancelAddingFormControl();
          } else {
            return false;
          }
        } else {
          this.cancelAddingFormControl();
        }

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

  isContainFileUpload(item): boolean {
    return item.controlId === 'fileupload' ? true : false;
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
          days_left: Number(this.daysleft),
          email_verified: this.isEmailVerificationRequired
        },
        request_form: this.webFormControlList
      };
    }

    if (this.orgId !== undefined && this.propId !== undefined && this.crid !== null) {
      this.loadingbar.start();
      this.ccpaFormConfigService.updateCCPAForm(this.orgId, this.propId, this.crid, this.formObject)
        .subscribe((data) => {
          this.loadingbar.stop();
          this.active = 4;
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

  addUpdateFormControls(oldControlIndex, controlObj) {
    if (this.crid) {
      const customControlIndex = this.ccpaFormConfigService.getFormControlList()
        .findIndex((t) => t.indexCount === this.existingControl.indexCount);
      this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, controlObj);
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
    } else {
      this.dsarFormService.updateControl(this.webFormControlList[oldControlIndex], oldControlIndex, controlObj);
      this.webFormControlList = this.dsarFormService.getFormControlList();
      this.cancelAddingFormControl();
    }
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
        this.ApproverList = data;
        const filterValue = this.ApproverList.filter((t) => t.approver_id === this.selectedApproverID);
        if (filterValue.length > 0) {
          this.defaultapprover = filterValue[0].approver_id;
        }
      });
    }
  }

  loadWorkFlowList() {
    this.workFlowService.getWorkflow().subscribe((data) => {
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
    if (this.crid) {
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      const customControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'fileupload');
      const updateobj = this.webFormControlList[customControlIndex];
      updateobj.requiredfield = event.target.checked;
      updateobj.preferControlOrder = this.webFormControlList.length - 1;
      this.ccpaFormConfigService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, updateobj);
      this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
      this.rearrangeFormSequence(this.webFormControlList);
    } else {
      this.webFormControlList = this.dsarFormService.getFormControlList();
      const oldControlIndex = this.webFormControlList.findIndex((t) => t.controlId === 'fileupload');
      const obj = this.webFormControlList[oldControlIndex];
      obj.requiredfield = event.target.checked;
      obj.preferControlOrder = this.webFormControlList.length - 1;
      this.dsarFormService.updateControl(this.webFormControlList[oldControlIndex], oldControlIndex, obj);
      this.webFormControlList = this.dsarFormService.getFormControlList();
      this.rearrangeFormSequence(this.webFormControlList);
    }
  }

  allowEmailVerification(event) {
    this.isEmailVerificationRequired = event.target.checked;
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
      this.captchaid = data.id;
      this.imageToShow = 'data:image/png;base64' + ',' + data.captcha;
    });

  }


  ngOnDestroy() {
    // if (this.webFormSelectedData !== undefined) {
    //   this.webFormSelectedData.unsubscribe();
    // }
    this.webFormControlList = [];
    this.selectedwebFormControlList = [];
  }

  ngAfterViewInit() {
    this.webFormControlList = this.ccpaFormConfigService.getFormControlList();
    this.cd.detectChanges();
  }
}

interface CustomControls {
  [key: string]: any;
}