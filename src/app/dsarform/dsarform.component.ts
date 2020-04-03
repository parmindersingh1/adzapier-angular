import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder, Validators, FormArray, FormGroup, NgForm } from '@angular/forms';
import { OrganizationService } from '../../app/_services';
import { switchMap, map } from 'rxjs/operators';
import { CcparequestService } from '../_services/ccparequest.service';

@Component({
  selector: 'app-dsarform',
  templateUrl: './dsarform.component.html',
  styleUrls: ['./dsarform.component.scss']
})
export class DsarformComponent implements OnInit {
  public form: FormGroup;
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
  formControlList = [{
    id: 1,
    controllabel: 'I am a (an)',
    controltype: 'radio'
  },
  {
    id: 2,
    controllabel: 'Select request type(s)',
    controltype: 'select'
  },
  {
    id: 3,
    controllabel: 'First Name',
    controltype: 'textbox'
  },
  {
    id: 4,
    controllabel: 'Last name',
    controltype: 'textbox'
  },
  {
    id: 5,
    controllabel: 'Email',
    controltype: 'textbox'
  },
  {
    id: 6,
    controllabel: 'State',
    controltype: 'select'
  },
  {
    id: 7,
    controllabel: 'Country',
    controltype: 'select'
  },
  {
    id: 8,
    controllabel: 'Request Details',
    controltype: 'textarea'
  }];
  isAddingFormControl: boolean;
  webFormControlList: RegistrationForm[] = [];
  allNumbers: number[] = [];
  questionGroups: any;
  dataSubjectAccessRightsForm: any;
  questionControlArray: any;
  formsArr = [];
  public requestType: any = [];
  public subjectType: any = [];
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
    private organizationService: OrganizationService
  ) {
    for (let insertNumbers = 0; insertNumbers <= 10; insertNumbers++) {
      this.allNumbers.push(insertNumbers);
    }
    this.count = 0;
    this.loadWebControl();
    this.getCCPAdefaultConfigById();
  }

  ngOnInit() {
    //  this.selectOptionControl = this.controlOption[0].control;

    this.selectOptions = [{
      id: this.count++,
      name: ' '
    }];

    this.getCCPAdefaultConfigById();

  }

  loadWebControl() {
    this.webFormControlList = [
      {
        control: 'radio',
        controllabel: 'I am a (an)',
        controlId: 'subjecttype',
        indexCount: 'subjecttypeIndex',
        selectOptions: this.subjectType
      },
      {
        control: 'radio',
        controllabel: 'Select request type(s)',
        controlId: 'requesttype',
        indexCount: 'requestTypeIndex',
        selectOptions: this.requestType
      },
      {
        control: 'textbox',
        controllabel: 'First Name',
        controlId: 'fname1',
        indexCount: 'FirstNameIndex'
      },
      {
        control: 'textbox',
        controllabel: 'Last Name',
        controlId: 'lname1',
        indexCount: 'LastNameIndex'
      },
      {
        control: 'textbox',
        controllabel: 'Email',
        controlId: 'email',
        indexCount: 'EmailIndex'
      },
      {
        control: 'select',
        controllabel: 'State',
        controlId: 'state5',
        indexCount: 'StateIndex',
        selectOptions: this.stateList
      },
      {
        control: 'select',
        controllabel: 'Country',
        controlId: 'country',
        indexCount: 'CountryIndex',
        selectOptions: this.countries
      },
      {
        control: 'textarea',
        controllabel: 'Request Details',
        controlId: 'requestdetails',
        indexCount: 'RequestDetailsIndex'
      }
    ];
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  getCCPAdefaultConfigById() {
    this.organizationService.orglist().pipe(
      switchMap((data) => {
        for (const key in data) {
          if (data[key] !== undefined) {
            return this.ccpaRequestService.getCCPAdefaultConfigById(data[key][0].orgid);
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

  addFormField() {
    this.showFormOption = !this.showFormOption;
    if (this.selectedFormOption === 'select') {
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

    (data.control === 'textbox' || data.control === 'textarea') ? this.inputOrSelectOption = true : this.inputOrSelectOption = false;
    if (data.control === 'select' || data.control === 'radio') {
      this.editSelectionType = true;
      this.changeControlType = data.control;
    } else {
      this.editSelectionType = false;
    }
    this.selectedFormOption = data.control;
    this.selectOptionControl = data.control;
    this.addFormField();
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
    const controltype = (this.selectedFormOption === 'textbox') ? 'textbox' : 'select';
    this.formControlList.push(formControls.value.lblText);
    const trimLabel = formControls.value.lblText.split(' ').join('');
    this.webFormControlList.push({
      control: controltype,
      controllabel: formControls.value.lblText,
      controlId: 'Custom Input',
      indexCount: trimLabel + 'Index',
      selectOptions: this.selectOptions
    });
    this.lblText = '';
  }

  onChangeEvent(event) {
    console.log(event, 'event...');
    this.selectedFormOption = event.currentTarget.value;
    this.showFormOption = !this.showFormOption;
    this.selectOptions = [];
  }

  updateControlType(event) {
    this.changeControlType = event.currentTarget.value;
    if (this.selectedControlId === 'requesttype') {
      this.updatedControl = this.changeControlType;
      (this.changeControlType === 'select') ? this.isRequestTypeSelected = true : this.isRequestTypeSelected = false;
    } else if (this.selectedControlId === 'subjecttype') {

      (this.changeControlType === 'select') ? this.isSubjectTypeSelected = true : this.isSubjectTypeSelected = false;
    }


  }

  addingFormControl() {
    this.isAddingFormControl = !this.isAddingFormControl;
  }


  cancelAddingFormControl() {
    this.isAddingFormControl = false;
    this.isEditingList = false;
    this.inputOrSelectOption = false;
    this.showFormOption = true;
    this.editSelectionType = false;
  }


}

export class RegistrationForm {
  // name : string;
  // email : string;
  // phone : string;
  // city: string;
  // state: string;
  // country: string;
  controlId: string;
  controllabel: string;
  control: string;
  indexCount: string;
  selectOptions?: Array<any>;
}
