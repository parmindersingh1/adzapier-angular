import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CCPAFormConfigurationService } from '../_services/ccpaform-configuration.service';
import { error } from 'protractor';
import { switchMap } from 'rxjs/operators';
import { OrganizationService } from '../_services';
import { FormArray, FormBuilder, NgForm } from '@angular/forms';
import { CcparequestService } from '../_services/ccparequest.service';

@Component({
  selector: 'app-editwebform',
  templateUrl: './editwebform.component.html',
  styleUrls: ['./editwebform.component.scss']
})
export class EditwebformComponent implements OnInit {
  propId: any;
  orgId: any;
  crid: any;
  propertyname: any;
  public contactList: FormArray;
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
  allNumbers: number[] = [];
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

  ccpaFormResponse: any = [];
  requestFormControls: any = [];
  constructor(private activatedRoute: ActivatedRoute,
              private ccpaFormConfigService: CCPAFormConfigurationService,
              private fb: FormBuilder, private ccpaRequestService: CcparequestService,
              private organizationService: OrganizationService
  ) {
    this.count = 0;
    //  this.loadWebControl();
    this.getCCPAdefaultConfigById();
    this.organizationService.getSelectedOrgProperty.subscribe((response) => this.selectedProperty = response);
  }

  ngOnInit() {
    this.ccpaFormConfigService.currentFormData.subscribe((data) => {
      console.log(data, 'fd..');
      this.propId = data.PID;
      this.orgId = data.OID;
      this.crid = data.crid;
      this.propertyname = data.form_name;
      this.requestFormControls = data.request_form;
    });
    
    this.getCCPAFormConfigByID();
  //  this.loadCCPAForm();

    //show edit form
    this.radioBtnType = true;
    this.subjectTyperadioBtn = true;
    //  this.loadWebControl();
    // this.requestFormControls = this.ccpaFormConfigService.getFormControlList();
   
    //  this.selectOptionControl = this.controlOption[0].control;
    this.selectOptions = [{
      id: this.count++,
      name: ' '
    }];

    this.getCCPAdefaultConfigById();
    this.organizationService.getSelectedOrgProperty.subscribe((response) => this.selectedProperty = response);
    this.organizationService.getOrganization.subscribe((response) => this.currentOrgID = response);
    // this.getCCPAFormList();
  }

  getCCPAFormConfigByID() {
    this.ccpaFormResponse.length = 0;
    this.ccpaFormConfigService.getCCPAFormConfigByID(this.orgId, this.propId, this.crid)
      .subscribe((data) => {
        console.log(data, 'data..');
        this.ccpaFormResponse.push(data.response);
        this.ccpaFormConfigService.setFormControlList(data.response.request_form);
      }, (error: any) => console.log(error));
  }

  loadCCPAForm() {
    this.requestFormControls.length = 0;
    this.requestFormControls = this.ccpaFormConfigService.getFormControlList();
  }

  // show ccpa form by crid //

