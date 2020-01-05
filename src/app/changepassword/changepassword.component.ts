
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from './../_services';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  changepasswordForm: FormGroup;
    loading = false;
    submitted = false;
    show:Boolean=false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.changepasswordForm = this.formBuilder.group({
            fullName: ['', Validators.required,Validators.pattern],
            username: ['', Validators.required,Validators.pattern],
            oldpsw: ['', Validators.required, ,Validators.pattern,Validators.minLength(6)],
            newpsw: ['', Validators.required, ,Validators.pattern,Validators.minLength(6)],
            renewpsw:['', Validators.required, ,Validators.pattern,Validators.minLength(6)]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.changepasswordForm.controls; }

    onSubmit() {
        this.submitted = true;
      //debugger;
        // reset alerts on submit
        this.alertService.clear();
        this.show=false;
        // stop here if form is invalid
        if (this.changepasswordForm.invalid) {
            return;
        }

        this.loading = true;
               // debugger;
              if(this.f.newpsw.value!==this.f.renewpsw.value){
                alert('Please enter New Password & Re-enter password same...!\nNew Password : '+this.f.newpsw.value+'\nRe-enter Password: '+this.f.renewpsw.value);             
              }
           else{
                 if(this.f.fullName.value!=''&&this.f.username.value!=''&&this.f.oldpsw.value!=''&&this.f.confirmpassword.value!=''){
                  this.show=true;
              alert('Full Name : '+this.f.fullName.value+'\nEmail Id : '+this.f.username.value+'\nOld Password : '+this.f.oldpsw.value+'\nNew Password : '+this.f.newpsw.value+'\nPassword Changed Successfully..!');
              }
              //+'\nOrganisation'+this.f.organisation.value
          }                
    }
}
