import { TypographyOptions } from '@mui/material/styles/createTypography';
import { BreakPoints } from './themeTypes';

enum FontWeight {
  regular = 400,
  semiBold = 600,
  bold = 700
}

enum FontFamily {
  sans = 'Open Sans',
}

export const defaultTypography: TypographyOptions = {
  fontFamily: FontFamily.sans,
  h1regular: {
    fontSize: '3.75rem',
    [BreakPoints.mobile]: {
      fontSize: '3.5rem',
    },
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.sans,
  },
  h2regular: {
    fontSize: '3rem',
    [BreakPoints.mobile]: {
      fontSize: '2rem',
    },
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.sans,
  },
  h3regular: {
    fontSize: '2.25rem',
    [BreakPoints.mobile]: {
      fontSize: '1.5rem',
    },
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.sans,
  },
  buttonRegular: {
    fontSize: '2rem',
    [BreakPoints.mobile]: {
      fontSize: '1.5rem',
    },
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.sans,
  },
  inputLabel: {
    fontSize: '1.25rem',
    [BreakPoints.mobile]: {
      fontSize: '1rem',
    },
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.sans,
  },
  inputField: {
    fontSize: '2.25rem',
    [BreakPoints.mobile]: {
      fontSize: '1.5rem',
    },
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.sans,
  },
  h1semiBold: {
    fontSize: '3.75rem',
    [BreakPoints.mobile]: {
      fontSize: '3.5rem',
    },
    fontWeight: FontWeight.semiBold,
    fontFamily: FontFamily.sans,
  },
  h2semiBold: {
    fontSize: '3rem',
    [BreakPoints.mobile]: {
      fontSize: '2rem',
    },
    fontWeight: FontWeight.semiBold,
    fontFamily: FontFamily.sans,
  },
  h3semiBold: {
    fontSize: '2.25rem',
    [BreakPoints.mobile]: {
      fontSize: '1.5rem',
    },
    fontWeight: FontWeight.semiBold,
    fontFamily: FontFamily.sans,
  },
  buttonSemiBold: {
    fontSize: '2rem',
    [BreakPoints.mobile]: {
      fontSize: '1.5rem',
    },
    fontWeight: FontWeight.semiBold,
    fontFamily: FontFamily.sans,
  },
  h1bold: {
    fontSize: '3.75rem',
    [BreakPoints.mobile]: {
      fontSize: '3.5rem',
    },
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.sans,
  },
  h2bold: {
    fontSize: '3rem',
    [BreakPoints.mobile]: {
      fontSize: '2rem',
    },
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.sans,
  },
  h3bold: {
    fontSize: '2.25rem',
    [BreakPoints.mobile]: {
      fontSize: '1.5rem',
    },
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.sans,
    display: 'block',
  },
  buttonBold: {
    fontSize: '2rem',
    [BreakPoints.mobile]: {
      fontSize: '1.5rem',
    },
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.sans,
  },
  bodyLarge: {
    fontSize: '1.75rem',
    [BreakPoints.mobile]: {
      fontSize: '1.25rem',
    },
    fontFamily: FontFamily.sans,
  },
  bodySmall: {
    fontSize: '1.25rem',
    [BreakPoints.mobile]: {
      fontSize: '1rem',
    },
    fontFamily: FontFamily.sans,
  },
  caption: {
    fontSize: '1rem',
    [BreakPoints.mobile]: {
      fontSize: '0.75rem',
    },
    fontFamily: FontFamily.sans,
  },
  overline: {
    fontSize: '0.5rem',
    fontFamily: FontFamily.sans,
  },
};
