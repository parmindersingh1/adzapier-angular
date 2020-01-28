import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from './../_services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    regForm: FormGroup;
    loading = false;
    submitted = false;
    navbarCollapsed=false;
    show:Boolean=false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.userService.currentUserValue) {
            this.router.navigate(['/register']);
        }
    }

    ngOnInit() {
        this.regForm = this.formBuilder.group({
            firstName: ['', [Validators.required,Validators.pattern]],
            lastName: ['', [Validators.required,Validators.pattern]],
           organization: ['', [Validators.required,Validators.pattern]],
            email: ['', [Validators.required,Validators.pattern]],
            password: ['', [Validators.required,Validators.pattern,Validators.minLength(6)]],
            confirmpassword: ['', [Validators.required,Validators.pattern,Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.regForm.controls; }

    onSubmit() {
        this.submitted = true;
        this.show=false;
      //debugger;
        // reset alerts on submit
        this.alertService.clear();
        
        // stop here if form is invalid
        if (this.regForm.invalid) {
            return;
        }

        this.loading = true;
        console.log(this.regForm);

        //this.userService.register(this.registerForm.value)
        this.userService.register(this.f.firstName.value, this.f.lastName.value, this.f.organization.value, this.f.email.value, this.f.password.value, this.f.confirmpassword.value)
            .pipe(first())
            .subscribe(
                data => {
                    //debugger;
                    this.alertService.success('Registration successful', true);
                    //this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
               // debugger;
              if(this.f.password.value!==this.f.confirmpassword.value){
                alert('Please enter Password & Confirm password same...!\nPassword : '+this.f.password.value+'\nConfirm Password: '+this.f.confirmpassword.value);             
              }
           else{
                 if(this.f.email.value!=''&&this.f.password.value!=''&&this.f.firstName.value!=''&&this.f.lastName.value!=''&&this.f.confirmpassword.value!=''&&this.f.orgname.value!=''){
                  this.show=true;
              alert('First Name : '+this.f.firstName.value+'\nLast Name : '+this.f.lastName.value+'\nOrganization : '+this.f.orgname.value+'\nEmail Id : '+this.f.email.value+'\nPassword : '+this.f.password.value+'\nConfirm Password: '+this.f.confirmpassword.value+'\nAccount Created Successfully..!');
              }
              //+'\nOrganisation'+this.f.organisation.value
          }                
    }
}