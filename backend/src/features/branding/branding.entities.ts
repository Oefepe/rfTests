interface IAppDetails {
  appName?: string;
  appStoreUrl?: string;
  googlePlayUrl?: string;
  appIconImage?: string;
}

interface IAdditionalField {
  isEnabled: number;
  isRequired: number;
  reBrandName: string;
  reBrandToolTip: string;
  showDuringSignup: number;
}

export interface ILegacyBranding {
  id?: string;
  accountName: string;
  dashboardLogo?: string;
  mobileLogo?: string;
  favIcon?: string;
  primaryColor: string;
  primaryColorOffset: string;
  secondaryColor: string;
  secondaryColorOffset: string;
  tertiaryColor: string;
  tertiaryColorOffset: string;
  hidePoweredByRFLogoOnResources?: number;
  removeRFLogoOnDashboard?: number;
  appDetails?: IAppDetails;
  repId?: IAdditionalField;
  repId2?: IAdditionalField;
  additionalEmailNotification?: IAdditionalField;
  useRFSupportLink?: number;
  supportLink?: string;
  userFlowResId?: string;
}

export class BrandingItem {
  id?: string;
  accountName: string;
  dashboardLogo?: string;
  mobileLogo?: string;
  favIcon?: string;
  primaryColor: string;
  primaryColorOffset: string;
  secondaryColor: string;
  secondaryColorOffset: string;
  tertiaryColor: string;
  tertiaryColorOffset: string;
  hidePoweredByRFLogoOnResources: boolean;
  removeRFLogoOnDashboard: boolean;
  useRFSupportLink: boolean;
  supportLink?: string;
  appDetails?: IAppDetails;
  userFlowResId?: string;
  additionalFields?: {
    [key: string]: IAdditionalField;
  };

  // prefix is used if the image is stored in a different location
  constructor(branding: ILegacyBranding, prefix?: string) {
    this.id = branding.id;
    this.accountName = branding.accountName;
    this.dashboardLogo = branding.dashboardLogo
      ? `${prefix}${branding.dashboardLogo}`
      : undefined;
    this.mobileLogo = branding.mobileLogo
      ? `${prefix}${branding.mobileLogo}`
      : undefined;
    this.favIcon = branding.favIcon
      ? `${prefix}${branding.favIcon}`
      : undefined;
    this.primaryColor = branding.primaryColor;
    this.primaryColorOffset = branding.primaryColorOffset;
    this.secondaryColor = branding.secondaryColor;
    this.secondaryColorOffset = branding.secondaryColorOffset;
    this.tertiaryColor = branding.tertiaryColor;
    this.tertiaryColorOffset = branding.tertiaryColorOffset;
    this.appDetails = branding.appDetails;
    this.userFlowResId = branding.userFlowResId;
    this.hidePoweredByRFLogoOnResources =
      branding.hidePoweredByRFLogoOnResources === 1;
    this.removeRFLogoOnDashboard = branding.removeRFLogoOnDashboard === 1;
    this.useRFSupportLink = branding.useRFSupportLink === 1;
    this.supportLink = branding.supportLink;

    this.additionalFields = {};
    if (branding.repId) {
      this.additionalFields.repId = {
        ...branding.repId,
        reBrandName: branding.repId.reBrandName || 'Rep ID1',
      };
    }
    if (branding.repId2) {
      this.additionalFields.repId2 = {
        ...branding.repId2,
        reBrandName: branding.repId2.reBrandName || 'Rep ID2',
      };
    }
    if (branding.additionalEmailNotification) {
      this.additionalFields.additionalEmailNotification = {
        ...branding.additionalEmailNotification,
        reBrandName:
          branding.additionalEmailNotification.reBrandName ||
          'Additional Email Notification',
      };
    }
  }
}

export function isBrandingData(data: unknown): data is ILegacyBranding {
  return (
    typeof data === 'object' &&
    data !== null &&
    'accountName' in data &&
    'primaryColor' in data &&
    'primaryColorOffset' in data &&
    'secondaryColor' in data &&
    'secondaryColorOffset' in data &&
    'tertiaryColor' in data &&
    'tertiaryColorOffset' in data
  );
}
