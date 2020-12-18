import {Component,  Input,  OnInit} from '@angular/core';
import {defaultBannerContent, FormDefaultData, iabPurposeList} from '../../../../_constant/consent-banner.constant';

@Component({
  selector: 'app-popup-live-preview',
  templateUrl: './popup-live-preview.component.html',
  styleUrls: ['./popup-live-preview.component.scss']
})
export class PopupLivePreviewComponent implements OnInit {
  public defaultContent = defaultBannerContent;
  openPurposeType = '';
  currentPurpose = '';
  checkedPurposeIds = [];
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

  onOpenDesc(purpose){
    if (this.openPurposeType === purpose) {
      this.openPurposeType = '';
    } else {
    this.openPurposeType = purpose;
    }
  }
  onSetPurposeIds(name, e) {
    console.log('e', e);

    if (e) {
      this.checkedPurposeIds.push(name);
  } else {
        const index = this.checkedPurposeIds.indexOf(name);
        if (index > -1) {
            this.checkedPurposeIds.splice(index, 1);
        }
    }
  }
}
