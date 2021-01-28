export enum  LokiStatusType {
  ERROR = 'error',
  INFO = 'info'
}

export enum LokiFunctionality {
  cookieBanner = 'cookie-banner',
  cookieCategory = 'cookie-category',
  cookie = 'cookie',
  cookieConsent = 'cookie-consent',
  ccpaDashboard = 'ccpa-dashboard',
  consentDashboard = 'consent-dashboard',
  billing = 'billing',
  updateBilling = 'update-billing',
  workFlow = 'workflow',
  workFlowByID = 'workflowbyid',
  updateWorkflow = 'updateWorkflow',
  workFlowStatus = 'workflowstatus',
  getWorkflow = 'getWorkFlow',
  getWorkflowById = 'getWorkflowById',
  getWorkflowByStatus = 'getWorkflowByStatus',
  createWorkflow = 'createWorkflow',
  webForm = 'dsar-webform',
  dsarRequest = 'dsar-request',
  dsarRequestDetails = 'dsar-request-details',
  registerUser = 'register-user',
  loginUser = 'login-user',
  resetPassword = 'reset-password',
  changePassword = 'change-password',
  forgotPassword = 'forgot-password',
  userRole = 'user-role',
  verifyUserEmailID = 'verify-user-emailid',
  getCompanyDetails = 'getCompany-details',
  updateCompanyDetails = 'update-company-details',
  getCompanyTeamMembers = 'getCompany-team-members',
  inviteUser = 'invite-user',
  updateUserRole = 'update-user-role',
  updateCCPAForm = 'update-ccpa-form',
  getCCPAFormList = 'get-ccpa-formlist',
  getCCPAFormConfigByID = 'get-ccpa-form-configbyid',
  updateUserProfile = 'update',
  removeTeamMember = 'remove-team-member',
  resendInvitation = 'resend-invitation',
  getLoggedInUserDetails = 'get-logged-in-user-details',
  getAll = 'get-all',
  getWebFormCaptcha = 'getCaptcha',
  getImage = 'getImage',
  verifyCaptcha = 'verify-captcha',
  addSubTask = 'add-sub-task',
  updateSubTask = 'update-sub-task',
  getSubTask = 'getSubTask',
  getSubTaskByWorkflowID = 'getSubTaskByWorkflowID',
  updateDSARRequestDetailsByID = 'updateDSARRequestDetailsByID',
  addSubTaskResponse = 'addSubTaskResponse',
  verifyClientEmailID = 'verifyClientEmailID',
  viewUserUploadedFile = 'viewUserUploadedFile',
  getDSARRequestDetailsByID = 'getDSARRequestDetailsByID',
  getDSARRequestDetails = 'getDSARRequestDetails',
  getDsarRequestFilterList = 'getDsarRequestFilterList',
  getDsarRequestList = 'getDsarRequestList',
  getDsarRequestFilter = 'getDsarRequestFilter',
  getCCPADataActivityLog = 'getCCPADataActivityLog',
  addCCPADataActivity = 'addCCPADataActivity',
  getNotification = 'getNotification',
  updateNotification = 'updateNotification',
  getUserList = 'getUserList',
  viewClientsFileAttachments = 'viewClientsFileAttachments',
  viewSubtaskFileAttachements = 'viewSubtaskFileAttachements',
  rejectDSARRequest = 'rejectDSARRequest',
  checkIsNotificationVisited = 'checkIsNotificationVisited'
}
