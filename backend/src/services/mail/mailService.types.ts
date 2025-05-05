export interface MessageContent {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export enum EmailPlaceholders {
  firstName = 'firstName',
  accountName = 'accountName',
  secretCode = 'secretCode',
  resetLink = 'resetLink',
  contactFirstName = 'contactFirstName',
  contactLastName = 'contactLastName',
  contactPhoneNumber = 'contactPhoneNumber',
  requestCallSourcePage = 'requestCallSourcePage',
  contactEmail = 'contactEmail',
  ctaLocation = 'ctaLocation',
  ctaPageName = 'ctaPageName',
}
