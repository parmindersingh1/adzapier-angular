import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from './../_services';


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
    show:Boolean=false;
    
    //userdetails:any=[];


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }


    
    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required,Validators.pattern]],
            password: ['', [Validators.required,Validators.pattern,Validators.minLength(6)]]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onReset(){
        this.show=false;
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
      
        this.authenticationService.login(this.f.username.value,this.f.password.value)
        
            .pipe(first())
            .subscribe(
                data => {
                    
                    this.returnUrl='/dashboard/analytics';
                      return this.router.navigate([this.returnUrl]);
                    //this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    alert('Invalid credentials');
                    this.loading = false;
                    
                    this.router.navigate([this.returnUrl]);
                });
               // alert('Email ID : '+this.f.username.value +'\nPassWord : '+this.f.password.value);
               
               
                // if(this.f.password.value.length>=6 ){
                //     this.show=true;
                //    // alert('Email ID : '+this.f.username.value +'\nPassWord : '+this.f.password.value);
                //     console.log(this.loginForm);
                   
                // }
                // else {
                //     this.show=false;
                // }
                // if (!this.loginForm.invalid){
                //     this.returnUrl='/dashboard/analytics';
                //     return this.router.navigate([this.returnUrl]);
                //  }
                
    }
}