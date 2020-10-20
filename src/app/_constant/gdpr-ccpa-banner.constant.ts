export const defaultData = {
  ccpaDefaultTarget: 'ca',
  gdprDefaultTarget: 'eu',
  defaultCookieBlocking: true,
  defaultEnableIab: true,
  defaultEmail: false,
  allowGoogleVendors: true,
  showBadge: true,
  logo: true,
  gdprDefaultLang: 'en',
  DefaultBannerPosition: 'bottom',
};

export const defaultBannerContent = {
  position: 'bottom',
  bannerTitle: 'We use cookies Data',
  bannerDescription: 'We may place these for analysis of our visitor data, to improve our website, show personalised content and to give you a great website experience. For more information about the cookies we use open the settings.',
  bannerTextColor: '#ffffff',
  bannerBackGroundColor: '#000000',
  //
  bannerPreferenceButtonTextContent: 'Privacy Setting',
  bannerPreferenceButtonTextColor: '#ffffff',
  bannerPreferenceButtonBackGroundColor: 'transparent',
  //
  bannerDisableButtonTextContent: 'Disable Button',
  bannerDisableButtonTextColor: '#ffffff',
  bannerDisableButtonBackGroundColor: '#162893',
  //
  bannerAcceptButtonTextContent: 'Accept All',
  bannerAcceptButtonTextColor: '#ffffff',
  bannerAcceptButtonBackgroundColor: '#162893',
  //
  bannerAllowReqButtonTextContent: 'Allow Required',
  bannerAllowReqButtonTextColor: '#ffffff',
  bannerAllowReqButtonBackgroundColor: '#162893',

  //PopUp
  popUpPurposeDescription: 'In order to comply with data protection laws, we ask you to review the key pointsbelow of our Privacy Policy. To continue using our website, you need to select yourpreferences and click "Save".',
  popUpVendorsDescription: 'During consted in the stub are filtered out if not valid. Ping and custom commands are executed and removed from the queue while all other commands remain queued until a valid TC string is set.',
  //
  popUpPurposeButtonTextColor: '#575751',
  popUpPurposeButtonBackGroundColor: '#fafafa',
  //
  popUpSwitchButtonColor: '#4b90ff',
  //
  popUpDisableAllButtonTextContent: 'Disable All',
  popUpDisableAllButtonTextColor: '#ffffff',
  popUpDisableAllButtonBackgroundColor: '#000000',

  //

  popUpSaveMyChoiceButtonTextContent: 'Save My Choice',
  popUpSaveMyChoiceButtonTextColor: '#ffffff',
  popUpSaveMyChoiceButtonBackgroundColor: '#162893',

  //

  popUpAllowAllButtonTextContent: 'Allow All',
  popUpAllowAllButtonTextColor: '#ffffff',
  popUpAllowAllButtonBackgroundColor: '#162893',


  //
  AdvertisingText: 'Advertising',
  PopUpAdvertisingHead: 'Advertising Cookies\n',
  PopUpAdvertisingDescription: 'Advertising cookies track activity across websites in order to understand a viewer’s interests, and direct them specific marketing. Some examples include: cookies used for remarketing, or interest-based advertising.',


  SocialMediaText: 'Social Media',
  PopUpSocialMediaHead: 'General Information\n',
  PopUpSocialMediaDescription: 'In order to comply with data protection laws, we ask you to review the key points below of our Privacy Policy. To continue using our website, you need to select your preferences and click "Save". Privacy Statement',

  AnalyticsText: 'Analytics',
  PopUpAnalyticsHead: 'Functional Cookies\n',
  PopUpAnalyticsDescription: 'Functional cookies enhance functions, performance, and services on the website. Some examples include: cookies used to analyze site traffic, cookies used for market research, and cookies used to display advertising that is not directed to a particular individual.',

  NecessaryText: 'Essentiial',
  PopUpNecessaryHead: 'Required Cookies\n',
  PopUpNecessaryDescription: 'Required cookies are necessary for basic website functionality. Some examples include: session cookies needed to transmit the website, authentication cookies, and security cookies',

}

