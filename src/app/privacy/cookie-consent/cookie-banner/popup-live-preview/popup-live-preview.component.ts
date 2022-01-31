import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {defaultBannerContent, FormDefaultData, iabPurposeList} from '../../../../_constant/consent-banner.constant';

@Component({
  selector: 'app-popup-live-preview',
  templateUrl: './popup-live-preview.component.html',
  styleUrls: ['./popup-live-preview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopupLivePreviewComponent implements OnInit, OnChanges {
  public defaultContent = defaultBannerContent;
  openPurposeType = '';
  currentPurpose = '';
  checkedPurposeIds = [];
  iabPurposeList = iabPurposeList;
  type = 'gdpr';
  @Input('isGdprGlobal') isGdprGlobal = false;
  @Input('ccpaGlobal') ccpaGlobal = false;
  @Input('showConfigType') showConfigType = false;
  @Input('extraProperty') extraProperty = {
    alwaysAllow: 'Always Allow',
    privacyInfo: 'Privacy Info'
  };
  @Input('popUpTitleLang') PopUpTitleLang = {
    purpose: 'Purpose',
    privacyInfo: 'Privacy Info',
    vendors: 'Vendors'
  };
  @Input('formData') formData: FormDefaultData = new FormDefaultData();

  constructor(private _cd: ChangeDetectorRef) {
  }
  ngOnInit() {
    this.currentPurpose = this.defaultContent.EssentialTitle ;
  }
  ngOnChanges(changes: SimpleChanges) {
    this._cd.detectChanges()

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
    if (e) {
      this.checkedPurposeIds.push(name);
  } else {
        const index = this.checkedPurposeIds.indexOf(name);
        if (index > -1) {
            this.checkedPurposeIds.splice(index, 1);
        }
    }
  }

  onChangeDet() {
    this._cd.detectChanges()
  }
}
