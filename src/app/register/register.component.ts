import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService, AuthenticationService } from './../_services';
import { MustMatch } from '../_helpers/must-match.validator';



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
    show: Boolean = false;
    errorMsg: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,

    ) {
        // redirect to home if already logged in
        if (this.userService) {
            this.router.navigate(['/signup']);
        }
    }

    ngOnInit() {
        const strRegx = '^[a-zA-Z \-\']+';
        const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9 ]+$';
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
    get f() { return this.regForm.controls; }

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

            this.userService.register(requestObj)
                .pipe(first())
                .subscribe(
                    data => {
                        this.alertService.success('Registration successful', true);
                        alert('Registration Successful....Please Login');
                        this.router.navigate(['/login']);
                    },
                    error => {
                        this.alertService.error(error);
                        for (let key in error) {
                            if (key != 'No_record') {
                                this.errorMsg = error[key];
                            }
                            break;
                        }

                        this.loading = false;

                    });

        }

    }
}
