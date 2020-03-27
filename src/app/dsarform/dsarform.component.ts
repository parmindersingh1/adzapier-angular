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

  // returns all form groups under contacts
  get contactFormGroup() {
    return this.form.get('contacts') as FormArray;
  }
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

  done = [
    { value: '1 Get up', disabled: false },
    { value: '2 Brush teeth', disabled: false },
    { value: '3 Take a shower', disabled: true },
    { value: '4 Check e-mail', disabled: false },
    { value: '5 Walk dog', disabled: false }
  ];
  attendeesList: RegistrationForm[] = [];
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
 
  stateList = [
    {id:'AP',name: 'Andhra Pradesh'},
    {id:'ARP',name: 'Arunachal Pradesh'},
    {id:'AS',name: 'Assam'},
    {id:'BH',name: 'Bihar'}
     
  ];

  usertype  = [
    {id:'1',usertype:'Perspective Employee'},
    {id:'2',usertype:'Customer'},
    {id:'3',usertype:'Employee'}
  ]

  requesttype = [
    {id:'1',reqtype:'Info Request'},
    {id:'2',reqtype:'Data Deletion'},
    {id:'3',reqtype:'Do not Sell My Information'}
  ]
  

  myForm: FormGroup;
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
  alteArtists = [
    'Artist 1 - Odunsi',
    'Artist 2 - Nonso',
    'Artist 3 - Wavy the creator',
    'Artist 4 - Dwin',
    'Artist 5 - SDC',
    'Artist 6 - Teni'
  ];
  constructor(private fb: FormBuilder) {
    for (let insertNumbers = 0; insertNumbers <= 10; insertNumbers++) {
      this.allNumbers.push(insertNumbers);
    }

  }

  // dataSubjectAccessRightsForm = this.fb.array({
  //   firstname: ['', Validators.required],
  //   lastname: [''],
  //   email: [''],
  //   requiredDetails: []
  // });

  // dataSubjectAccessRightsForm = this.fb.array([
  //   this.fb.control('firstname'),
  //   this.fb.control('lastname'),
  //   this.fb.control('email'),
  //   this.fb.control('requiredDetails')
  // ]);

  ngOnInit() {
    this.attendeesList = [
      {
        control: 'radio',
        controllabel: 'I am a (an)',
        controlId: 'usertype'
      },
      {
        control: 'radio',
        controllabel: 'Select request type(s)',
        controlId: 'requesttype'
      },
      {
        control: 'input',
        controllabel: 'First Name',
        controlId: 'fname1'
      },
      {
        control: 'input',
        controllabel: 'Last Name',
        controlId: 'lname1'
      },
      {
        control: 'input',
        controllabel: 'Email',
        controlId: 'email'
      },
      {
        control: 'select',
        controllabel: 'State',
        controlId: 'state5'
      },
      {
        control: 'select',
        controllabel: 'Country',
        controlId: 'country6'
      },
      {
        control: 'textarea',
        controllabel: 'Request Details',
        controlId: 'requestdetails7'
      }
    ];

  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  register(formData: NgForm) {
    console.log(formData);
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.attendeesList, event.previousIndex, event.currentIndex);
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
  }

  onFormSubmit(data: NgForm){
    console.log(data,'onFormSubmit..');
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


}
