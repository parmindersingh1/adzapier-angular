import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { AuthenticationService, UserService } from '../_services';
import { TextBoxSpaceValidator } from '../_helpers/textboxspace.validator';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MustMatch } from '../_helpers/must-match.validator';

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
  // roles: any;
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    //  this.isDisabled = true;
    const zipRegex = '^[0-9]*$';
    const spaceRegx = '^\S*$';
    const strRegx = '^[a-zA-Z \-\']+';
    const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9 ]+$';
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(strRegx)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(strRegx)]],
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
      this.userService.update(editObj)
        .subscribe((data) => {
          if (data) {
          //  this.isShowbtnVisible = false;
           // this.show = true;
            alert('Details has been updated successfully!');
            this.userService.getCurrentUser.emit(data);
          }
        }, (error) => {
          alert(error);
         // this.isShowbtnVisible = true;
          // this.show = false;
        }
        );
     // this.profileForm.disable();
    }
  }

  pathValues() {
    this.userService.getLoggedInUserDetails().subscribe((user) => {
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
      this.profileForm.reset();
    });
  }

  loadUserDetails() {
    this.userService.getLoggedInUserDetails().subscribe((user) => {
      this.userProfile = Object.values(user);
      this.newemail = this.userProfile[0].email;
      this.firstName = this.userProfile[0].firstname;
      this.lastName = this.userProfile[0].lastname;
      this.addressone =  this.userProfile[0].address1;
      this.city = this.userProfile[0].city;
      this.state = this.userProfile[0].state;
      this.zipcode = this.userProfile[0].zipcode;
      this.companyname = 'TEST Company Name';
    });
  }

  //change password
  // convenience getter for easy access to form fields
  get f1() { return this.changepasswordForm.controls; }

  clearError() {
    this.errorMsg = "";
  }

  onChangePassword() {
    this.submitted = true;
    this.show = false;
    if (this.changepasswordForm.invalid) {
      return;
    }
    const obj = {
      current_password: this.f1.currentPassword.value,
      new_password: this.f1.newPassword.value,
      confirm_password: this.f1.confirmPassword.value
    };
    this.authenticationService.changePassword(obj).subscribe((data) => {
      if (data) {
        this.show = true;
        this.successMsg = data.response;
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

