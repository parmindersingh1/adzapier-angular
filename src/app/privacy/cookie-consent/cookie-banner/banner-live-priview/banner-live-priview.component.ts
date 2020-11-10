import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormDefaultData} from '../../../../_constant/consent-banner.constant';

@Component({
  selector: 'app-banner-live-priview',
  templateUrl: './banner-live-priview.component.html',
  styleUrls: ['./banner-live-priview.component.scss']
})
export class BannerLivePriviewComponent implements OnInit, OnChanges {
  public defaultContent = new FormDefaultData();
@Input('formData') formData: FormDefaultData = new FormDefaultData();
  constructor() { }

  ngOnInit() {
    console.log('defaultContent', this.formData);
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes)
  }

}
