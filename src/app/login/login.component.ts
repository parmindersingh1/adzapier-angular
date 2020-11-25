import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService } from './../_services';
import { OrganizationService } from '../_services/organization.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { moduleName } from '../_constant/module-name.constant';

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
    dismissible = true;
    alertMsg: any;
    isOpen = false;
    alertType: any;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private orgservice: OrganizationService,
        private loadingBar: NgxUiLoaderService,
        private userService: UserService

    ) {
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }



    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern]],
            password: ['', [Validators.required, Validators.pattern, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    clearError() {
        this.errorMsg = '';
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
        this.authenticationService.login(this.constructor.name, moduleName.loginModule, this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    // this.getLoggedInUserDetails();
                    this.authenticationService.userLoggedIn.next(true);
                    this.authenticationService.currentUserSubject.next(data);
                    localStorage.setItem('currentUser', JSON.stringify(data));
                    this.router.navigate(['/home/dashboard/analytics']);
                },
                error => {
                    this.isOpen = true;
                    this.alertMsg = error;
                    this.alertType = 'danger';
                    this.loading = false;
                });

    }

    getLoggedInUserDetails() {
        this.loadingBar.start();
        this.userService.getLoggedInUserDetails(this.constructor.name, moduleName.loginModule).subscribe((data) => {
            this.loadingBar.stop();
            this.userService.getCurrentUser.emit(data);
        });
    }

    onClosed(dismissedAlert: any): void {
        this.alertMsg = !dismissedAlert;
        this.isOpen = false;
    }

}
