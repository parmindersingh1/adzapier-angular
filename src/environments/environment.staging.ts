import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const environment = {
  production: true,
  mock: false,
  stripePublishablekey : 'pk_test_Bea8DtMw2JDaQoZuvyd2yEdE00wtdPEyoM',
  iabUrl: 'https://staging-cdn.adzapsrv.com/vendorlist/IABvendors/',
  langURL: 'https://staging-cdn.adzapsrv.com/cookiebanner/banner-language/:lang.json',
  googleVendorsUrl: 'https://staging-cdn.adzapsrv.com/vendorlist/googlevendorlist/google.json',
  apiUrl: 'https://cmp-api.adzpier-staging.com/api/v1',
  lokiUrl: 'https://logs.adzpier-staging.com/loki/api/v1/push',
  globleLangURL: 'https://staging-cdn.adzapsrv.com/cookiebanner/banner-language/test/:lang.json',
  customLangURL: 'https://staging-cdn.adzapsrv.com/cmp/v1/web/:oid/lang/:pid-:lang.json',
  lokiConfig: {
    app: 'cmp-adminportal-staging',
    env: 'staging',
  },
};
