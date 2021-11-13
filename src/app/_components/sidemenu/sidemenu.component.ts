import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, Output,EventEmitter, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { UserService } from '../../_services/user.service';
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  animations: [
    trigger('slideInOutSideMenu', [
      state('true', style({
       width:'220px',
       background:'#fff',
      })),
      state('false', style({
        width:'20px',
        background:'#fff',
      })),
     transition('false <=> true', animate('200ms linear'))
    ])

  ]
})
export class SidemenuComponent implements OnInit {
  @Input() organization;
  @Input() property;
  @Input() currentmenu:any = [];
  @Output() onClickSideMenuArrow : EventEmitter<any> = new EventEmitter<any>();
  
  queryOID;
  queryPID;
  slideSideMenu:boolean = false;
  isSideMenuArrowClicked:boolean = false;
  isMouseOver:boolean = false;
  isMouseOut:boolean = false;
  submenu:any = [];
  menulink:any;
  isScrollingUp:boolean = false;
  isScrollingDown:boolean = false;
  constructor(private activatedroute: ActivatedRoute,private userService:UserService) {
    this.activatedroute.queryParamMap
    .subscribe(params => {
      this.queryOID = params.get('oid');
      this.queryPID = params.get('pid');
     });
   }

  ngOnInit(): void {
    if(this.currentmenu !== undefined){
      this.getCurrentmenu();
    }
   this.onCheckSidemenustatus();
  }

  onMouseover() {
   
    if (this.isSideMenuArrowClicked) {
      this.isMouseOver = false;
      this.isMouseOut = false;
     if (!this.slideSideMenu) {
        this.slideSideMenu = true;
     }
    }else{
      this.slideSideMenu = true;
      this.isMouseOver = true;
      this.isMouseOut = false;
    }
  }

  onMouseout(){
  if(this.isSideMenuArrowClicked){
    if (this.slideSideMenu) {
    this.slideSideMenu = true;
   }
   }else{
    this.slideSideMenu = false;
    this.isMouseOut = true;
    this.isMouseOver = false;
   }
  }

  onMouseoutonArrow(event){
    event.stopPropagation();
  }

  onMouseoveronArrow(event){
    event.stopPropagation();
  }

  onClickonMenuArrow() {
    if (this.isMouseOver && this.slideSideMenu) {
      this.onClickSideMenuArrow.emit(this.slideSideMenu);
      this.isSideMenuArrowClicked = true;
      this.userService.setSidemenuOpenStatus(this.isSideMenuArrowClicked);
      this.isMouseOver = false;
      this.isMouseOut = false;
    } else if (!this.isMouseOut && this.slideSideMenu) {
      this.isSideMenuArrowClicked = !this.isSideMenuArrowClicked;
      this.userService.setSidemenuOpenStatus(this.isSideMenuArrowClicked);
      this.slideSideMenu = false;
      this.onClickSideMenuArrow.emit(this.slideSideMenu);
      this.isMouseOut = true;
    }
  }

  getCurrentmenu(){
    if(this.currentmenu !== undefined){
      this.menulink = this.currentmenu.showlink;
      this.submenu = this.currentmenu.subcategory;
    }
  }

  onCheckSidemenustatus(){
    if(this.userService.getSidemenuOpenStatus()){
      this.slideSideMenu = true;
      this.onClickSideMenuArrow.emit(this.slideSideMenu);
      this.isSideMenuArrowClicked = true;
    }
  }
  
  ngOnChanges(){
    this.getCurrentmenu();
  }

}
