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
    errorMsg: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        
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

    clearError() {
        this.errorMsg = "";
    }

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
                    
                    
                    alert("Registration Successful....Please Login");
                     this.router.navigate(['/login']);
                //    setTimeout(function(){ 
                    
                //      }, 1000);
                //      alert("Registration successful....Please LogIn");
                //      this.router.navigate(['/login']);
                   
                },
                error => {
                    this.alertService.error(error);
                    for (var key in error) {
                        if (key != "No_record") {
                            
                            this.errorMsg = error[key];
                        }
                        break;
                    }
                    
                   // console.log(JSON.stringify(error))
                    //this.errorMsg = error.org_exist;
                    //this.errorMsg = error.Taken_email;
                    this.loading = false;
                    //this.show=true;

                    
                   // this.router.navigate([this.returnUrl]);
                });
               // debugger;

        //       if(this.f.password.value!==this.f.confirmpassword.value){
        //         alert('Please enter Password & Confirm password same...!\nPassword : '+this.f.password.value+'\nConfirm Password: '+this.f.confirmpassword.value);             
        //       }
        //    else{
        //          if(this.f.email.value!=''&&this.f.password.value!=''&&this.f.firstName.value!=''&&this.f.lastName.value!=''&&this.f.confirmpassword.value!=''&&this.f.organization.value!=''){
        //           this.show=true;
        //         //   setTimeout(function(){ 
        //         //     location.reload();
        //         // }, 5000); 
        //       //alert('First Name : '+this.f.firstName.value+'\nLast Name : '+this.f.lastName.value+'\nOrganization : '+this.f.organization.value+'\nEmail Id : '+this.f.email.value+'\nPassword : '+this.f.password.value+'\nConfirm Password: '+this.f.confirmpassword.value+'\nAccount Created Successfully..!');
               
        //     }
              
        //   }                
    }
}