import { ResponseCode } from '../../../entities';

export enum LegacyPaymentStatus {
  pro = '1',
  free = '3',
}

export type SignUpPayload = {
  repId?: string;
  repId2?: string;
  additionalEmail?: string;
  email: string;
  firstName: string;
  lastName: string;
  groupCode: string;
  phoneNumber?: string;
  status?: LegacyPaymentStatus;
};

type Data = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  allowStandardUserOnSignUp: number;
  loginToken: string;
};

export type SignUpResponse = { data: Data[] };

export type LoginResponse =
  | {
      response: {
        status: 'true';
        profile: {
          realmToken: string;
          status: LegacyPaymentStatus;
          userId: string;
          accessToken: string;
          role: string;
          userAccessLevel: string;
          subscriptionStartedAt?: string;
          wcVideoShown: number;
          welcomeVideo: string;
          wcVideoMediaHash: string;
        };
      };
    }
  | {
      response: {
        status: 'false';
        errorMessage: string;
      };
    };

export interface UserInternal {
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  address: string;
  suite: string;
  city: string;
  countryId: number;
  stateId: number;
  zip: string;
  phoneNumber: string;
  trainingPartner: string;
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  isTrial: number;
  ignoreUserPayment: string;
  trialExpiresOn: string;
  language: string;
  accountId: number;
  linkTrackingNotify: string;
  repId: string;
  repId2: string;
  repId3: string;
  repId4: string;
  repId5: string;
  repId6: string;
  repId7: string;
  repId8: string;
  additionalEmailNotification: string;
  rewardNotifications: string;
  emailsFromAdministrators: string;
  myWeeklyStats: number;
  eventNotifications: string;
  companyName: string;
  userTimeZoneId: number;
  customBookingLink: string;
  autoSuspendStatus: number;
  isYBRView: number;
  status: string;
  tikTokUrl: string;
  whatsAppUrl: string;
  userAccessLevel: string;
  userTimeZone: string;
  userPaymentRuns: number;
  subscriptionCanceled: null | string;
  subscriptionEndsOn: string;
  paymentRequire: number;
  isFreeUser: boolean;
  isBusinessCardEnabled: number;
  isGreyOut: string;
  accountDetails: {
    [key: string]: number | null;
  };
  accountPreferenceDetails: {
    enableTwitterUrl: number | string;
    enableFacebookUrl: number | string;
    enableLinkedinUrl: number | string;
    enableInstagramUrl: number | string;
    enableAdditionalNotificationEmail: number | string;
    enableRepId1: number | string;
    enableRepId2: number | string;
    enableRepId3: number | string;
    enableRepId4: number | string;
    enableRepId5: number | string;
    enableRepId6: number | string;
    enableRepId7: number | string;
    enableRepId8: number | string;
    enableRepId1Required: number | string;
    enableRepId2Required: number | string;
    enableRepId3Required: number | string;
    enableRepId4Required: number | string;
    enableRepId5Required: number | string;
    enableRepId6Required: number | string;
    enableRepId7Required: number | string;
    enableRepId8Required: number | string;
    enableTwitterUrlRequired: number | string;
    enableFacebookUrlRequired: number | string;
    enableLinkedinUrlRequired: number | string;
    enableInstagramUrlRequired: number | string;
    enableAdditionalNotificationEmailRequired: number | string;
    enableRepId1ShowSignup: number | string;
    enableAddNotifEmailShowSignup: number | string;
    enableRepId2ShowSignup: number | string;
    enableCustomBookingLink: number | string;
    enableCustomBookingLinkRequired: number | string;
    enableTikTokUrl: number | string;
    enableTikTokUrlRequired: number | string;
    enableWhatsAppUrl: number | string;
    enableWhatsAppUrlRequired: number | string;
  };
  brandingDetails: {
    mobileLogo: string;
    repId: BrandingItem;
    repId2: BrandingItem;
    repId3: BrandingItem;
    repId4: BrandingItem;
    repId5: BrandingItem;
    repId6: BrandingItem;
    repId7: BrandingItem;
    repId8: BrandingItem;
    additionalEmailNotification: BrandingItem;
  };
  legalshieldDetails: {
    ifExistInLegalshield: number;
  };
  userGroupDetails: Array<UserGroupDetail>;
  gameLevelDetails: Array<{
    contactsActive: number;
    gameStage: number;
    levelName: string;
  }>;
  canChangePassword: boolean;
}

type BrandingItem = {
  required: number;
  name: string;
  value: string;
  toolTip: string;
};

export type UserGroupDetail = {
  accountGroupId: number;
  name: string;
  groupCode: string;
  alpId?: string;
};

export type UserInternalGetResponse = {
  status: number;
  data: UserInternal;
};

export type UserInternalUpdateRequest = Partial<
  Pick<
    UserInternal,
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'companyName'
    | 'address'
    | 'suite'
    | 'city'
    | 'countryId'
    | 'stateId'
    | 'zip'
    | 'phoneNumber'
    | 'trainingPartner'
    | 'additionalEmailNotification'
    | 'repId'
    | 'repId2'
    | 'repId3'
    | 'repId4'
    | 'repId5'
    | 'repId6'
    | 'repId7'
    | 'repId8'
    | 'customBookingLink'
    | 'twitterUrl'
    | 'facebookUrl'
    | 'linkedinUrl'
    | 'instagramUrl'
    | 'tikTokUrl'
    | 'whatsAppUrl'
    | 'rewardNotifications'
    | 'emailsFromAdministrators'
    | 'myWeeklyStats'
    | 'linkTrackingNotify'
    | 'eventNotifications'
    | 'userTimeZone'
  >
>;

const repIdFields = [
  'repId',
  'repId2',
  'repId3',
  'repId4',
  'repId5',
  'repId6',
  'repId7',
] as const;

export type RepIdFields = (typeof repIdFields)[number];

export type AccountIdByCode =
  | {
      status: ResponseCode.success;
      accountId: number;
      accountName: string;
      signUpAllowed: boolean;
      isExternalBilling: boolean;
    }
  | {
      status: Exclude<ResponseCode, ResponseCode.success>;
      message?: string;
    };

export type UserContactsResponse = {
  data: {
    id: number;
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    title: string;
    interest: number;
    email: string;
    homeEmail: string;
    workEmail: string;
    otherEmail: string;
    phone: string;
    home: string;
    work: string;
    other: string;
    company: string;
    industry: string;
    campaignId: number | null;
    stateId: number;
    countryId: number;
    contactImage: string;
    points: number;
    zip: string;
    optInResend: number;
    contactHash: string | null;
    campaignStatus: number;
    resourceStatus: number;
    lastActivityOn: string;
    created: string;
    modified: string;
  }[];
};
