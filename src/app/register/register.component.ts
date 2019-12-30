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
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    show:Boolean=false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required,Validators.pattern],
            lastName: ['', Validators.required,Validators.pattern],
            username: ['', Validators.required,Validators.pattern],
            password: ['', Validators.required, ,Validators.pattern,Validators.minLength(6)],
            confirmpassword: ['', Validators.required, ,Validators.pattern,Validators.minLength(6)]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
      //debugger;
        // reset alerts on submit
        this.alertService.clear();
        this.show=false;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;

        this.userService.register(this.registerForm.value)
        
            .pipe(first())
            .subscribe(
                data => {
                    debugger;
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
                 if(this.f.username.value!=''&&this.f.password.value!=''&&this.f.firstName.value!=''&&this.f.lastName.value!=''&&this.f.confirmpassword.value!=''){
                  this.show=true;
              alert('First Name : '+this.f.firstName.value+'\nLast Name : '+this.f.lastName.value+'\nEmail Id : '+this.f.username.value+'\nPassword : '+this.f.password.value+'\nConfirm Password: '+this.f.confirmpassword.value+'\nAccount Created Successfully..!');
              }
              //+'\nOrganisation'+this.f.organisation.value
          }                
    }
}