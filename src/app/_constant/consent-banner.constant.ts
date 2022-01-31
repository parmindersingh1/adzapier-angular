export const defaultData = {
  ccpaDefaultTarget: 'us',
  gdprDefaultTarget: ['be', 'bg', 'cz', 'dk', 'de', 'ee', 'ie', 'el', 'es', 'fr', 'hr', 'it', 'cy', 'lv', 'lt', 'lu', 'hu', 'mt', 'nl', 'at', 'pl', 'pt', 'ro', 'si', 'sk', 'fi', 'se'],
  defaultCookieBlocking: false,
  muteBanner: false,
  defaultEnableIab: true,
  defaultEmail: false,
  google_vendors: false,
  gdprGlobal: false,
  ccpaGlobal: false,
  genericGlobal: false,
  allowPurposeByDefault: true,
  showBadge: true,
  logo: true,
  gdprDefaultLang: 'en',
  DefaultBannerPosition: 'bottom',
  DefaultBadgePosition: 'right',
  BannerDisplayFrequency: {
    partialConsent: 'hours',
    rejectAll: 'days',
    noConsent: 'pageViews',
  }
};

export const defaultBannerContent = {
  privacy: 'Privacy',
  privacyLink: 'https://your-domain.com/privacy-policy/',
  privacyTextColor: '#4d67ff',
  position: 'bottom',
  bannerTitle: 'We Care About Your Privacy',
  bannerTitle2: 'We and our Partners data to provide',
  bannerDescription: 'By clicking "Accept All" you consent to us and all the third-parties mentioned in our Privacy and Cookies Preference setting to store cookies and other technologies to enhance your website experience, process your personal data, show you personalized content and advertisements, analyze website efficiency, and improve our marketing efforts. ',
  bannerTextColor: '#f5f5f5',
  bannerBorderColor: '#162893',
  bannerBackGroundColor: '#000000',
  badgePosition: 'left',
  //
  bannerPreferenceButtonText: 'Privacy Setting',
  bannerPreferenceButtonTextColor: '#f5f5f5',
  bannerPreferenceButtonBackGroundColor: 'transparent',
  //
  bannerDisableButtonText: 'Disable All',
  bannerDisableButtonTextColor: '#f5f5f5',
  bannerDisableButtonBackGroundColor: '#162893',
  //
  BannerDoNotSellMyDataText: 'Do Not Sell My Data',
  BannerDoNotSellMyDataTextColor: '#f5f5f5',
  BannerDoNotSellMyDataBackGroundColor: '#162893',
  //
  bannerAcceptButtonText: 'Accept All',
  bannerAcceptButtonTextColor: '#f5f5f5',
  bannerAcceptButtonBackgroundColor: '#162893',

  //PopUp
  PopUpGdprPurposeDescription: 'To provide the best experiences, we and our partners use cookies and technologies to store and/or access device information. Consenting to these technologies will allow us and our partners to process personal data such as browsing behavior or unique IDs on this site. Not consenting or withdrawing consent, may adversely affect certain features and functions. You may exercise your right to consent or object to legitimate interest, based on specific purpose or at a partner level in the link under each purpose. These choices will be signaled to our vendors participating in the Transparency and Consent Framework.',
  PopUpGdprVendorDescription: 'These are the partners whom we share data with. You can see which purposes they are requesting consent and/or which purposes they are claiming legitimate interest for by clicking on each partner. You can turn each one on and off to control whether or not data is shared with them or may disable all data processing. However, please note that by disabling all data processing, some site functionality may be affected. For some purposes, your personal data may be processed on the legal ground of legitimate interest.', //

  PopUpCcpaGenericPurposeDescription: 'When you visit our website, we store cookie on your browser to collection information. This information might be related to you or your device, your preferences, and mostly used to make the website work as you expect it to and to provide a more personalized web browsing experience. Your privacy is important to us, you can choose not to allow some types of cookies. Click on the different cookie category heading to find out more information and change our default settings. You have the option of disabling certain types of storage that may not be necessary for the basic functioning of the website. If you decide to decline, we may not be able to provide you the optimal website browsing experience. You cannot disable our Essential First Party Strictly Necessary Cookies as they are implemented to ensure the proper functioning of our website. Such as log into your account, remembering your settings, prompting the cookie banner and redirect when you logout etc.',
  PopUpCcpaGenericPrivacyInfoDescription: 'Use this page to learn more about data privacy and how data is used to improve your site experience.',

  PopUpPurposeButtonTextColor: '#575751',
  PopUpPurposeButtonBackGroundColor: 'rgb(250, 250, 250)',
  //
  PopUpSwitchButtonColor: '#4b90ff',
  //
  PopUpDisableAllButtonText: 'Disable All',
  PopUpDisableAllButtonTextColor: '#f5f5f5',
  PopUpDisableAllButtonBackgroundColor: '#000000',

  //
  PopUpDoNotSellText: 'Do Not Sell My Data',
  PopUpDoNotSellTextColor: '#f5f5f5',
  PopUpDoNotSellBackgroundColor: '#162893',

  PopUpSaveMyChoiceButtonText: 'Save My Choices',
  PopUpSaveMyChoiceButtonTextColor: '#f5f5f5',
  PopUpSaveMyChoiceButtonBackgroundColor: '#162893',

  //

  PopUpAllowAllButtonText: 'Accept All',
  PopUpAllowAllButtonTextColor: '#f5f5f5',
  PopUpAllowAllButtonBackgroundColor: '#162893',


  //
  AdvertisingTitle: 'Advertising Cookies',
  AdvertisingDescription: 'Advertising cookies track activity across websites in order to understand a viewer’s interests, and direct them specific marketing. Some examples include: cookies used for remarketing, or interest-based advertising.',


  SocialMediaTitle: 'Social Media Cookies',
  SocialMediaDescription: 'These cookies have been added to the site by various social media services, so that you can share our content with friends and networks. They\'re capable of tracking your browser across other sites and building a profile of your interests. This may have an impact on ad personalization and messages you see on other websites you visit. If you do not allow these cookies, you may not be able to use or view these shared tools.',

  AnalyticsTitle: 'Analytics Cookies',
  AnalyticsDescription: 'Functional cookies enhance functions, performance, and services on the website. Some examples include: cookies used to analyze site traffic, cookies used for market research, and cookies used to display advertising that is not directed to a particular individual.',

  EssentialTitle: 'Essential Cookies',
  EssentialDescription: 'These Cookies are essential to provide you with services available through the Website and to enable you to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that you have asked for cannot be provided, and We only use these Cookies to provide you with those services.',

  FunctionalTitle: 'Functional Cookies',
  FunctionalDescription: 'Functional cookies help to perform certain functionalities like sharing the content of the website on social media platforms, collect feedbacks, and other third-party features.',

  UnknownTitle: 'Unknown',
  UnknownDescription: 'Unknown cookies are cookies that we are in the process of classifying, together with the providers of individual cookies.'
};

