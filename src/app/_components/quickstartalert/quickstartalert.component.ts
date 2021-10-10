import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/_services';
import { QuickStartMenuList} from 'src/app/_models/quickstartmenulist'
import { QuickmenuService } from 'src/app/_services/quickmenu.service';
@Component({
  selector: 'app-quickstartalert',
  templateUrl: './quickstartalert.component.html',
  styleUrls: ['./quickstartalert.component.scss']
})
export class QuickstartalertComponent implements OnInit {
  @Input() isuserclickoutsidemenu:boolean;
  @Input() isclickedbyuser:boolean;
  @Input() linkid:any;
  @Input() guidancetext:string;
  @Input() reclickqslink:boolean;
  @Input() isactualLinkclickedbyuser: boolean = false;
  @Input() styleobj: object;
  @Input() divguidetext:string;
  @Output() clickEventbyUser:EventEmitter<any> = new EventEmitter<any>();
  revisitedqslink:boolean;
  revisitedlinkId:any;
  quickstartmenu:any = [];
  constructor(private userService: UserService,
    private quickmenuService:QuickmenuService,
    private quickStartMenuList:QuickStartMenuList) {
    console.log(this.isuserclickoutsidemenu,'isuserclickoutsidemenu..qlert..')
   }

  ngOnInit(): void {
    this.isQsLinkRevisited();
    this.quickstartmenu = this.quickStartMenuList.loadQuickstartMenu();
  //  console.log(this.isclickedbyuser,'isclickedbyuser..');
   // console.log(this.linkid,'isclickedbyuser..');
    this.userService.isRevisitedQSMenuLink.subscribe((status) => {this.revisitedqslink = status.reclickqslink; this.revisitedlinkId = status.quickstartid; })
    // this.userService.isClickedOnQSMenu.pipe(
    //   takeUntil(this.unsubscribeAfterUserAction$)

    // ).subscribe((status)=> {
    //   this.isquickstartmenuheader = status.isclicked;
    //   this.quickDivID = status.quickstartid;
    // });
  }

  isQsLinkRevisited():boolean{
   if(this.isactualLinkclickedbyuser &&  this.isclickedbyuser){
   return this.reclickqslink = true;
   } 
  }

  onClickOkbyUser(){
    this.quickmenuService.isuserClickedonqstooltip = true;
    this.clickEventbyUser.emit(true);
  }

  ngOnChanges(changes: SimpleChanges) {
    
  }

}
 