  // tslint:disable-next-line: member-ordering
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
    }
  ];

  // tslint:disable-next-line: member-ordering
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

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  getCCPAdefaultConfigById() {
    this.organizationService.orglist().pipe(
      switchMap((data) => {
        for (const key in data) {
          if (data[key] !== undefined) {
            return this.ccpaRequestService.getCCPAdefaultRequestSubjectType(data[key][0].orgid);
          }
        }
      })

    ).subscribe((data) => {
      if (data !== undefined) {
        const rdata = data['response'].request_type;
        const sdata = data['response'].subject_type;
        this.requestType = rdata;
        this.subjectType = sdata;
      }
    });
  }

  register(formData: NgForm) {
    // const selectedCountries = this.requestType.filter((country) => country.checked);
    // console.log(selectedCountries, 'selectedCountries..');
    console.log(formData.value);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.requestFormControls, event.previousIndex, event.currentIndex);
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
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
        this.existingControl.control === 'textbox' || this.existingControl.control === 'textarea' ||
        this.existingControl.controlId === 'subjecttype' || this.existingControl.controlId === 'requesttype') {
        this.selectedControlType = false;
      } else {
        this.selectedControlType = true;
      }
    } else if (this.selectedFormOption === 'select' || this.selectedFormOption === 'radio' || this.selectedFormOption === 'checkbox') {
      this.selectedControlType = true;
    } else {
      this.selectedControlType = false;
    }
  }

  editSelectedRow(data) {
    this.lblText = data.controllabel;
    this.isEditingList = true;
    this.isAddingFormControl = true;
    this.showFormOption = false;
    this.selectedControlId = data.controlId;
    this.existingControl = data;
    // control: controltype,
    // controllabel: formControls.value.lblText,
    // controlId: 'Custom Input',
    // indexCount: trimLabel + 'Index',
    // selectOptions: this.selectOptions
    // ||    data.controlId === 'state' || data.controlId === 'country'
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
    this.ccpaFormConfigService.deleteControl(item);
    this.requestFormControls = this.ccpaFormConfigService.getFormControlList();
  }

  isSelected(i): boolean {
    return this.selectedRow === i;
  }

  saveCurrentItem(i) {
    console.log(!this.isSelected(i), 'isSelected..');
    return !this.isSelected(i);
  }


  addOptions() {
    this.selectOptions.push({
      id: this.count++,
      name
    });
  }

  deleteSelectOption(index) {
    this.selectOptions.splice(index, 1);
  }

  cancelForm() {
    this.showFormOption = true;
  }

  addCustomFields(formControls: NgForm) {
    //  const controltype = (this.selectedFormOption === 'textbox') ? 'textbox' : 'select';
    // this.formControlList.push(formControls.value.lblText);
    const trimLabel = formControls.value.lblText.split(' ').join('');
    // this.ccpaRequestService.createCCPACustomFormField(this.organizationID, formObj)
    // .subscribe((data) => console.log(data, 'custom form field..'),
    //   (error) => {
    //   console.log(error, 'error..');
    // });
    if (this.isEditingList) {
      // alert(this.isEditingList);
      //  const x = this.dsarFormService.getFormControlList();
      const req = 'requesttype';
      const sub = 'subjecttype';
      if (this.selectedControlId === req || this.selectedControlId === sub) {
        // let obj = {
        //   controllabel: formControls.value.lblText,
        //   indexCount: trimLabel + 'Index',
        //   control: this.changeControlType
        // }
        // this.dsarFormService.addControl(obj)
        // const webc = this.dsarFormService.getFormControlList();
        let updatedObj;
        const oldControlIndex = this.requestFormControls.findIndex((t) =>
          t.controllabel === this.existingControl.controllabel);
        // if (oldControlIndex) {
        updatedObj = {
          controllabel: formControls.value.lblText,
          indexCount: trimLabel,
          control: this.changeControlType,
          controlId: this.selectedControlId
          // selectOptions: this.existingControl.selectOptions
        };
        this.ccpaFormConfigService.updateControl(this.requestFormControls[oldControlIndex], oldControlIndex, updatedObj);
        // }

        // this.dsarFormService.updateControl(this.webFormControlList[oldControlIndex], oldControlIndex, updatedObj);
        this.requestFormControls = this.ccpaFormConfigService.getFormControlList();
      } else if (this.existingControl.control === 'textbox' || this.existingControl.control === 'textarea' ||
        this.existingControl.controlId === 'state' || this.existingControl.controlId === 'country') {
        let updatedTextobj;
        const oldControlIndex = this.requestFormControls.findIndex((t) =>
          t.controllabel === this.existingControl.controllabel);
        if (oldControlIndex) {
          updatedTextobj = {
            controllabel: formControls.value.lblText,
            indexCount: trimLabel,
            control: this.existingControl.control,
            selectOptions: this.existingControl.selectOptions
          };
          this.ccpaFormConfigService.updateControl(this.requestFormControls[oldControlIndex], oldControlIndex, updatedTextobj);
        }
        this.requestFormControls = this.ccpaFormConfigService.getFormControlList();
      } else if (this.existingControl) {
        let updateCustomObj;
        const customControlIndex = this.requestFormControls.findIndex((t) =>
          t.controllabel === this.existingControl.controllabel);
        //  const customControlIndex = this.webFormControlList.indexOf(this.existingControl.controllabel);
        if (customControlIndex) {
          updateCustomObj = {
            controllabel: formControls.value.lblText,
            indexCount: trimLabel,
            control: this.changeControlType,
            controlId: this.existingControl.controlId,
            selectOptions: this.existingControl.selectOptions
          };
          this.ccpaFormConfigService.updateControl(this.requestFormControls[customControlIndex], customControlIndex, updateCustomObj);
        }

        this.requestFormControls = this.ccpaFormConfigService.getFormControlList();
      }

    } else {
      const count = this.requestFormControls.length + 1;
      const newWebControl = {
        control: this.selectedFormOption,
        controllabel: formControls.value.lblText,
        controlId: 'CustomInput' + count,
        indexCount: trimLabel + 'Index',
        selectOptions: this.selectOptions
      };

      this.ccpaFormConfigService.addControl(newWebControl);
      this.requestFormControls = this.ccpaFormConfigService.getFormControlList();

      this.lblText = '';
    }


  }

  onChangeEvent(event) {
    console.log(event, 'event...');
    this.selectedFormOption = event.currentTarget.value;
    this.showFormOption = !this.showFormOption;
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

  cancelAddingFormControl() {
    this.isAddingFormControl = false;
    this.isEditingList = false;
    this.inputOrSelectOption = false;
    this.showFormOption = true;
    this.editSelectionType = false;
    this.requestFormControls = this.ccpaFormConfigService.getFormControlList();
    this.changeControlType = null;
  }

  publishCCPAFormConfiguration() {
    console.log(this.formName, 'formName..');
    this.requestFormControls = this.ccpaFormConfigService.getFormControlList();
    const formObject = {
      'form_name': this.formName,
      'form_status': 'Draft',
      'request_form': this.requestFormControls
    }
    if (this.selectedProperty.orgId !== undefined && this.selectedProperty.property.propid !== undefined) {
      this.ccpaFormConfigService.createCCPAForm(this.selectedProperty.orgId, this.selectedProperty.property.propid, formObject)
        .subscribe((data) => console.log(data), (error) => alert(JSON.stringify(error)));
    }

    // selectedOrgProperty
  }



}
