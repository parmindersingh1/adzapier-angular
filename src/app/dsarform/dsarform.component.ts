import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder, Validators, FormArray, FormGroup, NgForm } from '@angular/forms';
import { OrganizationService } from '../../app/_services';
import { switchMap, map } from 'rxjs/operators';
import { CcparequestService } from '../_services/ccparequest.service';
import { CCPAFormFields } from '../_models/ccpaformfields';
import { DsarformService } from '../_services/dsarform.service';
import { CCPAFormConfigurationService } from '../_services/ccpaform-configuration.service';


@Component({
  selector: 'app-dsarform',
  templateUrl: './dsarform.component.html',
  styleUrls: ['./dsarform.component.scss']
})
export class DsarformComponent implements OnInit {
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
  webFormControlList: any; // CCPAFormFields[] = [];
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
  countries = [
    {
      id: 'us',
      name: 'United States'
    },
    {
      id: 'uk',
      name: 'United Kingdom'
    },
    {
      id: 'ca',
      name: 'Canada'
    }
  ];

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

  stateList = [
    { id: 'AP', name: 'Andhra Pradesh' },
    { id: 'ARP', name: 'Arunachal Pradesh' },
    { id: 'AS', name: 'Assam' },
    { id: 'BH', name: 'Bihar' }

  ];

  items = [{
    id: 1,
    qty: 22
  },
  {
    id: 2,
    qty: 21
  },
  {
    id: 3,
    qty: 18
  }

  ];
  constructor(private fb: FormBuilder, private ccpaRequestService: CcparequestService,
              private organizationService: OrganizationService,
              private dsarFormService: DsarformService,
              private ccpaFormConfigService: CCPAFormConfigurationService
  ) {
    for (let insertNumbers = 0; insertNumbers <= 10; insertNumbers++) {
      this.allNumbers.push(insertNumbers);
    }
    this.count = 0;
    //  this.loadWebControl();
    this.getCCPAdefaultConfigById();
    // this.organizationService.getSelectedOrgProperty.subscribe((response) => this.selectedProperty = response);
    this.organizationService.currentPropertySource.subscribe((response) => this.selectedProperty = response);
  }

