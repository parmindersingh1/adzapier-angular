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
  resetpasswordForm: FormGroup;
  submitted: boolean;
  show: boolean;
  loading: boolean;
    

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
        this.resetpasswordForm = this.formBuilder.group({          
          emailid: ['', Validators.required,Validators.pattern]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.resetpasswordForm.controls; }
   
   
   
   
    onSubmit() {
        this.submitted = true;
        this.show=false;
        debugger;
            if(this.f.emailid.value!=''){
     this.show=true;
        //alert('Link Sent to this Mail ID : '+this.f.emailid.value+ ' Successfully..!');
            }
    }
}
