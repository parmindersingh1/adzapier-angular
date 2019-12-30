import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService, UserService, AlertService } from '../_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  editProfileForm: FormGroup;
    loading = false;
    submitted = false;
    show:Boolean=false;
    value1:string;
    value2:string;
    

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) 
    {
      
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
      debugger;
      this.editProfileForm = this.formBuilder.group({
        fullName: ['', Validators.required,Validators.pattern],
        username: ['', Validators.required,Validators.pattern],
        newpwd: ['', Validators.required,Validators.pattern,Validators.minLength(6)],
        currentpwd: ['', Validators.required, Validators.pattern,Validators.minLength(6)],
        currentpwd1: ['', Validators.required, Validators.pattern,Validators.minLength(6)],
        confpwd: ['', Validators.required, Validators.pattern,Validators.minLength(6)]
      });
      //this.f.fullName.setValue('Chaitanya');
  }

    // convenience getter for easy access to form fields
    get f() { return this.editProfileForm.controls; }
   
   
    // nameval(){
    //   if(this.f.fullName.value==""){
    //     alert('Please Enter Name');
    //   }
    // }
   
    // changemail(){
    //    debugger;
    //   this.onSubmit();
    // }
    changepwd(){
      //this.f.currentpwd.value='Aa@3ersdsd';
      debugger;
      if(this.f.newpwd.value==''){
        alert('Please Enter New Password');
       //document.getElementById('currentpwd1').focus();
       return false;
      }
      if(this.f.confpwd.value==''){
        alert('Please Enter Confrim Password');
       //document.getElementById('currentpwd1').focus();
       return false;
      }
      if(this.f.newpwd.value!==this.f.confpwd.value){
        alert('Please enter New Password & Confirm password same...!\nNew Password : '+this.f.newpwd.value+'\nConfirm Password : '+this.f.confpwd.value);             
      }
    //  this.show=true;
   }
   
    onSubmit() {
        this.submitted = true;
      debugger;
      if(this.f.fullName.value==''){
        alert('Please Enter Full Name');
    //   document.getElementById('currentpwd').focus();
       return false;
      }
      if(this.f.currentpwd.value==''){
        alert('Please Enter Current Password');
    //   document.getElementById('currentpwd').focus();
       return false;
      }
      if(this.f.username.value==''){
        alert('Please Enter New Email');
    //   document.getElementById('currentpwd').focus();
       return false;
      }
    
      if(this.f.currentpwd1.value==''){
        alert('Please Enter New Current Password');
       //document.getElementById('currentpwd1').focus();
       return true;
      }
      
      this.changepwd();
      alert('Edit profile Successfully...!');
      debugger;
       this.show=true;
        // stop here if form is invalid
        // if (this.editProfileForm.invalid) {
        //     return;
        // }
       
        this.loading = true;
          debugger;
        
       
    }
}
