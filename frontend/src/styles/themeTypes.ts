import { TypographyStyleOptions } from '@mui/material/styles/createTypography';
import { IBrandingAdditionalField } from '../models/IBranding';

export enum BreakPoints {
  mobile = '@media (max-width:900px)',
}

declare module '@mui/material/styles' {
  interface PaletteColorOptions {
    main: string;
    light?: string;
    dark?: string;
    contrastText?: string;
    translucent?: string;
  }

  export interface PaletteColor {
    light: string;
    main: string;
    dark: string;
    contrastText: string;
    translucent?: string;
  }

  interface Palette {
    tertiary: Palette['primary'];
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }

  interface TypographyVariants {
    h1regular?: TypographyStyleOptions;
    h2regular?: TypographyStyleOptions;
    h3regular?: TypographyStyleOptions;
    buttonRegular?: TypographyStyleOptions;
    h1semiBold?: TypographyStyleOptions;
    h2semiBold?: TypographyStyleOptions;
    h3semiBold?: TypographyStyleOptions;
    buttonSemiBold?: TypographyStyleOptions;
    h2bold?: TypographyStyleOptions;
    h3bold?: TypographyStyleOptions;
    h1bold?: TypographyStyleOptions;
    buttonBold?: TypographyStyleOptions;
    bodyLarge?: TypographyStyleOptions;
    bodySmall?: TypographyStyleOptions;
    caption?: TypographyStyleOptions;
    overline?: TypographyStyleOptions;
    inputLabel?: TypographyStyleOptions;
    inputField?: TypographyStyleOptions;
  }

  interface TypographyVariantsOptions {
    h1regular?: TypographyStyleOptions;
    h2regular?: TypographyStyleOptions;
    h3regular?: TypographyStyleOptions;
    buttonRegular?: TypographyStyleOptions;
    h1semiBold?: TypographyStyleOptions;
    h2semiBold?: TypographyStyleOptions;
    h3semiBold?: TypographyStyleOptions;
    buttonSemiBold?: TypographyStyleOptions;
    h2bold?: TypographyStyleOptions;
    h3bold?: TypographyStyleOptions;
    h1bold?: TypographyStyleOptions;
    buttonBold?: TypographyStyleOptions;
    bodyLarge?: TypographyStyleOptions;
    bodySmall?: TypographyStyleOptions;
    caption?: TypographyStyleOptions;
    overline?: TypographyStyleOptions;
    inputLabel?: TypographyStyleOptions;
    inputField?: TypographyStyleOptions;
  }

  interface TypeText {
    neutral100: string;
    neutral200: string;
    neutral300: string;
    neutral400: string;
    neutral500: string;
    neutral600: string;
    neutral700: string;
    neutral800: string;
    neutral900: string;
  }

  interface Theme {
    extra: {
      logo: string;
      name: string;
      appName?: string;
      appStoreUrl?: string;
      googlePlayUrl?: string;
      appIconImage?: string;
      additionalFields?: {
        [key: string]: IBrandingAdditionalField;
      };
      removeRFLogoOnDashboard: boolean;
    };
  }

  interface ThemeOptions {
    extra?: {
      logo?: string;
      name?: string;
      appName?: string;
      appStoreUrl?: string;
      googlePlayUrl?: string;
      appIconImage?: string;
      additionalFields?: {
        [key: string]: IBrandingAdditionalField;
      };
      removeRFLogoOnDashboard: boolean;
    };
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h1: false;
    h2: false;
    h3: false;
    h4: false;
    h5: false;
    h6: false;
    subtitle1: false;
    subtitle2: false;
    body1: false;
    body2: false;
    button: false;
    h1regular: true;
    h2regular: true;
    h3regular: true;
    buttonRegular: true;
    h1semiBold: true;
    h2semiBold: true;
    h3semiBold: true;
    buttonSemiBold: true;
    h1bold: true;
    h2bold: true;
    h3bold: true;
    buttonBold: true;
    bodyLarge: true;
    bodySmall: true;
    caption: true;
    overline: true;
    inputLabel: true;
    inputField: true;
  }
}
