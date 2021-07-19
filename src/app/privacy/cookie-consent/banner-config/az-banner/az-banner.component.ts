import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-az-banner',
  templateUrl: './az-banner.component.html',
  styleUrls: ['./az-banner.component.scss']
})
export class AzBannerComponent implements OnInit {
  bannerType = 'generic';
  @Input('formData') formData;
  @Output('currentBannerLayer') currentBannerLayer = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  onOpenPreference() {
    this.currentBannerLayer.emit('preference');
  }
}
