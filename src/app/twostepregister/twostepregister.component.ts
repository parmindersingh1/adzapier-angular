import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService, AuthenticationService, UserService} from './../_services';
import {MustMatch} from '../_helpers/must-match.validator';
import {delay, first} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Observable, timer, Subscription, pipe} from 'rxjs';
import {moduleName} from '../_constant/module-name.constant';
import {environment} from '../../environments/environment';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-twostepregister',
  templateUrl: './twostepregister.component.html',
  styleUrls: ['./twostepregister.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('false', style({
        transform: 'translateX(0)'
      })),
      state('true', style({
        transform: 'translateY(-550px)',
        'z-index': '-1'
      })),
      transition('false <=> true', animate('400ms ease-in-out'))
    ])

  ]
})
export class TwostepregisterComponent implements OnInit {
  @ViewChild('template', {static: true}) template: ElementRef;
  @ViewChild('registerForm') registerForm: ElementRef;
  regForm: FormGroup;
  secondregForm: FormGroup;
  passwordForm: FormGroup;
  loading = false;
  protocolList = ['http://', 'https://'];
  step: any = 1;
  submitted = false;
  navbarCollapsed = false;
  show: boolean = false;
  errorMsg: string;
  modalRef: BsModalRef;
  stripe;
  alertMsg: any;
  isOpen: boolean;
  alertType: any;
  dismissible = true;
  consentPreferenceSDK: any;
  isLoading = false;
  emailid: any;
  verified = 'Email Not Verified';
  userid: any;
  planID: any;
  units: any;
  selectedVal: any;
  countries: string[];
  isInvitedUserVerified: boolean;
  showNextScreen: boolean;
  message;
  options: string[];
  public id: string;
  isVerificationBtnClick: boolean;
  isMsgConfirm: boolean;
  verifyEmailForm: FormGroup;
  emailnotverifiedMsg;
  subscription: any;
  timer: Observable<number>;
  hideMessage: boolean;
  returnUrl: any;
  passwords: any;
  chckresponse: any;
  plantype = '0';
  requiredID = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private loader: NgxUiLoaderService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
  ) {
    this.countries = [
      'Afghanistan',
      'Albania',
      'Algeria',
      'Andorra',
      'Angola',
      'Antigua and Barbuda',
      'Argentina',
      'Armenia',
      'Australia',
      'Austria',
      'Azerbaijan',
      'Bahamas',
      'Bahrain',
      'Bangladesh',
      'Barbados',
      'Belarus',
      'Belgium',
      'Belize',
      'Benin',
      'Bhutan',
      'Bolivia',
      'Bosnia and Herzegovina',
      'Botswana',
      'Brazil',
      'Brunei',
      'Bulgaria',
      'Burkina Faso',
      'Burundi',
      'Cabo Verde ',
      'Cambodia ',
      'Cameroon ',
      'Canada',
      'Central African Republic',
      'Chad',
      'Chile ',
      'China ',
      'Colombia ',
      'Comoros ',
      'Congo Democratic Republic of the',
      'Congo Republic of the',
      'Costa Rica ',
      'Cote d\'Ivoire ',
      'Croatia ',
      'Cuba ',
      'Cyprus ',
      'Czechia ',
      'Denmark',
      'Djibouti',
      'Dominica',
      'Dominican Republic',
      'Ecuador',
      'Egypt',
      'El Salvador',
      'Equatorial Guinea',
      'Eritrea',
      'Estonia',
      'Eswatini',
      'Ethiopia',
      'Fiji',
      'Finland',
      'France',
      'Gabon',
      'Gambia',
      'Georgia',
      'Germany',
      'Ghana',
      'Greece',
      'Grenada',
      'Guatemala',
      'Guinea',
      'Guinea-Bissau',
      'Guyana',
      'Haiti',
      'Honduras',
      'Hungary',
      'Iceland',
      'India',
      'Indonesia',
      'Iran',
      'Iraq',
      'Ireland',
      'Israel',
      'Italy',
      'Jamaica',
      'Japan',
      'Jordan',
      'Kazakhstan',
      'Kenya',
      'Kiribati',
      'Kosovo',
      'Kuwait',
      'Kyrgyzstan',
      'Laos',
      'Latvia',
      'Lebanon',
      'Lesotho',
      'Liberia',
      'Libya',
      'Liechtenstein',
      'Lithuania',
      'Luxembourg',
      'Madagascar',
      'Malawi',
      'Malaysia',
      'Maldives',
      'Mali',
      'Malta',
      'Marshall Islands',
      'Mauritania',
      'Mauritius',
      'Mexico',
      'Micronesia',
      'Moldova',
      'Monaco',
      'Mongolia',
      'Montenegro',
      'Morocco',
      'Mozambique',
      'Myanmar',
      'Namibia',
      'Nauru',
      'Nepal',
      'Netherlands',
      'New Zealand',
      'Nicaragua',
      'Niger',
      'Nigeria',
      'North Korea',
      'North Macedonia',
      'Norway',
      'Oman',
      'Pakistan',
      'Palau',
      'Palestine',
      'Panama',
      'Papua New Guinea',
      'Paraguay',
      'Peru',
      'Philippines',
      'Poland',
      'Portugal',
      'Qatar',
      'Romania',
      'Russia',
      'Rwanda',
      'Saint Kitts and Nevis',
      'Saint Lucia',
      'Saint Vincent and the Grenadines',
      'Samoa',
      'San Marino',
      'Sao Tome and Principe',
      'Saudi Arabia',
      'Senegal',
      'Serbia',
      'Seychelles',
      'Sierra Leone',
      'Singapore',
      'Slovakia',
      'Slovenia',
      'Solomon Islands',
      'Somalia',
      'South Africa',
      'South Korea',
      'South Sudan',
      'Spain',
      'Sri Lanka',
      'Sudan',
      'Suriname',
      'Sweden',
      'Switzerland',
      'Syria',
      'Taiwan',
      'Tajikistan',
      'Tanzania',
      'Thailand',
      'Timor-Leste',
      'Togo',
      'Tonga',
      'Trinidad and Tobago',
      'Tunisia',
      'Turkey',
      'Turkmenistan',
      'Tuvalu',
      'Uganda',
      'Ukraine',
      'United Arab Emirates ',
      'United Kingdom ',
      'United States of America ',
      'Uruguay',
      'Uzbekistan',
      'Vanuatu',
      'Vatican City ',
      'Venezuela',
      'Vietnam',
      'Yemen',
      'Zambia',
      'Zimbabwe',


    ];

  }

  ngOnInit() {
    this.verifyEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern]]
    });
    this.route.queryParams
      .subscribe((params: any) => {
        if (params.hasOwnProperty('step')) {
          this.emailid = params.email;
          this.userid = params.userID;
          this.id = '';
          this.isInvitedUserVerified = true;
          this.step = 3;
          this.requiredID = false;
        } else {
          this.id = params.id;
          this.requiredID = true
        }
      });
    this.onGetVerifyEmailRecord();
    // this.id = this.route.snapshot.paramMap.get('id');
    if (this.requiredID) {
      const requestObj = {
        token: this.id
      };
      this.loader.start();
      this.userService.verifyEmailAddress(this.constructor.name, moduleName.verifyEmailModule, requestObj).pipe(delay(2000))
        .subscribe((data) => {
          this.loader.stop();
          if (data) {
            //  this.isUserVarified = true;
            this.alertMsg = 'Your email is successfully verified !';
            this.isOpen = true;
            this.alertType = 'success';
            this.message = 'Your email is successfully verified !';
            this.authenticationService.isUserVerified.next(true);
            this.isInvitedUserVerified = true;
            this.showNextScreen = true;
            setTimeout(() => {
              this.id = '';
              this.isInvitedUserVerified = true;
              this.userid = data.userID;
              this.emailid = data.email;
              this.step = 3;
            }, 1000);
            //this.router.navigate(['/signup']);
          }
        }, error => {
          this.loader.stop();
//      this.isUserVarified = false;
          this.message = 'This link has been expired!';
          this.authenticationService.isUserVerified.next(false);
          this.isInvitedUserVerified = false;
          this.showNextScreen = false;
          //this.router.navigate(['/verify-email/',this.id]);
        });
    }
    //this.authenticationService.userEmailVerificationStatus.subscribe((data) => this.isInvitedUserVerified = data);
    //this.showNextScreen = this.isInvitedUserVerified ? true : false;
    this.setTimer();
    const element = document.getElementById('main');
    element.classList.remove('container');
    element.classList.remove('site-content');
    element.classList.add('container-fluid');
    element.style.padding = '0px';
    // element.style.margin = '0px';
    const strRegx = '.*\\S.*[a-zA-Z \-\']';
    const urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9 ]+$'; // '.*\\S.*[a-zA-z0-9 ]';
    const organname = '.*\\S.*[a-zA-z0-9 ]';
    const pinzipRegex = '^[0-9]{5,20}$';
    const zipRegex = '^[0-9]*$';
    this.regForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(strRegx)]],
      lastName: ['', [Validators.required, Validators.pattern(strRegx)]],
      country: ['', [Validators.required, Validators.pattern(strRegx)]],
      email: ['', [Validators.required, Validators.pattern]],
      password: ['', [Validators.required, Validators.pattern, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, Validators.pattern, Validators.minLength(6)]],
      acceptPolicy: [false, Validators.requiredTrue]
    }, {
      validator: MustMatch('password', 'confirmpassword')
    });

    this.secondregForm = this.formBuilder.group({
      companyname: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      address1: ['', [Validators.required]],
      address2: [''],
      city: ['', [Validators.required, Validators.pattern(strRegx)]],
      state: ['', [Validators.required, Validators.pattern(strRegx)]],
      code: ['', [Validators.required, Validators.pattern(pinzipRegex)]],
      phone: ['', [Validators.minLength(5), Validators.maxLength(15), Validators.pattern(zipRegex)]],
      protocol: ['https://', [Validators.required]],
      website: ['', [Validators.required, Validators.pattern(urlRegex)]],
      logourl: ['']
    })
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern, Validators.minLength(6)]],
    });
    if (this.route.snapshot.queryParams['plan_id']) {
      this.planID = this.route.snapshot.queryParams['plan_id'];
    } else {
      this.planID = environment.cookiefreePlanID;
    }


    if (this.route.snapshot.queryParams['units']) {
      this.units = this.route.snapshot.queryParams['units'];
    } else {
      this.units = '1';
    }

    if (this.route.snapshot.queryParams['plan_type']) {
      this.plantype = this.route.snapshot.queryParams['plan_type'];
    } else {
      this.plantype = '0';
    }

    // this.plantype=this.route.snapshot.queryParams["plan_type"]


  }

