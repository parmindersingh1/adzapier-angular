import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-internalerror',
  templateUrl: './internalerror.component.html',
  styleUrls: ['./internalerror.component.scss']
})
export class InternalerrorComponent implements OnInit {

  constructor(private location:Location) { }

  ngOnInit(): void {
  }

  gotoPreviousLink(){
    this.location.back();
  }
}
