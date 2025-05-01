import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { alpha, createTheme, Theme, ThemeOptions, ThemeProvider } from '@mui/material';
import { deepmerge } from '@mui/utils';
import { defaultTheme } from '../styles/defaultTheme';
import { logInfo } from '../services';
import { logErrorType } from '../utils/errors/commonErrorLogging';
import apis from '../repositories/api';
import { ResponseCode } from '../config';

type Props = {
  children: React.ReactNode;
};

type BrandingContextType = {
  updateTheme: (theme: ThemeOptions) => void;
  fetchTheme: (accountId: string) => Promise<void>;
  fetchThemeByGroup: (groupId: string) => Promise<boolean>;
  setBrandingLoaded: (loaded: boolean) => void;
  brandingLoaded: boolean;
  setDefaultTheme: () => void;
};

const BrandingContext = createContext<BrandingContextType>({
  updateTheme: () => {
    /* template */
  },
  fetchTheme: async () => {
    /* template */
  },
  fetchThemeByGroup: async () => false,
  setBrandingLoaded: () => {
    /* template */
  },
  brandingLoaded: false,
  setDefaultTheme: () => {
    /* template */
  },
});

const removeUndefinedProps = (obj: object): object => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeUndefinedProps(v) : v])
  );
};

export const BrandingProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState<Theme>(createTheme(defaultTheme));
  const [brandingLoaded, setBrandingLoaded] = useState(false);

  const updateTheme = useCallback((theme: ThemeOptions) => {
    setTheme(createTheme(deepmerge(defaultTheme, theme)));
    setBrandingLoaded(true);
  }, []);

  const setDefaultTheme = useCallback(() => {
    logInfo({ message: 'Set theme to the default' });
    setTheme(createTheme(defaultTheme));
  }, []);

  const fetchTheme = useCallback(
    async (accountId: string) => {
      setBrandingLoaded(false);
      try {
        const { data } = await apis.getBrandingData(accountId);
        const theme: ThemeOptions = removeUndefinedProps({
          palette: {
            primary: {
              main: data.data?.primaryColor,
              light: alpha(data.data?.primaryColor, 0.5),
              dark: alpha(data.data?.primaryColor, 0.9),
              contrastText: data.data?.primaryColorOffset,
            },
            secondary: {
              main: data.data?.secondaryColor,
              light: alpha(data.data?.secondaryColor, 0.5),
              dark: alpha(data.data?.secondaryColor, 0.9),
              contrastText: data.data?.secondaryColorOffset,
            },
            tertiary: {
              main: data.data?.tertiaryColor,
              light: alpha(data.data?.tertiaryColor, 0.5),
              dark: alpha(data.data?.tertiaryColor, 0.9),
              contrastText: data.data?.tertiaryColorOffset,
            },
          },
          extra: {
            logo: data.data?.dashboardLogo,
            name: data.data?.accountName,
            appName: data.data?.appDetails?.appName,
            appStoreUrl: data.data?.appDetails?.appStoreUrl,
            googlePlayUrl: data.data?.appDetails?.googlePlayUrl,
            appIconImage: data.data?.appDetails?.appIconImage,
            additionalFields: data.data?.additionalFields,
            removeRFLogoOnDashboard: data.data?.removeRFLogoOnDashboard,
            userFlowResId: data.data?.userFlowResId,
          },
        });

        updateTheme(theme);
      } catch (e) {
        logErrorType(e, 3011, { accountId });
        setBrandingLoaded(true);
      }
    },
    [updateTheme]
  );

  const fetchThemeByGroup = useCallback(
    async (groupId: string) => {
      try {
        const { data: groupData } = await apis.checkCode({ code: groupId });
        if (groupData.status === ResponseCode.success) {
          await fetchTheme(String(groupData.accountId));
          return true;
        } else {
          setBrandingLoaded(true);
        }
      } catch (e) {
        logErrorType(e, 3011, { groupId });
        setBrandingLoaded(true);
      }
      return false;
    },
    [fetchTheme]
  );

  const value = useMemo(
    () => ({
      updateTheme,
      fetchTheme,
      fetchThemeByGroup,
      brandingLoaded,
      setBrandingLoaded,
      setDefaultTheme,
    }),
    [updateTheme, fetchTheme, fetchThemeByGroup, brandingLoaded, setBrandingLoaded, setDefaultTheme]
  );

  return (
    <BrandingContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  return useContext(BrandingContext);
};
