import { AfterViewInit, AfterViewChecked, AfterContentChecked,  ChangeDetectorRef,  Component, EventEmitter, HostListener, Input,  OnInit, Output, ViewChild, QueryList, ViewChildren, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { findPropertyIDFromUrl } from 'src/app/_helpers/common-utility';
import { AuthenticationService, UserService } from 'src/app/_services';
import { QuickmenuService} from 'src/app/_services/quickmenu.service';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { moduleName } from 'src/app/_constant/module-name.constant';
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
  showQuickStartMenu:boolean = true;
  customClass = 'customClass';
  windowWidth:number = 0;
  divguidetext:string;
  queryOID;
  queryPID;
  oIDPIDFromURL
  hideGuidancedivv:boolean;
  isFirstOpen = true;
  showGuidancediv = false;
  keptopen:boolean;
  ishideQsbtn:boolean = false;
  @Input() customStyle;
  @Input() istopmenuclicked : boolean;
  @Input() enablequickstartfromtopmenu : any;
  @Output() onClickQuickStart : EventEmitter<any> = new EventEmitter<any>();
  @Output() onCloseQuickStart : EventEmitter<any> = new EventEmitter<any>();
  @Output() onClickQuickStartHeading : EventEmitter<any> = new EventEmitter<any>();
  @Output() onClickEmitQSLinkobj : EventEmitter<any> = new EventEmitter<any>();
  @Output() onClickDismiss : EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren(BsDropdownDirective) headerDropdown:QueryList<BsDropdownDirective>;
  @Input() checkchanges:any;
  quickStartMenuList:any = [];
  insideqsmenu = false;
  textmsg:string = "check";
  currentUser:any;
  headingtextarray : any = [];
  currenttabindex:number;
  alertMsg;
  isOpenalertMsg;
  alertType;
  dismissible = true;
  isClickedonDismissed:boolean = false;
  currentloggedInUser:any;
  skeletonLoading = true;
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
     }

  ngOnInit(): void {
  this.headingtextarray = ["Getting started", "Subscription", "Data Subjects Rights Management"]
      this.windowWidth = window.innerWidth;
      //this.userService.onClickTopmenu.subscribe((status) => this.istopmenuclicked = status)
      this.activatedroute.queryParamMap.subscribe(params => {
        this.queryOID = params.get('oid');
        this.queryPID = params.get('pid');
      });
      this.oIDPIDFromURL = findPropertyIDFromUrl(this.location.path());
      if (this.quickStartMenuList.length == 0 || this.quickStartMenuList === null) {
        this.getLoggedInUserDetails();
      //  this.getupdatedQuickStartMenu();
      }
    }
  

  expanddiv(){
    this.isOpen = !this.isOpen
  }

  onClickQuickStartBtn(){
  //  this.ishideQsbtn = !this.ishideQsbtn;
    if(this.windowWidth <= 1450){
        this.showQuickStartMenu = false; //!this.showQuickStartMenu;
        this.showGuidancediv = !this.showGuidancediv;
        this.onClickQuickStart.emit(this.showQuickStartMenu);
        this.quickmenuService.isquickstartopen = true;
    }else{
      this.showQuickStartMenu = false;// !this.showQuickStartMenu;
      this.showGuidancediv = !this.showGuidancediv;
      this.onClickQuickStart.emit(false);
      this.quickmenuService.isquickstartopen = true;
    }
    
  }

  dismissQuickStartMenu() {
    this.isOpen = false;
    this.isClickedonDismissed = true;
    this.quickmenuService.isquickstartopen = true;
    this.quickmenuService.dismissQuickStart(true).subscribe((data)=>{
      this.enablequickstartfromtopmenu = data.response.quickstart_dismissed;
      this.onClickDismiss.emit(data.response.quickstart_dismissed);
      this.istopmenuclicked = false;
    },error =>{
      console.log(error)
    });
    this.showQuickStartMenu = !this.showQuickStartMenu; //to close already open quick start div
    this.quickmenuService.isquickmenudismiss = true;
   // this.enablequickstartfromtopmenu = true;
  //  this.quickmenuService.setQuickstartDismissStatus({isdismissed:true,isqstoplink:true});
    this.quickmenuService.onDissmissQuickStartmenu.next(true); 
    this.quickmenuService.headerNavStatusAfterDismissedQuickStart.next(false);
    this.userService.onRevistQuickStartmenulink.next({quickstartid:0,reclickqslink:true,urlchanged:true}); 
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
    this.quickmenuService.isquickstartopen = false;
    this.onClickQuickStartHeading.emit(false);
    if (this.checkForVistiedQSMLink(linkIndex, linkobj)) {
      if (linkIndex == 4 && linkobj.linkid == 17) {
        return false;
      }
      const allowtonavigate = linkIndex == 1 && (linkobj.linkid == 1 || linkobj.linkid == 2 || linkobj.linkid == 3);
      const allowtonavigatetwo = linkIndex == 3 && (linkobj.linkid == 5 || linkobj.linkid == 6);
      const allowtonavigatethree = linkIndex == 4 && (linkobj.linkid == 11 || linkobj.linkid == 12);
      const allowtonavigatefour = linkIndex == 5 && (linkobj.linkid == 18 || linkobj.linkid == 19);
      const commingSoon = linkIndex == 4 && linkobj.linkid == 17;
      this.quickmenuService.isuserClickedonqstooltip = false;
      linkobj["indexid"] = linkIndex;
      this.currenttabindex = linkIndex;
      this.onClickEmitQSLinkobj.emit(linkobj);
      this.quickmenuService.onClickEmitQSLinkobj.next(linkobj);
      this.userService.onRevistQuickStartmenulink.next({ quickstartid: linkobj.linkid, reclickqslink: false, urlchanged: false });

      // if (linkobj.link.indexOf('dsar') == -1) {

      if (allowtonavigate || allowtonavigatetwo || allowtonavigatethree || allowtonavigatefour) {
        let oIDPIDFromURL = findPropertyIDFromUrl(this.location.path());
        if (oIDPIDFromURL !== undefined) {
          this.router.navigate([linkobj.link], { queryParams: { oid: oIDPIDFromURL[0], pid: oIDPIDFromURL[1] }, queryParamsHandling: 'merge', skipLocationChange: false });
        } else {
          return false;
        }
        // }
      }
    }else{
      this.alertMsg = "Please complete the previous steps";
      this.isOpenalertMsg = true;
      this.alertType = 'info';
      return false;
    }
  }
  
  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpenalertMsg = false;
  }

  onClickQSLinkForProperty(linkIndex, linkobj) {
    this.onClickQuickStartHeading.emit(false);
    this.quickmenuService.isquickstartopen = false;
    if(this.checkForVistiedQSMLink(linkIndex,linkobj)){
    if (linkIndex == 4 && linkobj.linkid == 17) {
      return true; // false; // temp commented...
    }
    this.quickmenuService.isuserClickedonqstooltip = false;
    linkobj["indexid"] = linkIndex;
    this.currenttabindex = linkIndex;
    this.quickmenuService.onClickEmitQSLinkobj.next(linkobj);
    this.onClickEmitQSLinkobj.emit(linkobj);
    this.userService.onRevistQuickStartmenulink.next({ quickstartid: linkobj.linkid, reclickqslink: false, urlchanged: false });
    // this.userService.onRevistQuickStartmenulink.next({quickstartid:linkobj.linkid,reclickqslink:linkobj.isactualbtnclicked,urlchanged:false});
    let oIDPIDFromURL = findPropertyIDFromUrl(this.location.path());
    if (oIDPIDFromURL !== undefined) {
      this.router.navigate(['settings/organizations/details', oIDPIDFromURL[0]], { queryParams: { oid: oIDPIDFromURL[0], pid: oIDPIDFromURL[1] }, queryParamsHandling: 'merge', skipLocationChange: false });
    }
    }else{
      this.alertMsg = "Please complete the previous steps";
      this.isOpenalertMsg = true;
      this.alertType = 'info';
      return false;
    }
    this.cdRef.detectChanges();
  }
  
  onCloseQuickstart($event){
    this.isOpen = false;
    //this.ishideQsbtn = !this.ishideQsbtn;
    this.showQuickStartMenu = !this.showQuickStartMenu;
    this.showGuidancediv = false;
    this.onClickQuickStart.emit(true);
    this.onCloseQuickStart.emit(true);
    this.quickmenuService.isquickstartopen = true;//true;
    this.userService.onRevistQuickStartmenulink.next({quickstartid:0,reclickqslink:true,urlchanged:true}); 
  }

  onClickQSMHeading(event: boolean) {
    if(event){
      this.onClickQuickStartHeading.emit(true);
    }
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
  let dataobj;
  this.quickmenuService.onClickEmitQSLinkobj.subscribe((data) => dataobj = data);
   this.textmsg = this.insideqsmenu
     ? "Event Triggered insidee"
     : "Event Triggered Outside Component";
  // this.insideqsmenu = false;
   if (this.insideqsmenu) {
     this.quickmenuService.isclickeventoutsidemenu = true;
   } else {
     this.quickmenuService.isclickeventfromquickmenu = false;
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
    this.skeletonLoading = false;
    let updatedqsMenu = this.quickmenuService.getQuerymenulist();
    return this.quickStartMenuList = [...updatedqsMenu];
    
  }

  checkForVistiedQSMLink(objindex, currentobj) {
    const a = this.quickmenuService.getQuerymenulist();
    if (objindex == 4 && currentobj.linkid == 17) {
      return true;
    }
    if (currentobj.linkid !== 1 && currentobj.linkid !== 17) { //temporary commented

      if (a !== undefined && a.length !== 0) {
        const idx = a.findIndex((t) => t.index == objindex);
        const linkIndex = a[idx].quicklinks.findIndex((t) => t.linkid == currentobj.linkid);
        if (linkIndex > 0) {
          if (a[idx].quicklinks[linkIndex - 1].isactualbtnclicked) {
            return true;
          }
        }  else if(this.isSubscriptionLinkVisited()){
          if(objindex == 2 || objindex == 3 || objindex == 4 || objindex == 5){ //to avoid issue when revisit qsm links
            const idx = a.findIndex((t) => t.index == objindex);
            return a[idx].quicklinks.some((t) => t.linkid == 4 || t.linkid == 5 || t.linkid == 11 || t.linkid == 18 ); //to avoid issue when revisit qsm links
          }
        }  else if (linkIndex == 0 && objindex > 1 && objindex !== 4) {
          if ((objindex - 1) == 4 && currentobj.linkid == 17) {
            return true
          }//temporary condition for connect to systems later remove..
         else{
          const previousidx = a.findIndex((t) => t.index == objindex - 1);
          const islastitemofPreviousIdChecked = a[previousidx].quicklinks[a[previousidx].quicklinks.length - 1].isactualbtnclicked == true && a[previousidx].quicklinks[a[previousidx].quicklinks.length - 1].linkid !== 17;
          if (islastitemofPreviousIdChecked) {
            return true;
          } else {
            return false;
          }
        }
        }
        else {
          return false; //true;
        }
      }
    } else {
      return true;
    }
  }

  isSubscriptionLinkVisited(): boolean {
    const a = this.quickmenuService.getQuerymenulist();
    const idx = a.findIndex((t) => t.index == 2);
    return a[idx].quicklinks.some((t) => t.linkid == 4 && t.isactualbtnclicked);
  }

  ngAfterViewInit(){
   this.cdRef.detectChanges();
    
    let obj;
    this.quickmenuService.onClickEmitQSLinkobj.subscribe((data) => obj = data);
    // let updatedqsMenu = this.quickmenuService.getQuerymenulist();
    // return this.quickStartMenu = [...updatedqsMenu];
  }

  ngAfterViewChecked(){
    //this.quickmenuService.isQSMenuDissmissed.subscribe((status)=>this.enablequickstartfromtopmenu = status);
    this.cdRef.detectChanges();
  }
 
  ngAfterContentChecked(){
    this.cdRef.detectChanges();
  }

  getLoggedInUserDetails() {
    this.authService.currentUser.subscribe(async x => {
      if(x !== null){
        const data = await this.userService.getLoggedInUserDetails(this.constructor.name, moduleName.headerModule).toPromise();
          if(data){
            this.currentloggedInUser = data;
            this.quickStartMenuList = this.currentloggedInUser.response.quickstart_visited_links;
            if(this.quickStartMenuList !== undefined && this.quickStartMenuList !== null){
              this.quickmenuService.setQuerymenulist(this.quickStartMenuList);
            }else{
              let updatedqsMenu = this.quickmenuService.getQuerymenulist();
              return this.quickStartMenuList = [...updatedqsMenu];
            }
          }
      }else{
        return false;
      }
    });
  }

  trackById(index, datalist) {
    return datalist.indexid;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.checkchanges !== undefined && changes.checkchanges.currentValue !== undefined) {
      this.getLoggedInUserDetails();
    }
    // let updatedqsMenu = this.quickmenuService.getQuerymenulist();
    //  this.quickStartMenuList = [...updatedqsMenu];
  }

}
