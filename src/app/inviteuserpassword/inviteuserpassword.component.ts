import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, UserService, AuthenticationService } from './../_services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { MustMatch } from '../_helpers/must-match.validator';
import {moduleName} from '../_constant/module-name.constant';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {first} from 'rxjs/operators';


@Component({
  selector: 'app-inviteuserpassword',
  templateUrl: './inviteuserpassword.component.html',
  styleUrls: ['./inviteuserpassword.component.scss']
})
export class InviteuserpasswordComponent implements OnInit {

  private usersdata: any;
  ConfirmPasswordForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  errorMsg: string;
  show: Boolean = false;
  show1: Boolean = false;
  sign_in: string = 'Confirm';
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  isEmailVerified: boolean;
  isMsgConfirm = false;
  isVerificationBtnClick = false;
  successmessage: any;
  errormessage: any;
  public userid: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private userService: UserService,
    private loadingBar: NgxUiLoaderService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.snapshot.paramMap.get('userid');

   }

  ngOnInit(): void {
    const element = document.getElementById('main');
    element.classList.remove('container');
    element.classList.remove('site-content');
    element.classList.add('container-fluid');
    element.style.padding = '0px';
    element.style.margin = '0px';
    this.userid = this.activatedRoute.snapshot.paramMap.get('userid');
    this.ConfirmPasswordForm = this.formBuilder.group({
      token:[this.userid],
      confirmpassword: ['', [Validators.required,Validators.pattern, Validators.minLength(6)]],
      password: ['', [Validators.required,Validators.pattern, Validators.minLength(6)]]
    },{
      validator: MustMatch('password', 'confirmpassword')
    });
    
  }

  ngOnDestroy() {
    const element = document.getElementById('main');
    element.classList.remove('container-fluid');
    element.style.padding = null;
    element.style.margin = null;
    element.classList.add('container');
    element.classList.add('site-content');
  }

  get f() {
    return this.ConfirmPasswordForm.controls;
  }

  clearError() {
    this.errorMsg = '';
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  onSubmit(){
    
    this.submitted = true;
    this.show = false;


    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.ConfirmPasswordForm.invalid) {
      return;

    }

    this.loading = true;
    this.userService.inviteusersetpassword(this.constructor.name, moduleName.inviteUserModule,
      this.f.token.value, this.f.password.value, this.f.confirmpassword.value)
     .pipe(first())
     .subscribe((data) => {
       if (data) {
         this.show = true;
         this.successmessage = 'Password has been set successfully!';
         this.router.navigate(['/login']);
       }
     }, (error) => {
       this.errormessage = error.Invalid_token;
     });
  }

}


