import {
  Box,
  Container,
  IconButton,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LanguageSelect, Layout, RfLink } from '../../components';
import { frontendRoutes, signUpPageMessages } from '../../config';
import { useBranding } from '../../hooks';
import { useLicense } from '../../hooks/useLicense';
import { ArrowIcon } from '../../assets/icons';
import { useMemo } from 'react';
import { changeRoute } from '../../utils';

export const AuthContainer = ({
  showSupportButton = true,
  showTermsAndConditions = false,
}: {
  showSupportButton?: boolean;
  showTermsAndConditions?: boolean;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { setDefaultTheme } = useBranding();
  const { handleLicenseLink, LicenseModalWindow } = useLicense();

  const disabledArrowButtonLocations = useMemo(
    () => [
      frontendRoutes.home,
      frontendRoutes.signupFinish,
      frontendRoutes.resetPasswordLink,
    ],
    []
  );

  const shouldShowLanguageAndSupport = useMemo(
    () =>
      showSupportButton &&
      (location.pathname !== frontendRoutes.signupFinish || isMobile),
    [showSupportButton, location.pathname, isMobile]
  );

  const backButtonHandler = () => {
    if (location.pathname === frontendRoutes.signupFinish) {
      setDefaultTheme();
      navigate('.', { state: null, replace: true });
    } else {
      changeRoute(navigate, location.pathname)
    }
  };

  const handleLink = (link: string): void => {
    window.open(link);
  };

  const showBackButton = !disabledArrowButtonLocations.includes(
    location.pathname
  );

  return (
    <Layout>
      <LicenseModalWindow />
      <Container
        sx={{
          minWidth: '100vw',
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container
          sx={{
            borderRadius: 5,
            boxShadow: [0, 3],
            margin: [1, 3],
            paddingX: [0, 3],
            paddingY: [1, 3],
            height: ['100dvh', '94dvh'],
            width: '648px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {showBackButton && (
            <IconButton
              style={{
                padding: 0,
                position: 'absolute',
                alignItems: 'flex-start',
              }}
              onClick={backButtonHandler}
            >
              <ArrowIcon />
            </IconButton>
          )}

          <Stack
            direction="column"
            justifyContent="space-between"
            sx={{
              flex: 1,
              ...(showBackButton && { mt: '3em' }),
            }}
          >
            <Stack spacing={2} alignItems="center" justifyContent="center">
              <Stack
                spacing={6}
                alignItems={'center'}
                justifyContent="start"
                flex={2}
                paddingX={{ xs: 0, sm: 1, md: 2 }}
                width="100%"
              >
                <Outlet />
              </Stack>
            </Stack>

            <Box
              sx={{
                mt: 'auto',
                width: '100%',
              }}
            >
              {showTermsAndConditions && (
                <Box textAlign="center" paddingTop={4} paddingBottom={2}>
                  <RfLink onClick={handleLicenseLink.bind(this, 'terms')}>
                    {t('common.button.terms_and_conditions')}
                  </RfLink>
                  <Typography variant="bodyLarge"> & </Typography>
                  <RfLink onClick={handleLicenseLink.bind(this, 'privacy')}>
                    {t('common.button.privacy_policy')}
                  </RfLink>
                </Box>
              )}
              {shouldShowLanguageAndSupport && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  paddingBottom={2}
                >
                  <LanguageSelect />
                  <Box maxWidth="55%" textAlign="center">
                    <RfLink
                      onClick={handleLink.bind(
                        this,
                        signUpPageMessages.supportURL
                      )}
                    >
                      {t('common.button.contact_support')}
                    </RfLink>
                  </Box>
                </Stack>
              )}
            </Box>
          </Stack>
        </Container>
      </Container>
    </Layout>
  );
};
