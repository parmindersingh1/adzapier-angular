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
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.isDisabled = true;
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern]],
      lastName: ['', [Validators.required, Validators.pattern]],
      newemail: ['', [Validators.required, Validators.pattern]],
      currentpassword: [''],
      newpassword: [''],
      confirmpassword: ['']
      //   currentpassword: ['', [Validators.required, Validators.pattern,Validators.minLength(6)]],
      //  newpassword: ['', [Validators.required, Validators.pattern,Validators.minLength(6)]],
      // confirmpassword: ['', [Validators.required, Validators.pattern,Validators.minLength(6)]]
    });
    this.profileForm.disable();
    this.pathValues();
  }

  // convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  onSubmit(profileForm: NgForm) {
    this.profileForm.disable();
    this.userService.update(this.f.firstName.value, this.f.lastName.value, this.f.newemail.value)
      .subscribe((data) => {
        if (data) {
          alert('Details has been updated successfully!');
          this.userService.getCurrentUser.emit(data);
        }
      }
      );
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

