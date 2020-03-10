import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService, UserService } from './../_services';
import { OrganizationService } from '../_services/organization.service';
import { error } from 'protractor';



@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    private usersdata: any;
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    errorMsg: string;
    show: Boolean = false;
    show1: Boolean = false;
    sign_in: string = "Login";

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private orgservice: OrganizationService,
        private userService: UserService

    ) {    }



    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['dchaitanya@adzapier.com', [Validators.required, Validators.pattern]],
            password: ['Adzap@123', [Validators.required, Validators.pattern, Validators.minLength(6)]]
        });

    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    clearError() {
        this.errorMsg = "";
    }

    onSubmit() {

        this.submitted = true;
        this.show = false;



        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;

        }

        this.loading = true;
        this.sign_in = "Processing...";
        this.authenticationService.login(this.f.email.value, this.f.password.value)
            .subscribe((data) => {
                this.authenticationService.userLoggedIn.next(true);
                this.authenticationService.currentUserSubject.next(data);
                localStorage.setItem('currentUser', JSON.stringify(data));
                this.getLoggedInUserDetails();
                this.router.navigate(['/home/dashboard/analytics']);
            }, error => { console.log(error, 'error..') });

    }

    getLoggedInUserDetails() {
        this.userService.getLoggedInUserDetails().subscribe((data) => {
            this.userService.getCurrentUser.emit(data);
        });
    }

}
