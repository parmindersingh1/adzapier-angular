import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-createworkflow',
  templateUrl: './createworkflow.component.html',
  styleUrls: ['./createworkflow.component.scss']
})
export class CreateworkflowComponent implements OnInit {
  tabList: any = [];
  viewMode: any;
  constructor() { }

  ngOnInit() {
    this.tabList = [{id:1, type:'tab1'},{id:2, type:'tab2'},{id:3, type:'tab3'},{id:4, type:'tab4'}]
    this.viewMode = 'tab1';
  }

  nextTab(){
    console.log(this.viewMode,'viewMode..');
    if(this.viewMode == 'tab1'){
      this.viewMode = 'tab2';
    }
  }


}
