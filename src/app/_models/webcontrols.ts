import { Injectable } from '@angular/core';
import { CcparequestService } from '../_services/ccparequest.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
export class WebControls {
    // stateList: any;
    // countries: any;
    constructor() { }

    // countries = [
    // {
    //     id: 'us',
    //     name: 'United States'
    // },
    // {
    //     id: 'uk',
    //     name: 'United Kingdom'
    // },
    // {
    //     id: 'ca',
    //     name: 'Canada'
    // }
    // ];
    // stateList = [
    // { id: 'AP', name: 'Andhra Pradesh' },
    // { id: 'ARP', name: 'Arunachal Pradesh' },
    // { id: 'AS', name: 'Assam' },
    // { id: 'BH', name: 'Bihar' }
    // ];

loadWebControls() {
    // this.loadStateAndCountry();
    if (localStorage.getItem('formControlList') === null || localStorage.getItem('formControlList') === undefined) {

        const controlsList = [
            {
                control: 'img',
                controllabel: 'Header Logo',
                controlId: 'headerlogo',
                indexCount: 'header_logo_Index',
                headerColor: '#3968fa',
                logoURL: '',
                preferControlOrder: ''
            },
            {
                control: 'text',
                controllabel: 'Welcome Text',
                controlId: 'welcometext',
                indexCount: 'welcome_text_Index',
                welcomeText: `<p>Welcome! Please complete this form to submit a request ` +
                             `and we will respond as soon as possible. Thank you.</p>`,
                welcomeTextColor: '#333333',
                welcomeFontSize: '13',
                preferControlOrder: ''
            },
            {
                control: 'radio',
                controllabel: 'I am a (an)',
                controlId: 'subjecttype',
                indexCount: 'subject_type_Index',
                selectOptions: '',
                preferControlOrder: '',
                requiredfield: ''
            },
            {
                control: 'radio',
                controllabel: 'Select request type(s)',
                controlId: 'requesttype',
                indexCount: 'request_type_Index',
                selectOptions: '',
                preferControlOrder: '',
                requiredfield: ''
            },
            {
                control: 'textbox',
                controllabel: 'First Name',
                controlId: 'firstname',
                indexCount: 'first_name_Index',
                preferControlOrder: '',
                requiredfield: ''
            },
            {
                control: 'textbox',
                controllabel: 'Last Name',
                controlId: 'lastname',
                indexCount: 'last_name_Index',
                preferControlOrder: '',
                requiredfield: ''
            },
            {
                control: 'textbox',
                controllabel: 'Email',
                controlId: 'email',
                indexCount: 'email_Index',
                preferControlOrder: '',
                requiredfield: ''
            },
            {
                control: 'select',
                controllabel: 'Country',
                controlId: 'country',
                indexCount: 'country_Index',
                selectOptions: '',
                preferControlOrder: '',
                requiredfield: ''
            },
            {
                control: 'select',
                controllabel: 'State',
                controlId: 'state',
                indexCount: 'state_Index',
                selectOptions: '',
                preferControlOrder: '',
                requiredfield: ''
            },
            {
                control: 'textbox',
                controllabel: 'City',
                controlId: 'city',
                indexCount: 'city_Index',
                preferControlOrder: '',
                requiredfield: ''
            },
            {
                control: 'textarea',
                controllabel: 'Request Details',
                controlId: 'requestdetails',
                indexCount: 'request_details_Index',
                preferControlOrder: '',
                requiredfield: ''
            },
            {
                control: 'file',
                controllabel: 'Upload attachement',
                controlId: 'fileupload',
                indexCount: 'file_upload_Index',
                preferControlOrder: '',
                requiredfield: '',
                ismandatory: ''
            },
            {
                control: 'captcha',
                controllabel: 'Captcha',
                controlId: 'captchacontrol',
                indexCount: 'captcha_control_Index',
                preferControlOrder: '',
                requiredfield: ''
            },
            {
                control: 'text',
                controllabel: 'Footer Text',
                controlId: 'footertext',
                indexCount: 'footer_text_Index',
                footerText: `<p>Adzapier <br/> 123 Main Street Capital City, ST, USA 10001 +1-800-000-0000 emailprivacy@generitech.com</p>`,
                footerTextColor: '#333333',
                footerFontSize: '13',
                preferControlOrder: ''
            }
        ];
        localStorage.setItem('formControlList', JSON.stringify(controlsList));
        return;
    } else {
        console.log('else webcontrolList..');
    }

}

/*loadCreatedWebControls() {
// localStorage.setItem('CCPAformControlList', JSON.stringify(data));
if (localStorage.getItem('CCPAformControlList') === null || localStorage.getItem('CCPAformControlList') === undefined) {

    const controlsList = [
        {
            control: 'radio',
            controllabel: 'I am a (an)',
            controlId: 'subjecttype',
            indexCount: 'subjecttypeIndex',
            selectOptions: 'subjectType',
            preferControlOrder: 0
        },
        {
            control: 'radio',
            controllabel: 'Select request type(s)',
            controlId: 'requesttype',
            indexCount: 'requestTypeIndex',
            selectOptions: 'requestType',
            preferControlOrder: 1
        },
        {
            control: 'textbox',
            controllabel: 'First Name',
            controlId: 'fname1',
            indexCount: 'FirstNameIndex',
            preferControlOrder: 2
        },
        {
            control: 'textbox',
            controllabel: 'Last Name',
            controlId: 'lname1',
            indexCount: 'LastNameIndex',
            preferControlOrder: 3
        },
        {
            control: 'textbox',
            controllabel: 'Email',
            controlId: 'email',
            indexCount: 'EmailIndex',
            preferControlOrder: 4
        },
        {
            control: 'select',
            controllabel: 'State',
            controlId: 'state',
            indexCount: 'StateIndex',
            selectOptions: this.stateList,
            preferControlOrder: 5
        },
        {
            control: 'select',
            controllabel: 'Country',
            controlId: 'country',
            indexCount: 'CountryIndex',
            selectOptions: this.countries,
            preferControlOrder: 6
        },
        {
            control: 'textarea',
            controllabel: 'Request Details',
            controlId: 'requestdetails',
            indexCount: 'RequestDetailsIndex',
            preferControlOrder: 7
        }
    ];
    localStorage.setItem('CCPAformControlList', JSON.stringify(controlsList));
    return;
} else {
    console.log('else webcontrolList..');
}

}*/

    // loadStateAndCountry() {
    //     this.countries = [
    //         {
    //           id: 'us',
    //           name: 'United States'
    //         },
    //         {
    //           id: 'uk',
    //           name: 'United Kingdom'
    //         },
    //         {
    //           id: 'ca',
    //           name: 'Canada'
    //         }
    //       ];

    //     this.stateList = [
    //         { id: 'AP', name: 'Andhra Pradesh' },
    //         { id: 'ARP', name: 'Arunachal Pradesh' },
    //         { id: 'AS', name: 'Assam' },
    //         { id: 'BH', name: 'Bihar' }
    //       ];
    // }
    // kept for request type, subject type for later use
}
