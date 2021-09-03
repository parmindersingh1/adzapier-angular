import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  CcpaCounties,
  DarkTheme,
  DefaultRegulation,
  DisplayFrequency,
  GdprCountries,
  LanguageList,
  LightTheme
} from './bannerConfigDefaultValue.constant';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {CookieBannerService} from '../../../_services/cookie-banner.service';
import {moduleName} from '../../../_constant/module-name.constant';
import {OrganizationService} from '../../../_services';
import {debounceTime, map} from 'rxjs/operators';
import {main} from '@angular/compiler-cli/src/main';
import {ActivatedRoute, Router} from '@angular/router';
import {featuresName} from '../../../_constant/features-name.constant';
import {DataService} from '../../../_services/data.service';

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

export class BannerConfigComponent implements OnInit, OnDestroy, AfterViewInit {
  private currentManagedOrgID: any;
  private currrentManagedPropID: any;
  step = 1;
  submitted = false;
  languageContents: any;
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
  dismissible = true;
  alertMsg: any;
  isEdit = false;
  isOpen = false;
  alertType: any;
  publishType = 'draft';
  isFormUpdate = false;
  contentSaving = '';
  customLang = [];
  allowedLanguagesForPreview = [  {
    title: 'English (United States)',
    code: 'en-US',
    countryFlag: 'us',
  }];
  platformType = 'web';
  publishing = false;
  planDetails: any;
  disablePlanFeatures = {
    hideLogo: false,
    disableGoogleVendors: false,
    disableCookieblocking: false,
    disableBannerConfig: false
  };
  constructor(private sanitizer: DomSanitizer,
              private formBuilder: FormBuilder,
              private loading: NgxUiLoaderService,
              private cookieBannerService: CookieBannerService,
              private orgservice: OrganizationService,
              private  router: Router,
              private activatedRouter: ActivatedRoute,
              private dataService: DataService,
              private cd: ChangeDetectorRef
  ) {
    const element = document.getElementById('main');
    element.classList.remove('container');
    element.classList.remove('site-content');
    element.classList.add('container-fluid');
    element.style.padding = '0px';
    element.style.margin = '0px';
  }

  ngOnInit() {
    this.onGetPropsAndOrgId();
    this.onInitForm();
    this.onLoadContent('en-US');
    this.onSetDefaultStyle(LightTheme);
    this.onGetSavedBannerConfig();
    this.BannerConfigurationForm.valueChanges
      .pipe(
        map((i: any) => i),
        debounceTime(2000)
      ).subscribe(res => {
      if (this.checkFormDirty()) {
        this.onSaveCustomLangOnDB();
        this.onPublishLangOnS3();
      }
    });
  }
  ngAfterViewInit() {
    this.planDetails = this.dataService.getCurrentPropertyPlanDetails();
    // debugger
    const isAllowLogo = this.dataService.isAllowFeatureByYes(this.planDetails.response, featuresName.REMOVE_ADZAPIER_LOGO);
    const isAllowGoogleVendors = this.dataService.isAllowFeatureByYes(this.planDetails.response, featuresName.GOOGLE_VENDORS);
    const isThridPartyBlock = this.dataService.isAllowFeatureByYes(this.planDetails.response, featuresName.THIRD_PARTY_COOKIE_BLOCKING);
    const isBannerConfig = this.dataService.isAllowFeatureByYes(this.planDetails.response, featuresName.HIGHLY_BANNER_CONFIG);
    this.disablePlanFeatures = {
      hideLogo: !isAllowLogo,
      disableGoogleVendors: !isAllowGoogleVendors,
      disableCookieblocking: !isThridPartyBlock,
      disableBannerConfig: !isBannerConfig
    };
    this.cd.detectChanges();
  }
  onCheckLogoAllow() {
    if (this.disablePlanFeatures.hideLogo) {
      this.dataService.openSubcriptionModalForRestrication(this.planDetails);
    }
  }

  onCheckAllowGoogleVendors() {
    if (this.disablePlanFeatures.disableGoogleVendors) {
      this.dataService.openSubcriptionModalForRestrication(this.planDetails);
      return false;
    }
    return true;
  }

  onCheckDisableCookiebloking() {
    if (this.disablePlanFeatures.disableCookieblocking) {
      this.dataService.openSubcriptionModalForRestrication(this.planDetails);
    }
  }

