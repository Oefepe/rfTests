import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import { UserActions } from '../../models/Logs';
import { logInfo, logUserAction } from '../../services';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components';
import { ForgotPassword, Password } from '../../components/Password';
import { frontendRoutes, ResponseCode } from '../../config';
import { useTheme } from '@mui/material/styles';
import apis from '../../repositories/api';
import { RFNGApiError } from '../../utils';
import { defaultAccountName } from '../../styles/defaultTheme';

export const SignUpExistPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { email, groupCode } = state;
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const { t } = useTranslation();
  const theme = useTheme();

  const onResetPassword = () => {
    logUserAction({
      message: UserActions.button,
      context: { button: 'to-password-reset' },
    });

    navigate(frontendRoutes.resetPasswordRequest, {
      state: { email, groupCode },
    });
  };

  const passwordHandler = (value: string) => {
    setPassword(value);
    setLoginError('');
  };

  const handleNext = async () => {
    logUserAction({
      message: UserActions.button,
      context: { email, button: 'add-user-to-account' },
    });

    const { data } = await apis.loginByEmail({ email, password });
    const { status, token } = data;

    const {
      data: { accounts },
    } = await apis.addAccount(token ?? '', { groupCode });

    switch (status) {
      case ResponseCode.success:
      case ResponseCode.userExist:
        navigate(frontendRoutes.signupFinish, {
          state: {
            token,
            addAccount: true,
            login: email,
            groupCode,
            dataName: 'groupCode',
            dataTitle: t('common.field_label.group_code'),
            loginError,
            accounts,
          },
        });
        break;
      case ResponseCode.invalidCredentials:
        logInfo({
          message: 'Invalid credentials',
          context: { email },
        });
        setLoginError(t('login_signup.notice.incorrect_email_pwd_msg'));
        break;
      case ResponseCode.restricted:
        logInfo({
          message: 'Access to the app restricted',
          context: { email },
        });
        setLoginError('Access to the app restricted');
        break;
      case ResponseCode.networkError:
        setLoginError(t('common.notice.servers_unavailable'));
        break;
      default:
        throw new RFNGApiError(4002, status);
    }
  };

  return (
    <>
      <Stack width='100%' spacing={2}>
        <Typography variant='bodyLarge' textAlign='center'>
          {t('login_signup.found_existing_account.header_msg')}
        </Typography>
        <Typography component='h3' variant='h3regular' textAlign='center'
                    noWrap={true}>
          {email}
        </Typography>
      </Stack>
      <Stack width='100%' spacing={3} marginY={3}>
        <Typography component='h2' variant='h2semiBold' textAlign='center'
                    color='primary.main'>
          {t('login_signup.enter_password')}
        </Typography>
        <Password
          password={password}
          onChange={passwordHandler}
          loginError={loginError}
        />
      </Stack>
      {
        theme.extra.name !== defaultAccountName &&
        <Stack width='100%' spacing={2}>
          <Typography variant='bodyLarge' textAlign='center'>
            {t('login_signup.found_existing_account.create_user_in_account')}
          </Typography>
          <Typography component='h3' variant='h3regular' textAlign='center'>
            {theme.extra.name}
          </Typography>
        </Stack>
      }
      <Stack width='100%' spacing={2}>
        <Button
          disabled={!password.trim()}
          text={t('common.button.next')}
          onClick={handleNext}
        />
        <ForgotPassword onResetPassword={onResetPassword} />
      </Stack>
    </>
  );
};
