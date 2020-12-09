import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from './../_services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { moduleName } from '../_constant/module-name.constant';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  forgotpasswordForm: FormGroup;
  submitted: boolean;
  showMessage = false;
  //errorMsg: string;
  loading: boolean;
  navbarCollapsed: boolean = false;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  dismissible = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private loadingBar: NgxUiLoaderService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    this.authenticationService.userLoggedIn.subscribe((data) => {
      if (data) {
        this.router.navigate(['']);
      }
    });

  }

  ngOnInit() {
    this.forgotpasswordForm = this.formBuilder.group({
      emailid: ['', [Validators.required, Validators.pattern]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.forgotpasswordForm.controls; }

  // clearError(){
  //     this.errorMsg="";

  // }


  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    // stop here if form is invalid
    if (this.forgotpasswordForm.invalid) {
      return;
    }

    this.loading = true;
    // debugger;
    // console.log(this.f.token.value, this.f.newpsw.value, this.f.renewpsw.value);
    this.loadingBar.start();
    this.userService.forgotpswd(this.constructor.name, moduleName.forgotPasswordModule, this.f.emailid.value)
      .pipe(first())
      .subscribe(data => {
        this.loadingBar.stop();
        this.showMessage = true;
        this.alertMsg = 'Link sent to your Email, please Reset Your Password..!';
        this.isOpen = true;
        this.alertType = 'success';
      },
        error => {
          this.loadingBar.stop();
          this.showMessage = false;
          this.alertMsg = 'Email ID is not registered';
          this.isOpen = true;
          this.alertType = 'danger';
          this.loading = false;
        });
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }
}
