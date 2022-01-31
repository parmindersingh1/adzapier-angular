import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const environment = {
  production: true,
  mock: false,
  stripePublishablekey : 'pk_test_Bea8DtMw2JDaQoZuvyd2yEdE00wtdPEyoM',
  cookiefreePlanID : 'price_1I8RHcBa3iZWL3Ygt4B3gZVd',
  iabUrl: 'https://staging-cdn.adzapsrv.com/vendorlist/IABvendors/',
  langURL: 'https://staging-cdn.adzapsrv.com/cookiebanner/banner-language/:lang.json',
  googleVendorsUrl: 'https://staging-cdn.adzapsrv.com/vendorlist/googlevendorlist/google.json',
  apiUrl: 'https://qa-cmp-api.adzpier-staging.com/api/v1',
  privacyportalUrl: 'https://qa-privacyportal.adzpier-staging.com/dsar/form/',
  lokiUrl: 'https://logs.adzpier-staging.com/loki/api/v1/push',
  globleLangURL: 'https://staging-cdn.adzapsrv.com/cookiebanner/banner-language/:lang.json',
  customLangURL: 'https://staging-cdn.adzapsrv.com/cmp/v1/web/:oid/lang/:pid-:lang.json',
  consentPreferenceCDN: 'https://staging-cdn.adzapsrv.com/consent-preference/qa/adzapier-cp-sdk.js',
  consentPreferenceConfig : {
    AppID: 'CSeDNaSKHKNGEvmOgsiaDoOdIJmFncXMuAiotVLMGagBvIbQio', // Your App ID
    PropID: '69ddc83f-b3a9-4d40-bb22-ffb4dcfdaf27'
  },
  lokiConfig: {
    app: 'cmp-adminportal-qa',
    env: 'qa',
  },
};
