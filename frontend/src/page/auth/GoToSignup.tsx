import { useNavigate } from 'react-router-dom';
import { UserActions } from '../../models/Logs';
import { frontendRoutes } from '../../config';
import { Button, Stack, Typography } from '@mui/material';
import { logUserAction } from '../../services';
import { useTranslation } from 'react-i18next';

export const GoToSignup = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignUp = () => {
    logUserAction({
      message: UserActions.button,
      context: { button: 'to-signup' },
    });
    navigate(frontendRoutes.signup);
  };

  return (
    <Stack gap={2}>
      <Typography variant='bodyLarge'>{t(
        'login_signup.no_account_found.header_msg')}</Typography>
      <Button variant='contained' onClick={handleSignUp}>{t(
        'login_signup.button.create_account')}</Button>
    </Stack>
  );
};
