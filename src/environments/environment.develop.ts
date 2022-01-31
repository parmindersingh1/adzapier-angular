import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const environment = {
  production: true,
  mock: false,
  stripePublishablekey : 'pk_test_Bea8DtMw2JDaQoZuvyd2yEdE00wtdPEyoM',
  cookiefreePlanID : 'price_1I8RHcBa3iZWL3Ygt4B3gZVd',
  iabUrl: 'https://staging-cdn.adzapsrv.com/vendorlist/IABvendors/',
  langURL: 'https://staging-cdn.adzapsrv.com/cookiebanner/banner-language/:lang.json',
  googleVendorsUrl: 'https://staging-cdn.adzapsrv.com/vendorlist/googlevendorlist/google.json',
  apiUrl: 'https://develop-cmp-api.adzpier-staging.com/api/v1',
  privacyportalUrl: 'https://develop-privacyportal.adzpier-staging.com/dsar/form/',
  lokiUrl: 'https://logs.adzpier-staging.com/loki/api/v1/push',
  globleLangURL: 'https://staging-cdn.adzapsrv.com/cookiebanner/banner-language/:lang.json',
  customLangURL: 'https://staging-cdn.adzapsrv.com/cmp/v1/web/:oid/lang/:pid-:lang.json',
  consentPreferenceCDN: 'https://staging-cdn.adzapsrv.com/consent-preference/develop/adzapier-cp-sdk.js',
  consentPreferenceConfig : {
    AppID: 'cBJtzTHAnDECTCguDBeBzIXprEfLdQwgklQYRXqkdRNPMCYSjX', // Your App ID
    PropID: '67a0d68e-94e0-492a-8221-1dabaacd375d'
  },
  lokiConfig: {
    app: 'cmp-adminportal-develop',
    env: 'develop',
  },
};
