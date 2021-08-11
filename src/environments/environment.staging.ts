import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const environment = {
  production: true,
  mock: false,
  stripePublishablekey : 'pk_test_Bea8DtMw2JDaQoZuvyd2yEdE00wtdPEyoM',
  iabUrl: 'https://staging-cdn.adzapsrv.com/vendorlist/IABvendors/',
  langURL: 'https://staging-cdn.adzapsrv.com/cookiebanner/banner-language/:lang.json',
  googleVendorsUrl: 'https://staging-cdn.adzapsrv.com/vendorlist/googlevendorlist/google.json',
  apiUrl: 'https://cmp-api.adzpier-staging.com/api/v1',
  privacyportalUrl: 'https://privacyportal.adzpier-staging.com/dsar/form/',
  lokiUrl: 'https://logs.adzpier-staging.com/loki/api/v1/push',
  globleLangURL: 'https://staging-cdn.adzapsrv.com/cookiebanner/banner-language/:lang.json',
  customLangURL: 'https://staging-cdn.adzapsrv.com/cmp/v1/web/:oid/lang/:pid-:lang.json',
  consentPreferenceCDN: 'https://staging-cdn.adzapsrv.com/consent-preference/staging/adzapier-cp-sdk.js',
  consentPreferenceConfig : {
    AppID: 'mKoZfTvxGoehXLKDQIMyvkgAQRmEJSGLjreGROQWhaMdvYcyAf', // Your App ID
    PropID: '43077d0b-510b-4b30-a330-6f1308d2e33e'
  },
  lokiConfig: {
    app: 'cmp-adminportal-staging',
    env: 'staging',
  },
};
