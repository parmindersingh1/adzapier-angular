export const defaultData = {
  ccpaDefaultTarget: 'ca',
  gdprDefaultTarget: 'eu',
  defaultCookieBlocking: true,
  defaultEnableIab: true,
  defaultEmail: false,
  showOpenBtn: true,
  logo: true,
  gdprDefaultLang: 'en',
  DefaultBannerPosition: 'bottom',
};
export const BannerConstant = {
  ccpaTargetCountry: [{title: 'California', value: 'ca'}, {title: 'USA', value: 'us'}],
  gdprTargetCountry: [
    { title: 'GDPR Global', value: 'eu'},
    { title: 'Belgium', value: 'be'},
    { title: 'Bulgaria', value: 'bg'},
    {title: 'Czechia', value: 'cz'},
    {title: 'Denmark', value: 'dk'},
    {title: 'Germany', value: 'de'},
    {title: 'Estonia', value: 'ee'},
    {title: 'Ireland', value: 'ie'},
    {title: 'Greece', value: 'el'},
    {title: 'Spain', value: 'es'},
    {title: 'France', value: 'fr'},
    {title: 'Croatia', value: 'hr'},
    {title: 'Italy', value: 'it'},
    {title: 'Cyprus', value: 'cy'},
    {title: 'Latvia', value: 'lv'},
    {title: 'Lithuania', value: 'lt'},
    {title: 'Luxembourg', value: 'lu'},
    {title: 'Hungary', value: 'hu'},
    {title: 'Malta', value: 'mt'},
    {title: 'Netherlands', value: 'nl'},
    {title: 'Austria', value: 'at'},
    {title: 'Poland', value: 'pl'},
    {title: 'Portugal', value: 'pt'},
    {title: 'Romania', value: 'ro'},
    {title: 'Slovenia', value: 'si'},
    {title: 'Slovakia', value: 'sk'},
    {title: 'Finland', value: 'fi'},
    {title: 'Sweden', value: 'se'}
    ],

  // SocialMediaText: 'Social Media',
  // PopUpSocialMediaHead: 'General Information\n',
  // PopUpSocialMediaDescription: 'In order to comply with data protection laws, we ask you to review the key points below of our Privacy Policy. To continue using our website, you need to select your preferences and click "Save". Privacy Statement',
  // NecessaryText: 'Essentiial',
  // PopUpNecessaryHead: 'Required Cookies\n',
  // PopUpNecessaryDescription: 'Required cookies are necessary for basic website functionality. Some examples include: session cookies needed to transmit the website, authentication cookies, and security cookies',
  // AnalyticsText: 'Analytics',
  // PopUpAnalyticsHead: 'Functional Cookies\n',
  // PopUpAnalyticsDescription: 'Functional cookies enhance functions, performance, and services on the website. Some examples include: cookies used to analyze site traffic, cookies used for market research, and cookies used to display advertising that is not directed to a particular individual.\n' +
  //   '\n',
  // AdvertisingText: 'Advertising',
  // PopUpAdvertisingHead: 'Advertising Cookies\n',
  // PopUpAdvertisingDescription: 'Advertising cookies track activity across websites in order to understand a viewer’s interests, and direct them specific marketing. Some examples include: cookies used for remarketing, or interest-based advertising.\n' +
  //   '\n',
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