// ngAfterViewInit() {
//     this.consentPreferenceSDK = (window as any).CP_SDK_ADZAPIER.init({
//       AppID: environment.consentPreferenceConfig.AppID,
//       PropID: environment.consentPreferenceConfig.PropID,
//       ShowLogs: false, // Show Console Logs
//     });
// }

// convenience getter for easy access to form fields
  get vemail() {
    return this.verifyEmailForm.controls;
  }

  ngOnDestroy() {
    const element = document.getElementById('main');
    element.classList.remove('container-fluid');
    element.style.padding = null;
    // element.style.margin = null;
    // element.classList.add('container');
    element.classList.add('site-content');
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.regForm.controls;
  }
  get p() {
    return this.passwordForm.controls;
  }
  get r() {
    return this.secondregForm.controls;
  }

  async wait(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  clearError() {
    this.errorMsg = '';
  }

  previous() {
    this.step = this.step - 1;
  }

  next() {
    this.step = this.step + 1;
    if (this.step == 2) {
      this.isLoading = true;
      setInterval(() => {
        if (this.verified === 'Email Not Verified') {
          this.onGetVerifyEmailRecord();
        } else {
          this.isLoading = false;
          this.step = 3;
        }
      }, 5000);
      //  this.onGetVerifyEmailRecord();

    }
  }

  stoped() {
    this.isLoading = true;
  }

  changetext() {
    this.verified = 'Email Verified';
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.regForm.invalid) {
      return false;
    } else {

      this.loading = true;
      this.passwords = this.f.password.value;
      const requestObj = {
        firstname: this.f.firstName.value,
        lastname: this.f.lastName.value,
        email: this.f.email.value,
        password: this.f.password.value,
        confirmpassword: this.f.confirmpassword.value,
        country: this.f.country.value
      };

      this.userService.registration(this.constructor.name, moduleName.registerModule, requestObj)
        .pipe(first())
        .subscribe(
          data => {
            this.emailid = data.response.email;
            this.userid = data.response.uid;
            this.onSendConsentPreferenceRecord();
            this.submitted = false;
            this.alertMsg = 'Account created successfully';
            this.isOpen = true;
            this.alertType = 'success';
            this.loading = false;
            this.next();
          },
          error => {
            this.loading = false;
            this.alertMsg = error.company_error || error;
            this.isOpen = true;
            this.alertType = 'danger';

          });

    }

  }

  private  onCheckOut(response: any) {
  return   (window as any).Stripe(environment.stripePublishablekey).redirectToCheckout({
      sessionId: response
    }).then(res => {
      return res;
  }).catch(err => {
    this.alertMsg = err;
    this.isOpen = true;
    this.alertType = 'danger';
  });
  }

  onGetVerifyEmailRecord() {
    if (this.emailid !== undefined) {
      this.userService.getverifyemailRecord(this.emailid)
        .subscribe((res: any) => {
          const result: any = res;
          if (result.status === 200) {
            this.authenticationService.isUserVerified.next(true);
            this.verified = result.response;
            this.isInvitedUserVerified = true;
          }
        }, error => {
        });
    }
  }


  onSubSecond() {
    this.submitted = true;
    if (this.secondregForm.invalid) {
      return false;
    } else {
      this.loading = true;
      const requObj = {
        companyname: this.r.companyname.value,
        website: this.r.protocol.value + this.r.website.value,
        address1: this.r.address1.value,
        address2: this.r.address2.value,
        city: this.r.city.value,
        state: this.r.state.value,
        zipcode: this.r.code.value,
        phone: this.r.phone.value,
      };
      this.userService.AddOrgCmpProp(this.constructor.name, moduleName.registerModule, requObj, this.emailid, this.userid, this.planID, this.units, this.plantype)
        .pipe(first())
        .subscribe(
          res => {
            const result: any = res;
            this.alertMsg = 'Sucessfully added details';
            this.isOpen = true;
            this.alertType = 'success';
            this.loading = false;
            this.chckresponse = result.response.stripe_sessionId;
            if (this.f.password.value) {
              this.login();
            } else {
              this.openPasswordModal();
            }
          },
          error => {
            this.alertMsg = error.company_error || error;
            this.isOpen = true;
            this.alertType = 'danger';
            this.loading = false;

          });

    }
  }

  openPasswordModal() {
    this.modalRef = this.modalService.show(this.template, {
      animated: false, keyboard: false, ignoreBackdropClick: true
    });
  }

  onSubmitPassword() {
    this.submitted = true;
    if (this.secondregForm.invalid) {
      return false;
    }
    this.login();
  }
  login() {
    this.loader.start();
    const that = this;
    const password =  this.f.password.value ?  this.f.password.value : this.passwordForm.value.password;
    this.authenticationService.login(this.constructor.name, moduleName.loginModule, this.emailid, password)
      .pipe( first())
      .subscribe(
        async data => {
          this.loader.stop();
          this.passwordForm.value.password ? this.modalRef.hide() : null;
          // this.getLoggedInUserDetails();
          this.authenticationService.userLoggedIn.next(true);
          this.authenticationService.currentUserSubject.next(data);
          localStorage.setItem('currentUser', JSON.stringify(data));
          await that.onCheckOut(this.chckresponse);
          let params = this.route.snapshot.queryParams;
          this.returnUrl = params['redirectURL'];
          // if (params['redirectURL']) {
          if (this.returnUrl) {
            this.router.navigate([params['redirectURL']]);
          } else {
            this.router.navigate(['/home/welcome']);
          }
        },
        error => {
          // if (error == 'Please verify email address.') {
          //   this.isEmailVerified = false;
          //   this.loading = false;
          //   this.isOpen = false;
          // } else {
          this.loader.stop();
          this.isOpen = true;
          this.alertMsg = error;
          this.alertType = 'danger';
          this.loading = false;
          // }
        });
  }

  onSendConsentPreferenceRecord() {
    this.consentPreferenceSDK = (window as any).CP_SDK_ADZAPIER.init({
      AppID: environment.consentPreferenceConfig.AppID,
      PropID: environment.consentPreferenceConfig.PropID,
      ShowLogs: false, // Show Console Logs
    });
    const keys = ['password', 'confirmpassword'];
    const formData = document.getElementById('registerForm');   // Get the <ul> element with id="myList"
    let formDataContent: any = formData.outerHTML;   // Get the <ul> element with id="myList"
    for (const formInputType of keys) {
      formDataContent = formDataContent.replace(formData[formInputType].outerHTML, '');
    }

    const payload = {
      firstname: this.f.firstName.value,
      lastname: this.f.lastName.value,
      email: this.f.email.value,
    };
    this.consentPreferenceSDK.submit({
      consentData: {
        formId: 'fsa',
        consent: {
          email: payload.email,
          first_name: payload.firstname,
          last_name: payload.lastname,
          data_source: 'public',
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
    }, res => {
      console.log('consent response', res);
    });
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  onToggle() {
    this.isInvitedUserVerified = !this.isInvitedUserVerified;
    this.loading = false;
    this.isVerificationBtnClick = false;
    this.isMsgConfirm = false;
  }

  resendToken() {
    this.isVerificationBtnClick = true;
    const reqObj = {
      email: this.vemail.email.value
    }
    this.userService.resendEmailVerificationToken(this.constructor.name, moduleName.loginModule, reqObj).subscribe((data) => {
      if (data.status === 200) {
        this.isMsgConfirm = true;
        this.isVerificationBtnClick = false;
      }
    }, (error) => {
      if (error == null) {
        this.emailnotverifiedMsg = 'User not found!';
        this.isInvitedUserVerified = false;
      }
      this.isInvitedUserVerified = false;
    })
  }

  setTimer() {
    this.timer = timer(8000)
    this.subscription = this.timer.subscribe(() => {
      this.showNextScreen = false;
      this.hideMessage = true;
    })
  }

}