export class FormDefaultData {
  privacy: string;
  privacyLink: string;
  privacyTextColor: string;
  position: string;
  bannerTitle: string;
  bannerTitle2: string;
  bannerDescription: string;
  bannerTextColor: string;
  bannerBorderColor: string;
  bannerBackGroundColor: string;
  badgePosition: string;
  BannerPosition: string;

  bannerPreferenceButtonText: string;
  bannerPreferenceButtonTextColor: string;
  bannerPreferenceButtonBackGroundColor: string;
  //
  bannerDisableButtonText: string;
  bannerDisableButtonTextColor: string;
  bannerDisableButtonBackGroundColor: string;

  BannerDoNotSellMyDataText: string;
  BannerDoNotSellMyDataTextColor: string;
  BannerDoNotSellMyDataBackGroundColor: string;
  //
  bannerAcceptButtonText: string;
  bannerAcceptButtonTextColor: string;
  bannerAcceptButtonBackgroundColor: string;


  // PopUp
  PopUpGdprVendorDescription: string;
  PopUpGdprPurposeDescription: string;
  //
  PopUpCcpaGenericPurposeDescription: string;
  PopUpCcpaGenericPrivacyInfoDescription: string;

  PopUpSwitchButtonColor: string;
  //
  PopUpPurposeButtonTextColor: string;
  PopUpPurposeButtonBackGroundColor: string;
  //

  PopUpDisableAllButtonText: string;
  PopUpDisableAllButtonTextColor: string;
  PopUpDisableAllButtonBackgroundColor: string;

  //
  PopUpDoNotSellText: string;
  PopUpDoNotSellTextColor: string;
  PopUpDoNotSellBackgroundColor: string;

  PopUpSaveMyChoiceButtonText: string;
  PopUpSaveMyChoiceButtonTextColor: string;
  PopUpSaveMyChoiceButtonBackgroundColor: string;

  //

  PopUpAllowAllButtonText: string;
  PopUpAllowAllButtonTextColor: string;
  PopUpAllowAllButtonBackgroundColor: string;

