import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {BannerConstant, defaultBannerContent, defaultData} from '../../../_constant/consent-banner.constant';
import {CookieBannerService} from '../../../_services/cookie-banner.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {OrganizationService} from '../../../_services';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {moduleName} from '../../../_constant/module-name.constant';
import {CookieCategoryService} from 'src/app/_services/cookie-category.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {DataService} from 'src/app/_services/data.service';
import {featuresName} from 'src/app/_constant/features-name.constant';
import {GdprService} from '../../../_services/gdpr.service';
import { HasUnsavedData } from '../../../_helpers/formUnsaved.guard';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss'],
})
export class CookieBannerComponent implements OnInit, AfterViewInit {
  panelOpenState = false;
  @ViewChild('template', {static: true}) template: ElementRef;
  @ViewChild('template1', {static: true}) template1: ElementRef;
  @ViewChild('template2', {static: true}) template2: ElementRef;
  modalRef: BsModalRef;
  // @ViewChild('showConfig', {static: false}) showConfig : ElementRef;
  skeletonLoading = true;
  modalRef1:BsModalRef;
  modalRef2:BsModalRef;
  type = 'draft';
  matcher = new MyErrorStateMatcher();
  currentPlan;
  gdprTarget = [];
  currentState = 'banner';
  data = {...defaultBannerContent};
  formContent: any = {...defaultBannerContent};
  isFieldDisabled = null;
  bannerCookieData = null;
  isGdprGlobal = false;
  dismissible = true;
  alertMsg: any;
  isEdit = false;
  isOpen = false;
  alertType: any;
  cookieBannerForm: FormGroup;
  submitted = true;
  extraProperty = {
    alwaysAllow: 'Always Allow',
    privacyInfo: 'Privacy Info'
  };

