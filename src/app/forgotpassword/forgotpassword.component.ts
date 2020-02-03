import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from './../_services';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  forgotpasswordForm: FormGroup;
  submitted: boolean;
  show: boolean;
  show1:Boolean=false;
  //errorMsg: string;
  loading: boolean;
  navbarCollapsed: boolean=false;

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
        this.forgotpasswordForm = this.formBuilder.group({          
          emailid: ['', [Validators.required,Validators.pattern]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.forgotpasswordForm.controls; }

    // clearError(){
    //     this.errorMsg="";

    // }
    
   
    onSubmit() {
         this.submitted = true;
      //debugger;
        // reset alerts on submit
        this.alertService.clear();
        this.show=false;
        // stop here if form is invalid
        if (this.forgotpasswordForm.invalid) {
            return;
        }

        this.loading = true;
               // debugger;
               // console.log(this.f.token.value, this.f.newpsw.value, this.f.renewpsw.value);
               this.userService.forgotpswd(this.f.emailid.value)
            .pipe(first())
            .subscribe(
                data => {
                    //debugger;
                    //this.alertService.success('Registration successful', true);
                    //this.router.navigate(['/login']);
                    //console.log();
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });


                if(this.f.emailid.value){
                    this.show=true;
                }
                
    }
}
