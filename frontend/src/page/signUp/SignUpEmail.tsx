import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import { isEmail, RFNGApiError, trimObjectValues } from '../../utils';
import { frontendRoutes, ResponseCode } from '../../config';
import apis from '../../repositories/api';
import { SignupState } from './types';
import { logErrorType } from '../../utils/errors/commonErrorLogging';
import { Logo, Button, InputField, SpinLoader } from '../../components';
import { logInfo } from '../../services';
import { useGroupCodeValidity } from './hooks/useGroupCodeValidity';

export const SignUpEmail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const state = location.state as SignupState;
  const { checkGroupCode } = useGroupCodeValidity(state);
  const { groupCode } = state;
  const [login, setLogin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignupEmailPhone = async () => {
    setLoading(true);

    const localLoginCheck = await isEmail(login);

    if (!localLoginCheck) {
      setLoginError(t('common.notice.invalid_email_msg'));
      setLoading(false);
      return;
    }

    const apiLoginCheck = apis.checkEmail({ email: login });

    apiLoginCheck
      .then(async ({ data: { status } }) => {
        if (status === ResponseCode.success) {
          const newState: SignupState = {
            ...state,
            login,
          };
          if (await isEmail(login)) {
            newState.email = login;
          }
          navigate(frontendRoutes.signupName, { state: newState });
        } else if (status === ResponseCode.userExist && groupCode) {
          const isUserInThisGroup = await checkGroupCode(String(groupCode), login.trim());

          if (isUserInThisGroup) {
            navigate(frontendRoutes.signupExistPassword, {
              state: trimObjectValues({ email: login, groupCode }),
            });
          } else {
            setLoginError(t('user_settings.settings.group_codes.existing_group_msg'));
          }
        } else if (status === ResponseCode.networkError) {
          setLoginError(t('common.notice.servers_unavailable'));
          return;
        } else if (status === ResponseCode.invalidEmail) {
          setLoginError(t('common.notice.invalid_email_msg'));
          logInfo({
            message: 'Email validation failed',
            context: {
              status: ResponseCode.invalidEmail,
              email: login,
            },
          });
          return;
        } else {
          throw new RFNGApiError(3000, status);
        }
      })
      .catch((error) => {
        const context = { login, status: error?.status };

        logErrorType(error, 4006, context);
        setLoginError(t('common.notice.default_error_msg'));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <SpinLoader />;
  }

  return (
    <>
      <Logo width="60%" />
      <Typography component="h2" variant="h2regular" textAlign="center" sx={{ color: 'primary.light' }}>
        {t('login_signup.enter_email.header_msg')}
      </Typography>
      <Stack width="100%">
        <InputField
          id="signup-email-phone"
          label={t('common.field_label.email')}
          value={login}
          onChange={setLogin}
          error={!!loginError}
          helperText={loginError}
        />
      </Stack>
      <Stack flex={1} width="100%" gap={2}>
        <Button disabled={!login.trim()} text={t('common.button.next')} onClick={handleSignupEmailPhone} />
      </Stack>
    </>
  );
};
