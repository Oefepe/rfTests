export type IUser = {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  password?: string;
  email?: string;
  phone?: string;
  photo?: string;
  provider: Providers;
  clientCode?: string;
  groupCode?: string;
  proUser?: boolean;
  token?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  accounts?: Account[];
  customFields?: UserCustomField[];
};

export type IUserUpdate = {
  firstName?: string;
  lastName?: string;
  phone?: string;
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
  tikTokUrl?: string;
  twitterUrl?: string;
  whatsAppUrl?: string;
  customBookingLink?: string;
  customFields?: { fieldId: string; value: string }[];
  additionalEmailNotification: string;
};

export type UserCustomField = {
  fieldId: string;
  name: string;
  value: string;
  tooltip: string;
  isRequired: boolean;
};

export interface Account {
  accountId: number;
  accountName: string;
  token: string;
  salt: string;
  password: string;
}

export enum Providers {
  google = 'google',
  facebook = 'facebook',
  apple = 'apple',
  email = 'email',
  phone = 'phone',
  netready = 'netready',
  avbob = 'avbob',
}
