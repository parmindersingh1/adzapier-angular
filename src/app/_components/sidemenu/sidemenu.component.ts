import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, Output,EventEmitter, HostListener, ElementRef, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  animations: [
    trigger('slideInOutSideMenu', [
      state('true', style({
       width:'230px',
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
  currentMenuItem:boolean = false;
  currentMenuItemIndex:number;
  orgInitials:any;
  propInitials:any;
  constructor(private activatedroute: ActivatedRoute,
              private elRef:ElementRef,
              private router: Router,
              private cdRef: ChangeDetectorRef,
              private location: Location,
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
   this.showOrgInitials(this.organization);
   this.showPropInitials(this.property);
   this.matchSideLinkWithNavbarlink();
  }

  onMouseover() {
    this.elRef.nativeElement.querySelector('.menu-arrow').removeEventListener('mouseenter',this.onMouseoveronArrow.bind(this),true);
    this.elRef.nativeElement.querySelector('.menu-arrow').removeEventListener('mouseleave',this.onMouseoutonArrow.bind(this),true);
  
    console.log('over..')
    if (this.isSideMenuArrowClicked) {
      this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseenter', this.onMouseover.bind(this), true);
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
    this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseleave',this.onMouseout.bind(this), true);
    this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseenter', this.onMouseover.bind(this), true);
  }

  onMouseout() {
    this.showOrgInitials(this.organization);
    this.showPropInitials(this.property);
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
    this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseenter',this.onMouseover.bind(this),true);
  }

  onClickonMenuArrow() {
    this.userService.removeSidemenuOpenStatus();
    this.isSideMenuArrowClicked = !this.isSideMenuArrowClicked;
    if (this.slideSideMenu && this.isSideMenuArrowClicked) {
      this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseenter', this.onMouseover.bind(this), true);
      this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseleave',this.onMouseout.bind(this), true);
      this.userService.setSidemenuOpenStatus(this.isSideMenuArrowClicked);
    }else{
      this.slideSideMenu = !this.slideSideMenu;
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
      this.isSideMenuArrowClicked = true;
    }
  }
  
  onClickSubmenu(link,linkIndex){
    this.currentMenuItemIndex = linkIndex;
    if(!this.isSideMenuArrowClicked){
      this.slideSideMenu = false;
    }
    this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseenter', this.onMouseover.bind(this));
    this.elRef.nativeElement.querySelector('.sidemenu').removeEventListener('mouseleave',this.onMouseout.bind(this));
    this.router.navigate([link], { queryParams: { oid: this.queryOID, pid: this.queryPID }});//queryParamsHandling: 'merge', skipLocationChange: false 
  }

  ngOnChanges(changes:SimpleChanges){
  this.getCurrentmenu();
  this.matchSideLinkWithNavbarlink();
  this.showOrgInitials(this.organization);
  this.showPropInitials(this.property);
  this.cdRef.detectChanges();
  }

  ngAfterViewInit(){
   this.showOrgInitials(this.organization);
   this.showPropInitials(this.property);
    if(!this.slideSideMenu && !this.isSideMenuArrowClicked){
        this.elRef.nativeElement.querySelector('.sidemenu').addEventListener('mouseenter',this.onMouseover.bind(this));
        this.elRef.nativeElement.querySelector('.sidemenu').addEventListener('mouseleave',this.onMouseout.bind(this));
    }
    this.getCurrentmenu();
    this.matchSideLinkWithNavbarlink();
    this.cdRef.detectChanges();
  }

  showOrgInitials(orgname):string{
   // if(!this.isSideMenuArrowClicked){
      if(orgname !== undefined){
        let o = orgname[0];
        return this.orgInitials = o;
      }
    //}
  }
  
  showPropInitials(propname):string{
   //if(!this.isSideMenuArrowClicked){
      if(propname !== undefined){
        let p = propname[0];
        return this.propInitials = p;
      }
   // }
  }

  matchSideLinkWithNavbarlink(){
      const pathFromURL = this.location.path().split("?"); 
      const index = this.currentmenu.subcategory.findIndex((t) => t.routerLink === pathFromURL[0]);
      this.currentMenuItemIndex = index; 
  }

  trackById(index, menuitem) {
    return menuitem.indexid;
  }

}
