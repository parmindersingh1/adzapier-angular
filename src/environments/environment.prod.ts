import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const environment = {
  production: true,
  mock: false,
  stripePublishablekey : 'pk_test_Bea8DtMw2JDaQoZuvyd2yEdE00wtdPEyoM',
  apiUrl: 'https://api.primeconsent.com/api/v1',
  lokiUrl: 'https://logs.primeconsent.com/loki/api/v1/push',
  lokiConfig: {
    app: 'cmp-adminportal-prod',
    env: 'prod',
  },
};
