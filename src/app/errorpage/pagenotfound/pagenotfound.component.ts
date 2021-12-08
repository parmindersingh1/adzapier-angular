import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss']
})
export class PagenotfoundComponent implements OnInit {
  queryOID:any;
  queryPID:any;
  constructor(private location:Location,private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParamMap
    .subscribe(params => {
      this.queryOID = params.get('oid');
      this.queryPID = params.get('pid');
    });
   }

  ngOnInit(): void {
  }

  gotoPreviousLink(){
    this.location.back();
  }

}
