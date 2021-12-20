import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuickStartMenuList } from '../_models/quickstartmenulist'
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class QuickmenuService extends QuickStartMenuList {
 // @Output() onClickEmitQSLinkobj : EventEmitter<any> = new EventEmitter<any>();
   qsMenuobjwithIndexid:any;
  isclickeventoutsidemenu:boolean = false;
  isclickeventfromquickmenu:boolean = false;
  isuserClickedonqstooltip:boolean = false;
  isquickstartopen:boolean = false;
  isquickmenudismiss:boolean = false;
  public onClickEmitQSLinkobj: BehaviorSubject<any> = new BehaviorSubject<any>({divguidetext: "",
  indexid: 0,
  isactualbtnclicked: false,
  islinkclicked: false,
  link: "",
  linkdisplaytext: "",
  linkid: 0});
 
  get isClickedOnQSMenu() {
      return this.onClickEmitQSLinkobj.asObservable();
  }
  public onDissmissQuickStartmenu: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  get isQSMenuDissmissed() {
    return this.onDissmissQuickStartmenu.asObservable();
  }
  public headerNavStatusAfterDismissedQuickStart: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  get isHeaderNavClickedAfterQSDissmissed() {
    return this.headerNavStatusAfterDismissedQuickStart.asObservable();
  }
  constructor(private httpClient:HttpClient) {
    super();
        this.loadQuickstartMenu()
   }

   setQuerymenulist(data) {
    localStorage.setItem('quickmenuList', JSON.stringify(data));
  }

  getQuerymenulist():any {
    if (localStorage.getItem('quickmenuList') !== null) {
      return JSON.parse(localStorage.getItem('quickmenuList'));
    } else {
      return this.loadQuickstartMenu();
    }
  }

  updateQuerymenulist(newItem) {
    if (newItem.indexid !== undefined && newItem.linkid !== undefined) {
      const controlList = this.getQuerymenulist();
      const ctrlIdx = controlList.findIndex((el) => el.index === newItem.indexid);
      const quicklinkIdx = controlList[ctrlIdx].quicklinks.findIndex((t) => t.linkid === newItem.linkid);
      if (quicklinkIdx !== -1) {
        //controlList[ctrlIdx].quicklinks[quicklinkIdx].linkid = newItem.linkid;
        controlList[ctrlIdx].quicklinks[quicklinkIdx].isactualbtnclicked = newItem.isactualbtnclicked;
        controlList[ctrlIdx].quicklinks[quicklinkIdx].islinkclicked = newItem.islinkclicked;
        // controlList[ctrlIdx].quicklinks[quicklinkIdx] = newItem;
        localStorage.setItem('quickmenuList', JSON.stringify(controlList));
      }

    }
  }

  setQuickstartDismissStatus(data){
      localStorage.setItem('qsmDismissStatus', JSON.stringify(data));
  }

  getQuickstartDismissStatus(){
    return JSON.parse(localStorage.getItem('qsmDismissStatus'));
  }

  removeQuicstartDismissStatus(){
    localStorage.removeItem('qsmDismissStatus');
  }

  dismissQuickStart(status): Observable<any>{
    return this.httpClient.post<any>(environment.apiUrl + '/quickstart/dismiss',{"is_quickstart_dismissed":status});
  }

}
