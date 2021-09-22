import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { findPropertyIDFromUrl } from 'src/app/_helpers/common-utility';

@Component({
  selector: 'app-quickstartmenu',
  templateUrl: './quickstartmenu.component.html',
  styleUrls: ['./quickstartmenu.component.scss']
})
export class QuickstartmenuComponent implements OnInit {
  quickStartMenu : any[]  = [];
  isOpen = true;
  showQuickStartMenu = true;
  customClass = 'customClass';
  oneAtATime = true;
  queryOID;
  queryPID;
  constructor(private location: Location,
    private router: Router,
    private activatedroute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.activatedroute.queryParamMap.subscribe(params => {
      this.queryOID = params.get('oid');
      this.queryPID = params.get('pid');
    });
    this.quickStartMenu = [{
      "index":1,
      "indextext":"Getting Start",
      "quicklinks":[{
        "linkid":1,
        "link":"/settings/company",
        "islinkclicked":false,
        "linkdisplaytext":"Add Company details",
      },{
        "linkid":2,
        "link":"/settings/organizations",
        "islinkclicked":false,
        "linkdisplaytext":"Add Organization",
      },{
        "linkid":3,
        "link":"/settings/organizations/details/details/"+this.queryOID,
        "islinkclicked":false,
        "linkdisplaytext":"Add Property",
      },{
        "linkid":4,
        "link":"/settings",
        "islinkclicked":false,
        "linkdisplaytext":"Getting Start",
      }],
      
    },{
      "index":2,
      "indextext":"Subscription",
      "quicklinks":[{
        "linkid":5,
        "link":"/settings/billing/pricing",
        "islinkclicked":false,
        "linkdisplaytext":"Subscription",
      }],
      
    },
    {
      "index":3,
      "indextext":"Cookie Consent Management",
      "quicklinks":[{
        "linkid":6,
        "link":"/settings",
        "islinkclicked":false,
        "linkdisplaytext":"Add Cookie Consent subscription",
      },{
        "linkid":7,
        "link":"/settings",
        "islinkclicked":false,
        "linkdisplaytext":"Assing Cookie Consent subscription to property",
      },{
        "linkid":8,
        "link":"/settings",
        "islinkclicked":false,
        "linkdisplaytext":"Cookie Scan and Add Cookies",
      },{
        "linkid":9,
        "link":"/settings",
        "islinkclicked":false,
        "linkdisplaytext":"Configure Cookie Banner",
      }],
      
    }
  
  ]
  }

  expanddiv(){
    this.isOpen = !this.isOpen
  }

  onClickQuickStartBtn(){
    this.showQuickStartMenu = !this.showQuickStartMenu;
  }

  dismissQuickStartMenu(){
    this.isOpen = false
  }

  
  onQuickStart(){
    let oIDPIDFromURL = findPropertyIDFromUrl(this.location.path())
    this.router.navigate(['/settings/organizations'],{ queryParams: { oid: oIDPIDFromURL[0], pid: oIDPIDFromURL[1], qs:true }, queryParamsHandling:'merge', skipLocationChange:false});
  }

  onClickQuickStartlink($event,linkobj){
    console.log($event,linkobj);
    this.quickStartMenu[0].quicklinks.filter((t)=> {
      if(t.linkid == linkobj.linkid){
        t.islinkclicked = true;
      }
    });

    let a = this.quickStartMenu;
    this.quickStartMenu = [...a];
  }
  
  onCloseQuickstart($event){
    this.showQuickStartMenu = !this.showQuickStartMenu;
    console.log($event);
  }

}
