import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ValidationError } from 'joi';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { frontendRoutes, ResponseCode, SAVED_CREDENTIALS, SHOW_LINK_SENT_POPUP } from '../../config';
import apis from '../../repositories/api';
import { logUserAction } from '../../services';
import { UserActions } from '../../models/Logs';
import { validatePassword } from '../../utils';
import { AuthErrorMessage, Button } from '../../components';
import { logErrorType } from '../../utils/errors/commonErrorLogging';
import { extractEmailFromToken } from '../../utils/encryptionUtil';
import { PasswordInput } from '../../components/Password';

export const ResetPasswordWithToken = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const [token, setToken] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    if (searchParams.has('token')) {
      const token = decodeURIComponent(searchParams.get('token') as string);
      setToken(token);

      const email = extractEmailFromToken(token);
      if (email) {
        localStorage.setItem(
          SAVED_CREDENTIALS,
          JSON.stringify({
            phoneEmail: email,
            password: '',
          })
        );
      }
    }
  }, [searchParams]);

  const onChangePassword = async () => {
    logUserAction({
      message: UserActions.button,
      context: {
        button: 'change-password-confirm',
        isEqual: password === confirmPassword,
      },
    });

    try {
      const validPassword = await validatePassword(password, confirmPassword);
      if (validPassword && token) {
        const {
          data: { status },
        } = await apis.resetPasswordWithToken({
          token,
          password,
        });
        switch (status) {
          case ResponseCode.success:
            localStorage.removeItem(SHOW_LINK_SENT_POPUP);
            navigate(frontendRoutes.login);
            break;
          case ResponseCode.error:
            setErrorMessage(t('login_signup.reset_password.invalid_code'));
            break;
          case ResponseCode.networkError:
            setErrorMessage(t('common.notice.servers_unavailable'));
            return;
          default:
            setErrorMessage(t('common.notice.default_error_msg'));
        }
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        if (error.details[0].path[0] === 'password') {
          setPasswordError(t('common.notice.password_minimum'));
          setConfirmPasswordError('');
        } else {
          setConfirmPasswordError(t('common.notice.password_do_not_match'));
          setPasswordError('');
        }
      } else {
        setErrorMessage(t('common.notice.default_error_msg'));
        logErrorType(error, 2015, {
          button: 'change-password',
        });
      }
    }
  };

  return (
    <>
      <Stack width="100%" spacing={5} textAlign={'center'}>
        <Typography
          component="h3"
          variant={'h3semiBold'}
          sx={{
            color: 'text.primary',
            paddingTop: isMobile ? '50% !important' : '25% !important',
          }}
        >
          {t('login_signup.reset_password.set_new_password')}
        </Typography>
        <Box display="flex" justifyContent="center" width="100%">
          <Stack width="90%" gap={5}>
            <PasswordInput
              label={t('common.field_label.new_password')}
              value={password || ''}
              error={!!passwordError}
              helperText={passwordError}
              onChange={setPassword}
            />
            <PasswordInput
              label={t('common.field_label.confirm_password')}
              value={confirmPassword || ''}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              onChange={setConfirmPassword}
            />

            <AuthErrorMessage
              message={errorMessage}
              visible={Boolean(errorMessage)}
            />
          </Stack>
        </Box>
        <Box display="flex" justifyContent="center" pt={2}>
          <Box width="80%">
            <Button
              text={t('login_signup.button.set_password')}
              onClick={onChangePassword}
            />
          </Box>
        </Box>
      </Stack>
    </>
  );
};
