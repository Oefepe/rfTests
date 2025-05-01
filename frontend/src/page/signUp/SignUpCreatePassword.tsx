import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ValidationError } from 'joi';
import { Stack, Typography } from '@mui/material';
import { frontendRoutes } from '../../config';
import { validatePassword } from '../../utils';
import { SignupState } from './types';
import { UserActions } from '../../models/Logs';
import { logInfo, logUserAction } from '../../services';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components';
import { logErrorType } from '../../utils/errors/commonErrorLogging';
import { PasswordInput } from '../../components/Password';
export const SignUpCreatePassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const { t } = useTranslation();

  const { login, firstName } = useMemo(() => state as SignupState, [state]);

  const handleNext = () => {
    logUserAction({
      message: UserActions.button,
      context: {
        button: 'create-password',
        isEqual: password === confirmPassword,
      },
    });

    validatePassword(password, confirmPassword)
      .then(() => {
        navigate(frontendRoutes.signupAdditionalInfo, {
          state: { ...state, password },
        });
      })
      .catch((err) => {
        if (err instanceof ValidationError) {
          if (err.details[0].path[0] === 'password') {
            setPasswordError(t('common.notice.password_minimum'));
            setConfirmPasswordError('');
            logInfo({
              message: 'Password must be a minimum of 6 characters',
              context: { passwordLength: password.trim().length },
            });
          } else {
            setConfirmPasswordError(t('common.notice.password_do_not_match'));
            setPasswordError('');
            logInfo({
              message: 'The passwords entered do not match.',
              context: { login },
            });
          }
        } else {
          logErrorType(1, err, {
            validatePassword: password === confirmPassword,
          });
        }
      });
  };

  return (
    <>
      <Stack width="100%" spacing={1}>
        <Typography component="h2" variant="h2regular" textAlign="center" sx={{ color: 'primary.main' }} noWrap={true}>
          {t('login_signup.create_pwd.header_msg')} {firstName}!
        </Typography>
        <Typography variant="bodyLarge" textAlign="center">
          {t('login_signup.create_pwd.sub_header_msg')}
        </Typography>
        <Typography
          component="h3"
          variant="h3semiBold"
          textAlign="center"
          noWrap={true}
          display={'inline-block'}
          width={'100%'}
        >
          {login}
        </Typography>
      </Stack>
      <Typography
        component="h2"
        variant="h2regular"
        textAlign="center"
        sx={{ color: 'primary.main' }}
        noWrap={false}
        mt={-1}
      >
        {t('login_signup.create_password')}
      </Typography>
      <Stack width="100%" spacing={4}>
        <PasswordInput
          id="password"
          label={t('common.field_label.password')}
          value={password}
          error={!!passwordError}
          helperText={passwordError}
          onChange={setPassword}
        />
        <PasswordInput
          id="confirm-password"
          label={t('common.field_label.confirm_password')}
          value={confirmPassword}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
          onChange={setConfirmPassword}
        />
      </Stack>
      <Stack width="100%" spacing={1} sx={{ marginTop: '25px' }}>
        <Typography
          sx={{
            typography: 'bodySmall',
            color: 'text.secondary',
            textAlign: 'center',
            margin: 'auto',
          }}
        >
          {t('login_signup.remember_pwd_msg')}
        </Typography>
        <Button
          disabled={!password.trim() || !confirmPassword.trim()}
          text={t('common.button.next')}
          onClick={handleNext}
        />
      </Stack>
    </>
  );
};
