import {Component,  Input,  OnInit} from '@angular/core';
import {defaultBannerContent, FormDefaultData, iabPurposeList} from '../../../../_constant/consent-banner.constant';

@Component({
  selector: 'app-popup-live-preview',
  templateUrl: './popup-live-preview.component.html',
  styleUrls: ['./popup-live-preview.component.scss']
})
export class PopupLivePreviewComponent implements OnInit {
  public defaultContent = defaultBannerContent;
  currentPurpose = '';
  iabPurposeList = iabPurposeList;
  type = 'gdpr';
  @Input('isGdprGlobal') isGdprGlobal = false;
  @Input('formData') formData: FormDefaultData = new FormDefaultData();

  ngOnInit() {
    this.currentPurpose = this.defaultContent.NecessaryText ;
  }

  onSelectPurpose(val: string) {
    this.currentPurpose = val;
  }
}
