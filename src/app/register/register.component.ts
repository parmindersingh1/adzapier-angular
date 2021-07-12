import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AlertService, AuthenticationService, UserService} from './../_services';
import {MustMatch} from '../_helpers/must-match.validator';
import {moduleName} from '../_constant/module-name.constant';
import {environment} from '../../environments/environment';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('registerForm') registerForm: ElementRef;
  regForm: FormGroup;
  loading = false;
  submitted = false;
  navbarCollapsed = false;
  show: boolean = false;
  errorMsg: string;
  alertMsg: any;
  isOpen: boolean;
  alertType: any;
  dismissible = true;
  consentPreferenceSDK: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
  ) {
    this.consentPreferenceSDK = (window as any).CP_SDK_ADZAPIER.init({
      AppID: environment.consentPreferenceConfig.AppID,
      PropID: environment.consentPreferenceConfig.PropID,
      ShowLogs: false, // Show Console Logs
    });
  }

  ngOnInit() {
    const element = document.getElementById('main');
    element.classList.remove('container');
    element.classList.remove('site-content');
    element.classList.add('container-fluid');
    element.style.padding = '0px';
    element.style.margin = '0px';
    const strRegx = '.*\\S.*[a-zA-Z \-\']';
    const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9 ]+$'; // '.*\\S.*[a-zA-z0-9 ]';
    const zipRegex = '^[0-9]*$';
    this.regForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(strRegx)]],
      lastName: ['', [Validators.required, Validators.pattern(strRegx)]],
      companyname: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      email: ['', [Validators.required, Validators.pattern]],
      password: ['', [Validators.required, Validators.pattern, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, Validators.pattern, Validators.minLength(6)]],
      acceptPolicy: [false, Validators.requiredTrue]
    }, {
      validator: MustMatch('password', 'confirmpassword')
    });

  }

  ngOnDestroy() {
    const element = document.getElementById('main');
    element.classList.remove('container-fluid');
    element.style.padding = null;
    element.classList.add('container');
    element.classList.add('site-content');
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.regForm.controls;
  }

  clearError() {
    this.errorMsg = '';
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.regForm.invalid) {
      return false;
    } else {

      this.loading = true;
      const requestObj = {
        firstname: this.f.firstName.value,
        lastname: this.f.lastName.value,
        email: this.f.email.value,
        password: this.f.password.value,
        confirmpassword: this.f.confirmpassword.value,
        companyname: this.f.companyname.value
      };

      this.userService.register(this.constructor.name, moduleName.registerModule, requestObj)
        .pipe(first())
        .subscribe(
          data => {
            this.onSendConsentPreferenceRecord();
            this.alertMsg = 'Account created successfully';
            this.isOpen = true;
            this.alertType = 'success';
            this.router.navigate(['signup/thankyou']);
            this.loading = false;
          },
          error => {
            this.alertMsg = error.company_error || error;
            this.isOpen = true;
            this.alertType = 'info';
            this.loading = false;

          });

    }

  }

  onSendConsentPreferenceRecord() {
    const keys = ['password', 'confirmpassword'];
    const formData = document.getElementById('registerForm');   // Get the <ul> element with id="myList"
    let formDataContent: any = formData.outerHTML;   // Get the <ul> element with id="myList"
    for (const formInputType of keys) {
      formDataContent = formDataContent.replace(formData[formInputType].outerHTML, '');
    }

    const payload = {
      firstname:  this.f.firstName.value,
      lastname: this.f.lastName.value,
      email: this.f.email.value,
    };
    this.consentPreferenceSDK.submit({
      consentData: {
        formId: 'fsa',
        consent: {
          email: payload.email,
          firstName: payload.firstname,
          lastName: payload.lastname,
          dataSource: 'public',
          verified: true,
        },
        exculdes: ['password'],
        preferences: [ // Optional
          {preference: 'terms_and_conditions', allow: true},
          {preference: 'privacy_policy', allow: true},
        ],
      },

      legalNotices: [ // Optional
          {
              identifier: 'terms_and_conditions',
              // version: '1.0.0',
              version: 1,
              content: ''
          },
          {
              identifier: 'privacy_policy',
              // version: '1.0.0',
              version: 1,
              content: ''
          }

      ],
      proofs: [ // Optional
          {
              content: JSON.stringify(payload),
              form: formDataContent
          }
      ],
      autodetectIpAddress: true, // A parameter that enable or disable the ip autodetect. Default to: true
    });
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

}
