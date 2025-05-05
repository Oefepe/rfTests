import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo, Button, HorizontalLinedText } from '../../components';
import { frontendRoutes } from '../../config';

export const WelcomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigation = (route: string): void => {
    navigate(route);
  };

  return (
    <>
      <Stack direction="row" justifyContent="center">
        <Logo width="80%" />
      </Stack>
      <Stack width="100%" paddingTop={{ md: 8 }}>
        <Button
          variant="contained"
          onClick={() => handleNavigation(frontendRoutes.login)}
          text={t('login_signup.button.log_in')}
        />
      </Stack>
      <HorizontalLinedText variant="bodyLarge">{t('login_signup.or_divider')}</HorizontalLinedText>
      <Stack width="100%">
        <Button
          variant="outlined"
          onClick={() => handleNavigation(frontendRoutes.signup)}
          text={t('login_signup.button.create_account')}
        />
      </Stack>
    </>
  );
};
