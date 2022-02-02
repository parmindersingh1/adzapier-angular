import {
  AfterViewInit,
  ChangeDetectorRef,
  Component, ElementRef, HostListener,
  OnDestroy,
  OnInit,
  TemplateRef, ViewChild,
  ViewEncapsulation
} from '@angular/core';
declare global {
  interface Window { AZSocial: any; }
}

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ShareComponent implements OnInit, OnDestroy, AfterViewInit {
  publishing: boolean = false;
  url: string = "";
  position: string = "left";

  SocialIconConfiguration = {
    Configuration: {
        'position': this.position,
        'icons': [
            {
                name: "twitter",
                link: this.url
            },
            {
                name: "facebook",
                link: this.url
            },
            {
                name: "linkedin",
                link: this.url
            },
            {
                name: "whatsapp",
                link: this.url
            },
            {
                name: "viber",
                link: this.url
            }
        ]
    
    },
    PropId: 'd5511f97-bd8f-46cd-b897-d5bd8e0bda5a',
    OrgId: '56dd7f70-079d-42ca-9edb-cee54730aa08',
    
};
  constructor(
  ) {
    this.loadStyle()

  }

  

  private loadStyle() {
  
      
      let head = document.getElementsByTagName('head')[0]
        
      // Creating link element
      var style = document.createElement('link') 
      style.href = 'http://127.0.0.1:8081/az-consent-preference-style.css'
      style.type = 'text/css'
      style.rel = 'stylesheet'
      head.append(style);
        
  }
private loadScript() {
  let scoialScript = document.createElement("script");
  scoialScript.type = "text/javascript";
  scoialScript.async = true;
  scoialScript.src = "http://127.0.0.1:8080/bundle.js";
  scoialScript.onload = () => {
    window.AZSocial.init(this.SocialIconConfiguration);
  };
  document.body.appendChild(scoialScript);
}
   

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.loadScript();
  }

  ngOnDestroy() {
    
  }

  changeLayout(position) {
    this.position = position
  }

  onUpdate() {
    this.SocialIconConfiguration = {
      Configuration: {
          'position': this.position,
          'icons': [
              {
                  name: "twitter",
                  link: this.url
              },
              {
                  name: "facebook",
                  link: this.url
              },
              {
                  name: "linkedin",
                  link: this.url
              },
              {
                  name: "whatsapp",
                  link: this.url
              },
              {
                  name: "viber",
                  link: this.url
              }
          ]
      
      },
      PropId: 'd5511f97-bd8f-46cd-b897-d5bd8e0bda5a',
      OrgId: '56dd7f70-079d-42ca-9edb-cee54730aa08',
      
  };

  let myobj = document.getElementsByClassName("az-social-icon");
  for (var i = myobj.length - 1; i >= 0; --i) {
    myobj[i].remove();
  }
    window.AZSocial.init(this.SocialIconConfiguration);
  }

}
