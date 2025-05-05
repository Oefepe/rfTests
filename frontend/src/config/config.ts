export const config = {
  server_url: import.meta.env.VITE_API ?? '/api/',
  lumen_url: import.meta.env.VITE_LUMEN_API_URL,
  loglevel: import.meta.env.VITE_LOGLEVEL || 'info',
  mixpanel_token: import.meta.env.VITE_MIXPANEL_TOKEN || '',
  legacy_url: import.meta.env.VITE_LEGACY_WEB || '',
  version: __APP_VERSION__,
};

export const smartConnectorStatus = {
  isActionDue: 1,
  isWaitingForResponse: 2,
  isWaitingForDelay: 3,
};

export const backendRoutes: Record<string, string> = {
  session: `${config.server_url}auth/session`,
  loginFacebook: `${config.server_url}api/auth/facebook?type=login`,
  signupFacebook: `${config.server_url}api/auth/facebook?type=signup`,
  loginGoogle: `${config.server_url}api/auth/google?type=login`,
  signupGoogle: `${config.server_url}api/auth/google?type=signup`,
  loginApple: `${config.server_url}api/auth/apple?type=login`,
  signupApple: `${config.server_url}api/auth/apple?type=signup`,
  logout: `${config.server_url}api/auth/logout`,
  logs: `${config.server_url}api/log`,
};

export const frontendRoutes = {
  home: '/',
  login: '/login',
  resetPasswordRequest: '/reset-password-request',
  resetPasswordComplete: '/reset-password-complete',
  resetPasswordLink: '/password-reset',
  updatePasswordMultiAccount: '/update-password',
  accountSelection: '/account-selection',
  signup: '/signup',
  signupExistPassword: '/signup/exist-password',
  signupPassword: '/signup/password',
  signupName: '/signup/name',
  signupAdditionalInfo: '/signup/additional',
  signupSummary: '/signup/summary',
  signupFinish: '/signup/finish',
  signupEmail: '/signup/email',
  dashboard: '/auth/dashboard',
  legacyDashboard: `${config.legacy_url}sso/login/index?loginToken=`,
};

export enum RevisionCode {
  default,
  pwdUnify = 1,
}
