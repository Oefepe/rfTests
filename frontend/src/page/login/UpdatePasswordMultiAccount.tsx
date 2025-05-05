import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { isEmail, validatePassword } from '../../utils';
import { useLocation, useNavigate } from 'react-router-dom';
import apis from '../../repositories/api';
import { frontendRoutes, ResponseCode, RevisionCode } from '../../config';
import { logUserAction } from '../../services';
import { UserActions } from '../../models/Logs';
import { AuthErrorMessage, Button } from '../../components';
import { ValidationError } from 'joi';
import { Account } from '../../models/IUser';
import { PasswordInput } from '../../components/Password';

export const UpdatePasswordMultiAccount = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const [email, setEmail] = useState<string>(state?.email);
  const [token, setToken] = useState<string>(state?.token);
  const [accounts, setAccounts] = useState<Account[]>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const email = state?.email;
    const token = state?.token;
    const accounts = state?.accounts;
    setToken(token);
    setEmail(email);
    setAccounts(accounts);
    if (email?.trim()) {
      isEmail(email).then((res) => {
        setErrorMessage(res ? '' : t('common.notice.invalid_email_msg'));
      });
    }
  }, [email, accounts, token]);

  const onSendRequest = async () => {
    logUserAction({
      message: UserActions.button,
      context: {
        button: 'update-password-request',
        email,
      },
    });

    const body = {
      email,
      password,
    };

    try {
      await validatePassword(password, confirmPassword);

      // If validation is successful, call the API to update the password
      const response = await apis.updatePassword(token, body);

      if (response.data.status === ResponseCode.success) {
        await apis.updateRevision(token, {
          revision: RevisionCode.default,
        });
        navigate(frontendRoutes.accountSelection, {
          state: { token, email, accounts },
        });
      } else if (response.data.status === ResponseCode.networkError) {
        setErrorMessage(t('common.notice.servers_unavailable'));
        return;
      } else {
        setErrorMessage(t('login_signup.notice.incorrect_email_pwd_msg'));
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        if (err.details[0].path[0] === 'password') {
          setPasswordError(t('common.notice.password_minimum'));
          setConfirmPasswordError('');
        } else {
          setConfirmPasswordError(t('common.notice.password_do_not_match'));
          setPasswordError('');
        }
      }
    }
  };

  return (
    <>
      <Typography
        component='h3'
        variant='h3regular'
        textAlign='center'
        sx={{ color: 'primary.main' }}
      >
        {t('login_signup.update_pwd.header_msg')}
      </Typography>
      <Typography variant='bodyLarge' textAlign='center'>
        {t('login_signup.update_pwd.multi_acct_msg')}
      </Typography>
      <Typography
        variant='caption'
        textAlign='center'
        style={{ fontWeight: 'bold', margin: '5px' }}
      >
        {email}
      </Typography>
      <Typography variant='bodyLarge' textAlign='center'
                  style={{ margin: '5px' }}>
        {t('login_signup.update_pwd.improve_exp_msg')}
      </Typography>
      <Typography
        variant='bodySmall'
        textAlign='center'
        sx={{ color: 'primary.main', marginTop: '-30px' }}
      >
        {t('login_signup.create_password')}
      </Typography>
      <Stack width='100%' spacing={1}>
        <PasswordInput
          label={t('common.field_label.password')}
          helperText={passwordError}
          error={!!passwordError}
          value={password}
          onChange={setPassword}
        />
        <PasswordInput
          label={t('common.field_label.confirm_password')}
          helperText={confirmPasswordError}
          error={!!confirmPasswordError}
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
      </Stack>
      <AuthErrorMessage
        message={errorMessage}
        visible={Boolean(errorMessage)}
      />
      <Typography variant='bodyLarge'>
        {t('login_signup.remember_pwd_msg')}
      </Typography>
      <Stack flex={1} width='100%' gap={2}>
        <Button
          disabled={!email || Boolean(errorMessage)}
          text={t('common.button.next')}
          onClick={onSendRequest}
        />
      </Stack>
    </>
  );
};
