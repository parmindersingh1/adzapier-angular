import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormControl, Validators, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {
  BannerConstant,
  defaultData,
  FormDefaultData,
  IabPurposeIds,
  defaultBannerContent
} from '../../../_constant/consent-banner.constant';
import {CookieBannerService} from '../../../_services/cookie-banner.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {OrganizationService} from '../../../_services';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {moduleName} from '../../../_constant/module-name.constant';
import { CookieCategoryService } from 'src/app/_services/cookie-category.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from 'src/app/_services/data.service';
import { featuresName } from 'src/app/_constant/features-name.constant';


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
  @ViewChild('template', { static: true}) template: ElementRef;
  @ViewChild('template1', { static: true}) template1: ElementRef;
  modalRef: BsModalRef;
  // @ViewChild('showConfig', {static: false}) showConfig : ElementRef;
  skeletonLoading = true;
  type = 'draft';
  matcher = new MyErrorStateMatcher();
  currentPlan;
  gdprTarget = [];
  currentState = 'banner';
  data = { ...defaultBannerContent};
  formContent: any = { ...defaultBannerContent};
  isFieldDisabled = null;
  bannerCookieData = null;
  isGdprGlobal = false;
  dismissible = true;
  alertMsg: any;
  isEdit = false;
  isOpen = false;
  alertType: any;
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
  }
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: 1 }, { header: 2 }],
        ['link'],
        [{ color: [] }],          // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],
        [{ size: ['small', false, 'large', 'huge'] }]
      ]
    }
  };

  public isPublish: boolean;

  constructor(private formBuilder: FormBuilder,
              private cd: ChangeDetectorRef,
              private modalService: BsModalService,
              private cookieBannerService: CookieBannerService,
              private cookieCategoryService: CookieCategoryService,
              private loading: NgxUiLoaderService,
              private  orgservice: OrganizationService,
              private _location: Location,
              private router: Router,
              private dataService: DataService
  ) {

  }

  cookieBannerForm: FormGroup;
  submitted = true;

  ngOnInit() {
    // window.scroll(0, 500)
    this.onGetCookies();
    this.onFormInIt();
    this.onSetDefaultValue();
    this.gdprTarget = this.bannerConstant.gdprTargetCountry;
    this.onGetPropsAndOrgId();
    this.onGetCurrentPlan();
    this.onGetCookieBannerData();
  }

  ngAfterViewInit(){
    this.planDetails = this.dataService.getCurrentPropertyPlanDetails();
    // debugger
    const isAllowLogo = this.dataService.isAllowFeatureByYes(this.planDetails, featuresName.REMOVE_ADZAPIER_LOGO);
    const isAllowGoogleVendors = this.dataService.isAllowFeatureByYes(this.planDetails, featuresName.GOOGLE_VENDORS);
    const isThridPartyBlock = this.dataService.isAllowFeatureByYes(this.planDetails, featuresName.THIRD_PARTY_COOKIE_BLOCKING);
    const isBannerConfig= this.dataService.isAllowFeatureByYes(this.planDetails, featuresName.HIGHLY_BANNER_CONFIG);

  this.disablePlanFeatures = {
    hideLogo: !isAllowLogo,
    disableGoogleVendors: !isAllowGoogleVendors,
    disableCookieblocking: !isThridPartyBlock,
    disableBannerConfig: !isBannerConfig
  }
  }

  onGetCookieBannerData() {
    this.loading.start('2');
    this.cookieBannerService.onGetCookieBannerData( this.currentManagedOrgID ,  this.currrentManagedPropID, this.constructor.name, moduleName.cookieBannerModule)
      .subscribe((res: any) => {
        this.loading.stop('2');
        if (res.status === 200 && res.hasOwnProperty('response')) {
          this.bannerCookieData = res.response;
          this.onSetValueConfig();
          this.onSetValue();
          this.isEdit = true;
        }
      }, error => {
        this.loading.stop('2');
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
      });

  }

  onSetValueConfig() {
    const configData: any = this.bannerCookieData;
    if ( configData.gdpr_global === 'true' || configData.gdpr_global === true) {
      this.cookieBannerForm.get('gdprTarget').clearValidators();
    }
    this.cookieBannerForm.get('gdprTarget').updateValueAndValidity();

    this.cookieBannerForm.patchValue({
      ccpaTarget: configData.ccpa_target,
      gdprTarget: configData.gdpr_target,
      gdpr_global: configData.gdpr_global === 'true' || configData.gdpr_global === true ? true : false,
      cookieBlocking: configData.cookie_blocking,
      enableIab: configData.enable_iab,
      email: configData.email,
      google_vendors: configData.google_vendors,
      showBadge: configData.show_badge,
      logo: configData.logo
    });
  }

  onGetCookies() {
    this.loading.start();
    this.cookieCategoryService.getCookieData({}, this.constructor.name, moduleName).subscribe((res: any) => {
      this.loading.stop();
      if (res.response.length === 0){
      this.modalRef = this.modalService.show(this.template, { animated: false,    keyboard: false,     ignoreBackdropClick: true
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
  onGetCurrentPlan() {
    this.loading.start('1');
    this.skeletonLoading = true;
    this.cookieBannerService.onGetPlanType(this.constructor.name, moduleName.cookieBannerModule)
      .subscribe((res: any) => {
        this.skeletonLoading = false;
        this.loading.stop('1');
        const planType = res.response;
        if (planType.GDPR) {
          this.currentPlan = 'GDPR';
        } else {
          this.currentPlan = 'CCPA';
          this.cookieBannerForm.get('gdprTarget').clearValidators();
          this.cookieBannerForm.get('gdprTarget').updateValueAndValidity();
        }
      }, error => {
        this.skeletonLoading = false;
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
        this.loading.stop('1');
      });
  }

  onFormInIt() {
    this.cookieBannerForm = this.formBuilder.group({
      ccpaTarget: ['', Validators.required],
      gdprTarget: ['', Validators.required],
      cookieBlocking: [this.defaultData.defaultCookieBlocking],
      enableIab: [this.defaultData.defaultEnableIab],
      email: [this.defaultData.defaultEmail],
      google_vendors: [this.defaultData.google_vendors],
      gdpr_global: [this.defaultData.gdprGlobal],
      showBadge: [this.defaultData.showBadge],
      logo: [this.defaultData.logo],
      // DISPLAY FREQUENCY
      bannerPartialConsent: [1],
      bannerPartialConsentType: [this.defaultData.BannerDisplayFrequency.partialConsent],
      bannerRejectAllConsent: [1],
      bannerRejectAllConsentType: [this.defaultData.BannerDisplayFrequency.rejectAll],
      bannerClosedConsent: [1],
      bannerClosedConsentType: [this.defaultData.BannerDisplayFrequency.noConsent],
      //  BANNER
      privacyText: [this.data.privacy],
      privacyLink: [this.data.privacyLink],
      privacyTextColor: [this.data.privacyTextColor],
      //

      //
      Bannerlanguage: [this.defaultData.gdprDefaultLang],
      BannerPosition: [this.defaultData.DefaultBannerPosition],
      BadgePosition: [this.defaultData.DefaultBadgePosition],
      BannerTitle: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      BannerTitle2: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      BannerDescription: ['',  [Validators.minLength(20)]],
      BannerGlobalStyleTextColor: [''],
      BannerGlobalStyleBorderColor: [''],
      BannerGlobalStyleBackgroundColor: [''],
      BannerPreferenceButtonTextContent: ['', [Validators.minLength(2), Validators.maxLength(25)]],
      BannerPreferenceButtonTextColor: [''],
      BannerPreferenceButtonBackgroundColor: [''],
      BannerAllowAllButtonTextContent: ['', [Validators.minLength(2), Validators.maxLength(25)]],
      BannerAllowAllButtonTextColor: [''],
      BannerAllowAllButtonBackgroundColor: [''],
      BannerAllowRequiredTextContent: ['', [Validators.minLength(2), Validators.maxLength(25)]],
      BannerAllowRequiredButtonTextColor: [''],
      BannerAllowRequiredButtonBackgroundColor: [''],
      BannerDisableAllButtonTextContent: ['', [Validators.minLength(2), Validators.maxLength(25)]],
      BannerDisableAllButtonTextColor: [''],
      BannerDisableAllButtonBackgroundColor: [''],
      bannerDoNotSellMyDataTextContent: ['',  [Validators.minLength(2), Validators.maxLength(25)]],
      bannerDoNotSellMyDataTextColor: [''],
      bannerDoNotSellMyDataBackGroundColor: [''],
      //  POPUP
      PopUpPurposeBodyDescription: ['', [Validators.minLength(20), Validators.maxLength(300)]],
      PopUpVendorBodyDescription: ['', [Validators.minLength(20), Validators.maxLength(300)]],
      PopUpSwitchButton: [''],
      PopUpGlobalTextColor: [''],
      PopUpGlobalBackgroundColor: [''],
      PopUpPurposeButtonTextColor: [''],
      PopUpPurposeButtonBackgroundColor: [''],
      PopUpPurposeButtonBorderColor: [''],
      PopUpDisableAllButtonTextContent: ['', [Validators.minLength(2), Validators.maxLength(25)]],
      PopUpDisableAllButtonTextColor: [''],
      PopUpDisableAllButtonBackgroundColor: [''],
      popUpDoNotSellTextContent: ['',  [Validators.minLength(2), Validators.maxLength(25)]],
      popUpDoNotSellTextColor: [''],
      popUpDoNotSellBackgroundColor: [''],
      PopUpSaveMyChoiceButtonContentText: ['', [Validators.minLength(2), Validators.maxLength(25)]],
      PopUpSaveMyChoiceButtonTextColor: [''],
      PopUpSaveMyChoiceButtonBackgroundColor: [''],
      PopUpAllowAllButtonTextContent: ['', [Validators.minLength(2), Validators.maxLength(25)]],
      PopUpAllowAllButtonTextColor: [''],
      PopUpAllowAllButtonBackgroundColor: [''],
      PopUpSocialMediaHeading: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      // informationBtnText: [BannerConstant.CCPA.POPUP.PopUpInformationBtnText],
      PopUpSocialMediaDescription: ['', [Validators.minLength(20), Validators.maxLength(300)]],
      PopUpNecessaryHeading: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      // necessaryBtnText: [BannerConstant.CCPA.POPUP.necessaryBtnText],
      PopUpNecessaryDescription: ['', [Validators.minLength(20), Validators.maxLength(300)]],
      PopUpAnalyticsHeading: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      // analyticsBtnText: [BannerConstant.CCPA.POPUP.advertisingBtnText],
      PopUpAnalyticsDescription: ['', [Validators.minLength(20), Validators.maxLength(300)]],
      PopUpAdvertisingHeading: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      // advertisingBtnText: [BannerConstant.CCPA.POPUP.advertisingBtnText],
      PopUpAdvertisingDescription: ['', [Validators.minLength(20), Validators.maxLength(300)]],
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
      BannerPreferenceButtonTextContent: this.data.bannerPreferenceButtonTextContent,
      BannerPreferenceButtonTextColor: this.data.bannerPreferenceButtonTextColor,
      BannerPreferenceButtonBackgroundColor: this.data.bannerPreferenceButtonBackGroundColor,
      BannerAllowAllButtonTextContent: this.data.bannerAcceptButtonTextContent,
      BannerAllowAllButtonTextColor: this.data.bannerAcceptButtonTextColor,
      BannerAllowAllButtonBackgroundColor: this.data.bannerAcceptButtonBackgroundColor,
      // BannerAllowRequiredTextContent: this.bannerCookieData.config.Banner.AllowReqButtonStylesAndContent.textContent,
      // BannerAllowRequiredButtonTextColor: this.bannerCookieData.config.Banner.AllowReqButtonStylesAndContent.textColor,
      // BannerAllowRequiredButtonBackgroundColor: this.bannerCookieData.config.Banner.AllowReqButtonStylesAndContent.background,
      BannerDisableAllButtonTextContent: this.data.bannerDisableButtonTextContent,
      BannerDisableAllButtonTextColor: this.data.bannerDisableButtonTextColor,
      BannerDisableAllButtonBackgroundColor: this.data.bannerDisableButtonBackGroundColor,

      bannerDoNotSellMyDataTextContent: this.data.bannerDoNotSellMyDataTextContent,
      bannerDoNotSellMyDataTextColor: this.data.bannerDoNotSellMyDataTextColor,
      bannerDoNotSellMyDataBackGroundColor: this.data.bannerDoNotSellMyDataBackGroundColor,
      //  POPUP
      PopUpPurposeBodyDescription: this.data.popUpPurposeDescription,
      PopUpVendorBodyDescription: this.data.popUpVendorsDescription,
      // PopUpGlobalTextColor: this.bannerCookieData.config.POPUP.GlobalStyles.textColor,
      PopUpSwitchButton:  this.data.popUpSwitchButtonColor,
      // PopUpGlobalBackgroundColor: this.bannerCookieData.config.POPUP.GlobalStyles.backgroundColor,
      PopUpPurposeButtonTextColor: this.data.popUpPurposeButtonTextColor,
      PopUpPurposeButtonBackgroundColor: this.data.popUpPurposeButtonBackGroundColor,
      // // PopUpPurposeButtonBorderColor: this.bannerCookieData.CONFIG,
      PopUpDisableAllButtonTextContent: this.data.popUpDisableAllButtonTextContent,
      PopUpDisableAllButtonTextColor: this.data.popUpDisableAllButtonTextColor,
      PopUpDisableAllButtonBackgroundColor: this.data.popUpDisableAllButtonBackgroundColor,
      popUpDoNotSellTextContent: this.data.popUpDoNotSellTextContent,
      popUpDoNotSellTextColor: this.data.popUpDoNotSellTextColor,
      popUpDoNotSellBackgroundColor: this.data.popUpDoNotSellBackgroundColor,
      PopUpSaveMyChoiceButtonContentText: this.data.popUpSaveMyChoiceButtonTextContent,
      PopUpSaveMyChoiceButtonTextColor: this.data.popUpSaveMyChoiceButtonTextColor,
      PopUpSaveMyChoiceButtonBackgroundColor: this.data.popUpSaveMyChoiceButtonBackgroundColor,
      PopUpAllowAllButtonTextContent: this.data.popUpAllowAllButtonTextContent,
      PopUpAllowAllButtonTextColor: this.data.popUpAllowAllButtonTextColor,
      PopUpAllowAllButtonBackgroundColor: this.data.popUpAllowAllButtonBackgroundColor,
      //
      PopUpAdvertisingHeading: this.data.PopUpAdvertisingHead,
      advertisingBtnText: this.data.AdvertisingText,
      PopUpAdvertisingDescription: this.data.PopUpAdvertisingDescription,

      PopUpSocialMediaHeading: this.data.PopUpSocialMediaHead,
      socialMediaBtnText: this.data.SocialMediaText,
      PopUpSocialMediaDescription: this.data.PopUpSocialMediaDescription,

      PopUpAnalyticsHeading: this.data.PopUpAnalyticsHead,
      analyticsBtnText: this.data.AnalyticsText,
      PopUpAnalyticsDescription: this.data.PopUpAnalyticsDescription,

      PopUpNecessaryHeading: this.data.PopUpNecessaryHead,
      necessaryBtnText: this.data.NecessaryText,
      PopUpNecessaryDescription: this.data.PopUpNecessaryDescription,
    });
    this.formContent = { ...defaultBannerContent};
    // console.log('datasfdafsd', this.formContent.)
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

      Bannerlanguage: this.bannerCookieData.config.Language,
      BadgePosition: this.bannerCookieData.config.BadgePosition,
      BannerPosition: this.bannerCookieData.config.BannerPosition,
      //
      privacyText: this.bannerCookieData.config.Banner.Privacy.textContent,
      privacyLink: this.bannerCookieData.config.Banner.Privacy.privacyLink,
      privacyTextColor: this.bannerCookieData.config.Banner.Privacy.textColor,

      BannerTitle: this.bannerCookieData.config.Banner.Content.title ? this.bannerCookieData.config.Banner.Content.title : this.data.bannerTitle,
      BannerTitle2: this.bannerCookieData.config.Banner.Content.title2 ? this.bannerCookieData.config.Banner.Content.title2 : this.data.bannerTitle2,
      BannerDescription: this.bannerCookieData.config.Banner.Content.description ? this.bannerCookieData.config.Banner.Content.description : this.data.bannerDescription,
      BannerGlobalStyleTextColor: this.bannerCookieData.config.Banner.GlobalStyles.textColor,
      BannerGlobalStyleBorderColor: this.bannerCookieData.config.Banner.GlobalStyles.borderColor,
      BannerGlobalStyleBackgroundColor: this.bannerCookieData.config.Banner.GlobalStyles.background,
      BannerPreferenceButtonTextContent: this.bannerCookieData.config.Banner.PreferenceButtonStylesAndContent.textContent ? this.bannerCookieData.config.Banner.PreferenceButtonStylesAndContent.textContent : this.data.bannerPreferenceButtonTextContent,
      BannerPreferenceButtonTextColor: this.bannerCookieData.config.Banner.PreferenceButtonStylesAndContent.textColor,
      BannerPreferenceButtonBackgroundColor: this.bannerCookieData.config.Banner.PreferenceButtonStylesAndContent.background,
      BannerAllowAllButtonTextContent: this.bannerCookieData.config.Banner.AllowAllButtonStylesAndContent.textContent ? this.bannerCookieData.config.Banner.AllowAllButtonStylesAndContent.textContent : this.data.bannerAcceptButtonTextContent,
      BannerAllowAllButtonTextColor: this.bannerCookieData.config.Banner.AllowAllButtonStylesAndContent.textColor,
      BannerAllowAllButtonBackgroundColor: this.bannerCookieData.config.Banner.AllowAllButtonStylesAndContent.background,
      BannerAllowRequiredTextContent: this.bannerCookieData.config.Banner.AllowReqButtonStylesAndContent.textContent ? this.bannerCookieData.config.Banner.AllowReqButtonStylesAndContent.textContent : this.data.bannerAllowReqButtonTextContent,
      BannerAllowRequiredButtonTextColor: this.bannerCookieData.config.Banner.AllowReqButtonStylesAndContent.textColor,
      BannerAllowRequiredButtonBackgroundColor: this.bannerCookieData.config.Banner.AllowReqButtonStylesAndContent.background,
      BannerDisableAllButtonTextContent: this.bannerCookieData.config.Banner.DisableAllButtonStylesAndContent.textContent ? this.bannerCookieData.config.Banner.DisableAllButtonStylesAndContent.textContent : this.data.bannerDisableButtonTextContent,
      BannerDisableAllButtonTextColor: this.bannerCookieData.config.Banner.DisableAllButtonStylesAndContent.textColor,
      BannerDisableAllButtonBackgroundColor: this.bannerCookieData.config.Banner.DisableAllButtonStylesAndContent.background,

      bannerDoNotSellMyDataTextContent: this.bannerCookieData.config.Banner.DoNotSellButtonStylesAndContent.textContent ? this.bannerCookieData.config.Banner.DoNotSellButtonStylesAndContent.textContent : this.data.bannerDoNotSellMyDataTextContent,
      bannerDoNotSellMyDataTextColor: this.bannerCookieData.config.Banner.DoNotSellButtonStylesAndContent.textColor,
      bannerDoNotSellMyDataBackGroundColor: this.bannerCookieData.config.Banner.DoNotSellButtonStylesAndContent.background,
      //  POPUP
      PopUpPurposeBodyDescription: this.bannerCookieData.config.POPUP.Content.PurposeBodyDescription ? this.bannerCookieData.config.POPUP.Content.PurposeBodyDescription : this.data.popUpPurposeDescription,
      PopUpVendorBodyDescription: this.bannerCookieData.config.POPUP.Content.VendorBodyDescription ? this.bannerCookieData.config.POPUP.Content.VendorBodyDescription : this.data.popUpVendorsDescription,
      PopUpGlobalTextColor: this.bannerCookieData.config.POPUP.GlobalStyles.textColor,
      PopUpSwitchButton: this.bannerCookieData.config.POPUP.SwitchButton.backgroundColor,
      PopUpGlobalBackgroundColor: this.bannerCookieData.config.POPUP.GlobalStyles.backgroundColor,
      PopUpPurposeButtonTextColor: this.bannerCookieData.config.POPUP.PurposeButton.textColor,
      PopUpPurposeButtonBackgroundColor: this.bannerCookieData.config.POPUP.PurposeButton.backgroundColor,
      // PopUpPurposeButtonBorderColor: this.bannerCookieData.CONFIG,
      PopUpDisableAllButtonTextContent: this.bannerCookieData.config.POPUP.DisableAllButton.textContent ? this.bannerCookieData.config.POPUP.DisableAllButton.textContent : this.data.popUpDisableAllButtonTextContent,
      PopUpDisableAllButtonTextColor: this.bannerCookieData.config.POPUP.DisableAllButton.textColor,
      PopUpDisableAllButtonBackgroundColor: this.bannerCookieData.config.POPUP.DisableAllButton.backgroundColor,
      PopUpSaveMyChoiceButtonContentText: this.bannerCookieData.config.POPUP.SaveMyChoiseButton.textContent ? this.bannerCookieData.config.POPUP.SaveMyChoiseButton.textContent : this.data.popUpSaveMyChoiceButtonTextContent,
      PopUpSaveMyChoiceButtonTextColor: this.bannerCookieData.config.POPUP.SaveMyChoiseButton.textColor,
      PopUpSaveMyChoiceButtonBackgroundColor: this.bannerCookieData.config.POPUP.SaveMyChoiseButton.backgroundColor,
      PopUpAllowAllButtonTextContent: this.bannerCookieData.config.POPUP.AllowAllButton.textContent ?  this.bannerCookieData.config.POPUP.AllowAllButton.textContent : this.data.popUpAllowAllButtonTextContent,
      PopUpAllowAllButtonTextColor: this.bannerCookieData.config.POPUP.AllowAllButton.textColor,
      PopUpAllowAllButtonBackgroundColor: this.bannerCookieData.config.POPUP.AllowAllButton.backgroundColor,

      popUpDoNotSellTextContent: this.bannerCookieData.config.POPUP.DoNotSellButtonStylesAndContent.textContent ? this.bannerCookieData.config.POPUP.DoNotSellButtonStylesAndContent.textContent : this.data.popUpDoNotSellTextContent,
      popUpDoNotSellTextColor: this.bannerCookieData.config.POPUP.DoNotSellButtonStylesAndContent.textColor,
      popUpDoNotSellBackgroundColor: this.bannerCookieData.config.POPUP.DoNotSellButtonStylesAndContent.backgroundColor,
      // PopUpInformationHeading: this.bannerCookieData.config.POPUP.PurposeBody[0].heading,
      // informationBtnText: this.bannerCookieData.config.POPUP.PurposeBody[0].title,
      // PopUpInformationDescription: this.bannerCookieData.config.POPUP.PurposeBody[0].description,

      // PopUpNecessaryHeading: this.bannerCookieData.config.POPUP.PurposeBody[1].heading,
      // necessaryBtnText: this.bannerCookieData.config.POPUP.PurposeBody[1].title,
      // PopUpNecessaryDescription: this.bannerCookieData.config.POPUP.PurposeBody[1].description,


      // PopUpAdvertisingHeading: this.bannerCookieData.config.POPUP.PurposeBody[3].heading,
      // advertisingBtnText: this.bannerCookieData.config.POPUP.PurposeBody[3].title,
      // PopUpAdvertisingDescription: this.bannerCookieData.config.POPUP.PurposeBody[3].description,
    });
    if (this.bannerCookieData.config.POPUP.PurposeBody.length > 0) {
      this.cookieBannerForm.patchValue({
        PopUpNecessaryHeading: this.bannerCookieData.config.POPUP.PurposeBody[0].heading,
        necessaryBtnText: this.bannerCookieData.config.POPUP.PurposeBody[0].title,
        PopUpNecessaryDescription: this.bannerCookieData.config.POPUP.PurposeBody[0].description,

        PopUpAdvertisingHeading: this.bannerCookieData.config.POPUP.PurposeBody[1].heading,
        advertisingBtnText: this.bannerCookieData.config.POPUP.PurposeBody[1].title,
        PopUpAdvertisingDescription: this.bannerCookieData.config.POPUP.PurposeBody[1].description,

        PopUpSocialMediaHeading: this.bannerCookieData.config.POPUP.PurposeBody[2].heading,
        socialMediaBtnText: this.bannerCookieData.config.POPUP.PurposeBody[2].title,
        PopUpSocialMediaDescription: this.bannerCookieData.config.POPUP.PurposeBody[2].description,

        PopUpAnalyticsHeading: this.bannerCookieData.config.POPUP.PurposeBody[3].heading,
        analyticsBtnText: this.bannerCookieData.config.POPUP.PurposeBody[3].title,
        PopUpAnalyticsDescription: this.bannerCookieData.config.POPUP.PurposeBody[3].description,
      });
      this.formContent.PopUpNecessaryHead = this.bannerCookieData.config.POPUP.PurposeBody[0].heading;
      this.formContent.NecessaryText = this.bannerCookieData.config.POPUP.PurposeBody[0].title;
      this.formContent.PopUpNecessaryDescription = this.bannerCookieData.config.POPUP.PurposeBody[0].description;

      this.formContent.PopUpAdvertisingHead = this.bannerCookieData.config.POPUP.PurposeBody[1].heading;
      this.formContent.AdvertisingText = this.bannerCookieData.config.POPUP.PurposeBody[1].title;
      this.formContent.PopUpAdvertisingDescription = this.bannerCookieData.config.POPUP.PurposeBody[1].description;

      this.formContent.PopUpSocialMediaHead = this.bannerCookieData.config.POPUP.PurposeBody[2].heading;
      this.formContent.SocialMediaText = this.bannerCookieData.config.POPUP.PurposeBody[2].title;
      this.formContent.PopUpSocialMediaDescription = this.bannerCookieData.config.POPUP.PurposeBody[2].description;

      this.formContent.PopUpAnalyticsHead = this.bannerCookieData.config.POPUP.PurposeBody[3].heading;
      this.formContent.AnalyticsText = this.bannerCookieData.config.POPUP.PurposeBody[3].title;
      this.formContent.PopUpAnalyticsDescription = this.bannerCookieData.config.POPUP.PurposeBody[3].description;

    }


    this.formContent.position = this.bannerCookieData.config.BannerPosition;
    //
    this.formContent.bannerTitle = this.bannerCookieData.config.Banner.Content.title ? this.bannerCookieData.config.Banner.Content.title : this.data.bannerTitle;
    this.formContent.bannerTitle2 = this.bannerCookieData.config.Banner.Content.title2 ? this.bannerCookieData.config.Banner.Content.title2 : this.data.bannerTitle2;
    this.formContent.bannerDescription = this.bannerCookieData.config.Banner.Content.description ? this.bannerCookieData.config.Banner.Content.description : this.data.bannerDescription;
    this.formContent.bannerTextColor = this.bannerCookieData.config.Banner.GlobalStyles.textColor;
    this.formContent.bannerBackGroundColor = this.bannerCookieData.config.Banner.GlobalStyles.background;
    this.formContent.bannerPreferenceButtonTextContent = this.bannerCookieData.config.Banner.PreferenceButtonStylesAndContent.textContent ? this.bannerCookieData.config.Banner.PreferenceButtonStylesAndContent.textContent : this.data.bannerPreferenceButtonTextContent;
    this.formContent.bannerPreferenceButtonTextColor = this.bannerCookieData.config.Banner.PreferenceButtonStylesAndContent.textColor;
    this.formContent.bannerPreferenceButtonBackGroundColor = this.bannerCookieData.config.Banner.PreferenceButtonStylesAndContent.background,
      this.formContent.bannerAcceptButtonTextContent = this.bannerCookieData.config.Banner.AllowAllButtonStylesAndContent.textContent ? this.bannerCookieData.config.Banner.AllowAllButtonStylesAndContent.textContent : this.data.bannerAcceptButtonTextContent,
      this.formContent.bannerAcceptButtonTextColor = this.bannerCookieData.config.Banner.AllowAllButtonStylesAndContent.textColor;
    this.formContent.bannerAcceptButtonBackgroundColor = this.bannerCookieData.config.Banner.AllowAllButtonStylesAndContent.background;
    this.formContent.bannerAllowReqButtonTextContent = this.bannerCookieData.config.Banner.AllowReqButtonStylesAndContent.textContent ? this.bannerCookieData.config.Banner.AllowReqButtonStylesAndContent.textContent : this.data.bannerAllowReqButtonTextContent;
    this.formContent.bannerAllowReqButtonTextColor = this.bannerCookieData.config.Banner.AllowReqButtonStylesAndContent.textColor;
    this.formContent.bannerAllowReqButtonBackgroundColor = this.bannerCookieData.config.Banner.AllowReqButtonStylesAndContent.background;
    this.formContent.bannerDisableButtonTextContent = this.bannerCookieData.config.Banner.DisableAllButtonStylesAndContent.textContent ? this.bannerCookieData.config.Banner.DisableAllButtonStylesAndContent.textContent : this.data.bannerDisableButtonTextContent;
    this.formContent.bannerDisableButtonTextColor = this.bannerCookieData.config.Banner.DisableAllButtonStylesAndContent.textColor;
    this.formContent.bannerDisableButtonBackGroundColor = this.bannerCookieData.config.Banner.DisableAllButtonStylesAndContent.background;
    this.formContent.bannerDoNotSellMyDataTextContent = this.bannerCookieData.config.Banner.DoNotSellButtonStylesAndContent.textContent ? this.bannerCookieData.config.Banner.DoNotSellButtonStylesAndContent.textContent : this.data.bannerDoNotSellMyDataTextContent;
    this.formContent.bannerDoNotSellMyDataTextColor = this.bannerCookieData.config.Banner.DoNotSellButtonStylesAndContent.textColor;
    this.formContent.bannerDoNotSellMyDataBackGroundColor = this.bannerCookieData.config.Banner.DoNotSellButtonStylesAndContent.background;

      //  POPUP
    this.formContent.popUpPurposeDescription = this.bannerCookieData.config.POPUP.Content.PurposeBodyDescription ? this.bannerCookieData.config.POPUP.Content.PurposeBodyDescription : this.data.popUpPurposeDescription;
    this.formContent.popUpVendorsDescription = this.bannerCookieData.config.POPUP.Content.VendorBodyDescription ? this.bannerCookieData.config.POPUP.Content.VendorBodyDescription : this.data.popUpVendorsDescription;
    // this.formContent.popUpPurposeButtonTextColor =  this.bannerCookieData.config.POPUP.GlobalStyles.textColor;
    this.formContent.popUpSwitchButtonColor = this.bannerCookieData.config.POPUP.SwitchButton.backgroundColor;
    // this.formContent.PopUpGlobalBackgroundColor =  this.bannerCookieData.config.POPUP.GlobalStyles.backgroundColor;
    this.formContent.popUpPurposeButtonTextColor = this.bannerCookieData.config.POPUP.PurposeButton.textColor;
    this.formContent.popUpPurposeButtonBackGroundColor = this.bannerCookieData.config.POPUP.PurposeButton.backgroundColor;
    // PopUpPurposeButtonBorderColor =  this.bannerCookieData.CONFIG;
    this.formContent.popUpDisableAllButtonTextContent = this.bannerCookieData.config.POPUP.DisableAllButton.textContent ? this.bannerCookieData.config.POPUP.DisableAllButton.textContent : this.data.popUpDisableAllButtonTextContent;
    this.formContent.popUpDisableAllButtonTextColor = this.bannerCookieData.config.POPUP.DisableAllButton.textColor;
    this.formContent.popUpDisableAllButtonBackgroundColor = this.bannerCookieData.config.POPUP.DisableAllButton.backgroundColor;
    this.formContent.popUpSaveMyChoiceButtonTextContent = this.bannerCookieData.config.POPUP.SaveMyChoiseButton.textContent ? this.bannerCookieData.config.POPUP.SaveMyChoiseButton.textContent : this.data.popUpSaveMyChoiceButtonTextContent;
    this.formContent.popUpSaveMyChoiceButtonTextColor = this.bannerCookieData.config.POPUP.SaveMyChoiseButton.textColor;
    this.formContent.popUpSaveMyChoiceButtonBackgroundColor = this.bannerCookieData.config.POPUP.SaveMyChoiseButton.backgroundColor;
    this.formContent.popUpAllowAllButtonTextContent = this.bannerCookieData.config.POPUP.AllowAllButton.textContent ? this.bannerCookieData.config.POPUP.AllowAllButton.textContent : this.data.popUpAllowAllButtonTextContent;
    this.formContent.popUpAllowAllButtonTextColor = this.bannerCookieData.config.POPUP.AllowAllButton.textColor;
    this.formContent.popUpAllowAllButtonBackgroundColor = this.bannerCookieData.config.POPUP.AllowAllButton.backgroundColor;
    this.formContent.popUpDoNotSellTextContent = this.bannerCookieData.config.POPUP.DoNotSellButtonStylesAndContent.textContent ? this.bannerCookieData.config.POPUP.DoNotSellButtonStylesAndContent.textContent : this.data.popUpDoNotSellTextContent;
    this.formContent.popUpDoNotSellTextColor = this.bannerCookieData.config.POPUP.DoNotSellButtonStylesAndContent.textColor;
    this.formContent.popUpDoNotSellBackgroundColor = this.bannerCookieData.config.POPUP.DoNotSellButtonStylesAndContent.backgroundColor;
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

      console.log('abc', this.cookieBannerForm.value.gdprTarget);
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
      show_badge: this.cookieBannerForm.value.showBadge,
      CONFIG: this.onGetFormData()
    };
    console.log(' this.onGetFormData()',  JSON.stringify(this.onGetFormData()));

    this.isPublish = true;
    this.loading.start();
    this.cookieBannerService.onSubmitCookieBannerData(userPrefrencesData, this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name , moduleName.cookieBannerModule)
      .subscribe((res: any) => {
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
      gdpr_target: this.cookieBannerForm.value.gdprTarget,
      cookie_blocking: this.cookieBannerForm.value.cookieBlocking,
      enable_iab: this.cookieBannerForm.value.enableIab,
      email: this.cookieBannerForm.value.email,
      google_vendors: this.cookieBannerForm.value.google_vendors,
      show_badge: this.cookieBannerForm.value.showBadge,
      CONFIG: this.onGetFormData()
    };
    this.loading.start();
    this.isPublish = true;
    this.cookieBannerService.onUpdateCookieBannerData(userPrefrencesData, this.currentManagedOrgID , this.currrentManagedPropID, this.constructor.name, moduleName.cookieBannerModule)
      .subscribe((res: any) => {
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
  onGetFormData() {
    return {
      Language: this.cookieBannerForm.value.Bannerlanguage,
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
        Content: {
          title: this.isFieldDisabled ? null : this.cookieBannerForm.value.BannerTitle,
          title2: this.isFieldDisabled ? null : this.cookieBannerForm.value.BannerTitle2,
          description: this.isFieldDisabled ? null : this.cookieBannerForm.value.BannerDescription,
        },
        Privacy: {
          textContent: this.isFieldDisabled ? this.cookieBannerForm.value.privacyText : null,
          privacyLink: this.isFieldDisabled ? this.cookieBannerForm.value.privacyLink : null,
          textColor: this.isFieldDisabled ? this.cookieBannerForm.value.privacyTextColor : null,
        },
        GlobalStyles: {
          textColor: this.cookieBannerForm.value.BannerGlobalStyleTextColor,
          borderColor: this.cookieBannerForm.value.BannerGlobalStyleBorderColor,
          background: this.cookieBannerForm.value.BannerGlobalStyleBackgroundColor,
        },
        PreferenceButtonStylesAndContent: {
          textContent:this.isFieldDisabled ? null : this.cookieBannerForm.value.BannerPreferenceButtonTextContent,
          textColor: this.cookieBannerForm.value.BannerPreferenceButtonTextColor,
          background: this.cookieBannerForm.value.BannerPreferenceButtonBackgroundColor
        },
        AllowAllButtonStylesAndContent: {
          textContent: this.isFieldDisabled ? null : this.cookieBannerForm.value.BannerAllowAllButtonTextContent,
          textColor: this.cookieBannerForm.value.BannerAllowAllButtonTextColor,
          background: this.cookieBannerForm.value.BannerAllowAllButtonBackgroundColor
        },
        AllowReqButtonStylesAndContent: {
          textContent: this.isFieldDisabled ? null : this.cookieBannerForm.value.BannerAllowRequiredTextContent,
          textColor: this.cookieBannerForm.value.BannerAllowRequiredButtonTextColor,
          background: this.cookieBannerForm.value.BannerAllowRequiredButtonBackgroundColor
        },
        DisableAllButtonStylesAndContent: {
          textContent: this.isFieldDisabled ? null : this.cookieBannerForm.value.BannerDisableAllButtonTextContent,
          textColor: this.cookieBannerForm.value.BannerDisableAllButtonTextColor,
          background: this.cookieBannerForm.value.BannerDisableAllButtonBackgroundColor
        },
        DoNotSellButtonStylesAndContent: {
          textContent: this.isFieldDisabled ? null : this.cookieBannerForm.value.bannerDoNotSellMyDataTextContent,
          textColor: this.cookieBannerForm.value.bannerDoNotSellMyDataTextColor,
          background: this.cookieBannerForm.value.bannerDoNotSellMyDataBackGroundColor
        }
      },
      POPUP: {
        Content: {
          PurposeBodyDescription: this.isFieldDisabled ? null :  this.cookieBannerForm.value.PopUpPurposeBodyDescription,
          VendorBodyDescription: this.isFieldDisabled ? null : this.cookieBannerForm.value.PopUpVendorBodyDescription,
        },
        GlobalStyles: {
          textColor: this.cookieBannerForm.value.PopUpGlobalTextColor,
          backgroundColor: this.cookieBannerForm.value.PopUpGlobalBackgroundColor,
        },
        SwitchButton: {
          backgroundColor:  this.cookieBannerForm.value.PopUpSwitchButton
        },
        PurposeButton: {
          textColor: this.cookieBannerForm.value.PopUpPurposeButtonTextColor,
          backgroundColor: this.cookieBannerForm.value.PopUpPurposeButtonBackgroundColor
        },
        DisableAllButton: {
          textContent: this.isFieldDisabled ? null : this.cookieBannerForm.value.PopUpDisableAllButtonTextContent,
          backgroundColor: this.cookieBannerForm.value.PopUpDisableAllButtonBackgroundColor,
          textColor: this.cookieBannerForm.value.PopUpDisableAllButtonTextColor
        },
        DoNotSellButtonStylesAndContent: {
          textContent: this.isFieldDisabled ? null : this.cookieBannerForm.value.popUpDoNotSellTextContent,
          textColor: this.cookieBannerForm.value.popUpDoNotSellTextColor,
          backgroundColor: this.cookieBannerForm.value.popUpDoNotSellBackgroundColor
        },
        AllowAllButton: {
          textContent: this.isFieldDisabled ? null : this.cookieBannerForm.value.PopUpAllowAllButtonTextContent,
          backgroundColor: this.cookieBannerForm.value.PopUpAllowAllButtonBackgroundColor,
          textColor: this.cookieBannerForm.value.PopUpAllowAllButtonTextColor
        },
        SaveMyChoiseButton: {
          textContent: this.isFieldDisabled ? null : this.cookieBannerForm.value.PopUpSaveMyChoiceButtonContentText,
          backgroundColor: this.cookieBannerForm.value.PopUpSaveMyChoiceButtonBackgroundColor,
          textColor: this.cookieBannerForm.value.PopUpSaveMyChoiceButtonTextColor
        },
        PurposeBody: this.isFieldDisabled ? [] :  [
          {
            id : 101,
            title: this.formContent.NecessaryText,
            heading: this.cookieBannerForm.value.PopUpNecessaryHeading,
            description: this.cookieBannerForm.value.PopUpNecessaryDescription
          },
          {
            id : 102,
            title: this.formContent.AdvertisingText,
            heading: this.cookieBannerForm.value.PopUpAdvertisingHeading,
            description: this.cookieBannerForm.value.PopUpAdvertisingDescription
          },
          {
            id : 103,
            title: this.formContent.SocialMediaText,
            heading: this.cookieBannerForm.value.PopUpSocialMediaHeading,
            description: this.cookieBannerForm.value.PopUpSocialMediaDescription
          },
          {
            id : 104,
            title: this.formContent.AnalyticsText,
            heading: this.cookieBannerForm.value.PopUpAnalyticsHeading,
            description: this.cookieBannerForm.value.PopUpAnalyticsDescription
          },

        ],
      },
    };
  }
  backClicked() {
    this._location.back();
  }

  // onCheckCountry(event) {
  //   if ( event ) {
  //     this.isGdprGlobal = event.includes('eu');
  //     if (this.isGdprGlobal) {
  //       this.cookieBannerForm.get('ccpaTarget').clearValidators();
  //       this.cookieBannerForm.get('ccpaTarget').updateValueAndValidity();
  //     }
  //   }
  // }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  onSetGdprGlobal(event: any) {
    if (event) {
      this.cookieBannerForm.get('gdprTarget').clearValidators();

    } else {
      // this.cookieBannerForm.setValidators('gdprTarget', [])
      this.cookieBannerForm.controls.gdprTarget.setValidators(Validators.required);
      // this.cookieBannerForm.setValidators([Validators.required);
    }
    this.cookieBannerForm.get('gdprTarget').updateValueAndValidity();
  }

  onResetConfig() {
    this.modalRef = this.modalService.show(this.template1, { animated: false,    keyboard: false,     ignoreBackdropClick: true
    });
  }

  onCheckLogoAllow() {
      if(this.disablePlanFeatures.hideLogo) {
        this.dataService.openUpgradeModal(this.planDetails);
      }
  }

  onCheckAllowGoogleVendors() {
    if(this.disablePlanFeatures.disableGoogleVendors) {
      this.dataService.openUpgradeModal(this.planDetails);
    }
  }

  onCheckDisableCookiebloking() {
    if(this.disablePlanFeatures.disableCookieblocking) {
      this.dataService.openUpgradeModal(this.planDetails);
    }
  }

  onCheckAllowBannerConfig() {
    debugger
    if(this.disablePlanFeatures.disableBannerConfig) {
      this.dataService.openUpgradeModal(this.planDetails);
    }
  }
}
