import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { AuthenticationService, UserService } from '../_services';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  profileForm: FormGroup;
  loading = false;
  submitted = false;
  show: boolean = false;
  navbarCollapsed: boolean = false;
  returnUrl: string;
  errorMsg: string;
  // value1:string;
  // value2:string;
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
  roles: any;
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) { }

  ngOnInit() {
  //  this.isDisabled = true;
    const zipRegex = '^[0-9]*$';
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      newemail: ['', [Validators.required, Validators.email]],
      addressone: ['', [Validators.required]],
      addresstwo: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required, Validators.pattern(zipRegex)]],
      roles: ['', [Validators.required]]
    });
    this.profileForm.disable();
    this.pathValues();
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
        address2: this.profileForm.value.addresstwo,
        city: this.profileForm.value.city,
        state: this.profileForm.value.state,
        zipcode: this.profileForm.value.zipcode,
        roles: this.profileForm.value.roles
      }; 
      this.userService.update(editObj)
        .subscribe((data) => {
          if (data) {
            alert('Details has been updated successfully!');
            this.userService.getCurrentUser.emit(data);
          }
        }
        );
      this.profileForm.disable();
    }
  }

  pathValues() {
    this.userService.getLoggedInUserDetails().subscribe((user) => {
      this.userProfile = Object.values(user);
      this.profileForm.patchValue({
        newemail: this.userProfile[0].email,
        firstName: this.userProfile[0].firstname,
        lastName: this.userProfile[0].lastname
      });
    });
  }

  editUserDetails() {
    this.profileForm.enable();
  }

  editUserEmail() {
    this.profileForm.enable();
  }

}

