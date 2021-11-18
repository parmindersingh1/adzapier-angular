import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, Output,EventEmitter, HostListener, ElementRef } from '@angular/core';
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
        width:'35px',
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
  constructor(private activatedroute: ActivatedRoute,
              private elRef:ElementRef,
              private router: Router,
              private userService:UserService) {
    this.activatedroute.queryParamMap
    .subscribe(params => {
      this.queryOID = params.get('oid');
      this.queryPID = params.get('pid');
     });
   }

  ngOnInit(): void {
    this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseenter', this.onMouseover.bind(this), false);
    this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseleave',this.onMouseover.bind(this), false);
    if(this.currentmenu !== undefined){
      this.getCurrentmenu();
    }
   this.onCheckSidemenustatus();
  }

  onMouseover() {
    this.elRef.nativeElement.querySelector('.menu-arrow').removeEventListener('mouseenter',this.onMouseoveronArrow.bind(this));
    this.elRef.nativeElement.querySelector('.menu-arrow').removeEventListener('mouseleave',this.onMouseoutonArrow.bind(this));
    this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseleave',this.onMouseout.bind(this), false);
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

  onMouseout() {
    this.elRef.nativeElement.querySelector('.menu-arrow').removeEventListener('mouseenter', this.onMouseoveronArrow.bind(this));
    this.elRef.nativeElement.querySelector('.menu-arrow').removeEventListener('mouseleave', this.onMouseoutonArrow.bind(this));
    this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseenter', this.onMouseover.bind(this), false);
    if (this.isSideMenuArrowClicked) {
      if (this.slideSideMenu) {
        this.slideSideMenu = true;
      }
    } else {
      this.slideSideMenu = false;
      this.isMouseOut = true;
      this.isMouseOver = false;
    }
  }

  onMouseoutonArrow(){
    if(this.slideSideMenu){
      this.slideSideMenu = true;
    }else{
      this.slideSideMenu = false;
    }

    this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseenter',this.onMouseover.bind(this));
    this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseleave',this.onMouseout.bind(this));
  }

  onMouseoveronArrow(){
    this.elRef.nativeElement.querySelector('.sidemenu').addEventListener('mouseenter',this.onMouseover.bind(this));
   
   if(!this.slideSideMenu){
    this.slideSideMenu = false;
    }else{
      this.slideSideMenu = true;
    }
    this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseenter',this.onMouseover.bind(this));
  }

  onClickonMenuArrow() {
    this.userService.removeSidemenuOpenStatus();
    this.isSideMenuArrowClicked = !this.isSideMenuArrowClicked;
    if (this.slideSideMenu && this.isSideMenuArrowClicked) {
      this.onClickSideMenuArrow.emit(this.slideSideMenu);
      this.userService.setSidemenuOpenStatus(this.isSideMenuArrowClicked);
    }else{
      this.slideSideMenu = !this.slideSideMenu;
      this.onClickSideMenuArrow.emit(this.slideSideMenu);
      this.userService.setSidemenuOpenStatus(this.isSideMenuArrowClicked);
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
  
  onClickSubmenu(link){
    if(!this.isSideMenuArrowClicked){
      this.slideSideMenu = false;
    }
    this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseleave',this.onMouseout.bind(this), false);
    this.router.navigate([link], { queryParams: { oid: this.queryOID, pid: this.queryPID }});//queryParamsHandling: 'merge', skipLocationChange: false 
  }

  ngOnChanges(){
    this.getCurrentmenu();
  }

  ngAfterViewInit(){
   this.elRef.nativeElement.querySelector('.sidemenu').addEventListener('mouseenter',this.onMouseover.bind(this));
   this.elRef.nativeElement.querySelector('.sidemenu').addEventListener('mouseleave',this.onMouseout.bind(this));
  }
}
