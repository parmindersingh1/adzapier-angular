import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-az-banner',
  templateUrl: './az-banner.component.html',
  styleUrls: ['./az-banner.component.scss']
})
export class AzBannerComponent implements OnInit {
  bannerType = 'generic';
  @Input('formData') formData;
  constructor() { }

  ngOnInit(): void {
  }

}
