import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService, AuthenticationService } from './../_services';
import { ActivatedRoute } from '@angular/router';
import { MustMatch } from '../_helpers/must-match.validator';
import { moduleName } from '../_constant/module-name.constant';
import { Title } from '@angular/platform-browser';



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
    private alertService: AlertService,
    private titleService: Title 

  ) {
    this.activatedRoute.snapshot.paramMap.get('id');
    this.titleService.setTitle("Reset Password - Adzapier Portal");


  }

  ngOnInit() {
    const element = document.getElementById('main');
    element.classList.remove('container');
    element.classList.remove('site-content');
    element.classList.add('container-fluid');
    element.style.padding = '0px';

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

  ngOnDestroy() {
    const element = document.getElementById('main');
    element.classList.remove('container-fluid');
    element.style.padding = null;
   // element.classList.add('container');
    element.classList.add('site-content');
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