  public bannerConstant = BannerConstant;
  public defaultData = defaultData;
  private currentManagedOrgID: any;
  private currrentManagedPropID: any;
  planDetails: any;
  disablePlanFeatures = {
    hideLogo: false,
    disableGoogleVendors: false,
    disableCookieblocking: false,
    disableBannerConfig: false
  };
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{header: 1}, {header: 2}],
        ['link'],
        [{color: []}],          // dropdown with defaults from theme
        [{font: []}],
        [{align: []}],
        [{size: ['small', false, 'large', 'huge']}]
      ]
    }
  };
  PopUpTitleLang = {
    purpose: 'Purpose',
    privacyInfo: 'Privacy Info',
    vendors: 'Vendors'
  };
  public isPublish: boolean;
  vendorsList: any;
  iabVendorsID = [];
  activeBannerlanguage = 'en-US';
  currentBannerlanguage = 'en-US';
  googleVendorsID = [];
  allowAllIabVendors = false;
  allowLanguagesList = ['en-US'];
  defaultLanguage = 'en-US';
  ccpaBannerConfig = true;
  gdprBannerConfig = true;
  genericBannerConfig = true;
  languageData = null;
  saveCustomLang = [];
  resetLang = null;
  allowedLanguageListObj = {
    allowedLang: ['en-US'],
    defaultLang: 'en-US'
  };

  constructor(private formBuilder: FormBuilder,
              private cd: ChangeDetectorRef,
              private modalService: BsModalService,
              private cookieBannerService: CookieBannerService,
              private cookieCategoryService: CookieCategoryService,
              private loading: NgxUiLoaderService,
              private  orgservice: OrganizationService,
              private _location: Location,
              private router: Router,
              private dataService: DataService,
              private gdprService: GdprService
  ) {

  }

  async ngOnInit() {
    this.onGetPropsAndOrgId();
    this.onGetAllowVendors();
    this.onGetCookies();
    this.onFormInIt();
    this.onSetDefaultValue();
    this.gdprTarget = this.bannerConstant.gdprTargetCountry;
    await this.onGetSavedCookieBannerConfig();
    this.onGetLangData();
  }

  onGetLangData() {
    if (this.saveCustomLang.includes(this.activeBannerlanguage)) {
      this.onGetCustomLangData();
    } else {
      this.onGetGlobleLangData();
    }
  }

  onGetGlobleLangData() {
    this.loading.start('lang');
    this.cookieBannerService.GetGlobleLangData(this.activeBannerlanguage).subscribe(res => {
      this.languageData = res;
      this.loading.stop('lang');
      this.cookieBannerForm.markAsPristine();
      this.onSetDynamicLang(res);
    }, error => {
      this.loading.stop('lang');
    });
  }

  openFirstModal(template: TemplateRef<any>) {
    this.modalRef1 = this.modalService.show(template, { });
  }
  openModalSecond(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, { });
  }
  closeFirstModal() {
    if (!this.modalRef1) {
      return;
    }

    this.modalRef1.hide();
    this.modalRef1 = null;
  }

  closeModal(){
      this.modalRef2.hide();
  }

  onGetCustomLangData() {
    this.loading.start('lang');
    this.cookieBannerService.GetCustomLangData( this.constructor.name, moduleName.cookieBannerModule, this.activeBannerlanguage, this.currentManagedOrgID, this.currrentManagedPropID)
      .subscribe((res: any) => {
        this.loading.stop('lang');
        if (res.status === 200 ) {
        const langData = JSON.parse(res.response.lang_data);
        this.languageData = langData;
        this.loading.stop('lang');
        this.cookieBannerForm.markAsPristine();
        this.onSetDynamicLang(langData);
      }
    }, error => {
      this.loading.stop('lang');
    });
  }

  onSetDynamicLang(lang) {
    const LANG_CONFIG = lang;
    this.cookieBannerForm.patchValue({
//
      privacyText: LANG_CONFIG.CONFIG.BANNER.PRIVACY,
      BannerTitle: LANG_CONFIG.CONFIG.BANNER.TITLE,
      BannerDescription: LANG_CONFIG.CONFIG.BANNER.DESCRIPTION,
      BannerPreferenceButtonText: LANG_CONFIG.CONFIG.BANNER.PRIVACY_SETTINGS_BTN,
      BannerAcceptAllButtonText: LANG_CONFIG.CONFIG.BANNER.ACCEPT_ALL_BTN,
      BannerDisableAllButtonText: LANG_CONFIG.CONFIG.BANNER.DISABLE_ALL_BTN,
      BannerDoNotSellMyDataText: LANG_CONFIG.CONFIG.BANNER.DO_NOT_SELL_BTN,
      //  POPUP
      PopUpGdprPurposeDescription: LANG_CONFIG.CONFIG.POPUP.GDPR_PURPOSES_DESC,
      PopUpGdprVendorDescription: LANG_CONFIG.CONFIG.POPUP.GDPR_VENDORS_DESC,
      PopUpCcpaGenericPurposeDescription: LANG_CONFIG.CONFIG.POPUP.CCPA_AND_GENERIC_PURPOSES_DESC,
      PopUpCcpaGenericPrivacyInfoDescription: LANG_CONFIG.CONFIG.POPUP.CCPA_AND_GENERIC_PRIVACY_INFO_DESCRIPTION,
      // PopUpPurposeButtonBorderColor: this.bannerCookieData.CONFIG,
      // privacyText: LANG_CONFIG.CONFIG.POPUP.PRIVACY_TEXT,
      PopUpDisableAllButtonText: LANG_CONFIG.CONFIG.POPUP.DISABLE_ALL_BTN,
      PopUpSaveMyChoiceButtonText: LANG_CONFIG.CONFIG.POPUP.SAVE_MY_CHOICE_BTN,
      PopUpAllowAllButtonText: LANG_CONFIG.CONFIG.POPUP.ACCEPT_ALL_BTN,
      PopUpDoNotSellText: LANG_CONFIG.CONFIG.POPUP.DO_NOT_SELL_BTN,
    });

    // BANNER
    this.formContent.privacy = LANG_CONFIG.CONFIG.BANNER.PRIVACY;
    this.formContent.bannerTitle = LANG_CONFIG.CONFIG.BANNER.TITLE;
    this.formContent.bannerDescription = LANG_CONFIG.CONFIG.BANNER.DESCRIPTION;
    this.formContent.bannerPreferenceButtonText = LANG_CONFIG.CONFIG.BANNER.PRIVACY_SETTINGS_BTN;
    this.formContent.bannerAcceptButtonText = LANG_CONFIG.CONFIG.BANNER.ACCEPT_ALL_BTN;
    this.formContent.bannerDisableButtonText = LANG_CONFIG.CONFIG.BANNER.DISABLE_ALL_BTN;
    this.formContent.BannerDoNotSellMyDataText = LANG_CONFIG.CONFIG.BANNER.DO_NOT_SELL_BTN;
    // //  POPUP
    this.formContent.PopUpGdprPurposeDescription = LANG_CONFIG.CONFIG.POPUP.GDPR_PURPOSES_DESC;
    this.formContent.PopUpGdprVendorDescription = LANG_CONFIG.CONFIG.POPUP.GDPR_VENDORS_DESC;
    this.formContent.PopUpCcpaGenericPurposeDescription = LANG_CONFIG.CONFIG.POPUP.CCPA_AND_GENERIC_PURPOSES_DESC;
    this.formContent.PopUpCcpaGenericPrivacyInfoDescription = LANG_CONFIG.CONFIG.POPUP.CCPA_AND_GENERIC_PRIVACY_INFO_DESCRIPTION;
    this.formContent.PopUpDisableAllButtonText = LANG_CONFIG.CONFIG.POPUP.DISABLE_ALL_BTN;
    this.formContent.PopUpSaveMyChoiceButtonText = LANG_CONFIG.CONFIG.POPUP.SAVE_AND_EXIT_BTN;  // DOUBLE
    this.formContent.PopUpSaveMyChoiceButtonText = LANG_CONFIG.CONFIG.POPUP.SAVE_MY_CHOICE_BTN;  // DOUBLE
    this.formContent.PopUpAllowAllButtonText = LANG_CONFIG.CONFIG.POPUP.ACCEPT_ALL_BTN;
    this.formContent.PopUpDoNotSellText = LANG_CONFIG.CONFIG.POPUP.DO_NOT_SELL_BTN;


    // if (this.bannerCookieData.config.POPUP.PurposeBody.length > 0) {
    this.cookieBannerForm.patchValue({
      EssentialTitle: LANG_CONFIG.PURPOSES[0].title,
      EssentialDescription: LANG_CONFIG.PURPOSES[0].description,

      FunctionalTitle: LANG_CONFIG.PURPOSES[1].title,
      FunctionalDescription: LANG_CONFIG.PURPOSES[1].description,

      AnalyticsTitle: LANG_CONFIG.PURPOSES[2].title,
      AnalyticsDescription: LANG_CONFIG.PURPOSES[2].description,

      AdvertisingTitle: LANG_CONFIG.PURPOSES[3].title,
      AdvertisingDescription: LANG_CONFIG.PURPOSES[3].description,

      SocialMediaTitle: LANG_CONFIG.PURPOSES[4].title,
      SocialMediaDescription: LANG_CONFIG.PURPOSES[4].description,

      UnknownTitle: LANG_CONFIG.PURPOSES[5].title,
      UnknownDescription: LANG_CONFIG.PURPOSES[5].description,
    });

    this.formContent.EssentialTitle = LANG_CONFIG.PURPOSES[0].title;
    this.formContent.EssentialDescription = LANG_CONFIG.PURPOSES[0].description;

    this.formContent.FunctionalTitle = LANG_CONFIG.PURPOSES[1].title;
    this.formContent.FunctionalDescription = LANG_CONFIG.PURPOSES[1].description;

    this.formContent.AnalyticsTitle = LANG_CONFIG.PURPOSES[2].title;
    this.formContent.AnalyticsDescription = LANG_CONFIG.PURPOSES[2].description;

    this.formContent.AdvertisingTitle = LANG_CONFIG.PURPOSES[3].title;
    this.formContent.AdvertisingDescription = LANG_CONFIG.PURPOSES[3].description;

    this.formContent.SocialMediaTitle = LANG_CONFIG.PURPOSES[4].title;
    this.formContent.SocialMediaDescription = LANG_CONFIG.PURPOSES[4].description;

    this.formContent.UnknownTitle = LANG_CONFIG.PURPOSES[5].title;
    this.formContent.UnknownDescription = LANG_CONFIG.PURPOSES[5].description;

    this.formContent.PopUpCcpaPurposeDescription = LANG_CONFIG.CONFIG.POPUP.PURPOSES_BODY_CCPA;
    this.formContent.PopUpCcpaPrivacyInfo = LANG_CONFIG.CONFIG.POPUP.PRIVACY_INFO_BODY_TEXT;

    this.PopUpTitleLang = {
      purpose: LANG_CONFIG.CONFIG.POPUP.PURPOSE_TEXT,
      privacyInfo: LANG_CONFIG.CONFIG.POPUP.PRIVACY_INFO_TEXT,
      vendors: LANG_CONFIG.CONFIG.POPUP.VENDORS_TEXT
    };

    this.extraProperty.alwaysAllow = LANG_CONFIG.CONFIG.POPUP.ALWAYS_ALLOW;
    this.extraProperty.privacyInfo = LANG_CONFIG.CONFIG.POPUP.PRIVACY_INFO_TEXT;
  }

  onGetAllowVendors() {
    this.loading.start('23');
    this.skeletonLoading = true;
    this.isOpen = false;
    this.cookieBannerService.onGetVendorsData(this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name, moduleName.manageVendorsModule)
      .subscribe(res => {
        this.skeletonLoading = false;
        this.loading.stop('23');
        if (res) {
          if (res.status === 200) {
            const result = res.response;
            this.googleVendorsID = JSON.parse(result.google_vendors);
            this.iabVendorsID = JSON.parse(result.iab_vendors);
          }
          this.isOpen = true;
          this.alertMsg = res.message;
          this.alertType = 'success';
        }
      }, error => {
        this.skeletonLoading = false;
        this.loading.stop('23');
        this.isOpen = true;
        this.alertMsg = error.message;
        this.alertType = 'danger';
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
  }

  onGetSavedCookieBannerConfig() {
    this.loading.start('2');
    return new Promise((resolve, reject) => {
      this.cookieBannerService.onGetCookieBannerData(this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name, moduleName.cookieBannerModule)
        .subscribe((res: any) => {
          this.loading.stop('2');
          if (res.status === 200 && res.hasOwnProperty('response')) {
            this.bannerCookieData = res.response;
            this.onSetValueConfig();
            this.onSetValue();
            this.isEdit = true;
          }
          resolve(res);
        }, error => {
          this.bannerCookieData = null;
          this.loading.stop('2');
          this.isOpen = true;
          this.alertMsg = error;
          this.alertType = 'danger';
          reject(error);
        });
    });
  }

  onSetValueConfig() {
    const configData: any = this.bannerCookieData;
    if (configData.gdpr_global === 'true' || configData.gdpr_global === true) {
      this.cookieBannerForm.get('gdprTarget').clearValidators();
      this.cookieBannerForm.get('ccpaTarget').clearValidators();
    }
    if (configData.ccpa_global === 'true' || configData.ccpa_global === true) {
      this.cookieBannerForm.get('ccpaTarget').clearValidators();
      this.cookieBannerForm.get('gdprTarget').clearValidators();
    }
    if (configData.generic_global === 'true' || configData.generic_global === true) {
      this.cookieBannerForm.get('ccpaTarget').clearValidators();
      this.cookieBannerForm.get('gdprTarget').clearValidators();
    }

    this.cookieBannerForm.get('ccpaTarget').updateValueAndValidity();
    this.cookieBannerForm.get('gdprTarget').updateValueAndValidity();

    this.cookieBannerForm.patchValue({
      ccpaTarget: configData.ccpa_target,
      gdprTarget: configData.gdpr_target,
      gdpr_global: configData.gdpr_global === 'true' || configData.gdpr_global === true ? true : false,
      ccpa_global: configData.ccpa_global === 'true' || configData.ccpa_global === true ? true : false,
      generic_global: configData.generic_global === 'true' || configData.generic_global === true ? true : false,
      defaultRegulation: configData.default_regulation,
      cookieBlocking: configData.cookie_blocking,
      enableIab: configData.enable_iab,
      email: configData.email,
      google_vendors: configData.google_vendors,
      showBadge: configData.show_badge,
      logo: configData.logo,
      purposes_by_default: configData.purposes_by_default
    });
    this.allowLanguagesList = configData.config.LanguageConfig.allowedLang;
    this.defaultLanguage = configData.config.LanguageConfig.defaultLang;
    this.saveCustomLang = configData.config.LanguageConfig.customLang;
    const langConfig = {...configData.config.LanguageConfig};
    this.allowedLanguageListObj = {
      allowedLang: langConfig.allowedLang,
      defaultLang: langConfig.defaultLang
    };
  }

  onGetCookies() {
    this.loading.start();
    this.cookieCategoryService.getCookieData({}, this.constructor.name, moduleName.cookieBannerModule).subscribe((res: any) => {
      this.loading.stop();
      if (res.response.length === 0) {
        this.modalRef = this.modalService.show(this.template, {
          animated: false, keyboard: false, ignoreBackdropClick: true
        });
      }
    }, error => {
      this.loading.stop();
    });
  }

  navigate() {
    this.modalRef.hide();
    this.router.navigateByUrl('/cookie-consent/cookie-category');
  }

  onFormInIt() {
    this.cookieBannerForm = this.formBuilder.group({
      ccpaTarget: [defaultData.ccpaDefaultTarget, Validators.required],
      gdprTarget: [defaultData.gdprDefaultTarget, Validators.required],
      cookieBlocking: [this.defaultData.defaultCookieBlocking],
      enableIab: [this.defaultData.defaultEnableIab],
      email: [this.defaultData.defaultEmail],
      google_vendors: [this.defaultData.google_vendors],
      gdpr_global: [this.defaultData.gdprGlobal],
      ccpa_global: [this.defaultData.ccpaGlobal],
      defaultRegulation: ['generic'],
      generic_global: [this.defaultData.genericGlobal],
      purposes_by_default: [this.defaultData.allowPurposeByDefault],
      showBadge: [this.defaultData.showBadge],
      logo: [this.defaultData.logo],
      // DISPLAY FREQUENCY
      bannerPartialConsent: [24],
      bannerPartialConsentType: [this.defaultData.BannerDisplayFrequency.partialConsent],
      bannerRejectAllConsent: [2],
      bannerRejectAllConsentType: [this.defaultData.BannerDisplayFrequency.rejectAll],
      bannerClosedConsent: [10],
      bannerClosedConsentType: [this.defaultData.BannerDisplayFrequency.noConsent],
      //  BANNER
      privacyText: [this.data.privacy],
      privacyLink: [this.data.privacyLink],
      privacyTextColor: [this.data.privacyTextColor],
      // Banner
      BannerPosition: [this.defaultData.DefaultBannerPosition],
      BadgePosition: [this.defaultData.DefaultBadgePosition],
      BannerTitle: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      BannerTitle2: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      BannerDescription: ['', [Validators.minLength(20)]],
      BannerGlobalStyleTextColor: [''],
      BannerGlobalStyleBorderColor: [''],
      BannerGlobalStyleBackgroundColor: [''],
      BannerPreferenceButtonText: ['', [Validators.minLength(2), Validators.maxLength(45)]],
      BannerPreferenceButtonTextColor: [''],
      BannerPreferenceButtonBackgroundColor: [''],
      BannerAcceptAllButtonText: ['', [Validators.minLength(2), Validators.maxLength(45)]],
      BannerAcceptAllButtonTextColor: [''],
      BannerAllowAllButtonBackgroundColor: [''],
      BannerDisableAllButtonText: ['', [Validators.minLength(2), Validators.maxLength(45)]],
      BannerDisableAllButtonTextColor: [''],
      BannerDisableAllButtonBackgroundColor: [''],
      BannerDoNotSellMyDataText: ['', [Validators.minLength(2), Validators.maxLength(45)]],
      BannerDoNotSellMyDataTextColor: [''],
      BannerDoNotSellMyDataBackGroundColor: [''],
      //  POPUP
      PopUpGdprPurposeDescription: ['', [Validators.minLength(20), Validators.maxLength(1500)]],
      PopUpGdprVendorDescription: ['', [Validators.minLength(20), Validators.maxLength(1000)]],
      PopUpCcpaGenericPurposeDescription: ['', [Validators.minLength(20), Validators.maxLength(1500)]],
      PopUpCcpaGenericPrivacyInfoDescription: ['', [Validators.minLength(20), Validators.maxLength(1000)]],
      PopUpSwitchButton: [''],
      PopUpGlobalTextColor: [''],
      PopUpGlobalBackgroundColor: [''],
      PopUpPurposeButtonTextColor: [''],
      PopUpPurposeButtonBackgroundColor: [''],
      PopUpPurposeButtonBorderColor: [''],
      PopUpDisableAllButtonText: ['', [Validators.minLength(2), Validators.maxLength(45)]],
      PopUpDisableAllButtonTextColor: [''],
      PopUpDisableAllButtonBackgroundColor: [''],
      PopUpDoNotSellText: ['', [Validators.minLength(2), Validators.maxLength(45)]],
      PopUpDoNotSellTextColor: [''],
      PopUpDoNotSellBackgroundColor: [''],
      PopUpSaveMyChoiceButtonText: ['', [Validators.minLength(2), Validators.maxLength(45)]],
      PopUpSaveMyChoiceButtonTextColor: [''],
      PopUpSaveMyChoiceButtonBackgroundColor: [''],
      PopUpAllowAllButtonText: ['', [Validators.minLength(2), Validators.maxLength(45)]],
      PopUpAllowAllButtonTextColor: [''],
      PopUpAllowAllButtonBackgroundColor: [''],

      SocialMediaTitle: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      SocialMediaDescription: ['', [Validators.minLength(20), Validators.maxLength(1000)]],

      EssentialTitle: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      EssentialDescription: ['', [Validators.minLength(20), Validators.maxLength(1000)]],

      AnalyticsTitle: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      AnalyticsDescription: ['', [Validators.minLength(20), Validators.maxLength(1000)]],

      AdvertisingTitle: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      AdvertisingDescription: ['', [Validators.minLength(20), Validators.maxLength(1000)]],

      FunctionalTitle: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      FunctionalDescription: ['', [Validators.minLength(20), Validators.maxLength(1000)]],

      UnknownTitle: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      UnknownDescription: ['', [Validators.minLength(20), Validators.maxLength(1000)]],
    });
  }

  onSetDefaultValue() {
    // this.formContent['bannerTitle'] = this.data.bannerTitle;
    this.formContent = this.data;
    this.cookieBannerForm.patchValue({
      privacyText: this.data.privacy,
      privacyLink: this.data.privacyLink,
      privacyTextColor: this.data.privacyTextColor,
      BannerTitle: this.data.bannerTitle,
      BannerTitle2: this.data.bannerTitle2,
      BannerDescription: this.data.bannerDescription,
      BannerGlobalStyleTextColor: this.data.bannerTextColor,
      BannerGlobalStyleBorderColor: this.data.bannerBorderColor,
      BannerGlobalStyleBackgroundColor: this.data.bannerBackGroundColor,
      BannerPreferenceButtonText: this.data.bannerPreferenceButtonText,
      BannerPreferenceButtonTextColor: this.data.bannerPreferenceButtonTextColor,
      BannerPreferenceButtonBackgroundColor: this.data.bannerPreferenceButtonBackGroundColor,
      BannerAcceptAllButtonText: this.data.bannerAcceptButtonText,
      BannerAcceptAllButtonTextColor: this.data.bannerAcceptButtonTextColor,
      BannerAllowAllButtonBackgroundColor: this.data.bannerAcceptButtonBackgroundColor,
      BannerDisableAllButtonText: this.data.bannerDisableButtonText,
      BannerDisableAllButtonTextColor: this.data.bannerDisableButtonTextColor,
      BannerDisableAllButtonBackgroundColor: this.data.bannerDisableButtonBackGroundColor,

      BannerDoNotSellMyDataText: this.data.BannerDoNotSellMyDataText,
      BannerDoNotSellMyDataTextColor: this.data.BannerDoNotSellMyDataTextColor,
      BannerDoNotSellMyDataBackGroundColor: this.data.BannerDoNotSellMyDataBackGroundColor,
      //  POPUP
      PopUpGdprPurposeDescription: this.data.PopUpGdprPurposeDescription,
      PopUpGdprVendorDescription: this.data.PopUpGdprVendorDescription,
      PopUpCcpaGenericPurposeDescription: this.data.PopUpCcpaGenericPurposeDescription,
      PopUpCcpaGenericPrivacyInfoDescription: this.data.PopUpCcpaGenericPrivacyInfoDescription,
      PopUpSwitchButton: this.data.PopUpSwitchButtonColor,
      PopUpPurposeButtonTextColor: this.data.PopUpPurposeButtonTextColor,
      PopUpPurposeButtonBackgroundColor: this.data.PopUpPurposeButtonBackGroundColor,
      PopUpDisableAllButtonText: this.data.PopUpDisableAllButtonText,
      PopUpDisableAllButtonTextColor: this.data.PopUpDisableAllButtonTextColor,
      PopUpDisableAllButtonBackgroundColor: this.data.PopUpDisableAllButtonBackgroundColor,
      PopUpDoNotSellText: this.data.PopUpDoNotSellText,
      PopUpDoNotSellTextColor: this.data.PopUpDoNotSellTextColor,
      PopUpDoNotSellBackgroundColor: this.data.PopUpDoNotSellBackgroundColor,
      PopUpSaveMyChoiceButtonText: this.data.PopUpSaveMyChoiceButtonText,
      PopUpSaveMyChoiceButtonTextColor: this.data.PopUpSaveMyChoiceButtonTextColor,
      PopUpSaveMyChoiceButtonBackgroundColor: this.data.PopUpSaveMyChoiceButtonBackgroundColor,
      PopUpAllowAllButtonText: this.data.PopUpAllowAllButtonText,
      PopUpAllowAllButtonTextColor: this.data.PopUpAllowAllButtonTextColor,
      PopUpAllowAllButtonBackgroundColor: this.data.PopUpAllowAllButtonBackgroundColor,
      //
      AdvertisingTitle: this.data.AdvertisingTitle,
      AdvertisingDescription: this.data.AdvertisingDescription,

      SocialMediaTitle: this.data.SocialMediaTitle,
      SocialMediaDescription: this.data.SocialMediaDescription,

      AnalyticsTitle: this.data.AnalyticsTitle,
      AnalyticsDescription: this.data.AnalyticsDescription,

      EssentialTitle: this.data.EssentialTitle,
      EssentialDescription: this.data.EssentialDescription,
    });
    this.formContent = {...defaultBannerContent};
  }


  onSetValue() {
    try {
      this.cookieBannerForm.patchValue({
        // DISPLAY FREQUENCY
        bannerPartialConsent: this.bannerCookieData.config.DisplayFrequency.bannerPartialConsent,
        bannerPartialConsentType: this.bannerCookieData.config.DisplayFrequency.bannerPartialConsentType,
        bannerRejectAllConsent: this.bannerCookieData.config.DisplayFrequency.bannerRejectAllConsent,
        bannerRejectAllConsentType: this.bannerCookieData.config.DisplayFrequency.bannerRejectAllConsentType,
        bannerClosedConsent: this.bannerCookieData.config.DisplayFrequency.bannerClosedConsent,
        bannerClosedConsentType: this.bannerCookieData.config.DisplayFrequency.bannerClosedConsentType,
        //
        BadgePosition: this.bannerCookieData.config.BadgePosition,
        BannerPosition: this.bannerCookieData.config.BannerPosition,
        //
        privacyLink: this.bannerCookieData.config.Banner.Privacy.privacyLink,
        privacyTextColor: this.bannerCookieData.config.Banner.Privacy.textColor,

        BannerGlobalStyleTextColor: this.bannerCookieData.config.Banner.GlobalStyles.textColor,
        BannerGlobalStyleBorderColor: this.bannerCookieData.config.Banner.GlobalStyles.borderColor,
        BannerGlobalStyleBackgroundColor: this.bannerCookieData.config.Banner.GlobalStyles.background,
        BannerPreferenceButtonTextColor: this.bannerCookieData.config.Banner.PreferenceButtonStylesAndContent.textColor,
        BannerPreferenceButtonBackgroundColor: this.bannerCookieData.config.Banner.PreferenceButtonStylesAndContent.background,
        BannerAcceptAllButtonTextColor: this.bannerCookieData.config.Banner.AllowAllButtonStylesAndContent.textColor,
        BannerAllowAllButtonBackgroundColor: this.bannerCookieData.config.Banner.AllowAllButtonStylesAndContent.background,

        BannerDisableAllButtonTextColor: this.bannerCookieData.config.Banner.DisableAllButtonStylesAndContent.textColor,
        BannerDisableAllButtonBackgroundColor: this.bannerCookieData.config.Banner.DisableAllButtonStylesAndContent.background,

        BannerDoNotSellMyDataTextColor: this.bannerCookieData.config.Banner.DoNotSellButtonStylesAndContent.textColor,
        BannerDoNotSellMyDataBackGroundColor: this.bannerCookieData.config.Banner.DoNotSellButtonStylesAndContent.background,
        //  POPUP
        PopUpGlobalTextColor: this.bannerCookieData.config.POPUP.GlobalStyles.textColor,
        PopUpSwitchButton: this.bannerCookieData.config.POPUP.SwitchButton.backgroundColor,
        PopUpGlobalBackgroundColor: this.bannerCookieData.config.POPUP.GlobalStyles.background,
        PopUpPurposeButtonTextColor: this.bannerCookieData.config.POPUP.PurposeButton.textColor,
        PopUpPurposeButtonBackgroundColor: this.bannerCookieData.config.POPUP.PurposeButton.background,

        PopUpDisableAllButtonTextColor: this.bannerCookieData.config.POPUP.DisableAllButton.textColor,
        PopUpDisableAllButtonBackgroundColor: this.bannerCookieData.config.POPUP.DisableAllButton.background,
        PopUpSaveMyChoiceButtonTextColor: this.bannerCookieData.config.POPUP.SaveMyChoiseButton.textColor,
        PopUpSaveMyChoiceButtonBackgroundColor: this.bannerCookieData.config.POPUP.SaveMyChoiseButton.background,
        PopUpAllowAllButtonTextColor: this.bannerCookieData.config.POPUP.AllowAllButton.textColor,
        PopUpAllowAllButtonBackgroundColor: this.bannerCookieData.config.POPUP.AllowAllButton.background,

        PopUpDoNotSellTextColor: this.bannerCookieData.config.POPUP.DoNotSellButtonStylesAndContent.textColor,
        PopUpDoNotSellBackgroundColor: this.bannerCookieData.config.POPUP.DoNotSellButtonStylesAndContent.background,
      });

      this.ccpaBannerConfig = this.bannerCookieData.config.AllowedBanners.ccpa;
      this.gdprBannerConfig = this.bannerCookieData.config.AllowedBanners.gdpr;
      this.genericBannerConfig = this.bannerCookieData.config.AllowedBanners.generic;
      this.formContent.position = this.bannerCookieData.config.BannerPosition;
      //
      this.formContent.privacyLink = this.bannerCookieData.config.Banner.Privacy.privacyLink;
      this.formContent.privacyTextColor = this.bannerCookieData.config.Banner.Privacy.textColor;
      this.formContent.bannerTextColor = this.bannerCookieData.config.Banner.GlobalStyles.textColor;
      this.formContent.bannerBackGroundColor = this.bannerCookieData.config.Banner.GlobalStyles.background;
      this.formContent.bannerPreferenceButtonTextColor = this.bannerCookieData.config.Banner.PreferenceButtonStylesAndContent.textColor;
      this.formContent.bannerPreferenceButtonBackGroundColor = this.bannerCookieData.config.Banner.PreferenceButtonStylesAndContent.background,
        this.formContent.bannerAcceptButtonTextColor = this.bannerCookieData.config.Banner.AllowAllButtonStylesAndContent.textColor;
      this.formContent.bannerAcceptButtonBackgroundColor = this.bannerCookieData.config.Banner.AllowAllButtonStylesAndContent.background;
      this.formContent.bannerDisableButtonTextColor = this.bannerCookieData.config.Banner.DisableAllButtonStylesAndContent.textColor;
      this.formContent.bannerDisableButtonBackGroundColor = this.bannerCookieData.config.Banner.DisableAllButtonStylesAndContent.background;
      this.formContent.BannerDoNotSellMyDataTextColor = this.bannerCookieData.config.Banner.DoNotSellButtonStylesAndContent.textColor;
      this.formContent.BannerDoNotSellMyDataBackGroundColor = this.bannerCookieData.config.Banner.DoNotSellButtonStylesAndContent.background;
      //  POPUP
      this.formContent.PopUpSwitchButtonColor = this.bannerCookieData.config.POPUP.SwitchButton.background;
      this.formContent.PopUpPurposeButtonTextColor = this.bannerCookieData.config.POPUP.PurposeButton.textColor;
      this.formContent.PopUpPurposeButtonBackGroundColor = this.bannerCookieData.config.POPUP.PurposeButton.background;
      this.formContent.PopUpDisableAllButtonTextColor = this.bannerCookieData.config.POPUP.DisableAllButton.textColor;
      this.formContent.PopUpDisableAllButtonBackgroundColor = this.bannerCookieData.config.POPUP.DisableAllButton.background;
      this.formContent.PopUpSaveMyChoiceButtonTextColor = this.bannerCookieData.config.POPUP.SaveMyChoiseButton.textColor;
      this.formContent.PopUpSaveMyChoiceButtonBackgroundColor = this.bannerCookieData.config.POPUP.SaveMyChoiseButton.background;
      this.formContent.PopUpAllowAllButtonTextColor = this.bannerCookieData.config.POPUP.AllowAllButton.textColor;
      this.formContent.PopUpAllowAllButtonBackgroundColor = this.bannerCookieData.config.POPUP.AllowAllButton.background;
      this.formContent.PopUpDoNotSellTextColor = this.bannerCookieData.config.POPUP.DoNotSellButtonStylesAndContent.textColor;
      this.formContent.PopUpDoNotSellBackgroundColor = this.bannerCookieData.config.POPUP.DoNotSellButtonStylesAndContent.background;
    } catch (e) {
      console.log('Get Config From Server Error', e);
    }
  }

  onChoiceBanner(type: string) {
    this.currentState = type;
  }

  onGetPropsAndOrgId() {
    this.orgservice.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id;
        this.currrentManagedPropID = response.property_id;
      } else {
        const orgDetails = this.orgservice.getCurrentOrgWithProperty();
        this.currentManagedOrgID = orgDetails.organization_id;
        this.currrentManagedPropID = orgDetails.property_id;
      }
    });
  }

  get f() {
    return this.cookieBannerForm.controls;
  }

  onSubmit() {
    const isPropertyPlan = this.dataService.isPropertyHasPlan(this.planDetails.response, featuresName.HIGHLY_BANNER_CONFIG);
    if (!isPropertyPlan) {
      return false;
    } else {
      this.submitted = true;
      if (this.cookieBannerForm.invalid) {
        return;
      }
      if (this.bannerCookieData) {
        this.onUpdateForm();
      } else {
        this.onSubmitForm();
      }
    }
  }

  onSubmitForm() {
    const userPrefrencesData = {
      ccpa_target: this.cookieBannerForm.value.ccpaTarget,
      type: this.type,
      gdpr_target: this.cookieBannerForm.value.gdprTarget,
      cookie_blocking: this.cookieBannerForm.value.cookieBlocking,
      enable_iab: this.cookieBannerForm.value.enableIab,
      email: this.cookieBannerForm.value.email,
      google_vendors: this.cookieBannerForm.value.google_vendors,
      logo: this.cookieBannerForm.value.logo,
      gdpr_global: this.cookieBannerForm.value.gdpr_global,
      ccpa_global: this.cookieBannerForm.value.ccpa_global,
      generic_global: this.cookieBannerForm.value.generic_global,
      default_regulation: this.cookieBannerForm.value.defaultRegulation,
      purposes_by_default: this.cookieBannerForm.value.purposes_by_default,
      iab_vendors_ids: JSON.stringify(this.iabVendorsID),
      google_vendors_ids: JSON.stringify(this.googleVendorsID),
      show_badge: this.cookieBannerForm.value.showBadge,
      CONFIG: this.onGetStyleConfiguration()
    };
    this.isPublish = true;
    this.loading.start();
    this.cookieBannerService.onSubmitCookieBannerData(userPrefrencesData, this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name, moduleName.cookieBannerModule)
      .subscribe((res: any) => {
        this.cookieBannerForm.markAsPristine();
        this.onGetSavedCookieBannerConfig();
        this.loading.stop();
        this.isPublish = false;
        this.isOpen = true;
        this.alertMsg = res.response;
        this.alertType = 'success';
        setTimeout(() => {
          if (this.type === 'publish') {
            this.router.navigateByUrl('/cookie-consent/cookie-banner/setup');
          }
        }, 1000);
      }, error => {
        this.isPublish = false;
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
        this.loading.stop();
      });
  }


  onUpdateForm() {
    const userPrefrencesData = {
      ccpa_target: this.cookieBannerForm.value.ccpaTarget,
      type: this.type,
      logo: this.cookieBannerForm.value.logo,
      gdpr_global: this.cookieBannerForm.value.gdpr_global,
      ccpa_global: this.cookieBannerForm.value.ccpa_global,
      generic_global: this.cookieBannerForm.value.generic_global,
      default_regulation: this.cookieBannerForm.value.defaultRegulation,
      purposes_by_default: this.cookieBannerForm.value.purposes_by_default,
      gdpr_target: this.cookieBannerForm.value.gdprTarget,
      iab_vendors_ids: JSON.stringify(this.iabVendorsID),
      google_vendors_ids: JSON.stringify(this.googleVendorsID),
      cookie_blocking: this.cookieBannerForm.value.cookieBlocking,
      enable_iab: this.cookieBannerForm.value.enableIab,
      email: this.cookieBannerForm.value.email,
      google_vendors: this.cookieBannerForm.value.google_vendors,
      show_badge: this.cookieBannerForm.value.showBadge,
      CONFIG: this.onGetStyleConfiguration()
    };

    this.loading.start();
    this.isPublish = true;
    this.cookieBannerService.onUpdateCookieBannerData(userPrefrencesData, this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name, moduleName.cookieBannerModule)
      .subscribe((res: any) => {
        this.cookieBannerForm.markAsPristine();
        this.onGetSavedCookieBannerConfig();
        this.loading.stop();
        this.isPublish = false;
        this.isOpen = true;
        this.alertMsg = res.response;
        this.alertType = 'success';
        setTimeout(() => {
          if (this.type === 'publish') {
            this.router.navigateByUrl('/cookie-consent/cookie-banner/setup');
          }
        }, 1000);
      }, error => {
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
        this.loading.stop();
        this.isPublish = false;
      });
  }

  onGetStyleConfiguration() {
    return {
      LanguageConfig: {
        allowedLang: this.allowedLanguageListObj.allowedLang,
        defaultLang: this.allowedLanguageListObj.defaultLang,
        customLang: this.saveCustomLang
      },
      AllowedBanners: {
        ccpa: this.ccpaBannerConfig,
        gdpr: this.gdprBannerConfig,
        generic: this.genericBannerConfig
      },
      BannerPosition: this.cookieBannerForm.value.BannerPosition,
      BadgePosition: this.cookieBannerForm.value.BadgePosition,
      DisplayFrequency: {
        bannerPartialConsent: this.cookieBannerForm.value.bannerPartialConsent,
        bannerPartialConsentType: this.cookieBannerForm.value.bannerPartialConsentType,
        bannerRejectAllConsent: this.cookieBannerForm.value.bannerRejectAllConsent,
        bannerRejectAllConsentType: this.cookieBannerForm.value.bannerRejectAllConsentType,
        bannerClosedConsent: this.cookieBannerForm.value.bannerClosedConsent,
        bannerClosedConsentType: this.cookieBannerForm.value.bannerClosedConsentType,
      },
      Banner: {
        Privacy: {
          privacyLink:  this.cookieBannerForm.value.privacyLink,
          textColor: this.cookieBannerForm.value.privacyTextColor,
        },
        GlobalStyles: {
          textColor: this.cookieBannerForm.value.BannerGlobalStyleTextColor,
          borderColor: this.cookieBannerForm.value.BannerGlobalStyleBorderColor,
          background: this.cookieBannerForm.value.BannerGlobalStyleBackgroundColor,
        },
        PreferenceButtonStylesAndContent: {
          textColor: this.cookieBannerForm.value.BannerPreferenceButtonTextColor,
          background: this.cookieBannerForm.value.BannerPreferenceButtonBackgroundColor
        },
        AllowAllButtonStylesAndContent: {
          textColor: this.cookieBannerForm.value.BannerAcceptAllButtonTextColor,
          background: this.cookieBannerForm.value.BannerAllowAllButtonBackgroundColor
        },

        DisableAllButtonStylesAndContent: {
          textColor: this.cookieBannerForm.value.BannerDisableAllButtonTextColor,
          background: this.cookieBannerForm.value.BannerDisableAllButtonBackgroundColor
        },
        DoNotSellButtonStylesAndContent: {
          textColor: this.cookieBannerForm.value.BannerDoNotSellMyDataTextColor,
          background: this.cookieBannerForm.value.BannerDoNotSellMyDataBackGroundColor
        }
      },
      POPUP: {
        GlobalStyles: {
          textColor: this.cookieBannerForm.value.PopUpGlobalTextColor,
          background: this.cookieBannerForm.value.PopUpGlobalBackgroundColor,
        },
        SwitchButton: {
          background: this.cookieBannerForm.value.PopUpSwitchButton
        },
        PurposeButton: {
          textColor: this.cookieBannerForm.value.PopUpPurposeButtonTextColor,
          background: this.cookieBannerForm.value.PopUpPurposeButtonBackgroundColor
        },
        DisableAllButton: {
          background: this.cookieBannerForm.value.PopUpDisableAllButtonBackgroundColor,
          textColor: this.cookieBannerForm.value.PopUpDisableAllButtonTextColor
        },
        DoNotSellButtonStylesAndContent: {
          textColor: this.cookieBannerForm.value.PopUpDoNotSellTextColor,
          background: this.cookieBannerForm.value.PopUpDoNotSellBackgroundColor
        },
        AllowAllButton: {
          background: this.cookieBannerForm.value.PopUpAllowAllButtonBackgroundColor,
          textColor: this.cookieBannerForm.value.PopUpAllowAllButtonTextColor
        },
        SaveMyChoiseButton: {
          background: this.cookieBannerForm.value.PopUpSaveMyChoiceButtonBackgroundColor,
          textColor: this.cookieBannerForm.value.PopUpSaveMyChoiceButtonTextColor
        }
      },
    };
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  onSetGdprGlobal(event: any, type: string) {
    if (event) {
      if (type === 'ccpa') {
        this.genericBannerConfig = false;
        this.gdprBannerConfig = false;
      }
      if (type === 'gdpr') {
        this.genericBannerConfig = false;
        this.ccpaBannerConfig = false;
      }
      if (type === 'generic') {
        this.ccpaBannerConfig = false;
        this.gdprBannerConfig = false;
      }
      if (this.cookieBannerForm.value.gdpr_global && this.cookieBannerForm.value.generic_global && type === 'ccpa') {
        alert('GDPR GLOBAL or GENERIC GLOBAL is Applied, Please turn off GDPR GLOBAL or GENERIC GLOBAL to apply CCPA Global');
        this.cookieBannerForm.patchValue({ccpa_global: false});
        return false;
      }
      if (this.cookieBannerForm.value.ccpa_global && this.cookieBannerForm.value.generic_global && type === 'gdpr') {
        alert('CCPA GLOBAL or GENERIC GLOBAL is Applied, Please turn off CCPA GLOBAL or GENERIC GLOBAL to apply GDPR Global');
        this.cookieBannerForm.patchValue({gdpr_global: false});
        return false;
      }

      if (this.cookieBannerForm.value.ccpa_global && this.cookieBannerForm.value.gdpr_global && type === 'generic') {
        alert('CCPA GLOBAL or GENERIC GLOBAL is Applied, Please turn off CCPA GLOBAL or GENERIC GLOBAL to apply GENERIC Global');
        this.cookieBannerForm.patchValue({generic_global: false});
        return false;
      }
      this.cookieBannerForm.get('gdprTarget').clearValidators();
      this.cookieBannerForm.get('ccpaTarget').clearValidators();

    } else {
      // this.cookieBannerForm.setValidators('gdprTarget', [])
      this.cookieBannerForm.controls.gdprTarget.setValidators(Validators.required);
      this.cookieBannerForm.controls.ccpaTarget.setValidators(Validators.required);
      // this.cookieBannerForm.setValidators([Validators.required);
    }
    this.cookieBannerForm.get('gdprTarget').updateValueAndValidity();
    this.cookieBannerForm.get('ccpaTarget').updateValueAndValidity();
  }

  onResetConfig() {
    this.modalRef = this.modalService.show(this.template1, {
      animated: false, keyboard: false, ignoreBackdropClick: true
    });
  }

  onCheckLogoAllow() {
    if (this.disablePlanFeatures.hideLogo) {
      this.dataService.openUpgradeModalForCookieConsent(this.planDetails);
    }
  }

  onCheckAllowGoogleVendors() {
    if (this.disablePlanFeatures.disableGoogleVendors) {
      this.dataService.openUpgradeModalForCookieConsent(this.planDetails);
    }
  }

  onCheckDisableCookiebloking() {
    if (this.disablePlanFeatures.disableCookieblocking) {
      this.dataService.openUpgradeModalForCookieConsent(this.planDetails);
    }
  }

  onCheckAllowBannerConfig() {
    if (this.disablePlanFeatures.disableBannerConfig) {
      this.dataService.openUpgradeModalForCookieConsent(this.planDetails);
    }
  }

  onKeyChanges($event, targetElement) {
    if ($event.target.value.length === 7) {
      this.cookieBannerForm.controls[targetElement].setValue($event.target.value);
    }
  }

  onColorChange($event, currentElement) {
    this.cookieBannerForm.controls[currentElement].setValue($event.target.value);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {ignoreBackdropClick: true});
  }

  onSelectLang(event, id ,chk) {
    const isChecked = event.target.checked;
    const allowLanguagesList = [...this.allowLanguagesList];
    if (isChecked) {
      allowLanguagesList.push(id);
      chk.checked;
    } else {
      const index = this.allowLanguagesList.indexOf(id);
      if (index > -1) {
        allowLanguagesList.splice(index, 1);
      }
    }
    this.allowLanguagesList = [];
    this.allowLanguagesList = allowLanguagesList;
  }

  onAllowAllLang(event) {
    const isChecked = event.target.checked;
    this.allowLanguagesList = [];
    if (isChecked) {
      for (const iabObj of this.bannerConstant.Bannerlanguage) {
        this.allowLanguagesList.push(iabObj.value);
      }
    } else {
      this.allowLanguagesList = [];
    }
  }

  onCheckBannerConfig($event) {
    if ($event.target.value === 'ccpa') {
      this.ccpaBannerConfig = $event.target.checked;
    } else if ($event.target.value === 'gdpr') {
      this.gdprBannerConfig = $event.target.checked;
    } else if ($event.target.value === 'generic') {
      this.genericBannerConfig = $event.target.checked;
    }
    if ($event.target.value === 'gdpr' || $event.target.value === 'ccpa') {
      if (!this.ccpaBannerConfig && !this.gdprBannerConfig) {
        this.genericBannerConfig = true;
      }
    }
  }

  onCheckFormChanges(e) {
    this.currentBannerlanguage = e.target.value;
    this.cd.detectChanges();
    if (this.cookieBannerForm.dirty) {
      this.modalRef = this.modalService.show(this.template2, {
        animated: false, keyboard: false, ignoreBackdropClick: true
      });
    } else {
      this.activeBannerlanguage = e.target.value;
      this.onGetLangData();
    }
  }

  onAssignPayload() {
    const langData: any = {...this.languageData};
    // Banner
    langData.CONFIG.BANNER.ACCEPT_ALL_BTN = this.cookieBannerForm.value.BannerAcceptAllButtonText;
    langData.CONFIG.BANNER.DESCRIPTION = this.cookieBannerForm.value.BannerDescription;
    langData.CONFIG.BANNER.PRIVACY_SETTINGS_BTN = this.cookieBannerForm.value.BannerPreferenceButtonText;
    langData.CONFIG.BANNER.DISABLE_ALL_BTN = this.cookieBannerForm.value.BannerDisableAllButtonText;
    langData.CONFIG.BANNER.DO_NOT_SELL_BTN = this.cookieBannerForm.value.BannerDoNotSellMyDataText;
    langData.CONFIG.BANNER.TITLE = this.cookieBannerForm.value.BannerTitle;
    langData.CONFIG.BANNER.PRIVACY = this.cookieBannerForm.value.privacyText;
    // Popup
    langData.CONFIG.POPUP.GDPR_PURPOSES_DESC = this.cookieBannerForm.value.PopUpGdprPurposeDescription;
    langData.CONFIG.POPUP.GDPR_VENDORS_DESC = this.cookieBannerForm.value.PopUpGdprVendorDescription;
    langData.CONFIG.POPUP.CCPA_AND_GENERIC_PURPOSES_DESC = this.cookieBannerForm.value.PopUpCcpaGenericPurposeDescription;
    langData.CONFIG.POPUP.CCPA_AND_GENERIC_PRIVACY_INFO_DESCRIPTION = this.cookieBannerForm.value.PopUpCcpaGenericPrivacyInfoDescription;
    langData.CONFIG.POPUP.PRIVACY_TEXT = this.cookieBannerForm.value.privacyText;
    langData.CONFIG.POPUP.DISABLE_ALL_BTN = this.cookieBannerForm.value.PopUpDisableAllButtonText;
    langData.CONFIG.POPUP.SAVE_MY_CHOICE_BTN = this.cookieBannerForm.value.PopUpSaveMyChoiceButtonText;
    langData.CONFIG.POPUP.ACCEPT_ALL_BTN = this.cookieBannerForm.value.PopUpAllowAllButtonText;
    langData.CONFIG.POPUP.DO_NOT_SELL_BTN = this.cookieBannerForm.value.PopUpDoNotSellText;
    // Purposes
    langData.PURPOSES[0].title = this.cookieBannerForm.value.EssentialTitle;
    langData.PURPOSES[0].description = this.cookieBannerForm.value.EssentialDescription;

    langData.PURPOSES[1].title = this.cookieBannerForm.value.FunctionalTitle;
    langData.PURPOSES[1].description = this.cookieBannerForm.value.FunctionalDescription;

    langData.PURPOSES[2].title = this.cookieBannerForm.value.AnalyticsTitle;
    langData.PURPOSES[2].description = this.cookieBannerForm.value.AnalyticsDescription;

    langData.PURPOSES[3].title = this.cookieBannerForm.value.AdvertisingTitle;
    langData.PURPOSES[3].description = this.cookieBannerForm.value.AdvertisingDescription;

    langData.PURPOSES[4].title = this.cookieBannerForm.value.SocialMediaTitle;
    langData.PURPOSES[4].description = this.cookieBannerForm.value.SocialMediaDescription;

    langData.PURPOSES[5].title = this.cookieBannerForm.value.UnknownTitle;
    langData.PURPOSES[5].description = this.cookieBannerForm.value.UnknownDescription;
    return langData;
  }

  onSaveCustomLang() {
    this.isOpen = true;
    this.alertMsg = '<span class="spinner-border spinner-border-sm txt-info" role="status"\n' +
      '                                  aria-hidden="true"></span> Saving your customization ...';
    this.alertType = 'info';
    const payload = JSON.stringify(this.onAssignPayload());
    this.loading.start('lang');
    this.cookieBannerService.saveCustomLang(payload, this.activeBannerlanguage, this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name, moduleName.manageVendorsModule)
      .subscribe(res => {
        if (res.status === 200) {
          const langPayload = {
            lang_code: this.activeBannerlanguage,
            lang_data: payload
          };
          this.cookieBannerService.saveCustomLangInDB(langPayload, this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name, moduleName.manageVendorsModule)
            .subscribe((res: any) => {
              if (res.status === 201) {
                this.loading.stop('lang');
                this.cookieBannerForm.markAsPristine();
                if (!this.saveCustomLang.includes(this.activeBannerlanguage)) {
                  this.saveCustomLang.push(this.activeBannerlanguage);
                }
                this.onGetLangData();
                this.activeBannerlanguage = this.currentBannerlanguage;
                this.onGetLangData();
                this.isOpen = true;
                this.alertMsg = 'Saved';
                this.alertType = 'success';
                this.type = 'draft';
                this.onSubmit();
              }
            }, error => {
              this.loading.stop('lang');
              this.isOpen = true;
              this.alertMsg = error;
              this.alertType = 'error';
            });
        } else {
          this.isOpen = true;
          this.alertMsg = 'Failed to Publish Language';
          this.alertType = 'error';
        }
      }, error => {
        this.loading.stop('lang');
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'error';
      });
  }

  onResetCustomConfig() {
    if (this.resetLang) {
      this.loading.start('lang');
      this.cookieBannerService.GetGlobleLangData(this.resetLang).subscribe(res => {
        this.isOpen = true;
        this.alertMsg = 'Language Reset Successfully';
        this.alertType = 'success';
        this.languageData = res;
        this.loading.stop('lang');
        this.cookieBannerForm.markAsPristine();
        this.onSetDynamicLang(res);
        const index = this.saveCustomLang.indexOf(this.resetLang);
        if (index !== -1) {
          this.saveCustomLang.splice(index, 1);
        }
        this.resetLang = null;
      }, error => {
        this.loading.stop('lang');
      });
    }
  }

  get onIsFieldDirty() {
    return this.cookieBannerForm.controls.BannerTitle.dirty ||
      this.cookieBannerForm.controls.BannerDescription.dirty ||
      this.cookieBannerForm.controls.BannerPreferenceButtonText.dirty ||
      this.cookieBannerForm.controls.privacyText.dirty ||
      this.cookieBannerForm.controls.privacyLink.dirty ||
      this.cookieBannerForm.controls.BannerAcceptAllButtonText.dirty ||
      this.cookieBannerForm.controls.BannerDisableAllButtonText.dirty ||
      this.cookieBannerForm.controls.BannerDoNotSellMyDataText.dirty ||
      this.cookieBannerForm.controls.PopUpGdprPurposeDescription.dirty ||
      this.cookieBannerForm.controls.PopUpGdprVendorDescription.dirty ||
      this.cookieBannerForm.controls.PopUpCcpaGenericPurposeDescription.dirty ||
      this.cookieBannerForm.controls.PopUpCcpaGenericPrivacyInfoDescription.dirty ||
      this.cookieBannerForm.controls.PopUpDisableAllButtonText.dirty ||
      this.cookieBannerForm.controls.PopUpDoNotSellText.dirty ||
      this.cookieBannerForm.controls.PopUpSaveMyChoiceButtonText.dirty ||
      this.cookieBannerForm.controls.PopUpAllowAllButtonText.dirty ||
      this.cookieBannerForm.controls.EssentialTitle.dirty ||
      this.cookieBannerForm.controls.EssentialDescription.dirty ||
      this.cookieBannerForm.controls.FunctionalTitle.dirty ||
      this.cookieBannerForm.controls.FunctionalDescription.dirty ||
      this.cookieBannerForm.controls.AnalyticsTitle.dirty ||
      this.cookieBannerForm.controls.AnalyticsDescription.dirty ||
      this.cookieBannerForm.controls.AdvertisingTitle.dirty ||
      this.cookieBannerForm.controls.AdvertisingDescription.dirty ||
      this.cookieBannerForm.controls.SocialMediaTitle.dirty ||
      this.cookieBannerForm.controls.SocialMediaDescription.dirty ||
      this.cookieBannerForm.controls.UnknownTitle.dirty ||
      this.cookieBannerForm.controls.SocialMediaDescription.dirty;
  }

  onSaveAllowedLang() {
    this.allowedLanguageListObj = {
      allowedLang: this.allowLanguagesList,
      defaultLang: this.defaultLanguage
    };
  }

  onCancelLang() {
    this.allowLanguagesList = [];
    this.allowLanguagesList = this.allowedLanguageListObj.allowedLang;
    this.defaultLanguage = this.allowedLanguageListObj.defaultLang;
    this.cd.detectChanges();
  }
  hasUnsavedData() {
    return this.cookieBannerForm.dirty;
  }
  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if (this.hasUnsavedData()) {
      $event.returnValue = true;
    }
  }
  onShowPopUp(e) {
    this.currentState = 'popup';
  }
}
