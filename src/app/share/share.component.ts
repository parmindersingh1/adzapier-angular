import {
  AfterViewInit,
  ChangeDetectorRef,
  Component, ElementRef, HostListener,
  OnDestroy,
  OnInit,
  TemplateRef, ViewChild,
  ViewEncapsulation
} from '@angular/core';


@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ShareComponent implements OnInit, OnDestroy, AfterViewInit {
  publishing: boolean = false;
  url: string = "";
  position: string = "";
  constructor(
  ) {
   

  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
   
  }

  ngOnDestroy() {
    
  }

  changeLayout(position) {
    this.position = position
  }

}
