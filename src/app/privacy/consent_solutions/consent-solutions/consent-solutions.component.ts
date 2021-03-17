import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consent-solutions',
  templateUrl: './consent-solutions.component.html',
  styleUrls: ['./consent-solutions.component.scss']
})
export class ConsentSolutionsComponent implements OnInit {
  data:Array<any>;
  constructor() {
    this.data = [
      { creation: '2019/06/23 18:07:46', subject: 'A@adz.com', source: 'public key',identifier : 'privacy-policy',version:'40'},
      { creation: '2019/06/23 18:07:46', subject: 'A@adz.com', source: 'public key' ,identifier : 'Cookie-policy',version:'40'},
      { creation: '2019/06/23 18:07:46', subject: 'A@adz.com', source: 'public key',identifier : 'privacy-policy',version:'40' },
      { creation: '2019/06/23 18:07:46', subject: 'A@adz.com', source: 'public key' ,identifier : 'privacy-policy',version:'40'},
      { creation: '2019/06/23 18:07:46', subject: 'A@adz.com', source: 'public key' ,identifier : 'privacy-policy',version:'40'},
      { creation: '2019/06/23 18:07:46', subject: 'A@adz.com', source: 'public key' ,identifier : 'privacy-policy',version:'40'},
      { creation: '2019/06/23 18:07:46', subject: 'A@adz.com', source: 'public key' ,identifier : 'privacy-policy',version:'40'},
      { creation: '2019/06/23 18:07:46', subject: 'A@adz.com', source: 'public key' ,identifier : 'privacy-policy',version:'40'},
      { creation: '2019/06/23 18:07:46', subject: 'A@adz.com', source: 'public key' ,identifier : 'privacy-policy',version:'40'}
  ];
   }

  ngOnInit() {
  }

}
