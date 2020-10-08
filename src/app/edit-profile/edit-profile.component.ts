import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { AuthenticationService, UserService } from '../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MustMatch } from '../_helpers/must-match.validator';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  changepasswordForm: FormGroup;
  loading = false;
  submitted = false;
  changePwdSubmitted = false;
  show: boolean = true;
  isShowbtnVisible = false;
  navbarCollapsed: boolean = false;
  returnUrl: string;
  errorMsg: string;
  successMsg: any;
  userData: any;
  uid: string;
  userProfile: any;
  isDisabled: boolean;
  firstName: any;
  lastName: any;
  newemail: any;
  addressone: any;
  addresstwo: any;
  city: any;
  state: any;
  zipcode: any;
  companyname: any;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  // roles: any;
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private loadingBar: NgxUiLoaderService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    //  this.isDisabled = true;
    const zipRegex = '^[0-9]{5,20}$';
    const spaceRegx = '^\S*$';
    const strRegx = '.*\\S.*[a-zA-Z \-\']';
    const alphaNumeric = '.*\\S.*[a-zA-z0-9 ]';
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(strRegx)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(strRegx)]],
      newemail: [''],
      companyname: ['Test Company Name'],
      addressone: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      city: ['', [Validators.required, Validators.pattern(strRegx)]],
      state: ['', [Validators.required, Validators.pattern(strRegx)]],
      zipcode: ['', [Validators.required, Validators.pattern(zipRegex)]],
    });
    //  this.profileForm.disable();
    this.profileForm.controls['newemail'].disable();
    this.profileForm.controls['companyname'].disable();
    this.pathValues();
    this.loadUserDetails();

    this.changepasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }
  get f1() { return this.changepasswordForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return false;
    } else {
      const editObj = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        email: this.profileForm.value.newemail,
        address1: this.profileForm.value.addressone,
        //  address2: this.profileForm.value.addresstwo,
        city: this.profileForm.value.city,
        state: this.profileForm.value.state,
        zipcode: this.profileForm.value.zipcode
        //   roles: this.profileForm.value.roles
      };
      this.loadingBar.start();
      this.userService.update(editObj)
        .subscribe((data) => {
          this.loadingBar.stop();
          if (data) {
            this.alertMsg = 'Details has been updated successfully!';
            this.isOpen = true;
            this.alertType = 'success';
            this.userService.getCurrentUser.emit(data);
            this.modalService.dismissAll('Data Saved!');
            this.loadUserDetails();
          }
        }, (error) => {
          this.loadingBar.stop();
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
          // this.isShowbtnVisible = true;
          // this.show = false;
        }
        );
      // this.profileForm.disable();
    }
  }

  pathValues() {
    this.loadingBar.start();
    this.userService.getLoggedInUserDetails().subscribe((user) => {
      this.loadingBar.stop();
      this.userProfile = Object.values(user);
      console.log(this.userProfile, 'userProfile..');
      this.profileForm.patchValue({
        newemail: this.userProfile[0].email,
        firstName: this.userProfile[0].firstname,
        lastName: this.userProfile[0].lastname,
        addressone: this.userProfile[0].address1,
        city: this.userProfile[0].city,
        state: this.userProfile[0].state,
        zipcode: this.userProfile[0].zipcode,
      });
    });
  }

  editUserDetails() {
    this.show = !this.show;
    //  this.isShowbtnVisible = false;
    if (!this.show) {
      this.profileForm.enable();
      this.profileForm.controls['newemail'].disable();
      // this.isShowbtnVisible = true;
    } else {
      this.profileForm.disable();
      this.profileForm.controls['newemail'].disable();
    }

  }

  editUserEmail() {
    this.profileForm.enable();
  }

  editOrganizationModalPopup(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
      // this.profileForm.reset();
    });
  }

  loadUserDetails() {
    this.loadingBar.start();
    this.userService.getLoggedInUserDetails().subscribe((user) => {
      this.loadingBar.stop();
      this.userProfile = Object.values(user);
      this.newemail = this.userProfile[0].email;
      this.firstName = this.userProfile[0].firstname;
      this.lastName = this.userProfile[0].lastname;
      this.addressone = this.userProfile[0].address1;
      this.city = this.userProfile[0].city;
      this.state = this.userProfile[0].state;
      this.zipcode = this.userProfile[0].zipcode;
      this.companyname = 'TEST Company Name';
    });
  }

  //change password

  clearError() {
    this.errorMsg = "";
  }

  onChangePassword() {
    this.changePwdSubmitted = true;
    this.show = false;
    if (this.changepasswordForm.invalid) {
      return;
    }
    const obj = {
      current_password: this.changepasswordForm.value.currentPassword,
      new_password: this.changepasswordForm.value.newPassword,
      confirm_password: this.changepasswordForm.value.confirmPassword
    };
    this.loadingBar.start();
    this.authenticationService.changePassword(obj).subscribe((data) => {
      this.loadingBar.stop();
      if (data) {
        this.show = true;
        this.successMsg = data.response;
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.changePwdSubmitted = false;
        this.changepasswordForm.reset();
      }
    }, (error) => {
      this.loadingBar.stop();
      this.show = false;
      this.alertMsg = error.Password_mismatch;
      this.isOpen = true;
      this.alertType = 'danger';
      this.changePwdSubmitted = false;
      this.changepasswordForm.reset();
    });
  }

  onResetChangePassword() {
    // this.changePwdSubmitted = false;
    this.changepasswordForm.reset();
  }

  onResetProfile() {
    this.submitted = false;
    this.modalService.dismissAll('Data Saved!');
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }
}

