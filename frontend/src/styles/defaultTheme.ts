import { createTheme } from '@mui/material';
import { defaultPalette } from './defaultPalette';
import { defaultTypography } from './defaultTypography';

export const defaultAccountName = 'RapidFunnel';

export const defaultTheme = createTheme({
  palette: defaultPalette,
  typography: defaultTypography,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '26.5px',
          '@media (min-width:900px)': {
            borderRadius: '50px',
          },
        },
      },
    },
  },
  extra: {
    logo: '/images/rf_logo/rfdefaultlogo.png',
    name: defaultAccountName,
    removeRFLogoOnDashboard: true,
  },
});