  //

  AdvertisingTitle: string;
  AdvertisingDescription: string;

  SocialMediaTitle: string;
  SocialMediaDescription: string;

  AnalyticsTitle: string;
  AnalyticsDescription: string;

  EssentialTitle: string;
  EssentialDescription: string;

  FunctionalTitle: string;
  FunctionalDescription: string;

  UnknownTitle: string;
  UnknownDescription: string;
}

export const BannerConstant = {
  ccpaTargetCountry: [{title: 'California', value: 'ca'}, {title: 'USA', value: 'us'}],
  gdprTargetCountry: [
    {label: 'Belgium', value: 'be'},
    {label: 'Bulgaria', value: 'bg'},
    {label: 'Czechia', value: 'cz'},
    {label: 'Denmark', value: 'dk'},
    {label: 'Germany', value: 'de'},
    {label: 'Estonia', value: 'ee'},
    {label: 'Ireland', value: 'ie'},
    {label: 'Greece', value: 'el'},
    {label: 'Spain', value: 'es'},
    {label: 'France', value: 'fr'},
    {label: 'Croatia', value: 'hr'},
    {label: 'Italy', value: 'it'},
    {label: 'Cyprus', value: 'cy'},
    {label: 'Latvia', value: 'lv'},
    {label: 'Lithuania', value: 'lt'},
    {label: 'Luxembourg', value: 'lu'},
    {label: 'Hungary', value: 'hu'},
    {label: 'Malta', value: 'mt'},
    {label: 'Netherlands', value: 'nl'},
    {label: 'Austria', value: 'at'},
    {label: 'Poland', value: 'pl'},
    {label: 'Portugal', value: 'pt'},
    {label: 'Romania', value: 'ro'},
    {label: 'Slovenia', value: 'si'},
    {label: 'Slovakia', value: 'sk'},
    {label: 'Finland', value: 'fi'},
    {label: 'Sweden', value: 'se'}
  ],
  Bannerlanguage: [
    {
      title: 'English (United States)',
      value: 'en-US'
    },
    {
      title: 'Italian (Italy)',
      value: 'it-IT'
    },
    // {
    //   title: 'Czech (Czech Republic)',
    //   value: 'cs-CZ'
    // },
    // {
    //   title: 'Portuguese',
    //   value: 'pl-PL'
    // },
    // {
    //   title: 'Japanese (Japan)',
    //   value: 'ja-JP'
    // },
    {
      title: 'Chinese (PRC)',
      value: 'zh-CN'
    },
    {
      title: 'German (Standard)',
      value: 'de-DE'
    },
    {
      title: 'Russian (Russia)',
      value: 'ru-RU'
    },
    {
      title: 'French (France)',
      value: 'fr-FR'
    },
    {
      title: 'Portuguese (Portugal)',
      value: 'pt-PT'
    },
    {
      title: 'Spanish (Spain)',
      value: 'es-ES'
    },
    {
      title: 'Dutch (Standard)',
      value: 'nl-NL'
    }

  ],
  BannerPosition: [
    {title: 'Top', value: 'top'},
    {title: 'Bottom', value: 'bottom'}
  ],
  BadgePosition: [
    {title: 'Left', value: 'left'},
    {title: 'Right', value: 'right'}
  ],
  BannerDisplayFrequency: [
    {label: 'Hour', value: 'hours'},
    {label: 'Day', value: 'days'},
    {label: 'Page View', value: 'pageViews'},
  ]
};

export const IabPurposeIds = {
  essentiial: [],
  advertising: [3, 4],
  socialMedia: [1, 2],
  analytics: [5, 6],
}


