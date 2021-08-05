import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const environment = {
  production: true,
  mock: false,
  stripePublishablekey : 'pk_live_McAxp3L479SpRJYWwTEJoBkk00xo81SHx6',
  langURL: 'https://cdn.primeconsent.com/cmp/banner-language/:lang.json',
  iabUrl: 'https://cdn.primeconsent.com/vendorlist/IABvendors/',
  googleVendorsUrl: 'https://cdn.primeconsent.com/vendorlist/googlevendorlist/google.json',
  apiUrl: 'https://api.primeconsent.com/api/v1',
  privacyportalUrl: 'https://privacyportal.primeconsent.com/dsar/form/',
  lokiUrl: 'https://logs.primeconsent.com/loki/api/v1/push',
  globleLangURL: 'https://cdn.primeconsent.com/cmp/banner-language/:lang.json',
  consentPreferenceCDN: 'https://cdn.primeconsent.com/cmp/consent-preference/production/adzapier-cp-sdk.js',
  customLangURL: 'https://cdn.primeconsent.com/cmp/v1/web/:oid/lang/:pid-:lang.json',
  consentPreferenceConfig : {
    AppID: 'ZDorfxuiXKCKBmKOoTqhrmPfJHHBUQfBoFTeeqjYDUNruEmehJ', // Your App ID
    PropID: 'd966020b-220d-4977-8d28-85aa08c2f3aa'
  },
  lokiConfig: {
    app: 'cmp-adminportal-prod',
    env: 'prod',
  },
};
