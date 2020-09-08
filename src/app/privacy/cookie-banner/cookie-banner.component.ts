import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ccpaBannerConstant, defaultData} from '../../_constant/gdpr-ccpa-banner.constant';
import {CookieBannerService} from '../../_services/cookie-banner.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {notificationConfig} from '../../_constant/notification.constant';
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
  logoText = 'Adzapier';
  bannerCookieData = {};
  isGdprGlobal = false;
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  public ccpaBannerConstant = ccpaBannerConstant;
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
      .subscribe(res => {
        this.loading.stop('2');
        if (res['status'] === 200 && res.hasOwnProperty('response')) {
          this.bannerCookieData = res['response'];
          this.onSetValueConfig();
          this.onSetValueGdpr();
          this.onSetCcpaValue();
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
    const configData = this.bannerCookieData;
    this.cookieBannerForm.patchValue({
      ccpaTarget: configData['ccpa_target'],
      gdprTarget: configData['gdpr_target'],
      cookieBlocking: configData['cookie_blocking'],
      enableIab: configData['enable_iab'],
      email: configData['email'],
      showOpenCcpaBtn: configData['showOpenCcpaBtn'],
      showOpenGdprBtn: configData['showOpenGdprBtn']
    });
  }

  onGetCurrentPlan() {
    this.loading.start('1');
    this.cookieBannerService.onGetPlanType()
      .subscribe(res => {
        this.loading.stop('1');
        const planType = res['response'];
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
      showOpenCcpaBtn: [this.defaultData.showOpenCcpaBtn],
      showOpenGdprBtn: [this.defaultData.showOpenGdprBtn],
      // GDPR BANNER
      gdprBannerlanguage: [''],
      gdprBannerPosition: [defaultData.gdprDefaultBannerPosition],
      gdprBannerTitle: [''],
      gdprBannerDescription: [''],
      gdprBannerGlobalStyleTextColor: [''],
      gdprBannerGlobalStyleBackgroundColor: [''],
      gdprBannerPreferenceButtonTextContent: [''],
      gdprBannerPreferenceButtonTextColor: [''],
      gdprBannerPreferenceButtonBackgroundColor: [''],
      gdprBannerAllowAllButtonTextContent: [''],
      gdprBannerAllowAllButtonTextColor: [''],
      gdprBannerAllowAllButtonBackgroundColor: [''],
      gdprBannerDisableAllButtonTextContent: [''],
      gdprBannerDisableAllButtonTextColor: [''],
      gdprBannerDisableAllButtonBackgroundColor: [''],
      // GDPR POPUP
      gdprPopUpPurposeBodyDescription: [''],
      gdprPopUpVendorBodyDescription: [''],
      gdprPopUpGlobalTextColor: [''],
      gdprPopUpGlobalBackgroundColor: [''],
      gdprPopUpPurposeButtonTextColor: [''],
      gdprPopUpPurposeButtonBackgroundColor: [''],
      gdprPopUpPurposeButtonBorderColor: [''],
      gdprPopUpDisableAllButtonTextContent: [''],
      gdprPopUpDisableAllButtonTextColor: [''],
      gdprPopUpDisableAllButtonBackgroundColor: [''],
      gdprPopUpSaveMyChoiceButtonContentText: [''],
      gdprPopUpSaveMyChoiceButtonTextColor: [''],
      gdprPopUpSaveMyChoiceButtonBackgroundColor: [''],
      gdprPopUpAllowAllButtonTextContent: [''],
      gdprPopUpAllowAllButtonTextColor: [''],
      gdprPopUpAllowAllButtonBackgroundColor: [''],
      // CCPA BANNER
      ccpaBannerPosition: [defaultData.gdprDefaultBannerPosition],
      ccpaBannerTitle: [''],
      ccpaBannerDescription: [''],
      ccpaBannerGlobalStyleTextColor: [''],
      ccpaBannerGlobalStyleBackgroundColor: [''],
      ccpaBannerPreferenceButtonTextContent: [''],
      ccpaBannerPreferenceButtonTextColor: [''],
      ccpaBannerPreferenceButtonBackgroundColor: [''],
      ccpaBannerAllowAllButtonTextContent: [''],
      ccpaBannerAllowAllButtonTextColor: [''],
      ccpaBannerAllowAllButtonBackgroundColor: [''],
      ccpaBannerDisableAllButtonTextContent: [''],
      ccpaBannerDisableAllButtonTextColor: [''],
      ccpaBannerDisableAllButtonBackgroundColor: [''],
      // CCPA POPUP
      ccpaPopUpGlobalTextColor: [''],
      ccpaPopUpGlobalBackgroundColor: [''],
      ccpaPopUpDisableAllButtonTextContent: [''],
      ccpaPopUpDisableAllButtonTextColor: [''],
      ccpaPopUpDisableAllButtonBackgroundColor: [''],
      ccpaPopUpAllowAllButtonTextContent: [''],
      ccpaPopUpAllowAllButtonTextColor: [''],
      ccpaPopUpAllowAllButtonBackGroundColor: [''],
      ccpaPopUpInformationHeading: [ccpaBannerConstant.CCPA.POPUP.PopUpInformationHead],
      informationBtnText: [ccpaBannerConstant.CCPA.POPUP.PopUpInformationBtnText],
      ccpaPopUpInformationDescription: [ccpaBannerConstant.CCPA.POPUP.PopUpInformationDescription],
      ccpaPopUpNecessaryHeading: [ccpaBannerConstant.CCPA.POPUP.PopUpNecessaryHead],
      necessaryBtnText: [ccpaBannerConstant.CCPA.POPUP.necessaryBtnText],
      ccpaPopUpNecessaryDescription: [ccpaBannerConstant.CCPA.POPUP.PopUpNecessaryDescription],
      ccpaPopUpAnalyticsHeading: [ccpaBannerConstant.CCPA.POPUP.PopUpAnalyticsHead],
      analyticsBtnText: [ccpaBannerConstant.CCPA.POPUP.advertisingBtnText],
      ccpaPopUpAnalyticsDescription: [ccpaBannerConstant.CCPA.POPUP.PopUpAnalyticsDescription],
      ccpaPopUpAdvertisingHeading: [ccpaBannerConstant.CCPA.POPUP.PopUpAdvertisingHead],
      advertisingBtnText: [ccpaBannerConstant.CCPA.POPUP.advertisingBtnText],
      ccpaPopUpAdvertisingDescription: [ccpaBannerConstant.CCPA.POPUP.PopUpAdvertisingDescription],
    });
  }

  onSetValueGdpr() {
    // console.log('this.bannerCookieData['gdpr']', this.bannerCookieData['gdpr']);
    this.cookieBannerForm.patchValue({
      // GDPR BANNER
      gdprBannerlanguage: this.bannerCookieData['gdpr'].Language,
      gdprBannerPosition: this.bannerCookieData['gdpr'].BannerPosition,
      gdprBannerTitle: this.bannerCookieData['gdpr'].Banner.Content.title,
      gdprBannerDescription: this.bannerCookieData['gdpr'].Banner.Content.description,
      gdprBannerGlobalStyleTextColor: this.bannerCookieData['gdpr'].Banner.GlobalStyles.textColor,
      gdprBannerGlobalStyleBackgroundColor: this.bannerCookieData['gdpr'].Banner.GlobalStyles.background,
      gdprBannerPreferenceButtonTextContent: this.bannerCookieData['gdpr'].Banner.PreferenceButtonStylesAndContent.textContent,
      gdprBannerPreferenceButtonTextColor: this.bannerCookieData['gdpr'].Banner.PreferenceButtonStylesAndContent.textColor,
      gdprBannerPreferenceButtonBackgroundColor: this.bannerCookieData['gdpr'].Banner.PreferenceButtonStylesAndContent.background,
      gdprBannerAllowAllButtonTextContent: this.bannerCookieData['gdpr'].Banner.AllowAllButtonStylesAndContent.textContent,
      gdprBannerAllowAllButtonTextColor: this.bannerCookieData['gdpr'].Banner.AllowAllButtonStylesAndContent.textColor,
      gdprBannerAllowAllButtonBackgroundColor: this.bannerCookieData['gdpr'].Banner.AllowAllButtonStylesAndContent.background,
      gdprBannerDisableAllButtonTextContent: this.bannerCookieData['gdpr'].Banner.DisableAllButtonStylesAndContent.textContent,
      gdprBannerDisableAllButtonTextColor: this.bannerCookieData['gdpr'].Banner.DisableAllButtonStylesAndContent.textColor,
      gdprBannerDisableAllButtonBackgroundColor: this.bannerCookieData['gdpr'].Banner.DisableAllButtonStylesAndContent.background,
      // GDPR POPUP
      gdprPopUpPurposeBodyDescription: this.bannerCookieData['gdpr'].POPUP.Content.PurposeBodyDescription,
      gdprPopUpVendorBodyDescription: this.bannerCookieData['gdpr'].POPUP.Content.VendorBodyDescription,
      gdprPopUpGlobalTextColor: this.bannerCookieData['gdpr'].POPUP.GlobalStyles.textColor,
      gdprPopUpGlobalBackgroundColor: this.bannerCookieData['gdpr'].POPUP.GlobalStyles.backgroundColor,
      gdprPopUpPurposeButtonTextColor: this.bannerCookieData['gdpr'].POPUP.PurposeButton.textColor,
      gdprPopUpPurposeButtonBackgroundColor: this.bannerCookieData['gdpr'].POPUP.PurposeButton.backgroundColor,
      // gdprPopUpPurposeButtonBorderColor: this.bannerCookieData['gdpr'],
      gdprPopUpDisableAllButtonTextContent: this.bannerCookieData['gdpr'].POPUP.DisableAllButton.textContent,
      gdprPopUpDisableAllButtonTextColor: this.bannerCookieData['gdpr'].POPUP.DisableAllButton.textColor,
      gdprPopUpDisableAllButtonBackgroundColor: this.bannerCookieData['gdpr'].POPUP.DisableAllButton.backgroundColor,
      gdprPopUpSaveMyChoiceButtonContentText: this.bannerCookieData['gdpr'].POPUP.SaveMyChoiseButton.textContent,
      gdprPopUpSaveMyChoiceButtonTextColor: this.bannerCookieData['gdpr'].POPUP.SaveMyChoiseButton.textColor,
      gdprPopUpSaveMyChoiceButtonBackgroundColor: this.bannerCookieData['gdpr'].POPUP.SaveMyChoiseButton.backgroundColor,
      gdprPopUpAllowAllButtonTextContent: this.bannerCookieData['gdpr'].POPUP.AllowAllButton.textContent,
      gdprPopUpAllowAllButtonTextColor: this.bannerCookieData['gdpr'].POPUP.AllowAllButton.textColor,
      gdprPopUpAllowAllButtonBackgroundColor: this.bannerCookieData['gdpr'].POPUP.AllowAllButton.backgroundColor,
    });
  }

  onSetCcpaValue() {
    const ccpaData = this.bannerCookieData['ccpa'];
    this.cookieBannerForm.patchValue({
      ccpaBannerPosition: ccpaData.Banner.BannerPosition,
      ccpaBannerTitle: ccpaData.Banner.Content.title,
      ccpaBannerDescription: ccpaData.Banner.Content.description,
      ccpaBannerGlobalStyleTextColor: ccpaData.Banner.GlobalStyles.textColor,
      ccpaBannerGlobalStyleBackgroundColor: ccpaData.Banner.GlobalStyles.background,
      ccpaBannerPreferenceButtonTextContent: ccpaData.Banner.PreferenceButtonStylesAndContent.textContent,
      ccpaBannerPreferenceButtonTextColor: ccpaData.Banner.PreferenceButtonStylesAndContent.textColor,
      ccpaBannerPreferenceButtonBackgroundColor: ccpaData.Banner.PreferenceButtonStylesAndContent.background,
      ccpaBannerAllowAllButtonTextContent: ccpaData.Banner.AllowAllButtonStylesAndContent.textContent,
      ccpaBannerAllowAllButtonTextColor: ccpaData.Banner.AllowAllButtonStylesAndContent.textColor,
      ccpaBannerAllowAllButtonBackgroundColor: ccpaData.Banner.AllowAllButtonStylesAndContent.background,
      ccpaBannerDisableAllButtonTextContent: ccpaData.Banner.DisableAllButtonStylesAndContent.textContent,
      ccpaBannerDisableAllButtonTextColor: ccpaData.Banner.DisableAllButtonStylesAndContent.textColor,
      ccpaBannerDisableAllButtonBackgroundColor: ccpaData.Banner.DisableAllButtonStylesAndContent.background,
      // CCPA POPUP
      ccpaPopUpGlobalTextColor: ccpaData.POPUP.GlobalStyles.textColor,
      ccpaPopUpGlobalBackgroundColor: ccpaData.POPUP.GlobalStyles.backgroundColor,
      ccpaPopUpDisableAllButtonTextContent: ccpaData.POPUP.DisableAllButton.textContent,
      ccpaPopUpDisableAllButtonTextColor: ccpaData.POPUP.DisableAllButton.textColor,
      ccpaPopUpDisableAllButtonBackgroundColor: ccpaData.POPUP.DisableAllButton.backgroundColor,
      ccpaPopUpAllowAllButtonTextContent: ccpaData.POPUP.AllowAllButton.textContent,
      ccpaPopUpAllowAllButtonTextColor: ccpaData.POPUP.AllowAllButton.textColor,
      ccpaPopUpAllowAllButtonBackGroundColor: ccpaData.POPUP.AllowAllButton.backgroundColor,
      ccpaPopUpInformationHeading: ccpaData.POPUP.Content[0].heading,
      informationBtnText: ccpaData.POPUP.Content[0].title,
      ccpaPopUpInformationDescription: ccpaData.POPUP.Content[0].description,
      ccpaPopUpNecessaryHeading: ccpaData.POPUP.Content[1].heading,
      necessaryBtnText: ccpaData.POPUP.Content[1].title,
      ccpaPopUpNecessaryDescription: ccpaData.POPUP.Content[1].description,
      ccpaPopUpAnalyticsHeading: ccpaData.POPUP.Content[2].heading,
      analyticsBtnText: ccpaData.POPUP.Content[2].title,
      ccpaPopUpAnalyticsDescription: ccpaData.POPUP.Content[2].description,
      ccpaPopUpAdvertisingHeading: ccpaData.POPUP.Content[3].heading,
      advertisingBtnText: ccpaData.POPUP.Content[3].title,
      ccpaPopUpAdvertisingDescription: ccpaData.POPUP.Content[3].description,
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
    if (Object.keys(this.bannerCookieData).length > 0) {
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
      logo_text: this.logoText,
      gdpr_global: this.cookieBannerForm.value.gdprTarget.includes('EU'),
      showOpenCcpaBtn: this.cookieBannerForm.value.showOpenCcpaBtn,
      showOpenGdprBtn: this.cookieBannerForm.value.showOpenGdprBtn
    };
    let formData = {};
    const CCPA_DATA = this.onGetCcpaFormData();
    const GDPR_DATA = this.onGetGdprFormData();
    if (this.currentPlan === 'CCPA') {
      formData = {
        ...userPrefrencesData,
        CCPA: CCPA_DATA
      };
    } else {
      formData = {
        ...userPrefrencesData,
        GDPR: GDPR_DATA,
        CCPA: CCPA_DATA
      };
    }
    const path = '/consent/banner/' + this.currentManagedOrgID + '/' + this.currrentManagedPropID;
    this.loading.start();
    console.log('formData', formData);
    this.cookieBannerService.onSubmitCookieBannerData(formData, path)
      .subscribe(res => {
        this.loading.stop();
       // this.notification.info('Success', res['response'], notificationConfig);
        this.isOpen = true;
        this.alertMsg = res['response'];
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
      logo_text: this.logoText,
      gdpr_global: this.cookieBannerForm.value.gdprTarget.includes('EU'),
      gdpr_target: this.cookieBannerForm.value.gdprTarget,
      cookie_blocking: this.cookieBannerForm.value.cookieBlocking,
      enable_iab: this.cookieBannerForm.value.enableIab,
      email: this.cookieBannerForm.value.email,
      showOpenCcpaBtn: this.cookieBannerForm.value.showOpenCcpaBtn,
      showOpenGdprBtn: this.cookieBannerForm.value.showOpenGdprBtn
    };
    let formData = {};
    const CCPA_DATA = this.onGetCcpaFormData();
    const GDPR_DATA = this.onGetGdprFormData();
    if (this.currentPlan === 'CCPA') {
      formData = {
        ...userPrefrencesData,
        CCPA: CCPA_DATA
      };
    } else {
      formData = {
        ...userPrefrencesData,
        GDPR: GDPR_DATA,
        CCPA: CCPA_DATA
      };
    }
    const path = '/consent/banner/' + this.currentManagedOrgID + '/' + this.currrentManagedPropID;
    this.loading.start();
    console.log('formData', formData);
    this.cookieBannerService.onUpdateCookieBannerData(formData, path)
      .subscribe(res => {
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = res['response'];
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


  onGetCcpaFormData() {
    return {
      BannerPosition: this.cookieBannerForm.value.ccpaBannerPosition,
      Banner: {
        Content: {
          title: this.cookieBannerForm.value.ccpaBannerTitle,
          description: this.cookieBannerForm.value.ccpaBannerDescription,
        },
        GlobalStyles: {
          textColor: this.cookieBannerForm.value.ccpaBannerGlobalStyleTextColor,
          background: this.cookieBannerForm.value.ccpaBannerGlobalStyleBackgroundColor,
        },
        PreferenceButtonStylesAndContent: {
          textContent: this.cookieBannerForm.value.ccpaBannerPreferenceButtonTextContent,
          textColor: this.cookieBannerForm.value.ccpaBannerPreferenceButtonTextColor,
          background: this.cookieBannerForm.value.ccpaBannerPreferenceButtonBackgroundColor
        },
        AllowAllButtonStylesAndContent: {
          textContent: this.cookieBannerForm.value.ccpaBannerAllowAllButtonTextContent,
          textColor: this.cookieBannerForm.value.ccpaBannerAllowAllButtonTextColor,
          background: this.cookieBannerForm.value.ccpaBannerAllowAllButtonBackgroundColor
        },
        DisableAllButtonStylesAndContent: {
          textContent: this.cookieBannerForm.value.ccpaBannerDisableAllButtonTextContent,
          textColor: this.cookieBannerForm.value.ccpaBannerDisableAllButtonTextColor,
          background: this.cookieBannerForm.value.ccpaBannerDisableAllButtonBackgroundColor
        }
      },
      POPUP: {
        Content: [
          {
            title: this.cookieBannerForm.value.informationBtnText,
            heading: this.cookieBannerForm.value.ccpaPopUpInformationHeading,
            description: this.cookieBannerForm.value.ccpaPopUpInformationDescription
          },
          {
            title: this.cookieBannerForm.value.necessaryBtnText,
            heading: this.cookieBannerForm.value.ccpaPopUpNecessaryHeading,
            description: this.cookieBannerForm.value.ccpaPopUpNecessaryDescription
          },
          {
            title: this.cookieBannerForm.value.analyticsBtnText,
            heading: this.cookieBannerForm.value.ccpaPopUpAnalyticsHeading,
            description: this.cookieBannerForm.value.ccpaPopUpAnalyticsDescription
          },
          {
            title: this.cookieBannerForm.value.advertisingBtnText,
            heading: this.cookieBannerForm.value.ccpaPopUpAdvertisingHeading,
            description: this.cookieBannerForm.value.ccpaPopUpAdvertisingDescription
          }
        ],
        GlobalStyles: {
          textColor: this.cookieBannerForm.value.ccpaPopUpGlobalTextColor,
          backgroundColor: this.cookieBannerForm.value.ccpaPopUpGlobalBackgroundColor,
        },
        DisableAllButton: {
          textContent: this.cookieBannerForm.value.ccpaPopUpDisableAllButtonTextContent,
          backgroundColor: this.cookieBannerForm.value.ccpaPopUpDisableAllButtonBackgroundColor,
          textColor: this.cookieBannerForm.value.ccpaPopUpDisableAllButtonTextColor
        },
        AllowAllButton: {
          textContent: this.cookieBannerForm.value.ccpaPopUpAllowAllButtonTextContent,
          backgroundColor: this.cookieBannerForm.value.ccpaPopUpAllowAllButtonBackGroundColor,
          textColor: this.cookieBannerForm.value.ccpaPopUpAllowAllButtonTextColor
        },
      },
    };
  }

  onGetGdprFormData() {
    return {
      Language: this.cookieBannerForm.value.gdprBannerlanguage,
      BannerPosition: this.cookieBannerForm.value.gdprBannerPosition,
      Banner: {
        Content: {
          title: this.cookieBannerForm.value.gdprBannerTitle,
          description: this.cookieBannerForm.value.gdprBannerDescription,
        },
        GlobalStyles: {
          textColor: this.cookieBannerForm.value.gdprBannerGlobalStyleTextColor,
          background: this.cookieBannerForm.value.gdprBannerGlobalStyleBackgroundColor,
        },
        PreferenceButtonStylesAndContent: {
          textContent: this.cookieBannerForm.value.gdprBannerPreferenceButtonTextContent,
          textColor: this.cookieBannerForm.value.gdprBannerPreferenceButtonTextColor,
          background: this.cookieBannerForm.value.gdprBannerPreferenceButtonBackgroundColor
        },
        AllowAllButtonStylesAndContent: {
          textContent: this.cookieBannerForm.value.gdprBannerAllowAllButtonTextContent,
          textColor: this.cookieBannerForm.value.gdprBannerAllowAllButtonTextColor,
          background: this.cookieBannerForm.value.gdprBannerAllowAllButtonBackgroundColor
        },
        DisableAllButtonStylesAndContent: {
          textContent: this.cookieBannerForm.value.gdprBannerDisableAllButtonTextContent,
          textColor: this.cookieBannerForm.value.gdprBannerDisableAllButtonTextColor,
          background: this.cookieBannerForm.value.gdprBannerDisableAllButtonBackgroundColor
        }
      },
      POPUP: {
        Content: {
          PurposeBodyDescription: this.cookieBannerForm.value.gdprPopUpPurposeBodyDescription,
          VendorBodyDescription: this.cookieBannerForm.value.gdprPopUpVendorBodyDescription,
        },
        GlobalStyles: {
          textColor: this.cookieBannerForm.value.gdprPopUpGlobalTextColor,
          backgroundColor: this.cookieBannerForm.value.gdprPopUpGlobalBackgroundColor,
        },
        PurposeButton: {
          textColor: this.cookieBannerForm.value.gdprPopUpPurposeButtonTextColor,
          backgroundColor: this.cookieBannerForm.value.gdprPopUpPurposeButtonBackgroundColor
        },
        DisableAllButton: {
          textContent: this.cookieBannerForm.value.gdprPopUpDisableAllButtonTextContent,
          backgroundColor: this.cookieBannerForm.value.gdprPopUpDisableAllButtonBackgroundColor,
          textColor: this.cookieBannerForm.value.gdprPopUpDisableAllButtonTextColor
        },
        AllowAllButton: {
          textContent: this.cookieBannerForm.value.gdprPopUpAllowAllButtonTextContent,
          backgroundColor: this.cookieBannerForm.value.gdprPopUpAllowAllButtonBackgroundColor,
          textColor: this.cookieBannerForm.value.gdprPopUpAllowAllButtonTextColor
        },
        SaveMyChoiseButton: {
          textContent: this.cookieBannerForm.value.gdprPopUpSaveMyChoiceButtonContentText,
          backgroundColor: this.cookieBannerForm.value.gdprPopUpSaveMyChoiceButtonBackgroundColor,
          textColor: this.cookieBannerForm.value.gdprPopUpSaveMyChoiceButtonContentText
        }
      },
    };
  }
  backClicked() {
    this._location.back();
  }
  onSelectLogo (e) {
    // console.log(e);
    if (e.checked) {
      this.logoText = 'Adzapier';
    } else {
      this.logoText = '';
    }
  }

  onCheckCountry(event) {
     this.isGdprGlobal =  event.includes('EU');
     if (this.isGdprGlobal) {
       this.cookieBannerForm.get('ccpaTarget').clearValidators();
       this.cookieBannerForm.get('ccpaTarget').updateValueAndValidity();
     }
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }
}
