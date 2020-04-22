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
                control: 'radio',
                controllabel: 'I am a (an)',
                controlId: 'subjecttype',
                indexCount: 'subjecttypeIndex',
                selectOptions: 'subjectType'
            },
            {
                control: 'radio',
                controllabel: 'Select request type(s)',
                controlId: 'requesttype',
                indexCount: 'requestTypeIndex',
                selectOptions: 'requestType'
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
                controlId: 'state',
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
        localStorage.setItem('formControlList', JSON.stringify(controlsList));
        return;
    } else {
        console.log('else webcontrolList..');
    }

}

loadCreatedWebControls() {
// localStorage.setItem('CCPAformControlList', JSON.stringify(data));
if (localStorage.getItem('CCPAformControlList') === null || localStorage.getItem('CCPAformControlList') === undefined) {

    const controlsList = [
        {
            control: 'radio',
            controllabel: 'I am a (an)',
            controlId: 'subjecttype',
            indexCount: 'subjecttypeIndex',
            selectOptions: 'subjectType'
        },
        {
            control: 'radio',
            controllabel: 'Select request type(s)',
            controlId: 'requesttype',
            indexCount: 'requestTypeIndex',
            selectOptions: 'requestType'
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
            controlId: 'state',
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
    localStorage.setItem('CCPAformControlList', JSON.stringify(controlsList));
    return;
} else {
    console.log('else webcontrolList..');
}

}

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
