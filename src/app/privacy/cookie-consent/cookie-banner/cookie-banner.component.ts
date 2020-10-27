import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
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
import {NotificationsService} from 'angular2-notifications';
import {OrganizationService} from '../../../_services';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {moduleName} from '../../../_constant/module-name.constant';


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
  encapsulation: ViewEncapsulation.Emulated
})
export class CookieBannerComponent implements OnInit {
  panelOpenState = false;
  // @ViewChild('gdprGlobal', {static: false}) gdprGlobal
  skeletonLoading = false;
  type = 'draft';
  matcher = new MyErrorStateMatcher();
  currentPlan;
  gdprTarget = [];
  currentState = 'banner';
  data = defaultBannerContent;
  formContent: any = defaultBannerContent;
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
  private isPublish: boolean;

  constructor(private formBuilder: FormBuilder,
              private notification: NotificationsService,
              private cd: ChangeDetectorRef,
              private cookieBannerService: CookieBannerService,
              private loading: NgxUiLoaderService,
              private  orgservice: OrganizationService,
              private _location: Location,
              private router: Router
  ) {

  }

  cookieBannerForm: FormGroup;
  submitted = true;
  cities1: any[];

  ngOnInit() {
    // window.scroll(0, 500)
    this.onFormInIt();
    this.onSetDefaultValue();
    this.gdprTarget = this.bannerConstant.gdprTargetCountry;
    this.onGetPropsAndOrgId();
    this.onGetCurrentPlan();
    this.onGetCookieBannerData();
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
    // console.log('configData', configData);
    if (configData.gdpr_global) {
      this.cookieBannerForm.get('gdprTarget').clearValidators();
    }
    this.cookieBannerForm.get('gdprTarget').updateValueAndValidity();
    this.cookieBannerForm.patchValue({
      ccpaTarget: configData.ccpa_target,
      gdprTarget: configData.gdpr_target,
      gdpr_global: configData.gdpr_global,
      cookieBlocking: configData.cookie_blocking,
      enableIab: configData.enable_iab,
      email: configData.email,
      google_vendors: configData.google_vendors,
      showBadge: configData.showOpenBtn,
      logo: configData.logo
    });
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
      bannerShowConsent: [1],
      bannerShowConsentType: [this.defaultData.BannerDisplayFrequency.noConsent],
      //  BANNER
      Bannerlanguage: [this.defaultData.gdprDefaultLang],
      BannerPosition: [this.defaultData.DefaultBannerPosition],
      BannerTitle: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      BannerDescription: ['',  [Validators.minLength(20)]],
      BannerGlobalStyleTextColor: [''],
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
      BannerTitle: this.data.bannerTitle,
      BannerDescription: this.data.bannerDescription,
      BannerGlobalStyleTextColor: this.data.bannerTextColor,
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
  }


