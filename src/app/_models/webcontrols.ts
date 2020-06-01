export class WebControls {
    // stateList: any;
    // countries: any;
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
    { id: 'AP', name: 'Andhra Pradesh' },
    { id: 'ARP', name: 'Arunachal Pradesh' },
    { id: 'AS', name: 'Assam' },
    { id: 'BH', name: 'Bihar' }
    ];

loadWebControls() {
    // this.loadStateAndCountry();
    if (localStorage.getItem('formControlList') === null || localStorage.getItem('formControlList') === undefined) {

        const controlsList = [
            {
                control: 'img',
                controllabel: 'Header Logo',
                controlId: 'headerlogo',
                indexCount: 'header_logo_Index',
                headerColor: '',
                logoURL: '',
                preferControlOrder: ''
            },
            {
                control: 'text',
                controllabel: 'Welcome Text',
                controlId: 'welcometext',
                indexCount: 'welcome_text_Index',
                welcomeText: 'Welcome text',
                welcomeTextColor: '',
                welcomeFontSize: '',
                preferControlOrder: ''
            },
            {
                control: 'radio',
                controllabel: 'I am a (an)',
                controlId: 'subjecttype',
                indexCount: 'subject_type_Index',
                selectOptions: 'subjectType',
                preferControlOrder: ''
            },
            {
                control: 'radio',
                controllabel: 'Select request type(s)',
                controlId: 'requesttype',
                indexCount: 'request_type_Index',
                selectOptions: 'requestType',
                preferControlOrder: ''
            },
            {
                control: 'textbox',
                controllabel: 'First Name',
                controlId: 'firstname',
                indexCount: 'first_name_Index',
                preferControlOrder: ''
            },
            {
                control: 'textbox',
                controllabel: 'Last Name',
                controlId: 'lastname',
                indexCount: 'last_name_Index',
                preferControlOrder: ''
            },
            {
                control: 'textbox',
                controllabel: 'Email',
                controlId: 'email',
                indexCount: 'email_Index',
                preferControlOrder: ''
            },
            {
                control: 'textbox',
                controllabel: 'City',
                controlId: 'city',
                indexCount: 'city_Index',
                preferControlOrder: ''
            },
            {
                control: 'select',
                controllabel: 'State',
                controlId: 'state',
                indexCount: 'state_Index',
                selectOptions: this.stateList,
                preferControlOrder: ''
            },
            {
                control: 'select',
                controllabel: 'Country',
                controlId: 'country',
                indexCount: 'country_Index',
                selectOptions: this.countries,
                preferControlOrder: ''
            },
            {
                control: 'textarea',
                controllabel: 'Request Details',
                controlId: 'requestdetails',
                indexCount: 'request_details_Index',
                preferControlOrder: ''
            },
            {
                control: 'text',
                controllabel: 'Footer Text',
                controlId: 'footertext',
                indexCount: 'footer_text_Index',
                footerText: 'Footer Text',
                footerTextColor: '',
                footerFontSize: '',
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
    // getCCPAdefaultConfigById() {
    //     this.organizationService.orglist().pipe(
    //       switchMap((data) => {
    //         for (const key in data) {
    //           if (data[key] !== undefined) {
    //             return this.ccpaRequestService.getCCPAdefaultRequestSubjectType(data[key][0].orgid);
    //           }
    //         }
    //       })
    //     ).subscribe((data) => {
    //       if (data !== undefined) {
    //         const key = 'response';
    //         const rdata = data[key].request_type;
    //         const sdata = data[key].subject_type;
    //         this.requestType = rdata;
    //         this.subjectType = sdata;
    //         this.loadWebControls();
    //       }
    //     });
    //   }
}