  ngOnInit() {
    this.radioBtnType = true;
    this.subjectTyperadioBtn = true;
    //  this.loadWebControl();
    this.webFormControlList = this.dsarFormService.getFormControlList();
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

  loadWebControl() {

    // this.dsarFormService.setFormControlList(this.webFormControlList);
    // this.webFormControlList = this.dsarFormService.getFormControlList();
    // this.formControlList = JSON.parse(localStorage.getItem('formControlList'));
  }

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
        this.loadWebControl();
      }
    });
  }

  register(formData: NgForm) {
   // const selectedCountries = this.requestType.filter((country) => country.checked);
   // console.log(selectedCountries, 'selectedCountries..');
    console.log(formData.value);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.webFormControlList, event.previousIndex, event.currentIndex);
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
    this.dsarFormService.deleteControl(item);
    this.webFormControlList = this.dsarFormService.getFormControlList();
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
        const oldControlIndex = this.webFormControlList.findIndex((t) =>
          t.controllabel === this.existingControl.controllabel);
        // if (oldControlIndex) {
        updatedObj = {
          controllabel: formControls.value.lblText,
          indexCount: trimLabel,
          control: this.changeControlType,
          controlId: this.selectedControlId
          // selectOptions: this.existingControl.selectOptions
        };
        this.dsarFormService.updateControl(this.webFormControlList[oldControlIndex], oldControlIndex, updatedObj);
        // }

        // for (const x of this.webFormControlList) {
        //   if (x.controlId === this.selectedControlId) {
        //     updatedObj = {
        //       controllabel: formControls.value.lblText,
        //       indexCount: trimLabel,
        //       control: this.changeControlType,
        //       controlId: this.selectedControlId
        //     };
        //     // x.controllabel = formControls.value.lblText;
        //     // x.indexCount = trimLabel + 'Index';
        //     // x.control = this.changeControlType;
        //   }
        // }
        // this.webFormControlList.forEach(t => {
        //   if (t.controlId === this.selectedControlId) {
        //     t.controllabel = formControls.value.lblText;
        //     t.indexCount = trimLabel + 'Index';
        //   }
        // });
        // this.dsarFormService.updateControl(this.webFormControlList[oldControlIndex], oldControlIndex, updatedObj);
        this.webFormControlList = this.dsarFormService.getFormControlList();
      } else if (this.existingControl.control === 'textbox' || this.existingControl.control === 'textarea' ||
        this.existingControl.controlId === 'state' || this.existingControl.controlId === 'country') {
        let updatedTextobj;
        const oldControlIndex = this.webFormControlList.findIndex((t) =>
          t.controllabel === this.existingControl.controllabel);
        if (oldControlIndex) {
          updatedTextobj = {
            controllabel: formControls.value.lblText,
            indexCount: trimLabel,
            control: this.existingControl.control,
            selectOptions: this.existingControl.selectOptions
          };
          this.dsarFormService.updateControl(this.webFormControlList[oldControlIndex], oldControlIndex, updatedTextobj);
        }

        // for (const x of this.webFormControlList) {
        //   if (x.controlId === this.selectedControlId) {
        //     updatedTextobj = {
        //       controllabel: formControls.value.lblText,
        //       indexCount: trimLabel,
        //       control: this.existingControl.control
        //     };
        //     // x.controllabel = formControls.value.lblText;
        //     // x.indexCount = trimLabel + 'Index';
        //     // x.control = this.changeControlType;
        //   }
        // }
        // this.dsarFormService.updateControl(this.existingControl, updatedTextobj);
        this.webFormControlList = this.dsarFormService.getFormControlList();
        // const controlList =  this.dsarFormService.getFormControlList();
        // for (const t of controlList) {
        //   if (t.controlId === this.selectedControlId) {
        //     t.control = controltype || this.changeControlType;
        //     t.controllabel = formControls.value.lblText;
        //     t.indexCount = trimLabel + 'Index';
        //   }
        // }
        // this.dsarFormService.setFormControlList(controlList);
        // this.dsarFormService.getFormControlList();
      } else if (this.existingControl) {
        let updateCustomObj;
        const customControlIndex = this.webFormControlList.findIndex((t) =>
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
          this.dsarFormService.updateControl(this.webFormControlList[customControlIndex], customControlIndex, updateCustomObj);
        }
        // for (const x of this.webFormControlList) {
        //   if (x.controlId === this.selectedControlId) {
        //     updateCustomObj = {
        //       controllabel: formControls.value.lblText,
        //       indexCount: trimLabel + 'Index',
        //       control: this.changeControlType,
        //       controlId: this.existingControl.controlId,
        //       selectOptions: this.existingControl.selectOptions
        //     };
        //   }
        // }
        // this.dsarFormService.updateControl(this.existingControl, updateCustomObj);
        this.webFormControlList = this.dsarFormService.getFormControlList();
      }


      // x.filter((t) => {
      //     if (t.controlId === this.selectedControlId) {
      //       t.control = controltype || this.changeControlType;
      //       t.controllabel = formControls.value.lblText;
      //       t.indexCount = trimLabel + 'Index';
      //     }
      //   });

      // localStorage.setItem('formControlList', JSON.stringify(this.webFormControlList));
      // this.webFormControlList = this.dsarFormService.getFormControlList();
      // this.webFormControlList = JSON.parse(localStorage.getItem('formControlList'));
      //  console.log(x, 'x..');
    } else {
      const count = this.webFormControlList.length + 1;
      const newWebControl = {
        control: this.selectedFormOption,
        controllabel: formControls.value.lblText,
        controlId: 'CustomInput' + count,
        indexCount: trimLabel + 'Index',
        selectOptions: this.selectOptions
      };

      // this.webFormControlList.push({
      //   control: controltype,
      //   controllabel: formControls.value.lblText,
      //   controlId: 'Custom Input',
      //   indexCount: trimLabel + 'Index',
      //   selectOptions: this.selectOptions
      // });
      this.dsarFormService.addControl(newWebControl);
      this.webFormControlList = this.dsarFormService.getFormControlList();
      // this.dsarFormService.setFormControlList(this.webFormControlList);
      // this.webFormControlList = this.dsarFormService.getFormControlList();
      // localStorage.setItem('formControlList', JSON.stringify(this.webFormControlList));
      // this.webFormControlList = JSON.parse(localStorage.getItem('formControlList'));
      // localStorage.setItem('formControlList', JSON.stringify(this.webFormControlList));
      // this.webFormControlList = JSON.parse(localStorage.getItem('formControlList'));
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
    this.webFormControlList = this.dsarFormService.getFormControlList();
    this.changeControlType = null;
  }

  publishCCPAFormConfiguration() {
    console.log(this.formName, 'formName..');
    this.webFormControlList = this.dsarFormService.getFormControlList();
    const formObject = {
      'form_name': this.formName,
      'form_status': 'Draft',
      'request_form': this.webFormControlList
    }
    if(this.selectedProperty.orgId !== undefined && this.selectedProperty.property.propid !== undefined) {
      this.ccpaFormConfigService.createCCPAForm(this.selectedProperty.orgId, this.selectedProperty.property.propid, formObject)
      .subscribe((data)=>console.log(data),(error)=>alert(JSON.stringify(error)));
    }
   
    // selectedOrgProperty
  }



}

