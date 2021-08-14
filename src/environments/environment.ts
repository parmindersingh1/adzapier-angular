import 'zone.js/dist/zone-error';  // Included with Angular CLI.

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mock: true,
  iabUrl: 'https://staging-cdn.adzapsrv.com/vendorlist/IABvendors/',
  googleVendorsUrl: 'https://staging-cdn.adzapsrv.com/vendorlist/googlevendorlist/google.json',
  apiUrl: 'https://develop-cmp-api.adzpier-staging.com/api/v1',
  privacyportalUrl: 'https://develop-privacyportal.adzpier-staging.com/dsar/form/',
  globleLangURL: 'https://cdn.primeconsent.com/cmp/banner-language/:lang.json',
  // apiUrl: 'https://api.primeconsent.com/api/v1',
  customLangURL: 'https://staging-cdn.adzapsrv.com/cmp/v1/web/:oid/lang/:pid-:lang.json',
  // apiUrl: 'https://cmp-api.adzpier-staging.com/api/v1',
  // apiUrl: 'http://localhost:8888/api/v1',
  stripePublishablekey : 'pk_test_Bea8DtMw2JDaQoZuvyd2yEdE00wtdPEyoM',
  consentPreferenceCDN: 'https://staging-cdn.adzapsrv.com/consent-preference/develop/adzapier-cp-sdk.js',
  consentPreferenceConfig : {
    AppID: 'cBJtzTHAnDECTCguDBeBzIXprEfLdQwgklQYRXqkdRNPMCYSjX', // Your App ID
    PropID: '67a0d68e-94e0-492a-8221-1dabaacd375d'
  },
  lokiUrl: 'https://logs.adzpier-staging.com/loki/api/v1/push',
  lokiConfig: {
        app: 'cmp-adminportal-local',
        env: 'local',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
