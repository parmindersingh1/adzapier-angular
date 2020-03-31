import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder, Validators, FormArray, FormGroup, NgForm } from '@angular/forms';

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
  newAttribute: any = {};
  lblText: any;
  inputOrSelectOption: boolean;
  firstField = true;
  firstFieldName = 'First Item name';
  isEditItems: boolean;
  showFormOption: boolean;
  formControlList = [
    'I am a (an)',
    'Select request type(s)',
    'First name',
    'Last name',
    'Email',
    'State',
    'Country',
    'Request Details'
  ];

  webFormControlList: RegistrationForm[] = [];
  allNumbers: number[] = [];
  questionGroups: any;
  dataSubjectAccessRightsForm: any;
  questionControlArray: any;
  formsArr = [];
  artists = [
    '1 Firstname',
    '2 lastname',
    '3 emailId',
    '4 address',
    '5 phone no',
    '6 mobile no'
  ];
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
      control: 'input'
    },
    {
      id: 2,
      control: 'select'
    }
  ];

  stateList = [
    { id: 'AP', name: 'Andhra Pradesh' },
    { id: 'ARP', name: 'Arunachal Pradesh' },
    { id: 'AS', name: 'Assam' },
    { id: 'BH', name: 'Bihar' }

  ];

  usertype = [
    { id: '1', usertype: 'Perspective Employee' },
    { id: '2', usertype: 'Customer' },
    { id: '3', usertype: 'Employee' }
  ];

  requesttype = [
    { id: '1', reqtype: 'Info Request' },
    { id: '2', reqtype: 'Data Deletion' },
    { id: '3', reqtype: 'Do not Sell My Information' }
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
  constructor(private fb: FormBuilder) {
    for (let insertNumbers = 0; insertNumbers <= 10; insertNumbers++) {
      this.allNumbers.push(insertNumbers);
    }
    this.count = 0;
  }

  ngOnInit() {
    this.selectOptions = [{
      id: this.count++,
      name: ' '
    }];
    this.webFormControlList = [
      {
        control: 'radio',
        controllabel: 'I am a (an)',
        controlId: 'usertype',
        indexCount: 'userTypeIndex'
      },
      {
        control: 'radio',
        controllabel: 'Select request type(s)',
        controlId: 'requesttype',
        indexCount: 'requestTypeIndex'
      },
      {
        control: 'input',
        controllabel: 'First Name',
        controlId: 'fname1',
        indexCount: 'FirstNameIndex'
      },
      {
        control: 'input',
        controllabel: 'Last Name',
        controlId: 'lname1',
        indexCount: 'LastNameIndex'
      },
      {
        control: 'input',
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
      this.selectedControlType = !this.selectedControlType;
    } else {
      this.selectedControlType = false;
    }
  }

  addOptions() {
    this.selectOptions.push( {
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
    const controltype = (this.selectedFormOption === 'input') ? 'input' : 'select';
    this.formControlList.push(formControls.value.lblText);
    const trimLabel = formControls.value.lblText.split(' ').join('');
    this.webFormControlList.push( {
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
  selectOptions?: any;
}
