import config from '../config/config';
import { AccountUserData, IUser, UserCustomField } from '../entities';
import { UserGroupDetail, UserInternal } from '../features/legacyApi';
import { URL } from 'url';

export class UserDTO {
  id?: string;
  authId?: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  email?: string;
  phone?: string;
  phoneCountryCode?: string;
  photo?: string;
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
  customFields?: UserCustomField[];
  clientCode?: string;
  groupCode?: string;
  proUser?: boolean;
  accounts?: AccountUserData[];
  createdAt?: Date;
  modifiedAt?: Date;
  lastLogin?: Date;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  telegramUrl?: string;
  tikTokUrl?: string;
  twitterUrl?: string;
  whatsAppUrl?: string;
  customBookingLink?: string;
  profileImageUrl?: string;
  userGroupDetails?: UserGroupDetail[];
  calendarLink?: string;
  virtualMeetingLink?: string;

  constructor(data: IUser, legacyData?: UserInternal) {
    this.id = data._id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.displayName = data.displayName;
    this.email = data.email;
    this.phone = data.phone;
    this.phoneCountryCode = data.phoneCountryCode;
    this.photo = data.photo;
    this.clientCode = data.clientCode;
    this.groupCode = data.groupCode;
    this.proUser = data.proUser;
    this.accounts = data.accounts;
    this.lastLogin = data.lastLogin;
    this.createdAt = data.createdAt;
    this.modifiedAt = data.modifiedAt;
    this.calendarLink = data.calendarLink;
    this.virtualMeetingLink = data.virtualMeetingLink;
    this.facebookUrl = data.facebookUrl;
    this.instagramUrl = data.instagramUrl;
    this.linkedinUrl = data.linkedinUrl;
    this.telegramUrl = data.telegramUrl;
    this.tikTokUrl = data.tikTokUrl;
    this.whatsAppUrl = data.whatsAppUrl;
    this.twitterUrl = data.twitterUrl;

    if (legacyData) {
      this.facebookUrl = legacyData.facebookUrl;
      this.instagramUrl = legacyData.instagramUrl;
      this.linkedinUrl = legacyData.linkedinUrl;
      this.tikTokUrl = legacyData.tikTokUrl;
      this.twitterUrl = legacyData.twitterUrl;
      this.whatsAppUrl = legacyData.whatsAppUrl;
      this.customBookingLink = legacyData.customBookingLink;
      this.customFields = extractCustomFields(legacyData);
      this.userGroupDetails = legacyData.userGroupDetails;

      if (legacyData.profileImage) {
        const profileImage = legacyData.profileImage.toLowerCase();
        if (profileImage.startsWith('http')) {
          this.profileImageUrl = legacyData.profileImage;
        } else {
          this.profileImageUrl = new URL(
            legacyData.profileImage,
            config.legacyWebUrl
          ).toString();
        }
      } else {
        this.profileImageUrl = '';
      }
    }
  }
}

const extractCustomFields = (legacyUser: UserInternal) => {
  const repIds = [
    {
      field: 'repId',
      name: legacyUser?.brandingDetails?.repId?.name,
      value: legacyUser?.brandingDetails?.repId?.value,
      tooltip: legacyUser?.brandingDetails?.repId?.toolTip,
      isRequired: legacyUser?.brandingDetails?.repId?.required == 1,
      isEnabled: legacyUser?.accountPreferenceDetails?.enableRepId1 == 1,
    },
    {
      field: 'repId2',
      name: legacyUser?.brandingDetails?.repId2?.name,
      value: legacyUser?.brandingDetails?.repId2?.value,
      tooltip: legacyUser?.brandingDetails?.repId2?.toolTip,
      isRequired: legacyUser?.brandingDetails?.repId2?.required == 1,
      isEnabled: legacyUser?.accountPreferenceDetails?.enableRepId2 == 1,
    },
    {
      field: 'repId3',
      name: legacyUser?.brandingDetails?.repId3?.name,
      value: legacyUser?.brandingDetails?.repId3?.value,
      tooltip: legacyUser?.brandingDetails?.repId3?.toolTip,
      isRequired: legacyUser?.brandingDetails?.repId3?.required == 1,
      isEnabled: legacyUser?.accountPreferenceDetails?.enableRepId3 == 1,
    },
    {
      field: 'repId4',
      name: legacyUser?.brandingDetails?.repId4?.name,
      value: legacyUser?.brandingDetails?.repId4?.value,
      tooltip: legacyUser?.brandingDetails?.repId4?.toolTip,
      isRequired: legacyUser?.brandingDetails?.repId4?.required == 1,
      isEnabled: legacyUser?.accountPreferenceDetails?.enableRepId4 == 1,
    },
    {
      field: 'repId5',
      name: legacyUser?.brandingDetails?.repId5?.name,
      value: legacyUser?.brandingDetails?.repId5?.value,
      tooltip: legacyUser?.brandingDetails?.repId5?.toolTip,
      isRequired: legacyUser?.brandingDetails?.repId5?.required == 1,
      isEnabled: legacyUser?.accountPreferenceDetails?.enableRepId5 == 1,
    },
    {
      field: 'repId6',
      name: legacyUser?.brandingDetails?.repId6?.name,
      value: legacyUser?.brandingDetails?.repId6?.value,
      tooltip: legacyUser?.brandingDetails?.repId6?.toolTip,
      isRequired: legacyUser?.brandingDetails?.repId6?.required == 1,
      isEnabled: legacyUser?.accountPreferenceDetails?.enableRepId6 == 1,
    },
    {
      field: 'repId7',
      name: legacyUser?.brandingDetails?.repId7?.name,
      value: legacyUser?.brandingDetails?.repId7?.value,
      tooltip: legacyUser?.brandingDetails?.repId7?.toolTip,
      isRequired: legacyUser?.brandingDetails?.repId7?.required == 1,
      isEnabled: legacyUser?.accountPreferenceDetails?.enableRepId7 == 1,
    },
  ];

  const customFields: UserCustomField[] = repIds
    .filter((repId) => repId.isEnabled)
    .map((repId) => ({
      fieldId: repId.field || '',
      name: repId.name || '',
      value: repId.value || '',
      tooltip: repId.tooltip || '',
      isRequired: repId.isRequired || false,
    }));

  return customFields;
};
