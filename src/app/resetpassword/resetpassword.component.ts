import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService, AuthenticationService } from './../_services';
import { ActivatedRoute } from '@angular/router';



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
    });
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
    this.userService.resetpassword(this.f.token.value, this.f.newpsw.value, this.f.renewpsw.value)
      .pipe(first())
      .subscribe(
        data => {
          //debugger;
          //this.alertService.success('Registration successful', true);
          //this.router.navigate(['/login']);
          console.log();
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });


    if (this.f.newpsw.value !== this.f.renewpsw.value) {
      alert('Please enter Same Passwords...!\nNew Password : ' + this.f.newpsw.value + '\nRe-enter Password: ' + this.f.renewpsw.value);
    }
    else {
      if (this.f.newpsw.value != '' && this.f.renewpsw.value != '') {
        this.show = true;
        //alert('\nNew Password : '+this.f.newpsw.value+'\nRe-enter Password : '+this.f.renewpsw.value+'\nPassword Changed Successfully..!');
      }

    }
  }

}
