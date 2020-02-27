import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from './../_services';
import { OrganizationService } from '../_services/organization.service';



@Component({ 
  templateUrl: 'login.component.html' ,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    private usersdata:any;
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    errorMsg: string;
    show:Boolean=false;
    show1:Boolean=false;
    sign_in: string =  "Login";
    
    //userdetails:any=[];


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private orgservice:OrganizationService,
        
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }


    
    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['dchaitanya@adzapier.com', [Validators.required,Validators.pattern]],
            password: ['Adzap@123', [Validators.required,Validators.pattern,Validators.minLength(6)]]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    clearError() {
        this.errorMsg = "";
    }
        
    onSubmit() {
       
        this.submitted = true;
        this.show=false;
        
        
            
        // reset alerts on submit
        this.alertService.clear();
      
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
            
        }

        this.loading = true;
        //console.log(this.loginForm);
        this.sign_in = "Processing...";
        this.authenticationService.login(this.f.email.value,this.f.password.value)
            
            .pipe(first())
            .subscribe(
                data => {
                    let authtoken = data.response.token;
                    let userid = data.response.id;
                let a =  this.organizationlist(authtoken,userid);
                console.log(a);
                    this.returnUrl='/home/dashboard/analytics';
                      return this.router.navigate([this.returnUrl]);
                    //this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    for (var key in error) {
                        this.errorMsg = error[key];
                        break;
                    }
                    this.sign_in = "Login";
                    this.loading = false;
                    
                    this.router.navigate([this.returnUrl]);
                });


           
                
    }

    organizationlist(token,uid){
        this.orgservice.orglist(token,uid).subscribe((data:any)=> {
       
            console.log(data);
      
            
           
          });
    }
    
    
}