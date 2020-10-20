import {Component, Input, OnInit} from '@angular/core';
import {FormDefaultData} from '../../../../_constant/gdpr-ccpa-banner.constant';

@Component({
  selector: 'app-banner-live-priview',
  templateUrl: './banner-live-priview.component.html',
  styleUrls: ['./banner-live-priview.component.scss']
})
export class BannerLivePriviewComponent implements OnInit {
  public defaultContent = new FormDefaultData();
@Input('formData') formData: FormDefaultData = new FormDefaultData();
  constructor() { }

  ngOnInit() {
    console.log('defaultContent', this.defaultContent);
  }

}