  onSetValue() {
    this.cookieBannerForm.patchValue({
      // DISPLAY FREQUENCY
      bannerPartialConsent: this.bannerCookieData.config.DisplayFrequency.bannerPartialConsent,
      bannerPartialConsentType: this.bannerCookieData.config.DisplayFrequency.bannerPartialConsentType,
      bannerRejectAllConsent: this.bannerCookieData.config.DisplayFrequency.bannerRejectAllConsent,
      bannerRejectAllConsentType: this.bannerCookieData.config.DisplayFrequency.bannerRejectAllConsentType,
      bannerShowConsent: this.bannerCookieData.config.DisplayFrequency.bannerShowConsent,
      bannerShowConsentType: this.bannerCookieData.config.DisplayFrequency.bannerShowConsentType,
      //
      Bannerlanguage: this.bannerCookieData.config.Language,
      BannerPosition: this.bannerCookieData.config.BannerPosition,
      BannerTitle: this.bannerCookieData.config.Banner.Content.title,
      BannerDescription: this.bannerCookieData.config.Banner.Content.description,
      BannerGlobalStyleTextColor: this.bannerCookieData.config.Banner.GlobalStyles.textColor,
      BannerGlobalStyleBackgroundColor: this.bannerCookieData.config.Banner.GlobalStyles.background,
      BannerPreferenceButtonTextContent: this.bannerCookieData.config.Banner.PreferenceButtonStylesAndContent.textContent,
      BannerPreferenceButtonTextColor: this.bannerCookieData.config.Banner.PreferenceButtonStylesAndContent.textColor,
      BannerPreferenceButtonBackgroundColor: this.bannerCookieData.config.Banner.PreferenceButtonStylesAndContent.background,
      BannerAllowAllButtonTextContent: this.bannerCookieData.config.Banner.AllowAllButtonStylesAndContent.textContent,
      BannerAllowAllButtonTextColor: this.bannerCookieData.config.Banner.AllowAllButtonStylesAndContent.textColor,
      BannerAllowAllButtonBackgroundColor: this.bannerCookieData.config.Banner.AllowAllButtonStylesAndContent.background,
      BannerAllowRequiredTextContent: this.bannerCookieData.config.Banner.AllowReqButtonStylesAndContent.textContent,
      BannerAllowRequiredButtonTextColor: this.bannerCookieData.config.Banner.AllowReqButtonStylesAndContent.textColor,
      BannerAllowRequiredButtonBackgroundColor: this.bannerCookieData.config.Banner.AllowReqButtonStylesAndContent.background,
      BannerDisableAllButtonTextContent: this.bannerCookieData.config.Banner.DisableAllButtonStylesAndContent.textContent,
      BannerDisableAllButtonTextColor: this.bannerCookieData.config.Banner.DisableAllButtonStylesAndContent.textColor,
      BannerDisableAllButtonBackgroundColor: this.bannerCookieData.config.Banner.DisableAllButtonStylesAndContent.background,
      //  POPUP
      PopUpPurposeBodyDescription: this.bannerCookieData.config.POPUP.Content.PurposeBodyDescription,
      PopUpVendorBodyDescription: this.bannerCookieData.config.POPUP.Content.VendorBodyDescription,
      PopUpGlobalTextColor: this.bannerCookieData.config.POPUP.GlobalStyles.textColor,
      PopUpSwitchButton:  this.bannerCookieData.config.POPUP.SwitchButton.backgroundColor,
      PopUpGlobalBackgroundColor: this.bannerCookieData.config.POPUP.GlobalStyles.backgroundColor,
      PopUpPurposeButtonTextColor: this.bannerCookieData.config.POPUP.PurposeButton.textColor,
      PopUpPurposeButtonBackgroundColor: this.bannerCookieData.config.POPUP.PurposeButton.backgroundColor,
      // PopUpPurposeButtonBorderColor: this.bannerCookieData.CONFIG,
      PopUpDisableAllButtonTextContent: this.bannerCookieData.config.POPUP.DisableAllButton.textContent,
      PopUpDisableAllButtonTextColor: this.bannerCookieData.config.POPUP.DisableAllButton.textColor,
      PopUpDisableAllButtonBackgroundColor: this.bannerCookieData.config.POPUP.DisableAllButton.backgroundColor,
      PopUpSaveMyChoiceButtonContentText: this.bannerCookieData.config.POPUP.SaveMyChoiseButton.textContent,
      PopUpSaveMyChoiceButtonTextColor: this.bannerCookieData.config.POPUP.SaveMyChoiseButton.textColor,
      PopUpSaveMyChoiceButtonBackgroundColor: this.bannerCookieData.config.POPUP.SaveMyChoiseButton.backgroundColor,
      PopUpAllowAllButtonTextContent: this.bannerCookieData.config.POPUP.AllowAllButton.textContent,
      PopUpAllowAllButtonTextColor: this.bannerCookieData.config.POPUP.AllowAllButton.textColor,
      PopUpAllowAllButtonBackgroundColor: this.bannerCookieData.config.POPUP.AllowAllButton.backgroundColor,

      // PopUpInformationHeading: this.bannerCookieData.config.POPUP.PurposeBody[0].heading,
      // informationBtnText: this.bannerCookieData.config.POPUP.PurposeBody[0].title,
      // PopUpInformationDescription: this.bannerCookieData.config.POPUP.PurposeBody[0].description,

      // PopUpNecessaryHeading: this.bannerCookieData.config.POPUP.PurposeBody[1].heading,
      // necessaryBtnText: this.bannerCookieData.config.POPUP.PurposeBody[1].title,
      // PopUpNecessaryDescription: this.bannerCookieData.config.POPUP.PurposeBody[1].description,


      // PopUpAdvertisingHeading: this.bannerCookieData.config.POPUP.PurposeBody[3].heading,
      // advertisingBtnText: this.bannerCookieData.config.POPUP.PurposeBody[3].title,
      // PopUpAdvertisingDescription: this.bannerCookieData.config.POPUP.PurposeBody[3].description,


      PopUpAdvertisingHeading: this.bannerCookieData.config.POPUP.PurposeBody[0].heading,
      advertisingBtnText: this.bannerCookieData.config.POPUP.PurposeBody[0].title,
      PopUpAdvertisingDescription: this.bannerCookieData.config.POPUP.PurposeBody[0].description,

      PopUpSocialMediaHeading:  this.bannerCookieData.config.POPUP.PurposeBody[1].heading,
      socialMediaBtnText:  this.bannerCookieData.config.POPUP.PurposeBody[1].title,
      PopUpSocialMediaDescription:  this.bannerCookieData.config.POPUP.PurposeBody[1].description,

      PopUpAnalyticsHeading: this.bannerCookieData.config.POPUP.PurposeBody[2].heading,
      analyticsBtnText: this.bannerCookieData.config.POPUP.PurposeBody[2].title,
      PopUpAnalyticsDescription: this.bannerCookieData.config.POPUP.PurposeBody[2].description,


      PopUpNecessaryHeading: this.bannerCookieData.config.POPUP.PurposeBody[3].heading,
      necessaryBtnText: this.bannerCookieData.config.POPUP.PurposeBody[3].title,
      PopUpNecessaryDescription: this.bannerCookieData.config.POPUP.PurposeBody[3].description,
    });
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
    this.isPublish = true;
    this.loading.start();
    this.cookieBannerService.onSubmitCookieBannerData(userPrefrencesData, this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name , moduleName.cookieBannerModule)
      .subscribe((res: any) => {
        this.loading.stop();
        this.isPublish = false;
       // this.notification.info('Success', res['response'], notificationConfig);
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
      DisplayFrequency: {
        bannerPartialConsent: this.cookieBannerForm.value.bannerPartialConsent,
        bannerPartialConsentType: this.cookieBannerForm.value.bannerPartialConsentType,
        bannerRejectAllConsent: this.cookieBannerForm.value.bannerRejectAllConsent,
        bannerRejectAllConsentType: this.cookieBannerForm.value.bannerRejectAllConsentType,
        bannerShowConsent: this.cookieBannerForm.value.bannerShowConsent,
        bannerShowConsentType: this.cookieBannerForm.value.bannerShowConsentType,
      },
      Banner: {
        Content: {
          title: this.cookieBannerForm.value.BannerTitle,
          description: this.cookieBannerForm.value.BannerDescription,
        },
        GlobalStyles: {
          textColor: this.cookieBannerForm.value.BannerGlobalStyleTextColor,
          background: this.cookieBannerForm.value.BannerGlobalStyleBackgroundColor,
        },
        PreferenceButtonStylesAndContent: {
          textContent: this.cookieBannerForm.value.BannerPreferenceButtonTextContent,
          textColor: this.cookieBannerForm.value.BannerPreferenceButtonTextColor,
          background: this.cookieBannerForm.value.BannerPreferenceButtonBackgroundColor
        },
        AllowAllButtonStylesAndContent: {
          textContent: this.cookieBannerForm.value.BannerAllowAllButtonTextContent,
          textColor: this.cookieBannerForm.value.BannerAllowAllButtonTextColor,
          background: this.cookieBannerForm.value.BannerAllowAllButtonBackgroundColor
        },
        AllowReqButtonStylesAndContent: {
          textContent: this.cookieBannerForm.value.BannerAllowRequiredTextContent,
          textColor: this.cookieBannerForm.value.BannerAllowRequiredButtonTextColor,
          background: this.cookieBannerForm.value.BannerAllowRequiredButtonBackgroundColor
        },
        DisableAllButtonStylesAndContent: {
          textContent: this.cookieBannerForm.value.BannerDisableAllButtonTextContent,
          textColor: this.cookieBannerForm.value.BannerDisableAllButtonTextColor,
          background: this.cookieBannerForm.value.BannerDisableAllButtonBackgroundColor
        }
      },
      POPUP: {
        Content: {
          PurposeBodyDescription: this.cookieBannerForm.value.PopUpPurposeBodyDescription,
          VendorBodyDescription: this.cookieBannerForm.value.PopUpVendorBodyDescription,
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
          textContent: this.cookieBannerForm.value.PopUpDisableAllButtonTextContent,
          backgroundColor: this.cookieBannerForm.value.PopUpDisableAllButtonBackgroundColor,
          textColor: this.cookieBannerForm.value.PopUpDisableAllButtonTextColor
        },
        AllowAllButton: {
          textContent: this.cookieBannerForm.value.PopUpAllowAllButtonTextContent,
          backgroundColor: this.cookieBannerForm.value.PopUpAllowAllButtonBackgroundColor,
          textColor: this.cookieBannerForm.value.PopUpAllowAllButtonTextColor
        },
        SaveMyChoiseButton: {
          textContent: this.cookieBannerForm.value.PopUpSaveMyChoiceButtonContentText,
          backgroundColor: this.cookieBannerForm.value.PopUpSaveMyChoiceButtonBackgroundColor,
          textColor: this.cookieBannerForm.value.PopUpSaveMyChoiceButtonContentText
        },
        PurposeBody: [
          {
            id : 1,
            purposeId : IabPurposeIds.advertising,
            title: this.formContent.AdvertisingText,
            heading: this.cookieBannerForm.value.PopUpAdvertisingHeading,
            description: this.cookieBannerForm.value.PopUpAdvertisingDescription
          },
          {
            id : 2,
            purposeId : IabPurposeIds.socialMedia,
            title: this.formContent.SocialMediaText,
            heading: this.cookieBannerForm.value.PopUpSocialMediaHeading,
            description: this.cookieBannerForm.value.PopUpSocialMediaDescription
          },
          {
            id : 3,
            purposeId : IabPurposeIds.analytics,
            title: this.formContent.AnalyticsText,
            heading: this.cookieBannerForm.value.PopUpAnalyticsHeading,
            description: this.cookieBannerForm.value.PopUpAnalyticsDescription
          },
          {
            id : 4,
            purposeId : IabPurposeIds.essentiial,
            title: this.formContent.NecessaryText,
            heading: this.cookieBannerForm.value.PopUpNecessaryHeading,
            description: this.cookieBannerForm.value.PopUpNecessaryDescription
          }
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
    // console.log(event)
    if (event) {
      this.cookieBannerForm.get('gdprTarget').clearValidators();

    } else {
      // this.cookieBannerForm.setValidators('gdprTarget', [])
      this.cookieBannerForm.controls.gdprTarget.setValidators(Validators.required);
      // this.cookieBannerForm.setValidators([Validators.required);
    }
    this.cookieBannerForm.get('gdprTarget').updateValueAndValidity();
  }
}
