import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {
  CcpaCounties,
  DarkTheme, DefaultRegulation,
  DisplayFrequency,
  GdprCountries,
  LanguageList,
  LightTheme
} from './bannerConfigDefaultValue.constant';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {CookieBannerService} from '../../../_services/cookie-banner.service';

interface Country {
  name: string,
  code: string
}

@Component({
  selector: 'app-banner-config',
  templateUrl: './banner-config.component.html',
  styleUrls: ['./banner-config.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BannerConfigComponent implements OnInit, OnDestroy {
  step = 1;
  selectedCountry: any;
  countries: any[] = CcpaCounties;
  selectedCountries1: Country[];
  gdprCountries: Country[] = GdprCountries;
  showDropDownValue = 'cookieNotice';
  url: SafeResourceUrl = '';
  BannerConfigurationForm!: FormGroup;
  themeType = 'light';
  languages = LanguageList;
  selectedLanguage = ['en-US'];
  currentBannerLayer = 'banner';
  purposesList = [];
  showCustomColor = false;
  displayFrequency = DisplayFrequency;
  defaultRegulation = DefaultRegulation;
  allowedLanguage = [];
  constructor(private sanitizer: DomSanitizer,
              private formBuilder: FormBuilder,
              private loading: NgxUiLoaderService,
              private cookieBannerService: CookieBannerService
  ) {
    const element = document.getElementById('main');
    element.classList.remove('container');
    element.classList.remove('site-content');
    element.classList.add('container-fluid');
    element.style.padding = '0px';
    element.style.margin = '0px';
  }

  ngOnInit() {
    this.onInitForm();
    this.onGetGlobleLangData('en-US');
    this.onSetDefaultStyle(LightTheme);
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://phonetechtalk.com');
  }

  ngOnDestroy() {
    const element = document.getElementById('main');
    element.classList.remove('container-fluid');
    element.style.padding = null;
    element.style.margin = null;
    element.classList.add('container');
    element.classList.add('site-content');
  }
  initPurpose(){
    return this.formBuilder.group({
      title: [''],
      description: [''],
      id: ['']
    });
  }
  addPurpose(data){
    return this.formBuilder.group(data);
  }
  onInitForm() {
    this.BannerConfigurationForm = this.formBuilder.group({
      // Config
      AllowGDPR: [true],
      AllowCCPA: [true],
      AllowGENERIC: [true],
      GdprCountries: [],
      EnableIAB: [false],
      GoogleVendors: [false],
      GdprGlobal: [false],
      CCPATarget: [],
      CCPAGlobal: [false],
      GenericGlobal: [false],
      // Advance Config
      DefaultRegulation: ['generic'],
      CookieBlocking: [false],
      AllowPurposeByDefault: [true],
      ShowWatermark: [true],
      ShowBadge: [true],
      MuteBanner: [false],
      // Language
      DefaultLanguage: ['en-US'],
      // Banner Content
      BannerTitle: [''],
      BannerDescription: [''],
      BannerGDPRDescription2: [''],
      BannerPrivacyText: [''],
      BannerPrivacyLink: [''],
      BannerAcceptAllText: [''],
      BannerPreferenceText: [''],
      BannerDisableAllText: [''],
      BannerDoNotSellText: [''],
      // Preference Content
      PreferencePurposeGdprDescriptionText: [''],
      PreferenceVendorGdprDescriptionText: [''],
      PreferencePurposeCcpaAndGenericDescriptionText: [''],
      PreferencePrivacyCcpaAndGenericDescriptionText: [''],
      PreferenceAcceptAllText: [''],
      PreferenceSaveMyChoiceText: [''],
      PreferenceDisableAllText: [''],
      PreferenceDoNotSellMyDataText: [''],
      // Banner Color
      BannerCookieNoticeBackgroundColor: [''],
      BannerCookieNoticeTextColor: [''],
      BannerCookieNoticeBorderColor: [''],
      BannerAcceptAllBackgroundColor: [''],
      BannerAcceptAllTextColor: [''],
      BannerPreferenceBackgroundColor: [''],
      BannerPreferenceTextColor: [''],
      BannerDisableAllBackgroundColor: [''],
      BannerDisableAllTextColor: [''],
      BannerDoNotSellMyDataBackgroundColor: [''],
      BannerDoNotSellMyDataTextColor: [''],
      // Preference Colors
      PreferenceBackgroundColor: [''],
      PreferenceTextColor: [''],
      PreferencePurposeBackgroundColor: [''],
      PreferencePurposeTextColor: [''],
      PreferenceSwitchColor: [''],
      PreferenceAcceptAllBackgroundColor: [''],
      PreferenceAcceptAllTextColor: [''],
      PreferenceSaveMyChoiceBackgroundColor: [''],
      PreferenceSaveMyChoiceTextColor: [''],
      PreferenceDisableAllBackgroundColor: [''],
      PreferenceDisableAllTextColor: [''],
      PreferenceDoNotSellBackgroundColor: [''],
      PreferenceDoNotSellTextColor: [''],
      // Purpose
      PurposeList: this.formBuilder.array([]),
      // Display Frequency
      DisplayPartialConsent: [24],
      DisplayPartialConsentType: ['hours'],
      DisplayRejectAllConsent: [2],
      DisplayRejectAllConsentType: ['days'],
      DisplayClosedConsent: [10],
      DisplayClosedConsentType: ['pageViews'],
      // Other Ignore Feilds
      LivePreviewType: ['gdpr'],
      PreviewLanguage: ['']
    });
  }

  onGetGlobleLangData(langCode) {
    this.loading.start();
    this.cookieBannerService.GetGlobleLangData(langCode).subscribe(res => {
      this.loading.stopAll();
      // this.languageData = res;
      this.BannerConfigurationForm.markAsPristine();
      this.onSetDefaultContent(res);
    }, error => {
      this.loading.stopAll();
      alert('Error ::: Unable to Load Language');
    });
  }

  onSetDefaultContent(langData) {
    const LANG_CONFIG = langData;
    this.BannerConfigurationForm.patchValue({
      // Banner
      BannerTitle: LANG_CONFIG.CONFIG.BANNER.TITLE,
      BannerDescription: LANG_CONFIG.CONFIG.BANNER.DESCRIPTION,
      BannerGDPRDescription2: LANG_CONFIG.CONFIG.BANNER.GDPR_PRIVACY_DESC,
      BannerPrivacyText: LANG_CONFIG.CONFIG.BANNER.PRIVACY,
      BannerPrivacyLink: [''],
      BannerAcceptAllText: LANG_CONFIG.CONFIG.BANNER.ACCEPT_ALL_BTN,
      BannerPreferenceText: LANG_CONFIG.CONFIG.BANNER.PRIVACY_SETTINGS_BTN,
      BannerDisableAllText: LANG_CONFIG.CONFIG.BANNER.DISABLE_ALL_BTN,
      BannerDoNotSellText: LANG_CONFIG.CONFIG.BANNER.DO_NOT_SELL_BTN,
      // Preference Content
      PreferencePurposeGdprDescriptionText: LANG_CONFIG.CONFIG.POPUP.GDPR_PURPOSES_DESC,
      PreferenceVendorGdprDescriptionText: LANG_CONFIG.CONFIG.POPUP.GDPR_VENDORS_DESC,
      PreferencePurposeCcpaAndGenericDescriptionText: LANG_CONFIG.CONFIG.POPUP.CCPA_AND_GENERIC_PURPOSES_DESC,
      PreferencePrivacyCcpaAndGenericDescriptionText: LANG_CONFIG.CONFIG.POPUP.CCPA_AND_GENERIC_PRIVACY_INFO_DESCRIPTION,
      PreferenceAcceptAllText: LANG_CONFIG.CONFIG.POPUP.ACCEPT_ALL_BTN,
      PreferenceSaveMyChoiceText: LANG_CONFIG.CONFIG.POPUP.SAVE_MY_CHOICE_BTN,
      PreferenceDisableAllText: LANG_CONFIG.CONFIG.POPUP.DISABLE_ALL_BTN,
      PreferenceDoNotSellMyDataText: LANG_CONFIG.CONFIG.POPUP.DO_NOT_SELL_BTN,

      DisplayPartialConsentType: 'hours',
      DisplayRejectAllConsentType: 'days',
      DisplayClosedConsentType: 'pageViews',
    });
    this.purposesList = LANG_CONFIG.PURPOSES;
    if (this.BannerConfigurationForm.value.PurposeList.length === 0) {
      for (const data of this.purposesList) {
        this.addPurposeRows.push(this.addPurpose(data));
      }
    } else {
      this.BannerConfigurationForm.patchValue({
        PurposeList: this.purposesList
      });
    }
  }
  get addPurposeRows(){
    return this.BannerConfigurationForm.get('PurposeList') as FormArray;
  }


  onSetLanguage(e, langCode) {
    const isChecked = e.target.checked;
    const selectedLanguage = [...this.selectedLanguage];
    if (isChecked) {
      selectedLanguage.push(langCode);
    } else {
      const index = this.selectedLanguage.indexOf(langCode);
      if (index > -1) {
        selectedLanguage.splice(index, 1);
      }
    }
    this.selectedLanguage = selectedLanguage;
    console.log('selectedLanguage', this.selectedLanguage)
  }

  onSelectStep(step) {
    this.step = step;
  }

  onOpenDropDown(step) {
    this.showDropDownValue = this.showDropDownValue === step ? '' : step;
  }

  onSelectThemeType(type) {
    this.themeType = type;
    if (type === 'dark') {
      this.onSetDefaultStyle(DarkTheme);
    } else if (type === 'light') {
      this.onSetDefaultStyle(LightTheme);
    }
    if (type === 'custom') {
      this.showCustomColor = true;
    } else {
      this.showCustomColor = false;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    let purposeList = this.BannerConfigurationForm.value.PurposeList;
    moveItemInArray(purposeList, event.previousIndex, event.currentIndex);
    this.purposesList = purposeList;
    this.BannerConfigurationForm.patchValue({
      PurposeList: purposeList
    });
  }

  onSubmit() {
    console.log('formData', this.BannerConfigurationForm.value)
    // this.submitted = true;
    //
    // // reset alerts on submit
    // this.alertService.clear();
    //
    // // stop here if form is invalid
    // if (this.form.invalid) {
    //   return;
    // }
    //
    // this.loading = true;
    // if (this.isAddMode) {
    //   this.createUser();
    // } else {
    //   this.updateUser();
    // }
  }

  onChangeBannerLayer(e) {
    this.currentBannerLayer = e;
  }

  onSetDefaultStyle(theme) {
    const ThemeColor = theme;
    this.BannerConfigurationForm.patchValue({
      // Banner Color
      BannerCookieNoticeBackgroundColor: ThemeColor.BannerCookieNoticeBackgroundColor,
      BannerCookieNoticeTextColor: ThemeColor.BannerCookieNoticeTextColor,
      BannerCookieNoticeBorderColor: ThemeColor.BannerCookieNoticeBorderColor,
      BannerAcceptAllBackgroundColor: ThemeColor.BannerAcceptAllBackgroundColor,
      BannerAcceptAllTextColor: ThemeColor.BannerAcceptAllText,
      BannerPreferenceBackgroundColor: ThemeColor.BannerPreferenceBackgroundColor,
      BannerPreferenceTextColor: ThemeColor.BannerPreferenceTextColor,
      BannerDisableAllBackgroundColor: ThemeColor.BannerDisableAllBackgroundColor,
      BannerDisableAllTextColor: ThemeColor.BannerDisableAllTextColor,
      BannerDoNotSellMyDataBackgroundColor: ThemeColor.BannerDoNotSellMyDataBackgroundColor,
      BannerDoNotSellMyDataTextColor: ThemeColor.BannerDoNotSellMyDataTextColor,
      // Preference Colors
      PreferenceBackgroundColor: ThemeColor.PreferenceBackgroundColor,
      PreferenceTextColor: ThemeColor.PreferenceTextColor,
      PreferencePurposeBackgroundColor: ThemeColor.PreferencePurposeBackgroundColor,
      PreferencePurposeTextColor: ThemeColor.PreferencePurposeTextColor,
      PreferenceSwitchColor: ThemeColor.PreferenceSwitchColor,
      PreferenceAcceptAllBackgroundColor: ThemeColor.PreferenceAcceptAllBackgroundColor,
      PreferenceAcceptAllTextColor: ThemeColor.PreferenceAcceptAllTextColor,
      PreferenceSaveMyChoiceBackgroundColor: ThemeColor.PreferenceSaveMyChoiceBackgroundColor,
      PreferenceSaveMyChoiceTextColor: ThemeColor.PreferenceSaveMyChoiceTextColor,
      PreferenceDisableAllBackgroundColor: ThemeColor.PreferenceDisableAllBackgroundColor,
      PreferenceDisableAllTextColor: ThemeColor.PreferenceDisableAllTextColor,
      PreferenceDoNotSellBackgroundColor: ThemeColor.PreferenceDoNotSellBackgroundColor,
      PreferenceDoNotSellTextColor: ThemeColor.PreferenceDoNotSellTextColor
    });
  }
  onChangeBannerType(type){

  }
  onSelectPreviewLang() {
      const langCode = this.BannerConfigurationForm.value.PreviewLanguage.code;
      this.onGetGlobleLangData(langCode);
  }
}
