import { AuthCheck } from './enums';

interface AccountData {
  userId: number;
  accountId: number;
  accountName?: string;
  companyName?: string;
}

export interface AccountUserData extends AccountData {
  token?: string;
  salt?: string;
  password?: string;
  userStatus?: string;
  userRole?: string;
  userAccessLevel?: string;
  subscriptionStartedAt?: Date;
  wcVideoShown?: number;
  welcomeVideo?: string;
  wcVideoMediaHash?: string;
  accessToken?: string; // accessToken for legacy api
  onboarding?: UserOnboarding;
}

export interface AccountResponseData extends AccountData {
  id: number;
  email: string;
  dashboardLogo: string;
}

export interface AccountJwtPayload {
  id: string;
  user?: Partial<IUser>; // to store sso user data until signup process finished
  revision?: number;
}

export interface UserJwtPayload extends AccountJwtPayload {
  email: string;
  accountId: number | string;
}

export interface UserOnboarding {
  skipWelcomeVideo?: boolean;
  addProfilePicture?: boolean;
  addPhoneNumber?: boolean;
  addCalendar?: boolean;
  addSocialMedia?: boolean;
  setLinkPersonalization?: boolean;
  skipTrainingPartner?: boolean;
}

export interface IUser {
  _id?: string; // todo: use id instead
  __v?: number;
  authId?: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  email?: string;
  phone?: string;
  phoneCountryCode?: string;
  photo?: string;
  clientCode?: string;
  groupCode?: string;
  proUser?: boolean;
  accounts?: AccountUserData[];
  createdAt?: Date;
  modifiedAt?: Date;
  lastLogin?: Date;
  calendarLink?: string;
  virtualMeetingLink?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  telegramUrl?: string;
  tikTokUrl?: string;
  whatsAppUrl?: string;
  twitterUrl?: string;
}

export interface IUserUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phoneCountryCode?: string;
  userAlias?: string;
  trainingPartner?: string;
  title?: string;
  companyName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  country?: string;
  province?: string;
  zip?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  telegramUrl?: string;
  tikTokUrl?: string;
  twitterUrl?: string;
  whatsAppUrl?: string;
  customBookingLink?: string;
  customFields?: UserCustomField[];
  additionalEmailNotification: string;
  calendarLink?: string;
  virtualMeetingLink?: string;
}

export type UserCustomField = {
  fieldId: string;
  name: string;
  value: string;
  tooltip: string;
  isRequired: boolean;
};

export interface UserCheck {
  checkResult: AuthCheck;
  redirectUrl: string;
}

export type LogType = 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type LoggerType = 'user' | 'app' | 'backend';

export interface LogRecordBase {
  deviceId: string;
  message: string;
  level: LogType;
  logger: LoggerType;
  timestamp: string;
  context?: Record<string, unknown>;
  appVersion?: string;
}

export interface LogRecordError extends LogRecordBase {
  errorCode: number;
  stacktrace?: string;
}

export type LogRecordClient = Omit<LogRecordError, 'errorCode' | 'context'> &
  Partial<Pick<LogRecordError, 'errorCode'>> & {
    context?: Record<string, unknown> | string;
  };

export interface ClientLog {
  logs: LogRecordClient[];
}
