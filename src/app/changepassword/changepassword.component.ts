
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService, AuthenticationService } from './../_services';
import { MustMatch } from '../_helpers/must-match.validator';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})

export class ChangepasswordComponent implements OnInit {
  changepasswordForm: FormGroup;
  loading = false;
  submitted = false;
  show: Boolean = false;
  errorMsg: string;
  navbarCollapsed: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/user/password/change-password']);
    }
  }

  ngOnInit() {
    this.changepasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.changepasswordForm.controls; }

  clearError() {
    this.errorMsg = "";
  }

  onSubmit() {
    this.submitted = true;
    this.show = false;
    this.alertService.clear();
    if (this.changepasswordForm.invalid) {
      return;
    }
    const obj = {
      current_password: this.f.currentPassword.value,
      new_password: this.f.newPassword.value,
      confirm_password: this.f.confirmPassword.value
    };
    this.authenticationService.changePassword(obj).subscribe((data) => {
      if (data) {
        this.show = true;
      }
      console.log(data, 'data..');
    }, (error) => {
      this.show = false;
      this.errorMsg = error.Password_mismatch;
    });
  }

  onReset() {
    this.submitted = false;
    this.changepasswordForm.reset();
  }

}
