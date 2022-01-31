import {Component, Input, OnChanges, OnInit, EventEmitter, Output, SimpleChanges} from '@angular/core';
import {defaultBannerContent, FormDefaultData, iabPurposeList} from '../../../../_constant/consent-banner.constant';

@Component({
  selector: 'app-banner-live-priview',
  templateUrl: './banner-live-priview.component.html',
  styleUrls: ['./banner-live-priview.component.scss']
})
export class BannerLivePriviewComponent  {
  public defaultContent = defaultBannerContent;
  type = 'gdpr';
  iabPurposeList = iabPurposeList;
  showBadgeBtn = false;

@Input('formData') formData: FormDefaultData = new FormDefaultData();
@Input('isDisabled') isDisabled = false;
@Input('isGdprGlobal') isGdprGlobal = false;
@Input('ccpaGlobal') ccpaGlobal = false;
@Output('showPopUp') showPopUp = new EventEmitter();

  constructor() { }
  onShowBadgeButton() {
      this.showBadgeBtn  = true;
  }

  onShowPopUp() {
    this.showBadgeBtn = false;
    this.showPopUp.emit(true);
  }
}
