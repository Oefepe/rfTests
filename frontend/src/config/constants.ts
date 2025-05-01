export const TOKEN = 'rfToken';

export const COOKIE_CLIENT_ID = 'client_id';
export const COOKIE_GROUP_ID = 'group_id';
export const COOKIE_VALID_GROUP_ID = 'valid_group_id';
export const GROUP_CODE = 'groupCode';
export const SAVED_CREDENTIALS = 'savedCredentials';
export const ACCOUNT_TOKEN = 'accountToken';
export const SHOW_LINK_SENT_POPUP = 'showLinkSentPopup';

export enum ResponseCode {
  success = 0,
  error = 1,
  unexpectedValue = 10,
  absentValue = 11,
  validationError = 12,
  userExist = 1000,
  invalidEmail = 1001,
  invalidPhone = 1002,
  invalidCredentials = 1003,
  vacantUser = 1004,
  unfinishedSignup = 1005,
  restricted = 1007,
  networkError = 1008,
  authIdNotFound = 1059,
  userIdNotFound = 1066,
  authIdCreationError = 1073,
  invalidGroupCode = 9003,
}

export enum Providers {
  google = 'google',
  facebook = 'facebook',
  apple = 'apple',
  email = 'email',
  phone = 'phone',
  netready = 'netready',
}

export const LOG_MASKED_KEYS = ['password', 'token', 'refreshToken'];
