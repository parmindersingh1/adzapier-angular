import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService, UserService, AlertService } from '../_services';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

    profileForm: FormGroup;
    loading = false;
    submitted = false;
    show:Boolean=false;
    navbarCollapsed: boolean=false;
    returnUrl: string;
    errorMsg: string;
    // value1:string;
    // value2:string;
    userData:any;
    uid:string;
    

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) 
    {
      
        // redirect to edittprofile if already logged in
        if (this.userService.currentUserValue) {
            this.router.navigate(['/user/profile/edit']);
        }
    }

    ngOnInit() {
      
      this.profileForm = this.formBuilder.group({
        firstName: ['', [Validators.required,Validators.pattern]],
        lastName: ['', [Validators.required,Validators.pattern]],
        newemail: ['', [Validators.required,Validators.pattern]],
        currentpassword: ['', [Validators.required, Validators.pattern,Validators.minLength(6)]],
       newpassword: ['', [Validators.required, Validators.pattern,Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, Validators.pattern,Validators.minLength(6)]]
      });

      // this.emailForm = this.formBuilder.group({
       
      //   email: ['', [Validators.required,Validators.pattern]],
      //   newemail: ['', [Validators.required,Validators.pattern]],

      // });

      // this.passwordForm = this.formBuilder.group({
      //   currentpassword: ['', [Validators.required, Validators.pattern,Validators.minLength(6)]],
      //   newpassword: ['', [Validators.required, Validators.pattern,Validators.minLength(6)]],
      //   confirmpassword: ['', [Validators.required, Validators.pattern,Validators.minLength(6)]]
      // });
      
  }

    // convenience getter for easy access to form fields
    get f() { return this.profileForm.controls; }
   

    clearError() {
      this.errorMsg = "";
      
      alert("jdajdgsads");
        console.log(123456);
  }

    onSubmit() {
       
      this.submitted = true;
        this.show=false;
        //alert()
            
        // reset alerts on submit
        this.alertService.clear();
      
        // stop here if form is invalid
        if (this.profileForm.invalid) {
            return;
        }

        //alert()
        this.loading = true;
        console.log(this.profileForm);

        if ("currentUser" in localStorage) {
              
          this.userData = JSON.parse(localStorage.getItem('currentUser'));
          this.uid = this.userData['id'];
          
        } 
        
        this.userService.update(this.f.firstName.value, this.f.lastName.value, this.f.newemail.value,
                                this.f.currentpassword.value, this.f.newpassword.value, this.f.confirmpassword.value, this.uid)
            
            .pipe(first())
            .subscribe(
                data => {

                    this.returnUrl='/home/dashboard/analytics';
                      return this.router.navigate([this.returnUrl]);
                    //this.router.navigate([this.returnUrl]);
                });
                this.loading=false;
       
    }
}
