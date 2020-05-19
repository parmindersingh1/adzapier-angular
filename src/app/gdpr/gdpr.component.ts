import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gdpr',
  templateUrl: './gdpr.component.html',
  styleUrls: ['./gdpr.component.scss']
})
export class GDPRComponent implements OnInit {

  @Input() checkBoxList;
  constructor() {
    console.log('GDPRComponent Constructor method');
    console.log(this.checkBoxList, 'GDPRComponent checkBoxList..cc');
   }

  ngOnInit() {
    console.log('GDPRComponent ngOnInit method');
    console.log(this.checkBoxList, 'GDPRComponent ngoninit..');
  }

}
