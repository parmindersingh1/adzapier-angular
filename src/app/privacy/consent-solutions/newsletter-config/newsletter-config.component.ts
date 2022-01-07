import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {
  LanguageListNewsletter,
  newsLetterContent, NewsLetterDarkTheme,
  NewsLetterDisplayFrequency,
  newsLetterFormBuilder, NewsLetterLightTheme
} from './newsletter.constant';
import {LanguageList, LightTheme} from '../../cookie-consent/banner-config/bannerConfigDefaultValue.constant';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {moduleName} from '../../../_constant/module-name.constant';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {NewsletterServiceService} from '../../../_services/newsletter-service.service';
import {debounceTime, map} from 'rxjs/operators';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-newsletter-config',
  templateUrl: './newsletter-config.component.html',
  styleUrls: ['./newsletter-config.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewsletterConfigComponent implements OnInit {
  step = 1;
  languages = LanguageListNewsletter;
  selectedLanguage = ['enUS'];
  ConfigurationForm!: FormGroup;
  allowedLanguagesForPreview = [{
    title: 'English (United States)',
    code: 'enUS',
    countryFlag: 'us',
  }];
  modalRef?: BsModalRef;
  customLang = [];
  colorPicker = {...NewsLetterLightTheme};
  themeType = 'light';
  publishType = 'draft';
  isFormUpdate = false;
  contentSaving = '';
  customerBrandLogo: string | ArrayBuffer = null;
  companyLogoValidation = {
    error: false,
    msg: ''
  };
  @ViewChild('publish', {static: true}) publishModal: ElementRef;
  displayFrequency = NewsLetterDisplayFrequency;
  showInput = 0;
  submitted = false;
  publishing = false;
  dismissible = true;
  alertMsg: any;
  isEdit = false;
  isOpen = false;
  alertType: any;
  customLanguageConfig = {...newsLetterContent};

  //newsletter
  scriptUrl: any;
  addScript = `<script type="application/javascript" src="`;
  closeScript = `"></script>`;
  isCopied = false;
  constructor(   private formBuilder: FormBuilder,
                 private modalService: BsModalService,
                 private cd: ChangeDetectorRef,
                 private NewsLetterService: NewsletterServiceService,
                 private loading: NgxUiLoaderService
                 ) { }

  ngOnInit(): void {
    this.ConfigurationForm = this.formBuilder.group({
      PreviewLanguage: [{
        title: 'English (United States)',
        code: 'enUS',
        countryFlag: 'us',
      }],
      // content
      Title: [newsLetterContent.enUS.title, Validators.required],
      Description: [newsLetterContent.enUS.description, Validators.required],
      TermAndConditionLink: ['', Validators.required],
      PrivacyLink: ['', Validators.required],
      SubscribeButtonText: [newsLetterContent.enUS.subscribeButtonText, Validators.required],
      // Layout
      HeaderBackgroundColor: [''],
      HeaderTextColor: [''],
      BorderColor: [''],
      BodyBackgroundColor: [''],
      BodyTextColor: [''],
      SubscribeButtonBackgroundColor: [''],
      SubscribeButtonTextColor: [''],
      // Basic Config
      LayoutType: ['center'],
      MutePopup: [false],
      ShowWatermark: [''],
      FormInputs: this.formBuilder.array([]) ,
      DefaultLanguage: ['enUS'],
      // Display Frequency
      DisplayClosedConsent: [10],
      DisplayClosedConsentType: ['pageViews'],
    });
    newsLetterFormBuilder.map(form => {
      this.formInputs.push(this.newFormInput(form));
    });
    this.onSetDefaultStyle(NewsLetterLightTheme);
    this.ConfigurationForm.valueChanges
      .pipe(
        map((i: any) => i),
        debounceTime(2000)
      ).subscribe(res => {
      if (this.checkFormDirty()) {
        this.onSaveCustomLangOnDB();
      }
    });
    this.onGetNewsLetterConfiguration();
  }
  onGetNewsLetterConfiguration() {
    this.NewsLetterService.onGetNewsLetterData(this.constructor.name, moduleName.consentPreferenceNewsLetter)
      .subscribe((res: any) => {
        if (res?.response.hasOwnProperty('configuration')) {
          this.isFormUpdate = true;
          this.onSetSavedConfig(res.response);
        }
      });
  }
  onSetSavedConfig(res) {
    const configuration = res.configuration;
    this.themeType = configuration?.Layout?.ThemeType;
    this.customerBrandLogo = configuration?.Branding?.CompanyLogo;
    this.customLanguageConfig = configuration?.LanguagesConfig?.LanguageData;
    this.customLang = configuration?.LanguagesConfig?.CustonLang ? configuration?.LanguagesConfig?.CustonLang : [];
    this.allowedLanguagesForPreview = configuration?.LanguagesConfig?.AllowedLang;
    this.selectedLanguage = [];
    for (const lang of this.allowedLanguagesForPreview) {
      this.selectedLanguage.push(lang.code);
    }
    this.ConfigurationForm.patchValue({
      FormInputs: configuration?.Form?.Validation,
      HeaderBackgroundColor: configuration?.Layout?.HeaderBackgroundColor,
      HeaderTextColor: configuration?.Layout?.HeaderTextColor,
      BorderColor: configuration?.Layout?.BorderColor,
      BodyBackgroundColor: configuration?.Layout?.BodyBackgroundColor,
      BodyTextColor: configuration?.Layout?.BodyTextColor,
      SubscribeButtonBackgroundColor: configuration?.Layout?.SubscribeButtonBackgroundColor,
      SubscribeButtonTextColor: configuration?.Layout?.SubscribeButtonTextColor,
      ShowWatermark: configuration?.BasicConfig?.WaterMark,
      LayoutType: configuration?.BasicConfig?.BoxedType,
      TermAndConditionLink: configuration?.Links?.TermAndConditionLink,
      PrivacyLink: configuration?.Links.PrivacyLink,
      DisplayClosedConsent: configuration?.DisplayFrequency?.DisplayClosedConsent,
      DisplayClosedConsentType: configuration?.DisplayFrequency?.DisplayClosedConsentType,
      DefaultLanguage: configuration?.LanguagesConfig?.DefaultLanguage,
      MutePopup: configuration?.BasicConfig?.MutePopup,
      PreviewLanguage: this.allowedLanguagesForPreview.length > 0 ? this.allowedLanguagesForPreview[0] : {title: 'English (United States)', code: 'enUS', countryFlag: 'us'}
    });
    this.colorPicker.HeaderBackgroundColor = configuration?.Layout?.HeaderBackgroundColor;
    this.colorPicker.HeaderTextColor = configuration?.Layout?.HeaderTextColor;
    this.colorPicker.BorderColor = configuration?.Layout?.BorderColor;
    this.colorPicker.BodyBackgroundColor = configuration?.Layout?.BodyBackgroundColor;
    this.colorPicker.BodyTextColor = configuration?.Layout?.BodyTextColor;
    this.colorPicker.SubscribeButtonBackgroundColor = configuration?.Layout?.SubscribeButtonBackgroundColor;
    this.colorPicker.SubscribeButtonTextColor = configuration?.Layout?.SubscribeButtonTextColor;


    if (this.allowedLanguagesForPreview.length > 0) {
      this.ConfigurationForm.patchValue({
        PreviewLanguage: this.allowedLanguagesForPreview[0]
      });
      this.onLoadContent(this.allowedLanguagesForPreview[0].code);
    }
  }
  checkFormDirty() {
    return this.ConfigurationForm.controls.Title.dirty ||
      this.ConfigurationForm.controls.Description.dirty ||
      this.ConfigurationForm.controls.SubscribeButtonText.dirty;
  }
  onSaveCustomLangOnDB() {
    const langCode = this.ConfigurationForm.value.PreviewLanguage.code;
    this.customLanguageConfig[langCode].title = this.ConfigurationForm.value.Title;
    this.customLanguageConfig[langCode].description = this.ConfigurationForm.value.Description;
    this.customLanguageConfig[langCode].subscribeButtonText = this.ConfigurationForm.value.SubscribeButtonText;
    if (!this.customLang.includes(langCode)) {
      this.customLang.push(langCode);
    }
  }
  get f() {
    return this.ConfigurationForm.controls;
  }
  get formInputs(): FormArray {
    return this.ConfigurationForm.get('FormInputs') as FormArray;
  }
  newFormInput(form): FormGroup {
    if (form.key === 'email') {
      return this.formBuilder.group({
        key: [form.key, {disabled: true}],
        display: [ form.display, {disabled: true}],
        required: [ form?.required, {disabled: true}],
        emailValidation: [ form?.emailValidatio, {disabled: true}],
      });
    } else if (form.key === 'privacy_Policy') {
      return this.formBuilder.group({
        key: [form.key],
        display: [form.display],
        required: [form?.required]
      });
    } else {
      return this.formBuilder.group({
        key: [form.key],
        display: [form.display],
        required: [form?.required],
        minLength: [form?.minLength],
        maxLength: [form?.maxLength],
      });
    }
  }
  onAllowAllLanguage(e) {
    if (e.checked) {
      this.selectedLanguage = [];
      this.allowedLanguagesForPreview = [];
      for (const lang of LanguageList) {
        this.selectedLanguage.push(lang.code);
      }
      this.allowedLanguagesForPreview = [...LanguageListNewsletter];
    } else {
      this.selectedLanguage = [];
      this.allowedLanguagesForPreview = [];
    }
  }
  onSetDefaultStyle(theme) {
    const ThemeColor = theme;
    this.ConfigurationForm.patchValue({
      HeaderBackgroundColor: ThemeColor.HeaderBackgroundColor,
      HeaderTextColor: ThemeColor.HeaderTextColor,
      BodyBackgroundColor: ThemeColor.BodyBackgroundColor,
      BodyTextColor: ThemeColor.BodyTextColor,
      BorderColor: ThemeColor.BorderColor,
      SubscribeButtonBackgroundColor: ThemeColor.SubscribeButtonBackgroundColor,
      SubscribeButtonTextColor: ThemeColor.SubscribeButtonTextColor,
    });
  }

  onSetLanguage(e, langCode) {
    const isChecked = e.target.checked;
    const selectedLanguage = [...this.selectedLanguage];
    let allowedLangForPreview = [...this.allowedLanguagesForPreview];
    if (isChecked) {
      if (!selectedLanguage.includes(langCode)) {
        selectedLanguage.push(langCode);
        allowedLangForPreview.push(this.onFindLangByCode(langCode));
      }
    } else {
      const index = this.selectedLanguage.indexOf(langCode);
      if (index > -1) {
        selectedLanguage.splice(index, 1);
      }
      if (this.allowedLanguagesForPreview.length === 1) {
        allowedLangForPreview = [];
      } else {
        const index1 = this.allowedLanguagesForPreview.indexOf(this.onFindLangByCode(langCode));
        if (index1 > -1) {
          allowedLangForPreview.splice(index1, 1);
        }
      }
    }
    this.selectedLanguage = selectedLanguage;
    this.allowedLanguagesForPreview = allowedLangForPreview;
    if (this.allowedLanguagesForPreview.length > 0) {
      this.ConfigurationForm.patchValue({
        PreviewLanguage: this.allowedLanguagesForPreview[0]
      });
      this.onLoadContent(this.allowedLanguagesForPreview[0].code);
    }
    console.log('allowedLanguagesForPreview', this.allowedLanguagesForPreview)
  }
  onFindLangByCode(langCode) {
    let langData = {
      title: 'English (United States)',
      code: 'enUS',
      countryFlag: 'us',
    };
    for (const lang of LanguageListNewsletter) {
      if (lang.code === langCode) {
        langData = lang;
      }
    }
    return langData;
  }
  onResetLang(lang) {
    this.onGetGlobleLangData(lang);
    const index = this.customLang.indexOf(lang);
    if (index > -1) {
      this.customLang.splice(index, 1);
    }
  }

  onGetGlobleLangData(langCode) {
    // this.loading.start();
    // this.cookieBannerService.GetGlobleLangData(langCode).subscribe(res => {
    //   this.loading.stopAll();
    //   this.languageContents = res;
    //   this.BannerConfigurationForm.markAsPristine();
    //   this.onSetDefaultContent(res);
    // }, error => {
    //   this.loading.stopAll();
    //   alert('Error ::: Unable to Load Language');
    // });
    this.onSetDefaultContent()
  }

  onSetDefaultContent() {
    const langCode = this.ConfigurationForm.value.PreviewLanguage.code;
    // const ConfigLang = this.ConfigurationForm.value;
    const globleLang = {...newsLetterContent};

    // this.customLanguageConfig[langCode].title = globleLang[langCode].title;
    // this.customLanguageConfig[langCode].description = globleLang[langCode].description;
    // this.customLanguageConfig[langCode].SubscribeButtonText = globleLang[langCode].SubscribeButtonText;
    this.ConfigurationForm.patchValue({
      Title: globleLang[langCode].title,
      Description: globleLang[langCode].description,
      SubscribeButtonText: globleLang[langCode].subscribeButtonText,
    });
  }

  onSelectPreviewLang() {
    const langCode = this.ConfigurationForm.value.PreviewLanguage.code;
    this.onLoadContent(langCode);
  }
  onLoadContent(langCode) {
    if (this.customLang.includes(langCode)) {
      this.onGetCustomLangData();
    } else {
      this.onGetGlobleLangData(langCode);
    }
  }

  onGetCustomLangData() {
    const langCode = this.ConfigurationForm.value.PreviewLanguage.code;
    // const ConfigLang = this.ConfigurationForm.value;
    const globleLang = {...newsLetterContent};

    // this.customLanguageConfig[langCode].title = globleLang[langCode].title;
    // this.customLanguageConfig[langCode].description = globleLang[langCode].description;
    // this.customLanguageConfig[langCode].SubscribeButtonText = globleLang[langCode].SubscribeButtonText;
    this.ConfigurationForm.patchValue({
      Title: this.customLanguageConfig[langCode].title,
      Description: this.customLanguageConfig[langCode].description,
      SubscribeButtonText: this.customLanguageConfig[langCode].subscribeButtonText,
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.ConfigurationForm.invalid) {
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
      configuration: this.onSetupConfigurationObject()
    };
    if (this.publishType === 'draft') {
      this.loading.start();
    } else {
      this.publishing = true;
    }
    this.NewsLetterService.onSubmitNewsLetterData(payload, this.publishType, this.constructor.name, moduleName.consentPreferenceNewsLetter)
      .subscribe((res: any) => {
        this.ConfigurationForm.markAsPristine();
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = res.response;
        this.alertType = 'success';
        this.publishing = false;
        this.scriptUrl = res.JSPath;
        this.onGetNewsLetterConfiguration();
        if (this.publishType === 'publish') {
          this.openModal(this.publishModal);
        }
      }, error => {
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
        this.loading.stop();
        this.publishing = false;
      });
  }
  openModal(template) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg setup-modal ',
      animated: false, keyboard: false, ignoreBackdropClick: true
    });
  }

  onUpdateForm() {
    const payload = {
      configuration: this.onSetupConfigurationObject()
    };
    if (this.publishType === 'draft') {
      this.loading.start();
    } else {
      this.publishing = true;
    }
    this.NewsLetterService.onUpdateNewsLetterData(payload, this.publishType, this.constructor.name, moduleName.consentPreferenceNewsLetter)
      .subscribe((res: any) => {
        this.ConfigurationForm.markAsPristine();
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = res.response;
        this.alertType = 'success';
        this.publishing = false;
        this.scriptUrl = res.JSPath;
        this.onGetNewsLetterConfiguration();
        if (this.publishType === 'publish') {
          this.openModal(this.publishModal);
        }
      }, error => {
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
        this.loading.stop();
        this.publishing = false;
      });
  }
  onSetupConfigurationObject() {
    const configuration = this.ConfigurationForm.value;
    return {
      Form: {
        Validation: configuration?.FormInputs
        },
      Layout: {
        HeaderBackgroundColor: configuration?.HeaderBackgroundColor,
        HeaderTextColor: configuration?.HeaderTextColor,
        BorderColor: configuration?.BorderColor,
        BodyBackgroundColor: configuration?.BodyBackgroundColor,
        BodyTextColor: configuration?.BodyTextColor,
        SubscribeButtonBackgroundColor: configuration?.SubscribeButtonBackgroundColor,
        SubscribeButtonTextColor: configuration?.SubscribeButtonTextColor,
        ThemeType: this.themeType
      },
      Branding: {
        CompanyLogo: this.customerBrandLogo
      },
      BasicConfig: {
        WaterMark: configuration?.ShowWatermark,
        BoxedType: configuration?.LayoutType,
        MutePopup: configuration?.MutePopup
      },
      LanguagesConfig: {
        LanguageData: this.customLanguageConfig,
        CustonLang: this.customLang,
        AllowedLang: this.allowedLanguagesForPreview,
        DefaultLanguage: configuration?.DefaultLanguage
      },
      Links: {
        TermAndConditionLink: configuration?.TermAndConditionLink,
        PrivacyLink: configuration?.PrivacyLink,
      },
      DisplayFrequency: {
        DisplayClosedConsent: configuration?.DisplayClosedConsent,
        DisplayClosedConsentType: configuration?.DisplayClosedConsentType,
      }
    };
  }
  onSelectThemeType(type) {
    this.themeType = type;
    if (type === 'dark') {
      this.onSetDefaultStyle(NewsLetterDarkTheme);
    } else if (type === 'light') {
      this.onSetDefaultStyle(NewsLetterLightTheme);
    }
    // if (type === 'custom') {
    //   this.showCustomColor = true;
    // } else {
    //   this.showCustomColor = false;
    // }
  }
  onSetBannerType(type: string) {
    this.ConfigurationForm.patchValue({
      LayoutType: type
    });
  }

  changeListener($event) {
    const file = $event.target.files[0];
    if (!this.validateFile($event.target.files[0].name)) {
      this.companyLogoValidation.error = true;
      this.companyLogoValidation.msg = 'Selected file format is not supported.';
      this.cd.detectChanges();
      return false;
    }
    if (file.size > 20000) {
      this.companyLogoValidation.error = true;
      this.companyLogoValidation.msg = 'Maximum file size to upload is 20kb.';
      this.cd.detectChanges();
      return false;
    }
    this.companyLogoValidation.error = false;
    this.readThis($event.target);
  }
  validateFile(name: string) {
    const ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() === 'png') {
      return true;
    } else if (ext.toLowerCase() === 'jpg') {
      return true;
    } else if (ext.toLowerCase() === 'jpeg') {
      return true;
    }
    else {
      return false;
    }
  }

  readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.customerBrandLogo = myReader.result;
    };
    myReader.readAsDataURL(file);
  }
  copyToClipboard() {
    this.isCopied = true;
    const copyText: any =
      this.addScript + '//' + this.scriptUrl + this.closeScript;
    let textarea = null;
    textarea = document.createElement('textarea');
    textarea.style.height = '0px';
    textarea.style.left = '-100px';
    textarea.style.opacity = '0';
    textarea.style.position = 'fixed';
    textarea.style.top = '-100px';
    textarea.style.width = '0px';
    document.body.appendChild(textarea);
    textarea.value = copyText.trim();
    textarea.select();
    document.execCommand('copy');
  }

}
