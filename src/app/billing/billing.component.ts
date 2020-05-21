import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit { 
  
  constructor() {
    console.log('Billing Called Constructor');
  }

  ngOnInit() {
    console.log('Billing Called ngOnInit method'); 
  }
    
}
