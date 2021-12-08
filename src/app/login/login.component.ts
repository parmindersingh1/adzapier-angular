import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AlertService, AuthenticationService, UserService} from './../_services';
import {OrganizationService} from '../_services/organization.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {moduleName} from '../_constant/module-name.constant';
import {animate, group, query, state, style, transition, trigger} from '@angular/animations';
import { Observable, timer, Subscription } from 'rxjs';
import {options} from 'ionicons/icons';

const left = [
  query(':enter, :leave', style({ }), { optional: true }),
  group([
    query(':enter', [style({ transform: 'translateX(-57px)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
      optional: true,
    }),
    query(':leave', [style({ display:'none' }), animate('.3s ease-out', style({ transform: 'translateX(57px)' }))], {
      optional: true,
    }),
  ]),
];

const right = [
  query(':enter, :leave', style({}), { optional: true }),
  group([
    query(':enter', [style({ transform: 'translateX(57px)' }), animate('.3s ease-in-out', style({ transform: 'translateX(0%)' }))], {
      optional: true,
    }),
    query(':leave', [style({ display:'none' }), animate('.3s ease-out', style({ transform: 'translateX(-57px)' }))], {
      optional: true,
    }),
  ]),
];

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    // trigger('slideInOut', [
    //   state('false', style({
    //     transform: 'translateX(0)'
    //   })),
    //   state('true', style({
    //     transform: 'translateX(-550px)'
    //   })),
    //   transition('false <=> true', animate('400ms ease-in-out'))
    // ])
    trigger('animImageSlider', [
      transition(':increment', right),
      transition(':decrement', left),
    ]),


  ]

})
export class LoginComponent implements OnInit, OnDestroy {

  private usersdata: any;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  errorMsg: string;
  show: Boolean = false;
  show1: Boolean = false;
  sign_in: string = 'Login';
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  step:any = 1;
  isEmailVerified: boolean;
  isMsgConfirm = false;
  isVerificationBtnClick = false;
  isInvitedUserVerified: boolean;
  hideMessage: boolean;
  subscription:Subscription;
  timer : Observable<any>;
  forgotpasswordForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private orgservice: OrganizationService,
    private loadingBar: NgxUiLoaderService,
    private userService: UserService,
    private authService: AuthenticationService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
    this.isEmailVerified = true;
  }


  ngOnInit() {
    const element = document.getElementById('main');
    element.classList.remove('container');
    element.classList.remove('site-content');
    element.classList.add('container-fluid');
    element.style.padding = '0px';
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern]],
      password: ['', [Validators.required]]
    });
    this.forgotpasswordForm = this.formBuilder.group({
      emailid: ['', [Validators.required, Validators.pattern]]
    });
    this.authenticationService.userEmailVerificationStatus.subscribe((data) => this.isInvitedUserVerified = data);
    //this.setTimer();
  }

  ngOnDestroy() {
    const element = document.getElementById('main');
    element.classList.remove('container-fluid');
    element.style.padding = null;
   // element.classList.add('container');
    element.classList.add('site-content');
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  get r(){
    return this.forgotpasswordForm.controls;
  }

  next(){
    this.step = this.step + 1;
  }

  previous(){
    this.step = this.step - 1;

  }
  clearError() {
    this.errorMsg = '';
  }



  onSubmit() {

    this.submitted = true;
    this.show = false;


    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;

    }
    this.loading = true;
    this.authenticationService.login(this.constructor.name, moduleName.loginModule, this.f.email.value.toLowerCase(), this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.response.hasOwnProperty('action')) {
            if (data.response.action === 'required') {
              this.router.navigate(['/signup'], {queryParams: {email: data.response.email, userID: data.response.userID, step: 'required'}});
            }
            return false;
          } else {
            // this.getLoggedInUserDetails();
            this.authenticationService.userLoggedIn.next(true);
            this.authenticationService.currentUserSubject.next(data);
            localStorage.setItem('currentUser', JSON.stringify(data));
            let params = this.route.snapshot.queryParams;
            this.returnUrl = params['redirectURL'];
            // if (params['redirectURL']) {
            if (this.returnUrl) {
              this.router.navigate([params['redirectURL']]);
            } else {
              this.router.navigate(['/home/welcome']);
            }
          }
        },
        error => {
          // if (error == 'Please verify email address.') {
          //   this.isEmailVerified = false;
          //   this.loading = false;
          //   this.isOpen = false;
          // } else {
            this.isOpen = true;
            this.alertMsg = error;
            this.alertType = 'danger';
            this.loading = false;
          // }
        });

  }


  onSubmitForgot() {
    this.submitted = true;
    this.alertService.clear();
    // stop here if form is invalid
    if (this.forgotpasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.loadingBar.start();
    this.userService.forgotpswd(this.constructor.name, moduleName.forgotPasswordModule, this.r.emailid.value)
      .pipe(first())
      .subscribe(data => {
        this.loadingBar.stop();
        this.alertMsg = 'Link sent to your Email, please Reset Your Password..!';
        this.isOpen = true;
        this.alertType = 'success';
        this.loading = false;
        this.submitted = false;
        this.forgotpasswordForm.reset();
      },
        error => {
          this.loadingBar.stop();
          this.alertMsg = 'Email ID is not registered';
          this.isOpen = true;
          this.alertType = 'danger';
          this.loading = false;
          this.submitted = false;
          this.forgotpasswordForm.reset();
        });
  }

  getLoggedInUserDetails() {
    this.loadingBar.start();
    this.userService.getLoggedInUserDetails(this.constructor.name, moduleName.loginModule).subscribe((data) => {
      this.loadingBar.stop();
      this.userService.getCurrentUser.emit(data);
    });
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  onToggle() {
    this.isEmailVerified = !this.isEmailVerified;
    this.loading = false;
    this.isVerificationBtnClick = false;
    this.isMsgConfirm = false;
  }

  resendToken() {
    this.isVerificationBtnClick = true;
    const reqObj = {
      email: this.f.email.value
    }
    this.userService.resendEmailVerificationToken(this.constructor.name, moduleName.loginModule, reqObj).subscribe((data) => {
      if (data.status === 200) {
        this.isMsgConfirm = true;
        this.isVerificationBtnClick = false;
      }
    })
  }

  setTimer(){
    this.timer = timer(8000)
    this.subscription = this.timer.subscribe(() => {
      this.isInvitedUserVerified = false;
      this.hideMessage = true;
    })
  }


}
