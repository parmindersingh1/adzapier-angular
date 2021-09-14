import { Component, OnInit } from '@angular/core';
import { AccordionConfig } from 'ngx-bootstrap/accordion';
export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), { closeOthers: true });
}

@Component({
  selector: 'app-quickstartmenu',
  templateUrl: './quickstartmenu.component.html',
  styleUrls: ['./quickstartmenu.component.scss'],
  providers: [{ provide: AccordionConfig, useFactory: getAccordionConfig }]

})
export class QuickstartmenuComponent implements OnInit {
  quickStartMenu : any[];
  isOpen = true;
  showQuickStartMenu = true;
  customClass = 'customClass';
  constructor() { }

  ngOnInit(): void {
    this.quickStartMenu = [{
      "index":1,
      "indextext":"Getting Start",
      "quicklinks":[{
        "link":"/settings",
        "islinkclicked":false,
        "linkdisplaytext":"Add Company details",
      },{
        "link":"/settings",
        "islinkclicked":false,
        "linkdisplaytext":"Add Organization",
      },{
        "link":"/settings",
        "islinkclicked":false,
        "linkdisplaytext":"Add Property",
      },{
        "link":"/settings",
        "islinkclicked":false,
        "linkdisplaytext":"Getting Start",
      }],
      
    },{
      "index":2,
      "indextext":"Subscription",
      "quicklinks":[{
        "link":"/settings",
        "islinkclicked":false,
        "linkdisplaytext":"Add Company details",
      }],
      
    },
    {
      "index":3,
      "indextext":"Cookie Consent Management",
      "quicklinks":[{
        "link":"/settings",
        "islinkclicked":false,
        "linkdisplaytext":"Add Cookie Consent subscription",
      },{
        "link":"/settings",
        "islinkclicked":false,
        "linkdisplaytext":"Assing Cookie Consent subscription to property",
      },{
        "link":"/settings",
        "islinkclicked":false,
        "linkdisplaytext":"Cookie Scan and Add Cookies",
      },{
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

}