  onCheckAllowBannerConfig(step) {
    if (this.disablePlanFeatures.disableBannerConfig) {
      this.dataService.openSubcriptionModalForRestrication(this.planDetails);
    } else {
      this.onSelectStep(step);
    }
  }


  checkFormDirty() {
    return this.BannerConfigurationForm.controls.BannerTitle.dirty ||
      this.BannerConfigurationForm.controls.BannerDescription.dirty ||
      this.BannerConfigurationForm.controls.BannerPrivacyText.dirty ||
      this.BannerConfigurationForm.controls.BannerPrivacyLink.dirty ||
      this.BannerConfigurationForm.controls.BannerAcceptAllText.dirty ||
      this.BannerConfigurationForm.controls.BannerPreferenceText.dirty ||
      this.BannerConfigurationForm.controls.BannerDisableAllText.dirty ||
      this.BannerConfigurationForm.controls.BannerDoNotSellText.dirty ||
      this.BannerConfigurationForm.controls.PreferencePurposeGdprDescriptionText.dirty ||
      this.BannerConfigurationForm.controls.PreferenceVendorGdprDescriptionText.dirty ||
      this.BannerConfigurationForm.controls.PreferencePurposeCcpaAndGenericDescriptionText.dirty ||
      this.BannerConfigurationForm.controls.PreferencePrivacyCcpaAndGenericDescriptionText.dirty ||
      this.BannerConfigurationForm.controls.PreferenceAcceptAllText.dirty ||
      this.BannerConfigurationForm.controls.PreferenceSaveMyChoiceText.dirty ||
      this.BannerConfigurationForm.controls.PreferenceDisableAllText.dirty ||
      this.BannerConfigurationForm.controls.PreferenceDoNotSellMyDataText.dirty ||
      this.BannerConfigurationForm.controls.PurposeList.dirty;
  }

  ngOnDestroy() {
    const element = document.getElementById('main');
    element.classList.remove('container-fluid');
    element.style.padding = null;
    element.style.margin = null;
    element.classList.add('container');
    element.classList.add('site-content');
  }

  onGetPropsAndOrgId() {
    // this.orgservice.currentProperty.subscribe((response) => {
    //   if (response !== '') {
    //     this.currentManagedOrgID = response.organization_id;
    //     this.currrentManagedPropID = response.property_id;
    //   } else {
    //     const orgDetails = this.orgservice.getCurrentOrgWithProperty();
    //     this.currentManagedOrgID = orgDetails.organization_id;
    //     this.currrentManagedPropID = orgDetails.property_id;
    //   }
    // });
    this.activatedRouter.queryParams.subscribe(params => {
      this.currentManagedOrgID = params.oid;
      this.currrentManagedPropID = params.pid;
    });
  }

  onGetSavedBannerConfig() {
    this.loading.start('3');
    this.cookieBannerService.onGetCookieBannerData(this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name, moduleName.cookieBannerModule)
      .subscribe((res: any) => {
        this.loading.stop('3');
        if (res.status === 200 && res.hasOwnProperty('response')) {
          this.isFormUpdate = true;
          this.onSetSavedGeneralConfig(res.response);
          this.onSetSavedStyle(res.response.config);
        }
      }, error => {
        this.loading.stop('3');
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
      });
  }


  initPurpose() {
    return this.formBuilder.group({
      title: [''],
      description: [''],
      id: ['']
    });
  }
  onResetLang(lang) {
    this.onGetGlobleLangData(lang);
    const index = this.customLang.indexOf(lang);
    if (index > -1) {
      this.customLang.splice(index, 1);
    }
  }
  addPurpose(data) {
    return this.formBuilder.group(data);
  }

  onInitForm() {
    const gdprCountries = [];
    for (const gdprCountry of GdprCountries) {
      gdprCountries.push(gdprCountry.code);
    }
    this.BannerConfigurationForm = this.formBuilder.group({
      // Config
      AllowGDPR: [true],
      AllowCCPA: [true],
      AllowGENERIC: [true],
      GdprCountries: [gdprCountries, Validators.required],
      EnableIAB: [false],
      GoogleVendors: [false],
      GdprGlobal: [false],
      CCPATarget: [CcpaCounties[0].code, Validators.required],
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
      PreviewLanguage: [  {
        title: 'English (United States)',
        code: 'en-US',
        countryFlag: 'us',
      }]
    });
  }
  get f() { return this.BannerConfigurationForm.controls; }

