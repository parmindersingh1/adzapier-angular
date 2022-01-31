import {Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-az-banner',
  templateUrl: './az-banner.component.html',
  styleUrls: ['./az-banner.component.scss']
})
export class AzBannerComponent implements OnInit {
  bannerType = 'generic';
  @Input('formData') formData;
  showBadge = false;
  @Output('currentBannerLayer') currentBannerLayer = new EventEmitter();
  @Output('showBadgeOption') showBadgeOption = new EventEmitter();
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }
  onOpenPreference() {
    this.currentBannerLayer.emit('preference');
  }
  get isBoxedType() {
    return this.formData?.LayoutType?.search('boxed') !== -1 ? 'boxed' : 'full-width';
  }
  get isBannerBottomType() {
    return this.formData?.LayoutType?.search('bottom') !== -1 ? 'bottom' : 'top';
  }
  get isBannerRightType() {
    return this.formData?.LayoutType?.search('right') !== -1 ? 'right' : 'left';
  }

  showCookieNotice() {
    this.showBadge = false;
    this.showBadgeOption.emit(true);
  }
}
