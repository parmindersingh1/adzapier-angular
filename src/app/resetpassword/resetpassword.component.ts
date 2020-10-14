import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService, AuthenticationService } from './../_services';
import { ActivatedRoute } from '@angular/router';
import { MustMatch } from '../_helpers/must-match.validator';
import { moduleName } from '../_constant/module-name.constant';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {

  resetpasswordForm: FormGroup;
  loading = false;
  submitted = false;
  show: Boolean = false;
  navbarCollapsed: boolean = false;
  successmessage: any;
  errormessage: any;
  public id: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.activatedRoute.snapshot.paramMap.get('id');
    
  }

  ngOnInit() {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.resetpasswordForm = this.formBuilder.group({
      token: [this.id],
      newpsw: ['', Validators.required, , Validators.pattern, Validators.minLength(6)],
      renewpsw: ['', Validators.required, , Validators.pattern, Validators.minLength(6)]
    }, {
      validator: MustMatch('newpsw', 'renewpsw')
    });

    // this.changepasswordForm = this.formBuilder.group({
    //   currentPassword: ['', Validators.required],
    //   newPassword: ['', [Validators.required, Validators.minLength(6)]],
    //   confirmPassword: ['', Validators.required]
    // }, {
    //   validator: MustMatch('newPassword', 'confirmPassword')
    // });
  }


  // convenience getter for easy access to form fields
  get f() { return this.resetpasswordForm.controls; }


  onSubmit() {
    this.submitted = true;
    //debugger;
    // reset alerts on submit
    this.alertService.clear();
    this.show = false;
    // stop here if form is invalid
    if (this.resetpasswordForm.invalid) {
      return;
    }

    this.loading = true;
    // debugger;
    // console.log(this.f.token.value, this.f.newpsw.value, this.f.renewpsw.value);
    this.userService.resetpassword(this.constructor.name, moduleName.resetPasswordModule,
       this.f.token.value, this.f.newpsw.value, this.f.renewpsw.value)
      .pipe(first())
      .subscribe((data) => {
        if (data) {
          this.show = true;
          this.successmessage = 'Password has been reset successfully!';
          this.router.navigate(['/login']);
        }
      }, (error) => {
        this.errormessage = error.Invalid_token;
      });
  }
}
