export const apiConstant = {
  COMPANY_SERVICE: '/company/service',
  // Consent Banner
  CONSENT_BANNER: '/consent/banner/:orgId/:propId',
  // Cookie Category
  COOKIE_CATEGORY: '/cookiecategory',
  COOKIE_SCANNER: '/scanner/request/:orgId/:propId',
  COOKIE_WITH_ID: '/cookie/:orgId/:propId/:id',
  COOKIE: '/cookie/:orgId/:propId',
  // Cookie Consent
  COOKIE_CONSENT: '/consents/tracking/:propId',
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
  BILLING_CURRENT_PLAN_INFO: '/billing/current/plan',
  BILLING_CREATE_SESSION_ID: '/billing/checkout/session',
  BILLING_UPDATE_SESSION_ID: '/billing/update/card/session',
  BILLING_CURRENT_SUBSCRIPTION: '/billing/current/subscription',
  // Workflow
  WORKFLOW: '/workflow',
  WORKFLOW_STATUS: '/workflow?workflow_status=',
  WORKFLOW_ID: '/workflow?workflow_id=',
  // COOKIE_CATEGORY_CHART
  COOKIE_CATEGORY_CHART: '/cookiepurpose/:propId',
  COOKIE_CATEGORY_TYPE_CHART: '/cookietype/:propId'
};
