import { IUser, IUserUpdate } from '../../../entities';
import { UserInternalUpdateRequest } from '../entities/types';

export const userUpdateToLegacy = (
  user: IUserUpdate
): UserInternalUpdateRequest => {
  const result = {
    // Required fields
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    // Optional fields
    phoneNumber: user.phone,
    trainingPartner: user.trainingPartner,
    companyName: user.companyName,
    address: user.address1,
    suite: user.address2,
    city: user.city,
    //countryId: user.country,
    //stateId: user.province,
    zip: user.zip,
    repId: user.customFields?.find((cf) => cf.fieldId === 'repId')?.value,
    repId2: user.customFields?.find((cf) => cf.fieldId === 'repId2')?.value,
    repId3: user.customFields?.find((cf) => cf.fieldId === 'repId3')?.value,
    repId4: user.customFields?.find((cf) => cf.fieldId === 'repId4')?.value,
    repId5: user.customFields?.find((cf) => cf.fieldId === 'repId5')?.value,
    repId6: user.customFields?.find((cf) => cf.fieldId === 'repId6')?.value,
    repId7: user.customFields?.find((cf) => cf.fieldId === 'repId7')?.value,
    repId8: user.customFields?.find((cf) => cf.fieldId === 'repId8')?.value,
    additionalEmailNotification: user.additionalEmailNotification,
    facebookUrl: user.facebookUrl,
    instagramUrl: user.instagramUrl,
    linkedinUrl: user.linkedinUrl,
    tikTokUrl: user.tikTokUrl,
    twitterUrl: user.twitterUrl,
    whatsAppUrl: user.whatsAppUrl,
    customBookingLink: user.customBookingLink,
  };

  return result;
};

export const userUpdateToUser = (user: IUserUpdate): Partial<IUser> => {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    phoneCountryCode: user.phoneCountryCode,
    calendarLink: user.calendarLink,
    virtualMeetingLink: user.virtualMeetingLink,
    facebookUrl: user.facebookUrl,
    instagramUrl: user.instagramUrl,
    linkedinUrl: user.linkedinUrl,
    telegramUrl: user.telegramUrl,
    tikTokUrl: user.tikTokUrl,
    whatsAppUrl: user.whatsAppUrl,
    twitterUrl: user.twitterUrl,
  };
};
