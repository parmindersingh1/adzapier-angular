import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {defaultBannerContent, FormDefaultData, iabPurposeList} from '../../../../_constant/consent-banner.constant';
import {ChangeDetection} from '@angular/cli/lib/config/schema';

@Component({
  selector: 'app-popup-live-preview',
  templateUrl: './popup-live-preview.component.html',
  styleUrls: ['./popup-live-preview.component.scss']
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
  @Input('popUpTitleLang') popUpTitleLang = {
    purpose: 'Purpose',
    privacyInfo: 'Privacy Info',
    vendors: 'Vendors'
  };
  @Input('formData') formData: FormDefaultData = new FormDefaultData();

  constructor(private _cd: ChangeDetectorRef) {
  }
  ngOnInit() {
    this.currentPurpose = this.defaultContent.NecessaryText ;
  }
  ngOnChanges(changes: SimpleChanges) {
console.log('Change', this.popUpTitleLang)
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

  onChangeDet() {
    this._cd.detectChanges()
  }
}
