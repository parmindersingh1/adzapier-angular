import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ccpaBannerConstant, defaultData} from '../../_constant/gdpr-ccpa-banner.constant';
import {CookieBannerService} from '../../_services/cookie-banner.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {notificationConfig} from '../../_constant/notification.constant';
import {NotificationsService} from 'angular2-notifications';

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
  public ccpaBannerConstant = ccpaBannerConstant;
  public defaultData = defaultData;
  constructor(private formBuilder: FormBuilder,
              private notification: NotificationsService,
              private cookieBannerService: CookieBannerService,
              private loading: NgxUiLoaderService,
  ) {
  }

  cookieBannerForm: FormGroup;
  submitted = false;

  ngOnInit() {
    this.onFormInIt();
  }

  onFormInIt() {
    this.cookieBannerForm = this.formBuilder.group({
      ccpaTarget: ['', Validators.required],
      gdprTarget: ['', Validators.required],
      cookieBlocking: [this.defaultData.defaultCookieBlocking],
      enableIab: [this.defaultData.defaultEnableIab],
      email: [this.defaultData.defaultEmail],
      // GDPR BANNER
      gdprBannerlanguage: [this.defaultData.gdprDefaultLang, Validators.required],
      gdprBannerPosition: [this.defaultData.gdprDefaultBannerPosition, Validators.required],
      gdprBannerTitle: [this.ccpaBannerConstant.GDPR.BANNER.BannerTitle, Validators.required],
      gdprBannerDescription: [this.ccpaBannerConstant.GDPR.BANNER.BannerDescription, Validators.required],
      gdprBannerGlobalStyleTextColor: [this.ccpaBannerConstant.GDPR.BANNER.BannerGlobalStyleTextColor, Validators.required],
      gdprBannerGlobalStyleBackgroundColor: [this.ccpaBannerConstant.GDPR.BANNER.BannerGlobalStyleBackgroundColor, Validators.required],
      gdprBannerPreferenceButtonTextContent: [this.ccpaBannerConstant.GDPR.BANNER.BannerPreferenceButtonTextContent, Validators.required],
      gdprBannerPreferenceButtonTextColor: [this.ccpaBannerConstant.GDPR.BANNER.BannerPreferenceButtonTextColor, Validators.required],
      gdprBannerPreferenceButtonBackgroundColor: [this.ccpaBannerConstant.GDPR.BANNER.BannerPreferenceButtonBackgroundColor, Validators.required],
      gdprBannerAllowAllButtonTextContent: [this.ccpaBannerConstant.GDPR.BANNER.BannerAllowAllButtonTextContent, Validators.required],
      gdprBannerAllowAllButtonTextColor: [this.ccpaBannerConstant.GDPR.BANNER.BannerAllowAllButtonTextColor, Validators.required],
      gdprBannerAllowAllButtonBackgroundColor: [this.ccpaBannerConstant.GDPR.BANNER.BannerAllowAllButtonBackgroundColor, Validators.required],
      gdprBannerDisableAllButtonTextContent: [this.ccpaBannerConstant.GDPR.BANNER.BannerDisableAllButtonTextContent, Validators.required],
      gdprBannerDisableAllButtonTextColor: [this.ccpaBannerConstant.GDPR.BANNER.BannerDisableAllButtonTextColor, Validators.required],
      gdprBannerDisableAllButtonBackgroundColor: [this.ccpaBannerConstant.GDPR.BANNER.BannerDisableAllButtonBackgroundColor, Validators.required],
      // GDPR POPUP
      gdprPopUpPurposeBodyDescription: [this.ccpaBannerConstant.GDPR.POPUP.PopUpPurposeBodyDescription, Validators.required],
      gdprPopUpVendorBodyDescription: [this.ccpaBannerConstant.GDPR.POPUP.PopUpVendorBodyDescription, Validators.required],
      gdprPopUpGlobalTextColor: [this.ccpaBannerConstant.GDPR.POPUP.PopUpGlobalTextColor, Validators.required],
      gdprPopUpGlobalBackgroundColor: [this.ccpaBannerConstant.GDPR.POPUP.PopUpGlobalBackgroundColor, Validators.required],
      gdprPopUpPurposeButtonTextColor: [this.ccpaBannerConstant.GDPR.POPUP.PopUpPurposeButtonTextColor, Validators.required],
      gdprPopUpPurposeButtonBackgroundColor: [this.ccpaBannerConstant.GDPR.POPUP.PopUpPurposeButtonBackgroundColor, Validators.required],
      gdprPopUpPurposeButtonBorderColor: [this.ccpaBannerConstant.GDPR.POPUP.PopUpPurposeButtonBorderColor, Validators.required],
      gdprPopUpDisableAllButtonTextContent: [this.ccpaBannerConstant.GDPR.POPUP.PopUpDisableAllButtonTextContent, Validators.required],
      gdprPopUpDisableAllButtonTextColor: [this.ccpaBannerConstant.GDPR.POPUP.PopUpDisableAllButtonTextColor, Validators.required],
      gdprPopUpDisableAllButtonBackgroundColor: [this.ccpaBannerConstant.GDPR.POPUP.PopUpDisableAllButtonBackgroundColor, Validators.required],
      gdprPopUpSaveMyChoiceButtonContentText: [this.ccpaBannerConstant.GDPR.POPUP.PopUpSaveMyChoiceButtonContentText, Validators.required],
      gdprPopUpSaveMyChoiceButtonTextColor: [this.ccpaBannerConstant.GDPR.POPUP.PopUpSaveMyChoiceButtonTextColor, Validators.required],
      gdprPopUpSaveMyChoiceButtonBackgroundColor: [this.ccpaBannerConstant.GDPR.POPUP.PopUpSaveMyChoiceButtonBackgroundColor, Validators.required],
      gdprPopUpAllowAllButtonTextContent: [this.ccpaBannerConstant.GDPR.POPUP.PopUpAllowAllButtonTextContent, Validators.required],
      gdprPopUpAllowAllButtonTextColor: [this.ccpaBannerConstant.GDPR.POPUP.PopUpAllowAllButtonTextColor, Validators.required],
      gdprPopUpAllowAllButtonBackgroundColor: [this.ccpaBannerConstant.GDPR.POPUP.PopUpAllowAllButtonBackgroundColor, Validators.required],
      // CCPA BANNER
      ccpaBannerPosition: [this.defaultData.ccpaBannerPosition, Validators.required],
      ccpaBannerTitle: [this.ccpaBannerConstant.CCPA.BANNER.BannerTitle, Validators.required],
      ccpaBannerDescription: [this.ccpaBannerConstant.CCPA.BANNER.BannerDescription, Validators.required],
      ccpaBannerGlobalStyleTextColor: [this.ccpaBannerConstant.CCPA.BANNER.BannerGlobalStyleTextColor, Validators.required],
      ccpaBannerGlobalStyleBackgroundColor: [this.ccpaBannerConstant.CCPA.BANNER.BannerGlobalStyleBackgroundColor, Validators.required],
      ccpaBannerPreferenceButtonTextContent: [this.ccpaBannerConstant.CCPA.BANNER.BannerPreferenceButtonTextContent, Validators.required],
      ccpaBannerPreferenceButtonTextColor: [this.ccpaBannerConstant.CCPA.BANNER.BannerPreferenceButtonTextColor, Validators.required],
      ccpaBannerPreferenceButtonBackgroundColor: [this.ccpaBannerConstant.CCPA.BANNER.BannerPreferenceButtonBackgroundColor, Validators.required],
      ccpaBannerAllowAllButtonTextContent: [this.ccpaBannerConstant.CCPA.BANNER.BannerAllowAllButtonTextContent, Validators.required],
      ccpaBannerAllowAllButtonTextColor: [this.ccpaBannerConstant.CCPA.BANNER.BannerAllowAllButtonTextColor, Validators.required],
      ccpaBannerAllowAllButtonBackgroundColor: [this.ccpaBannerConstant.CCPA.BANNER.BannerAllowAllButtonBackgroundColor, Validators.required],
      ccpaBannerDisableAllButtonTextContent: [this.ccpaBannerConstant.CCPA.BANNER.BannerDisableAllButtonTextContent, Validators.required],
      ccpaBannerDisableAllButtonTextColor: [this.ccpaBannerConstant.CCPA.BANNER.BannerDisableAllButtonTextColor, Validators.required],
      ccpaBannerDisableAllButtonBackgroundColor: [this.ccpaBannerConstant.CCPA.BANNER.BannerDisableAllButtonBackgroundColor, Validators.required],
      // CCPA POPUP
      ccpaPopUpGlobalTextColor: [this.ccpaBannerConstant.CCPA.POPUP.PopUpGlobalTextColor, Validators.required],
      ccpaPopUpGlobalBackgroundColor: [this.ccpaBannerConstant.CCPA.POPUP.PopUpGlobalBackgroundColor, Validators.required],
      // ccpaPopUpPurposeButtonTextColor: [this.ccpaBannerConstant.CCPA.POPUP.PopUpPurposeButtonTextColor, Validators.required],
      // ccpaPopUpPurposeButtonBackgroundColor: [this.ccpaBannerConstant.CCPA.POPUP.PopUpPurposeButtonBackgroundColor, Validators.required],
      // ccpaPopUpPurposeButtonBorderColor: [this.ccpaBannerConstant.CCPA.POPUP.PopUpPurposeButtonBorderColor, Validators.required],
      ccpaPopUpDisableAllButtonTextContent: [this.ccpaBannerConstant.CCPA.POPUP.PopUpDisableAllButtonTextContent, Validators.required],
      ccpaPopUpDisableAllButtonTextColor: [this.ccpaBannerConstant.CCPA.POPUP.PopUpDisableAllButtonTextColor, Validators.required],
      ccpaPopUpDisableAllButtonBackgroundColor: [this.ccpaBannerConstant.CCPA.POPUP.PopUpDisableAllButtonBackgroundColor, Validators.required],
      ccpaPopUpAllowAllButtonTextContent: [this.ccpaBannerConstant.CCPA.POPUP.PopUpAllowAllButtonTextContent, Validators.required],
      ccpaPopUpAllowAllButtonTextColor: [this.ccpaBannerConstant.CCPA.POPUP.PopUpAllowAllButtonTextColor, Validators.required],
      ccpaPopUpAllowAllButtonBackGroundColor: [this.ccpaBannerConstant.CCPA.POPUP.PopUpAllowAllButtonBackgroundColor, Validators.required],
      ccpaPopUpInformationTitle: [this.ccpaBannerConstant.CCPA.POPUP.PopUpInformationTitle, Validators.required],
      ccpaPopUpInformationDescription: [this.ccpaBannerConstant.CCPA.POPUP.PopUpInformationDescription, Validators.required],
      ccpaPopUpNecessaryTitle: [this.ccpaBannerConstant.CCPA.POPUP.PopUpNecessaryTitle, Validators.required],
      ccpaPopUpNecessaryDescription: [this.ccpaBannerConstant.CCPA.POPUP.PopUpNecessaryDescription, Validators.required],
      ccpaPopUpAnalyticsTitle: [this.ccpaBannerConstant.CCPA.POPUP.PopUpAnalyticsTitle, Validators.required],
      ccpaPopUpAnalyticsDescription: [this.ccpaBannerConstant.CCPA.POPUP.PopUpAnalyticsDescription, Validators.required],
      ccpaPopUpAdvertisingTitle: [this.ccpaBannerConstant.CCPA.POPUP.PopUpAdvertisingTitle, Validators.required],
      ccpaPopUpAdvertisingDescription: [this.ccpaBannerConstant.CCPA.POPUP.PopUpAdvertisingDescription, Validators.required],
    });
  }

  get f() {
    return this.cookieBannerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loading.start();
    if (this.cookieBannerForm.invalid) {
      return;
    }
    const formData = this.onGetFormData();
    this.cookieBannerService.onSubmitCookieBannerData(formData)
      .subscribe(res => {
        this.loading.stop();
        console.log(res);
      }, error => {
        this.notification.error('Error', error, notificationConfig);
        this.loading.stop();
      })

    }

    onGetFormData() {
      return {
        GDPR: {
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
              backgroundColor: this.cookieBannerForm.value.gdprPopUpPurposeButtonBackgroundColor,
              borderColor: this.cookieBannerForm.value.gdprPopUpPurposeButtonBorderColor
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
        },

        CCPA: {
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
            Content: {
              Information: {
                title: this.cookieBannerForm.value.ccpaPopUpInformationTitle,
                description: this.cookieBannerForm.value.ccpaPopUpInformationDescription
              },
              Necessary: {
                title: this.cookieBannerForm.value.ccpaPopUpNecessaryTitle,
                description: this.cookieBannerForm.value.ccpaPopUpNecessaryDescription
              },
              Analytics: {
                title: this.cookieBannerForm.value.ccpaPopUpAnalyticsTitle,
                description: this.cookieBannerForm.value.ccpaPopUpAnalyticsDescription
              },
              Advertising: {
                title: this.cookieBannerForm.value.ccpaPopUpAdvertisingTitle,
                description: this.cookieBannerForm.value.ccpaPopUpAdvertisingDescription
              }
            },
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
        }
      };
    }
}