export class FormDefaultData {
  position: 'bottom';
  bannerTitle: 'We use cookies Data';
  bannerDescription: 'We may place these for analysis of our visitor data, to improve our website, show personalised content and to give you a great website experience. For more information about the cookies we use open the settings.';
  bannerTextColor: '#fff';
  bannerBackGroundColor: '#000';
  //
  bannerPreferenceButtonTextContent: 'Privacy Setting';
  bannerPreferenceButtonTextColor: '#ffffff';
  bannerPreferenceButtonBackGroundColor: 'transparent';
  //
  bannerDisableButtonTextContent: 'Disable Button';
  bannerDisableButtonTextColor: '#ffffff';
  bannerDisableButtonBackGroundColor: '#162893';
  //
  bannerAcceptButtonTextContent: 'Accept All';
  bannerAcceptButtonTextColor: '#ffffff';
  bannerAcceptButtonBackgroundColor: '#162893';
  //
  bannerAllowReqButtonTextContent: 'Allow Required';
  bannerAllowReqButtonTextColor: '#ffffff';
  bannerAllowReqButtonBackgroundColor: '#162893';


  // PopUp

  popUpPurposeDescription: 'In order to comply with data protection laws, we ask you to review the key pointsbelow of our Privacy Policy. To continue using our website, you need to select yourpreferences and click "Save".';
  //
  popUpSwitchButtonColor: '#4b90ff';
  //
  popUpPurposeButtonTextColor: '#575751';
  popUpPurposeButtonBackGroundColor: '#fafafa';
  //

  popUpDisableAllButtonTextContent: 'Disable All';
  popUpDisableAllButtonTextColor: '#ffffff';
  popUpDisableAllButtonBackgroundColor: '#000000';

  //

  popUpSaveMyChoiceButtonTextContent: 'Save My Choice';
  popUpSaveMyChoiceButtonTextColor: '#ffffff';
  popUpSaveMyChoiceButtonBackgroundColor: '#162893';

  //

  popUpAllowAllButtonTextContent: 'Allow All';
  popUpAllowAllButtonTextColor: '#ffffff';
  popUpAllowAllButtonBackgroundColor: '#162893';

  //

  AdvertisingText: 'Advertising';
  PopUpAdvertisingHead: 'Advertising Cookies\n';
  PopUpAdvertisingDescription: 'Advertising cookies track activity across websites in order to understand a viewer’s interests, and direct them specific marketing. Some examples include: cookies used for remarketing, or interest-based advertising.';


  SocialMediaText: 'Social Media';
  PopUpSocialMediaHead: 'General Information\n';
  PopUpSocialMediaDescription: 'In order to comply with data protection laws, we ask you to review the key points below of our Privacy Policy. To continue using our website, you need to select your preferences and click "Save". Privacy Statement';

  AnalyticsText: 'Analytics';
  PopUpAnalyticsHead: 'Functional Cookies\n';
  PopUpAnalyticsDescription: 'Functional cookies enhance functions, performance, and services on the website. Some examples include: cookies used to analyze site traffic, cookies used for market research, and cookies used to display advertising that is not directed to a particular individual.';

