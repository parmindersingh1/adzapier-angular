export const apiConstant = {
  COMPANY_SERVICE: '/company/service',
  // Consent Banner
  CONSENT_BANNER: '/consent/banner/:orgId/:propId',
  // Cookie Category
  COOKIE_BANNER_LANG_PUBLISH_JSON: '/consent/save-custom-lang/:orgId/:propId',
  COOKIE_BANNER_LANG_SAVE_IN_DB: '/consent/save-lang/:orgId/:propId',
  COOKIE_BANNER_GET_LANG_FROM_DB: '/consent/save-lang/:orgId/:propId/:lang',
  COOKIE_CATEGORY: '/cookiecategory',
  COOKIE_SCANNER: '/start-cookie-scanning/:orgId/:propId',
  COOKIE_PUBLISH: '/publish-cookie/:orgId/:propId',
  COOKIE_WITH_ID: '/cookie/:orgId/:propId/:id',
  COOKIE: '/cookie/:orgId/:propId',
  COOKIE_SCAN_JOBS: '/scan-jobs/:orgId/:propId',
  COOKIE_LAST_SCANNING_DATA: '/last-cookie-scan-job/:propId',
  COOKIE_SCANNER_STATUS: '/scannerstatus/:orgId/:propId',
  // Cookie Consent
  UPDATE_VENDORS: '/consent/manage-vendors/:orgId/:propId',
  COOKIE_CONSENT: '/consents/tracking/:propId',
  COOKIE_TRACKING_FILTER: '/consents/trackingbyfilter/:propId',
  COOKIE_CONSENT_PUBLISHER: '/consent/cookieconsent',
  // Dashboard CCPA
  DASHBOARD_CCPA_REQUEST_CHART: '/ccpa/request/chart/:orgId/:propId',
  DASHBOARD_REQUEST_BY_STATE: '/ccpa/chart/state/:orgId/:propId',
  // Consent Dashboard
  DASHBOARD_OPT_IN_ACTIVITY: '/optinactivitydashboard/:propId',
  DASHBOARD_OPT_OUT_ACTIVITY: '/optoutactivitydashboard/:propId',
  DASHBOARD_CONSENT_DETAILS: '/consentdetailsdashboard/:propId',
  DASHBOARD_CONSENT_DATA: '/consentdashboard/:propId',
  DASHOBARD_CONSENT_COUNTRY_LIST: '/consentcountrylist/:propId',
  DASHOBARD_CONSENT_MAP_LIST: '/consentmaplist/:propId',
  // Billing
  BILLING_CANCEL_PLAN: '/billing/cancel/subscription',
  BILLING_UPGRADE_PLAN: '/billing/upgrade/plan',
  BILLING_CURRENT_PLAN_DETAILS: '/billing/plan',
  BILLING_CURRENT_PLAN_INFO: '/billing/current/plan',
  BILLING_CREATE_SESSION_ID: '/billing/checkout/session',
  BILLING_UPDATE_SESSION_ID: '/billing/update/card/session',
  BILLING_CURRENT_SUBSCRIPTION: '/billing/current/subscription',
  BILLING_COUPON: '/billing/coupon/:coupon_code',
  BILLING_ACTIVE_PLAN: '/billing/list/subscription',
  BILLING_FEATURES: '/billing/plan/allowed-features',
  //
  BILLING_GET_ASSIGNE_PROP: '/licensed/property',
  BILLING_GET_ASSIGNE_ORG: '/licensed/organizations',

  BILLING_ASSIGNE_PROPERTY: '/assign/license/property',
  BILLING_ASSIGNE_ORG: '/assign/license/organization',
  //
  BILLING_LIST_ALL_PROPERTY: '/unlicensed/property',
  BILLING_LIST_ALL_PROPERTY_LICENSES: '/licensed/property_license',
  BILLING_LIST_ALL_ORG: '/unlicensed/organizations',
  ORG_ACITVE_LIST: '/organizations',
  //
  BILLING_UNSSIGNE_PROPERTY: '/unassign/license/property',
  BILLING_UNSSIGNE_ORG: '/unassign/license/organization',
  //
  BILLING_MANAGE_SESSION_ID_GEN: '/billing/customerportal/session',
  // Workflow
  WORKFLOW: '/workflow',
  WORKFLOW_STATUS: '/workflow?workflow_status=',
  WORKFLOW_ORGID_WORKFLOW_ID: '/workflow/:orgid?workflow_id=',
  WORKFLOW_ID: '/workflow?workflow_id=',
  ACTIVATE_WORKFLOW: '/workflow/activate/',
  UPDATE_WORKFLOW_NAME: '/workflow/name/',
  // COOKIE_CATEGORY_CHART
  COOKIE_CATEGORY_CHART: '/cookiepurpose/:propId',
  COOKIE_CATEGORY_TYPE_CHART: '/cookietype/:propId',
  COOKIE_CATEGORY_AVALIBLE: '/available/scan/:orgId/:propId',
  COOKIE_CATEGORY_ALL_RECORD: '/all-cookie/:orgId/:propId',

  // PROPERTY PLAN
  PROPERTY_PLAN: '/billing/plan/features',
  ORG_PLAN: '/available/user/organization/:orgId',
  COMPANY_PLAN: '/available/user/company',
  PROP_AND_ORG_PLAN: '/billing/plan/inviteuser',


  // Consent Solution
  GET_CONSENT_RECORDS: '/consent/solution/:pid',
  GET_LEGAL_RECORDS: '/consent/legal_notices/:pid',
  UPDATE_CONSENT: '/consent/solution/:pid/:id',
  CONSENT_DASHBOARD: '/consent/dashboard/:pid',
  ADD_CONSENT: '/portal-consent/solution/:pid',
  EXPORT_CONSENT: '/consent-preference/consent/export/:pid',
  EXPORT_CONSENT_LEGAL_NOTICES: '/consent-preference/legal-notices/export/:pid',
  EXPORT_CONSENT_PROOFS: '/consent-preference/proofs/export/:pid',
  EXPORT_CONSENT_PREFERENCE: '/consent-preference/preference/export/:pid',

  // System Integration
  SYSTEM_INTEGRATION_LIST: '/integration/system-list',
  CONNECTION_INTEGRATION_LIST: '/integration/connection',
  GET_CONNECTION_IDS: '/integration/get-configured-query-builder-ids',
  SQL_TABLES_LIST: '/integration/get-tables',
  SQL_TABLE_COLUMNS_LIST: '/integration/get-table-columns',
  INTEGRATION_SYSTEM: '/integration/connection/:oid/:pid/:connectionID',
  //Login Registration
  REGISTRATION_ADD_COMPANY_ORG_PROP:'/billing/checkout/trialsession',

  SCAN_BEHIND_LOGIN:'/scanner/sbl/:propid',
  SCAN_BEHIND_LOGIN_UPDATE:'/scanner/update/sbl/:propid',

  //Cart
  ADDTOCART : '/cart',
  UPDATECART : '/cart/update',
  // NewsLetter
  NEWS_LETTER_CONFIG: '/newsletter/newsletter-configuration/:oid/:pid',
};

// {
//   response: {
//     cookieConsent: {
//       higherPlanID: '',
//       cycle: '',
//       price: '',
//     },
//     dsar: {
//       higherPlanID: '',
//       cycle: '',
//       price: '',
//     }
//   },
//   status: 200
// }