export const iabPurposeList = [
  {
    id: 1,
    name: 'Store and/or access information on a device',
    description: 'Cookies, device identifiers, or other information can be stored or accessed on your device for the purposes presented to you.',
    descriptionLegal: 'Vendors can: * Store and access information on the device such as cookies and device identifiers presented to a user.'
  },
  {
    id: 2,
    name: 'Select basic ads',
    description: 'Ads can be shown to you based on the content you’re viewing, the app you’re using, your approximate location, or your device type.',
    descriptionLegal: 'To do basic ad selection vendors can: * Use real-time information about the context in which the ad will be shown, to show the ad, including information about the content and the device, such as: device type and capabilities, user agent, URL, IP address * Use a user’s non-precise geolocation data * Control the frequency of ads shown to a user. * Sequence the order in which ads are shown to a user. * Prevent an ad from serving in an unsuitable editorial (brand-unsafe) context Vendors cannot: * Create a personalised ads profile using this information for the selection of future ads without a separate legal basis to create a personalised ads profile. * N.B. Non-precise means only an approximate location involving at least a radius of 500 meters is permitted.'
  },
  {
    id: 3,
    name: 'Create a personalised ads profile',
    description: 'A profile can be built about you and your interests to show you personalised ads that are relevant to you.',
    descriptionLegal: 'To create a personalised ads profile vendors can: * Collect information about a user, including a user\'s activity, interests, demographic information, or location, to create or edit a user profile for use in personalised advertising. * Combine this information with other information previously collected, including from across websites and apps, to create or edit a user profile for use in personalised advertising.'
  },
  {
    id: 4,
    name: 'Select personalised ads',
    description: 'Personalised ads can be shown to you based on a profile about you.',
    descriptionLegal: 'To select personalised ads vendors can: * Select personalised ads based on a user profile or other historical user data, including a user’s prior activity, interests, visits to sites or apps, location, or demographic information.'
  },
  {
    id: 5,
    name: 'Create a personalised content profile',
    description: 'A profile can be built about you and your interests to show you personalised content that is relevant to you.',
    descriptionLegal: 'To create a personalised content profile vendors can: * Collect information about a user, including a user\'s activity, interests, visits to sites or apps, demographic information, or location, to create or edit a user profile for personalising content. * Combine this information with other information previously collected, including from across websites and apps, to create or edit a user profile for use in personalising content.'
  },
  {
    id: 6,
    name: 'Select personalised content',
    description: 'Personalised content can be shown to you based on a profile about you.',
    descriptionLegal: 'To select personalised content vendors can: * Select personalised content based on a user profile or other historical user data, including a user’s prior activity, interests, visits to sites or apps, location, or demographic information.'
  },
  {
    id: 7,
    name: 'Measure ad performance',
    description: 'The performance and effectiveness of ads that you see or interact with can be measured.',
    descriptionLegal: 'To measure ad performance vendors can: * Measure whether and how ads were delivered to and interacted with by a user * Provide reporting about ads including their effectiveness and performance * Provide reporting about users who interacted with ads using data observed during the course of the user\'s interaction with that ad * Provide reporting to publishers about the ads displayed on their property * Measure whether an ad is serving in a suitable editorial environment (brand-safe) context * Determine the percentage of the ad that had the opportunity to be seen and the duration of that opportunity * Combine this information with other information previously collected, including from across websites and apps Vendors cannot: *Apply panel- or similarly-derived audience insights data to ad measurement data without a Legal Basis to apply market research to generate audience insights (Purpose 9)'
  },
  {
    id: 8,
    name: 'Measure content performance',
    description: 'The performance and effectiveness of content that you see or interact with can be measured.',
    descriptionLegal: 'To measure content performance vendors can: * Measure and report on how content was delivered to and interacted with by users. * Provide reporting, using directly measurable or known information, about users who interacted with the content * Combine this information with other information previously collected, including from across websites and apps. Vendors cannot: * Measure whether and how ads (including native ads) were delivered to and interacted with by a user. * Apply panel- or similarly derived audience insights data to ad measurement data without a Legal Basis to apply market research to generate audience insights (Purpose 9)'
  },
  {
    id: 9,
    name: 'Apply market research to generate audience insights',
    description: 'Market research can be used to learn more about the audiences who visit sites/apps and view ads.',
    descriptionLegal: 'To apply market research to generate audience insights vendors can: * Provide aggregate reporting to advertisers or their representatives about the audiences reached by their ads, through panel-based and similarly derived insights. * Provide aggregate reporting to publishers about the audiences that were served or interacted with content and/or ads on their property by applying panel-based and similarly derived insights. * Associate offline data with an online user for the purposes of market research to generate audience insights if vendors have declared to match and combine offline data sources (Feature 1) * Combine this information with other information previously collected including from across websites and apps. Vendors cannot: * Measure the performance and effectiveness of ads that a specific user was served or interacted with, without a Legal Basis to measure ad performance. * Measure which content a specific user was served and how they interacted with it, without a Legal Basis to measure content performance.'
  },
  {
    id: 10,
    name: 'Develop and improve products',
    description: 'Your data can be used to improve existing systems and software, and to develop new products',
    descriptionLegal: 'To develop new products and improve products vendors can: * Use information to improve their existing products with new features and to develop new products * Create new models and algorithms through machine learning Vendors cannot: * Conduct any other data processing operation allowed under a different purpose under this purpose'
  }
]
