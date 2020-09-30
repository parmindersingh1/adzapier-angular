import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {BannerConstant, defaultData, IabPurposeIds} from '../../_constant/gdpr-ccpa-banner.constant';
import {CookieBannerService} from '../../_services/cookie-banner.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {NotificationsService} from 'angular2-notifications';
import {OrganizationService} from '../../_services';
import {Location} from '@angular/common';
import {Router} from '@angular/router';

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
  styleUrls: ['./cookie-banner.component.scss']
})
export class CookieBannerComponent implements OnInit {
  panelOpenState = false;
  matcher = new MyErrorStateMatcher();
  currentPlan;
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

  constructor(private formBuilder: FormBuilder,
              private notification: NotificationsService,
              private cd: ChangeDetectorRef,
              private cookieBannerService: CookieBannerService,
              private loading: NgxUiLoaderService,
              private  orgservice: OrganizationService,
              private _location: Location,
              private router: Router
  ) {
    console.log('bannerConstant', this.bannerConstant)
  }

  cookieBannerForm: FormGroup;
  submitted = false;

  ngOnInit() {
    this.onFormInIt();
    this.onGetPropsAndOrgId();
    this.onGetCurrentPlan();
    this.onGetCookieBannerData();
  }

  onGetCookieBannerData() {
    const path = '/consent/banner/' + this.currentManagedOrgID + '/' + this.currrentManagedPropID;
    this.loading.start('2');
    this.cookieBannerService.onGetCookieBannerData(path)
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
      //  this.notification.error('Error', error, notificationConfig);
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
      });

  }

  onSetValueConfig() {
    const configData: any = this.bannerCookieData;
    this.cookieBannerForm.patchValue({
      ccpaTarget: configData.ccpa_target,
      gdprTarget: configData.gdpr_target,
      cookieBlocking: configData.cookie_blocking,
      enableIab: configData.enable_iab,
      email: configData.email,
      showOpenCcpaBtn: configData.showOpenCcpaBtn,
      showOpenGdprBtn: configData.showOpenGdprBtn
    });
  }

  onGetCurrentPlan() {
    this.loading.start('1');
    this.cookieBannerService.onGetPlanType()
      .subscribe((res: any) => {
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
      //  this.notification.error('Error', error, notificationConfig);
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
      showOpenBtn: [this.defaultData.showOpenBtn],
      logo: [this.defaultData.logo],
      //  BANNER
      Bannerlanguage: [''],
      BannerPosition: [this.defaultData.DefaultBannerPosition],
      BannerTitle: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      BannerDescription: ['',  [Validators.minLength(20), Validators.maxLength(300)]],
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
      PopUpSocialMediaHeading: [BannerConstant.CCPA.POPUP.PopUpSocialMediaHead, [Validators.minLength(2), Validators.maxLength(50)]],
      // informationBtnText: [BannerConstant.CCPA.POPUP.PopUpInformationBtnText],
      PopUpSocialMediaDescription: [BannerConstant.CCPA.POPUP.PopUpSocialMediaDescription, [Validators.minLength(20), Validators.maxLength(300)]],
      PopUpNecessaryHeading: [BannerConstant.CCPA.POPUP.PopUpNecessaryHead, [Validators.minLength(2), Validators.maxLength(50)]],
      // necessaryBtnText: [BannerConstant.CCPA.POPUP.necessaryBtnText],
      PopUpNecessaryDescription: [BannerConstant.CCPA.POPUP.PopUpNecessaryDescription, [Validators.minLength(20), Validators.maxLength(300)]],
      PopUpAnalyticsHeading: [BannerConstant.CCPA.POPUP.PopUpAnalyticsHead, [Validators.minLength(2), Validators.maxLength(50)]],
      // analyticsBtnText: [BannerConstant.CCPA.POPUP.advertisingBtnText],
      PopUpAnalyticsDescription: [BannerConstant.CCPA.POPUP.PopUpAnalyticsDescription, [Validators.minLength(20), Validators.maxLength(300)]],
      PopUpAdvertisingHeading: [BannerConstant.CCPA.POPUP.PopUpAdvertisingHead, [Validators.minLength(2), Validators.maxLength(50)]],
      // advertisingBtnText: [BannerConstant.CCPA.POPUP.advertisingBtnText],
      PopUpAdvertisingDescription: [BannerConstant.CCPA.POPUP.PopUpAdvertisingDescription, [Validators.minLength(20), Validators.maxLength(300)]],
    });
  }

  onSetValue() {
    console.log(': this.bannerCookieData.config.',  this.bannerCookieData.config)
    this.cookieBannerForm.patchValue({
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

      PopUpInformationHeading: this.bannerCookieData.config.POPUP.PurposeBody[0].heading,
      informationBtnText: this.bannerCookieData.config.POPUP.PurposeBody[0].title,
      PopUpInformationDescription: this.bannerCookieData.config.POPUP.PurposeBody[0].description,
      PopUpNecessaryHeading: this.bannerCookieData.config.POPUP.PurposeBody[1].heading,
      necessaryBtnText: this.bannerCookieData.config.POPUP.PurposeBody[1].title,
      PopUpNecessaryDescription: this.bannerCookieData.config.POPUP.PurposeBody[1].description,
      PopUpAnalyticsHeading: this.bannerCookieData.config.POPUP.PurposeBody[2].heading,
      analyticsBtnText: this.bannerCookieData.config.POPUP.PurposeBody[2].title,
      PopUpAnalyticsDescription: this.bannerCookieData.config.POPUP.PurposeBody[2].description,
      PopUpAdvertisingHeading: this.bannerCookieData.config.POPUP.PurposeBody[3].heading,
      advertisingBtnText: this.bannerCookieData.config.POPUP.PurposeBody[3].title,
      PopUpAdvertisingDescription: this.bannerCookieData.config.POPUP.PurposeBody[3].description,
    });
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
      gdpr_target: this.cookieBannerForm.value.gdprTarget,
      cookie_blocking: this.cookieBannerForm.value.cookieBlocking,
      enable_iab: this.cookieBannerForm.value.enableIab,
      email: this.cookieBannerForm.value.email,
      logo_text: this.cookieBannerForm.value.logo,
      gdpr_global: this.cookieBannerForm.value.gdprTarget.includes('eu'),
      showOpenBtn: this.cookieBannerForm.value.showOpenBtn,
      CONFIG: this.onGetFormData()
    };
    const path = '/consent/banner/' + this.currentManagedOrgID + '/' + this.currrentManagedPropID;
    this.loading.start();
    console.log('formData', userPrefrencesData);
    this.cookieBannerService.onSubmitCookieBannerData(userPrefrencesData, path)
      .subscribe((res: any) => {
        this.loading.stop();
       // this.notification.info('Success', res['response'], notificationConfig);
        this.isOpen = true;
        this.alertMsg = res.response;
        this.alertType = 'success';
        setTimeout(() => {
        this.router.navigateByUrl('privacy/cookie-banner/setup');
        }, 1000);
      }, error => {
       // this.notification.error('Error', error, notificationConfig);
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
        this.loading.stop();
      });
  }


  onUpdateForm() {
    const userPrefrencesData = {
      ccpa_target: this.cookieBannerForm.value.ccpaTarget,
      logo_text: this.cookieBannerForm.value.logo,
      gdpr_global: this.cookieBannerForm.value.gdprTarget.includes('eu'),
      gdpr_target: this.cookieBannerForm.value.gdprTarget,
      cookie_blocking: this.cookieBannerForm.value.cookieBlocking,
      enable_iab: this.cookieBannerForm.value.enableIab,
      email: this.cookieBannerForm.value.email,
      showOpenBtn: this.cookieBannerForm.value.showOpenBtn,
      CONFIG: this.onGetFormData()
    };
    const path = '/consent/banner/' + this.currentManagedOrgID + '/' + this.currrentManagedPropID;
    this.loading.start();
    console.log('formData', JSON.stringify(userPrefrencesData));
    this.cookieBannerService.onUpdateCookieBannerData(userPrefrencesData, path)
      .subscribe((res: any) => {
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = res.response;
        this.alertType = 'success';
        setTimeout(() => {
          this.router.navigateByUrl('privacy/cookie-banner/setup');
        }, 1000);
      }, error => {
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
        this.loading.stop();
      });
  }
  onGetFormData() {
    return {
      Language: this.cookieBannerForm.value.Bannerlanguage,
      BannerPosition: this.cookieBannerForm.value.BannerPosition,
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
            title: this.bannerConstant.CCPA.POPUP.AdvertisingText,
            heading: this.cookieBannerForm.value.PopUpAdvertisingHeading,
            description: this.cookieBannerForm.value.PopUpAdvertisingDescription
          },
          {
            id : 2,
            purposeId : IabPurposeIds.socialMedia,
            title: this.bannerConstant.CCPA.POPUP.SocialMediaText,
            heading: this.cookieBannerForm.value.PopUpSocialMediaHeading,
            description: this.cookieBannerForm.value.PopUpSocialMediaDescription
          },
          {
            id : 3,
            purposeId : IabPurposeIds.analytics,
            title: this.bannerConstant.CCPA.POPUP.AnalyticsText,
            heading: this.cookieBannerForm.value.PopUpAnalyticsHeading,
            description: this.cookieBannerForm.value.PopUpAnalyticsDescription
          },
          {
            id : 4,
            purposeId : IabPurposeIds.essentiial,
            title: this.bannerConstant.CCPA.POPUP.NecessaryText,
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

  onCheckCountry(event) {
    if( event ) {
      this.isGdprGlobal = event.includes('eu');
      if (this.isGdprGlobal) {
        this.cookieBannerForm.get('ccpaTarget').clearValidators();
        this.cookieBannerForm.get('ccpaTarget').updateValueAndValidity();
      }
    }
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }
}
