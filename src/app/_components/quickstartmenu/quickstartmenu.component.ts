import { AfterViewInit, AfterViewChecked, AfterContentChecked,  ChangeDetectorRef,  Component, EventEmitter, HostListener, Input,  OnInit, Output, ViewChild, QueryList, ViewChildren, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { findPropertyIDFromUrl } from 'src/app/_helpers/common-utility';
import { AuthenticationService, UserService } from 'src/app/_services';
import { QuickmenuService} from 'src/app/_services/quickmenu.service';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-quickstartmenu',
  templateUrl: './quickstartmenu.component.html',
  styleUrls: ['./quickstartmenu.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('true', style({
        transform: 'translateX(310px)',
      })),
      state('false', style({
        transform: 'translateX(-10px)',
      })),
      transition('false <=> true', animate('350ms ease-in-out'))
    ])

  ]
})
export class QuickstartmenuComponent implements OnInit, AfterViewInit,AfterViewChecked,AfterContentChecked,OnChanges {
  quickStartMenu : any = [];
  isOpen = true;
  showQuickStartMenu = true;
  customClass = 'customClass';
  oneAtATime = true;
  windowWidth:number = 0;
  divguidetext:string;
  queryOID;
  queryPID;
  oIDPIDFromURL
  hideGuidancedivv:boolean;
  isFirstOpen = true;
  showGuidancediv = false;
  keptopen:boolean;
  ishideQsbtn:boolean;
  @Input() customStyle;
  @Input() istopmenuclicked : boolean;
  @Input() enablequickstartfromtopmenu : any;
  @Output() onClickQuickStart : EventEmitter<any> = new EventEmitter<any>();
  @Output() onClickEmitQSLinkobj : EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren(BsDropdownDirective) headerDropdown:QueryList<BsDropdownDirective>;
  @Input() quickStartMenuList:any = [];
  insideqsmenu = false;
  textmsg:string = "check";
  currentUser:any;
  headingtextarray : any = [];
  currenttabindex:number;
  constructor(private location: Location,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private userService: UserService,
    private quickmenuService: QuickmenuService,
    private authService: AuthenticationService,
    private cdRef: ChangeDetectorRef
    ) {
      this.authService.currentUser.subscribe(x => {
        if(x !== null || x !== undefined)
        this.currentUser = true;        
      });
      this.oneAtATime = true;
     }

  ngOnInit(): void {
   this.headingtextarray = ["Getting started","Subscription","Data Subjects Rights Management"]
    this.windowWidth = window.innerWidth;
    this.userService.onClickTopmenu.subscribe((status) => this.istopmenuclicked = status)
    this.activatedroute.queryParamMap.subscribe(params => {
      this.queryOID = params.get('oid');
      this.queryPID = params.get('pid');
    });
    this.oIDPIDFromURL = findPropertyIDFromUrl(this.location.path());
    this.getupdatedQuickStartMenu();
  }

  expanddiv(){
    this.isOpen = !this.isOpen
  }

  onClickQuickStartBtn(){
  //  this.ishideQsbtn = !this.ishideQsbtn;
    if(this.windowWidth <= 1450){
        this.showQuickStartMenu = !this.showQuickStartMenu;
        this.showGuidancediv = !this.showGuidancediv;
        this.onClickQuickStart.emit(this.showQuickStartMenu);
    }else{
      this.showQuickStartMenu = !this.showQuickStartMenu;
      this.showGuidancediv = !this.showGuidancediv;
      this.onClickQuickStart.emit(false);
    }
    
  }

  dismissQuickStartMenu() {
    this.isOpen = false;
    this.showQuickStartMenu = !this.showQuickStartMenu;
    this.quickmenuService.isquickmenudismiss = true;
    this.enablequickstartfromtopmenu = true;
    this.quickmenuService.onDissmissQuickStartmenu.next(true); 
  }

  
  onQuickStart(){
   // this.onClickQuickStart.emit(true);
   this.quickmenuService.isuserClickedonqstooltip = false;
    let oIDPIDFromURL = findPropertyIDFromUrl(this.location.path());
    if(oIDPIDFromURL !== undefined && oIDPIDFromURL.length !== 0){
      this.router.navigate(['/settings/organizations'],{ queryParams: { oid: oIDPIDFromURL[0], pid: oIDPIDFromURL[1] }, queryParamsHandling:'merge', skipLocationChange:false});
    }
  }

