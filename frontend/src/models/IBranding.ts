interface IAppDetails {
  appName?: string;
  appStoreUrl?: string;
  googlePlayUrl?: string;
  appIconImage?: string;
}

export interface IBrandingAdditionalField {
  isEnabled: number;
  isRequired: number;
  reBrandName: string;
  reBrandToolTip: string;
  showDuringSignup: number;
}

export interface IBranding {
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
  appDetails?: IAppDetails;
  userFlowResId?: string;
  additionalFields?: {
    [key: string]: IBrandingAdditionalField;
  };
  removeRFLogoOnDashboard: boolean;
}

export interface IBrandingResponse {
  status: number;
  data: IBranding;
}
