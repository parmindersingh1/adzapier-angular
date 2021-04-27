import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const environment = {
  production: true,
  mock: false,
  stripePublishablekey : 'pk_live_McAxp3L479SpRJYWwTEJoBkk00xo81SHx6',
  langURL: 'https://cdn.primeconsent.com/cmp/banner-language/:lang.json',
  iabUrl: 'https://cdn.primeconsent.com/vendorlist/IABvendors/',
  googleVendorsUrl: 'https://cdn.primeconsent.com/vendorlist/googlevendorlist/google.json',
  apiUrl: 'https://api.primeconsent.com/api/v1',
  lokiUrl: 'https://logs.primeconsent.com/loki/api/v1/push',
  globleLangURL: 'https://staging-cdn.adzapsrv.com/cookiebanner/banner-language/test/:lang.json',
  customLangURL: 'https://staging-cdn.adzapsrv.com/cmp/v1/web/:oid/lang/:pid-:lang.json',
  lokiConfig: {
    app: 'cmp-adminportal-prod',
    env: 'prod',
  },
};
