import { useMemo, useState } from 'react';
import { Link, useBlocker, useLocation } from 'react-router-dom';
import { isBrowser, isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { PlatformModal } from './components/PlatformModal';
import { AppLinkModal } from './components/AppLinkModal';
import { frontendRoutes } from '../../config';
import { SignupState } from './types';
import apis from '../../repositories/api';
import { AppleIcon, AppStoreQRCodeIcon, GooglePlayQRCodeIcon, SendToPhoneIcon, AndroidIcon } from '../../assets/icons';

export const SignUpFinish = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [platform, setPlatform] = useState<'Android' | 'iOS' | null>(null);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isIOSModalOpen, setIsIOSModalOpen] = useState(false);
  const [isAppLinkModalOpen, setIsAppLinkModalOpen] = useState(false);

  const { state } = useLocation();
  const { t } = useTranslation();
  const { login } = useMemo(() => state as SignupState, [state]);
  const theme = useTheme();

  useBlocker(({ nextLocation: { pathname } }) => {
    // block navigation to the summary page after signup
    return pathname === frontendRoutes.signupSummary;
  });

  const firstAccountToken = state.accounts[0].token;

  // Redirect to legacy dashboard
  const redirectPath =
    state.accounts.length > 1
      ? frontendRoutes.accountSelection
      : `${frontendRoutes.legacyDashboard}${firstAccountToken}`;

  const handleModalAndroid = () => {
    setIsAndroidModalOpen(!isAndroidModalOpen);
    if (isAndroidModalOpen) {
      setPlatform(null);
    }
  };

  const handleModalIOS = () => {
    setIsIOSModalOpen(!isIOSModalOpen);
    if (isIOSModalOpen) {
      setPlatform(null);
    }
  };

  const handleModalAppLink = () => {
    setIsAppLinkModalOpen(!isAppLinkModalOpen);
    if (isAppLinkModalOpen) {
      setPlatform(null);
      setPhoneNumber('');
    }
  };

  const handlePhoneNumber = (number: string) => {
    setPhoneNumber(number);
  };

  const handleSelectPlatform = (platform: 'Android' | 'iOS') => {
    setPlatform(platform);
  };

  const handleSubmit = async () => {
    const {
      data: { status },
    } = await apis.sendSMSToUser({
      accountId: Number(state.accounts[0].accountId),
      receiverPhoneNumber: phoneNumber,
      messageToSend: `${t('login_signup.send_app_modal.header')}: ${
        platform === 'Android' ? theme.extra.googlePlayUrl : theme.extra.appStoreUrl
      }`,
    });

    return status;
  };

  return (
    <Stack width={'100%'} alignItems="center" justifyContent="space-between">
      {isBrowser && (
        <>
          <Stack width={'100%'} alignItems="center" gap="-1rem">
            <Typography align="center" component="h3" variant="h3regular" color={'primary.main'}>
              {t('login_signup.post_signup.header')}
            </Typography>
            <Typography align="center" component="h3" variant="h3regular" color={'primary.main'}>
              {t('login_signup.post_signup.account_ready_msg')}
            </Typography>
          </Stack>
          <Stack width={'100%'} alignItems="center" mt={'32px'}>
            <img src={theme.extra.appIconImage} width="112px" alt="Rapid Funnel Logo" />
            <Typography variant="h2semiBold" align="center" color={'primary.main'} mt={'32px'}>
              {t('login_signup.post_signup.for_best_experience_msg')}
            </Typography>
            <Typography align="center" component="h3" variant="h3regular" mt={'32px'}>
              {t('login_signup.post_signup.get_the_mobile_app')}
            </Typography>
          </Stack>
          <Stack
            flexDirection="row"
            alignItems="center"
            mt="24px"
            paddingBottom="40px"
            borderBottom="1px solid"
            borderColor="text.neutral300"
          >
            <Box
              borderRight="1px solid"
              borderColor="text.neutral300"
              paddingRight="32px"
              onClick={handleModalAndroid}
              sx={{ cursor: 'pointer' }}
            >
              <GooglePlayQRCodeIcon />
            </Box>
            <PlatformModal
              isModalOpen={isAndroidModalOpen}
              onClose={handleModalAndroid}
              platform="Android"
              url={String(theme.extra.googlePlayUrl)}
              icon={<AndroidIcon />}
            />
            <Box
              borderRight="1px solid"
              borderColor="text.neutral300"
              paddingX="32px"
              sx={{ cursor: 'pointer' }}
              onClick={handleModalIOS}
            >
              <AppStoreQRCodeIcon />
            </Box>
            <PlatformModal
              isModalOpen={isIOSModalOpen}
              onClose={handleModalIOS}
              platform="iOS"
              url={String(theme.extra.appStoreUrl)}
              icon={<AppleIcon />}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleModalAppLink}>
              <Box paddingLeft="32px" paddingRight="20px">
                <SendToPhoneIcon />
              </Box>
              <Typography variant="bodyLarge" color="tertiary.main">
                {t('login_signup.post_signup.send_me_the_link')}
              </Typography>
            </Box>
            <AppLinkModal
              isModalOpen={isAppLinkModalOpen}
              onClose={handleModalAppLink}
              onSelectPlatform={handleSelectPlatform}
              onChangePhoneNumber={handlePhoneNumber}
              onSubmit={handleSubmit}
              platform={platform}
              phoneNumber={phoneNumber}
            />
          </Stack>
          <Stack width={'100%'} paddingTop="40px">
            <Typography variant="bodySmall" align="center" color={'text.primary'}>
              {t('login_signup.post_signup.remember_to_login_with')}
            </Typography>
            <Typography variant="bodyLarge" align="center" color={'text.primary'} mt="8px">
              {login}
            </Typography>
          </Stack>
          <Link
            target="_self"
            to={redirectPath}
            state={state}
            style={{ textDecoration: 'none', position: 'absolute', bottom: '16px' }}
          >
            <Typography
              sx={{
                color: theme.palette.tertiary.main,
                typography: 'bodySmall',
                '&:hover': {
                  color: theme.palette.tertiary.light,
                  transition: 'color 0.3s ease',
                },
              }}
            >
              {t('login_signup.post_signup.login_with_browser')}
            </Typography>
          </Link>
        </>
      )}

      {isMobile && (
        <>
          <Stack width={'100%'} alignItems="center" gap="-1rem" mt={10}>
            <Typography align="center" component="h2" variant="h2regular" color={'primary.main'}>
              {t('login_signup.post_signup.header')}
            </Typography>
            <Typography align="center" component="h2" variant="h2regular" color={'primary.main'}>
              {t('login_signup.post_signup.account_ready_msg')}
            </Typography>
          </Stack>
          <Stack width={'100%'} alignItems="center">
            <Stack justifyContent="center" width="96px" height="96px" mt={'48px'}>
              <img src={theme.extra.appIconImage} alt="Rapid Funnel Logo" />
            </Stack>
            <Typography align="center" component="h2" variant="h2regular" color={'primary.main'} mt={'48px'}>
              {t('login_signup.post_signup.for_best_experience_msg')}
            </Typography>
            <Typography variant="h2semiBold" component="h2" align="center" mt={'48px'}>
              {t('login_signup.post_signup.get_the_mobile_app')}
            </Typography>
          </Stack>
          <Stack flexDirection="row" justifyContent="space-between" mt="20px" gap="20px">
            <a href={theme.extra.appStoreUrl} style={{ display: 'block', width: 'calc(50% - 10px)' }}>
              <img src="/images/rf_logo/app-store-logo.png" style={{ width: '100%' }} alt="App Store Logo" />
            </a>
            <a href={theme.extra.googlePlayUrl} style={{ display: 'block', width: 'calc(50% - 10px)' }}>
              <img src="/images/rf_logo/google-play-logo.png" style={{ width: '100%' }} alt="Google Play Logo" />
            </a>
          </Stack>
        </>
      )}
    </Stack>
  );
};