  onClickQuickStartlink(linkIndex, linkobj) {
    if(linkIndex == 4 && linkobj.linkid == 17){
      return false;
    }
    const allowtonavigate = linkIndex == 1 && (linkobj.linkid == 1 || linkobj.linkid == 2 || linkobj.linkid == 3);
    const allowtonavigatetwo = linkIndex == 3 && (linkobj.linkid == 5 || linkobj.linkid == 6);
    const allowtonavigatethree = linkIndex == 4 && (linkobj.linkid == 11 || linkobj.linkid == 12);
    const allowtonavigatefour = linkIndex == 5 && (linkobj.linkid == 18 || linkobj.linkid == 19);
    const commingSoon = linkIndex == 4 && linkobj.linkid == 17;
    this.quickmenuService.isuserClickedonqstooltip = false;
    linkobj["indexid"] = linkIndex;
   
   this.quickmenuService.onClickEmitQSLinkobj.next(linkobj);
    this.onClickEmitQSLinkobj.emit(linkobj);

    this.currenttabindex = linkIndex;
    // if (linkobj.link.indexOf('dsar') == -1) {
    
    if (allowtonavigate || allowtonavigatetwo || allowtonavigatethree || allowtonavigatefour) {
      let oIDPIDFromURL = findPropertyIDFromUrl(this.location.path());
      this.router.navigate([linkobj.link], { queryParams: { oid: oIDPIDFromURL[0], pid: oIDPIDFromURL[1] }, queryParamsHandling: 'merge', skipLocationChange: false });
      // }
    }
    
  }

  onClickQSLinkForProperty(linkIndex, linkobj) {
    if(linkIndex == 4 && linkobj.linkid == 17){
      return false;
    }
    this.quickmenuService.isuserClickedonqstooltip = false;
    linkobj["indexid"] = linkIndex;
    this.currenttabindex = linkIndex;
    this.quickmenuService.onClickEmitQSLinkobj.next(linkobj);
    this.onClickEmitQSLinkobj.emit(linkobj);
 
      let oIDPIDFromURL = findPropertyIDFromUrl(this.location.path());
      if (oIDPIDFromURL !== undefined) {
        this.router.navigate(['settings/organizations/details', oIDPIDFromURL[0]], { queryParams: { oid: oIDPIDFromURL[0], pid: oIDPIDFromURL[1] }, queryParamsHandling: 'merge', skipLocationChange: false });
      }
  //  }
  }
  
  onCloseQuickstart($event){
    this.isOpen = false;
    //this.ishideQsbtn = !this.ishideQsbtn;
    this.showQuickStartMenu = !this.showQuickStartMenu;
    this.showGuidancediv = false;
    this.onClickQuickStart.emit(true);
  }

  @HostListener('window',['$event'])
  onWindowResize(event){
    this.windowWidth = event.target.innerWidth;
  }

  @HostListener("click")
  clicked() {
    this.quickmenuService.isclickeventoutsidemenu = false;
    //alert('qsm.click.');
  //  console.log('only click event...152..');
    this.insideqsmenu = true;
  
  }
  
 @HostListener('document:click', ['$event.target'])
 outsideClick() {
   this.textmsg = this.insideqsmenu
     ? "Event Triggered insidee"
     : "Event Triggered Outside Component";
   this.insideqsmenu = false;
   if (this.insideqsmenu) {
     this.quickmenuService.isclickeventoutsidemenu = false;
   } else {
     this.quickmenuService.isclickeventfromquickmenu = true;
   }
  
 }

  getCurrentDivGuide(linkid){
    let divGuide;
    switch(linkid){
      case 1:
        divGuide = true
    }
  }

  addGuidancePositionStyle(): object {
    if(this.divguidetext == "addorganization"){
      return {
        'left': "560px",
        'top': "143px"
      }
    }else if(this.divguidetext == "addproperty"){
      return {
        'left': "620px",
        'top': "330px"
      };
    }else if(this.divguidetext == "addcookieconsentsubscription"){
      return {
        'left': "230px",
        'top': "200px"
      };
    } else if(this.divguidetext == "addcookieconsentsubscriptiontoproperty"){
      return {
        'left': "610px",
        'top': "348px"
      };
    } else if(this.divguidetext == "cookiescan-addcookies"){
      return {
        'left': "724px",
        'top': "98px"
      };
    } else if(this.divguidetext == "configure-cookie-banner"){
      return {
        'left': "524px",
        'top': "98px"
      };
    }

  }

  isAccordionHeadingTextMatch(data):boolean {
    if (data == 4){
      return this.keptopen = true;
    } else if(data == 5){
      return this.keptopen = true;
     }else if(data == 3){
      return this.keptopen = true;
    }
  }

  addMultiGuidancePositionStyle(): object {
    if(this.divguidetext == "cookiescan-addcookies"){
      return {
        'left': "480px",
        'top': "498px"
      };
    }
  }

  getupdatedQuickStartMenu(){
    
    let updatedqsMenu = this.quickmenuService.getQuerymenulist();
    return this.quickStartMenu = [...updatedqsMenu];
    
  }

  ngAfterViewInit(){
   this.cdRef.detectChanges();
    
    let obj;
    this.quickmenuService.onClickEmitQSLinkobj.subscribe((data) => obj = data);
    let updatedqsMenu = this.quickmenuService.getQuerymenulist();
    return this.quickStartMenu = [...updatedqsMenu];
  }

  ngAfterViewChecked(){
    this.quickmenuService.isQSMenuDissmissed.subscribe((status)=>this.enablequickstartfromtopmenu = status);
    this.oneAtATime = true;
    this.cdRef.detectChanges();
  }
 
  ngAfterContentChecked(){
    this.cdRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cdRef.detectChanges();
    let updatedqsMenu = this.quickmenuService.getQuerymenulist();
     this.quickStartMenuList = [...updatedqsMenu];
  }

}
