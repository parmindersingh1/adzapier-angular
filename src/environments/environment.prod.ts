import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const environment = {
  production: true,
  mock: false,
  apiUrl: '//cmp-api.adzpier.com',
  stripePublishablekey : 'pk_test_Bea8DtMw2JDaQoZuvyd2yEdE00wtdPEyoM',
  lokiUrl: 'https://logs.adzpier-staging.com/loki/api/v1/push',
  lokiConfig: {
    app: 'cmp-prod',
    env: 'prod',
  },
};
