import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gdpr',
  templateUrl: './gdpr.component.html',
  styleUrls: ['./gdpr.component.scss']
})
export class GDPRComponent implements OnInit {

  constructor() {
    console.log('GDPRComponent Constructor method');
   }

  ngOnInit() {
    console.log('GDPRComponent ngOnInit method');
  }

}
