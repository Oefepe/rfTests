import { useEffect, useState } from 'react';
import { useBlocker, useNavigate } from 'react-router-dom';
import { SignupState } from '../types';
import apis, { ISignupRequest } from '../../../repositories/api';
import { logError, logUserAction } from '../../../services';
import { UserActions } from '../../../models/Logs';
import { logErrorType } from '../../../utils/errors/commonErrorLogging';
import {
  COOKIE_GROUP_ID,
  COOKIE_VALID_GROUP_ID,
  frontendRoutes,
  ResponseCode,
  SAVED_CREDENTIALS,
} from '../../../config';
import { ErrorType, RFNGApiError, RFNGError } from '../../../utils';
import { useTranslation } from 'react-i18next';
import { encrypt } from '../../../utils/encryptionUtil';
import { useCookies } from 'react-cookie';

export const useCreateAccount = (userData: SignupState) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [cookie] = useCookies([COOKIE_VALID_GROUP_ID, COOKIE_GROUP_ID]);
  const [confirm, setConfirm] = useState(false);

  const { proceed, reset } = useBlocker(false);

  useEffect(() => {
    if (!proceed || !reset) return;
    if (confirm) {
      proceed();
    } else {
      reset();
    }
  }, [confirm]);

  const createLocalUser = async () => {
    const context: Record<string, unknown> = { ...userData };
    try {
      if (
        !userData.login ||
        !userData.password ||
        !userData.firstName ||
        !userData.lastName
      ) {
        throw new RFNGError(
          3010,
          'Required signup data missing',
          context,
        );
      }

      const body: ISignupRequest = {
        login: userData.login,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        clientId: userData.clientId,
        groupCode: userData.groupCode,
        token: userData.token,
        additionalData: userData.additionalData,
      };

      const {
        data: { status, token, accounts },
      } = await apis.signupByEmail(body);

      if (status === ResponseCode.networkError) {
        setError(t('common.notice.servers_unavailable'));
        return;
      }

      if (status === ResponseCode.userExist) {
        setError(t('login_signup.notice.user_already_exists'));
        return;
      }

      if (status !== ResponseCode.success) {
        throw new RFNGApiError(
          3010,
          status,
          'Signup by email failed',
          ErrorType.Warning,
          context,
        );
      }
      context.status = status;
      if (!token) {
        logError({
          errorCode: 4010,
          message: 'No token',
          context,
        });
        return;
      }
      logUserAction({
        message: UserActions.button,
        context: {
          button: 'user-details',
          ...userData,
        },
      });
      setConfirm(false); // unblock navigation
      // Save user credentials after user signs up and logs in
      if (userData.password) {
        localStorage.setItem(
          SAVED_CREDENTIALS,
          JSON.stringify({
            phoneEmail: userData.login,
            password: encrypt(userData.password),
            isPasswordRemembered: true,
          }),
        );
      }
      navigate(frontendRoutes.signupFinish, {
        state: { ...userData, accounts, token },
      });
    } catch (err) {
      logErrorType(err, 4011, context);
      setError(t('common.notice.default_error_msg'));
    }
  };

  const createSsoUser = async () => {
    const context: Record<string, unknown> = { ...userData };
    try {
      const groupCode = userData?.groupCode ?? cookie[COOKIE_GROUP_ID];
      if (userData?.firstName && userData?.email && groupCode) {
        const { data } = await apis.finishSsoSignup({
          firstName: userData.firstName,
          lastName: userData.lastName,
          groupCode: groupCode,
          email: userData.email,
          id: userData.id,
        });

        if (data.status === ResponseCode.networkError) {
          setError(t('common.notice.servers_unavailable'));
          return;
        }

        if (data.status === ResponseCode.success) {
          const { accounts, token } = data;
          setConfirm(false); // unblock navigation
          navigate(frontendRoutes.signupFinish, {
            state: { ...userData, accounts, token },
          });
        }
        throw new RFNGApiError(
          3010,
          data?.status,
          'Signup by social media failed',
          ErrorType.Warning,
          context,
        );
      }
    } catch (err) {
      logErrorType(err, 4011, context);
      setError(t('common.notice.default_error_msg'));
    }
  };

  const handleCreateAccount = async () => {
    setConfirm(true);
    if (userData.login) {
      await createLocalUser();
    } else {
      await createSsoUser();
    }
    setConfirm(false);
  };

  return { handleCreateAccount, error, confirm };
};
