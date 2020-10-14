import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService, AuthenticationService } from './../_services';
import { MustMatch } from '../_helpers/must-match.validator';
import { moduleName } from '../_constant/module-name.constant';



@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    regForm: FormGroup;
    loading = false;
    submitted = false;
    navbarCollapsed = false;
    show: boolean = false;
    errorMsg: string;
    alertMsg: any;
    isOpen: boolean;
    alertType: any;
    dismissible = true;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,

    ) {
        }

    ngOnInit() {
        const strRegx = '.*\\S.*[a-zA-Z \-\']';
        const alphaNumeric = '.*\\S.*[a-zA-z0-9 ]'; // '^(?![0-9]*$)[a-zA-Z0-9 ]+$';
        const zipRegex = '^[0-9]*$';
        this.regForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.pattern(strRegx)]],
            lastName: ['', [Validators.required, Validators.pattern(strRegx)]],
            companyname: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
            email: ['', [Validators.required, Validators.pattern]],
            password: ['', [Validators.required, Validators.pattern, Validators.minLength(6)]],
            confirmpassword: ['', [Validators.required, Validators.pattern, Validators.minLength(6)]]
        }, {
            validator: MustMatch('password', 'confirmpassword')
        });
    }

    // convenience getter for easy access to form fields
    get f() {
       // console.log(this.regForm.controls);
        return this.regForm.controls;
    }

    clearError() {
        this.errorMsg = "";
    }

    onSubmit() {
        this.submitted = true;
        //  this.show = false;
        // this.alertService.clear();

        // stop here if form is invalid
        if (this.regForm.invalid) {
            return false;
        } else {

            this.loading = true;
            const requestObj = {
                firstname: this.f.firstName.value,
                lastname: this.f.lastName.value,
                email: this.f.email.value,
                password: this.f.password.value,
                confirmpassword: this.f.confirmpassword.value,
                companyname: this.f.companyname.value
            };

            this.userService.register(this.constructor.name, moduleName.registerModule, requestObj)
                .pipe(first())
                .subscribe(
                    data => {
                        this.alertMsg = data.response;
                        this.isOpen = true;
                        this.alertType = 'success';
                        this.router.navigate(['/login']);
                    },
                    error => {
                        this.alertMsg = error;
                        this.isOpen = true;
                        this.alertType = 'info';
                        this.loading = false;

                    });

        }

    }

    onClosed(dismissedAlert: any): void {
        this.alertMsg = !dismissedAlert;
        this.isOpen = false;
    }

}
