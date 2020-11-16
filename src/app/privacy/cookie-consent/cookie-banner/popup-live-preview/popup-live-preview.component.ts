import {Component, ElementRef, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormDefaultData} from '../../../../_constant/consent-banner.constant';

@Component({
  selector: 'app-popup-live-preview',
  templateUrl: './popup-live-preview.component.html',
  styleUrls: ['./popup-live-preview.component.scss']
})
export class PopupLivePreviewComponent implements OnInit {
  public defaultContent = new FormDefaultData();
  currentPurpose = '';
  @Input('formData') formData: FormDefaultData = new FormDefaultData();
  ngOnInit() {
    this.currentPurpose = this.formData.AdvertisingText;
  }

  onSelectPurpose(val: string) {
    this.currentPurpose = val;
  }
}
