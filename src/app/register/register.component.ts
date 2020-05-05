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
        this.regForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.pattern]],
            lastName: ['', [Validators.required, Validators.pattern]],
            organization: ['', [Validators.required, Validators.pattern(strRegx)]],
            email: ['', [Validators.required, Validators.pattern]],
            password: ['', [Validators.required, Validators.pattern, Validators.minLength(6)]],
            confirmpassword: ['', [Validators.required, Validators.pattern, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.regForm.controls; }

    clearError() {
        this.errorMsg = "";
    }

    onSubmit() {
        this.submitted = true;
        this.show = false;
        this.alertService.clear();

        // stop here if form is invalid
        if (this.regForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.f.firstName.value, this.f.lastName.value,
             this.f.organization.value, this.f.email.value, this.f.password.value,
             this.f.confirmpassword.value)
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
