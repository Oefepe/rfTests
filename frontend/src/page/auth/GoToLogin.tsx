import { useNavigate } from 'react-router-dom';
import { UserActions } from '../../models/Logs';
import { frontendRoutes } from '../../config';
import { Button, Stack, Typography } from '@mui/material';
import { logUserAction } from '../../services';
import { useTranslation } from 'react-i18next';

export const GoToLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = () => {
    logUserAction({
      message: UserActions.button,
      context: { button: 'to-login' },
    });
    navigate(frontendRoutes.login);
  };

  return (
    <Stack gap={2}>
      <Typography variant='bodyLarge'>{t(
        'login_signup.notice.user_already_exists')}</Typography>
      <Button variant='contained' onClick={handleLogin}>{t(
        'login_signup.login')}</Button>
    </Stack>
  );
};
