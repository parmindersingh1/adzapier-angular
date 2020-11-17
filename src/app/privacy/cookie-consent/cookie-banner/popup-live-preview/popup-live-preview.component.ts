import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {defaultBannerContent, FormDefaultData} from '../../../../_constant/consent-banner.constant';

@Component({
  selector: 'app-popup-live-preview',
  templateUrl: './popup-live-preview.component.html',
  styleUrls: ['./popup-live-preview.component.scss']
})
export class PopupLivePreviewComponent implements OnInit, OnChanges {
  public defaultContent = defaultBannerContent;
  currentPurpose = '';
  @Input('formData') formData: FormDefaultData = new FormDefaultData();
  constructor() {
    console.log('ffffff', this.formData)
  }
  ngOnInit() {
    this.currentPurpose = this.defaultContent.NecessaryText ;
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('change', changes)
    console.log('change123231', this.formData)
  }

  onSelectPurpose(val: string) {
    this.currentPurpose = val;
  }
}