  NecessaryText: 'Essentiial';
  PopUpNecessaryHead: 'Required Cookies\n';
  PopUpNecessaryDescription: 'Required cookies are necessary for basic website functionality. Some examples include: session cookies needed to transmit the website, authentication cookies, and security cookies';
}
export const BannerConstant = {
  ccpaTargetCountry: [{title: 'California', value: 'ca'}, {title: 'USA', value: 'us'}],
  gdprTargetCountry: [
    { label: 'GDPR Global', value: 'eu'},
    { label: 'Belgium', value: 'be'},
    { label: 'Bulgaria', value: 'bg'},
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
  GDPR: {
    BANNER: {
      Bannerlanguage: [
        {
          title: 'English',
          value: 'en'
        },
        {
          title: 'German',
          value: 'de'
        }
      ],
      BannerPosition: [
        {title: 'Top', value: 'top'},
        {title: 'Bottom', value: 'bottom'}
      ],
      BannerTitle: 'We Know Your Privacy',
      BannerDescription: 'We may place these for analysis of our visitor data, to improve our website, show personalised content ' +
        'and to give you a great website experience. For more information about the cookies we use open the settings.',
      // BannerGlobalStyleTextColor: '#ffffff',
      // BannerGlobalStyleBackgroundColor: '#000000',
      BannerPreferenceButtonTextContent: 'Privacy Setting',
      // BannerPreferenceButtonTextColor: '#ffffff',
      // BannerPreferenceButtonBackgroundColor: '#fdfddf',
      BannerAllowAllButtonTextContent: 'Accept All',
      BannerAllowRequiredButtonTextContent: 'Allow Required',
      // BannerAllowAllButtonTextColor: '#000000',
      // BannerAllowAllButtonBackgroundColor: '#1990ff',
      BannerDisableAllButtonTextContent: 'Do not sell My Data',
      // BannerDisableAllButtonTextColor: '#000000',
      // BannerDisableAllButtonBackgroundColor: '#ffffff',
    },
    POPUP: {
      PopUpPurposeBodyDescription: 'In order to comply with data protection laws, we ask you to review the key pointsbelow of our Privacy Policy. To continue using our website, you need to select yourpreferences and click "Save".\n' +
        '\n',
      PopUpVendorBodyDescription: 'These are the partners we share data with. By clicking into each partner, you can seewhich purposes they are requesting consent and/or which purposes they are claiminglegitimate interest for. You can turn each one on and off to control whether or not data isshared with them or simply disable all data processing. However, please note that bydisabling all data processing, some site functionality may be affected.\n' +
        '\n',
      // PopUpGlobalTextColor: '#000000',
      // PopUpGlobalBackgroundColor: '#ffffff',
      // PopUpPurposeButtonTextColor: '#000000',
      // PopUpPurposeButtonBackgroundColor: '#ffffff',
      // PopUpPurposeButtonBorderColor: '#000000',
      PopUpDisableAllButtonTextContent: 'Disable All',
      // PopUpDisableAllButtonTextColor: '#ffffff',
      // PopUpDisableAllButtonBackgroundColor: '#444444',
      PopUpSaveMyChoiceButtonContentText: 'Save My Choice',
      // PopUpSaveMyChoiceButtonTextColor: '#ffffff',
      // PopUpSaveMyChoiceButtonBackgroundColor: '#222222',
      PopUpAllowAllButtonTextContent: 'Allow All',
      // PopUpAllowAllButtonTextColor: '#666666',
      // PopUpAllowAllButtonBackgroundColor: '#ffffff'
    }
  },
  CCPA: {
    BANNER: {
      BannerPosition: [
        {title: 'Top', value: 'top'},
        {title: 'Bottom', value: 'bottom'}
      ],
      BannerTitle: 'We Know Your Privacy',
      BannerDescription: 'We may place these for analysis of our visitor data, to improve our website, show personalised content ' +
        'and to give you a great website experience. For more information about the cookies we use open the settings.',
      // BannerGlobalStyleTextColor: '#ffffff',
      // BannerGlobalStyleBackgroundColor: '#000000',
      BannerPreferenceButtonTextContent: 'Privacy Setting',
      // BannerPreferenceButtonTextColor: '#ffffff',
      // BannerPreferenceButtonBackgroundColor: '#fdfddf',
      BannerAllowAllButtonTextContent: 'Accept All',
      // BannerAllowAllButtonTextColor: '#000000',
      // BannerAllowAllButtonBackgroundColor: '#1990ff',
      BannerDisableAllButtonTextContent: 'Do not sell My Data',
      // BannerDisableAllButtonTextColor: '#000000',
      // BannerDisableAllButtonBackgroundColor: '#ffffff',
    },
    POPUP: {
      PopUpDisableAllButtonTextContent: 'Disable All',
      // PopUpDisableAllButtonTextColor: '#ffffff',
      // PopUpDisableAllButtonBackgroundColor: '#444444',
      PopUpAllowAllButtonTextContent: 'Allow All',
      // PopUpAllowAllButtonTextColor: '#666666',
      // PopUpAllowAllButtonBackgroundColor: '#ffffff',
      // PopUpInformationBtnText: 'Information',
      SocialMediaText: 'Social Media',
      PopUpSocialMediaHead: 'General Information\n',
      PopUpSocialMediaDescription: 'In order to comply with data protection laws, we ask you to review the key points below of our Privacy Policy. To continue using our website, you need to select your preferences and click "Save". Privacy Statement',
      NecessaryText: 'Essentiial',
      PopUpNecessaryHead: 'Required Cookies\n',
      PopUpNecessaryDescription: 'Required cookies are necessary for basic website functionality. Some examples include: session cookies needed to transmit the website, authentication cookies, and security cookies',
      AnalyticsText: 'Analytics',
      PopUpAnalyticsHead: 'Functional Cookies\n',
      PopUpAnalyticsDescription: 'Functional cookies enhance functions, performance, and services on the website. Some examples include: cookies used to analyze site traffic, cookies used for market research, and cookies used to display advertising that is not directed to a particular individual.\n' +
        '\n',
      AdvertisingText: 'Advertising',
      PopUpAdvertisingHead: 'Advertising Cookies\n',
      PopUpAdvertisingDescription: 'Advertising cookies track activity across websites in order to understand a viewer’s interests, and direct them specific marketing. Some examples include: cookies used for remarketing, or interest-based advertising.\n' +
        '\n',
    }
  }
};

export const IabPurposeIds = {
  advertising: [3, 4],
  socialMedia: [1, 2],
  analytics: [5, 6],
  essentiial: [7, 8]
}
