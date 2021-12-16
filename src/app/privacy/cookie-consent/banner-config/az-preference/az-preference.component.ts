import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {GdprService} from '../../../../_services/gdpr.service';

@Component({
  selector: 'app-az-preference',
  templateUrl: './az-preference.component.html',
  styleUrls: ['./az-preference.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AzPreferenceComponent implements OnInit, OnChanges {
  @Input('formData') formData;
  @Input('purposesList') purposesList;
  @Input('customerBrandLogo') customerBrandLogo;
  showPreferenceType = 'ccpa';
  currentPurposeID = 0;
  gdprPurposeList = [];
  iabVendorsList = [];
  preferenceStep = 1;
  switchButton = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
   privacyContent = [
    {title: 'Why do you need my consent?', desc: 'What are cookies used? Whit this information is created a user profile based on this and other Data. It is anonymous and only linked to a device or in in combination with your browser.'},
    {title: 'What about cookies?', desc: 'How they work\n' +
        '                    By placing cookies in your device provide insight into a number of technical data when you visit our website (e.g your IP address, your operating system , the browser you use, the internet page you visit our website)'},
    {title: 'Audit ID',
      desc: 'Audit Id is a random unique number that is generated for you when you visit this website. The purpose of the Audit ID is to keep a record of your consent history on which cookies you accepted and when. The information kept in relation to your Audit ID includes, timestamp, version of cookie vendor list and a list of vendors that are allowed to process your data.'}
  ];
  constructor(private gdprService: GdprService,
              private cd: ChangeDetectorRef
              ) {
  }

  async ngOnInit() {
    await this.getGdprPurposes();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.purposesList = this.formData.PurposeList;
    this.cd.detectChanges();
  }

  onShowDesc(id) {
    this.currentPurposeID = this.currentPurposeID === id ? 0 : id;
  }

  async getGdprPurposes() {
    const allGdprContent = await this.gdprService.getAllData();
    this.gdprPurposeList = Object.values(allGdprContent.purposes);
    this.iabVendorsList = Object.values(allGdprContent.vendors).slice(0, 20);
  }

  onSelectSwitch(index, e) {
    const isChecked = e.target.checked;
    const switchButton = [...this.switchButton];
    if (isChecked) {
      switchButton.push(index);
    } else {
      const i = switchButton.indexOf(index);
      if (i > -1) {
        switchButton.splice(i, 1);
      }
    }
    this.switchButton = switchButton;
  }
}
