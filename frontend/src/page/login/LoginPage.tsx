import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Checkbox, Stack, Typography } from '@mui/material';
import { useAuth, useBranding } from '../../hooks';
import {
  frontendRoutes,
  ResponseCode,
  RevisionCode,
  SAVED_CREDENTIALS,
  ACCOUNT_TOKEN,
  SHOW_LINK_SENT_POPUP,
} from '../../config';
import apis from '../../repositories/api';
import { AuthErrorMessage, Logo, Button, InputField } from '../../components';
import { RFNGApiError, isEmail, trimObjectValues } from '../../utils';
import { UserActions } from '../../models/Logs';
import { logError, logInfo, logUserAction } from '../../services';
import { logErrorType } from '../../utils/errors/commonErrorLogging';
import SpinLoader from '../../components/UI/loader/SpinLoader';
import { decrypt, encrypt } from '../../utils/encryptionUtil';
import { ForgotPassword, Password } from '../../components/Password';
import ResetLinkSentDialog from '../../components/Password/PwdResetSentPopup';

export const LoginPage = () => {
  const { user, login } = useAuth();
  const {
    fetchThemeByGroup,
    brandingLoaded,
    setBrandingLoaded,
  } = useBranding();
  const { t } = useTranslation();
  const { groupCode, clientId } = useParams();
  const navigate = useNavigate();

  const [phoneEmail, setPhoneEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [password, setPassword] = useState('');
  const [showResetLinkSentMessage, setShowResetLinkSentMessage] =
    useState(false);

  const [isPasswordRemembered, setIsPasswordRemembered] = useState(true);

  useEffect(() => {
    const checkUserAndNavigate = async () => {
      if (user) {
        // User is already logged in, navigate to the welcome page or dashboard
        if (user.accounts && user.accounts.length > 0) {
          const token = user.accounts[0]?.token;
          localStorage.setItem(ACCOUNT_TOKEN, token);
          window.open(`${frontendRoutes.legacyDashboard}${token}`, '_self');
        }
      }
    };

    checkUserAndNavigate();
  }, [user, navigate]);

  useEffect(() => {
    if (groupCode) {
      fetchThemeByGroup(groupCode);
    } else {
      setBrandingLoaded(true);
    }
  }, [groupCode, clientId]);

  useEffect(() => {
    // If user previously signed in, pre-populate credentials
    const savedCredentials = localStorage.getItem(SAVED_CREDENTIALS);
    if (savedCredentials) {
      const { phoneEmail, password, isPasswordRemembered } =
        JSON.parse(savedCredentials);
      const decryptedPassword = isPasswordRemembered ? decrypt(password) : '';
      setPhoneEmail(phoneEmail);
      setPassword(decryptedPassword);
      setIsPasswordRemembered(isPasswordRemembered);
    }

    // Check for user existence and redirection without dependencies
    const checkUserAndRedirect = () => {
      const accountToken = localStorage.getItem(ACCOUNT_TOKEN);
      const showPopup = localStorage.getItem(SHOW_LINK_SENT_POPUP);
      if (showPopup) {
        setShowResetLinkSentMessage(true);
      }
      if (accountToken) {
        // Check if the user is already authenticated
        // User is authenticated, navigate to the dashboard
        window.open(
          `${frontendRoutes.legacyDashboard}${accountToken}`,
          '_self',
        );
      }
    };

    checkUserAndRedirect();
  }, []);

  const handleRememberPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsPasswordRemembered(event.target.checked);
  };

  const handleCloseMessage = () => {
    localStorage.removeItem(SHOW_LINK_SENT_POPUP);
    setShowResetLinkSentMessage(false);
  };

  const onResetPassword = () => {
    logUserAction({
      message: UserActions.button,
      context: { button: 'to-password-reset' },
    });
    navigate(frontendRoutes.resetPasswordRequest, {
      state: trimObjectValues({ email: phoneEmail }),
    });
  };

  const handleLoginEmailPhone = async () => {
    const loginByEmail = await isEmail(phoneEmail);
    const context: Record<string, unknown> = { loginByEmail, phoneEmail };

    // login with phone number temporarily blocked
    // No sense to send wrong email format to the server
    if (!loginByEmail) {
      logInfo({ message: 'Wrong email format', context });
      setLoginError(t('common.notice.invalid_email_msg'));
      return;
    }

    try {
      const { data } = await apis.loginByEmail({
        email: phoneEmail,
        password: password,
      });

      const { status, token, accounts, revision } = data;

      context.status = status;

      switch (status) {
        case ResponseCode.success:
        case ResponseCode.userExist:
          break;
        case ResponseCode.invalidCredentials:
        case ResponseCode.validationError:
          logInfo({
            message: 'Invalid credentials',
            context,
          });
          setLoginError(t('login_signup.notice.incorrect_email_pwd_msg'));
          return;
        case ResponseCode.restricted:
          logInfo({
            message: 'Access to the app restricted',
            context,
          });
          setLoginError('Access to the app restricted');
          return;
        case ResponseCode.networkError:
          setLoginError(t('common.notice.servers_unavailable'));
          return;
        default:
          throw new RFNGApiError(4002, status);
      }

      if (!token) {
        logError({ errorCode: 4002, message: 'No token', context });
        setLoginError(t('common.notice.default_error_msg'));
        return;
      }

      logUserAction({
        message: UserActions.button,
        context: { button: 'login-next', login: phoneEmail },
      });

      // Save user credentials upon successful login
      const credentials = isPasswordRemembered
        ? {
            phoneEmail,
            password: encrypt(password.trim()),
            isPasswordRemembered,
          }
        : { phoneEmail, isPasswordRemembered };
      localStorage.setItem(SAVED_CREDENTIALS, JSON.stringify(trimObjectValues(credentials)));
      // Check if there's only one account
      if (accounts?.length === 1) {
        // If there's only one account, call login with token and accountId
        const accountId = accounts[0]?.accountId;

        await login(token, accountId);
        return;
      }

      if (revision && revision === RevisionCode.pwdUnify) {
        navigate(frontendRoutes.updatePasswordMultiAccount, {
          state: { email: phoneEmail, token, accounts },
        });
        return;
      }

      navigate(frontendRoutes.accountSelection, {
        state: { accounts, token, phoneEmail },
      });
    } catch (err) {
      logErrorType(err, 4001, context);
      setLoginError(t('common.notice.default_error_msg'));
    }
  };

  if (!brandingLoaded) {
    return <SpinLoader />;
  }

  return (
    <>
      <ResetLinkSentDialog open={showResetLinkSentMessage} onClose={handleCloseMessage} />

      <Logo width='60%' />
      <Stack width='100%' gap={3}>
        <InputField
          id='signup-email-phone'
          label={t('common.field_label.email')}
          value={phoneEmail}
          error={!!loginError}
          onChange={(input) => setPhoneEmail(input.trim())}
        />
        <AuthErrorMessage message={loginError} visible={Boolean(loginError)} />
      </Stack>
      <Stack gap={-1} width='100%'>
        <Password password={password} onChange={setPassword} />
        <Stack direction='row' justifyContent='flex-start' alignItems='center'>
          <Checkbox
            checked={isPasswordRemembered}
            onChange={handleRememberPasswordChange}
            sx={{
              paddingLeft: '0px',
              '& .MuiSvgIcon-root': {
                fontSize: 'buttonRegular',
              },
            }}
          />
          <Typography variant='bodyLarge' sx={{ color: 'text.neutral700' }}>
            {t('login_signup.login_remember_pwd')}
          </Typography>
        </Stack>
      </Stack>
      <Stack flex={1} width='100%' gap={2}>
        <Button
          disabled={!phoneEmail.trim() || !password.trim()}
          text={t('login_signup.button.log_in')}
          onClick={handleLoginEmailPhone}
        />
        <ForgotPassword onResetPassword={onResetPassword} />
      </Stack>
    </>
  );
};
