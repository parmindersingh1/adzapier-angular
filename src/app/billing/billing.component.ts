import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  loginText = 'Login';
  signUpText = 'Sign Up';
  lessons = ['Lesson 1', 'Lessons 2'];
  constructor() {
    console.log('Billing Called Constructor');
  }

  ngOnInit() {
    console.log('Billing Called ngOnInit method');

  }
   
  login() {
    console.log('Login');
  }

  signUp() {
    console.log('Sign Up');
  }
}
