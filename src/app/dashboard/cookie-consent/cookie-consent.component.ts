import { Component, OnInit } from '@angular/core';
declare var jQuery: any;
@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.onMapInIt();
  }

  onMapInIt() {
    jQuery('#vmapUSA').vectorMap({
      map: 'world_en',
      showTooltip: true,
      backgroundColor: '#fff',
      color: '#d1e6fa',
      colors: {
        fl: '#69b2f8',
        ca: '#69b2f8',
        tx: '#69b2f8',
        wy: '#69b2f8',
        ny: '#69b2f8'
      },
      selectedColor: '#00cccc',
      enableZoom: false,
      borderWidth: 1,
      borderColor: '#fff',
      hoverOpacity: .85
    });
  }

}