  onLoadContent(langCode) {
    if (this.customLang.includes(langCode)) {
      this.onGetCustomLangData(langCode);
    } else {
      this.onGetGlobleLangData(langCode);
    }
  }

  onGetGlobleLangData(langCode) {
    this.loading.start();
    this.cookieBannerService.GetGlobleLangData(langCode).subscribe(res => {
      this.loading.stopAll();
      this.languageContents = res;
      this.BannerConfigurationForm.markAsPristine();
      this.onSetDefaultContent(res);
    }, error => {
      this.loading.stopAll();
      alert('Error ::: Unable to Load Language');
    });
  }

  onGetCustomLangData(langCode) {
    this.loading.start('lang');
    this.cookieBannerService.GetCustomLangData( this.constructor.name, moduleName.cookieBannerModule, langCode, this.currentManagedOrgID, this.currrentManagedPropID)
      .subscribe((res: any) => {
        this.loading.stop('lang');
        if (res.status === 200 ) {
          const langData = JSON.parse(res.response.lang_data);
          this.languageContents = res;
          this.onSetDefaultContent(langData);
          this.BannerConfigurationForm.markAsPristine();
        }
      }, error => {
        this.loading.stop('lang');
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

  get addPurposeRows() {
    return this.BannerConfigurationForm.get('PurposeList') as FormArray;
  }


  onSetLanguage(e, langCode) {
    const isChecked = e.target.checked;
    const selectedLanguage = [...this.selectedLanguage];
    const allowedLangForPreview = [...this.allowedLanguagesForPreview];
    if (isChecked) {
      selectedLanguage.push(langCode);
      allowedLangForPreview.push(this.onFindLangByCode(langCode));
    } else {
      const index = this.selectedLanguage.indexOf(langCode);
      if (index > -1) {
        selectedLanguage.splice(index, 1);
      }
      const index1 = this.allowedLanguagesForPreview.indexOf(this.onFindLangByCode(langCode));
      if (index1 > -1) {
        allowedLangForPreview.splice(index, 1);
      }
    }
    this.selectedLanguage = selectedLanguage;
    this.allowedLanguagesForPreview = allowedLangForPreview;
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

  onChangeBannerLayer(e) {
    this.currentBannerLayer = e;
  }

  onSetSavedGeneralConfig(mainConfig) {
    const CONFIG = mainConfig.config;
    this.BannerConfigurationForm.patchValue({
      AllowGDPR: CONFIG.AllowedBanners.gdpr,
      AllowCCPA: CONFIG.AllowedBanners.ccpa,
      AllowGENERIC: CONFIG.AllowedBanners.generic,
      GdprCountries: mainConfig.gdpr_target,
      EnableIAB: mainConfig.enable_iab,
      GoogleVendors: mainConfig.google_vendors,
      GdprGlobal: mainConfig.gdpr_global == 'true' ? true : false,
      CCPATarget: mainConfig.ccpa_target,
      CCPAGlobal: mainConfig.ccpa_global,
      GenericGlobal: mainConfig.generic_global,
      // Advance Config
      DefaultRegulation: mainConfig.default_regulation,
      CookieBlocking: mainConfig.cookie_blocking,
      AllowPurposeByDefault: mainConfig.purposes_by_default,
      ShowWatermark: mainConfig.logo,
      ShowBadge: mainConfig.show_badge,
      MuteBanner: CONFIG.MuteBanner,
      // Language
      DefaultLanguage: CONFIG.LanguageConfig.defaultLang,
    });
    this.customLang = CONFIG.LanguageConfig.customLang;
    this.selectedLanguage = CONFIG.LanguageConfig.allowedLang;

    this.allowedLanguagesForPreview = [];
    for (const langCode of CONFIG.LanguageConfig.allowedLang) {
        this.allowedLanguagesForPreview.push(this.onFindLangByCode(langCode));
    }
    this.onLoadContent('en-US');
  }
  onGetGdprCountriesByCode(langCodes) {
   const langData = [];
   for (const lang of GdprCountries) {
     if (langCodes.includes(lang.code)) {
       langData.push(lang);
     }
   }
   return langData;
  }

  onGetCcpaCountryByCode(langCode) {
    let langData = {name: 'United States', code: 'US'};
    for (const lang of CcpaCounties) {
      if (langCode === lang.code) {
        langData = lang;
      }
    }
    return langData;
  }

  onSetSavedStyle(config) {
    this.BannerConfigurationForm.patchValue({
      // Banner Color
      BannerCookieNoticeBackgroundColor: config.Banner.GlobalStyles.background,
      BannerCookieNoticeTextColor: config.Banner.GlobalStyles.textColor,
      BannerCookieNoticeBorderColor: config.Banner.GlobalStyles.borderColor,
      BannerAcceptAllBackgroundColor: config.Banner.AllowAllButtonStylesAndContent.background,
      BannerAcceptAllTextColor: config.Banner.AllowAllButtonStylesAndContent.textColor,
      BannerPreferenceBackgroundColor: config.Banner.PreferenceButtonStylesAndContent.background,
      BannerPreferenceTextColor: config.Banner.PreferenceButtonStylesAndContent.textColor,
      BannerDisableAllBackgroundColor: config.Banner.DisableAllButtonStylesAndContent.background,
      BannerDisableAllTextColor: config.Banner.DisableAllButtonStylesAndContent.textColor,
      BannerDoNotSellMyDataBackgroundColor: config.Banner.DoNotSellButtonStylesAndContent.background,
      BannerDoNotSellMyDataTextColor: config.Banner.DoNotSellButtonStylesAndContent.textColor,
      // Preference Colors
      PreferenceBackgroundColor: config.POPUP.GlobalStyles.background,
      PreferenceTextColor: config.POPUP.GlobalStyles.textColor,
      PreferencePurposeBackgroundColor: config.POPUP.PurposeButton.background,
      PreferencePurposeTextColor: config.POPUP.PurposeButton.textColor,
      PreferenceSwitchColor: config.POPUP.SwitchButton.background,
      PreferenceAcceptAllBackgroundColor: config.POPUP.AllowAllButton.background,
      PreferenceAcceptAllTextColor: config.POPUP.AllowAllButton.textColor,
      PreferenceSaveMyChoiceBackgroundColor: config.POPUP.SaveMyChoiseButton.background,
      PreferenceSaveMyChoiceTextColor: config.POPUP.SaveMyChoiseButton.textColor,
      PreferenceDisableAllBackgroundColor: config.POPUP.DisableAllButton.background,
      PreferenceDisableAllTextColor: config.POPUP.DisableAllButton.textColor,
      PreferenceDoNotSellBackgroundColor: config.POPUP.DoNotSellButtonStylesAndContent.background,
      PreferenceDoNotSellTextColor: config.POPUP.DoNotSellButtonStylesAndContent.textColor
    });
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

  onChangeBannerType(type) {

  }

  onSelectPreviewLang() {
    const langCode = this.BannerConfigurationForm.value.PreviewLanguage.code;
    this.onLoadContent(langCode);
  }


  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.BannerConfigurationForm.invalid) {
      return;
    }

    if (this.isFormUpdate) {
      this.onUpdateForm();
    } else {
      this.onCreateForm();
    }
  }

  onCreateForm() {
    const payload = {
      ccpa_target: this.BannerConfigurationForm.value.CCPATarget,
      type: this.publishType,
      logo: this.BannerConfigurationForm.value.ShowWatermark,
      gdpr_global: this.BannerConfigurationForm.value.GdprGlobal,
      ccpa_global: this.BannerConfigurationForm.value.CCPAGlobal,
      generic_global: this.BannerConfigurationForm.value.GenericGlobal,
      default_regulation: this.BannerConfigurationForm.value.DefaultRegulation,
      purposes_by_default: this.BannerConfigurationForm.value.AllowPurposeByDefault,
      gdpr_target: this.BannerConfigurationForm.value.GdprCountries,
      iab_vendors_ids: '',
      google_vendors_ids: '',
      cookie_blocking: this.BannerConfigurationForm.value.CookieBlocking,
      enable_iab: this.BannerConfigurationForm.value.EnableIAB,
      email: false,
      google_vendors: this.BannerConfigurationForm.value.GoogleVendors,
      show_badge: this.BannerConfigurationForm.value.ShowBadge,
      CONFIG: this.onGetBannerConfig()
    };
    if (this.publishType === 'draft') {
      this.loading.start();
    } else {
      this.publishing = true;
    }
    this.cookieBannerService.onSubmitCookieBannerData(payload, this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name, moduleName.cookieBannerModule)
      .subscribe((res: any) => {
        this.BannerConfigurationForm.markAsPristine();
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = res.response;
        this.alertType = 'success';
        this.publishing = false;
        this.router.navigate(['/cookie-consent/cookie-banner/setup'],
          {queryParams: {oid: this.currentManagedOrgID, pid: this.currrentManagedPropID}});
      }, error => {
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
        this.loading.stop();
        this.publishing = false;
      });
  }

  onUpdateForm() {
    const payload = {
      ccpa_target: this.BannerConfigurationForm.value.CCPATarget,
      type: this.publishType,
      logo: this.BannerConfigurationForm.value.ShowWatermark,
      gdpr_global: Boolean(this.BannerConfigurationForm.value.GdprGlobal),
      ccpa_global: this.BannerConfigurationForm.value.CCPAGlobal,
      generic_global: this.BannerConfigurationForm.value.GenericGlobal,
      default_regulation: this.BannerConfigurationForm.value.DefaultRegulation,
      purposes_by_default: this.BannerConfigurationForm.value.AllowPurposeByDefault,
      gdpr_target: this.BannerConfigurationForm.value.GdprCountries,
      iab_vendors_ids: '',
      google_vendors_ids: '',
      cookie_blocking: this.BannerConfigurationForm.value.CookieBlocking,
      enable_iab: this.BannerConfigurationForm.value.EnableIAB,
      email: false,
      google_vendors: this.BannerConfigurationForm.value.GoogleVendors,
      show_badge: this.BannerConfigurationForm.value.ShowBadge,
      CONFIG: this.onGetBannerConfig()
    };

    if (this.publishType === 'draft') {
      this.loading.start();
    } else {
      this.publishing = true;
    }
    this.cookieBannerService.onUpdateCookieBannerData(payload, this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name, moduleName.cookieBannerModule)
      .subscribe((res: any) => {
        this.BannerConfigurationForm.markAsPristine();
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = res.response;
        this.alertType = 'success';
        this.publishing = false;
        this.router.navigate(['/cookie-consent/cookie-banner/setup'],
          {queryParams: {oid: this.currentManagedOrgID, pid: this.currrentManagedPropID}});
        }, error => {
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
        this.loading.stop();
        this.publishing = false;
      });
  }

  onRefectorGdprTarget(){
   const gdprTargetData = this.BannerConfigurationForm.value.GdprCountries;
   const gdprTargetCode = [];
   for(const gdprCountry of gdprTargetData) {
     gdprTargetCode.push(gdprCountry.code);
   }
   return gdprTargetCode;
  }



  onGetBannerConfig() {
    return {
      LanguageConfig: {
        allowedLang: this.selectedLanguage,
        defaultLang: this.BannerConfigurationForm.value.DefaultLanguage,
        customLang: this.customLang,
      },
      AllowedBanners: {
        ccpa: this.BannerConfigurationForm.value.AllowCCPA,
        gdpr: this.BannerConfigurationForm.value.AllowGDPR,
        generic: this.BannerConfigurationForm.value.AllowGENERIC
      },
      MuteBanner: this.BannerConfigurationForm.value.MuteBanner,
      BannerPosition: '',
      BadgePosition: '',
      DisplayFrequency: {
        bannerPartialConsent: this.BannerConfigurationForm.value.DisplayPartialConsent,
        bannerPartialConsentType: this.BannerConfigurationForm.value.DisplayPartialConsentType,
        bannerRejectAllConsent: this.BannerConfigurationForm.value.DisplayRejectAllConsent,
        bannerRejectAllConsentType: this.BannerConfigurationForm.value.DisplayRejectAllConsentType,
        bannerClosedConsent: this.BannerConfigurationForm.value.DisplayClosedConsent,
        bannerClosedConsentType: this.BannerConfigurationForm.value.DisplayClosedConsentType
      },
      Banner: {
        Privacy: {
          privacyLink: this.BannerConfigurationForm.value.BannerPrivacyLink,
          textColor: '',
        },
        GlobalStyles: {
          textColor: this.BannerConfigurationForm.value.BannerCookieNoticeTextColor,
          borderColor: this.BannerConfigurationForm.value.BannerCookieNoticeBorderColor,
          background: this.BannerConfigurationForm.value.BannerCookieNoticeBackgroundColor,
        },
        PreferenceButtonStylesAndContent: {
          textColor: this.BannerConfigurationForm.value.BannerPreferenceTextColor,
          background: this.BannerConfigurationForm.value.BannerPreferenceBackgroundColor
        },
        AllowAllButtonStylesAndContent: {
          textColor: this.BannerConfigurationForm.value.BannerAcceptAllText,
          background: this.BannerConfigurationForm.value.BannerAcceptAllBackgroundColor
        },

        DisableAllButtonStylesAndContent: {
          textColor: this.BannerConfigurationForm.value.BannerDisableAllTextColor,
          background: this.BannerConfigurationForm.value.BannerDisableAllBackgroundColor
        },
        DoNotSellButtonStylesAndContent: {
          textColor: this.BannerConfigurationForm.value.BannerDoNotSellMyDataTextColor,
          background: this.BannerConfigurationForm.value.BannerDoNotSellMyDataBackGroundColor
        }
      },
      POPUP: {
        GlobalStyles: {
          textColor: this.BannerConfigurationForm.value.PreferenceTextColor,
          background: this.BannerConfigurationForm.value.PreferenceBackgroundColor,
        },
        SwitchButton: {
          background: this.BannerConfigurationForm.value.PreferenceSwitchColor
        },
        PurposeButton: {
          textColor: this.BannerConfigurationForm.value.PreferencePurposeTextColor,
          background: this.BannerConfigurationForm.value.PreferencePurposeBackgroundColor
        },
        DisableAllButton: {
          background: this.BannerConfigurationForm.value.PreferenceDisableAllBackgroundColor,
          textColor: this.BannerConfigurationForm.value.PreferenceDisableAllTextColor
        },
        DoNotSellButtonStylesAndContent: {
          textColor: this.BannerConfigurationForm.value.PreferenceDoNotSellTextColor,
          background: this.BannerConfigurationForm.value.PreferenceDoNotSellBackgroundColor
        },
        AllowAllButton: {
          background: this.BannerConfigurationForm.value.PreferenceAcceptAllBackgroundColor,
          textColor: this.BannerConfigurationForm.value.PreferenceAcceptAllTextColor
        },
        SaveMyChoiseButton: {
          background: this.BannerConfigurationForm.value.PreferenceSaveMyChoiceBackgroundColor,
          textColor: this.BannerConfigurationForm.value.PreferenceSaveMyChoiceTextColor
        }
      },
    };
  }

  onPublishLangOnS3() {

    const payload = JSON.stringify(this.onAssignPayload());
    const currentLang = this.BannerConfigurationForm.value.PreviewLanguage.code;
    if (!currentLang) {
      alert('Please Select Language');
      return false;
    }
    if (!this.customLang.includes(currentLang)) {
      this.customLang.push(currentLang);
    };
    this.cookieBannerService.saveCustomLang(payload, currentLang, this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name, moduleName.manageVendorsModule)
      .subscribe(res => {
        this.BannerConfigurationForm.markAsPristine();
      });
  }

  onSaveCustomLangOnDB() {
    const payload = JSON.stringify(this.onAssignPayload());
    const currentLang = this.BannerConfigurationForm.value.PreviewLanguage.code;
    const langPayload = {
      lang_code: currentLang,
      lang_data: payload
    };
    this.contentSaving = 'saving';
    this.cookieBannerService.saveCustomLangInDB(langPayload, this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name, moduleName.manageVendorsModule)
      .subscribe((res: any) => {
        this.contentSaving = 'saved';
        if (res.status === 201) {
          this.BannerConfigurationForm.markAsPristine();
        }
      },error => {
        this.contentSaving = '';
      });
  }


  onAssignPayload() {
    console.log('this.languageContents', this.languageContents)
    let  languageContents = null
    if (this.languageContents.hasOwnProperty('CONFIG')) {
      languageContents = {...this.languageContents};
    } else {
       languageContents = JSON.parse(this.languageContents.response.lang_data);
    }
    console.log('languageContents :::::::::', languageContents)
    const langData: any = {...languageContents};
    // Banner
    langData.CONFIG.BANNER.ACCEPT_ALL_BTN = this.BannerConfigurationForm.value.BannerAcceptAllText;
    langData.CONFIG.BANNER.DESCRIPTION = this.BannerConfigurationForm.value.BannerDescription;
    langData.CONFIG.BANNER.PRIVACY_SETTINGS_BTN = this.BannerConfigurationForm.value.BannerPrivacyText;
    langData.CONFIG.BANNER.DISABLE_ALL_BTN = this.BannerConfigurationForm.value.BannerDisableAllText;
    langData.CONFIG.BANNER.DO_NOT_SELL_BTN = this.BannerConfigurationForm.value.BannerDoNotSellText;
    langData.CONFIG.BANNER.TITLE = this.BannerConfigurationForm.value.BannerTitle;
    langData.CONFIG.BANNER.PRIVACY = this.BannerConfigurationForm.value.BannerPrivacyText;
    // Popup
    langData.CONFIG.POPUP.GDPR_PURPOSES_DESC = this.BannerConfigurationForm.value.PreferencePurposeGdprDescriptionText;
    langData.CONFIG.POPUP.GDPR_VENDORS_DESC = this.BannerConfigurationForm.value.PreferenceVendorGdprDescriptionText;
    langData.CONFIG.POPUP.CCPA_AND_GENERIC_PURPOSES_DESC = this.BannerConfigurationForm.value.PreferencePurposeCcpaAndGenericDescriptionText;
    langData.CONFIG.POPUP.CCPA_AND_GENERIC_PRIVACY_INFO_DESCRIPTION = this.BannerConfigurationForm.value.PreferencePrivacyCcpaAndGenericDescriptionText;
    // langData.CONFIG.POPUP.PRIVACY_TEXT = this.BannerConfigurationForm.value.privacyText;
    langData.CONFIG.POPUP.DISABLE_ALL_BTN = this.BannerConfigurationForm.value.PreferenceDisableAllText;
    langData.CONFIG.POPUP.SAVE_MY_CHOICE_BTN = this.BannerConfigurationForm.value.PreferenceSaveMyChoiceText;
    langData.CONFIG.POPUP.ACCEPT_ALL_BTN = this.BannerConfigurationForm.value.PreferenceAcceptAllText;
    langData.CONFIG.POPUP.DO_NOT_SELL_BTN = this.BannerConfigurationForm.value.PreferenceDoNotSellMyDataText;
    // Purposes
    langData.PURPOSES = this.BannerConfigurationForm.value.PurposeList;
    // langData.PURPOSES[0].title = this.BannerConfigurationForm.value.EssentialTitle;
    // langData.PURPOSES[0].description = this.BannerConfigurationForm.value.EssentialDescription;
    //
    // langData.PURPOSES[1].title = this.BannerConfigurationForm.value.FunctionalTitle;
    // langData.PURPOSES[1].description = this.BannerConfigurationForm.value.FunctionalDescription;
    //
    // langData.PURPOSES[2].title = this.BannerConfigurationForm.value.AnalyticsTitle;
    // langData.PURPOSES[2].description = this.BannerConfigurationForm.value.AnalyticsDescription;
    //
    // langData.PURPOSES[3].title = this.BannerConfigurationForm.value.AdvertisingTitle;
    // langData.PURPOSES[3].description = this.BannerConfigurationForm.value.AdvertisingDescription;
    //
    // langData.PURPOSES[4].title = this.BannerConfigurationForm.value.SocialMediaTitle;
    // langData.PURPOSES[4].description = this.BannerConfigurationForm.value.SocialMediaDescription;
    //
    // langData.PURPOSES[5].title = this.BannerConfigurationForm.value.UnknownTitle;
    // langData.PURPOSES[5].description = this.BannerConfigurationForm.value.UnknownDescription;
    return langData;
  }
  onFindLangByCode(langCode) {
    let langData =  {
      title: 'English (United States)',
      code: 'en-US',
      countryFlag: 'us',
    };
    for (const lang of LanguageList) {
      if (lang.code === langCode) {
        langData = lang;
      }
    }
    return langData;
  }
  onAllowAllLanguage(e) {
    if(e.checked) {
      this.selectedLanguage = [];
      this.allowedLanguagesForPreview = [];
      for (const lang of LanguageList) {
        this.selectedLanguage.push(lang.code);
      }
      this.allowedLanguagesForPreview = [...LanguageList];
    } else {
      this.selectedLanguage = [];
      this.allowedLanguagesForPreview = [];
    }
  }
  onTest() {
    console.log('hi there')
  }
  onFindCcpaCountry(country){
    let name = '';
    for (const ccpa of CcpaCounties) {
      if (country === ccpa.code) {
        name = ccpa.name;
      }
    }
    return name;
  }
  onFindGdprCountry(country) {
    let name = '';
    for (const gdpr of GdprCountries) {
      if (country === gdpr.code) {
        name = gdpr.name;
      }
    }
    return name;
  }
}
